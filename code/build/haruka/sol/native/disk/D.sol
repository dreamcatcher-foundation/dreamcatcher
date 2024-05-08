

contract State {
    mapping(string => bytes) private _state;


    _state["name"] = abi.encode("");
    abi.decode(_state["name"], (string));

}