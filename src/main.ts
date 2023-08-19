import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const devBranch = core.getInput('dev_branch')
    const mainBranch = core.getInput('main_branch')

    const pullRequestPayload = github.context.payload.pull_request
    if (!pullRequestPayload) return

    pullRequestPayload.number

    console.log(github.context) // eslint-disable-line no-console
    console.log(pullRequestPayload) // eslint-disable-line no-console
    console.log(devBranch, mainBranch) // eslint-disable-line no-console
    core.setFailed(new Error('an error'))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
