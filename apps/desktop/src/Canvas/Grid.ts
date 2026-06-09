export interface Camera {

    scale: number;

    offset: {

        x: number;

        y: number;

    };

}

export function drawGrid(

    ctx: CanvasRenderingContext2D,

    camera: Camera

) {

    const canvas = ctx.canvas;

    const scale = camera.scale;

    const offset = camera.offset;

    //--------------------------------
    // Grid color
    //--------------------------------

    ctx.strokeStyle = "#1a1f29";

    ctx.lineWidth = 1;

    //--------------------------------
    // Adaptive spacing
    //--------------------------------

    let worldStep = 100;

    while (

        worldStep * scale < 30

    ) {

        worldStep *= 2;

    }

    while (

        worldStep * scale > 180

    ) {

        worldStep /= 2;

    }

    const pixelStep =

        worldStep * scale;

    //--------------------------------
    // Infinite grid origin
    //--------------------------------

    const startX =

        ((offset.x % pixelStep)

        + pixelStep)

        % pixelStep;

    const startY =

        ((offset.y % pixelStep)

        + pixelStep)

        % pixelStep;

    //--------------------------------
    // Vertical lines
    //--------------------------------

    for (

        let x = startX;

        x <= canvas.width;

        x += pixelStep

    ) {

        ctx.beginPath();

        ctx.moveTo(

            x,

            0

        );

        ctx.lineTo(

            x,

            canvas.height

        );

        ctx.stroke();

    }

    //--------------------------------
    // Horizontal lines
    //--------------------------------

    for (

        let y = startY;

        y <= canvas.height;

        y += pixelStep

    ) {

        ctx.beginPath();

        ctx.moveTo(

            0,

            y

        );

        ctx.lineTo(

            canvas.width,

            y

        );

        ctx.stroke();

    }

}