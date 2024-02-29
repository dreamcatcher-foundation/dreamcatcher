import {on, broadcast} from "../library/EventsNetwork.ts";




export function listenForMetamaskConnectionRequest(): void {

  on(metamaskConnectionRequest(), tryToBroadcastMetamaskAccounts);




  function tryToBroadcastMetamaskAccounts(): void {

    if (!metamask()) {

      broadcast(metamaskConnectionFailed(), new Error("metamask is not installed on client"));

      return;
    }

    const response: unknown[] | Error = tryToFetchAccountsFromMetamask();

    if (response instanceof Error) {

      broadcast(metamaskConnectionFailed(), response);

      return;
    }

    broadcast(metamaskConnectionSuccess(), response);

    return;
  }




  function tryToFetchAccountsFromMetamask(): any {

    try {

      let accounts: unknown[] | undefined;

      metamask().request(method()).then(function(accounts: unknown[]) {

        accounts = accounts;
      });

      function method(): {method: string} {

        return {method: "eth_requestAccounts"};
      }

      if (!accounts) {

        return new Error("no accounts where given");
      }
  
      return accounts;
    }

    catch (error) {

      return new Error("unable to fetch accounts from metamask");
    }

  }




  function metamask(): any {

    return (window as any).ethereum;
  }




  function metamaskConnectionRequest(): string {

    return "metamask::connection::request";
  }

  function metamaskConnectionFailed(): string {

    return "metamask::connection::failed";
  }

  function metamaskConnectionSuccess(): string {

    return "metamask::connection::success";
  }



  return;
}