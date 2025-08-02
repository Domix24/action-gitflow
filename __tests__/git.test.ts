const mockInputs: {[key: string]: string} = {
  dev_branch: 'develop',
  main_branch: 'main',
  github_token: '-',
  release_prefix: 'release/',
  hotfix_prefix: 'hotfix/'
}

jest.unstable_mockModule('@actions/core', () => ({
  getInput: (x: string): string => mockInputs[x]
}))

import {jest} from '@jest/globals'
const {getInputs} = await import('../src/functions/getInputs')
const CORE = await import('@actions/core')
const {getReleaseType} = await import('../src/functions/getReleaseType')

describe('not my first block', () => {
  test('normal test', () => {
    expect(CORE.getInput('github_token')).toBe('-')
  })
  test('getinputs', () => {
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
      const drink = jest.fn(() => getReleaseType('release/1.0.0'))
      drink()
      expect(drink).toHaveReturnedWith({
        type: 'release',
        version: '1.0.0'
      })
    })

    test('parsing hotfix/1.0.0', () => {
      const drink = jest.fn(() => getReleaseType('hotfix/1.0.0'))
      drink()
      expect(drink).toHaveReturnedWith({
        type: 'hotfix',
        version: '1.0.0'
      })
    })

    test('parsing hotfix/', () => {
      const drink = jest.fn(() => getReleaseType('hotfix/'))
      drink()
      expect(drink).toHaveReturnedWith({
        type: 'hotfix',
        version: ''
      })
    })
  })
})
