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

  const [scale, setScale] = useState(0.5);
  const [offset, setOffset] = useState({ x: 100, y: 100 });

  // Convert PCB coords → screen coords
  const worldToScreen = (p: Point) => ({
    x: p.x * scale + offset.x,
    y: p.y * scale + offset.y,
  });

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!pcb) return;

    for (const layer of pcb.layers) {
      if (layer.layer_type !== "Copper") continue;

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => draw(ctx);

    render();
  }, [pcb, scale, offset]);

  // Zoom
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