var buttons = [0,0,0,0]
var currentBackground = ""
var currentFace = ""

class Dialogue {    
    dialogues = []
    constructor(data) {
        this.parse(data)
        this.converse(0)
    }
    parse(text) {
        var lines = text.match(/^.*((\r\n|\n|\r)|$)/gm);
        
        for (let line in lines){
            let dialogue_line =  lines[line];
            let dialogue = {};

            dialogue.id = parseInt(line)
            if (dialogue_line.indexOf('@') == 0) {
                dialogue_line = dialogue_line.substr(1)
                let top = dialogue_line.indexOf('@')
                dialogue.background = dialogue_line.substr(0, top)
                dialogue_line = dialogue_line.substr(top+1)
            }
            if (dialogue_line.indexOf('$') == 0) {
                dialogue_line = dialogue_line.substr(1)
                let top = dialogue_line.indexOf('$')
                dialogue.face = dialogue_line.substr(0, top)
                dialogue_line = dialogue_line.substr(top+1)
            }
            if (dialogue_line.indexOf('->') !== -1) {
                let split = dialogue_line.split('->')
                dialogue_line = split[0]
                dialogue.next = parseInt(split[1])
            }
            else if (dialogue_line.indexOf('[') !== -1) {
                var choices = dialogue_line.substr(dialogue_line.indexOf("["));
                dialogue.responses = JSON.parse(choices);
                dialogue_line = dialogue_line.split("[")[0];
            }
            dialogue.text = dialogue_line.trim()
            this.dialogues.push(dialogue)
        }
    }
    converse(num) {
        let dialogue = this.dialogues[num]
        // The thing they said
        console.log(num + ": " + dialogue.text)   
        document.getElementById('them').textContent = dialogue.text
        if (dialogue.background !== currentBackground && dialogue.background !== undefined) updateBackground(dialogue.background)
        if (dialogue.face !== currentFace && dialogue.background !== undefined) updateFace(dialogue.face)

        if (dialogue.responses != undefined) {
            for (let response in dialogue.responses) {
                document.getElementById(response).textContent = this.dialogues[dialogue.responses[response]].text
                buttons[response] = this.dialogues[dialogue.responses[response]].next
            buttonsDisplayed(dialogue.responses.length)
        }
        }
        else {
            buttonsDisplayed(1)
            for (let i = 0; i < 4; i++) {
                document.getElementById(i).textContent = "Continue"
                buttons[i] = dialogue.next
            }
        }
    }
}

var Callum;
document.getElementsByTagName('button')[0].onclick = () => click(0)
document.getElementsByTagName('button')[1].onclick = () => click(1)
document.getElementsByTagName('button')[2].onclick = () => click(2)
document.getElementsByTagName('button')[3].onclick = () => click(3)
document.getElementById('scene').hidden = true

document.getElementById('startButton').onclick = startGame
function startGame() {
    const instructions = fetch('gnu.txt')
    .then(response => response.text())
    .then(data => {
        Callum = new Dialogue(data)
    })
    document.getElementById('scene').hidden = false
    document.getElementById('startMenu').hidden = true
}


function click(num) {
    Callum.converse(buttons[num])
}
function buttonsDisplayed(amount) {
    for (let i = 3; i > amount-1; i--) {
        document.getElementById(i).hidden = true
    }
    for (let i = 0; i <= amount-1; i++) {
        document.getElementById(i).hidden = false
    }
}
function updateBackground(background) {
    currentBackground = "url(" + background + ")"
    document.getElementById('body').style.backgroundImage = "url(" + background + ")"
}
function updateFace(face) {
    currentFace = face
    document.getElementById('reaction').src = face
}
