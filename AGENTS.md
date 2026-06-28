# Project Context

This is a debugger made in roblox-ts for my Toucan ECS framework. It uses Iris to render the UI.

The debugger should take advantage of the fact Toucan exposes all of its internal built-in components (e.g.: `query(Builtin.Component).forEach((entity, data) => print(entity, data)` prints all components and their data).

You must always keep in mind the context files in `context/`.
