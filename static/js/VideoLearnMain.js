import {gettingScript} from './videoLesson/loadScript.js'
import {onYouTubeIframeAPIReady as loadVideo, mainPlayer as player } from './videoLesson/youtubeAPI.js'

var mainVideoId = 'WyrQWgIhByg'
var scriptLocation = '../../newjson.json'


var loadedScript=[];
var loadedLesson=[];

gettingScript(scriptLocation)
  .then(function(result){
    console.log('here is the scriptloaded ', result);
    loadedScript = result.caption
    loadedLesson = result.lesson_content
    loadLessonCard(result)
    return loadedLesson
  })
  .then(function(result){
    loadVideo(result)})



//loading video to placeholder

loadVideo(loadedLesson)
// console.log('this is player ',player);

$('#learnButton').on('click', function(){

console.log('learnButton works')
sentencePop();
lessonBoxPop()
learnSequence();
modalHide();

});

function initialize(){
repeatShowScript()
}


function checkPause(e){
    if (e.data == 2){
        console.log(e.data)
        modalPop()
    }
    else if (e.data==1){
        modalHide()
        lessonCardHide()

    }
}


//json file loaded for script






var currentIndex = 0;
//input the correct object in the subtitle box
//this makes a loop through all the objects
function findindex(){
    currentIndex = loadedScript.length - 1;
  for(var i=0; i<loadedScript.length; i++) {
    if (loadedScript[i].END_AT > player.getCurrentTime()){
        currentIndex = i;
        break;
    }
  }//failsafe for when the last object in the script is reached
}



//this is the function that inputs the correct script and lesson into the corresponding div boxes
function showScriptNow(){
  findindex()
  var scriptNow = loadedScript[currentIndex];
  var sentenceNow = scriptNow["SENTENCE"]

  $("#subtitleboxEng").text(scriptNow["TRANSLATION"]);
  $("#subtitleboxKor").text(sentenceNow);

  var scriptPrev = loadedScript[currentIndex-1]; //error appears in the console till the first line passes
  var sentencePrev = scriptPrev["SENTENCE"]
  //change to sentencePrev if want to use the weird way
  return sentenceNow;
}


//repeats Showscript function every 0.5 seconds
function repeatShowScript(){
  setInterval(function () {showScriptNow()
  },500)
}


function sentencePop(){

var nowindex = currentIndex
//var previndex = currentIndex-1
var scriptNow = loadedScript[currentIndex];
//var scriptNow = loadedScript[findindex()-1];
var currentwords = scriptNow.WORDS;
for(var i=0; i<currentwords.length; i++){
  console.log('sentPop is working for each words: ', currentwords)
  $("#realmainsentContainer").append("<div id=realmainsent class=real-mainsent></div>")
  $("#realmainsent").append("<button id=breakWord"+i+" number="+i+" class=realmain-words></button>");
  $("#breakWord"+i).html(currentwords[i].WORD);

}
  $(".realmain-words").on('click', function(){
    const number = $(this).attr('number');
    const scriptNow = loadedScript[nowindex];
    const currentwords = scriptNow.WORDS;

  $('#sentenceBreakdown').html(""); //this takes away the existing word breakdown box
  //$('#sentenceBreakdown').append("<div id=wordbreakdown"+number+"></div>");

  $('#sentenceBreakdown').append("<div id=wordbreakdownWord"+number+" class=wordbreakdown-Word></div>");
  $("#wordbreakdownWord"+number+"").text(currentwords[number].WORD);

  $('#sentenceBreakdown').append("<div id=wordbreakdownBaseWord"+number+" class=wordbreakdown-BaseWord></div>");
  $("#wordbreakdownWord"+number+"").text(currentwords[number].baseword);

  $('#sentenceBreakdown').append("<div id=wordbreakdownTrans"+number+" class=wordbreakdown-Trans></div>");
  $("#wordbreakdownTrans"+number+"").text(currentwords[number].TRANSLATION);

  $('#sentenceBreakdown').append("<div id=wordbreakdownPronun"+number+" class=wordbreakdown-Pronun></div>");
  $("#wordbreakdownPronun"+number+"").text(currentwords[number].PRONOUNCIATION);

  $('#sentenceBreakdown').append("<div id=wordbreakdownWordType"+number+" class=wordbreakdown-WordType></div>");
  $("#wordbreakdownWordType"+number+"").text(currentwords[number].WORD_TYPE);


  $("#showTag").on('click', function(){
    //show css for tag data
})

  });

};

