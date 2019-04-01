import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { SelectedPageService } from "~/shared/selected-page-service";

export class NoteViewViewModel extends Observable {

    private uuid: string;
    public comments: Array<Object>;
    public attachments: Array<any>;
    public description: string;
    public title: string;
    public author: string;
    public time: string;
    public property: string;
    public tenant: string;
    public editable: boolean;
    public tags: Array<string>;

    constructor() {
        super();
        this.uuid = '';
        this.editable = false;
        this.comments = new Array<Object>();
        this.description = '[description]';
        this.title = '[title]';
        this.author = '[author]';
        this.time = '[time]';
        this.property = '[property]';
        this.tenant = '[tenant]';
        this.attachments = new Array<any>();
        this.tags = new Array<string>();
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
