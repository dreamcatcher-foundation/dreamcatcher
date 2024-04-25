// SPDX-License-Identifier: UNLICENSED
import {INetworksEngine} from "./INetworksEngine.ts";
import {IMaterialEngine} from "./IMaterialEngine.ts";
import {IHelperEngine} from "./IHelperEngine.ts";

export interface IEngine extends 
    INetworksEngine, 
    IMaterialEngine,
    IHelperEngine {}