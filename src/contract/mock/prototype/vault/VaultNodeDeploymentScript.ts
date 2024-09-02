import * as Ethers from "ethers";
import * as Vm from "@lib/vm/VirtualMachine";
import * as Solc from "@lib/solc/Sol";
import * as Path from "path";

(async function() {
    let url: string = process.env?.["POLYGON_URL"]!;
    let key: string = process.env?.["POLYGON_KEY"]!;
    let polygon: Vm.VirtualMachine = Vm.VirtualMachine(url);
    let account: Vm.Account = polygon.Account(key);
    let receipt: Ethers.TransactionReceipt | null = await account.deploySol({
        sol: Solc.Sol(Path.join(__dirname, "./VaultNode.sol")),
        args: ["0x4308BC39668cF3530e19f916C6bCfcFa5d856D56", "0x9f89540957e885613168DD760d6A8c1aADfc4A71", ],
        gasPrice: 40000000000n,
        gasLimit: 10000000n
    });
    if (receipt) {
        return console.log(receipt.contractAddress);
    }
    return;
})();