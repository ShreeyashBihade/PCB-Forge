#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::State;
use gerber_parser::parse_gerber_to_pcb;

#[tauri::command]
fn load_demo_pcb() -> pcb_core::PCB {
    parse_gerber_to_pcb("demo")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_demo_pcb])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}