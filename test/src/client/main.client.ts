import { Builtin, entity, pair, scheduler } from '@rbxts/toucan'
import toucanDebugger, { themes } from '@rbxts/toucan-debugger'

entity('moon').set(
	pair(
		Builtin.ChildOf,
		entity('earth').set(pair(Builtin.ChildOf, entity('sun'))),
	),
)

scheduler().usePlugin(toucanDebugger, themes.black).run()
