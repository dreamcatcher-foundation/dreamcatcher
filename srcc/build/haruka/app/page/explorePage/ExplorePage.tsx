import React, {type ReactNode, useEffect, useState} from "react";
import PageHook from "../shared/component/layout/PageHook.tsx";
import LayerHook from "../shared/component/layout/LayerHook.tsx";
import NavigationLayer from "../shared/layer/NavigationLayer.tsx";

export default function ExplorePage(): ReactNode {
    const [vaults, setVaults] = useState<string>();
    
    useEffect(function() {
        
    }, []);

    return (
        <PageHook
        nodeKey="explorePage">
            <LayerHook
            nodeKey="explorePage.contentLayer">

            </LayerHook>
            <NavigationLayer/>
        </PageHook>
    );
}