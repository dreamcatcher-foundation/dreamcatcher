import { createContext, useContext } from "react";
import * as Account from "@lib/Account.tsx";

let State = createContext<typeof Account>(Account);
