import sys, os, glob, fileinput, csv

filename =""
if len(sys.argv) != 2:
    print "No file selected!"
else:
    filename = sys.argv[1]
    html = """
                                                <div id='onverenigbaarheid-%s' class="radioQuestion score">
                                                    <div class="checkboxIntro">%s. %s                                   
                                                        <div class="inputarea">  
                                                            <input id="onverenigbaarheid-%s-nee" name="onverenigbaarheid-%s" type="radio" value="%s" onchange="checkRadioQuestion(this.id, this.name, this.value)"/><label for="onverenigbaarheid-%s-nee">nee</label> 

                                                            <input id="onverenigbaarheid-%s-ja" name="onverenigbaarheid-%s" type="radio" value="%s" onchange="checkRadioQuestion(this.id, this.name, this.value)"/><label for="onverenigbaarheid-%s-ja">ja</label>
                                                        </div>                                                       
                                                    </div>
                                                    <button onclick="toggleExtraInfo(this)">Toelichting op vraag &raquo;</button>
                                                    <div class="extrainfo">%s</div>
                                                </div>
"""

    csvfile = open(filename, "r")
    csvValues = list(csv.reader(csvfile))
    # print csvValues
    for row in csvValues:
        nr = str(row[1])
        label = row[2]
        extraInfo = row[3]
        # nee = row[4]
        # ja = row[5]
        correctie = row[7]
        if len(correctie) == 0:
            correctie = 0
        else:
            correctie = int(correctie)
        # DON'T USE CORRECTIE
        #correctie = 1?
        factor = row[10]
        neeValue="0"
        jaValue="0"
        # Anders implementeren: als correctie==-1, dan scores op nee
        #if len(nee) > 0:
        if correctie > 0:
            jaValue = str(factor)
            neeValue = "0"
        else:
            jaValue = "0"
            neeValue = str(factor)            
        # #if len(ja) > 0:
        #     if correctie < 0:
        #         neeValue = str(int(ja) * factor)
        #         jaValue = "0"
        #     else:
        #         jaValue = str(int(ja) * factor)
        #         neeValue = "0"
        # now put the values in.
        if nr:
            htmlgen = html % (nr, nr, label, nr, nr, neeValue, nr, nr, nr, jaValue, nr, extraInfo)
            print htmlgen