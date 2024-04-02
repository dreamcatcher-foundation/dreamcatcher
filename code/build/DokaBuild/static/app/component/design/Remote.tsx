import {type CSSProperties, useEffect, useState} from "react";
import {type SpringProps, animated, useSpring} from "react-spring";
import {EventEmitter} from "fbemitter";

export const network = (function() {
    let self: EventEmitter;
    return function() {
        if (!self) {
            self = new EventEmitter();
        }
        return self;
    }
})();

export function on(event: string, listener: Function, context?: any) {
    return network().addListener(event, listener, context);
}

export function broadcast(event: string, ...params: any[]) {
    return network().emit(event, ...params);
}

/**
 * -> A dynamic component that can render based on events on a selected
 *    network. If the network is declared globally or a singleton
 *    then any component can use the network to communicate across
 *    the application.
 * 
 * -> The key event structure is:
 *  
 *          1) ${name} render spring
 *          2) ${name} render style
 *          3) ${name} get spring
 *          4) ${name} get style
 *          5) ${name} spring
 *          6) ${name} stylesheet
 * 
 * -> Remote uses react spring for natural transitions. When a new
 *    spring is given, it will smoothly transition to the new targets which
 *    may be position, color, or more.
 * 
 * -> For properties which are not supported by spring, a stylesheet can be
 *    used to do the same.
 */
