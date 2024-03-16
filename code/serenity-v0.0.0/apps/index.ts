import { type Engine, type Disk, main} from '../engine/engine.ts';

export const disk: Disk = {
    contracts: [
        'Diamond'
    ],
    fSrcDir: '',
    srcDir: '',
    networks: [],
    app: App
}

function App(engine: Engine): 0 | 1 {

    


    return 1;
}

main(disk);