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
        sol: Solc.Sol(Path.join(__dirname, "./OwnableTokenFactory.sol")),
        args: [],
        gasPrice: 40000000000n,
        gasLimit: 10000000n
    });
    if (receipt) {
        return console.log(receipt.contractAddress);
    }
    return;
})();