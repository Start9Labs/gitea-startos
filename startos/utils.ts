import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { sdk } from './sdk'
import { utils } from '@start9labs/start-sdk'

export const uiPort = 3000

export const httpInterfaceId = 'http'

export function getSecretKey() {
  return utils.getDefaultString({
    charset: 'A-Z,a-z,0-9,+,/',
    len: 32,
  })
}

export function getPassword() {
  return utils.getDefaultString({
    charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
    len: 22,
  })
}

export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: '/data',
  readonly: false,
})

export async function getHttpInterfaceUrls(
  effects: Effects,
): Promise<string[]> {
  // @TODO use map fn when available
  const httpInterface = await sdk.serviceInterface
    .getOwn(effects, httpInterfaceId)
    .const()

  return httpInterface?.addressInfo?.nonLocal.format() || []
}
