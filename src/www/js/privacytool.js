/*

Copyright (c) 2015-2017 Thijs Brentjens, thijs@brentjensgeoict.nl, for Geonovum, the Netherlands.
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
                // stub
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
                if (radiosNotAnswered.length > 0) {
                    for (a in radiosNotAnswered) {
                        $("#toolform-p-" + currentIndex + " .inputarea input[name='"+radiosNotAnswered[a]+"']").parent().addClass("invalidanswer")
                    }
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
        // bind the form and provide a simple callback function
          $('#uploadForm').ajaxForm(function(response) {
              processAnswers(response);
          });

          // a function to create an extra element that keeps (invisible unless printing) a copy of the answer in a div
          function copyRadioAnswerReport(elem){
            // the label?
            var answerText = $("label[for='"+$(elem).attr('id')+"']").text();
            // create an element that saves the answer as a span
            // append the element with an extra ID?
            var copyId = $(elem).attr('name')+"_copy";
            if ($("#"+ copyId).length == 0) {
                // first create the element if it does not exist yet
                var parentElem = $(elem).parents(".checkboxIntro").append("<span class='copyAnswer' id='"+copyId+"'></span>");
            }
            $("#"+copyId).html(answerText);
          }

          $("#voorvragen .radioQuestion input[type=radio]").change(function() {
              copyRadioAnswerReport(this);
          });

          $(".radioQuestion.score input[type=radio]").change(function() {
              copyRadioAnswerReport(this);
          });

    })


// some GUI functions
function toggleExtraInfo(elem) {
    $(elem).siblings(".extrainfo").toggle();
}

function toggleIntake() {
    $("#intakecopy").toggle();
}

function toggleUserNotes(elem) {
    $(elem).siblings(".usernote").toggle();
}

function scrollToElement(elementId, topMargin) {
    if (!topMargin) topMargin = 0;
    $(window).scrollTop($("#" + elementId).offset().top - topMargin)
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

function startVoorvragen(){
    $('#voorvragen').show();
    return true;
}

function preDownload() {
    $('#downloadarea').toggle();
}

// processing of answers in the form
// check for conditional questions on a Radio question
function checkRadioQuestion(answerId, radioName, radioValue) {
    $(".explanation."+radioName).hide();
    $(".explanation."+radioName + "." + radioValue).show();
    // now check if there is a conditional question to show
    // hide explanation for non-answers
    try {
        if (conditionalGoto[radioName][radioValue]) {
            $(conditionalGoto[radioName][radioValue]).show();
        }
    } catch (e) {
        if (console) console.log(e)
    }
    $("#"+answerId).parent().removeClass("invalidanswer");
    calculateScores()
}

// Intake questions have copies of the answers that is shown via the button ("Intake antwoorden")
function updateIntake (answerId, answerText) {
    // Update a list with the intake information, as a copy under the Intake vragen answers
    var suffix="_copy";
    var copyId = answerId+suffix;
    if ($("#"+ copyId).length == 0) {
        // first create the element if it does not exist yet
        $("#intakecopy").append("<div id='"+copyId+"'></div>");
    }
    var label = $("label[for='"+answerId+"']").html();
    $("#"+ copyId).html("<label>"+label+"</label><textarea disabled='disabled'>"+answerText+"</textarea>");
    if (answerText.length > 0 ) {
        $("#"+answerId).removeClass("invalidanswer");
    }
    // also: create a copy of the element in the container div

    // a function to create an extra element that keeps (invisible unless printing) a copy of the answer in a div for the report and printing
    // create an element that saves the answer as a span
    var copyId2 = answerId +"_copyreport";
    if ($("#"+ copyId2).length == 0) {
        // first create the element if it does not exist yet
        $("#"+answerId).parents(".checkboxIntro").append("<div class='copyAnswer' id='"+copyId2+"'></div>");
        // alert(copyId2)
    }
    $("#"+copyId2).html(answerText);
}


// Usernotes have copies of the values in a div, instead of a textarea, because printing is hard otherwise.
// for the
function updateUserNotes(elemId, noteValue) {
  // make a copy of the text to a div, which prints nicer in browsers
  var newVal ="";
  if (noteValue.length > 0) {
    newVal = "<h6>Overweging:</h6><p>"+noteValue+"</p>";
  }
  $("#"+elemId).siblings(".usernotePrint").html(newVal);
}

// when user input is finished, calculate alle scores
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
    $("#graphs").html(graphshtml);
    if (console) console.log("Scores updated")
}





// functions for reading/writing answers to a file
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
    $(".usernote textarea").each(function() {
        scoresState.push({"type":"textarea", "id":$(this).attr("name"), "value":$(this).val()}); // value? or name?
    });
    var jsonAnswers = {"answers": scoresState}

    // downloading in JSON format is disabled
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
        // make sure to escape some chars like double quotes
        // escape double quotes
        var answerValue = scoresState[k]["value"]
        answerValue = answerValue.replace(/"/g, '""');
        csvString+='"'+scoresState[k]["id"]+'","' +scoresState[k]["type"]+'","' + answerValue + lineEnd
    }
    // Just dump the data to afile, using a PHP script
    $.fileDownload("privacytoolanswerscsv.php", {
        httpMethod: "POST",
        data: {"csv":encodeURIComponent(csvString)}
    });
}


// if a file is uploaded with answers, try to set all values from that file in the appropriate form fields
// the answers are in a CSV format: {id},{type of form element},{value}
// there has been a JSON formatted file as well for a while, so keep this code for backwards compatibility
function processAnswers (data) {
    var success = false;
    var rowNum = 0;
    try {
        // first: replace the \n character again
        // data = data.replace(/"\n/g, '\n');
        var answerlist = data.split('"\r\n'); // TODO: how to split this one if it is " and then a line?"
        if (data.indexOf('"\r\n')==-1 && data.indexOf('"\n')>0) {
            answerlist = data.split('"\n');
        }
        var processed = 0;
        for (a in answerlist) {
            rowNum+=1
            var answer = answerlist[a].split('","')
            var answerId = answer[0].split('"')[1]
            var answerType = answer[1]
            // var answerValue= decodeURIComponent(answer[2]) // and remove the last char, a "
            var answerValue = answer[2];
            answerValue = answerValue.replace(/""/g, '"');
            // answerValue = answerValue.replace(/"\n/g, '\n');
            answerValue = answerValue.substring(0, answerValue.length);
            if (answerType=="radio") {
                // find the element with the apropriate value . We need to go into the answer id div to find the corresponding input
                $("#"+ answerId +" div.inputarea input[value='"+answerValue+"']").prop("checked", true).parent().removeClass("invalidanswer");
                if (answerValue.length > 0) {
                    success = true;
                    processed+=1;
                }

                var radioElem = $("#"+ answerId +" div.inputarea input[value='"+answerValue+"']");
                var answerText = $("label[for='"+$(radioElem).attr('id')+"']").text();
                // create an element that saves the answer as a span
                // append the element with an extra ID?
                var copyId = $(radioElem).attr('name')+"_copy";
                if ($("#"+ copyId).length == 0) {
                    // first create the element if it does not exist yet
                    var parentElem = $(radioElem).parents(".checkboxIntro").append("<span class='copyAnswer' id='"+copyId+"'></span>");
                }
                $("#"+copyId).html(answerText);


            }
            else if (answerType=="textarea") {
                // find the element with the apropriate value . We need to go into the answer id div to find the corresponding input
                var textareaId= answerId +"-text";
                $("#"+textareaId).val(answerValue);
                if (textareaId.indexOf("intakevragen")>=0) {
                  updateIntake(textareaId, answerValue);
                }
                if (textareaId.indexOf("-notes")>=0) {
                  // var elem = $("#"+textareaId);
                  updateUserNotes(textareaId, answerValue);
                }
                if (answerValue.length > 0) {
                    success = true;
                    processed+=1;
                }
            }
        }
    } catch (e) {
        if (console) console.log("Rownum: " + rowNum + "\n" + e)
    }

    // for backwards compatibility: read from a JSON file, instead of CSV
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
                    if (textareaId.indexOf("intakevragen")>=0) {
                      updateIntake(textareaId, answer["value"]);
                    }
                }
            }
        }
    }
    // show all answers of the voorvragen questions
    $("#voorvragen>div").each(function(){
            $(this).show();
    });
    startVoorvragen()
    $('#voorvragen').show();
    scrollToElement('voorvragen');

    calculateScores();
    if (processed == 0) {
        alert("Het verwerken van de antwoorden is helaas niet gelukt. Staan er wel antwoorden in of is het bestand misschien tussentijds gewijzigd? Neem contact op met de beheerder als er een andere fout optreedt.")
    } else {
        $('#uploadarea').toggle();
    }
}


// show and hide the appropriate elements for creating a report
function prepareForReport () {
      // to copy to an HTML document
      $(".extrainfo").hide();
      $(".usernote textarea").hide();
      $(".inputarea textarea").hide();
      $("a.btn, button").hide();

      $("#voorvragen .radioQuestion input").hide();
      $("#voorvragen .radioQuestion label").hide();
      $(".radioQuestion.score input").hide();
      $(".radioQuestion.score label").hide();

      $(".usernote").show();
      $(".usernotePrint").show();
      $(".copyAnswer").show();

}

// inverse: hide
// TODO: find out what to do with currently hidden/shown elements. But this is in fact not very important
function undoPrepareForReport() {
  // $(".extrainfo").show(); // don't show this by default
  $(".usernote").hide();
  $(".usernote textarea").show();
  $(".inputarea textarea").show();
  $(".usernotePrint").hide();

  $(".copyAnswer").hide();
  $(".radioQuestion.score input").show();
  $(".radioQuestion.score label").show();

  $("#voorvragen .radioQuestion input").show();
  $("#voorvragen .radioQuestion label").show();

  $("a.btn, button").show();
}

// get the outerhtml
function downloadAsHtml() {
  prepareForReport()
  // and / or use .css() of jquery to get some styling. And remove some elements?
  // and copy this css to the basic html?
  var html = "";
  $(".htmlreport").each(
    function(){
      html+=$(this).html()
    }
  )
  // TODO: include CSS?

  // also:
  // change some of the HTML?
  // TODO: construct the report, using all questions and answers
  // need to simlate printing or copy values
  // include the results
  // create an HTML structure for that, with copies of input values.
  $.fileDownload("downloadhtml.php", {
      httpMethod: "POST",
      data: {"html":encodeURIComponent(html)}
  });
  undoPrepareForReport()
}
