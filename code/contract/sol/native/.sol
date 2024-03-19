



contract Test {
    function test() internal {
        uint256 sum_ = 0;
        for (uint256 i_; i_ < 10; i_++) sum_ += 1;

        sum_ *= 2;
    }
}