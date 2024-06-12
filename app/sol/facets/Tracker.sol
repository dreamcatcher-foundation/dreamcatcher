library TrackerLib {
    struct Tracker {
        address[32] tokens;
    }

    function hasToken(Tracker storage tracker, address token) internal view returns (bool) {
        for (uint8 i = 0; i < tracker.tokens.length; i++) {
            if (tracker.tokens[i] == token) {
                return true;
            }
        }
        return false;
    }
}