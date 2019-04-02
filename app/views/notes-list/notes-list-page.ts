// Navigation template imports? Or?
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { SelectedPageService } from "~/shared/selected-page-service";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { topmost } from "tns-core-modules/ui/frame";
// The actual view model for the view
import { UnifiedObservable } from "~/shared/shared-data-structures";

export function onNavigatingTo(args: NavigatedData) {
    SelectedPageService.getInstance().updateSelectedPage("Home");
    const page = <Page>args.object;
    page.bindingContext = UnifiedObservable.getInstance();
    page.bindingContext.getNotes(0, 60, () => { return; });
}

export function onNotesListItemTap(args: ItemEventData) {
    UnifiedObservable.getInstance().setCurrentNote(args.view.id);
    const page: Page = <Page>args.view.page;
    page.frame.navigate({
        moduleName: 'views/note-view/note-view-page',
        transition: {
            name: 'fade'
        }
    });
}

// Open the navigation drawer when user clicks the button.
export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}

export function goToAdd() {
    topmost().navigate({
        moduleName: "views/newnote/newnote-page",
        transition: {
            name: "fade"
        }
    });
}
