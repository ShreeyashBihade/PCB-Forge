import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import "./App.css";

import Sidebar from "./components/Sidebar";
import PCBCanvas from "./Canvas/PCBCanvas";
import Statusbar from "./components/Statusbar";

export type RenderOptions = {
    grid: boolean;
    outline: boolean;
    traces: boolean;
    pads: boolean;
    vias: boolean;
};

export type ToolMode =
    | "select"
    | "pan"
    | "measure";

export default function App() {

    const [pcb, setPcb] = useState<any>(null);

    const [tool, setTool] = useState<ToolMode>("pan");

    const [selected, setSelected] = useState<any>(null);

    const [renderOptions, setRenderOptions] =
        useState<RenderOptions>({
            grid: true,
            outline: true,
            traces: true,
            pads: true,
            vias: true,
        });

    useEffect(() => {

        invoke("load_demo_pcb")
            .then(setPcb)
            .catch(console.error);

    }, []);

    const toggleOption = (
        key: keyof RenderOptions
    ) => {

        setRenderOptions(prev => ({

            ...prev,

            [key]: !prev[key],

        }));

    };

    const [

    mouseWorld,

    setMouseWorld

    ]=useState({

    x:0,

    y:0,

    });

    return (

        <div className="app">

            <Sidebar

                pcb={pcb}

                tool={tool}

                setTool={setTool}

                renderOptions={renderOptions}

                toggleOption={toggleOption}

                selected={selected}

            />

            <div className="viewer">

                {

                    pcb &&

                    <PCBCanvas

                        pcb={pcb}

                        tool={tool}

                        renderOptions={renderOptions}

                        selected={selected}

                        setSelected={setSelected}

                    />

                }

            </div>

        </div>

    );

}