export type TListener<T extends Array<any>> = (...args: T) => void;

export class EventEmitterConstructor<EventMap extends Record<string, Array<any>>> {
  protected __eventListeners: {[K in keyof EventMap]?: Set<TListener<EventMap[K]>>} = {};
  
  public on<K extends keyof EventMap>({
    eventName,
    listener
  }: {
    eventName: K,
    listener: TListener<EventMap[K]>
  }): void {
    const listeners: Set<TListener<EventMap[K]>> = this.__eventListeners[eventName] ?? new Set();
    listeners.add(listener);
    this.__eventListeners[eventName] = listeners;
  }

  public emit<K extends keyof EventMap>(
    eventName: K,
    ...args: EventMap[K]
  ): void {
    console.log(eventName);
    const listeners: Set<TListener<EventMap[K]>> = this.__eventListeners[eventName] ?? new Set();
    listeners.forEach(listener => {
      listener(...args);
    });
  }
}