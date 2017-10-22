var togglePhone = function(){
  if(!phonetog.attr('open')){
    phonetog.html('>>');
    phonetog.attr('open', true);
    $('#phoneMenu').css('display', 'block');
    $('#background').css('width', '100%');
  }else{
    phonetog.html('<<');
    phonetog.attr('open', false);
    $('#phoneMenu').css('display', 'none');
    $('#background').css('width', '12%');
  }
}

var submitNum = function(){
  var num = $('#phoneNumber').val();
  $.post('/phoneNumber', {
    num: num
  }, ()=>{});
  $('#phoneNumber').val("")
}

var phonetog = $('#openButt');