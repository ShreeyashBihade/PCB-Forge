import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function App() {
  const [pcb, setPcb] = useState<any>(null);

  useEffect(() => {
  invoke("load_demo_pcb").then((data) => {
    console.log("PCB:", data);
    setPcb(data);
  });
}, []);

  return (
    <div>
      <h1>PCB Forge Viewer</h1>
      <pre>{JSON.stringify(pcb, null, 2)}</pre>
    </div>
  );
}