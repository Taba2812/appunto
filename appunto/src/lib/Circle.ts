import { ObjectId } from 'mongodb';

export class Circle {
    name: string;
    founder: ObjectId;
    members: ObjectId[] = [];
    collection: ObjectId[] = [];

    public constructor(_name:string, _founder: ObjectId){
        this.name = _name;
        this.founder = _founder;
    }
}