let loadedScript=[];
let loadedLesson=[];

const gettingScript=function(location){
  return new Promise(function(resolve, reject){
    $.ajax({
        type: "GET",
        url: location,
        crossDomain: true,
        datatype: "json",
        success: function(script){
          loadedScript=script.caption
          loadedLesson=script.lesson_content
          console.log('json get successful')
        }
      })
    })
}
export{gettingScript, loadedScript, loadedLesson}
