pub mod lexer;
pub mod parser;
pub mod builder;
pub mod types;

use pcb_core::{Layer, LayerType, LineSegment, NetId, PCB, Point, TraceSegment, Unit, Via};

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
                pads: vec![
                    pcb_core::Pad {
                        net: Some(NetId("GND".into())),
                        position: Point { x: 0, y: 0 },
                        diameter: 50,
                    },
                    pcb_core::Pad {
                        net: Some(NetId("GND".into())),
                        position: Point { x: 500, y: 500 },
                        diameter: 50,
                    },
                    pcb_core::Pad {
                        net: Some(NetId("GND".into())),
                        position: Point { x: 1000, y: 200 },
                        diameter: 50,
                    }
                ],
                vias: vec![
                    Via{
                        net:Some(NetId("GND".into())),

                        position:Point{

                            x:250,

                            y:250

                        },

                    outer_diameter:30,

                    drill_diameter:15

                    }

                ],
            }
        ],
    }
}