import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { SelectedPageService } from "~/shared/selected-page-service";

import { DataStorageService } from "~/shared/data-storage-service";
import { using } from "rxjs";

export class NoteViewViewModel extends Observable {

    private noteData: Map<string,any>;
    public date: string;
    public uuid: string;
    public comments: Array<Object>;
    public attachments: Array<any>;
    public description: string;
    public title: string;
    public author: string;
    public time: Date;
    public property: string;
    public tenant: string;
    public editable: boolean;
    public tags: Array<string>;

    constructor() {
        super();
        this.noteData = DataStorageService.getInstance().getCurrentNote();
        console.log(this.noteData);
        this.uuid = this.noteData['uuid'];
        this.editable = false;
        this.comments = this.noteData['replyList'];
        this.description = (this.noteData['comment'] != null) ? this.noteData['comment'].replace(/<\/?[a-z]+>/gm, '') : '';
        this.title = this.noteData['title'];
        this.author = this.noteData['createdBy'];
        this.time = new Date(this.noteData['createdTimestamp']*1000);
        //this.date = this.time.toISOString().slice(0,10);
        this.date = this.time.toLocaleDateString();
        DataStorageService.getInstance().getProperty(this.noteData['propertyUuid'], function(propertyData: Object) {
            //this.property = propertyData ? propertyData['name'] : 'undefined';
            console.log('aaaaa!');
        });
        this.property = '[property]';
        this.tenant = '[tenant]';
        this.attachments = new Array<any>();
        this.tags = new Array<string>();
        this.comments = [
            {authorId: "778231", text: "[Question]"},
            {authorId: "789123", text: "[Answer]"},
            {authorId: "778231", text: "[Thank]"},
            {authorId: "789123", text: "[Bye]"}
        ];
        this.tags = this.noteData['tags'].split(' ');
        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === 'description') {
                //this.set("tvResult", propertyChangeData.value);
                console.log(propertyChangeData.value);
            }
        });
        SelectedPageService.getInstance().updateSelectedPage("View Note");
    }

    public saveNote(): void {
        console.log('saving note...');
    }
}
