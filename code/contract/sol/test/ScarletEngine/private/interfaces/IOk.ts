// SPDX-License-Identifier: UNLICENSED

export interface IOk {
    ok: boolean;
    markSafe: () => boolean;
    markUnsafe: () => boolean;
}