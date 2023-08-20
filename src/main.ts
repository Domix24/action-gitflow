import * as core from '@actions/core'
import * as github from '@actions/github'

async function getReleaseType(
  headRef: string
): Promise<{type: 'release' | 'hotfix'; version: string} | undefined> {
  if (headRef.startsWith('release'))
    return {type: 'release', version: headRef.substring('release/'.length)}
  else if (headRef.startsWith('hotfix'))
    return {type: 'hotfix', version: headRef.substring('hotfix/'.length)}
  return undefined
}

async function run(): Promise<void> {
  try {
    const devBranch = core.getInput('dev_branch')
    const mainBranch = core.getInput('main_branch')
    const githubToken = core.getInput('github_token')

    if (!githubToken) throw new Error(`No Token specified.`)

    const octokit = github.getOctokit(githubToken)

    const pullRequestPayload = github.context.payload.pull_request
    if (!pullRequestPayload) {
      core.info(`Not a PR.`)
      return
    }
    if (!pullRequestPayload.merged) {
      core.info(`PR is not merged.`)
      return
    }

    const pullNumber = pullRequestPayload.number
    if (!pullNumber) {
      core.info(`PR doesnt have a number (${pullNumber}).`)
      return
    }

    const {data: pullData} = await octokit.rest.pulls.get({
      owner: github.context.repo.owner,
      pull_number: pullNumber,
      repo: github.context.repo.repo
    })

    const releaseType = await getReleaseType(pullData.head.ref)
    if (!releaseType) {
      core.info(`Not a valid RT.`)
      return
    }

    try {
      core.info('Auto-Merging...')
      await octokit.rest.repos.merge({
        base: devBranch,
        head: pullData.head.ref,
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        commit_message: `Merge ${pullData.head.ref} into ${devBranch}`
      })
      core.info('Auto-Merging successful.')
    } catch (error) {
      core.info('Error while Auto-Merging.')

      const {data: autoMergeData} = await octokit.rest.pulls.create({
        base: devBranch,
        head: pullData.head.ref,
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        title: `Auto-Merge ${pullData.head.ref} into ${devBranch}`
      })
      core.info(
        `PR #${autoMergeData.number} created to merge ${autoMergeData.head.ref} into ${devBranch}`
      )
      core.notice(`Look PR #${autoMergeData.number}`)
    }

    const {data: latestRelease} = await octokit.rest.repos
      .getLatestRelease({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo
      })
      .catch(() => ({data: null})) // eslint-disable-line github/no-then

    const {data: relNotes} = await octokit.rest.repos.generateReleaseNotes({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      tag_name: `v${releaseType.version}`,
      previous_tag_name: latestRelease?.tag_name,
      target_commitish: mainBranch
    })
    core.info('Release Notes generated.')

    const {data: release} = await octokit.rest.repos.createRelease({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      tag_name: `v${releaseType.version}`,
      name: `v${releaseType.version}`,
      body: relNotes.body,
      target_commitish: mainBranch
    })
    core.info(`Release ${release.tag_name} created.`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
