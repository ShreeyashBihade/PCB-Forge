use pcb_core::*;

pub fn build_pcb(segments: Vec<TraceSegment>) -> PCB {
    PCB {
        name: "Prototype PCB".to_string(),
        units: Unit::Mm,
        outline: None,
        layers: vec![Layer {
            name: "F.Cu".to_string(),
            layer_type: LayerType::Copper,
            traces: segments,
            pads: vec![],
            vias: vec![],
        }],
    }
}