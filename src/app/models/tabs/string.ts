import { Note } from "./note";

export class InstrumentString{
    stringName:string = null;
    selected:boolean = null;
    notes:Note[] = [];

    constructor(stringName:string){
        this.stringName = stringName;
    }
}