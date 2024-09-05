import type {ReactNode} from "react";
import type {FlexColProps} from "@component/FlexColProps";
import {FlexCol} from "@component/FlexCol";
import {useState} from "react";
import {useEffect} from "react";

export interface RetroMinimaStaggeredChildrenWrapperProps extends FlexColProps {
    mountCooldown?: number;
    mountDelay?: number;
}

export function RetroMinimaStaggeredChildrenWrapper({
    mountCooldown,
    mountDelay,
    children,
    ... more
}: RetroMinimaStaggeredChildrenWrapperProps): ReactNode {
    let [mounted, setMounted] = useState<ReactNode[]>([]);

    useEffect(function(): void {
        setTimeout(() => {
            if (!Array.isArray(children)) {
                setMounted(children as any);
                return;
            }
            let cooldown: number = 0;
            for (let i = 0; i < children.length; i += 1) {
                setTimeout(function(): void {
                    setMounted(function(mounted): ReactNode[] {
                        return [... mounted, children[i]];
                    });
                    return;
                }, cooldown += mountCooldown??0);
            }
            return;
        }, mountDelay);
        return;
    }, [children]);

    return <FlexCol {... more}>{mounted}</FlexCol>;
}