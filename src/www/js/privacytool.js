/*

Copyright (c) 2015 Thijs Brentjens, thijs@brentjensgeoict.nl, for Geonovum, the Netherlands.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of Thijs Brentjens nor the names of
      its contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

*/
/*
    config
*/
var conditionalGoto = {};
conditionalGoto["voorvragen-A"] = {"ja":  "#voorvragen-B"};
conditionalGoto["voorvragen-B"] = {"ja":  "#voorvragen-C"};
conditionalGoto["voorvragen-C"] = {"ja":  "#voorvragen-D"};
conditionalGoto["voorvragen-D"] = {"nee": "#voorvragen-E"};
conditionalGoto["voorvragen-E"] = {"nee": "#voorvragen-F"};
conditionalGoto["voorvragen-F"] = {"nee": "#voorvragen-G"};
conditionalGoto["voorvragen-G"] = {"nee": "#voorvragen-H"};
conditionalGoto["voorvragen-H"] = {"ja":  ".actions"};

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
            , enableFinishButton: false
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
        // For now: excluded
        // $(window).bind('beforeprint', function(){
        //     $('fieldset').each(
        //         function(item)
        //         {
        //             $(this).replaceWith($('<div class="fieldset">' + $(this).html() + '</div>'));
        //         }
        //     )
        // });
        // $(window).bind('afterprint', function(){
        //     $('.fieldset').each(
        //         function(item)
        //         {
        //             $(this).replaceWith($('<fieldset>' + $(this).html() + '</fieldset>'));
        //         }
        //     )
        // });

        // $('#upload').on('click', function() {
        //     // console.log($('#jsonstring'))
        //     // console.log($('#jsonstring').prop('files'))
        //     // console.log($('#jsonstring').prop('files')[0])
        //     var file_data = $('#jsonstring').prop('files')[0];
        //     var form_data = new FormData();
        //     form_data.append('file', file_data);
        //     $.ajax({
        //             url: 'upload.php',
        //             dataType: 'json',
        //             cache: false,
        //             contentType: false,
        //             processData: false,
        //             data: form_data,
        //             type: 'post',
        //             success: function(response){
        //                 processAnswers(response);
        //             }
        //     });
        // });
        // bind 'myForm' and provide a simple callback function
          $('#uploadForm').ajaxForm(function(response) {
              // alert("Upload uitgevoerd");
              processAnswers(response);
          });
    }
)


function startVoorvragen(){
    $('#voorvragen').show();
    // $('.actions').show();
    // $('.actions').each(function() {
    //         $(this).show()
    //     });
    return true;
}

