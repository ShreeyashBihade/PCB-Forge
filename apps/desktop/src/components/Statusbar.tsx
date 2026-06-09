interface StatusbarProps {

    pcb: any;

}

export default function Statusbar({

    pcb,

}: StatusbarProps) {

    const trackCount =
        pcb?.layers?.reduce(

            (sum: number, layer: any) =>

                sum + (layer.traces?.length || 0),

            0

        ) ?? 0;

    const padCount =
        pcb?.layers?.reduce(

            (sum: number, layer: any) =>

                sum + (layer.pads?.length || 0),

            0

        ) ?? 0;

    const viaCount =
        pcb?.layers?.reduce(

            (sum: number, layer: any) =>

                sum + (layer.vias?.length || 0),

            0

        ) ?? 0;

    return (

        <div

            style={{

                padding: "18px",

                borderTop: "1px solid #333",

                background: "#0F172A",

                color: "#E5E7EB",

                fontSize: "14px",

            }}

        >

            <div

                style={{

                    fontWeight: 700,

                    marginBottom: "12px",

                }}

            >

                INFO

            </div>

            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                    marginBottom: "6px",

                }}

            >

                <span>Zoom</span>

                <span>100%</span>

            </div>

            <hr
                style={{
                    border: 0,
                    borderTop: "1px solid #374151",
                    margin: "10px 0",
                }}
            />

            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                    marginBottom: "6px",

                }}

            >

                <span>Tracks</span>

                <span>{trackCount}</span>

            </div>

            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                    marginBottom: "6px",

                }}

            >

                <span>Pads</span>

                <span>{padCount}</span>

            </div>

            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                }}

            >

                <span>Vias</span>

                <span>{viaCount}</span>

            </div>

        </div>

    );

}