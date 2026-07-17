import { Builtin, query } from '@rbxts/toucan'

export function createTestUi(): void {
	const player = game.GetService('Players').LocalPlayer
	const gui = new Instance('ScreenGui')
	gui.Name = 'DespawnGui'
	gui.ResetOnSpawn = false
	gui.Parent = player.WaitForChild('PlayerGui')

	const box = new Instance('TextBox')
	box.Name = 'EntityNameBox'
	box.Size = new UDim2(0, 200, 0, 30)
	box.AnchorPoint = new Vector2(1, 1)
	box.Position = new UDim2(1, -120, 1, -50)
	box.PlaceholderText = 'Entity label...'
	box.Text = ''
	box.ClearTextOnFocus = false
	box.Parent = gui

	const checkBtn = new Instance('TextButton')
	checkBtn.Name = 'CheckButton'
	checkBtn.Size = new UDim2(0, 100, 0, 30)
	checkBtn.AnchorPoint = new Vector2(1, 1)
	checkBtn.Position = new UDim2(1, -10, 1, -50)
	checkBtn.Text = 'Check'
	checkBtn.Parent = gui

	const resultLabel = new Instance('TextLabel')
	resultLabel.Name = 'CheckResultLabel'
	resultLabel.Size = new UDim2(0, 310, 0, 30)
	resultLabel.AnchorPoint = new Vector2(1, 1)
	resultLabel.Position = new UDim2(1, -10, 1, -90)
	resultLabel.Text = ''
	resultLabel.BackgroundTransparency = 1
	resultLabel.TextColor3 = new Color3(1, 1, 1)
	resultLabel.Parent = gui

	checkBtn.MouseButton1Click.Connect(() => {
		const label = box.Text
		if (label === '') return
		const result = query(Builtin.Label).find((_e, l) => l === label)
		resultLabel.Text = result !== undefined
			? `✓ Entity "${label}" exists`
			: `✗ Entity "${label}" not found`
		resultLabel.TextColor3 = result !== undefined
			? new Color3(0, 1, 0.2)
			: new Color3(1, 0.3, 0.3)
	})

	const btn = new Instance('TextButton')
	btn.Name = 'DespawnButton'
	btn.Size = new UDim2(0, 100, 0, 30)
	btn.AnchorPoint = new Vector2(1, 1)
	btn.Position = new UDim2(1, -10, 1, -10)
	btn.Text = 'Despawn'
	btn.Parent = gui

	btn.MouseButton1Click.Connect(() => {
		const label = box.Text
		if (label === '') return
		const result = query(Builtin.Label).find((_e, l) => l === label)
		if (result) {
			const [handle] = result
			handle.despawn()
		}
	})
}
