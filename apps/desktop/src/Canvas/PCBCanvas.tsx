import { useEffect, useRef, useState } from "react";

import {pickObject, Selection} from "./SelectionManager";

type Point = {
    x: number;
    y: number;
};

type Trace = {
    width: number;
    geometry: {
        from: Point;
        to: Point;
    };
};

type Pad = {
    net?: string;
    position: Point;
    diameter: number;
};

type Via = {
    net?: string;
    position: Point;
    outer_diameter: number;
    drill_diameter: number;
};

type Layer = {
    name: string;
    layer_type: string;
    traces: Trace[];
    pads: Pad[];
    vias: Via[];
};

type PCB = {
    name: string;
    units: string;

    outline?: {
        segments: {
            from: Point;
            to: Point;
        }[];
    };

    layers: Layer[];
};

type RenderOptions = {
    grid: boolean;
    outline: boolean;
    traces: boolean;
    pads: boolean;
    vias: boolean;
};

type ToolMode =
    | "select"
    | "pan"
    | "measure";

interface Props {

    pcb: PCB;

    renderOptions: RenderOptions;

    tool: ToolMode;

    selected: any;

    setSelected: any;

}

export default function PCBCanvas({

    pcb,

    renderOptions,

    tool,

    selected,

    setSelected,

}: Props) {

    const canvasRef =
        useRef<HTMLCanvasElement>(null);

    const containerRef =
        useRef<HTMLDivElement>(null);

    const dragging =
        useRef(false);

    const lastMouse =
        useRef({

            x: 0,

            y: 0,

        });

    const [canvasSize, setCanvasSize] =
        useState({

            width: 800,

            height: 600,

        });

    const [scale, setScale] =
        useState(1);

    const [offset, setOffset] =
        useState({

            x: 0,

            y: 0,

        });

    const [
        hovered,
        setHovered
    ]=useState<any>(null);

    //--------------------------------------------------
    // Screen to World
    //--------------------------------------------------
    const screenToWorld=(
        p:Point

        )=>({
        x:(p.x-offset.x)/scale,
        y:(p.y-offset.y)/scale,

    });

    //--------------------------------------------------
    // onClick
    //--------------------------------------------------    
    const onClick=(

        e:React.MouseEvent

        )=>{

        if(tool!=="select")

        return;

        const world=

        screenToWorld({

        x:e.nativeEvent.offsetX,

        y:e.nativeEvent.offsetY,

        });

        const obj = pickObject(
            pcb,
            world
        );

        console.log(obj);

        setSelected(obj);

    };

    //--------------------------------------------------
    // Resize
    //--------------------------------------------------

    useEffect(() => {

        const resize = () => {

            if (!containerRef.current)
                return;

            setCanvasSize({

                width:
                    containerRef.current.clientWidth,

                height:
                    containerRef.current.clientHeight,

            });

        };

        resize();

        window.addEventListener(

            "resize",

            resize

        );

        return () =>

            window.removeEventListener(

                "resize",

                resize

            );

    }, []);

    //--------------------------------------------------
    // World -> Screen
    //--------------------------------------------------

    const worldToScreen = (

        p: Point

    ) => ({

        x:

            p.x * scale +

            offset.x,

        y:

            p.y * scale +

            offset.y,

    });

    //--------------------------------------------------
    // Auto Fit Camera
    //--------------------------------------------------

    useEffect(() => {

        if (!pcb)
            return;

        const canvas =
            canvasRef.current;

        if (!canvas)
            return;

        let minX = Infinity;
        let minY = Infinity;

        let maxX = -Infinity;
        let maxY = -Infinity;

        for (

            const layer

            of pcb.layers

        ) {

            for (

                const trace

                of layer.traces

            ) {

                minX = Math.min(

                    minX,

                    trace.geometry.from.x,

                    trace.geometry.to.x

                );

                minY = Math.min(

                    minY,

                    trace.geometry.from.y,

                    trace.geometry.to.y

                );

                maxX = Math.max(

                    maxX,

                    trace.geometry.from.x,

                    trace.geometry.to.x

                );

                maxY = Math.max(

                    maxY,

                    trace.geometry.from.y,

                    trace.geometry.to.y

                );

            }

        }

        if (

            !isFinite(minX) ||

            !isFinite(minY)

        )

            return;

        const pcbWidth =
            maxX - minX;

        const pcbHeight =
            maxY - minY;

        if (

            pcbWidth <= 0 ||

            pcbHeight <= 0

        )

            return;

        const padding = 120;

        const fitScaleX =

            (canvas.width - padding)

            / pcbWidth;

        const fitScaleY =

            (canvas.height - padding)

            / pcbHeight;

        const fitScale =
            Math.min(

                fitScaleX,

                fitScaleY

            );

        const centerX =
            (minX + maxX) / 2;

        const centerY =
            (minY + maxY) / 2;

        setScale(

            fitScale

        );

        setOffset({

            x:

                canvas.width / 2 -

                centerX * fitScale,

            y:

                canvas.height / 2 -

                centerY * fitScale,

        });

    }, [pcb]);

    //--------------------------------------------------
    // Infinite Grid
    //--------------------------------------------------

    const drawGrid = (

        ctx: CanvasRenderingContext2D

    ) => {

        const canvas =
            ctx.canvas;

        ctx.strokeStyle =
            "#1a1f29";

        ctx.lineWidth = 1;

        let gridWorld = 100;

        while (

            gridWorld * scale < 30

        )

            gridWorld *= 2;

        while (

            gridWorld * scale > 180

        )

            gridWorld /= 2;

        const step =
            gridWorld * scale;

        const startX =
            offset.x % step;

        const startY =
            offset.y % step;

        for (

            let x = startX;

            x < canvas.width;

            x += step

        ) {

            ctx.beginPath();

            ctx.moveTo(

                x,

                0

            );

            ctx.lineTo(

                x,

                canvas.height

            );

            ctx.stroke();

        }

        for (

            let y = startY;

            y < canvas.height;

            y += step

        ) {

            ctx.beginPath();

            ctx.moveTo(

                0,

                y

            );

            ctx.lineTo(

                canvas.width,

                y

            );

            ctx.stroke();

        }

    };

        //--------------------------------------------------
    // Board Outline
    //--------------------------------------------------

    const drawOutline = (

        ctx: CanvasRenderingContext2D

    ) => {

        if (

            !pcb.outline ||

            !renderOptions.outline

        )

            return;

        ctx.strokeStyle = "#FFD700";

        ctx.lineWidth = 2;

        for (

            const segment

            of pcb.outline.segments

        ) {

            const a = worldToScreen(

                segment.from

            );

            const b = worldToScreen(

                segment.to

            );

            ctx.beginPath();

            ctx.moveTo(

                a.x,

                a.y

            );

            ctx.lineTo(

                b.x,

                b.y

            );

            ctx.stroke();

        }

    };

    //--------------------------------------------------
    // PCB
    //--------------------------------------------------

    const drawPCB = (

    ctx: CanvasRenderingContext2D

    ) => {

        if (!pcb)

            return;

        pcb.layers.forEach(

            (layer, layerIndex) => {

                //--------------------------------
                // Traces
                //--------------------------------

                if (renderOptions.traces) {

                layer.traces.forEach((trace, traceIndex) => {

                    let color = "#00ff88";

                    if (

                        hovered &&

                        hovered.type === "trace" &&

                        hovered.layer === layerIndex &&

                        hovered.index === traceIndex

                    ) {

                        color = "#00FF00";

                    }

                    if (

                        selected &&

                        selected.type === "trace" &&

                        selected.layer === layerIndex &&

                        selected.index === traceIndex

                    ) {

                        color = "#00FFFF";

                    }

                    ctx.strokeStyle = color;

                    const a = worldToScreen(

                        trace.geometry.from

                    );

                    const b = worldToScreen(

                        trace.geometry.to

                    );

                    ctx.lineWidth = Math.max(

                        2,

                        trace.width * scale * 0.05

                    );

                    ctx.beginPath();

                    ctx.moveTo(

                        a.x,

                        a.y

                    );

                    ctx.lineTo(

                        b.x,

                        b.y

                    );

                    ctx.stroke();

                });

            }

            //--------------------------------
            // Pads
            //--------------------------------

            if (renderOptions.pads) {

                layer.pads.forEach(

                    (pad, padIndex) => {

                        const p = worldToScreen(

                            pad.position

                        );

                        const r = Math.max(

                            3,

                            pad.diameter *

                                0.5 *

                                scale

                        );

                        let color="#ffcc00";

                        if(

                        hovered &&

                        hovered.type==="pad" &&

                        hovered.layer===layerIndex &&

                        hovered.index===padIndex

                        ){

                            color="#00FF00";

                        }

                        if(

                        selected &&

                        selected.type==="pad" &&

                        selected.layer===layerIndex &&

                        selected.index===padIndex

                        ){

                            color="#00FFFF";

                        }

                        ctx.beginPath();

                        ctx.fillStyle = color;

                        ctx.arc(

                            p.x,

                            p.y,

                            r,

                            0,

                            Math.PI * 2

                        );

                        ctx.fill();

                        ctx.strokeStyle = "#222";

                        ctx.lineWidth = 1;

                        ctx.stroke();

                    }

                );

            }

            //--------------------------------
            // Vias
            //--------------------------------

            if (renderOptions.vias) {

                layer.vias.forEach(

                    (via, viaIndex) => {

                        const p = worldToScreen(

                            via.position

                        );

                        let color="#FFD700";

                        if(

                        hovered &&

                        hovered.type==="via" &&

                        hovered.layer===layerIndex &&

                        hovered.index===viaIndex

                        ){

                            color="#00FF00";

                        }

                        if(

                        selected &&

                        selected.type==="via" &&

                        selected.layer===layerIndex &&

                        selected.index===viaIndex

                        ){

                            color="#00FFFF";

                        }

                        ctx.fillStyle = color;

                        ctx.beginPath();

                        ctx.arc(

                            p.x,

                            p.y,

                            Math.max(

                                3,

                                via.outer_diameter *

                                    0.5 *

                                    scale

                            ),

                            0,

                            Math.PI * 2

                        );

                        ctx.fill();

                        ctx.fillStyle = "#111";

                        ctx.beginPath();

                        ctx.arc(

                            p.x,

                            p.y,

                            Math.max(

                                1,

                                via.drill_diameter *

                                    0.5 *

                                    scale

                            ),

                            0,

                            Math.PI * 2

                        );

                        ctx.fill();

                    }

                );

            }

        }

    );

};

    //--------------------------------------------------
    // Render
    //--------------------------------------------------

    const render = () => {

        const canvas =

            canvasRef.current;

        if (!canvas)

            return;

        const ctx =

            canvas.getContext("2d");

        if (!ctx)

            return;

        ctx.clearRect(

            0,

            0,

            canvas.width,

            canvas.height

        );

        if (

            renderOptions.grid

        )

            drawGrid(ctx);

        drawOutline(ctx);

        drawPCB(ctx);

    };

    useEffect(() => {

        render();

    }, [

        pcb,

        scale,

        offset,

        renderOptions,

        selected,

        hovered,
    ]);

    useEffect(() => {

    const handler = (e: KeyboardEvent) => {

        if (e.key === "Escape") {

            setSelected(null);

        }

    };

    window.addEventListener("keydown", handler);

    return () => {

        window.removeEventListener("keydown", handler);

    };

}, []);

    //--------------------------------------------------
    // Mouse
    //--------------------------------------------------

    const onMouseDown = (

        e: React.MouseEvent

    ) => {

        if (

            tool !== "pan"

        )

            return;

        dragging.current = true;

        lastMouse.current = {

            x: e.clientX,

            y: e.clientY,

        };

    };

    const onMouseUp = () => {

        dragging.current = false;

    };

    const onMouseMove = (

        e: React.MouseEvent

    ) => {

        const world = screenToWorld({

            x:e.nativeEvent.offsetX,

            y:e.nativeEvent.offsetY,

        });

        setHovered(

            pickObject(

                pcb,

                world

            )

        );

        if (

            !dragging.current

        )

            return;

        const dx =

            e.clientX -

            lastMouse.current.x;

        const dy =

            e.clientY -

            lastMouse.current.y;

        setOffset(o => ({

            x: o.x + dx,

            y: o.y + dy,

        }));

        lastMouse.current = {

            x: e.clientX,

            y: e.clientY,

        };

    };

    //--------------------------------------------------
    // Zoom
    //--------------------------------------------------

    const onWheel = (

        e: React.WheelEvent

    ) => {

        e.preventDefault();

        const zoom =

            e.deltaY < 0

                ? 1.1

                : 0.9;

        const mx =

            e.nativeEvent.offsetX;

        const my =

            e.nativeEvent.offsetY;

        const wx =

            (mx - offset.x) /

            scale;

        const wy =

            (my - offset.y) /

            scale;

        const newScale =

            Math.max(

                0.05,

                Math.min(

                    20,

                    scale * zoom

                )

            );

        setScale(

            newScale

        );

        setOffset({

            x:

                mx -

                wx * newScale,

            y:

                my -

                wy * newScale,

        });

    };

    return (

        <div

            ref={containerRef}

            style={{

                width: "100%",

                height: "100%",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                overflow: "hidden",

            }}

        >

            <canvas

                ref={canvasRef}

                width={canvasSize.width}

                height={canvasSize.height}

                onWheel={onWheel}

                onMouseDown={onMouseDown}

                onMouseMove={onMouseMove}

                onMouseUp={onMouseUp}

                onClick={onClick}

                onMouseLeave={()=>setHovered(null)}

                style={{

                    background: "#0b0f14",

                    border: "1px solid #333",

                    display: "block",

                }}

            />

        </div>

    );

}