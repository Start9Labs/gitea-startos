import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { mount } from '../utils'

// Gitea runs git with HOME at [git] HOME_PATH, so gpg reads the keyring under it.
const gnupgHome = '/data/gitea/home/.gnupg'

export const signingKey = sdk.setupOnInit(async (effects) => {
  if (await storeJson.read((s) => s.signingKey).once()) return

  const key = await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'gitea' },
    mount,
    'signing-key',
    async (subc) => {
      await subc.execFail([
        'sh',
        '-c',
        `mkdir -p ${gnupgHome} && chown -R git:git /data/gitea/home && chmod 700 ${gnupgHome}`,
      ])
      const gpg = (args: string[]) =>
        subc.execFail(['gpg', '--homedir', gnupgHome, '--batch', ...args], {
          user: 'git',
        })
      const fingerprint = async () =>
        (await gpg(['--list-secret-keys', '--with-colons'])).stdout
          .toString()
          .match(/^fpr:(?:[^:]*:){8}([0-9A-F]+):/m)?.[1]

      // An init interrupted after generating keeps its key rather than adding a second.
      let fpr = await fingerprint()
      if (!fpr) {
        await gpg([
          '--pinentry-mode',
          'loopback',
          '--passphrase',
          '',
          '--quick-gen-key',
          'Gitea',
          'ed25519',
          'sign',
          'never',
        ])
        fpr = await fingerprint()
      }
      if (!fpr) throw new Error('Signing key generation produced no key')
      return {
        fingerprint: fpr,
        publicKey: (await gpg(['--armor', '--export', fpr])).stdout.toString(),
      }
    },
  )

  await storeJson.merge(effects, { signingKey: key })
})
