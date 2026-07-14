import { component, type EntityHandle, pair, type Handle } from '@rbxts/toucan'
import { type EntityInstance, entityFor } from '../../instance'
import type { Theme } from '../../themes'
import { Collapsible } from '../../collapsible'

const HEADER_HEIGHT = 20

export const EntryFor = component('EntryFor')
export const NoEntry = component('NoEntry')

function makeHeader(
    entity: Handle,
    theme: Theme,
    callback: (header: ImageButton, chevron: ImageLabel) => void,
): EntityInstance<ImageButton> {
    let chevron: ImageLabel
    
    const header = entityFor('ImageButton', {
        Name: 'header',
        Size: new UDim2(1, 0, 0, HEADER_HEIGHT),
        BackgroundColor3: theme.colors.surface2,
        LayoutOrder: 0,

        children: [
            entityFor('UIListLayout', {
                FillDirection: Enum.FillDirection.Horizontal,
                SortOrder: Enum.SortOrder.LayoutOrder,
                Padding: theme.paddingSizes.medium,
            }),
            
            entityFor('UIPadding', {
                PaddingBottom: theme.paddingSizes.small,
                PaddingTop: theme.paddingSizes.small,
                PaddingLeft: theme.paddingSizes.small,
                PaddingRight: theme.paddingSizes.small,
            }),

            entityFor('UICorner', {
                CornerRadius: theme.paddingSizes.medium,
            }),

            entityFor('UIStroke', {
                Color: theme.colors.border,
            }),
            
            entityFor('Frame', {
                Name: 'left',
                Size: UDim2.fromScale(0, 1),
                BackgroundTransparency: 1,

                children: [
                    entityFor('UIListLayout', {
                        FillDirection: Enum.FillDirection.Horizontal,
                        SortOrder: Enum.SortOrder.LayoutOrder,
                        Padding: theme.paddingSizes.medium,
                    }),

                    entityFor('UIFlexItem', {
                        FlexMode: Enum.UIFlexMode.Fill,
                    }),

                    entityFor('ImageLabel', {
                        Name: 'icon',
                        Image: theme.icons.entity,
                        ImageColor3: theme.colors.contentMuted,
                        Size: UDim2.fromScale(0, 1),
                        BackgroundTransparency: 1,
                        LayoutOrder: 0,

                        child: entityFor('UIAspectRatioConstraint', {
                            AspectType: Enum.AspectType.ScaleWithParentSize,
                            DominantAxis: Enum.DominantAxis.Height,
                        }),
                    }),

                    entityFor('TextLabel', {
                        Name: 'id',
                        Text: `#${entity.id}`,
                        FontFace: theme.fonts.regular,
                        TextSize: theme.fontSizes.small,
                        TextXAlignment: Enum.TextXAlignment.Left,
                        TextColor3: theme.colors.contentMuted,
                        Size: new UDim2(0, 33.5, 1, 0),
                        BackgroundTransparency: 1,
                        LayoutOrder: 1,
                    }),
                    
                    entityFor('TextLabel', {
                        Name: 'label',
                        Text: entity.toString(),
                        FontFace: theme.fonts.regular,
                        TextSize: theme.fontSizes.small,
                        TextXAlignment: Enum.TextXAlignment.Left,
                        TextColor3: theme.colors.content,
                        Size: UDim2.fromScale(0, 1),
                        BackgroundTransparency: 1,
                        LayoutOrder: 2,

                        child: entityFor('UIFlexItem', {
                           FlexMode: Enum.UIFlexMode.Fill, 
                        }),
                    }),
                ],
            }),

            entityFor('ImageLabel', {
                Name: 'chevron',
                Size: UDim2.fromScale(0, 1),
                Position: UDim2.fromScale(0.8, 0),
                BackgroundTransparency: 1,
                Image: theme.icons.chevronRight,

                callback: (_e, inst) => {
                    chevron = inst
                },

                child: entityFor('UIAspectRatioConstraint', {
                    AspectType: Enum.AspectType.ScaleWithParentSize,
                    DominantAxis: Enum.DominantAxis.Height,
                })
            }),
        ],
    })

    callback(header[1], chevron!)
    return header
}

export default function entityEntry(
    entity: Handle,
    theme: Theme,
): [EntityInstance<Frame>, Frame] {
    let header: GuiButton
    let chevron: ImageLabel
    let body: Frame
    
    const entry = entityFor('Frame', {
        Name: `entityEntry: ${entity}`,
        Size: UDim2.fromScale(0, 0),
        AutomaticSize: Enum.AutomaticSize.Y,
        Transparency: 1,

        callback: (e) => e.set(pair(EntryFor, entity as EntityHandle)),

        children: [
            entityFor('UIListLayout', {
                FillDirection: Enum.FillDirection.Vertical,
                SortOrder: Enum.SortOrder.LayoutOrder,
                Padding: theme.paddingSizes.medium,
            }),

            makeHeader(entity, theme, (hdr, chv) => {
                header = hdr
                chevron = chv
            }),

            entityFor('Frame', {
                Name: 'body',
                Size: UDim2.fromScale(1, 0),
                AutomaticSize: Enum.AutomaticSize.Y,
                Transparency: 1,
                LayoutOrder: 1,

                callback: (_e, inst) => {
                    body = inst
                },

                children: [
                    entityFor('UIListLayout', {
                        FillDirection: Enum.FillDirection.Vertical,
                        HorizontalFlex: Enum.UIFlexAlignment.Fill,
                        SortOrder: Enum.SortOrder.LayoutOrder,
                        Padding: theme.paddingSizes.medium,
                    }),

                    entityFor('UIPadding', {
                        PaddingLeft: new UDim(0, theme.explorerIndent),
                    }),
                ],
            })
        ],
    })

    entry[0].set(Collapsible, {
        toggleButton: header!,
        chevron: chevron!,
        body: body!,
    })

    // Without this, `drawEntities` would add entries infinitely, crashing the game. 
    const addNoEntryRecursive = (e: EntityHandle) => {
        e.set(NoEntry)
        e.children().forEach((c) => addNoEntryRecursive(c as EntityHandle))
    }
    addNoEntryRecursive(entry[0])

    return [entry, body!]
}
