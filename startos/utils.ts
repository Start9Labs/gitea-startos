import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { sdk } from './sdk'

export const uiPort = 3000

export const httpInterfaceId = 'http'

export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: '/data',
  readonly: false,
})

export async function getHttpInterfaceUrls(
  effects: Effects,
): Promise<string[]> {
  const httpInterface = await sdk.serviceInterface
    .getOwn(effects, httpInterfaceId)
    .const()

  return httpInterface?.addressInfo?.urls || []
}
