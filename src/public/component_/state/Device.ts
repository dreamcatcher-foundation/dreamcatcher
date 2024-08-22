import {useState} from "react";
import {useEffect} from "react";
import {Col} from "@component/Col";

export function isLaptop() {
    return window.matchMedia("(min-width: 1024px)");
}
export function isTablet() {
    return window.matchMedia("(min-width: 768px)");
}
export function isMobile() {
    return window.matchMedia("(min-width: 320px)");
}

export type ScreenType =
    | "Desktop"
    | "Laptop"
    | "Tablet"
    | "Mobile";

export function useScreenType(): ScreenType {
    let [screenType, setScreenType] = useState<ScreenType>("Desktop");
    useEffect(() => {
        {
            _update();
            _onResize(_update);
            return () => _cleanup(_update);
        }
        function _update(): void {
            if (isLaptop()) setScreenType("Laptop");
            if (isTablet()) setScreenType("Tablet");
            if (isMobile()) setScreenType("Mobile");
            else setScreenType("Desktop");
            return;
        }
        function _onResize(update: EventListenerOrEventListenerObject): void {
            return window.addEventListener("resize", update);
        }
        function _cleanup(update: EventListenerOrEventListenerObject): void {
            return window.removeEventListener("resize", update);
        }
    }, []);
    return screenType;
}

export function Responsive() {
    
}