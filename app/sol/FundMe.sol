


contract Sale {
    IToken private _usdc = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;
    IToken private _token;
    uint256 private _price;
    uint256 private _amountSold;

    constructor(address token, uint256 price) {
        _token = IToken(token);
        _price = IToken(price);
    }

    function price() public view returns (uint256) {
        return _price;
    }

    function amountSold() public view returns (uint256) {
        return _amountSold;
    }

    function amountLeft() public view returns (uint256) {
        uint8 decimals = _token.decimals
    }

    function cost(uint256 amount) {
        return amount * price();
    }
    
    function fund(uint256 amount) public returns (Result memory) {
        IToken token0Intf = IToken(_token0);
        IToken token1Intf = IToken(_token1);
        uint256 token0Intf.

    }
}