$root = "pcb-forge"

$dirs = @(
    "$root",

    "$root\apps",
    "$root\apps\desktop",
    "$root\apps\desktop\src",
    "$root\apps\desktop\src\ui",
    "$root\apps\desktop\src\state",
    "$root\apps\desktop\src\bridge",
    "$root\apps\desktop\tauri",

    "$root\apps\renderer",
    "$root\apps\renderer\core",
    "$root\apps\renderer\layers",
    "$root\apps\renderer\geometry",
    "$root\apps\renderer\shaders",

    "$root\crates",
    "$root\crates\pcb-core",
    "$root\crates\pcb-core\src",

    "$root\crates\gerber-parser",
    "$root\crates\gerber-parser\src",

    "$root\crates\excellon-parser",
    "$root\crates\excellon-parser\src",

    "$root\crates\dfm-engine",
    "$root\crates\dfm-engine\src",

    "$root\crates\thermal-engine",
    "$root\crates\thermal-engine\src",

    "$root\crates\geometry",
    "$root\crates\geometry\src",

    "$root\crates\performance",
    "$root\crates\performance\src",

    "$root\crates\db",
    "$root\crates\db\src",

    "$root\shared",
    "$root\shared\types",
    "$root\shared\constants",

    "$root\db",

    "$root\docs",

    "$root\tests",
    "$root\tests\gerbers",
    "$root\tests\excellon",
    "$root\tests\golden"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$files = @(
    "$root\Cargo.toml",

    "$root\apps\desktop\src\main.tsx",

    "$root\crates\pcb-core\Cargo.toml",
    "$root\crates\pcb-core\src\lib.rs",

    "$root\crates\gerber-parser\Cargo.toml",
    "$root\crates\gerber-parser\src\lib.rs",
    "$root\crates\gerber-parser\src\lexer.rs",
    "$root\crates\gerber-parser\src\parser.rs",
    "$root\crates\gerber-parser\src\aperture.rs",
    "$root\crates\gerber-parser\src\interpreter.rs",
    "$root\crates\gerber-parser\src\builder.rs",

    "$root\crates\excellon-parser\Cargo.toml",
    "$root\crates\excellon-parser\src\lib.rs",

    "$root\crates\dfm-engine\Cargo.toml",
    "$root\crates\dfm-engine\src\lib.rs",

    "$root\crates\thermal-engine\Cargo.toml",
    "$root\crates\thermal-engine\src\lib.rs",

    "$root\crates\geometry\Cargo.toml",
    "$root\crates\geometry\src\lib.rs",

    "$root\crates\performance\Cargo.toml",
    "$root\crates\performance\src\lib.rs",

    "$root\crates\db\Cargo.toml",
    "$root\crates\db\src\lib.rs",

    "$root\db\schema.sql",

    "$root\docs\architecture.md",
    "$root\docs\dfm-rules.md",
    "$root\docs\thermal-model.md"
)

foreach ($file in $files) {
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
    }
}

Write-Host "PCB Forge project structure created successfully."