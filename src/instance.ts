import {
	Builtin,
	type ComponentHandle,
	component,
	type EntityHandle,
	entity,
    pair,
    Handle,
} from '@rbxts/toucan'

export const Frame = component<Frame>('Frame')
export const ScreenGui = component<ScreenGui>('ScreenGui')
export const ScrollingFrame = component<ScrollingFrame>('ScrollingFrame')
export const ImageButton = component<ImageButton>('ImageButton')
export const ImageLabel = component<ImageLabel>('ImageLabel')
export const TextLabel = component<TextLabel>('TextLabel')
export const UIPadding = component<UIPadding>('UIPadding')
export const UIListLayout = component<UIListLayout>('UIListLayout')
export const UIFlexItem = component<UIFlexItem>('UIFlexItem')
export const UISizeConstraint = component<UISizeConstraint>('UISizeConstraint')
export const UIAspectRatioConstraint = component<UIAspectRatioConstraint>(
	'UIAspectRatioConstraint',
)
export const UICorner = component<UICorner>('UICorner')
export const UIStroke = component<UIStroke>('UIStroke')

const SUPPORTED_INSTANCES = {
	Frame,
	ScreenGui,
	ScrollingFrame,
	ImageButton,
	ImageLabel,
	TextLabel,
	UIPadding,
	UIListLayout,
	UIFlexItem,
	UISizeConstraint,
	UIAspectRatioConstraint,
	UICorner,
	UIStroke,
} satisfies {
	[K in keyof CreatableInstances]?: ComponentHandle<CreatableInstances[K]>
}

const RESERVED_PROPERTIES = ['child', 'children', 'callback']

type SupportedInstances = typeof SUPPORTED_INSTANCES

export type EntityInstance<I extends Instance = Instance> = [EntityHandle, I]

type Child = EntityInstance | EntityHandle | false | undefined

type InstanceProperties<T extends Instance> = Partial<
	WritableInstanceProperties<T>
> & {
    child?: Child
	children?: Child[]
	callback?: (entity: EntityHandle, instance: T) => void
	// Typescript cannot infer every Instance has a Name property.
	Name?: string
}

/**
 * Spawns an entity paired with a new instance of the given `className`, automatically setting the corresponding component and parenting any children.
 *
 * Giving the instance a `Name` will also give its entity a `Label` of the same name.
 * 
 * @remarks
 * Not every instance is supported, as there needs to be a corresponding component for it. If there's an instance you need that isn't supported, consider contributing.
 *
 * @example
 * let textLabel: TextLabel
 *
 * const [btnEntt, btnInst] = entityFor('ImageButton', {
 *     Size: new UDim2(0, 100, 0, 40),
 *     Parent: playerGui,
 *     child: entityFor('TextLabel', {
 *         Text: 'Click me',
 *         callback: (entt, inst) => {
 *             entt.set(SpecialLabel)
 *             textLabel = inst
 *         },
 *     }),
 * })
 */
export function entityFor<T extends keyof SupportedInstances>(
	className: T,
	properties: InstanceProperties<CreatableInstances[T]> = {},
): EntityInstance<CreatableInstances[T]> {
	const entt = entity(properties?.Name)
	const inst = new Instance(className)

	entt.set(
		SUPPORTED_INSTANCES[className] as ComponentHandle<CreatableInstances[T]>,
		inst,
	)

	for (const [k, v] of pairs(properties as Record<string, unknown>)) {
		if (RESERVED_PROPERTIES.includes(k)) continue
		;(inst as unknown as Record<string, unknown>)[k as string] = v
    }

    const parentChild = (child: Child, entt: EntityHandle, inst: Instance) => {
    	if (!child) return
        
    	if (child instanceof Handle) {
    		child.set(pair(Builtin.ChildOf, entt))
    	} else {
    		const [childEntt, childInst] = child
    		childEntt.set(pair(Builtin.ChildOf, entt))
    		childInst.Parent = inst
    	}
    }

    parentChild(properties?.child, entt, inst)

    for (const child of properties?.children ?? []) {
        parentChild(child, entt, inst)
    }

	properties?.callback?.(entt, inst)

	return [entt, inst]
}
