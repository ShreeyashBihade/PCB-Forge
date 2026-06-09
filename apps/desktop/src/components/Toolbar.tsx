interface ToolbarProps {

    tool: "select" | "pan" | "measure";

    setTool: (

        tool: "select" | "pan" | "measure"

    ) => void;

}

interface ToolButtonProps {

    active: boolean;

    title: string;

    onClick: () => void;

}

function ToolButton({

    active,

    title,

    onClick,

}: ToolButtonProps) {

    return (

        <button

            onClick={onClick}

            style={{

                width: "100%",

                padding: "10px",

                marginBottom: "8px",

                background: active

                    ? "#2563EB"

                    : "#1F2937",

                color: "white",

                border: "1px solid #374151",

                borderRadius: "6px",

                cursor: "pointer",

                textAlign: "left",

                fontSize: "14px",

                transition: "0.15s",

            }}

        >

            {title}

        </button>

    );

}

export default function Toolbar({

    tool,

    setTool,

}: ToolbarProps) {

    return (

        <div

            style={{

                padding: "18px",

                borderBottom: "1px solid #333",

            }}

        >

            <div

                style={{

                    fontSize: "18px",

                    fontWeight: 700,

                    marginBottom: "12px",

                }}

            >

                TOOLS

            </div>

            <ToolButton

                title="🖱 Select"

                active={tool === "select"}

                onClick={() => setTool("select")}

            />

            <ToolButton

                title="✋ Pan"

                active={tool === "pan"}

                onClick={() => setTool("pan")}

            />

            <ToolButton

                title="📏 Measure"

                active={tool === "measure"}

                onClick={() => setTool("measure")}

            />

        </div>

    );

}