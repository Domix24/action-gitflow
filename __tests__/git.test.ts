let mockInputs: {[key: string]: string} = {
  dev_branch: 'develop',
  main_branch: 'main',
  github_token: '-',
  release_prefix: 'release/',
  hotfix_prefix: 'hotfix/'
}

jest.mock('@actions/core', () => ({
  getInput: (x: string): string => mockInputs[x]
}))

import * as CORE from '@actions/core'
import {getInputs} from '../src/functions/getInputs'
import {getReleaseType} from '../src/functions/getReleaseType'

describe('not my first block', () => {
  test('normal test', () => {
    expect(CORE.getInput('github_token')).toBe('-')
  })
  test('test getinputs', () => {
    const saveMe = getInputs()
    expect(saveMe.devBranch).toBe('develop')
    expect(saveMe.mainBranch).toBe('main')
    expect(saveMe.githubToken).toBe('-')
    expect(saveMe.releasePrefix).toBe('release/')
    expect(saveMe.hotfixPrefix).toBe('hotfix/')
  })
  describe('test getreleasetype', () => {
    test('undefined', () => {
      expect(getReleaseType('message')).toBeUndefined()
      expect(getReleaseType('hotfix')).toBeUndefined()
      expect(getReleaseType('hotfix-')).toBeUndefined()
    })

    test('parsing release/1.0.0', () => {
      let drink = jest.fn(() => getReleaseType('release/1.0.0'))
      drink()
      expect(drink).toReturnWith({
        type: 'release',
        version: '1.0.0'
      })
    })

    test('parsing hotfix/1.0.0', () => {
      let drink = jest.fn(() => getReleaseType('hotfix/1.0.0'))
      drink()
      expect(drink).toReturnWith({
        type: 'hotfix',
        version: '1.0.0'
      })
    })

    test('parsing hotfix/', () => {
      let drink = jest.fn(() => getReleaseType('hotfix/'))
      drink()
      expect(drink).toReturnWith({
        type: 'hotfix',
        version: ''
      })
    })
  })
})
