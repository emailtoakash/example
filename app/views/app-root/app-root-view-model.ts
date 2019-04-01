import { Observable } from "tns-core-modules/data/observable";

import { ObservableProperty } from "~/shared/observable-property-decorator";
import { SelectedPageService } from "~/shared/selected-page-service";
import { DataStorageService } from "~/shared/data-storage-service";

export class AppRootViewModel extends Observable {
    @ObservableProperty() selectedPage: string;

    public userName: string = '[username]';
    public userEmail: string = '[email]';

    constructor() {
        super();
        SelectedPageService.getInstance().selectedPage$
        .subscribe((selectedPage: string) => this.selectedPage = selectedPage);
    }

    public updateUserInfo() {
        this.userName = DataStorageService.getInstance().getUserData().get('name');
        this.userEmail = DataStorageService.getInstance().getUserData().get('email');
        //console.log(this.userName, this.userEmail);
    }
}
