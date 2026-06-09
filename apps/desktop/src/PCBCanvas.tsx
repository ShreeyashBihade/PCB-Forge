import { useEffect, useRef, useState } from "react";

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
  position: { x: number; y: number };
  diameter: number;
};

type Via = {
  net?:string,
  position:Point,
  outer_diameter:number,
  drill_diameter:number
}

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
  
  outline?:{
    segments:{
      from:Point;
      to:Point;
    } [];
  };

  layers: Layer[];
};

export default function PCBCanvas({ pcb }: { pcb: PCB }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [canvasSize, setCanvasSize] = useState({
    width: 800,
    height: 600,
  });

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;

      setCanvasSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    resize();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // --------------------------------------------------
  // WORLD -> SCREEN
  // --------------------------------------------------

  const worldToScreen = (p: Point) => ({
    x: p.x * scale + offset.x,
    y: p.y * scale + offset.y,
  });

  // --------------------------------------------------
  // AUTO FIT CAMERA
  // --------------------------------------------------

  useEffect(() => {
    if (!pcb) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const layer of pcb.layers) {
      for (const trace of layer.traces) {
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

    const pcbWidth = maxX - minX;
    const pcbHeight = maxY - minY;

    if (pcbWidth <= 0 || pcbHeight <= 0) return;

    const padding = 100;

    const fitScaleX =
      (canvas.width - padding) / pcbWidth;

    const fitScaleY =
      (canvas.height - padding) / pcbHeight;

    const fitScale = Math.min(
      fitScaleX,
      fitScaleY
    );

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const screenCenterX = canvas.width / 2;
    const screenCenterY = canvas.height / 2;

    setScale(fitScale);

    setOffset({
      x: screenCenterX - centerX * fitScale,
      y: screenCenterY - centerY * fitScale,
    });
  }, [pcb]);

  // --------------------------------------------------
  // GRID
  // --------------------------------------------------

  const drawGrid = (
    ctx: CanvasRenderingContext2D
  ) => {
    const canvas = ctx.canvas;

    ctx.strokeStyle = "#1a1f29";
    ctx.lineWidth = 1;

    let gridWorld = 100;

    const pixelsPerGrid =
      gridWorld * scale;

    if (pixelsPerGrid < 20)
      gridWorld *= 5;

    if (pixelsPerGrid > 200)
      gridWorld /= 5;

    const step = gridWorld * scale;

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
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (
      let y = startY;
      y < canvas.height;
      y += step
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

    const drawOutline = (

      ctx: CanvasRenderingContext2D

  ) => {

      if (!pcb.outline)

          return;

      ctx.strokeStyle = "#FFD700";

      ctx.lineWidth = 3 * scale;

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

  // --------------------------------------------------
  // PCB DRAWING
  // --------------------------------------------------

  const drawPCB = (
    ctx: CanvasRenderingContext2D
  ) => {
    if (!pcb) return;

    for (const layer of pcb.layers) {
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 2 * scale;

      for (const trace of layer.traces) {
        const a = worldToScreen(
          trace.geometry.from
        );

        const b = worldToScreen(
          trace.geometry.to
        );

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const pad of layer.pads) {
        const p = worldToScreen(pad.position);
        const radius = pad.diameter * 0.25 * scale;

        ctx.beginPath();
        ctx.fillStyle = "#ffcc00"; // gold copper pad
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // optional outline
        ctx.strokeStyle = "#000";
        ctx.stroke();
      }

      for(const via of layer.vias){
        const p=worldToScreen(via.position);
        ctx.fillStyle="#FFD700";

        ctx.beginPath();
        ctx.arc(
        p.x,
        p.y,
        via.outer_diameter*0.5*scale,
        0,
        Math.PI*2
        );

        ctx.fill();
        ctx.fillStyle="#111";
        ctx.beginPath();
        ctx.arc(
        p.x,
        p.y,
        via.drill_diameter*0.5*scale,
        0,
        Math.PI*2
        );

        ctx.fill();
      }
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    drawGrid(ctx);
    drawOutline(ctx);
    drawPCB(ctx);
  };

  useEffect(() => {
    render();
  }, [pcb, scale, offset]);

  // --------------------------------------------------
  // PAN
  // --------------------------------------------------

  const onMouseDown = (
    e: React.MouseEvent
  ) => {
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
    if (!dragging.current) return;

    const dx =
      e.clientX -
      lastMouse.current.x;

    const dy =
      e.clientY -
      lastMouse.current.y;

    setOffset((o) => ({
      x: o.x + dx,
      y: o.y + dy,
    }));

    lastMouse.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  // --------------------------------------------------
  // ZOOM TO CURSOR
  // --------------------------------------------------

  const onWheel = (
    e: React.WheelEvent
  ) => {
    e.preventDefault();

    const zoomFactor =
      e.deltaY < 0 ? 1.1 : 0.9;

    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    const worldX =
      (mouseX - offset.x) / scale;

    const worldY =
      (mouseY - offset.y) / scale;

    const newScale =
      scale * zoomFactor;

    setScale(newScale);

    setOffset({
      x:
        mouseX -
        worldX * newScale,
      y:
        mouseY -
        worldY * newScale,
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "95%",
        height: "95%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width - 10}
        height={canvasSize.height - 10}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          background: "#0b0f14",
          border: "1px solid #333",
        }}
      />
    </div>
  );
}