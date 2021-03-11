import { InstrumentString } from "./instrumentString";
import { Note } from "./note";
import { TabRequest } from "./tab-request";

export class Tab{
    tabName:string = null;
    strings:InstrumentString[] = [];
    //eventually move data structure to this
    //also eventually page to limit number of measures per page
    measures:Array<InstrumentString[]> = [];
    description:string = 'test description';

    constructor(){
        
    }
    /**
     * init a basic guitar tab with optional number of notes
     * @param noteCount optional number of notes to init
     */
    initGuitarTab(noteCount?:number){
        noteCount = noteCount ? noteCount : 20;
        let guitarStrings = ['e','B','G','D','A','E'];
        this.tabName = 'My Guitar Tab';
        this.strings = guitarStrings.map(stringName => {
            let string = new InstrumentString(stringName);
            string.initEmptyNotes(noteCount);
            return string;
        });
    }

    initBassTab(){
       
    }
    /**
     * insert a note at a index
     * @param index index to insert at
     */
    insertNotes(index:number){
        this.strings.forEach(instrumentString => {
            instrumentString.insertNote(index);
        });
    }

    initMeasures(noteWidth:number,forceBuild?:boolean){
        const maxMeasureWidth = window.innerWidth * .9;
        let currentNoteWidth = noteWidth * this.strings[0].notes.length;
        let numMeasures = Math.ceil(currentNoteWidth / maxMeasureWidth);
        let currentMeasures = this.measures.length;
        if(currentMeasures < numMeasures || forceBuild){
            let maxNoteLength = Math.floor(maxMeasureWidth / noteWidth);
            //let maxNoteLength = 3;
            //console.log('build measures model'); 
            this.measures = this.buildMeasures(maxNoteLength);
        }
        console.log('measures',this.measures);
    }

    /**
     * add notes to end of string array
     * @param numNotes number of notes to add
     */
    addNotes(numNotes?:number){
        numNotes = numNotes ? numNotes : 1;
        this.strings.forEach(instrumentString => {
            instrumentString.addNote(numNotes);
        });
    }
    /**
     * remove notes at a index
     * @param index index to remove at
     */
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
        //console.log('string map',stringMap);

        for (const [stringName, value] of stringMap.entries()) {
            value.forEach((noteArray,index) => {
                let newString = new InstrumentString(stringName);
                newString.notes = noteArray;
                measures[index].push(newString);
            });
        }
        return measures;
    }

    getTabRequest():TabRequest{
        let request:TabRequest = {
            tabName:this.tabName,
            description:this.description,
            strings:null
        };

        request.strings = this.strings.map(iString => iString.getStringRequest());

        return request;
    }
}