var sim = function(start, end, phone) {
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

  this.increaseScale = function(){
    this.timeScale=this.timeScale*5;
  }
  this.decreaseScale = function(){
    this.timeScale=this.timeScale/5;
  }

  this.begin = function(){
    if(phone)
      console.log('starting sim')
    $.get('/demoStart', ()=>{});
    this.running = true;
    this.run();
  }

  this.run = function(){
    //console.log(this.index)
    this.currentTime+=this.interval;
    if(this.currentTime> this.end || !this.running){
      $.get('/demoEnd', ()=>{});
      console.log('ended');
      return;
    }
    for(; this.index< this.events.length; this.index++){
      var event = this.events[this.index];
      if(event.time<=this.currentTime+this.interval){
        if(event.type=='car')
          makeMarker(event.location, event.coords, event.type, event.measures.speed, event.measures.vehicleCount);
        else
          makeMarker(event.location, event.coords, event.type, event.measures.speed, event.measures.pedestrianCount);
      }else{
        break;
      }
    }
    var time = (new Date(this.currentTime));
    var h = String(time.getHours());
    var m = String(time.getMinutes());
    var s = String(time.getSeconds());
    h = h.length==1 ? '0'+h:h;
    m = m.length==1 ? '0'+m:m;
    s = s.length==1 ? '0'+s:s;
    hour.html(h);
    min.html(m);
    second.html(s);
    setTimeout(this.run.bind(this), this.interval/this.timeScale);
  }

  this.reset = function(){
    if(phone)
    $.get('/demoEnd', ()=>{});
    this.running = false;
    this.index = 0;
    this.currentTime = this.start;
    hour.html('00')
    min.html('00')
    second.html('00')
    resetSimulation();
  }

}

var hour = $('#hour');
var min = $('#min');
var second = $('#second');


var activeSim = null;

setTimeout(function(){
  demosims.push(new sim(1508456827000, 1508460427000, true));
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

var endDemo = function(){
  $('#menu').css('display', 'block');
  $('#control').css('display', 'none');
  activeSim.reset();
}

var demo1 = function(){
  startDemo()
}