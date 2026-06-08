use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Point2D {
    pub x: f32,
    pub y: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Polygon {
    pub points: Vec<Point2D>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Track {
    pub width: f32,
    pub path: Vec<Point2D>,
    pub net: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Pad {
    pub center: Point2D,
    pub width: f32,
    pub height: f32,
    pub net: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DrillHole {
    pub center: Point2D,
    pub diameter: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Primitive {
    Track(Track),
    Pad(Pad),
    Polygon(Polygon),
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
    pub primitives: Vec<Primitive>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PCB {
    pub name: String,
    pub layers: Vec<Layer>,
    pub outline: Polygon,
    pub holes: Vec<DrillHole>,
}