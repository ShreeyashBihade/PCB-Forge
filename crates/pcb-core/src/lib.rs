use serde::{Serialize, Deserialize};

pub type Microns = i32;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Point {
    pub x: Microns,
    pub y: Microns,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LineSegment {
    pub from: Point,
    pub to: Point,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct NetId(pub String);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TraceSegment {
    pub net: Option<NetId>,
    pub width: Microns,
    pub geometry: LineSegment,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Pad {
    pub net: Option<NetId>,
    pub position: Point,
    pub diameter: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Via {
    pub net: Option<NetId>,
    pub position: Point,
    pub outer_diameter: i32,
    pub drill_diameter: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LayerType {
    Copper,
    Silkscreen,
    SolderMask,
    Drill,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Layer {
    pub name: String,
    pub layer_type: LayerType,
    pub traces: Vec<TraceSegment>,
    pub pads: Vec<Pad>,
    pub vias: Vec<Via>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PCB {
    pub name: String,
    pub units: Unit,
    pub layers: Vec<Layer>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum Unit {
    Mm,
    Inch,
}

fn mm(v: f32) -> Microns {
    (v * 1000.0) as i32
}
