import * as event_emitter from './private/event_emitter.ts';
export type EventMap = {
  notification: [message: string]
}
export class Kernel extends event_emitter.EventEmitter<EventMap> {
  private constructor() {
    super();
  }
}