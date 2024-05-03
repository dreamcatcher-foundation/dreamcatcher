import React, {type ReactNode, useState} from "react";
import RowHook, {type RowHookProps} from "../RowHook.tsx";
import ColumnHook, {type ColumnHookProps} from "../ColumnHook.tsx";
import Text from "../../text/Text.tsx"





export interface WindowHookProps extends ColumnHookProps {
    isDraggable?: boolean;
    isClosable?: boolean;
    isMinimizable?: boolean;
}

export default function WindowHook(_props: WindowHookProps): ReactNode {
    const {uniqueId, isDraggable} = _props;
    const [position, setPosition] = useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});
    return (
        <ColumnHook
        uniqueId={`${uniqueId}.wrapper`}
        childrenMountCooldown={100n}>
            <ColumnHook
            uniqueId={uniqueId}
            style={{
                width: "500px",
                height: "500px",
                background: "#171717",
                justifyContent: "start",
                position: "absolute",
                left: position.x,
                top: position.y
            }}>
                <RowHook
                uniqueId={uniqueId}
                style={{
                    width: "100%",
                    height: "25px",
                    justifyContent: "end",
                    background: "#202020"
                }}>
                    <Text
                    text="Welcome To Dreamcatcher">
                    </Text>
                    <ColumnHook
                    uniqueId={`${uniqueId}.bar.minimizeButton`}
                    spring={{
                        width: "20px",
                        height: "20px"
                    }}
                    style={{
                        borderStyle: "solid",
                        borderWidth: ".5px",
                        borderColor: "#D6D5D4",
                        color: "white"
                    }}>
                        -
                    </ColumnHook>
                </RowHook>
            </ColumnHook>
        </ColumnHook>
    );
}



