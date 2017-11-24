# ChronologicalGraph
It is a chronological calendar weekly Graphical on Canvas, full customizable

Pure Javascript library working on canvas.

# Constructor
```
var chronological = new ChronologicalGraph()
```
Browser

```
<body>
  <div style="height:250px; width:650px; overflow-y: scroll; border:1px solid #000000;">
    <canvas id="canvas"></canvas>
  </div>
</body>
<script type="text/javascript" src="./index.js"></script>
```

# Add activities

```
chronological.addActivity({
  name : "Name"
  duration : [Integer], // Weeks
  start : [Integer] // Week of year
})
```
# Add events
```
chronological.canvas.addEventListener('click', (event) => {
  chronological.setXY(event)
}, false);
```

# Setting

Size of step

```
chronological.stepSize = 40 //px
```

Zoom zoomFactor
```
chronological.zoomFactor = 0.7
```
