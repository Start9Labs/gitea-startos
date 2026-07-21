import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_1_27_0_0 } from './v1.27.0_0'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_1_27_0_0],
})
