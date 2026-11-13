import { event } from '@rbxts/link'
import type { EntityNode } from './descriptor'

export const sendServerSnapshot = event<[EntityNode[]]>()