//this is a function that controls the sequence of the learning experience

function learnSequence(){
console.log('learn sequence is working')

player.seekTo(loadedScript[currentIndex-1].END_AT)// for some reason, currentIndes sends the video to next index
player.playVideo()


setTimeout(function() { player.pauseVideo() }, getTimeGap())

}


function getTimeGap(){
    var timeOfNow = loadedScript[currentIndex-1].END_AT;
    var timeOfNext = loadedScript[currentIndex].END_AT;
    var timeGap = timeOfNext - timeOfNow;
    console.log('The time gap is', timeGap);
    return timeGap * 1000;
}
// function sentencePause(){




//player.playVideo()


function play(){
    player.playVideo()
}
function pause(){
    player.pauseVideo()
}
//keyboard control *change this to a toggle between play/pause
// $(document).toggle(function(event){
//  if(event.which == 32){
//   event.preventDefault()
//    player.playVideo()
//    player.pauseVideo();
//    }
//  });


//button controls
$('#play').on('click', function () {
    player.playVideo();
    $("#realmainsent").html(""); //이 객체를 #lessonbox로 설정했을때 api하고 충돌 같은 오류가 일어남! 왜이지?
    $("#sentenceBreakdown").html("");
});

$('#pause').on('click', function(){
    player.pauseVideo();
});

// $(document).toggle(function(event){
//     if(event.which == 32){
//         player.playVideo();
//         player.pauseVideo();
//     }
// })

//FUNCTION that gives the next sent to scriptNow


//var nextscript  = loadedScript.indexOf(showScriptNow())+1

$(document).keydown(function(event){
 if(event.which == 39){
   player.seekTo(loadedScript[currentIndex+1].END_AT)
$("#sentenceToLearn").text(loadedScript[currentIndex].SENTENCE)
}
});

$('#skip').on('click', function () {
    player.seekTo(loadedScript[currentIndex+1].END_AT);
});


$('#back').on('click', function () {
    player.seekTo(loadedScript[currentIndex-2].END_AT);
});
$(document).keydown(function(event){
 if(event.which == 37){
   player.seekTo(loadedScript[currentIndex-2].END_AT)}
 });

 //modal control box script
 $("#pause").on('click', function(){
     console.log(loadedScript[currentIndex].SENTENCE)
     $("#sentenceToLearn").text(loadedScript[currentIndex].SENTENCE)
 })

function modalPop(){
    console.log('modalpop works')
    var modal = $(".custom-modal")
    console.log(modal)
    modal[0].style.display = 'block' //why need [0]??
}
function modalHide(){
    var modal= $(".custom-modal")
    modal[0].style.display='none'
}
//function that displays the mainSent boxes
function lessonBoxPop(){
  let lessonbox = $("#lessonBox")
  lessonbox[0].style.display = 'block'
}
function lessonBoxHide(){
  let lessonbox = $("#lessonBox")
  lessonbox[0].style.display = 'none'
}
//lesson card funcitonality
//make lesson card icon& button appear when script.lesson_content exists

function lessonCardPop(){
  let lessonContainer = $("#lessonCard")
  lessonContainer[0].style.display = 'block'
}
function lessonCardHide(){
  let lessonContainer = $("#lessonCard")
  lessonContainer[0].style.display = 'none'
}

//load all necessary lesson card components
$("#lessonCardButton").on('click',function(){
lessonBoxHide()
lessonCardPop()
console.log('lessCardButton is working');
// $('#lessonContent').html("");



})

var currentNumber;
//function that adds one till three
function addOne(n){
  if(n===3){
      return
    }else if(n===1 || n===2){
      console.log('currenNum is now...: ', n)
      return n+1
    }else{
      return
    }
}

