export default function PropertiesPanel({

selected,

pcb,

}:{

selected:any;

pcb:any;

}){

if(!selected){

return(

<div
style={{

padding:16,

borderTop:"1px solid #333",

}}

>

<h3>

Properties

</h3>

<div>

No selection

</div>

</div>

);

}

const layer=

pcb.layers[selected.layer];

if(selected.type==="pad"){

const pad=

layer.pads[selected.index];

return(

<div
style={{

padding:16,

borderTop:"1px solid #333",

}}

>

<h3>

Properties

</h3>

<p>

<b>Type:</b> Pad

</p>

<p>

<b>Net:</b>

{pad.net??"N/A"}

</p>

<p>

<b>Diameter:</b>

{pad.diameter}

</p>

<p>

<b>X:</b>

{pad.position.x}

</p>

<p>

<b>Y:</b>

{pad.position.y}

</p>

</div>

);

}

if(selected.type==="via"){

const via=

layer.vias[selected.index];

return(

<div
style={{

padding:16,

borderTop:"1px solid #333",

}}

>

<h3>

Properties

</h3>

<p>

<b>Type:</b> Via

</p>

<p>

<b>Net:</b>

{via.net??"N/A"}

</p>

<p>

<b>Outer:</b>

{via.outer_diameter}

</p>

<p>

<b>Drill:</b>

{via.drill_diameter}

</p>

<p>

<b>X:</b>

{via.position.x}

</p>

<p>

<b>Y:</b>

{via.position.y}

</p>

</div>

);

}

return null;

}