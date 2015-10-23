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

        // FIXES for firefox printing
        // TODO: also for textareas?
        $(window).bind('beforeprint', function(){
            $('fieldset').each(
                function(item)
                {
                    $(this).replaceWith($('<div class="fieldset">' + this.innerHTML + '</div>'));
                }
            )
        });
        $(window).bind('afterprint', function(){
            $('.fieldset').each(
                function(item)
                {
                    $(this).replaceWith($('<fieldset>' + this.innerHTML + '</fieldset>'));
                }
            )
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
    // calculate scores
    calculateScores()
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

function calculateScores() {
    // get all values
    var parts=[{topic: "verwantschap", score:0, max: 7.5}, {topic: "aardgegevens", score:0, max: 16},{topic: "gevolgen", score:0, max: 7},{topic: "verkrijgen", score:0, max: 9.5},{topic: "waarborgen", score:0, max: 17}]    
    // for 
    html="<h5>TESTEN</h5>";
    graphshtml=""
    $("#tussenresultaat").html("")
    for (k in parts) {
        // console.log(k)
        var scoreObj = parts[k]
        var score = 0;
        $("#" + scoreObj.topic+ " input:radio:checked").each(function() {
            var value = parseFloat($(this).val());
            score+=value;
        });    
        scoreObj.score = score;
        scoreObj.percentage = score * 100 / scoreObj.max;
        html+="<p>"+scoreObj.topic+": " +score+ " (" + Math.round(scoreObj.percentage)+ "%)</p>";
        var morethan50 = "morethan50_" + Math.round(scoreObj.percentage/100);
        graphshtml += "<label for='"+scoreObj.topic+"_graphscore' >"+scoreObj.topic+ " (" + Math.round(scoreObj.percentage)+ "%)</label><div class='scorebar "+morethan50+"' id='"+scoreObj.topic+"_graphscore' style='width:"+scoreObj.percentage+"%'>&nbsp;</div>"
        if (console) {
            console.log(scoreObj.topic)
            console.log(score)
        }
    }
    $("#tussenresultaat").html(html);
    $("#scores").html(html);

    $("#graphs").html(graphshtml);
}