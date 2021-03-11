import { Note } from "./note";
import { StringRequest } from "./tab-request";
/**
 * @InstrumentString model to represent a single string
 */
export class InstrumentString{
    stringName:string = null;
    selected:boolean = null;
    notes:Note[] = [];

    constructor(stringName:string){
        this.stringName = stringName;
    }
    /**
     * empty notes array and create new notes
     * @param noteNum number of notes to init
     */
    initEmptyNotes(noteNum:number){
        this.notes = [];
        for(let i = 0;i < noteNum;i++){
            let note = new Note();
            this.notes.push(note);
        }
    }

    addNote(numNotes?:number,note?:Note){
        note = note ? note : new Note();
        numNotes = numNotes ? numNotes : 1;
        for(let i = 0;i < numNotes;i++){
            this.notes.push(note);
        }
    }

    removeNote(index:number){
        this.notes.splice(index,1);
    }

    insertNote(index:number,note?:Note){
        note = note ? note : new Note();
        if(index === this.notes.length - 1){
            this.addNote(null,note);
        }
        else{
            this.notes.splice(index,0,note);
        }
    }

    stringifyNotes():string{
        let noteString = '';
        let emptyNoteCount = 0;
        this.notes.forEach((note,index) => {
            if(!note.fretNumber && note.fretNumber !== 0){
                if(emptyNoteCount === 0){
                    noteString += '{{';
                }
                emptyNoteCount++;
            }
            else{
                if(emptyNoteCount !== 0){
                    noteString += `${emptyNoteCount}}}`;
                }
                noteString += note.fretNumber;
                emptyNoteCount = 0;
            }

            if(index === this.notes.length - 1 && emptyNoteCount > 0){
                noteString += `${emptyNoteCount}}}`;
            }
        });

        return noteString;
    }

    getStringRequest():StringRequest{
        let request:StringRequest = {
            stringName:this.stringName,
            notes:null
        };
        request.notes = this.stringifyNotes();

        return request;
    }
}