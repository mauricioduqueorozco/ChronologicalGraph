function ChronologicalGraph(options) {
  this.moths = [
  		"Enero",
  		"Febrero",
  		"Marzo",
  		"Abril",
  		"Mayo",
  		"Junio",
  		"Julio",
  		"Agosto",
  		"Septiembre",
  		"Octubre",
  		"Noviembre",
  		"Diciembre"
  ]

  this.activities = []
  this.coord = []

  this.stepSize = 40
  // this.numberOfActivities = this.activities.length + 1
  this.numberOfActivities = 2
  this.numberOfWeeks = 53

  this.canvas = document.getElementById("canvas")
  this.canvas.width = this.numberOfWeeks * this.stepSize
  this.canvas.height = this.stepSize * this.numberOfActivities
  this.context = canvas.getContext("2d")

  this.xCanvas = 0
  this.yCanvas = 0
  this.zoomFactor = 0.7

  this.underlap = Math.round(this.stepSize * 0.1)
  this.textSize = "10px Arial"
}

ChronologicalGraph.prototype.init = function() {
	this.clearGrid()
	this.header()
  this.createSteps()
  this.createRules()

  this.keyboard = new KeyboardHandler();
	this.mouse = new MouseHandler();
  // this.handlerEvents()
}

ChronologicalGraph.prototype.handlerEvents = function(){}

ChronologicalGraph.prototype.execute = function() {
	this.init()
  this.loadInfoActivities()
}

