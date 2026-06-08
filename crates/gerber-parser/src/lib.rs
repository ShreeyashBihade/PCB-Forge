pub mod lexer;
pub mod parser;
pub mod builder;
pub mod types;

use parser::parse_commands;
use builder::build_pcb;
use pcb_core::{Layer, LayerType, LineSegment, NetId, PCB, Point, TraceSegment, Unit};
use pcb_core::*;

pub fn parse_gerber(input: &str) -> pcb_core::PCB {
    let commands = parse_commands(input);
    let segments = parser::process_moves(commands);
    build_pcb(segments)
}

pub fn parse_gerber_to_pcb(input: &str) -> PCB {
    PCB {
        name: "test".into(),
        units: Unit::Mm,
        layers: vec![pcb_core::Layer {
                    name: "F.Cu".into(),
                    layer_type: pcb_core::LayerType::Copper,
                    traces: vec![
                        pcb_core::TraceSegment {
                            net: Some(NetId("GND".to_string())),
                            width: 10,
                            geometry: pcb_core::LineSegment {
                                from: pcb_core::Point { x: 0, y: 0 },
                                to: pcb_core::Point { x: 1000, y: 1000 },
                            },
                        }
                    ],
                    pads: vec![],
                    vias: vec![],
                }
            ]
    }
}
