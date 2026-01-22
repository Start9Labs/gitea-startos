import { setupManifest } from '@start9labs/start-sdk'

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
  description: {
    short: 'A painless self-hosted Git service',
    long: 'Gitea is a community managed lightweight code hosting solution written in Go. It is published under the MIT license',
  },
  volumes: ['main'],
  images: {
    gitea: {
      source: {
        dockerTag: 'gitea/gitea:1.25.4',
      },
    }
  },
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
