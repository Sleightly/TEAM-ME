var sim = function(start, end) {
  if(!start || !end){
    console.log("ERROR: Bad Sim");
    return;
  }
  this.running = false;
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

  this.start = function(){
    this.running = true;
    this.run();
  }

  this.run = function(){
    //console.log(this.index)
    this.currentTime+=this.interval;
    if(this.currentTime> this.end || !this.running){
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

  this.reset = function(){
    this.running = false;
    this.index = 0;
    this.currentTime = this.start;
    //delete all markers
  }

}

var activeSim = null;

setTimeout(function(){
  demosims.push(new sim(1508456827000, 1508460427000));
  console.log('simmed')
}, 1000)

var demosims = [];

var startDemo = function(start, end){
  $('#menu').css('display', 'none');
  $('#control').css('display', 'block');
  $('.timeDisplay').css('font-size', $('#control').height()*.9+'px');
  if(!start){
    activeSim = demosims[0];
  }else{
    activeSim = new sim(start, end);
  }
}

var demo1 = function(){
  startDemo()
}