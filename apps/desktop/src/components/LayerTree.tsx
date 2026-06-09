interface RenderOptions {

    grid: boolean;

    outline: boolean;

    traces: boolean;

    pads: boolean;

    vias: boolean;

}

interface LayerTreeProps {

    renderOptions: RenderOptions;

    toggleOption: (

        key: keyof RenderOptions

    ) => void;

}

function LayerCheckbox({

    label,

    value,

    onChange,

}:{

    label:string;

    value:boolean;

    onChange:()=>void;

}){

    return(

        <label

            style={{

                display:"flex",

                alignItems:"center",

                gap:"10px",

                padding:"6px 0",

                cursor:"pointer",

                userSelect:"none",

            }}

        >

            <input

                type="checkbox"

                checked={value}

                onChange={onChange}

            />

            {label}

        </label>

    );

}

export default function LayerTree({

    renderOptions,

    toggleOption,

}:LayerTreeProps){

    return(

        <div

            style={{

                padding:"18px",

                borderBottom:"1px solid #333",

            }}

        >

            <div

                style={{

                    fontSize:"18px",

                    fontWeight:700,

                    marginBottom:"12px",

                }}

            >

                VIEW

            </div>

            <LayerCheckbox

                label="Grid"

                value={renderOptions.grid}

                onChange={()=>toggleOption("grid")}

            />

            <LayerCheckbox

                label="Board Outline"

                value={renderOptions.outline}

                onChange={()=>toggleOption("outline")}

            />

            <LayerCheckbox

                label="Traces"

                value={renderOptions.traces}

                onChange={()=>toggleOption("traces")}

            />

            <LayerCheckbox

                label="Pads"

                value={renderOptions.pads}

                onChange={()=>toggleOption("pads")}

            />

            <LayerCheckbox

                label="Vias"

                value={renderOptions.vias}

                onChange={()=>toggleOption("vias")}

            />

        </div>

    );

}