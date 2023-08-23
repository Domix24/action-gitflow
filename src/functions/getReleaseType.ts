import {getInputs} from './getInputs'

const {hotfixPrefix: hPrefix, releasePrefix: rPrefix} = getInputs()

export type AllowedTypes = 'release' | 'hotfix'
export type GetRelaseTypeReturn = ReleaseTypeReturns | undefined

export interface ReleaseTypeReturns {
  type: AllowedTypes
  version: string
}

export const getReleaseType: (
  headRef: string
) => GetRelaseTypeReturn = headRef => {
  if (headRef.startsWith(rPrefix))
    return {type: 'release', version: headRef.substring(rPrefix.length)}
  else if (headRef.startsWith(hPrefix))
    return {type: 'hotfix', version: headRef.substring(hPrefix.length)}
  return undefined
}
