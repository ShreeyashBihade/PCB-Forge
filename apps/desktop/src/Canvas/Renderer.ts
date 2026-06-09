export type Point = {

    x:number;

    y:number;

};

export interface RenderOptions{

    grid:boolean;

    outline:boolean;

    traces:boolean;

    pads:boolean;

    vias:boolean;

}

export function worldToScreen(

    p:Point,

    scale:number,

    offset:{x:number;y:number;}

){

    return{

        x:p.x*scale+offset.x,

        y:p.y*scale+offset.y,

    };

}

export function clear(

    ctx:CanvasRenderingContext2D

){

    ctx.clearRect(

        0,

        0,

        ctx.canvas.width,

        ctx.canvas.height

    );

}

export function drawLine(

    ctx:CanvasRenderingContext2D,

    a:Point,

    b:Point,

    color:string,

    width:number

){

    ctx.strokeStyle=color;

    ctx.lineWidth=width;

    ctx.beginPath();

    ctx.moveTo(

        a.x,

        a.y

    );

    ctx.lineTo(

        b.x,

        b.y

    );

    ctx.stroke();

}

export function drawCircle(

    ctx:CanvasRenderingContext2D,

    p:Point,

    radius:number,

    fill:string

){

    ctx.fillStyle=fill;

    ctx.beginPath();

    ctx.arc(

        p.x,

        p.y,

        radius,

        0,

        Math.PI*2

    );

    ctx.fill();

}