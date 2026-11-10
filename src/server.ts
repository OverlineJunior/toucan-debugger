import { RunService } from '@rbxts/services'
import type { Scheduler } from '@rbxts/toucan'
import { collectServerSnapshot, snapshotEvent } from './snapshot'

export interface DebuggerOptions {
	serverInterval?: number
}

const DEFAULT_SERVER_INTERVAL = 1

let serverInterval = DEFAULT_SERVER_INTERVAL
let lastBroadcast = 0

/** Broadcasts the current server snapshot to all clients, throttled by `serverInterval`. */
export function broadcastServerSnapshot(): void {
	const now = time()
	if (now - lastBroadcast < serverInterval) return
	lastBroadcast = now

	const snapshot = collectServerSnapshot()
	snapshotEvent.FireAllClients(snapshot)
}

/**
 * Spawns the server side of the debugger.
 *
 * @remarks
 * Throws if used on the client.
 *
 * @example
 * ```ts
 * import { toucanDebuggerServer } from '@rbxts/toucan-debugger'
 *
 * scheduler().usePlugin(toucanDebuggerServer, { serverInterval: 1 }).run()
 * ```
 */
export function toucanDebuggerServer(
	scheduler: Scheduler,
	options: DebuggerOptions = {},
): void {
	if (!RunService.IsServer()) {
		error("Toucan's debugger server plugin can only be used on the server")
	}

	serverInterval = options.serverInterval ?? DEFAULT_SERVER_INTERVAL

	scheduler.useSystem('last', broadcastServerSnapshot)
}