export interface IRemoteProps {
    name: string;
    initSpring?: SpringProps;
    initStyle?: CSSProperties;
    children?: JSX.Element | (JSX.Element)[];
    onAbort?: Function;
    onAbortCapture?: Function;
    onAnimationEnd?: Function;
    onAnimationEndCapture?: Function;
    onAnimationIteration?: Function;
    onAnimationIterationCapture?: Function;
    onAnimationStart?: Function;
    onAnimationStartCapture?: Function;
    onAuxClick?: Function;
    onAuxClickCapture?: Function;
    onBeforeInput?: Function;
    onBeforeInputCapture?: Function;
    onBlur?: Function;
    onBlurCapture?: Function;
    onCanPlay?: Function;
    onCanPlayCapture?: Function;
    onCanPlayThrough?: Function;
    onCanPlayThroughCapture?: Function;
    onChange?: Function;
    onChangeCapture?: Function;
    onClick?: Function;
    onClickCapture?: Function;
    onCompositionEnd?: Function;
    onCompositionEndCapture?: Function;
    onCompositionStart?: Function;
    onCompositionStartCapture?: Function;
    onCompositionUpdate?: Function;
    onCompositionUpdateCapture?: Function;
    onContextMenu?: Function;
    onContextMenuCapture?: Function;
    onCopy?: Function;
    onCopyCapture?: Function;
    onCut?: Function;
    onCutCapture?: Function;
    onDoubleClick?: Function;
    onDoubleClickCapture?: Function;
    onDrag?: Function;
    onDragCapture?: Function;
    onDragEnd?: Function;
    onDragEndCapture?: Function;
    onDragEnter?: Function;
    onDragEnterCapture?: Function;
    onDragExit?: Function;
    onDragExitCapture?: Function;
    onDragLeave?: Function;
    onDragLeaveCapture?: Function;
    onDragOver?: Function;
    onDragOverCapture?: Function;
    onDragStart?: Function;
    onDragStartCapture?: Function;
    onDrop?: Function;
    onDropCapture?: Function;
    onDurationChange?: Function;
    onDurationChangeCapture?: Function;
    onEmptied?: Function;
    onEmptiedCapture?: Function;
    onEncrypted?: Function;
    onEncryptedCapture?: Function;
    onEnded?: Function;
    onEndedCapture?: Function;
    onError?: Function;
    onErrorCapture?: Function;
    onFocus?: Function;
    onFocusCapture?: Function;
    onGotPointerCapture?: Function;
    onGotPointerCaptureCapture?: Function;
    onInput?: Function;
    onInputCapture?: Function;
    onInvalid?: Function;
    onInvalidCapture?: Function;
    onKeyDown?: Function;
    onKeyDownCapture?: Function;
    onKeyUp?: Function;
    onKeyUpCapture?: Function;
    onLoad?: Function;
    onLoadCapture?: Function;
    onLoadStart?: Function;
    onLoadStartCapture?: Function;
    onLoadedData?: Function;
    onLoadedDataCapture?: Function;
    onLoadedMetadata?: Function;
    onLoadedMetadataCapture?: Function;
    onLostPointerCapture?: Function;
    onLostPointerCaptureCapture?: Function;
    onMouseDown?: Function;
    onMouseDownCapture?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onMouseMove?: Function;
    onMouseMoveCapture?: Function;
    onMouseOut?: Function;
    onMouseOutCapture?: Function;
    onMouseOver?: Function;
    onMouseOverCapture?: Function;
    onMouseUp?: Function;
    onMouseUpCapture?: Function;
    onPaste?: Function;
    onPasteCapture?: Function;
    onPause?: Function;
    onPauseCapture?: Function;
    onPlay?: Function;
    onPlayCapture?: Function;
    onPlaying?: Function;
    onPlayingCapture?: Function;
    onPointerCancel?: Function;
    onPointerCancelCapture?: Function;
    onPointerDown?: Function;
    onPointerDownCapture?: Function;
    onPointerEnter?: Function;
    onPointerEnterCapture?: Function;
    onPointerLeave?: Function;
    onPointerLeaveCapture?: Function;
    onPointerMove?: Function;
    onPointerMoveCapture?: Function;
    onPointerOut?: Function;
    onPointerOutCapture?: Function;
    onPointerOver?: Function;
    onPointerOverCapture?: Function;
    onPointerUp?: Function;
    onPointerUpCapture?: Function;
    onProgress?: Function;
    onProgressCapture?: Function;
    onRateChange?: Function;
    onRateChangeCapture?: Function;
    onReset?: Function;
    onResetCapture?: Function;
    onResize?: Function;
    onResizeCapture?: Function;
    onScroll?: Function;
    onScrollCapture?: Function;
    onSeeked?: Function;
    onSeekedCapture?: Function;
    onSeeking?: Function;
    onSeekingCapture?: Function;
    onSelect?: Function;
    onSelectCapture?: Function;
    onStalled?: Function;
    onStalledCapture?: Function;
    onSubmit?: Function;
    onSubmitCapture?: Function;
    onSuspend?: Function;
    onSuspendCapture?: Function;
    onTimeUpdate?: Function;
    onTimeUpdateCapture?: Function;
    onTouchCancel?: Function;
    onTouchCancelCapture?: Function;
    onTouchEnd?: Function;
    onTouchEndCapture?: Function;
    onTouchMove?: Function;
    onTouchMoveCapture?: Function;
    onTouchStart?: Function;
    onTouchStartCapture?: Function;
    onTransitionEnd?: Function;
    onTransitionEndCapture?: Function;
    onVolumeChange?: Function;
    onVolumeChangeCapture?: Function;
    onWaiting?: Function;
    onWaitingCapture?: Function;
    onWheel?: Function;
    onWheelCapture?: Function;
}

