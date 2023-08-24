import * as core from '@actions/core'

export interface InputReturns {
  devBranch: string
  mainBranch: string
  githubToken: string
  releasePrefix: string
  hotfixPrefix: string
}

export const getInputs: () => InputReturns = () => ({
  devBranch: core.getInput('dev_branch', {required: true}),
  mainBranch: core.getInput('main_branch', {required: true}),
  githubToken: core.getInput('github_token', {required: true}),
  releasePrefix: core.getInput('release_prefix'),
  hotfixPrefix: core.getInput('hotfix_prefix')
})
