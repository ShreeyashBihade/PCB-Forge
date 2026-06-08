import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

type Trace = {
  net?: string;
  width: number;
  geometry: {
    from: Point;
    to: Point;
  };
};

type Layer = {
  name: string;
  layer_type: string;
  traces: Trace[];
};

type PCB = {
  name: string;
  units: string;
  layers: Layer[];
};

export default function PCBCanvas({ pcb }: { pcb: PCB }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const MM_TO_PX = 0.5;
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 100, y: 100 });

  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const worldToScreen = (p: Point) => ({
    x: p.x * MM_TO_PX * scale + offset.x,
    y: p.y * MM_TO_PX * scale + offset.y,
  });

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#1a1f29";
    ctx.lineWidth = 1;

    const step = 50;

    for (let x = 0; x < ctx.canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < ctx.canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  };

  const drawPCB = (ctx: CanvasRenderingContext2D) => {
    if (!pcb) return;

    for (const layer of pcb.layers) {
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 2;

      for (const trace of layer.traces) {
        const a = worldToScreen(trace.geometry.from);
        const b = worldToScreen(trace.geometry.to);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx);
    drawPCB(ctx);
  };

  useEffect(() => {
    render();
  }, [pcb, scale, offset]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.max(0.1, Math.min(5, s - e.deltaY * 0.001)));
  };

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={700}
      onWheel={onWheel}
      style={{ border: "1px solid #333", background: "#0b0f14" }}
    />
  );
}