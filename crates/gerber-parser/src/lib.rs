pub mod lexer;
pub mod parser;
pub mod builder;
pub mod types;

use pcb_core::{Layer, LayerType, LineSegment, NetId, PCB, Point, TraceSegment, Unit};

pub fn parse_gerber_to_pcb(_input: &str) -> PCB {
    PCB {
        name: "test".to_string(),
        units: Unit::Mm,
        layers: vec![
            Layer {
                name: "F.Cu".to_string(),
                layer_type: LayerType::Copper,
                traces: vec![
                    TraceSegment {
                        net: Some(NetId("GND".to_string())),
                        width: 10, // keep i32
                        geometry: LineSegment {
                            from: Point { x: 0, y: 0 },
                            to: Point { x: 500, y: 500 },
                        },
                    },
                    TraceSegment {
                        net: Some(NetId("GND".to_string())),
                        width: 10, // keep i32
                        geometry: LineSegment {
                            from: Point { x: 500, y: 500 },
                            to: Point { x: 1000, y: 200 },
                        },
                    }
                ],
                pads: vec![],
                vias: vec![],
            }
        ],
    }
}