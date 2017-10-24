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
  this.events = [];
  wh.startSimQuery(this, bbox, start, end);
  this.index = 0;

  this.increaseScale = function(){
    this.timeScale=this.timeScale*5;
  }
  this.decreaseScale = function(){
    this.timeScale=this.timeScale/5;
  }

  this.begin = function(){
    if(phone)
      $.get('/demoStart', ()=>{});
    console.log('starting sim')
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

var workerHandler = function() {
  var taskrunning = false;
  var att = new Worker('js/trafficData.js');
  var holdMessage = "";
  var box = $('#qstatus');
  var status = $('#qstatus #message');
  var percentage = $('#qstatus #percentage');
  var currentSim = null;
  this.startSimQuery = (sim, bbox, start, end) => {
    if(!sim||!bbox||!start||!end){
      console.log('Bad Query');
      return;
    }
    if(taskrunning){
      setHolder("A task is currently running. Please wait until it finishes execution.");
      return;
    }
    currentsim = sim;
    att.postMessage({bbox, start, end});
    percentage.css('background-color', 'rgba(100,255,100,.5)');
    taskrunning = true;
    loadDots(0);
  }
  this.canRun = () => {
    return !taskrunning;
  }
  att.onmessage = (e) => {
    if(e.data.percentage!=undefined)percentage.html(e.data.percentage+'%');
    else if(e.data.events){
      currentsim.events = e.data.events;
      if(demosims.indexOf(currentsim)==-1){
        $('#menu').css('display', 'none');
        $('#control').css('display', 'block');
        $('.timeDisplay').css('font-size', $('#control').height()*.9+'px');
      }
      taskrunning = false;
      status.html('Success!  Query has finished loading.');
      currentsim = null;
    }else if(e.error){
      taskrunning = false;
      status.html('Sorry, an error occured.  Please try waiting some time or contacting the developers.');
      percentage.css('background-color', 'rgba(255,100,100,.5)');
    }
  }
  function loadDots(num){
    if(!taskrunning)return;
    var ret = "Please wait, currently loading query from AT&T Intelligent City API";
    for(var i = 0; i<num; i++){
      ret+='.';
    }
    if(holdMessage=="")status.html(ret);
    setTimeout(()=>{
      loadDots((num+1)%5);
    }, 1000);
  }
  this.setHolder=(msg) => {
    holdMessage = msg;
    status.html(holdMessage);
    setTimeout(()=>{holdMessage=""},1000);
  }
}

var wh = new workerHandler();

var hour = $('#hour');
var min = $('#min');
var second = $('#second');


var activeSim = null;

var demosims = [];
setTimeout(()=>{
  demosims.push(new sim(1508456827000, 1508460427000));
},1000)

var startDemo = function(start, end){
  if(!wh.canRun()){
    wh.setHolder("A task is currently running. Please wait until it finishes execution.");
    return;
  }
  if(!start){
    $('#menu').css('display', 'none');
    $('#control').css('display', 'block');
    $('.timeDisplay').css('font-size', $('#control').height()*.9+'px');
    activeSim = demosims[0];
  }else{
    activeSim = new sim(start, end, true);
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

var customDemo = function(){
  var start = parseInt($('#startTime').val());
  var end = start+parseInt($('#duration').val());
  startDemo(start, end);
}