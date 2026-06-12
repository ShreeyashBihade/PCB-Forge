import { useEffect, useState, useRef } from "react";
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

    const [

    selectedFile,

    setSelectedFile

    ] = useState<File | null>(null);

    const fileInputRef =

    useRef<HTMLInputElement>(null);

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

    const openPCB = () => {

        fileInputRef.current?.click();

    };

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

            <div
                className="viewer"
                style={{
                    position: "relative",
                }}
            >

                <button

                    onClick={openPCB}

                    style={{

                        position: "absolute",

                        top: 15,

                        right: 15,

                        zIndex: 100,

                        padding: "8px 14px",

                        cursor: "pointer",

                    }}

                >

                    📂 Open PCB

                </button>

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

                <div

                    style={{

                        position: "absolute",

                        bottom: 15,

                        right: 15,

                        background: "#1b1b1b",

                        color: "#00ff88",

                        padding: "8px 12px",

                        borderRadius: "6px",

                        maxWidth: "350px",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",

                        fontSize: "13px",

                    }}

                >

                    📦 {

                        selectedFile

                        ?

                        selectedFile.name

                        :

                        "No PCB Package"

                    }

                </div>

            </div>

            <input

            ref={fileInputRef}

            type="file"

            accept=".zip"

            style={{

                display: "none",

            }}

            onChange={(e) => {

                const file =

                    e.target.files?.[0];

                if (file) {

                    setSelectedFile(file);

                }

            }}

            />

        </div>

    );

}