import { Observable } from "tns-core-modules/data/observable";
import { SelectedPageService } from "~/shared/selected-page-service";

export class NotesListViewModel extends Observable {
    public notes: Array<Object>;
    public filteredNotes: Array<Object>;
    public showSearch: boolean;

    constructor() {
        super();
        this.notes = new Array();
        this.filteredNotes = new Array();
        this.showSearch = false;
        SelectedPageService.getInstance().updateSelectedPage("Home");
    }
}