//controls happening inside the lesson card
$("#cardButtonNext").on('click', function(){
  let currentActive = $(".card-body div.active");
  let dataOrder = parseInt($(currentActive).attr("data-order"));
  let nextOrder = addOne(dataOrder);
  let nextActive =  $(".card-body div[data-order='"+nextOrder+"']");

  if(dataOrder===2){
    $(currentActive).removeClass('active');
    $(currentActive).hide();
    $('#cardButtonNext').hide();
    $(nextActive).addClass('active');
    $(nextActive).css("display", "block");
  }else{
    $(currentActive).removeClass('active');
    $(nextActive).addClass('active');
    $(currentActive).hide();
    $(nextActive).show();
  }

  //add to disapear next button when reach 3;
})

function loadLessonCard(){
  for(var i=0; i<loadedLesson.length; i++){
    $('#cardBody').append('<div id="cardContent'+i+'" class="card-content"></div>')
    $('#cardContent'+i).append('<div id="cardTitle'+i+'" class="lesson-title card-title"></div>')
                      .append('<div id="cardDescription'+i+'" data-order=1 class="lesson-card-content active lesson-description card-text"></div>')
                      .append('<div id="cardEquation'+i+'" data-order=2 class="lesson-card-content lesson-equation text-center"></div>')
                      .append('<div id="cardCase'+i+'" data-order=3 class="lesson-card-content lesson-card-case text-center"></div>')

    $('#cardCase'+i).append('<div id="cardCaseSentence'+i+'" class="card-case-sentence"></div>')
                    .append('<div id="cardCaseStructure'+i+'" class="card-case-structure"></div>')
                    .append('<div id="cardCaseTranslation'+i+'" class="card-case-translation"></div>')
                    .append('<div id="cardCaseVidImage'+i+'" class="card-case-vid-image"></div>')



    $('#cardTitle'+i).text(loadedLesson[i].TITLE)
    $('#cardDescription'+i).text(loadedLesson[i].Description)
    $('#cardEquation'+i).text('here is how to use '+loadedLesson[i].UsageCase.main_case.lesson_element+' '+loadedLesson[0].Equation)



    var numOtherCase = loadedLesson[i].UsageCase.other_case
    for(var x=0; x<numOtherCase.length; x++){
      console.log('loop for numOtherCase is working really: ', numOtherCase);
      let otherCaseVidId = numOtherCase[x].source.vid_id;
      $('#cardCaseSentence'+i).append('<div id="caseSentence'+i+x+'" class="case-sentence"  data-vidId="'+otherCaseVidId+'"></div>')
        $('#caseSentence'+i+x).text(numOtherCase[x].sentence).click(activateCase)

      $('#cardCaseStructure'+i).append('<div id="caseStructure'+i+x+'" class="case-structure"></div>')
        $('#caseStructure'+i+x).append('<div id="peripheralElement'+i+x+'" class="peripheral-element"></div>')
          $('#peripheralElement'+i+x).append('<div id="peripheralElementMain'+i+x+'" class="peripheral-element-main"></div>').append('<div id="peripheralElementLeft'+i+x+'" class="peripheral-element-left"></div>').append('<div id="peripheralElementRight'+i+x+'" class="peripheral-element-right"></div>')
            $('#peripheralElementMain'+i+x).text(numOtherCase[x].lesson_element)
            $('#peripheralElementLeft'+i+x).text(numOtherCase[x].peripheral_element.left_side_element)
            $('#peripheralElementRight'+i+x).text(numOtherCase[x].peripheral_element.right_side_element)

      $('#cardCaseTranslation'+i).append('<div id="caseTranslation'+i+x+'" class="case-translation"></div>')
      $('#caseTranslation'+i+x).text(numOtherCase[x].translation)
    }
  }
//feature that fetches othercaseinfo into carstructure and make interface

//////
// $('#cardMainCase').append('<div id="leftSideElement" class="left-side-element"></div>')
// $('#cardMainCase').append('<div id="mainElement" class="main-element" ></div>')
// $('#cardMainCase').append('<div id="rightSideElement" class="right-side-element"></div>')
// $('#mainElement').text(loadedLesson[0].UsageCase.main_case.lesson_element)
// $('#leftSideElement').text(loadedLesson[0].UsageCase.main_case.peripheral_element.left_side_element)
// $('#rightSideElement').text(loadedLesson[0].UsageCase.main_case.peripheral_element.right_side_element)
/////

//append the other_case
// for(var x=0; x<loadedLesson.length;x++)
//   var numOtherCase = loadedLesson[x].UsageCase.other_case //make this into another loop for multiple lessons
//   console.log('this is length of numOthercase: ', typeof(numOtherCase.length));
//   for(var i=0; i<numOtherCase.length; i++){
//     console.log('looping for numOthercase is working')
//     let otherCaseVidId = loadedLesson[0].UsageCase.other_case[i].source.vid_id;
//     $('#cardStructure').append('<div id="cardOtherCase'+i+'" class="lesson-structure" data-vidId="'+otherCaseVidId+'"></div>').children('.lesson-structure').click(activateCase)//chanied jquery method. this is necessary to attach click events on newly appended element
//     $('#cardOtherCase'+i).append('<div id="otherLeftSideElement'+i+'" class="left-side-element"></div>')
//     $('#cardOtherCase'+i).append('<div id="otherMainElement'+i+'" class="main-element" ></div>')
//     $('#cardOtherCase'+i).append('<div id="otherRightSideElement'+i+'" class="right-side-element"></div>')
//     $('#otherMainElement'+i).text(loadedLesson[0].UsageCase.other_case[i].lesson_element)
//     $('#otherLeftSideElement'+i).text(loadedLesson[0].UsageCase.other_case[i].peripheral_element.left_side_element)
//     $('#otherRightSideElement'+i).text(loadedLesson[0].UsageCase.other_case[i].peripheral_element.right_side_element)
//
//   //change the appendee to #cardOtherCaseContent
//     $('#cardOtherCase').append('<div id="cardOtherCaseContent'+i+'"></div>')
//     $('#cardOtherCaseContent'+i).append('<div id="otherCaseSource'+i+'" class="other-case-source"></div>').append('<div id="otherPeriph'+i+'"class="other-periph" ></div>')//dafult should be hidden for OtherPeriph
//
//         $('#otherPeriph'+i).append('<div id="otherPeriphLeftForm'+i+'" class="other-left-periph"></div> ').append('<div id="otherPeriphRightForm'+i+'" class="other-right-periph"></div>')
//         $('#otherPeriphLeftForm'+i).append('<div id="otherPeriphLeftFull'+i+'"></div>').append('<div id="otherPeriphLeftDef'+i+'"></div>')
//         $('#otherPeriphRightForm'+i).append('<div id="otherPeriphRightFull'+i+'"></div>').append('<div id="otherPeriphRightDef'+i+'"></div>')
//
//     //texting the divs
//         $('#otherPeriphLeftFull'+i).text(loadedLesson[0].UsageCase.other_case[i].peripheral_element.left_side_element_fullform)
//         $('#otherPeriphRightFull'+i).text(loadedLesson[0].UsageCase.other_case[i].peripheral_element.right_side_element_fullform)
//         $('#otherPeriphLeftDef'+i).text(loadedLesson[0].UsageCase.other_case[i].peripheral_element.left_side_element_def)
//         $('#otherPeriphRightDef'+i).text(loadedLesson[0].UsageCase.other_case[i].peripheral_element.right_side_element_def)
//
//           //load youtubeclip image and source information that explains where this othercase sentence comes from
//     $('#otherCaseSource'+i)
// }

var lessonCases;
lessonCases = $("#cardStructure").find('div.lesson-structure')
lessonCases.on('click', activateCase)
}


function activateCase(){
  //selected will activate the clicked and set animation
  console.log('bringCaseSource Working! ', $(this))
  $(".case-sentence").removeClass('case-active')
  $(".case-sentence").addClass('case-inactive')
  $(this).switchClass('case-inactive','case-active')
  let vidId = $(this).attr("data-vidId")
  console.log('here is the selected cases vidid: ', vidId);
  nestedVideoCall(vidId)
  // nestedPlayer.seekTo(13)
  // nestedPlayer.playVideo()

  //append the source information to 'cardOtherCase'
  // $('#cardOtherCase')

}
//make a nested youtuebPlayer!

function nestedVideoCall(selectedVidId){
 let selectedVideo =  $('.other-case-video[data-vidId="'+selectedVidId+'"]')
 let allVideos = $('.other-case-video')
 allVideos.removeClass('video-active')
 selectedVideo.addClass('video-active')
  // events:
}


export {mainVideoId, initialize, checkPause}
