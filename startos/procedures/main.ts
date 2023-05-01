import {
  Daemons,
  NetworkInterfaceBuilder,
  setupMain,
} from 'start-sdk/lib/mainFn'
import exportInterfaces from 'start-sdk/lib/mainFn/exportInterfaces'
import { ExpectedExports } from 'start-sdk/lib/types'
import { WrapperData } from '../wrapperData'
import { HealthReceipt } from 'start-sdk/lib/health'

export const main: ExpectedExports.main = setupMain<WrapperData>(
  async ({ effects, utils, started }) => {
    /**
     * ======================== Setup ========================
     *
     * In this section, you will fetch any resources or run any commands necessary to run the service
     */

    await effects.console.info('Starting Gitea!')

    /**
     * ======================== Interfaces ========================
     *
     * In this section, you will decide how the service will be exposed to the outside world
     *
     * Naming convention reference: https://developer.mozilla.org/en-US/docs/Web/API/Location
     */

    const torHostname = utils.torHostName('torHostname')

    // ------------ web/git(http) interface ------------

    // tor
    const webTorHost = await torHostname.bindTor(3000, 80)
    const webTorOrigin = webTorHost.createOrigin('http')
    // lan
    const webLanHost = await utils.bindLan(3000)
    const webLanOrigins = webLanHost.createOrigins('https')

    let webInterface = new NetworkInterfaceBuilder({
      effects,
      name: 'Web UI (and Git HTTP)',
      id: 'webui',
      description: 'Web UI for your Gitea server. Also used for git over HTTP.',
      ui: true,
      basic: null,
      path: '',
      search: {},
    })

    const webReceipt = await webInterface.exportAddresses([
      webTorOrigin,
      webLanOrigins.local,
      ...webLanOrigins.ipv4,
      ...webLanOrigins.ipv6,
    ])

    // ------------ git interfaces ------------

    // tor
    const gitTorHost = await torHostname.bindTor(22, 22)
    // lan
    const gitLanHost = await utils.bindLan(22)

    // ------ git interface (ssh) ------

    // tor
    const gitSshTorOrigin = gitTorHost.createOrigin(null)
    // lan
    const gitSshLanOrigins = gitLanHost.createOrigins(null)

    let gitSshInterface = new NetworkInterfaceBuilder({
      effects,
      name: 'Git',
      id: 'gitSsh',
      description: 'Git Remote URLs (SSH)',
      ui: false,
      basic: { username: 'git', password: null },
      path: '',
      search: {},
    })

    const gitSshReceipt = await gitSshInterface.exportAddresses([
      gitSshTorOrigin,
      gitSshLanOrigins.local,
      ...gitSshLanOrigins.ip,
    ])

    // Export all address receipts for all interfaces to obtain interface receipt
    const interfaceReceipt = exportInterfaces(webReceipt, gitSshReceipt)

    /**
     * ======================== Additional Health Checks (optional) ========================
     *
     * In this section, you will define additional health checks beyond those associated with daemons
     */
    const healthReceipts: HealthReceipt[] = []

    /**
     * ======================== Daemons ========================
     *
     * In this section, you will create one or more daemons that define the service runtime
     *
     * Each daemon defines its own health check, which can optionally be exposed to the user
     */

    const {
      GITEA__server__DOMAIN,
      GITEA__service__DISABLE_REGISTRATION,
      smtp,
    } = await utils.getOwnWrapperData('/config').once()

    let mailer: any

    if (smtp.unionSelectKey === 'disabled') {
      mailer = { GITEA__mailer__ENABLED: false }
    } else {
      const settings =
        smtp.unionSelectKey === 'system'
          ? await effects.getSystemSmtp()
          : smtp.unionValueKey

      mailer = {
        GITEA__mailer__ENABLED: true,
        GITEA__mailer__SMTP_ADDR: settings.server,
        GITEA__mailer__SMTP_PORT: settings.port,
        GITEA__mailer__FROM: settings.from,
        GITEA__mailer__USER: settings.user,
        GITEA__mailer__PASSWD: settings.password,
        GITEA__mailer__IS_TLS_ENABLED: settings.tls,
      }
    }

    return Daemons.of({
      effects,
      started,
      interfaceReceipt, // Provide the interfaceReceipt to prove it was completed
      healthReceipts, // Provide the healthReceipts or [] to prove they were at least considered
    }).addDaemon('main', {
      command: ['/usr/bin/entrypoint', '--', '/bin/s6-svscan', '/etc/s6'], // The command to start the daemon
      env: {
        GITEA__server__DOMAIN,
        GITEA__server__ROOT_URL: GITEA__server__DOMAIN.includes('.onion')
          ? 'http'
          : 'https',
        GITEA__server__SSH_DOMAIN: GITEA__server__DOMAIN,
        GITEA__security__INSTALL_LOCK: true,
        GITEA__security__SECRET_KEY: await utils
          .getOwnWrapperData('/GITEA__security__SECRET_KEY')
          .once(),
        GITEA__service__DISABLE_REGISTRATION,
        ...mailer,
      },
      requires: [],
      ready: {
        display: 'Server Ready',
        // The function to run to determine the health status of the daemon
        fn: () =>
          utils.checkPortListening(3000, {
            successMessage: 'Server is live',
            errorMessage: 'Server is unreachable',
          }),
      },
    })
  },
)
