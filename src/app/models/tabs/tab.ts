import { InstrumentString } from "./instrumentString";

export class Tab{
    tabName:string = null;
    strings:InstrumentString[] = [];

    constructor(){
        
    }
    /**
     * init a basic guitar tab with optional number of notes
     * @param noteCount optional number of notes to init
     */
    initGuitarTab(noteCount?:number){
        noteCount = noteCount ? noteCount : 20;
        let guitarStrings = ['E','A','D','G','B','e'];
        this.tabName = 'My Guitar Tab';
        this.strings = guitarStrings.map(stringName => {
            let string = new InstrumentString(stringName);
            string.initEmptyNotes(noteCount);
            return string;
        });
    }

    initBassTab(){
        
    }

    insertNotes(index:number){
        this.strings.forEach(instrumentString => {
            instrumentString.insertNote(index);
        });
    }

    addNotes(numNotes?:number){
        numNotes = numNotes ? numNotes : 1;
        this.strings.forEach(instrumentString => {
            instrumentString.addNote(numNotes);
        });
    }

    removeNotes(index:number){
        this.strings.forEach(instrumentString => {
            instrumentString.removeNote(index);
        });
    }
}