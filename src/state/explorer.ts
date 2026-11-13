import { component, query } from '@rbxts/toucan'
import type { EntityNode } from '../descriptor'
import type { Theme } from '../themes'
import { ClientEntityList, ServerEntityList } from '../ui/explorer/entityList'
import { ScrollingFrame } from '../util/instance'

export type ExplorerEnv = 'client' | 'server'

export const EnvToggle = component<{
	dot: Frame
	label: TextButton
}>('EnvToggle')

let activeEnv: ExplorerEnv = 'client'
let snapshotDirty = false
let serverSnapshot: EntityNode[] = []

/** Returns the currently visible explorer environment. */
export function getActiveEnv(): ExplorerEnv {
	return activeEnv
}

/** Returns the latest server snapshot. */
export function getServerSnapshot(): EntityNode[] {
	return serverSnapshot
}

/** Stores a new server snapshot and marks it dirty. */
export function setServerSnapshot(snapshot: EntityNode[]): void {
	serverSnapshot = snapshot
	snapshotDirty = true
}

/** Returns whether the snapshot is dirty, clearing the flag. */
export function consumeSnapshotDirty(): boolean {
	const dirty = snapshotDirty
	snapshotDirty = false
	return dirty
}

/** Switches the visible explorer environment and updates the toggle and lists. */
export function setActiveEnv(env: ExplorerEnv, theme: Theme): void {
	activeEnv = env
	if (env === 'server') snapshotDirty = true

	query(EnvToggle).forEach((_e, { dot, label }) => {
		dot.BackgroundColor3 =
			env === 'client' ? theme.colors.client : theme.colors.server
		label.Text = env === 'client' ? 'Client' : 'Server'
	})

	query(ScrollingFrame)
		.with(ClientEntityList)
		.forEach((_e, list) => {
			list.Visible = env === 'client'
		})

	query(ScrollingFrame)
		.with(ServerEntityList)
		.forEach((_e, list) => {
			list.Visible = env === 'server'
		})
}
