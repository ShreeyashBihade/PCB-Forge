import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import PCBCanvas from "./PCBCanvas";

export default function App() {
  const [pcb, setPcb] = useState<any>(null);

  useEffect(() => {
    invoke("load_demo_pcb").then(setPcb);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#0b0f14",
      }}
    >
      <h1
        style={{
          margin: 0,
          padding: "10px",
          color: "white",
          flexShrink: 0,
        }}
      >
        PCB Forge Viewer
      </h1>

      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        {pcb ? <PCBCanvas pcb={pcb} /> : "Loading..."}
      </div>
    </div>
  );
}