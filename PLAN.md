# Server Explorer Plan

## Goal

Add a footer toggle that switches the explorer between client-side and server-side
entities. The server explorer refreshes on a configurable interval (default `1s`).

## Testing constraints

- Agents **cannot** launch Roblox Studio or interact with the plugin UI. All in-game
  verification is manual.
- Agents **can** run `bun run build` (roblox-ts type-check).
- Agents **should not** care about biome's formatting or linting, unless absolutely necessary.
- Every phase below lists an agent check and a manual in-game test.

## Agreed terminology

| Concept             | Name                                                                           |
| ------------------- | ------------------------------------------------------------------------------ |
| Client entry        | `toucanDebuggerClient(scheduler, theme = themes.black)`                        |
| Server entry        | `toucanDebuggerServer(scheduler, options = {})`                                |
| Options             | `DebuggerOptions { serverInterval?: number }` (seconds, default `1`)           |
| Remote              | `snapshotEvent = event<[ServerSnapshot]>()` from `@rbxts/link` (shared module) |
| Snapshot types      | `EntityKind`, `EntityDescriptor`, `ServerNode`, `ServerSnapshot`               |
| Snapshot collection | `collectServerSnapshot(): ServerSnapshot`                                      |
| Broadcast system    | `broadcastServerSnapshot()`                                                    |
| Client binding      | `bindServerSnapshot()`                                                         |
| Client state        | `ExplorerSide = 'client' \| 'server'`, `activeSide`, `snapshotDirty`           |
| Server rendering    | `drawServerEntries(theme)`                                                     |
| View descriptor     | `entityView(descriptor: EntityDescriptor, theme): EntityView`                  |
| View result         | `EntityView { view, body, label, icon, runtimeLabel? }`                        |
| Client view tag     | keep `ViewFor` (relationship pair, auto-cleanup on target despawn)             |
| Server view tag     | `ServerView` (tag, cleanup on removal/despawn)                                 |
| Server list tag     | `ServerEntityList`                                                             |
| Toggle tag          | `SideToggle { dot: Frame; label: TextLabel }`                                  |
| Toggle action       | `setActiveSide(side: ExplorerSide)`                                            |
| Runtime formatter   | export `formatRuntime(ms)` from `updateRuntimeLabel.ts`                        |

No default export. `src/index.ts` exports only `toucanDebuggerClient` and
`toucanDebuggerServer`.

## Snapshot shape

```ts
type EntityKind =
    "entity" | "component" | "resource" | "system" | "schedule" | "plugin";

interface EntityDescriptor {
    id: number;
    label: string;
    kind: EntityKind;
    runtimeMs?: number;
}

interface ServerNode extends EntityDescriptor {
    parentId?: number;
}

type ServerSnapshot = ServerNode[];
```

## Architecture

- **Server plugin** creates the `@rbxts/link` event, collects a snapshot in the
  `last` schedule, and broadcasts it to all clients every `serverInterval` seconds.
- **Client plugin** binds to the shared link event, stores the latest snapshot, and
  renders it only while the server side is active.
- **Two lists** (`EntityList`, `ServerEntityList`) live in the explorer; the footer
  toggle switches their visibility. The client list keeps updating while the server
  side is shown.
- **`entityView`** is refactored to take an `EntityDescriptor` so the same rendering
  code serves both sides. Client views keep `ViewFor`; server views use `ServerView`.
- **Server IDs** are displayed as-is.

## Phase 1 — Split exports + server snapshot/transport

**Files**

- `src/snapshot.ts` (new): types, `snapshotEvent` (`@rbxts/link`), `getEntityKind`,
  `describeEntity`, `collectServerSnapshot`.
- `src/server.ts` (new): `toucanDebuggerServer`, `broadcastServerSnapshot`.
- `src/client.ts` (new): move existing client setup from `src/index.ts`; add
  `bindServerSnapshot` (store snapshot + set `snapshotDirty`; temporary log).
- `src/index.ts`: export both named functions only.
- `test/src/server/main.server.ts`: install `toucanDebuggerServer`.
- `test/src/client/main.client.ts`: install `toucanDebuggerClient`.

**Steps**

1. Add `@rbxts/link` as a dependency and define the snapshot types plus
   `snapshotEvent = event<[ServerSnapshot]>()` in the shared module.
