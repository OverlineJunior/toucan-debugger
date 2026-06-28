import Iris from '@rbxts/iris'
import {
	Builtin,
	type ComponentHandle,
	type Handle,
	type Query,
	query,
} from '@rbxts/toucan'
import disabledButton from '../widgets/disabledButton'
import type { SelectedEntityFilters } from './drawEntityFilters'

function isUser(e: Handle): boolean {
	return !e.has(Builtin.Internal) && !e.has(Builtin.ThirdParty)
}

function isRegularEntity(e: Handle): boolean {
	return (
		!e.has(Builtin.Component) &&
		!e.has(Builtin.Resource) &&
		!e.has(Builtin.Plugin) &&
		!e.has(Builtin.System)
	)
}

function queryFilters(
	filters: SelectedEntityFilters,
): Query<ComponentHandle[]> {
	const [owner, kind] = [filters[0].get(), filters[1].get()]

	if (owner === 'User' && kind === 'Entities') {
		return query(Builtin.Wildcard).filter(
			(e) => isUser(e) && isRegularEntity(e),
		)
	} else if (owner === 'User' && kind === 'Components') {
		return query(Builtin.Component).filter((e) => isUser(e))
	} else if (owner === 'User' && kind === 'Resources') {
		return query(Builtin.Resource).filter((e) => isUser(e))
	} else if (owner === 'User' && kind === 'Plugins') {
		return query(Builtin.Plugin).filter((e) => isUser(e))
	} else if (owner === 'User' && kind === 'Systems') {
		return query(Builtin.System).filter((e) => isUser(e))
	} else if (owner === 'Internal' && kind === 'Entities') {
		return query(Builtin.Internal).filter((e) => isRegularEntity(e))
	} else if (owner === 'Internal' && kind === 'Components') {
		return query(Builtin.Internal, Builtin.Component)
	} else if (owner === 'Internal' && kind === 'Resources') {
		return query(Builtin.Internal, Builtin.Resource)
	} else if (owner === 'Internal' && kind === 'Plugins') {
		return query(Builtin.Internal, Builtin.Plugin)
	} else if (owner === 'Internal' && kind === 'Systems') {
		return query(Builtin.Internal, Builtin.System)
	} else if (owner === 'Third-Party' && kind === 'Entities') {
		return query(Builtin.ThirdParty).filter((e) => isRegularEntity(e))
	} else if (owner === 'Third-Party' && kind === 'Components') {
		return query(Builtin.ThirdParty, Builtin.Component)
	} else if (owner === 'Third-Party' && kind === 'Resources') {
		return query(Builtin.ThirdParty, Builtin.Resource)
	} else if (owner === 'Third-Party' && kind === 'Plugins') {
		return query(Builtin.ThirdParty, Builtin.Plugin)
	} else if (owner === 'Third-Party' && kind === 'Systems') {
		return query(Builtin.ThirdParty, Builtin.System)
	} else {
		error(`Invalid filter: ${owner} ${kind}`)
	}
}

function drawEntityEntry(
	e: Handle,
	viewingEntity: Iris.State<Handle | undefined>,
	//isViewOpen: Iris.State<boolean>,
) {
	const drawViewButton = () => {
		if (Iris.Button(['View']).clicked()) {
			if (viewingEntity.get() === e) {
				viewingEntity.set(undefined)
			} else {
				viewingEntity.set(e)
			}
		}
	}

	const drawCloneButton = () => {
		if (e.has(Builtin.Internal)) {
			disabledButton('Despawn', 'Cannot clone internal entity')
		} else if (Iris.Button(['Despawn']).clicked()) {
			e.despawn()
		}
	}

	const drawDespawnButton = () => {
		if (e.has(Builtin.Internal)) {
			disabledButton('Despawn', 'Cannot despawn internal entity')
		} else if (e.has(Builtin.Persistent)) {
			disabledButton('Despawn', 'Cannot despawn persistent entity')
		} else if (Iris.Button(['Despawn']).clicked()) {
			e.despawn()
		}
	}

	const drawLabel = () => {
		if (!e.exists()) return

		const spacing = 4 - tostring(e.id).size()
		Iris.Text([`#${e.id}${' '.rep(spacing)}${e}`])
	}

	Iris.SameLine([])
	{
		drawViewButton()
		drawCloneButton()
		drawDespawnButton()
		drawLabel()
		Iris.End()
	}
}

const drawEntityView = (
	viewingEntity: Iris.State<Handle | undefined>,
	isViewOpen: Iris.State<boolean>,
) => {
	const viewing = viewingEntity.get()

    Iris.Window([`${viewing}`], { isOpened: isViewOpen })
	{
		if (viewing) {
			Iris.Text([
				viewing
					.components()
					.map((c) => c.toString())
					.join(),
			])
		}
		Iris.End()
	}
}

export default function drawEntityList(filters: SelectedEntityFilters) {
	Iris.Table([1])
	{
		const viewingEntity = Iris.State<Handle | undefined>(undefined)
		const isViewOpen = Iris.ComputedState(viewingEntity, (v) => v !== undefined)

		queryFilters(filters).forEach((e) => drawEntityEntry(e, viewingEntity))
		drawEntityView(viewingEntity, isViewOpen)

		Iris.End()
	}
}



