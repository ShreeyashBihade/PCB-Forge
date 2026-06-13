use std::fs::File;
use std::io::Read;

use zip::ZipArchive;

pub fn list_zip_files(
    path: &str,
) -> Result<Vec<String>, String> {

    let file = 
        File::open(path)

        .map_err(|e| e.to_string())?;

    let mut archive =

        ZipArchive::new(file)

        .map_err(|e| e.to_string())?;

    let mut files = Vec::new();

    for i in 0..archive.len() {

        let file =

            archive
                .by_index(i)
                .map_err(|e| e.to_string())?;

        files.push(
            file.name().to_string()
        );

    }

    Ok(files)
}
