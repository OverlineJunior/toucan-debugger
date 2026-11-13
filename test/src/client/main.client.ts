import { Builtin, component, entity, pair, scheduler } from '@rbxts/toucan'
import { themes, toucanDebuggerClient } from '@rbxts/toucan-debugger'
import { createTestUi } from './testUi'

entity('moon').set(
	pair(
		Builtin.ChildOf,
		entity('earth').set(pair(Builtin.ChildOf, entity('sun'))),
	),
)

const Likes = component('Likes')

const alice = entity('alice')
entity('bob').set(pair(Likes, alice))
entity('charlie')
entity('david')
entity('eve')
entity('frank')

createTestUi()

scheduler().usePlugin(toucanDebuggerClient, themes.black).run()
