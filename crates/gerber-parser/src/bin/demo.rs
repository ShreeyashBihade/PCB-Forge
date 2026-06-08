use gerber_parser::parse_gerber;

fn main() {
    let sample = r#"
%FSLAX24Y24*%
G00 X0Y0D02*
G01 X1000Y0D01*
G01 X1000Y1000D01*
M02*
"#;

    let pcb = parse_gerber(sample);

    println!("PCB Name: {}", pcb.name);
    println!("Layers: {}", pcb.layers.len());

    for layer in pcb.layers {
        println!("Layer: {}", layer.name);
        println!("Primitives: {}", layer.primitives.len());
    }
}