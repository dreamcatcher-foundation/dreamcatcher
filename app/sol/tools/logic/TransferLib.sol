// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IERC20 } from "../../import/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "../../import/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { FixedPointValue } from "../math/fixedPoint/FixedPointValue.sol";
import { FixedPointValueConversionLib } from "../math/fixedPoint/FixedPointValueConversionLib.sol";
import { FixedPointValueMathLib } from "../math/fixedPoint/FixedPointValueMathLib.sol";

library TransferLib {
    function request(address token, FixedPointValue memory amount) internal returns (bool) {
        IERC20(token).transferFrom(
            msg.sender,
            address(this),
            FixedPointValueConversionLib.toNewDecimals(
                amount,
                decimals
            ).value
        );
        return true;
    }

    function send(address token, FixedPointValue memory amount) internal returns (bool) {
        IERC20(token).transfer(
            msg.sender,
            FixedPointValueConversionLib.toNewDecimals(
                amount,
                IERC20Metadata(token).decimals()
            ).value
        );
        return true;
    }

    function sendSlice(address token, FixedPointValue memory slice) internal returns (bool) {
        send(
            token,
            FixedPointValueConversionLib.toNewDecimals(
                FixedPointValueMathLib.slice(
                    FixedPointValueConversionLib.toEther(
                        FixedPointValue({
                            value: IERC20(token).balanceOf(address(this)),
                            decimals: IERC20Metadata(token).decimals()
                        })
                    ),
                    slice,
                    18
                ),
                IERC20Metadata(token).decimals()
            )
        );
        return true;
    }
}