import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'gitea',
  title: 'Gitea',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/gitea-startos',
  upstreamRepo: 'https://github.com/go-gitea/gitea',
  supportSite: 'https://github.com/go-gitea/gitea/issues',
  marketingSite: 'https://gitea.com/',
  donationUrl: null,
  docsUrl: 'https://docs.gitea.io/',
  description: { short, long },
  volumes: ['main'],
  images: {
    gitea: {
      source: {
        dockerTag: 'gitea/gitea:1.25.4',
      },
      arch: ['x86_64', 'aarch64', 'riscv64'],
    },
  },
  dependencies: {},
})
