/*

TODO: licensing of code

*/
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
            , saveState: true /* save state in a cookie */
            // , transitionEffect: "slideLeft",
            // , stepsOrientation: "vertical"
            /* labels */
            , labels: {
                cancel: "Annuleren",
                current: "huidige stap:",
                pagination: "Pagina's",
                finish: "Klaar",
                next: "Volgende",
                previous: "Vorige",
                loading: "Aan het laden ..."
            }
            , onStepChanged: function (evt, currentIndex) {
                // focus to the tool
                scrollToElement("detool");
            }
        });
    }
)


function checkRadioQuestion(answerId, radioName, radioValue) {
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
            scrollToElement(conditionalGoto[radioName][radioValue]);
        }
    } catch (e) {
        if (console) console.log(e)
    }
    
}

function updateIntake (answerId, answerText) {
    // Update a list with the intake information, as a copy under the Intake vragen answers
    var suffix="_copy";
    var copyId = answerId+suffix;
    if ($("#"+ copyId).length == 0) {
        // first create the element
        $("#intakecopy").append("<div id='"+copyId+"'></div>");

    }    
    var label = $("label[for='"+answerId+"']").html();
    $("#"+ copyId).html("<label>"+label+"</label><textarea disabled='disabled'>"+answerText+"</textarea>");
}

function toggleExtraInfo(elem) {
    $(elem).siblings(".extrainfo").toggle();
}

function toggleIntake() {
    $("#intakecopy").toggle();
}

function scrollToElement(elementId) {
    $(window).scrollTop($("#" + elementId).offset().top)
}