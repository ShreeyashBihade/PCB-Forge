import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import PCBCanvas from "./PCBCanvas";

export default function App() {
  const [pcb, setPcb] = useState<any>(null);

  useEffect(() => {
    invoke("load_demo_pcb").then(setPcb);
  }, []);

  return (
    <div>
      <h1>PCB Forge Viewer</h1>
      {pcb ? <PCBCanvas pcb={pcb} /> : "Loading..."}
    </div>
  );
}