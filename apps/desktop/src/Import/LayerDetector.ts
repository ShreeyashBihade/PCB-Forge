export type BoardManifest = {

    topCopper?: string;

    bottomCopper?: string;

    topSilk?: string;

    bottomSilk?: string;

    topMask?: string;

    bottomMask?: string;

    edgeCuts?: string;

    drill?: string;

};

export function detectLayers(

    files: string[]

): BoardManifest {

    const board: BoardManifest = {};

    for (const file of files) {

        const name = file.toLowerCase();

        if (

            name.includes("f_cu") ||

            name.includes("top") &&

            name.includes("cu")

        ) {

            board.topCopper = file;

        }

        else if (

            name.includes("b_cu") ||

            name.includes("bottom") &&

            name.includes("cu")

        ) {

            board.bottomCopper = file;

        }

        else if (

            name.includes("f_silk") ||

            name.includes("topsilk")

        ) {

            board.topSilk = file;

        }

        else if (

            name.includes("b_silk") ||

            name.includes("bottomsilk")

        ) {

            board.bottomSilk = file;

        }

        else if (

            name.includes("f_mask")

        ) {

            board.topMask = file;

        }

        else if (

            name.includes("b_mask")

        ) {

            board.bottomMask = file;

        }

        else if (

            name.includes("edge")

        ) {

            board.edgeCuts = file;

        }

        else if (

            name.includes(".drl") ||

            name.includes("drill")

        ) {

            board.drill = file;

        }

    }

    return board;

}
