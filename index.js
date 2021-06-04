function writeData(dataObj) {
    let existingNotes = getData();
    existingNotes = existingNotes == null || existingNotes.length == 0 ? [] : existingNotes;
    existingNotes.push(dataObj);
    localStorage.setItem('notes', JSON.stringify(existingNotes));
}

function toggleElementVisibility(elem, state) {
    if (state == "hide") {
        elem.className += " hide";
    } else if (state == "show") {
        elem.className = elem.className.replace("hide", "").trim();
    }

}

const deleteNote = (dataObjId, elem) => {
    const existingNotes = getData();
    const newSet = existingNotes.filter(note => note.id != dataObjId);
    localStorage.setItem('notes', JSON.stringify(newSet));
    elem.remove();
}

const updateNote = (noteObj, elem) => { 
    let existingNotes = getData(); 
    existingNotes = existingNotes.filter(note => note.id != noteObj.id);
    noteObj.content = elem.querySelector(".note-input").value;
    elem.querySelector(".note-content").innerText = noteObj.content;
    existingNotes.push(noteObj);
    localStorage.setItem('notes', JSON.stringify(existingNotes));
    enableMode(elem, 'view');
}

const editNote = (noteContent, elem) => {
    const textArea = elem.querySelector(".note-input");
    textArea.value = noteContent;
    enableMode(elem, 'edit');
}

function enableMode(elem, mode) {
    const textArea = elem.querySelector(".note-input");
    const noteContentElem = elem.querySelector(".note-content");
    const saveButton = elem.querySelector(".save");
    const editButton = elem.querySelector(".edit");

    if (mode == 'edit') {
        toggleElementVisibility(textArea, "show");
        toggleElementVisibility(noteContentElem, "hide");
        toggleElementVisibility(saveButton, "show");
        toggleElementVisibility(editButton, "hide");
    } else if (mode == 'view') {
        toggleElementVisibility(textArea, "hide");
        toggleElementVisibility(noteContentElem, "show");
        toggleElementVisibility(saveButton, "hide");
        toggleElementVisibility(editButton, "show");
    }


}

function getData(searchText) {
    const notes =  JSON.parse(localStorage.getItem('notes'));
    const sortedNotes = notes != null ? notes.sort((a,b) => a.timestamp - b.timestamp) : [];
    return sortedNotes;
}

notes = getData();
const inputArea = document.getElementById("input");
inputArea.addEventListener("keyup", event => {
    if (event.keyCode == 13) {
        event.preventDefault();
        createNote(inputArea.value);
        inputArea.value = "";
    }
})

function attachCardFunctions(newNoteCard, note) {
    newNoteCard.querySelector(".delete").addEventListener("click", function(){deleteNote(note.id, newNoteCard)});
    newNoteCard.querySelector(".edit").addEventListener("click", function(){editNote(note.content, newNoteCard)});
    newNoteCard.querySelector(".save").addEventListener("click", function(){updateNote(note, newNoteCard)});
}


const renderNoteCard = (note) => {
    const temp = document.getElementsByTagName("template")[0];
    const item = temp.content.cloneNode(true);
    noteCardTemplate = item.querySelector("div");
    noteCardTemplate.querySelector(".note-content").textContent = note.content;
    const newNoteCard = document.getElementsByClassName("grid-container")[0].appendChild(noteCardTemplate) ;
    attachCardFunctions(newNoteCard, note);
}

notes.forEach(note => renderNoteCard(note));

function createNote(event) {
    const existingNotes = getData();
    let newNoteId = 0;
    if (existingNotes != null && existingNotes.length > 0) {
        lastNote = existingNotes[existingNotes.length - 1]
        newNoteId = lastNote.id + 1;
    }
    const newNote = {
        id : newNoteId,
        timestamp: Date.now(),
        content: event
    }
    writeData(newNote);
    renderNoteCard(newNote);
}