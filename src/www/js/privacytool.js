/*
    config & logic
*/
var conditionalGoto = {};
conditionalGoto["voorvragen-A"] = {"ja": "voorvragen-B"};
conditionalGoto["voorvragen-B"] = {"ja": "voorvragen-C"};
conditionalGoto["voorvragen-C"] = {"ja": "voorvragen-D"};
conditionalGoto["voorvragen-D"] = {"nee": "voorvragen-E"};
conditionalGoto["voorvragen-E"] = {"nee": "voorvragen-F"};
conditionalGoto["voorvragen-F"] = {"nee": "voorvragen-G"};
conditionalGoto["voorvragen-G"] = {"nee": "voorvragen-H"};
conditionalGoto["voorvragen-H"] = {"ja": "intake"};

/*
    Functions
*/
$(document).ready(function() {
        $("#toolform").steps({
            headerTag: "h3"
            , bodyTag: "section"
            // , transitionEffect: "slideLeft",
            // , stepsOrientation: "vertical"
        });
    }
)


function checkRadioQuestion(answerId, radioName, radioValue) {
    console.log(answerId)
    console.log(radioName)
    console.log(radioValue)
    $(".explanation."+radioName).hide();
    $(".explanation."+radioName + "." + radioValue).show();
    // now check if there is a conditional question to show

    // hide explanation for non-answers
    // show explanation
    // showExplanation(answerId)
    try {
        if (conditionalGoto[radioName][radioValue]) {
            // console.log(conditionalGoto[radioName][radioValue])
            $("#"+conditionalGoto[radioName][radioValue]).show();
        }
    } catch (e) {
        if (console) console.log(e)
    }
    
}


function toggleExtraInfo(elem) {
    $(elem).siblings(".extrainfo").toggle();
}