// _prevElement = "";
function checkRadioQuestion(answerId, radioName, radioValue) {
    $(".explanation."+radioName).hide();
    $(".explanation."+radioName + "." + radioValue).show();
    // now check if there is a conditional question to show

    // hide explanation for non-answers
    // show explanation
    // showExplanation(answerId)
    // var topMargin = 0;
    try {
        if (conditionalGoto[radioName][radioValue]) {
            // console.log(conditionalGoto[radioName][radioValue])

            $(conditionalGoto[radioName][radioValue]).show();
            // scroll to the previous element?
            /* if (_prevElement.length > 0) scrollToElement(_prevElement, topMargin);
            _prevElement = conditionalGoto[radioName][radioValue];
            */
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

function scrollToElement(elementId, topMargin) {
    if (!topMargin) topMargin = 0;
    $(window).scrollTop($("#" + elementId).offset().top - topMargin)
}

function calculateScores() {
    // get all values
    var parts=[{topic: "verwantschap", score:0, max: 7.5, graphlabel:"A"},
        {topic: "aardgegevens", score:0, max: 17, graphlabel:"B"},
        {topic: "gevolgen", score:0, max: 7, graphlabel:"C"},
        {topic: "verkrijgen", score:0, max: 6.5, graphlabel:"D"},
        {topic: "waarborgen", score:0, max: 17, graphlabel:"E"}]
    var html="<h5>TESTEN</h5>";
    graphshtml=""
    $("#tussenresultaat").html("")
    for (k in parts) {
        var scoreObj = parts[k]
        var score = 0;
        $("#" + scoreObj.topic+ " input:radio:checked").each(function() {
            var value = parseFloat($(this).val());
            // console.log(value)
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
    if (console) console.log("Scores updated")
}

function preDownload() {
    $('#downloadarea').toggle();
}


function writeScores() {
    // first: display a box with info how to deal with the file, then
    var scoresState = new Array();
    $("input:radio:checked").each(function() {
        scoresState.push({"type":"radio","id":$(this).attr("name"), "value":$(this).val()}); // value? or name?
    });
    // also: intake questions
    $("#intakevragen textarea").each(function() {
        scoresState.push({"type":"textarea", "id":$(this).attr("name"), "value":$(this).val()}); // value? or name?
    });
    var jsonAnswers = {"answers": scoresState}
    // if (console) console.log(JSON.stringify(jsonAnswers))
    // $.post("privacytoolanswers.php", JSON.stringify(jsonAnswers)); // url, data
    // jquery file download
    // $.fileDownload("privacytoolanswers.php", {
    //     // preparingMessageHtml: "We are preparing your report, please wait...",
    //     // failMessageHtml: "There was a problem generating your report, please try again.",
    //     httpMethod: "POST",
    //     data: {"jsonstring":JSON.stringify(jsonAnswers)}
    // });
    var csvString = '';
    var lineEnd = '"\r\n'
    for (k in scoresState) {
        // make sure to escape some chars like quotes?
        // escape double quotes?
        var answerValue = scoresState[k]["value"]
        answerValue = answerValue.replace(/"/g, '""');
        // answerValue = answerValue.replace(/\n/g, '"\n');
        csvString+='"'+scoresState[k]["id"]+'","' +scoresState[k]["type"]+'","' + answerValue + lineEnd
    }
    // TODO: escape
    $.fileDownload("privacytoolanswerscsv.php", {
        // preparingMessageHtml: "We are preparing your report, please wait...",
        // failMessageHtml: "There was a problem generating your report, please try again.",
        httpMethod: "POST",
        data: {"csv":encodeURIComponent(csvString)}
    });
}

function processAnswers (data) {
    // console.log(data)
    var success = false;
    var rowNum = 0;
    try {
        // first: replace the \n character again
        // data = data.replace(/"\n/g, '\n');
        var answerlist = data.split('"\r\n'); // TODO: how to split this one if it is " and then a line?"
        for (a in answerlist) {
            rowNum+=1
            var answer = answerlist[a].split('","')
            var answerId = answer[0].split('"')[1]
            var answerType = answer[1]
            // var answerValue= decodeURIComponent(answer[2]) // and remove the last char, a "
            var answerValue = answer[2];
            answerValue = answerValue.replace(/""/g, '"');
            // answerValue = answerValue.replace(/"\n/g, '\n');
            // replace the quotes again?
            answerValue = answerValue.substring(0, answerValue.length);
            if (answerType=="radio") {
                // okay, find the element with the apropriate value . We need to go into the answer id div to find the corresponding input
                $("#"+ answerId +" div.inputarea input[value='"+answerValue+"']").prop("checked", true).parent().removeClass("invalidanswer");
            }
            else if (answerType=="textarea") {
                // okay, find the element with the apropriate value . We need to go into the answer id div to find the corresponding input
                var textareaId= answerId +"-text"
                $("#"+textareaId).val(answerValue);
                updateIntake(textareaId, answerValue);
            }
        }
    } catch (e) {
        if (console) console.log("Rownum: " + rowNum + "\n" + e)
    }
    if (!success) {
        // if data is json, then this, otherwise
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
    }
    // show all answers of the voorvragen questions
    $("#voorvragen>div").each(function(){
            $(this).show();
            // also: show the selected answer?
        });
    startVoorvragen()
    $('#voorvragen').show();
    scrollToElement('voorvragen');

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
