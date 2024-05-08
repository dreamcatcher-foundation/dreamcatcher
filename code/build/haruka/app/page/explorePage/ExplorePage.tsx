import React, {type ReactNode, useEffect, useState} from "react";
import PageHook from "../shared/components/layout/PageHook.tsx";
import LayerHook from "../shared/components/layout/LayerHook.tsx";
import NavigationLayer from "../shared/layer/NavigationLayer.tsx";

export default function ExplorePage(): ReactNode {
    const [vaults, setVaults] = useState<string>();
    
    useEffect(function() {
        
    }, []);

    return (
        <PageHook
        uniqueId="explorePage">
            <LayerHook
            uniqueId="explorePage.contentLayer">

            </LayerHook>
            <NavigationLayer/>
        </PageHook>
    );
}