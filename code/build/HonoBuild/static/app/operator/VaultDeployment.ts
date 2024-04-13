import {Message, on, post, echo, get, set, render, push, swap, wipe, pop, EventSubscription} from './Cargo.ts';
import {Node} from './BetterCargo.ts';

const _storage = {
    name: '',
    tokenName: '',
    tokenSymbol: ''
}

export default function bootVaultDeployment() {
    const node = Node({
        address: 'VAULT_DEPLOYMENT',
        endpoints: [{
            signature: 'IS_OK_FOR_PHASE_2',
            handler: function() {
                const {name, tokenName, tokenSymbol} = _storage;
                if (name === '' || tokenName === '' || tokenSymbol === '') {
                    return false;
                }

                return true;
            }
        }, {
            signature: Message({
                node: 'WELCOME_SETTINGS_INPUT_0',
                action: 'INPUT'
            }),
            handler: function(input: string) {
                _storage.name = input;
                return;
            }
        }, {
            signature: Message({
                node: 'WELCOME_SETTINGS_INPUT_1',
                action: 'INPUT'
            }),
            handler: function(input: string) {
                _storage.tokenName = input;
                return;
            }
        }, {
            signature: Message({
                node: 'WELCOME_SETTINGS_INPUT_2',
                action: 'INPUT'
            }),
            handler: function(input: string) {
                _storage.tokenSymbol = input;
                return;
            }
        }]
    });
}