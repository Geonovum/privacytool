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
            }
            , onStepChanging: function (event, currentIndex, newIndex) {
                // if back, then don't validate
                if (newIndex < currentIndex) return true;

                // if not all answers are provided, then disable and give warning
                // for radio' questions:
                var radiosNotAnswered = new Array();
                var textareaNotAnswered = new Array();
                var prevName="";
                // try radio buttons first
                $("#toolform-p-" + currentIndex + " .inputarea input").each(function(){
                    var name = $(this).prop("name");
                    if (prevName!=name) {
                        var answer = $("#toolform-p-" + currentIndex + " .inputarea input[name='"+name+"']:checked").val();
                        if (!answer) {
                            radiosNotAnswered.push(name);
                        }
                        prevName = name;
                    }
                });
                // and then any textarea, if available
                $("#toolform-p-" + currentIndex + " .inputarea textarea").each(function(){
                    var name = $(this).prop("name");
                    if (prevName!=name) {
                        var answer = $("#toolform-p-" + currentIndex + " .inputarea textarea[name='"+name+"']").val();
                        if (!answer) {
                            textareaNotAnswered.push(name);
                        }
                        prevName = name;
                    }
                });           
                
                var errorMsg = "Vul alstublieft de ontbrekende vragen in, gemarkeerd met een rode omlijning."
                var errorTitle = "Nog niet alle vragen zijn beantwoord";
                /* var elemId=$("#toolform-p-" + currentIndex +" fieldset").prop("id");
                // console.log(elemId)
                if (elemId) scrollToElement(elemId); */
                // $(window).scrollTop($("#toolform-p-" + currentIndex +" fieldset")[0].offset().top())
                if (radiosNotAnswered.length > 0) {                    
                    for (a in radiosNotAnswered) {
                        $("#toolform-p-" + currentIndex + " .inputarea input[name='"+radiosNotAnswered[a]+"']").parent().addClass("invalidanswer")
                    }
                    // $(window).scrollTop($("#toolform-p-" + currentIndex +" fieldset").offset().top())
                    showMessage(errorTitle, errorMsg);
                    return false;
                } else if (textareaNotAnswered.length > 0) {
                    for (a in textareaNotAnswered) {
                        $("#toolform-p-" + currentIndex + " .inputarea textarea[name='"+textareaNotAnswered[a]+"']").addClass("invalidanswer")
                    }
                    showMessage(errorTitle, errorMsg);
                    return false;
                } else {                    
                    return true; 
                }
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

        $('#upload').on('click', function() {
            var file_data = $('#jsonstring').prop('files')[0];   
            var form_data = new FormData();                  
            form_data.append('file', file_data);
            $.ajax({
                    url: 'upload.php',
                    dataType: 'json', 
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,                         
                    type: 'post',
                    success: function(response){
                        processAnswers(response);
                    }
            });
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
    // check
    $("#"+answerId).parent().removeClass("invalidanswer");
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
    if (answerText.length > 0 ) {
        $("#"+answerId).removeClass("invalidanswer");
    }
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
    var parts=[{topic: "verwantschap", score:0, max: 7.5, graphlabel:"A"}, {topic: "aardgegevens", score:0, max: 17, graphlabel:"B"},{topic: "gevolgen", score:0, max: 7, graphlabel:"C"},{topic: "verkrijgen", score:0, max: 9.5, graphlabel:"D"},{topic: "waarborgen", score:0, max: 17, graphlabel:"E"}]    
    var html="<h5>TESTEN</h5>";
    graphshtml=""
    $("#tussenresultaat").html("")
    for (k in parts) {
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

        // value in the score table/ description
        $("#score_"+scoreObj.topic + "> div.scorevalue").html(Math.round(scoreObj.percentage)+"%");
        // which one to show / hide: 
        $("#score_"+scoreObj.topic + " > .scoreexplanation").hide()
        $("#score_"+scoreObj.topic + " > .scoreexplanation." + morethan50).show();
        graphshtml += "<label for='"+scoreObj.topic+"_graphscore' >"+scoreObj.graphlabel+ " (" + Math.round(scoreObj.percentage)+ "%)</label><div class='scorebar "+morethan50+"' id='"+scoreObj.topic+"_graphscore' style='height:"+scoreObj.percentage+"%'>&nbsp;</div>"
    }
    // $("#tussenresultaat").html(html);
    $("#graphs").html(graphshtml);
}


function writeScores() {
    var scoresState = new Array();
    $("input:radio:checked").each(function() {
        scoresState.push({"type":"radio","id":$(this).attr("name"), "value":$(this).val()}); // value? or name?
    });  
    // also: intake questions
    $("#intakevragen textarea").each(function() {
        scoresState.push({"type":"textarea", "id":$(this).attr("name"), "value":$(this).val()}); // value? or name?
    });
    // TODO: write to file
    var jsonAnswers = {"answers": scoresState}
    // if (console) console.log(JSON.stringify(jsonAnswers))
    // $.post("privacytoolanswers.php", JSON.stringify(jsonAnswers)); // url, data
    // jquery file download 
    $.fileDownload("privacytoolanswers.php", {
        // preparingMessageHtml: "We are preparing your report, please wait...",
        // failMessageHtml: "There was a problem generating your report, please try again.",
        httpMethod: "POST",
        data: {"jsonstring":JSON.stringify(jsonAnswers)}
    });
}



function processAnswers (data) {
    for (k in data) {
        var answerlist = data[k]
        // find the element
        for (a in answerlist) {
            var answer = answerlist[a]
            if (answer["type"]=="radio") {
                // okay, find the element with the apropriate value . We need to go into the answer id div to find the corresponding input                
                $("#"+answer["id"] +" div.inputarea input[value='"+answer["value"]+"']").prop("checked", true).parent().removeClass("invalidanswer");
            }
            else if (answer["type"]=="textarea") {
                // okay, find the element with the apropriate value . We need to go into the answer id div to find the corresponding input
                var textareaId=answer["id"] +"-text"
                $("#"+textareaId).val(answer["value"]);
                updateIntake(textareaId, answer["value"]);
            }
        }
    }
    // show all answers of the voorvragen questions
    $("#voorvragen>div").each(function(){
            $(this).show();
            // also: show the selected answer?
        });
    $('#voorvragen').show()
    // calculatescores
    calculateScores();
    $('#uploadarea').toggle();
}

function showMessage(alertTitle, alertMessage) {
    $("#alertTitle").html(alertTitle)
    $("#alertMessage").html(alertMessage)
    $("#alert").show();
}

function toggleBegrippenlijst() {
    var html = $("#begrippenlijst").html();
    $("#begrippenlijstcopycontent").html(html);
    $("#begrippenlijstcopy").show();
}