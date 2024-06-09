

interface IConfig {
    defaultPolygonTestEvmRpcUrl: string;
    defaultPolygonTestEvmPrivateKey: string;
}

const config = (function() {
    const defaultPolygonTestEvmRpcUrl: string = "";
    const defaultPolygonTestEvmPrivateKey: string = "";
    let _: IConfig;

    return function() {
        if (!_) return _ = {
            defaultPolygonTestEvmRpcUrl,
            defaultPolygonTestEvmPrivateKey
        };
        return _;
    }
})();