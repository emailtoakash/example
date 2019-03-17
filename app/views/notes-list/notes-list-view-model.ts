import { Observable } from "tns-core-modules/data/observable";
import { SelectedPageService } from "~/shared/selected-page-service";

export class NotesListViewModel extends Observable {

    public notes: Array<Object>;

    constructor() {
        super();
        this.notes = [];
        const random_note_thingy_count = 40;
        for (let i=0; i<random_note_thingy_count; i++) {
            this.notes.push({
                title: Math.random().toString(36).substring(2, 15),
                author: Math.random().toString(36).substring(2, 15)
            });
        }
        SelectedPageService.getInstance().updateSelectedPage("Home");
    }
}
