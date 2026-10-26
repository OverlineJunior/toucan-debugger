import { Builtin, entity, pair, scheduler } from '@rbxts/toucan'
import toucanDebugger, { themes } from '@rbxts/toucan-debugger'
import { createTestUi } from './testUi'

entity('moon').set(
	pair(
		Builtin.ChildOf,
		entity('earth').set(pair(Builtin.ChildOf, entity('sun'))),
	),
)

entity('alice')
entity('bob')
entity('charlie')
entity('david')
entity('eve')
entity('frank')

createTestUi()

scheduler().usePlugin(toucanDebugger, themes.white).run()
