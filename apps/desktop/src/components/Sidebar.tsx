import LayerTree from "./LayerTree";
import Toolbar from "./Toolbar";
import Statusbar from "./Statusbar";

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

interface SidebarProps {

    pcb: any;

    tool: ToolMode;

    setTool: (tool: ToolMode) => void;

    renderOptions: RenderOptions;

    toggleOption: (
        key: keyof RenderOptions
    ) => void;

}

export default function Sidebar({

    pcb,

    tool,

    setTool,

    renderOptions,

    toggleOption,

}: SidebarProps) {

    return (

        <div
            style={{
                width: "260px",
                background: "#111827",
                color: "white",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid #333",
                height: "100vh",
            }}
        >

            <div
                style={{
                    padding: "18px",
                    borderBottom: "1px solid #333",
                }}
            >

                <h1
                    style={{
                        margin: 0,
                        fontSize: "26px",
                    }}
                >
                    PCB Forge
                </h1>

                <div
                    style={{
                        marginTop: "4px",
                        color: "#9CA3AF",
                        fontSize: "13px",
                    }}
                >
                    Desktop PCB Viewer
                </div>

            </div>

            <LayerTree

                renderOptions={renderOptions}

                toggleOption={toggleOption}

            />

            <Toolbar

                tool={tool}

                setTool={setTool}

            />

            <div
                style={{
                    flex: 1,
                }}
            />

            <Statusbar pcb={pcb} />

        </div>

    );

}
