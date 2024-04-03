import Remote, {type IRemoteProps, on, off} from "./Remote.tsx";
import React, {useEffect, useState} from "react";

export interface IRemoteRowProps extends IRemoteProps {
    width: string;
    height: string;
}

export default function RemoteRow(props: IRemoteRowProps) {
    const name = props.name;
    const width = props.width;
    const height = props.height;
    const initSpring = props.initSpring ?? {};
    const initStyle = props.initStyle ?? {};
    function doNothing() {}
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
    const spring = {
        width: width,
        height: height,
        ...initSpring
    };
    const style = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        ...initStyle
    };
    const [onScreen, setOnScreen] = useState([] as (JSX.Element)[]);
    useEffect(function() {
        function pushBelow(item: JSX.Element) {
            const items = onScreen;
            items.push(item);
            setOnScreen([...items]);
        }

        function pushAboveLastItem(item: JSX.Element) {
            const items = onScreen;
            const lastItem = items[items.length - 1];
            items[items.length - 1] = item;
            items.push(lastItem);
            setOnScreen([...items]);
        }

        function pushAbove(item: JSX.Element) {
            const items = onScreen;
            let copy = [] as (JSX.Element)[];
            copy.push(item);
            copy = copy.concat(items);
            setOnScreen([...copy]);
        }

        function pushBetween(item: JSX.Element, position: number) {
            const items = onScreen;
            const copy = [] as (JSX.Element)[];
            for (let i = 0; i < position; i++) {
                const copiedItem = items[i];
                copy.push(copiedItem);
            }
            copy.push(item);
            const itemsLength = items.length;
            for (let i = position; i < itemsLength; i++) {
                const copiedItem = items[i];
                copy.push(copiedItem);
            }
            setOnScreen(copy);
        }

        function pullBelow() {
            const items = onScreen;
            items.pop();
            setOnScreen([...items]);
        }

        function pullAbove() {
            const items = onScreen;
            items.shift();
            setOnScreen([...items]);
        }

        function pull(position: number) {
            const items = onScreen;
            items.splice(position, 1);
            setOnScreen([...items]);
        }

        on(`${name} pushBelow`, pushBelow);
        on(`${name} pushAboveLastItem`, pushAboveLastItem);
        on(`${name} pushAbove`, pushAbove);
        on(`${name} pushBetween`, pushBetween);
        on(`${name} pullBelow`, pullBelow);
        on(`${name} pullAbove`, pullAbove);
        on(`${name} pull`, pull);
        return function() {
            off(`${name} pushBelow`);
            off(`${name} pushAboveLastItem`);
            off(`${name} pushAbove`);
            off(`${name} pushBetween`);
            off(`${name} pullBelow`);
            off(`${name} pullAbove`);
            off(`${name} pull`);
        }
    }, []);
    return (
        <Remote 
        name={name} 
        initSpring={spring} 
        initStyle={style as any} 
        children={onScreen}
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
        onWheelCapture={onWheelCapture as any}/>
    );
}