export default function Remote(props: IRemoteProps) {
    function doNothing() {}
    const name = props.name;
    const initSpring = props.initSpring ?? {};
    const initStyle = props.initStyle ?? {};
    const children = props.children;
    const onAbort = props.onAbort ?? doNothing;
    const onAbortCapture = props.onAbort ?? doNothing;
    const onAnimationEnd = props.onAnimationEnd ?? doNothing;
    const onAnimationEndCapture = props.onAnimationEndCapture ?? doNothing;
    const onAnimationIteration = props.onAnimationIteration ?? doNothing;
    const onAnimationIterationCapture = props.onAnimationIterationCapture ?? doNothing;
    const onAnimationStart = props.onAnimationStart ?? doNothing;
    const onAnimationStartCapture = props.onAnimationStartCapture ?? doNothing;
    const onAuxClick = props.onAuxClick ?? doNothing;
    const onAuxClickCapture = props.onAuxClickCapture ?? doNothing;
    const onBeforeInput = props.onBeforeInput ?? doNothing;
    const onBeforeInputCapture = props.onBeforeInputCapture ?? doNothing;
    const onBlur = props.onBlur ?? doNothing;
    const onBlurCapture = props.onBlurCapture ?? doNothing;
    const onCanPlay = props.onCanPlay ?? doNothing;
    const onCanPlayCapture = props.onCanPlayCapture ?? doNothing;
    const onCanPlayThrough = props.onCanPlayThrough ?? doNothing;
    const onCanPlayThroughCapture = props.onCanPlayThroughCapture ?? doNothing;
    const onChange = props.onChange ?? doNothing;
    const onChangeCapture = props.onChangeCapture ?? doNothing;
    const onClick = props.onClick ?? doNothing;
    const onClickCapture = props.onClickCapture ?? doNothing;
    const onCompositionEnd = props.onCompositionEnd ?? doNothing;
    const onCompositionEndCapture = props.onCompositionEndCapture ?? doNothing;
    const onCompositionStart = props.onCompositionStart ?? doNothing;
    const onCompositionStartCapture = props.onCompositionStartCapture ?? doNothing;
    const onCompositionUpdate = props.onCompositionUpdate ?? doNothing;
    const onCompositionUpdateCapture = props.onCompositionUpdateCapture ?? doNothing;
    const onContextMenu = props.onContextMenu ?? doNothing;
    const onContextMenuCapture = props.onContextMenuCapture ?? doNothing;
    const onCopy = props.onCopy ?? doNothing;
    const onCopyCapture = props.onCopyCapture ?? doNothing;
    const onCut = props.onCut ?? doNothing;
    const onCutCapture = props.onCutCapture ?? doNothing;
    const onDoubleClick = props.onDoubleClick ?? doNothing;
    const onDoubleClickCapture = props.onDoubleClickCapture ?? doNothing;
    const onDrag = props.onDrag ?? doNothing;
    const onDragCapture = props.onDragCapture ?? doNothing;
    const onDragEnd = props.onDragEnd ?? doNothing;
    const onDragEndCapture = props.onDragEndCapture ?? doNothing;
    const onDragEnter = props.onDragEnter ?? doNothing;
    const onDragEnterCapture = props.onDragEnterCapture ?? doNothing;
    const onDragExit = props.onDragExit ?? doNothing;
    const onDragExitCapture = props.onDragExitCapture ?? doNothing;
    const onDragLeave = props.onDragLeave ?? doNothing;
    const onDragLeaveCapture = props.onDragLeaveCapture ?? doNothing;
    const onDragOver = props.onDragOver ?? doNothing;
    const onDragOverCapture = props.onDragOverCapture ?? doNothing;
    const onDragStart = props.onDragStart ?? doNothing;
    const onDragStartCapture = props.onDragStartCapture ?? doNothing;
    const onDrop = props.onDrop ?? doNothing;
    const onDropCapture = props.onDropCapture ?? doNothing;
    const onDurationChange = props.onDurationChange ?? doNothing;
    const onDurationChangeCapture = props.onDurationChangeCapture ?? doNothing;
    const onEmptied = props.onEmptied ?? doNothing;
    const onEmptiedCapture = props.onEmptiedCapture ?? doNothing;
    const onEncrypted = props.onEncrypted ?? doNothing;
    const onEncryptedCapture = props.onEncryptedCapture ?? doNothing;
    const onEnded = props.onEnded ?? doNothing;
    const onEndedCapture = props.onEndedCapture ?? doNothing;
    const onError = props.onError ?? doNothing;
    const onErrorCapture = props.onErrorCapture ?? doNothing;
    const onFocus = props.onFocus ?? doNothing;
    const onFocusCapture = props.onFocusCapture ?? doNothing;
    const onGotPointerCapture = props.onGotPointerCapture ?? doNothing;
    const onGotPointerCaptureCapture = props.onGotPointerCaptureCapture ?? doNothing;
    const onInput = props.onInput ?? doNothing;
    const onInputCapture = props.onInputCapture ?? doNothing;
    const onInvalid = props.onInvalid ?? doNothing;
    const onInvalidCapture = props.onInvalidCapture ?? doNothing;
    const onKeyDown = props.onKeyDown ?? doNothing;
    const onKeyDownCapture = props.onKeyDownCapture ?? doNothing;
    const onKeyUp = props.onKeyUp ?? doNothing;
    const onKeyUpCapture = props.onKeyUpCapture ?? doNothing;
    const onLoad = props.onLoad ?? doNothing;
    const onLoadCapture = props.onLoadCapture ?? doNothing;
    const onLoadStart = props.onLoadStart ?? doNothing;
    const onLoadStartCapture = props.onLoadStartCapture ?? doNothing;
    const onLoadedData = props.onLoadedData ?? doNothing;
    const onLoadedDataCapture = props.onLoadedDataCapture ?? doNothing;
    const onLoadedMetadata = props.onLoadedMetadata ?? doNothing;
    const onLoadedMetadataCapture = props.onLoadedMetadataCapture ?? doNothing;
    const onLostPointerCapture = props.onLostPointerCapture ?? doNothing;
    const onLostPointerCaptureCapture = props.onLostPointerCaptureCapture ?? doNothing;
    const onMouseDown = props.onMouseDown ?? doNothing;
    const onMouseDownCapture = props.onMouseDownCapture ?? doNothing;
    const onMouseEnter = props.onMouseEnter ?? doNothing;
    const onMouseLeave = props.onMouseLeave ?? doNothing;
    const onMouseMove = props.onMouseMove ?? doNothing;
    const onMouseMoveCapture = props.onMouseMoveCapture ?? doNothing;
    const onMouseOut = props.onMouseOut ?? doNothing;
    const onMouseOutCapture = props.onMouseOutCapture ?? doNothing;
    const onMouseOver = props.onMouseOver ?? doNothing;
    const onMouseOverCapture = props.onMouseOverCapture ?? doNothing;
    const onMouseUp = props.onMouseUp ?? doNothing;
    const onMouseUpCapture = props.onMouseUpCapture ?? doNothing;
    const onPaste = props.onPaste ?? doNothing;
    const onPasteCapture = props.onPasteCapture ?? doNothing;
    const onPause = props.onPause ?? doNothing;
    const onPauseCapture = props.onPauseCapture ?? doNothing;
    const onPlay = props.onPlay ?? doNothing;
    const onPlayCapture = props.onPlayCapture ?? doNothing;
    const onPlaying = props.onPlaying ?? doNothing;
    const onPlayingCapture = props.onPlayingCapture ?? doNothing;
    const onPointerCancel = props.onPointerCancel ?? doNothing;
    const onPointerCancelCapture = props.onPointerCancelCapture ?? doNothing;
    const onPointerDown = props.onPointerDown ?? doNothing;
    const onPointerDownCapture = props.onPointerDownCapture ?? doNothing;
    const onPointerEnter = props.onPointerEnter ?? doNothing;
    const onPointerEnterCapture = props.onPointerEnterCapture ?? doNothing;
    const onPointerLeave = props.onPointerLeave ?? doNothing;
    const onPointerLeaveCapture = props.onPointerLeaveCapture ?? doNothing;
    const onPointerMove = props.onPointerMove ?? doNothing;
    const onPointerMoveCapture = props.onPointerMoveCapture ?? doNothing;
    const onPointerOut = props.onPointerOut ?? doNothing;
    const onPointerOutCapture = props.onPointerOutCapture ?? doNothing;
    const onPointerOver = props.onPointerOver ?? doNothing;
    const onPointerOverCapture = props.onPointerOverCapture ?? doNothing;
    const onPointerUp = props.onPointerUp ?? doNothing;
    const onPointerUpCapture = props.onPointerUpCapture ?? doNothing;
    const onProgress = props.onProgress ?? doNothing;
    const onProgressCapture = props.onProgressCapture ?? doNothing;
    const onRateChange = props.onRateChange ?? doNothing;
    const onRateChangeCapture = props.onRateChangeCapture ?? doNothing;
    const onReset = props.onReset ?? doNothing;
    const onResetCapture = props.onResetCapture ?? doNothing;
    const onResize = props.onResize ?? doNothing;
    const onResizeCapture = props.onResizeCapture ?? doNothing;
    const onScroll = props.onScroll ?? doNothing;
    const onScrollCapture = props.onScrollCapture ?? doNothing;
    const onSeeked = props.onSeeked ?? doNothing;
    const onSeekedCapture = props.onSeekedCapture ?? doNothing;
    const onSeeking = props.onSeeking ?? doNothing;
    const onSeekingCapture = props.onSeekingCapture ?? doNothing;
    const onSelect = props.onSelect ?? doNothing;
    const onSelectCapture = props.onSelectCapture ?? doNothing;
    const onStalled = props.onStalled ?? doNothing;
    const onStalledCapture = props.onStalledCapture ?? doNothing;
    const onSubmit = props.onSubmit ?? doNothing;
    const onSubmitCapture = props.onSubmitCapture ?? doNothing;
    const onSuspend = props.onSuspend ?? doNothing;
    const onSuspendCapture = props.onSuspendCapture ?? doNothing;
    const onTimeUpdate = props.onTimeUpdate ?? doNothing;
    const onTimeUpdateCapture = props.onTimeUpdateCapture ?? doNothing;
    const onTouchCancel = props.onTouchCancel ?? doNothing;
    const onTouchCancelCapture = props.onTouchCancelCapture ?? doNothing;
    const onTouchEnd = props.onTouchEnd ?? doNothing;
    const onTouchEndCapture = props.onTouchEnd ?? doNothing;
    const onTouchMove = props.onTouchMove ?? doNothing;
    const onTouchMoveCapture = props.onTouchMoveCapture ?? doNothing;
    const onTouchStart = props.onTouchStart ?? doNothing;
    const onTouchStartCapture = props.onTouchStartCapture ?? doNothing;
    const onTransitionEnd = props.onTransitionEnd ?? doNothing;
    const onTransitionEndCapture = props.onTransitionEndCapture ?? doNothing;
    const onVolumeChange = props.onVolumeChange ?? doNothing;
    const onVolumeChangeCapture = props.onVolumeChangeCapture ?? doNothing;
    const onWaiting = props.onWaiting ?? doNothing;
    const onWaitingCapture = props.onWaitingCapture ?? doNothing;
    const onWheel = props.onWheel ?? doNothing;
    const onWheelCapture = props.onWheelCapture ?? doNothing;
    const [spring, setSpring] = useState([{}, {}]);
    const [style, setStyle] = useState({});
    useEffect(function() {
        on(`${name} render spring`, (to: SpringProps) => setSpring(currentSpring => [currentSpring[1], {...currentSpring[1], ...to}]));
        on(`${name} render style`, (to: CSSProperties) => setStyle(currentStyle => ({...currentStyle, ...to})));
        on(`${name} get spring`, () => broadcast(`${name} spring`, spring));
        on(`${name} get style`, () => broadcast(`${name} style`, style));
        if (initSpring) {
            broadcast(`${name} render spring`, initSpring);
        }
        if (initStyle) {
            broadcast(`${name} render style`, initStyle);
        }
    }, []);
    return (
        <animated.div 
        style={{...useSpring({from: spring[0], to: spring[1]}), ...style}}
        onAbort={onAbort as any}
        onAbortCapture={onAbortCapture as any}
        onAnimationEnd={onAnimationEnd as any}
        onAnimationEndCapture={onAnimationEndCapture as any}
        onAnimationIteration={onAnimationIteration as any}
        onAnimationIterationCapture={onAnimationIterationCapture as any}
        onAnimationStart={onAnimationStart as any}
        onAnimationStartCapture={onAnimationStartCapture as any}
        onAuxClick={onAuxClick as any}
        onAuxClickCapture={onAuxClickCapture as any}
        onBeforeInput={onBeforeInput as any}
        onBeforeInputCapture={onBeforeInputCapture as any}
        onBlur={onBlur as any}
        onBlurCapture={onBlurCapture as any}
        onCanPlay={onCanPlay as any}
        onCanPlayCapture={onCanPlayCapture as any}
        onCanPlayThrough={onCanPlayThrough as any}
        onCanPlayThroughCapture={onCanPlayThroughCapture as any}
        onChange={onChange as any}
        onChangeCapture={onChangeCapture as any}
        onClick={onClick as any}
        onClickCapture={onClickCapture as any}
        onCompositionEnd={onCompositionEnd as any}
        onCompositionEndCapture={onCompositionEndCapture as any}
        onCompositionStart={onCompositionStart as any}
        onCompositionStartCapture={onCompositionStartCapture as any}
        onCompositionUpdate={onCompositionUpdate as any}
        onCompositionUpdateCapture={onCompositionUpdateCapture as any}
        onContextMenu={onContextMenu as any}
        onContextMenuCapture={onContextMenuCapture as any}
        onCopy={onCopy as any}
        onCopyCapture={onCopyCapture as any}
        onCut={onCut as any}
        onCutCapture={onCutCapture as any}
        onDoubleClick={onDoubleClick as any}
        onDoubleClickCapture={onDoubleClickCapture as any}
        onDrag={onDrag as any}
        onDragCapture={onDragCapture as any}
        onDragEnd={onDragEnd as any}
        onDragEndCapture={onDragEndCapture as any}
        onDragEnter={onDragEnter as any}
        onDragEnterCapture={onDragEnterCapture as any}
        onDragExit={onDragExit as any}
        onDragExitCapture={onDragExitCapture as any}
        onDragLeave={onDragLeave as any}
        onDragLeaveCapture={onDragLeaveCapture as any}
        onDragOver={onDragOver as any}
        onDragOverCapture={onDragOverCapture as any}
        onDragStart={onDragStart as any}
        onDragStartCapture={onDragStartCapture as any}
        onDrop={onDrop as any}
        onDropCapture={onDropCapture as any}
        onDurationChange={onDurationChange as any}
        onDurationChangeCapture={onDurationChangeCapture as any}
        onEmptied={onEmptied as any}
        onEmptiedCapture={onEmptiedCapture as any}
        onEncrypted={onEncrypted as any}
        onEncryptedCapture={onEncryptedCapture as any}
        onEnded={onEnded as any}
        onEndedCapture={onEndedCapture as any}
        onError={onError as any}
        onErrorCapture={onErrorCapture as any}
        onFocus={onFocus as any}
        onFocusCapture={onFocusCapture as any}
        onGotPointerCapture={onGotPointerCapture as any}
        onGotPointerCaptureCapture={onGotPointerCaptureCapture as any}
        onInput={onInput as any}
        onInputCapture={onInputCapture as any}
        onInvalid={onInvalid as any}
        onInvalidCapture={onInvalidCapture as any}
        onKeyDown={onKeyDown as any}
        onKeyDownCapture={onKeyDownCapture as any}
        onKeyUp={onKeyUp as any}
        onKeyUpCapture={onKeyUpCapture as any}
        onLoad={onLoad as any}
        onLoadCapture={onLoadCapture as any}
        onLoadStart={onLoadStart as any}
        onLoadStartCapture={onLoadStartCapture as any}
        onLoadedData={onLoadedData as any}
        onLoadedDataCapture={onLoadedDataCapture as any}
        onLoadedMetadata={onLoadedMetadata as any}
        onLoadedMetadataCapture={onLoadedMetadataCapture as any}
        onLostPointerCapture={onLostPointerCapture as any}
        onLostPointerCaptureCapture={onLostPointerCaptureCapture as any}
        onMouseDown={onMouseDown as any}
        onMouseDownCapture={onMouseDownCapture as any}
        onMouseEnter={onMouseEnter as any}
        onMouseLeave={onMouseLeave as any}
        onMouseMove={onMouseMove as any}
        onMouseMoveCapture={onMouseMoveCapture as any}
        onMouseOut={onMouseOut as any}
        onMouseOutCapture={onMouseOutCapture as any}
        onMouseOver={onMouseOver as any}
        onMouseOverCapture={onMouseOverCapture as any}
        onMouseUp={onMouseUp as any}
        onMouseUpCapture={onMouseUpCapture as any}
        onPaste={onPaste as any}
        onPasteCapture={onPasteCapture as any}
        onPause={onPause as any}
        onPauseCapture={onPauseCapture as any}
        onPlay={onPlay as any}
        onPlayCapture={onPlayCapture as any}
        onPlaying={onPlaying as any}
        onPlayingCapture={onPlayingCapture as any}
        onPointerCancel={onPointerCancel as any}
        onPointerCancelCapture={onPointerCancelCapture as any}
        onPointerDown={onPointerDown as any}
        onPointerDownCapture={onPointerDownCapture as any}
        onPointerEnter={onPointerEnter as any}
        onPointerEnterCapture={onPointerEnterCapture as any}
        onPointerLeave={onPointerLeave as any}
        onPointerLeaveCapture={onPointerLeaveCapture as any}
        onPointerMove={onPointerMove as any}
        onPointerMoveCapture={onPointerMoveCapture as any}
        onPointerOut={onPointerOut as any}
        onPointerOutCapture={onPointerOutCapture as any}
        onPointerOver={onPointerOver as any}
        onPointerOverCapture={onPointerOverCapture as any}
        onPointerUp={onPointerUp as any}
        onPointerUpCapture={onPointerUpCapture as any}
        onProgress={onProgress as any}
        onProgressCapture={onProgressCapture as any}
        onRateChange={onRateChange as any}
        onRateChangeCapture={onRateChangeCapture as any}
        onReset={onReset as any}
        onResetCapture={onResetCapture as any}
        onResize={onResize as any}
        onResizeCapture={onResizeCapture as any}
        onScroll={onScroll as any}
        onScrollCapture={onScrollCapture as any}
        onSeeked={onSeeked as any}
        onSeekedCapture={onSeekedCapture as any}
        onSeeking={onSeeking as any}
        onSeekingCapture={onSeekingCapture as any}
        onSelect={onSelect as any}
        onSelectCapture={onSelectCapture as any}
        onStalled={onStalled as any}
        onStalledCapture={onStalledCapture as any}
        onSubmit={onSubmit as any}
        onSubmitCapture={onSubmitCapture as any}
        onSuspend={onSuspend as any}
        onSuspendCapture={onSuspendCapture as any}
        onTimeUpdate={onTimeUpdate as any}
        onTimeUpdateCapture={onTimeUpdateCapture as any}
        onTouchCancel={onTouchCancel as any}
        onTouchCancelCapture={onTouchCancelCapture as any}
        onTouchEnd={onTouchEnd as any}
        onTouchEndCapture={onTouchEndCapture as any}
        onTouchMove={onTouchMove as any}
        onTouchMoveCapture={onTouchMoveCapture as any}
        onTouchStart={onTouchStart as any}
        onTouchStartCapture={onTouchStartCapture as any}
        onTransitionEnd={onTransitionEnd as any}
        onTransitionEndCapture={onTransitionEndCapture as any}
        onVolumeChange={onVolumeChange as any}
        onVolumeChangeCapture={onVolumeChangeCapture as any}
        onWaiting={onWaiting as any}
        onWaitingCapture={onWaitingCapture as any}
        onWheel={onWheel as any}
        onWheelCapture={onWheelCapture as any}>
            {children}
        </animated.div>
    );
}