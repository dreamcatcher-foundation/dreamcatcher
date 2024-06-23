// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IToken } from "./IToken.sol";
import { FixedPointMath } from "./FixedPointMath.sol";
import { Result } from "./Result.sol";

library TokenIntf {
    using TokenIntf for address;
    using FixedPointMath for uint256;

    function name(address self) internal view returns (Result, string memory) {
        try _intf(self).name() returns (string memory name) {
            return (Result.OK, name);
        }
        catch {
            return (Result.UNABLE_TO_FETCH_TOKEN_NAME, "");
        }
    }

    function symbol(address self) internal view returns (Result, string memory) {
        try _intf(self).symbol() returns (string memory symbol) {
            return (Result.OK, symbol);
        }
        catch {
            return (Result.UNABLE_TO_FETCH_TOKEN_SYMBOL, "");
        }
    }

    function decimals(address self) internal view returns (Result, uint8) {
        try _intf(self).decimals() returns (uint8 decimals) {
            return (Result.OK, decimals);
        }
        catch {
            return (Result.UNABLE_TO_FETCH_TOKEN_DECIMALS, 0);
        }
    }

    function totalSupply(address self) internal view returns (Result, uint256) {
        uint8 decimals;
        {
            (Result r, uint8 v) = self.decimals();
            if (r != Result.OK) {
                return (r, 0);
            }
            decimals = v;
        }
        uint256 totalSupplyN ;
        {
            try _intf(self).totalSupply() returns (uint256 result) {
                totalSupplyN = result;
            }
            catch {
                return (Result.UNABLE_TO_FETCH_TOKEN_TOTAL_SUPPLY, 0);
            }
        }
        uint256 totalSupply = 0;
        {
            (Result r, uint256 v) = totalSupplyN.cast(decimals, 18);
            if (r != Result.OK) {
                return (r, 0);
            }
            totalSupply = v;
        }
        return totalSupply;
    }

    function callerBalance(address self) internal view returns (uint256) {
        return self.balanceOf(msg.sender);
    }

    function balance(address self) internal view returns (uint256) {
        return self.balanceOf(address(this));
    }

    function balanceOf(address self, address account) internal view returns (uint256) {
        uint8 decimals = 0;
        {
            (Result r, uint8 v) = self.decimals();
            if (r != Result.OK) {
                return (r, 0);
            }
            decimals = v;
        }
        uint256 balanceN = 0;
        {
            try _intf(self).balanceOf(account) returns (uint256 result) {
                balanceN = result;
            }
            catch {
                return (Result)
            }
        }


        uint256 valueN = _intf(self).balanceOf(account);
        uint256 value = valueN.cast(decimals, 18);
        return value;
    }

    function callerAllowance(address self) internal view returns (uint256) {
        return self.allowance(msg.sender, address(this));
    }

    function allowance(address self, address owner, address spender) internal view returns (uint256) {
        uint8 decimals;
        {
            (Result r, uint8 v) = self.decimals();
            if (r != Result.OK) {
                
            }
        }

        uint8 decimals = _intf(self).decimals();
        uint256 valueN = _intf(self).allowance(owner, spender);
        uint256 value = valueN.cast(decimals, 18);
        return value;
    }

    function transfer(address self, address to, uint256 amount) internal returns (Result) {
        uint8 decimals = _intf(self).decimals();
        uint256 amountN = amount.cast(18, decimals);
        bool success = _intf(self).transfer(to, amountN);
        if (!success) {
            return Result.ERROR;
        }
        return Result.Ok;
    }

    function requestPayment(address self, uint256 amountIn) internal returns (Result) {
        return self.transferFrom(msg.sender, address(this));
    }

    function transferFrom(address self, address from, address to, uint256 amount) internal returns (Result) {
        if (self.allowance(from, to) < amount) {
            return Result.INSUFFICIENT_ALLOWANCE;
        }
        if (self.balanceOf(from) < amount) {
            return Result.INSUFFICIENT_BALANCE;
        }
        uint8 decimals = self.decimals();
        uint256 amountN = amount.cast(18, decimals);
        bool success = _intf(self).transferFrom(from, to, amountN);
        if (!success) {
            return Result.ERROR;
        }
        return Result.OK;
    }

    function approve(address self, address spender, uint256 amount) internal returns (Result) {
        uint8 decimals = self.decimals();
        uint256 amountN = amount.cast(18, decimals);
        bool success = _intf(self).approve(spender, amountN);
        if (!success) {
            return Result.ERROR;
        }
        return Result.OK;
    }

    function _intf(address token) private view returns (IToken) {
        return IToken(token);
    }
}