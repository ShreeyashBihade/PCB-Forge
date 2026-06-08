use pcb_core::*;

pub fn parse_gerber(_input: &str) -> PCB {
    PCB {
        name: "Prototype PCB".to_string(),
        layers: vec![Layer {
            name: "F.Cu".to_string(),
            layer_type: LayerType::Copper,
            primitives: vec![Primitive::Track(Track {
                width: 0.2,
                path: vec![
                    Point2D { x: 0.0, y: 0.0 },
                    Point2D { x: 10.0, y: 0.0 },
                    Point2D { x: 10.0, y: 10.0 },
                ],
                net: None,
            })],
        }],
        outline: Polygon { points: vec![] },
        holes: vec![],
    }
}
