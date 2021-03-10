export class Note{
    selected:boolean = false;
    noteName:string = null;
    fretNumber:number = null;
    displayNote:string = null;

    constructor(note?:any){
        if(note){
            this.mapNote(note);
        }
    }

    mapNote(note:any){
        let props = Object.keys(this);
        props.forEach(prop => {
            if(note[prop]){
                this[prop] = note[prop];
            }
        })
    }
}