import * as ethers from "ethers";
import * as eventsNetwork from "../library/EventsNetwork.ts";

export default () => {

  const agent = (() => {

    const __provider: ethers.ContractRunner = new ethers.JsonRpcProvider("https://polygon-rpc.com");

    const provider = () => __provider;
    
    const fetchEvents = () => {

      eventsNetwork.default
        .emit("polygon::contract::events::update");
    }

    const fetchDreamTokenEvents = async ({
      address,
      applicationBinaryInterface
    }: {
      address: string,
      applicationBinaryInterface: ethers.Interface
        | ethers.InterfaceAbi
    }) => {
      const contract = new ethers.Contract(
        address,
        applicationBinaryInterface,
        provider()
      );
      contract
      contract.filters
        .Transfer(
          null,
          null,
          null
        );
    }

    const pullERC20TokenEventsHistory = async() => {
      return [];
    }

    return {
      provider,
      fetchEvents
    }
  })();

  agent.provider();

  eventsNetwork.default
    .emit("contract::event");

  eventsNetwork.default
    .addListener("system::clock::A::tick", agent.fetchEvents);

  eventsNetwork.default
    .addListener("polygon::update::stream", () => {

    });

    eventsNetwork.default.addListener(
      "request_metamask_for_connection",
      () => {
        if (!(window as any).ethereum) {
          eventsNetwork.default.emit(
            "failed_to_find_metamask_on_client"
          );
          return;
      }
      (window as any).ethereum
        .request({method: "eth_requestAccounts"})
        .then((addressArray: unknown[]) => {
          eventsNetwork.default.emit(
            "metamask_connected",
            addressArray as string[]
          );
        });
    });
}