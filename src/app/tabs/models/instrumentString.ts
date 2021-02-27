import { Note } from "./note";
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

    addNote(numNotes?:number){
        numNotes = numNotes ? numNotes : 1;
        for(let i = 0;i < numNotes;i++){
            this.notes.push(new Note());
        }
    }

    removeNote(index:number){
        this.notes.splice(index,1);
    }

    insertNote(index:number){
        if(index === this.notes.length - 1){
            this.addNote();
        }
        else{
            this.notes.splice(index,0,new Note());
        }
    }
}