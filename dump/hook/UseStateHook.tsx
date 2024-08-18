import type { ComponentPropsWithRef } from "react";
import type { AnimatedProps } from "react-spring";
import type { Dispatch } from "react";
import type { SetStateAction } from "react";
import type { ElementType } from "react";
import { useState as useStateReact } from "react";
export type StaticProps<T extends ElementType> = ComponentPropsWithRef<T>;
export type SpringProps<T extends ElementType> = AnimatedProps<ComponentPropsWithRef<T>>;
export type Props<T extends ElementType> = StaticProps<T> | SpringProps<T>;
export type Setter<T> = Dispatch<SetStateAction<T>>
export type UseStateHook<T extends ElementType> = [Props<T>, Setter<Props<T>>];
export function useState<T extends ElementType>(propsInit: Props<T> = {} as Props<T>): UseStateHook<T> {
    let [state, setState] = useStateReact<Props<T>>(propsInit);
    return [state, setState];
}