2. Implement `getEntityKind` / `describeEntity` from `Builtin` markers.
3. Implement `collectServerSnapshot`: query roots from `Builtin.Entity`,
   `Builtin.Component`, and `Builtin.Resource`; recurse through `children()`.
4. Implement `toucanDebuggerServer`: error if not server; register
   `broadcastServerSnapshot` in `last`, throttled by `serverInterval`, and broadcast
   via `snapshotEvent`.
5. Move client logic to `client.ts`; add `bindServerSnapshot` in `preStartup`
   (connect to `snapshotEvent.OnClientEvent`). Log received snapshots for now.
6. Update `index.ts` and the test place.

**Agent check:** `bun run build`, `bun run lint`.

**Manual test:** run the test place; server output logs a snapshot, client output
logs the received snapshot.

## Phase 2 — Descriptor refactor + server list + footer toggle (rebuild A)

**Files**

- `src/instance.ts`: add `TextButton` support.
- `src/ui/explorer/entityView.ts`: accept `EntityDescriptor`, return `EntityView`.
- `src/drawEntityEntries.ts`: build descriptors with `describeEntity`.
- `src/drawServerEntries.ts` (new): rebuild the server list from the snapshot.
- `src/ui/explorer/entityList.ts`: add `serverEntityList` (`ServerEntityList`).
- `src/ui/explorer/index.ts`: include the server list.
- `src/ui/footer.ts`: add the toggle.
- `src/client.ts`: register `drawServerEntries` and `bindServerViewCleanup`.
- `src/updateRuntimeLabel.ts`: export `formatRuntime`.

**Steps**

1. Add `TextButton` to `SUPPORTED_INSTANCES`.
2. Refactor `entityView` to use `descriptor.kind`, `descriptor.id`,
   `descriptor.label`; set the runtime text directly from `descriptor.runtimeMs`
   for server views; return `EntityView`.
3. Refactor `drawEntityEntries` to pass `describeEntity(e)`.
4. Add the second `ScrollingFrame` with `ServerEntityList`, hidden by default.
5. Add the footer toggle: centered horizontal group with a dot (`theme.colors.client`
   / `theme.colors.server`) and a `TextButton` reading `Client` / `Server`.
   `setActiveSide` updates `activeSide`, dot color, label, list visibility, and sets
   `snapshotDirty` when switching to server.
6. Implement `drawServerEntries`: if `activeSide === 'server'` and `snapshotDirty`,
   despawn existing server views, build the tree from `parentId`, create views with
   `ServerView`, parent them, set `LayoutOrder`, then clear `snapshotDirty`.
7. Add `bindServerViewCleanup` (`ServerView.onRemoved` destroys the frame).
8. Register `drawServerEntries` in the `last` chain after `drawEntityEntries`.

**Agent check:** `bun run build`, `bun run lint`.

**Manual test:** click the footer toggle; server entities appear; toggle back; client
entities appear; the server list updates every second (full rebuild).

## Phase 3 — Replace rebuild with diff/preserve expansion (B)

**Files**

- `src/drawServerEntries.ts`.

**Steps**

1. Keep `Map<RawId, EntityView>` and `Set<RawId>` across snapshots.
2. For each node: create if new, update label/icon/runtime/parent/`LayoutOrder` if
   existing, and despawn views whose IDs disappeared.
3. Expansion state is preserved because views are no longer recreated.

**Agent check:** `bun run build`, `bun run lint`.

**Manual test:** expand a server node, wait for a refresh, confirm it stays expanded;
spawn/despawn server entities and confirm the list updates.

## Phase 4 — Docs, cleanup, final verification

**Files**

- `README.md`
- `src/client.ts` (remove temporary logging)
- `test/` (final usage)

**Steps**

1. Document `toucanDebuggerClient` + `toucanDebuggerServer`, the `serverInterval`
   option, and the requirement to install both for the server view.
2. Remove temporary snapshot logging.
3. Run `bun run build` and `bun run lint`.
4. Manual full-flow test in Roblox Studio.

## Notes / risks

- The full tree is sent every interval. This is fine for a debugger; optimize later
  if needed.
- Server and client IDs are separate worlds and may collide; they are displayed as-is
  and never mixed in one list.
- `ViewFor` stays for client auto-cleanup; `ServerView` handles server views.
- No default export; update the README and test place to named imports.
