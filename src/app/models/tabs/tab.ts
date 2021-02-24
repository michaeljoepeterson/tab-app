import { InstrumentString } from "./instrumentString";
import { Note } from "./note";

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
    /**
     * helper to build empty measures
     * @param numMeasures number of measures
     */
    buildEmptyMeasures(numMeasures:number):Array<InstrumentString[]>{
        let measures = [];

        for(let i = 0;i < numMeasures;i++){
            measures.push([]);
        }

        return measures;
    }
    /**
     * convert tab into measures based off max note length
     * @param maxNoteLength max note length
     */
    buildMeasures(maxNoteLength:number):Array<InstrumentString[]>{
        let stringMap:Map<string,Array<Note[]>> = new Map();

        this.strings.forEach((string) => {
            if(!stringMap.has(string.stringName)){
                stringMap.set(string.stringName,[]);
            }
            let stringMapArray = stringMap.get(string.stringName);
            let noteArray = [];
            string.notes.forEach(note => {
                if(noteArray.length >= maxNoteLength){
                    stringMapArray.push(noteArray);
                    noteArray = [];
                }
                noteArray.push(note);
            });
            //push last note array
            stringMapArray.push(noteArray);
            stringMap.set(string.stringName,stringMapArray);
        });
        let keys = stringMap.keys();
        let firstKey = keys.next().value;
        let numMeasures = stringMap.get(firstKey).length;
        let measures = this.buildEmptyMeasures(numMeasures);
        console.log(stringMap);

        for (const [stringName, value] of stringMap.entries()) {
            value.forEach((noteArray,index) => {
                let newString = new InstrumentString(stringName);
                newString.notes = noteArray;
                measures[index].push(newString);
            });
        }
        console.log(measures);
        return measures;
    }
}