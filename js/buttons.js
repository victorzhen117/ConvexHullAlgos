$(document).ready(function(){
  $('.headingsInSecond').hide();
  $('.bottomTexts').hide();
  $('.matrix-container').hide();
  $('.table-container-references').hide();
  $('#TitleText1').hide();
    $('#TitleText2').hide();
    $('#TitleText3').hide();
  $("#appButton").click(function(){
    $('.bottomTexts').hide();
    $('.matrix-container').hide();
    $('.table-container-references').hide();
    $('#JarvisMarchText').hide();
    $('#GrahamScanText').hide();
    $('#ChansAlgoText').hide();
    $('#firstText').slideToggle();
    $('#TitleText1').hide();
    $('#TitleText2').hide();
    $('#TitleText3').hide();
  });
  $("#algButton").click(function(){
    $('.bottomTexts').hide();
    $('.matrix-container').hide();
    $('.table-container-references').hide();
    $('#JarvisMarchText').slideToggle();
    $('#GrahamScanText').slideToggle();
    $('#ChansAlgoText').slideToggle();
    $('.matrix-container').slideToggle();
    $('#tempText').slideToggle();
    $('#TitleText1').slideToggle();
    $('#TitleText2').slideToggle();
    $('#TitleText3').slideToggle();
  });
  $("#inspButton").click(function(){
    $('.bottomTexts').hide();
    $('.matrix-container').hide();
    $('.table-container-references').hide();
    $('#JarvisMarchText').hide();
    $('#GrahamScanText').hide();
    $('#ChansAlgoText').hide();
    $('#thirdText').slideToggle();
    $('#TitleText1').hide();
    $('#TitleText2').hide();
    $('#TitleText3').hide();
  });
  $("#refButton").click(function(){
    $('.bottomTexts').hide();
    $('.matrix-container').hide();
    $('.table-container-references').hide();
    $('#JarvisMarchText').hide();
    $('#GrahamScanText').hide();
    $('#ChansAlgoText').hide();
    $('#fourthText').slideToggle();
    $('.table-container-references').slideToggle();
    $('#TitleText1').hide();
    $('#TitleText2').hide();
    $('#TitleText3').hide();
  });
});
