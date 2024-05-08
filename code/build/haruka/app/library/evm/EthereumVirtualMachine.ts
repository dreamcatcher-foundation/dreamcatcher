import ethers from "ethers";
import {Contract} from "ethers";
import {JsonRpcProvider} from "ethers";
import {Log} from "ethers";
import {LogDescription} from "ethers";
import {Network} from "ethers";



class EthereumVirtualMachine {
    public constructor(path: Path) {}
}


function EthereumVirtualMachisne(_nodeUrl: string) {
    async function chainId(): Promise<bigint> {
        return (await node().getNetwork()).chainId;
    }




    function nodeUrl(): string {
        return _nodeUrl;
    }

    function node(): JsonRpcProvider {
        return new JsonRpcProvider(nodeUrl());
    }

    function filter(address: string, eventSignature: string) {
        return {

        }
    }

    async function queryEvents(address: string, abstractBinaryInterface: object[] | string[], eventSignature: string): Promise<LogDescription[]> {
        function contract() {
            return new Contract(address, abstractBinaryInterface, node());
        }

        function filter() {
            return {
                address: address,
                topics: [ethers.id(eventSignature)],
                fromBlock: 0,
                toBlock: "latest"
            };
        }

        async function logs(): Promise<Log[]> {
            return await node().getLogs(filter());
        }

        async function filteredLogs(): Promise<LogDescription[]> {
            let filteredLogs: LogDescription[] = [];
            (await logs()).forEach(log => {
                let parsedLogs = (): LogDescription | null => contract().interface.parseLog(log);
                if (!parsedLogs()) {
                    return;
                }
                filteredLogs.push(parsedLogs()!);
            });
            return filteredLogs;
        }

        return filteredLogs();
    }
}