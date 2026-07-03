import { T, utils } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export const uiPort = 3000

// Host id (the `sdk.MultiHost.of` group) carrying both the http and ssh
// interfaces — distinct from the interface ids exported on it. Used for
// `sdk.host.getOwn` lookups here and by dependents (gitea-runner) reading
// gitea's http.
export const mainHostId = 'main'
export const httpInterfaceId = 'http'
export const sshInterfaceId = 'ssh'

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

export function getHttpInterfaceUrls(effects: T.Effects): Promise<string[]> {
  return sdk.host
    .getOwn(effects, mainHostId, (host) => {
      const iface =
        host &&
        Object.values(host.bindings)
          .flatMap((b) => Object.values(b.interfaces))
          .find((i) => i.id === httpInterfaceId)
      return iface ? iface.addressInfo.nonLocal.format() : []
    })
    .const()
}
