import type {SizeProps} from "@component/SizeProps";
import type {BaseProps} from "@component/BaseProps";
import type {FlexProps} from "@component/FlexProps";

export type FlexColProps 
    = 
    & BaseProps
    & SizeProps
    & Omit<FlexProps, "flexDirection">;