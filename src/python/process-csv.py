import sys, os, glob, fileinput, csv

filename =""
if len(sys.argv) != 2:
    print "No file selected!"
else:
    filename = sys.argv[1]
    html = """<div id='verwantschap-%s' class="radioQuestion">
                                                    <div class="checkboxIntro">%s. %s                                   
                                                        <div class="inputarea">  
                                                            <input id="verwantschap-%s-nee" name="verwantschap-%s" type="radio" value="%s" onchange="checkRadioQuestion(this.id, this.name, this.value)"/><label for="verwantschap-%s-nee">nee</label> 

                                                            <input id="verwantschap-%s-ja" name="verwantschap-%s" type="radio" value="%s" onchange="checkRadioQuestion(this.id, this.name, this.value)"/><label for="verwantschap-%s-ja">ja</label>

                                                            <input id="verwantschap-%s-nvt" name="verwantschap-%s" type="radio" value="0" onchange="checkRadioQuestion(this.id, this.name, this.value)"/><label for="verwantschap-%s-nvt">n.v.t.</label>
                                                        </div>                                                       
                                                    </div>
                                                    <button onclick="toggleExtraInfo(this)">Info &raquo;</button>
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
        nee = row[4]
        ja = row[5]
        correctie = row[7]
        factor = row[10]
        neeValue="0"
        jaValue="0"
        if len(nee) > 0:
            if len(correctie) > 0:
                jaValue = str(int(nee) * factor)
            else:
                neeValue = str(int(nee) * factor)
        if len(ja) > 0:
            if len(correctie) > 0:
                neeValue = str(int(ja) * factor)
            else:
                jaValue = str(int(ja) * factor)
        # now put the values in.
        if nr:
            htmlgen = html % (nr, nr, label, nr, nr, neeValue, nr, nr, nr, jaValue, nr, nr, nr, nr,extraInfo)
            print htmlgen