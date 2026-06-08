use pcb_core::*;

pub fn process_moves(
    commands: Vec<PointCommand>
) -> Vec<TraceSegment> {

    let mut state = ParserState {
        x: 0,
        y: 0,
        drawing: false,
        current_net: None,
        current_width: 200,
    };

    let mut segments = Vec::new();

    for cmd in commands {
        let new_x = cmd.x.map(|v| to_microns(v as f32)).unwrap_or(state.x);
        let new_y = cmd.y.map(|v| to_microns(v as f32)).unwrap_or(state.y);

        if state.drawing {
            let segment = TraceSegment {
                net: state.current_net.clone(),
                width: state.current_width,
                geometry: LineSegment {
                    from: Point { x: state.x, y: state.y },
                    to: Point { x: new_x, y: new_y },
                },
            };

            segments.push(segment);
        }

        // update state
        state.x = new_x;
        state.y = new_y;

        if let Some(d) = cmd.d {
            state.drawing = d == 1; // D01 = draw, D02 = move
        }
    }

    segments
}
