export type Listener<T extends Array<any>> = (...args: T) => void;
export class EventEmitter<EventMap extends Record<string, Array<any>>> {
  private __eventListeners: {[K in keyof EventMap]?: Set<Listener<EventMap[K]>>} = {};
  
  public on<K extends keyof EventMap>(eventName: K, listener: Listener<EventMap[K]>) {
    const LISTENERS: Set<Listener<EventMap[K]>> = this.__eventListeners[eventName] ?? new Set();
    LISTENERS.add(listener);
    this.__eventListeners[eventName] = LISTENERS;
  }

  public emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]) {
    const LISTENERS: Set<Listener<EventMap[K]>> = this.__eventListeners[eventName] ?? new Set();
    LISTENERS.forEach(listener => {
      listener(...args);
    });
  }
}