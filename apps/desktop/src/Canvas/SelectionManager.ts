export interface Point {

    x:number;

    y:number;

}

export type Selection =

    |{

        type:"pad";

        layer:number;

        index:number;

    }

    |{

        type:"via";

        layer:number;

        index:number;

    }

    |{
        type:"trace";
        layer:number;
        index:number;
    }

    |null;

export function distance(

    a:Point,

    b:Point

){

    return Math.sqrt(

        (a.x-b.x)**2+

        (a.y-b.y)**2

    );

}

export function pointToSegmentDistance(

    p:Point,

    a:Point,

    b:Point

){

    const dx=b.x-a.x;

    const dy=b.y-a.y;

    const len2=dx*dx+dy*dy;

    if(len2===0)

        return distance(

            p,

            a

        );

    let t=

        (

            (p.x-a.x)*dx+

            (p.y-a.y)*dy

        )/len2;

    t=Math.max(

        0,

        Math.min(

            1,

            t

        )

    );

    const proj={

        x:a.x+t*dx,

        y:a.y+t*dy,

    };

    return distance(

        p,

        proj

    );

}

export function pickObject(

    pcb:any,

    world:Point

):Selection{

    let best:Selection=null;

    let bestDist=Infinity;

    pcb.layers.forEach(

        (

            layer:any,

            layerIndex:number

        )=>{

            layer.pads.forEach(

                (

                    pad:any,

                    padIndex:number

                )=>{

                    const d=

                        distance(

                            world,

                            pad.position

                        );

                    if(

                        d<pad.diameter

                        &&

                        d<bestDist

                    ){

                        bestDist=d;

                        best={

                            type:"pad",

                            layer:layerIndex,

                            index:padIndex,

                        };

                    }

                }

            );

            layer.vias.forEach(

                (

                    via:any,

                    viaIndex:number

                )=>{

                    const d=

                        distance(

                            world,

                            via.position

                        );

                    if(

                        d<via.outer_diameter

                        &&

                        d<bestDist

                    ){

                        bestDist=d;

                        best={

                            type:"via",

                            layer:layerIndex,

                            index:viaIndex,

                        };

                    }

                }

            );

            layer.traces.forEach(

            (

            trace:any,

            traceIndex:number

            )=>{

            const d=

            pointToSegmentDistance(

            world,

            trace.geometry.from,

            trace.geometry.to

            );

            if(

            d<20 &&

            d<bestDist

            ){

            bestDist=d;

            best={

            type:"trace",

            layer:layerIndex,

            index:traceIndex,

            };

            }

            });

        }

    );

    return best;

}