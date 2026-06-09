export interface Camera {

    scale: number;

    offset: {

        x: number;

        y: number;

    };

}

export interface Point {

    x: number;

    y: number;

}

export function worldToScreen(

    point: Point,

    camera: Camera

): Point {

    return {

        x:

            point.x *

            camera.scale +

            camera.offset.x,

        y:

            point.y *

            camera.scale +

            camera.offset.y,

    };

}

export function screenToWorld(

    point: Point,

    camera: Camera

): Point {

    return {

        x:

            (point.x -

                camera.offset.x)

            / camera.scale,

        y:

            (point.y -

                camera.offset.y)

            / camera.scale,

    };

}

export function pan(

    camera: Camera,

    dx: number,

    dy: number

): Camera {

    return {

        scale:

            camera.scale,

        offset: {

            x:

                camera.offset.x +

                dx,

            y:

                camera.offset.y +

                dy,

        },

    };

}

export function zoomAt(

    camera: Camera,

    mouse: Point,

    factor: number

): Camera {

    const world =

        screenToWorld(

            mouse,

            camera

        );

    let newScale =

        camera.scale *

        factor;

    newScale = Math.max(

        0.05,

        Math.min(

            20,

            newScale

        )

    );

    return {

        scale:

            newScale,

        offset: {

            x:

                mouse.x -

                world.x *

                    newScale,

            y:

                mouse.y -

                world.y *

                    newScale,

        },

    };

}

export function fitToBounds(

    min: Point,

    max: Point,

    viewportWidth: number,

    viewportHeight: number,

    padding = 80

): Camera {

    const width =

        max.x - min.x;

    const height =

        max.y - min.y;

    if (

        width <= 0 ||

        height <= 0

    ) {

        return {

            scale: 1,

            offset: {

                x:

                    viewportWidth / 2,

                y:

                    viewportHeight / 2,

            },

        };

    }

    const scaleX =

        (viewportWidth -

            padding)

        / width;

    const scaleY =

        (viewportHeight -

            padding)

        / height;

    const scale =

        Math.min(

            scaleX,

            scaleY

        );

    const centerX =

        (min.x + max.x) / 2;

    const centerY =

        (min.y + max.y) / 2;

    return {

        scale,

        offset: {

            x:

                viewportWidth / 2 -

                centerX *

                    scale,

            y:

                viewportHeight / 2 -

                centerY *

                    scale,

        },

    };

}