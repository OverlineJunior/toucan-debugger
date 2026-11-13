import { Builtin, component, entity, pair, query } from '@rbxts/toucan'

const TestTag = component('TestTag')
const TestRelation = component('TestRelation')
const relationTarget = entity('relationTarget')

let childCount = 0

function findEntity(label: string) {
	return query(Builtin.Label).find((_e, l) => l === label)
}

export function createTestUi(): void {
	const player = game.GetService('Players').LocalPlayer
	const gui = new Instance('ScreenGui')
	gui.Name = 'DespawnGui'
	gui.ResetOnSpawn = false
	gui.Parent = player.WaitForChild('PlayerGui')

	const panel = new Instance('Frame')
	panel.Name = 'TestPanel'
	panel.AnchorPoint = new Vector2(1, 1)
	panel.Position = new UDim2(1, -10, 1, -10)
	panel.Size = new UDim2(0, 220, 0, 320)
	panel.BackgroundTransparency = 1
	panel.Parent = gui

	const layout = new Instance('UIListLayout')
	layout.FillDirection = Enum.FillDirection.Vertical
	layout.HorizontalAlignment = Enum.HorizontalAlignment.Right
	layout.Padding = new UDim(0, 4)
	layout.SortOrder = Enum.SortOrder.LayoutOrder
	layout.Parent = panel

	const box = new Instance('TextBox')
	box.Name = 'EntityNameBox'
	box.Size = new UDim2(1, 0, 0, 30)
	box.PlaceholderText = 'Entity label...'
	box.Text = ''
	box.ClearTextOnFocus = false
	box.Parent = panel

	const resultLabel = new Instance('TextLabel')
	resultLabel.Name = 'CheckResultLabel'
	resultLabel.Size = new UDim2(1, 0, 0, 30)
	resultLabel.Text = ''
	resultLabel.BackgroundTransparency = 1
	resultLabel.TextColor3 = new Color3(1, 1, 1)
	resultLabel.Parent = panel

	const makeButton = (name: string, text: string, callback: () => void) => {
		const btn = new Instance('TextButton')
		btn.Name = name
		btn.Size = new UDim2(1, 0, 0, 30)
		btn.Text = text
		btn.Parent = panel
		btn.MouseButton1Click.Connect(callback)
	}

	const selected = () => {
		const label = box.Text
		if (label === '') return undefined
		return findEntity(label)
	}

	makeButton('ToggleComponentButton', 'Toggle Component', () => {
		const result = selected()
		if (!result) return
		const [handle] = result
		if (handle.has(TestTag)) handle.remove(TestTag)
		else handle.set(TestTag)
	})

	makeButton('ToggleRelationshipButton', 'Toggle Relationship', () => {
		const result = selected()
		if (!result) return
		const [handle] = result
		const relation = pair(TestRelation, relationTarget)
		if (handle.has(relation)) handle.remove(relation)
		else handle.set(relation)
	})

	makeButton('AddChildButton', 'Add Child', () => {
		const result = selected()
		if (!result) return
		const [handle] = result
		entity(`child-${++childCount}`).set(pair(Builtin.ChildOf, handle))
	})

	makeButton('RemoveChildButton', 'Remove Child', () => {
		const result = selected()
		if (!result) return
		const [handle] = result
		const children = handle.children()
		const last = children[children.size() - 1]
		if (last) last.despawn()
	})

	makeButton('RenameButton', 'Rename', () => {
		const result = selected()
		if (!result) return
		const [handle] = result
		const newLabel = `${box.Text}-renamed`
		handle.set(Builtin.Label, newLabel)
		box.Text = newLabel
	})

	makeButton('DespawnButton', 'Despawn', () => {
		const result = selected()
		if (result) {
			const [handle] = result
			handle.despawn()
		}
	})

	makeButton('CheckButton', 'Check', () => {
		const label = box.Text
		if (label === '') return
		const result = findEntity(label)
		resultLabel.Text =
			result !== undefined
				? `✓ Entity "${label}" exists`
				: `✗ Entity "${label}" not found`
		resultLabel.TextColor3 =
			result !== undefined ? new Color3(0, 1, 0.2) : new Color3(1, 0.3, 0.3)
	})
}
