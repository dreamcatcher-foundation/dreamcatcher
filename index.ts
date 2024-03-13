import { doka } from './code/engine/Doka/doka.ts';

async function main() {
    const test = doka().deployContractAndBuildInterface('polygonTenderlyFork', 'Test');
    const response = await test.call('add', 500n, 1000n);
}

main();