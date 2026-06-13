import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

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

    ]=useState<string | null>(null);

    const [

    zipFiles,

    setZipFiles

    ]=useState<string[]>([]);

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

    const openPCB = async () => {
        console.log("openPCB() entered");

        const path = await open({

            multiple: false,

            directory: false,

            filters: [

                {

                    name: "PCB Package",

                    extensions: [

                        "zip",

                    ],

                },

            ],

        });

        if (

            path === null

        )

            return;

        if (

            Array.isArray(path)

        )

            return;

        setSelectedFile(path);

        try{

            const files=

            await invoke<string[]>(

                "list_zip_files",

                {

                    path,

                }

            );

            console.log(files);

            setZipFiles(

                files

            );

        }

        catch(err){

            console.error(err);

        }

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
                    flex: 1,
                    overflow: "hidden",
                }}
            >

                <button
                    onClick={() => {
                        console.log("BUTTON CLICKED");
                        openPCB();
                    }}
                    style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 1000,

                        padding: "10px 16px",

                        background: "#1e88e5",
                        color: "white",

                        border: "none",
                        borderRadius: "8px",

                        fontWeight: 600,
                        cursor: "pointer",

                        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                    }}
                >
                    📂 Open PCB
                </button>

                {pcb && (
                    <PCBCanvas
                        pcb={pcb}
                        tool={tool}
                        renderOptions={renderOptions}
                        selected={selected}
                        setSelected={setSelected}
                    />
                )}

                <div
                    style={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,

                        zIndex: 1000,

                        background: "rgba(25,25,25,0.9)",
                        color: "#00ff88",

                        padding: "8px 12px",

                        borderRadius: "8px",

                        fontSize: "13px",

                        maxWidth: "320px",

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",

                        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                    }}
                >
                    📦{" "}
                    {selectedFile
                        ? selectedFile.split("\\").pop()
                        : "No PCB Package"}
                </div>

                <div
                    style={{
                        position: "absolute",

                        left: 16,
                        bottom: 16,

                        zIndex: 1000,

                        background: "rgba(20,20,20,0.92)",
                        color: "#00ff88",

                        padding: "10px",

                        borderRadius: "8px",

                        width: "260px",
                        maxHeight: "180px",

                        overflowY: "auto",

                        fontSize: "13px",

                        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                    }}
                >
                    <b>Files Found</b>

                    <div style={{ marginTop: "8px" }}>
                        {zipFiles.map((file) => (
                            <div key={file}>
                                ✔ {file}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );

}