import Iris from '@rbxts/iris'
import {
	Builtin,
	type ComponentHandle,
	type Handle,
	type Query,
	query,
} from '@rbxts/toucan'
import disabledButton from '../widgets/disabledButton'
import type { SelectedEntityFilters } from './drawEntityFilters'

function isUser(e: Handle): boolean {
	return !e.has(Builtin.Internal) && !e.has(Builtin.ThirdParty)
}

function isRegularEntity(e: Handle): boolean {
	return (
		!e.has(Builtin.Component) &&
		!e.has(Builtin.Resource) &&
		!e.has(Builtin.Plugin) &&
		!e.has(Builtin.System)
	)
}

function queryFilters(
	filters: SelectedEntityFilters,
): Query<ComponentHandle[]> {
	const [owner, kind] = [filters[0].get(), filters[1].get()]

	if (owner === 'User' && kind === 'Entities') {
		return query(Builtin.Wildcard).filter(
			(e) => isUser(e) && isRegularEntity(e),
		)
	} else if (owner === 'User' && kind === 'Components') {
		return query(Builtin.Component).filter((e) => isUser(e))
	} else if (owner === 'User' && kind === 'Resources') {
		return query(Builtin.Resource).filter((e) => isUser(e))
	} else if (owner === 'User' && kind === 'Plugins') {
		return query(Builtin.Plugin).filter((e) => isUser(e))
	} else if (owner === 'User' && kind === 'Systems') {
		return query(Builtin.System).filter((e) => isUser(e))
	} else if (owner === 'Internal' && kind === 'Entities') {
		return query(Builtin.Internal).filter((e) => isRegularEntity(e))
	} else if (owner === 'Internal' && kind === 'Components') {
		return query(Builtin.Internal, Builtin.Component)
	} else if (owner === 'Internal' && kind === 'Resources') {
		return query(Builtin.Internal, Builtin.Resource)
	} else if (owner === 'Internal' && kind === 'Plugins') {
		return query(Builtin.Internal, Builtin.Plugin)
	} else if (owner === 'Internal' && kind === 'Systems') {
		return query(Builtin.Internal, Builtin.System)
	} else if (owner === 'Third-Party' && kind === 'Entities') {
		return query(Builtin.ThirdParty).filter((e) => isRegularEntity(e))
	} else if (owner === 'Third-Party' && kind === 'Components') {
		return query(Builtin.ThirdParty, Builtin.Component)
	} else if (owner === 'Third-Party' && kind === 'Resources') {
		return query(Builtin.ThirdParty, Builtin.Resource)
	} else if (owner === 'Third-Party' && kind === 'Plugins') {
		return query(Builtin.ThirdParty, Builtin.Plugin)
	} else if (owner === 'Third-Party' && kind === 'Systems') {
		return query(Builtin.ThirdParty, Builtin.System)
	} else {
		error(`Invalid filter: ${owner} ${kind}`)
	}
}

function drawEntityEntry(
	e: Handle,
	viewingEntity: Iris.State<Handle | undefined>,
	//isViewOpen: Iris.State<boolean>,
) {
	const drawViewButton = () => {
		if (Iris.Button(['View']).clicked()) {
			if (viewingEntity.get() === e) {
				viewingEntity.set(undefined)
			} else {
				viewingEntity.set(e)
			}
		}
	}

	const drawCloneButton = () => {
		if (e.has(Builtin.Internal)) {
			disabledButton('Despawn', 'Cannot clone internal entity')
		} else if (Iris.Button(['Despawn']).clicked()) {
			e.despawn()
		}
	}

	const drawDespawnButton = () => {
		if (e.has(Builtin.Internal)) {
			disabledButton('Despawn', 'Cannot despawn internal entity')
		} else if (e.has(Builtin.Persistent)) {
			disabledButton('Despawn', 'Cannot despawn persistent entity')
		} else if (Iris.Button(['Despawn']).clicked()) {
			e.despawn()
		}
	}

	const drawLabel = () => {
		if (!e.exists()) return

		const spacing = 4 - tostring(e.id).size()
		Iris.Text([`#${e.id}${' '.rep(spacing)}${e}`])
	}

	Iris.SameLine([])
	{
		drawViewButton()
		drawCloneButton()
		drawDespawnButton()
		drawLabel()
		Iris.End()
	}
}

const drawEntityView = (
	viewingEntity: Iris.State<Handle | undefined>,
	isViewOpen: Iris.State<boolean>,
) => {
	const viewing = viewingEntity.get()

    Iris.Window([`${viewing}`], { isOpened: isViewOpen })
	{
		if (viewing) {
			Iris.Text([
				viewing
					.components()
					.map((c) => c.toString())
					.join(),
			])
		}
		Iris.End()
	}
}

export default function drawEntityList(filters: SelectedEntityFilters) {
	Iris.Table([1])
	{
		const viewingEntity = Iris.State<Handle | undefined>(undefined)
		const isViewOpen = Iris.ComputedState(viewingEntity, (v) => v !== undefined)

		queryFilters(filters).forEach((e) => drawEntityEntry(e, viewingEntity))
		drawEntityView(viewingEntity, isViewOpen)

		Iris.End()
	}
}



import Iris from '@rbxts/iris'
import drawEntityFilters from './drawEntityFilters'
import drawEntityList from './drawEntityList'

export default function drawEntities() {
	Iris.CollapsingHeader(['Entities'])
	{
		const filters = drawEntityFilters()
		drawEntityList(filters)
		Iris.End()
	}
}
