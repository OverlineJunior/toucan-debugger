import { RunService } from '@rbxts/services'
import type { Scheduler } from '@rbxts/toucan'
import { collectEntityNodes } from './descriptor'
import { sendServerSnapshot } from './remotes'

export interface ServerDebuggerOptions {
    /** How frequent the server debugger retrieves information from the server; in seconds. */
	serverUpdateInterval?: number
}

const DEFAULT_SERVER_INTERVAL = 1

let serverInterval = DEFAULT_SERVER_INTERVAL
let lastBroadcast = 0

/** Broadcasts the current server snapshot to all clients, throttled by `serverInterval`. */
export function broadcastServerSnapshot(): void {
	const now = time()
	if (now - lastBroadcast < serverInterval) return
	lastBroadcast = now

	const snapshot = collectEntityNodes()
	sendServerSnapshot.FireAllClients(snapshot)
}

/**
 * Spawns the server side of the debugger.
 *
 * @remarks
 * - Throws if used on the client.
 * - Yields if client plugin not added.
 *
 * @example
 * ```ts
 * import { toucanDebuggerServer } from '@rbxts/toucan-debugger'
 *
 * scheduler().usePlugin(toucanDebuggerServer).run()
 * ```
 */
export function toucanDebuggerServer(
	scheduler: Scheduler,
	options?: ServerDebuggerOptions,
): void {
	if (!RunService.IsServer()) {
		error("Toucan's debugger server plugin can only be used on the server")
	}

	serverInterval = options?.serverUpdateInterval ?? DEFAULT_SERVER_INTERVAL

	scheduler.useSystem('last', broadcastServerSnapshot)
}
