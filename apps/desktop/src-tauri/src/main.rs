#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::State;
use gerber_parser::parse_gerber_to_pcb;
mod zip_loader;

#[tauri::command]
fn load_demo_pcb() -> pcb_core::PCB {
    parse_gerber_to_pcb("demo")
}

#[tauri::command]
fn list_zip_files(
    path: String,
) -> Result<Vec<String>, String> {

    zip_loader::list_zip_files(
        &path
    )

}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_demo_pcb, list_zip_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}