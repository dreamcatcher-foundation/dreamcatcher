import {EventEmitter} from 'fbemitter';

export type Network = {
    $get: (address: string) => EventEmitter;   
}

export const $network = (function() {
    const _$innerMap: Map<string, EventEmitter> | undefined = new Map();
    let $instance: Network;

    function $get(address: string): EventEmitter {
        const emitter: EventEmitter | undefined = _$innerMap?.get(address);

        if (!emitter) {
            return _$innerMap
                ?.set(address, new EventEmitter())
                ?.get(address)!;
        }

        return emitter;
    }

    return function() {
        if (!$instance) {
            $instance = {
                $get
            };
        }

        return $instance;
    }
})();

export const globalAddress: string = 'GlobalAddress';
export const errorsAddress: string = 'ErrorsAddress';
export const eventsAddress: string = 'EventsAddress';

export function includeNetwork() {
    $network().$get(globalAddress);
    $network().$get(errorsAddress);
    $network().$get(eventsAddress);
}

export {EventEmitter};