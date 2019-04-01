import { Observable } from "tns-core-modules/data/observable";

import { ObservableProperty } from "~/shared/observable-property-decorator";
import { SelectedPageService } from "~/shared/selected-page-service";
import { UnifiedObservable } from "~/shared/shared-data-structures";

export class AppRootViewModel extends Observable {
    @ObservableProperty() selectedPage: string;

    public userName: string = '[username]';
    public userEmail: string = '[email]';

    constructor() {
        super();
        SelectedPageService.getInstance().selectedPage$
        .subscribe((selectedPage: string) => this.selectedPage = selectedPage);
        this.userName = UnifiedObservable.getInstance().userData['name'];
        this.userEmail = UnifiedObservable.getInstance().userData['email'];
    }
}
