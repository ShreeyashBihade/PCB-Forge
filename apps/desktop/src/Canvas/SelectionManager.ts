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

        }

    );

    return best;

}