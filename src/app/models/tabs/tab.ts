import { InstrumentString } from "./string";

export class Tab{
    TabName:string = null;
    strings:InstrumentString[] = [];

    constructor(){
        
    }

    initGuitarTab(){
        let guitarStrings = ['E','A','D','G','B','e'];
        this.TabName = 'My Guitar Tab';
        this.strings = guitarStrings.map(stringName => {
            return new InstrumentString(stringName);
        });
    }

    initBassTab(){
        
    }
}