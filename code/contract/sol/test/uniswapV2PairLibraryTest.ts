import { doka } from '../../../engine/Doka/doka.ts';

async function main() {
    const uniswapV2AdaptorMock = doka().deployContractAndBuildInterface('polygonTenderlyFork', 'UniswapV2AdaptorMock');
    
}