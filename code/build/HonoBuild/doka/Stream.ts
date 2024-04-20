



export function compile(contractName: string, contractPath: string, fSrcDir: string) {
    retry(function() {
        const fSrcPath: string = `${fSrcDir}/${contractName}.sol`;
        _flatten();
        _busyWait(500n);
        const compiled: any = 
    });
}


function _flatten() {

}

function _busyWait(ms: bigint) {
    const timestamp: bigint = BigInt(new Date().getTime());
    while(BigInt(new Date().getTime()) < (timestamp + ms));
}