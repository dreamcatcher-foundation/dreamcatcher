import Path from "./app/library/os/path/Path.ts";
import Url from "./app/library/web/Url.ts";
import App from "./app/library/react/App.ts";
import FolderRoute from "./app/library/react/FolderRoute.ts";
import SolidityPath from "./app/library/os/path/SolidityPath.ts";
import Server from "./app/library/web/Server.ts";

const root: Path = new Path(__dirname);
const diamondContractPath: Path = new Path(root).join("./sol/native/solidstate/Diamond.sol");
const diamondContractSolidityPath: SolidityPath = new SolidityPath(diamondContractPath);

Server.expose("/abstractBinaryInterface/:contractCatalogId", function(request, response) {
    const contractCatalogId: string = request.params.contractCatalogId;
    switch (contractCatalogId) {
        case "diamond":
            response.send(diamondContractSolidityPath.abstractBinaryInterface());
            break;
        default:
            response.send({});
            break;
    }
});

Server.expose("/bytecode/:contractCatalogId", function(request, response) {
    const contractCatalogId: string = request.params.contractCatalogId;
    console.log(contractCatalogId);
    switch (contractCatalogId) {
        case "diamond":
            response.send([diamondContractSolidityPath.bytecode()]);
            break;
        default:
            response.send([""]);
            break;
    }
});

new Url("/supportedChainIds")
    .exposeItem([
        137
    ]);

new App(
    [
        new FolderRoute(
            new Path(__dirname).join("app/"),
            new Url("/")
        )
    ],
    new Path(__dirname).join("app/"),
    3000n
);