ChronologicalGraph.prototype.clearGrid = function(e) {
  this.context.restore()
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

ChronologicalGraph.prototype.header = function() {
  this.context.beginPath()
  this.context.rect(0, 0, this.canvas.width, this.stepSize)
	this.context.fillStyle = '#404759'
	this.context.fill()
}

ChronologicalGraph.prototype.createRules = function(){
  this.createTimeLine()
  this.createTimeLineLabes()
}

ChronologicalGraph.prototype.createTimeLine = function() {
  for (var i = 0; i < this.numberOfWeeks; i++) {
    this.context.beginPath()
    this.context.fillStyle = 'withe'
    this.context.font = this.textSize
    this.context.fillText(i, i * this.stepSize, 30)
  }
}

ChronologicalGraph.prototype.createTimeLineLabes = function() {
  for (var i = 0; i < this.moths.length; i++) {
    this.context.beginPath();
    this.context.fillStyle = 'withe'
    this.context.font = this.textSize
    this.context.fillText(this.moths[i], (i * this.stepSize) * 4.5, 10)
  }
}

ChronologicalGraph.prototype.createSteps = function() {
  var j = 0
  for (var i = this.stepSize; i < this.canvas.height; i = i + this.stepSize) {
    this.context.beginPath()
    this.context.rect(0, i, this.canvas.width, this.stepSize)
    if(j == 0){
      this.context.fillStyle = '#E8E7E4'
      j = 1
    }else{
      this.context.fillStyle = '#428bca'
      j = 0
    }
    this.context.fill()
  }
}

ChronologicalGraph.prototype.graphActivity = function(activity, step, index){
    var unityTime = activity.start
    var durationTime = activity.duration
    var text = activity.name

    this.context.restore()
    this.context.beginPath()
    var x = ((unityTime * this.stepSize) + this.underlap)
    var y = (step + this.underlap)
    var dx = durationTime * this.stepSize
    var dy = this.stepSize - this.underlap
  	this.context.rect( x, y, dx, dy)
  	this.context.fillStyle = '#d89235'
  	this.context.shadowColor = '#999'
  	this.context.shadowBlur = 5
    this.context.shadowOffsetX = 5
    this.context.shadowOffsetY = 5
  	this.context.fill()
    this.context.closePath()

    var ret = this.getCenterShape(x, y, dx, dy)
    this.addTextActivity(ret.x, ret.y, dx, text)

    this.activities[index].coord = {x : x, y : y, xx : x + dx, yy : y + dy}
}
ChronologicalGraph.prototype.graphPopUp = function(startX, startY, info){
     this.context.beginPath();
     this.context.moveTo(startX, startY);
     this.context.bezierCurveTo(startX - (40 * this.zoomFactor), startY + (20 * this.zoomFactor), startX - (40 * this.zoomFactor), startY + (70 * this.zoomFactor), startX + (60 * this.zoomFactor), startY + (70 * this.zoomFactor));
     this.context.bezierCurveTo(startX + (80 * this.zoomFactor), startY + (100 * this.zoomFactor), startX + (150 * this.zoomFactor), startY + (100 * this.zoomFactor), startX + (170 * this.zoomFactor), startY + (70 * this.zoomFactor));
     this.context.bezierCurveTo(startX + (250 * this.zoomFactor), startY + (70 * this.zoomFactor), startX + (250 * this.zoomFactor), startY + (40 * this.zoomFactor), startX + (220 * this.zoomFactor), startY + (20 * this.zoomFactor));
     this.context.bezierCurveTo(startX + (260 * this.zoomFactor), startY - (40 * this.zoomFactor), startX + (200 * this.zoomFactor), startY - (50 * this.zoomFactor), startX + (170 * this.zoomFactor), startY - (30 * this.zoomFactor));
     this.context.bezierCurveTo(startX + (150 * this.zoomFactor), startY - (75 * this.zoomFactor), startX + (80 * this.zoomFactor), startY - (60 * this.zoomFactor), startX + (80 * this.zoomFactor), startY - (30 * this.zoomFactor));
     this.context.bezierCurveTo(startX + (30 * this.zoomFactor), startY - (75 * this.zoomFactor), startX - (20 * this.zoomFactor), startY - (60 * this.zoomFactor), startX, startY);
     this.context.closePath();
     this.context.lineWidth = 3;
     this.context.fillStyle = 'white';
     this.context.fill();
     this.context.strokeStyle = 'black';
     this.context.stroke();

     this.addTextActivity(startX, startY, 50, 'Nombre actividad: ' + info.name)
}

ChronologicalGraph.prototype.addTextActivity = function(x, y, overlap, text){
  // count = count == N ? 0 : count + 1;
  this.context.restore()
  this.context.beginPath()
  this.context.shadowColor = "transparent"
  this.context.fillStyle = 'black'
  this.context.font = this.textSize
  var textSize = Math.round(this.context.measureText(text).width)
  if(textSize > overlap) this.context.fillText(text, (x + overlap), y)
  else this.context.fillText(text, x - (textSize / 2), y) // Center Text
  this.context.closePath()
}

ChronologicalGraph.prototype.getXY = function(){
  return ({x : this.xCanvas , y : this.yCanvas})
}

ChronologicalGraph.prototype.setXY = function(event){
  this.eventClick()
  this.xCanvas = event.layerX
  this.yCanvas = event.layerY
}

ChronologicalGraph.prototype.getCenterShape = function (x, y, xlarge, ylarge) {
  var mx = Math.round((x + (xlarge)/2))
  var my = Math.round((y + (ylarge)/2))
  return { x : mx, y : my}
}

ChronologicalGraph.prototype.updateGraph = function () {
  console.log("hios");
}

ChronologicalGraph.prototype.loadInfoActivities = function () {
  var lengthActivies = this.activities.length
  this.canvas.height = this.stepSize * (this.numberOfActivities + lengthActivies)
  this.init()
  var step = 40
  for (var index in this.activities) {
    this.graphActivity(this.activities[index], step, index)
    step = step + 40
  }
}

ChronologicalGraph.prototype.addActivity = function (activity){
  this.activities.push(activity)
  this.loadInfoActivities()
}

ChronologicalGraph.prototype.eventClick = function (){
  this.detectShape()
}

ChronologicalGraph.prototype.detectShape = function (){
  var xyM = this.getXY()
  for (var index in this.activities) {
    var coord = this.activities[index].coord
    if(xyM.x > coord.x && xyM.x < coord.xx && xyM.y > coord.y && xyM.y < coord.yy) {
      console.log("Entra: " , index, this.getInfoActivity(index))
      this.execute()
      this.graphPopUp(this.getXY().x, this.getXY().y, this.getInfoActivity(index))
    }
  }
}

ChronologicalGraph.prototype.getInfoActivity = function (index) {
  return this.activities[index]
}
