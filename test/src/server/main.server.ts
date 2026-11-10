import { scheduler } from '@rbxts/toucan'
import { toucanDebuggerServer } from '@rbxts/toucan-debugger'

scheduler().usePlugin(toucanDebuggerServer).run()
