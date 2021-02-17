import { Role } from "./role";

export class User{
    email:string = null;
    id:string = null;
    role:Role = null;
    username:string = null;

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

    getJson(){
        return {
            email:this.email,
            id:this.id,
            role:this.role,
            username:this.username
        }
    }
}