import { ObjectId } from 'mongodb';

export enum Visibility {
    private = 0,
    correspondent = 1,
    circle = 2,
    public = 3
}

export class Publication {
    publisher: ObjectId;
    title: String;
    //topic: String;
    content: String[];
    visibility: Visibility = Visibility.private;
    comments: ObjectId[] = [];

    public constructor(_title: String, _content: String[], _publisher: ObjectId){
        this.publisher = _publisher;
        this.content = _content;
        this.title = _title;
    }
}