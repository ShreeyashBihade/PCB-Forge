pub mod lexer;
pub mod parser;
pub mod builder;
pub mod types;

use parser::parse_commands;
use builder::build_pcb;

pub fn parse_gerber(input: &str) -> pcb_core::PCB {
    let commands = parse_commands(input);
    let segments = parser::process_moves(commands);
    build_pcb(segments)
}