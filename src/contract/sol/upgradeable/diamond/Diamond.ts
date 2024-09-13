import * as Ethers from "ethers";
import * as Vm from "@lib/vm/VirtualMachine";
import * as Solc from "@lib/solc/Sol";
import * as Path from "path";

class MissingDependency extends Error {}
class MissingReciept extends Error {}
class MissingAddress extends Error {}

export default class Diamond {

    public static async deploy(): Promise<string> {
        let url: string | undefined = process.env?.["POLYGON_URL"];
        let key: string | undefined = process.env?.["POLYGON_KEY"];
        if (!url) throw new MissingDependency();
        if (!key) throw new MissingDependency();
        let polygon: Vm.VirtualMachine = Vm.VirtualMachine(url);
        let account: Vm.Account = polygon.Account(key);
        let receipt: Ethers.TransactionReceipt | null = await account.deploySol({
            sol: Solc.Sol(Path.join(__dirname, "./Diamond.sol")),
            args: [],
            gasPrice: 40000000000n,
            gasLimit: 10000000n
        });
        if (!receipt) throw new MissingReciept();
        let address: string | null = receipt.contractAddress;
        if (!address) throw new MissingAddress();
        return address;
    }

    protected readonly _account: Vm.Account;

    public constructor(protected readonly _address: string) {
        let url: string | undefined = process.env?.["POLYGON_URL"];
        let key: string | undefined = process.env?.["POLYGON_KEY"];
        if (!url) throw new MissingDependency();
        if (!key) throw new MissingDependency();
        let polygon: Vm.VirtualMachine = Vm.VirtualMachine(url);
        this._account = polygon.Account(key);
    }

    public async reconnect(facetI: string) {
        return await this._account.call({
            to: this._address,
            selector: Vm.Selector("reconnect", ["address"]),
            args: [facetI]
        });
    }

    public async connect(facetI: string) {
        return await this._account.call({
            to: this._address,
            selector: Vm.Selector("connect", ["address"]),
            args: [facetI]
        });
    }

    public async disconnect(facetI: string) {
        return await this._account.call({
            to: this._address,
            selector: Vm.Selector("disconnect", ["address"]),
            args: [facetI]
        });
    }

    public async replaceSelectors(implementation: string, selectors: string[]) {
        
    }

    public async addSelectors(implementation: string, selectors: string[]) {
        let bytes4Selectors: string[] = [];
        for (let i = 0; i < selectors.length; i++) bytes4Selectors.push(this._toBytes4Selector(selectors[i]));
        return await this._account.call({
            to: this._address,
            selector: Vm.Selector("addSelectors", ["address", "bytes4[]"]),
            args: [implementation, bytes4Selectors]
        });
    }

    protected _toBytes4Selectors(string: string[]): string[] {
        
    }

    protected _toBytes4Selector(string: string): string {
        return Ethers.id(string).slice();
    }
}