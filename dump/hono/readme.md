All dependencies are downstream, which means that as a convention all a node, file, library or object should only import from within its folders and not without. This means that each node is perfectly encaspulated and holds its own unique state or logic which are not to be shared. Whilst this violates the SOLID principle, and code will be duplicated several times, the idea stems from making sure that each component is perfectly encapsulated which will make scaling much easier.

EXCEPTION The event emitter, message broker, or "kernel" is a key part of the code which requires shared state to be able to run each node. This is the only peice of the hierarchy that each node can reach upstream to interact with as it contains shared state.

And finally the entry point of the application can be found above the kernel at which point it is the entry point that calls the kernel dependency.

** The app can work without any of its nodes of middleware, but it does nothing.
Each encapuslated middleware gives it features connected by the kernel.

entrypoint => [
  middleware
    ...

]


RULE If writing code that contains any external dependencies ie. imports or extenal code not directly within the node       folder, it is classes as middleware to the node. The node should function as an adaptor to it and plug in to the event bus rather than utilizing the imports directly within the app.