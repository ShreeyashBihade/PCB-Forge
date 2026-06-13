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
    zip_loader::list_zip_files(&path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(
            tauri::generate_handler![
                load_demo_pcb,
                list_zip_files
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}