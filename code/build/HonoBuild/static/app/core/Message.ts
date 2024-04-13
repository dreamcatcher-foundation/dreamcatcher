export enum Message {
    /** ... RenderRequest */
    RenderRequestText,
    RenderRequestStyle,
    RenderRequestSpring,
    RenderRequestState,
    RenderRequestPush,
    RenderRequestSwap,
    RenderRequestWipe,
    RenderRequestPop,

    /** ... ReactComponent */
    ReactComponentOnChange,
    ReactComponentOnMouseEnter,
    ReactComponentOnMouseLeave,
    ReactComponentOnClick,

    /** ... EthersOperator */
    EtherRequestConnect
}