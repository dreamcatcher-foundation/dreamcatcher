export default interface IServerScriptLoader {
    paths: {
        static: string;
        sol: {
            build: string;
            contracts: ({
                name: string;
                path: string;
            })[]
        }
    }
}