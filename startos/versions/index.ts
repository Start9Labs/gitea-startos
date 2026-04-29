import { VersionGraph } from '@start9labs/start-sdk'
import { v_1_25_5_2 } from './v1.25.5.2'
import { v_1_25_5_3 } from './v1.25.5.3'

export const versionGraph = VersionGraph.of({
  current: v_1_25_5_3,
  other: [v_1_25_5_2],
})
