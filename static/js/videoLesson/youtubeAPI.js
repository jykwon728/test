import {mainVideoId, initialize, checkPause} from '../VideoLearnMain.js'

let mainPlayer={};
let nestedPlayers=[];

function onYouTubeIframeAPIReady(loadedLesson){
  console.log('this is lodeaded lesson length: ', loadedLesson ,loadedLesson.length);



    mainPlayer = new YT.Player('mainVideoPlaceholder', {
      width: 800,
      height: 500,
      videoId: mainVideoId,
      playerVars: {
          autoplay: 0,
          color: 'white',
          controls:0,
          rel:0,
          iv_load_policy: 3
      },
      events: {
          onReady: initialize,
          onStateChange: checkPause
      }
    })

    for(var i=0;i<loadedLesson.length;i++){
      const lessonOtherCase = loadedLesson[i].UsageCase.other_case
      console.log('forloop for loadedlesson is working!', lessonOtherCase);
      $('#nestedVideoGroup').append('<div id="videoLessonGroup'+i+'"></div>')

      for(var x=0;x<lessonOtherCase.length;x++){
        let vidId = lessonOtherCase[x].source.vid_id
        console.log('forloop for lessonOtherCase is working!', vidId);
        $('#videoLessonGroup'+i).append('<div id="nested-video-placeholder'+i+x+'" data-vidId='+vidId+' class="other-case-video video-inactive" ></div>')

         let video  = new YT.Player('nested-video-placeholder'+i+x, {
          width: 800,
          height: 500,
          videoId: vidId,
          playerVars: {
              autoplay: 0,
              color: 'white',
              controls:0,
              rel:0,
              iv_load_policy: 3
          }

            })
            nestedPlayers.push(video)


      }




      }
}

export {onYouTubeIframeAPIReady, mainPlayer, nestedPlayers}
