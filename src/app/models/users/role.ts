export class Role{
    id:string = null;
    level:number = null;
    name:string = null;

    constructor(data?:any){
        if(data){
            this.mapData(data,this);
        }
    }

    mapData(data:any,self:any){
        let props = Object.getOwnPropertyNames(self);
        props.forEach(prop => {
            if(data[prop] && !self[prop]){
                self[prop] = data[prop];
            }
        })
    }
}