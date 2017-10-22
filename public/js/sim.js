var sim = function(start, end) {
  if(!start || !end){
    console.log("ERROR: Bad Sim");
    return;
  }
  this.start = start;
  this.end = end;
  this.timeScale = 100;
  this.interval = 1000;
  this.currentTime = start;
  var bounds = map.getBounds();
  this.bounds = bounds = [bounds.getNorthEast(), bounds.getSouthWest()];
  var bbox = bounds[0].lat()+':'+bounds[0].lng()+','+bounds[1].lat()+':'+bounds[1].lng();
  this.events = att.getData(bbox, start, end);
  this.index = 0;

  this.setTimeScale = function(scale){
    this.timeScale = scale;
  }

  this.run = function(){
    console.log(this.index)
    this.currentTime+=this.interval;
    if(this.currentTime> this.end){
      console.log('ended');
      return;
    }
    for(; this.index< this.events.length; this.index++){
      var event = this.events[this.index];
      if(event.time<=this.currentTime+this.interval){
        makeMarker(event.location, event.coords, 'car', event.measures.speed, event.measures.vehicleCount);
      }else{
        break;
      }
    }
    setTimeout(this.run.bind(this), this.interval/this.timeScale);
  }

}