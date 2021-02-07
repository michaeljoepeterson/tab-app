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
}