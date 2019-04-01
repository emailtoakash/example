// Navigation template imports? Or?
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { topmost } from "tns-core-modules/ui/frame";

// ListView imports
import { ListView, ItemEventData } from "tns-core-modules/ui/list-view";

// The actual view model for the view
import { UnifiedObservable } from "~/shared/data-storage-service";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = UnifiedObservable.getInstance();
    page.bindingContext.getNotes(0, 4, () => { return; });
}

export function onListViewLoaded(args: EventData) {
    const listView = <ListView>args.object;
}

export function onItemTap(args: ItemEventData) {
    const page: Page = <Page>args.view.page;
    UnifiedObservable.getInstance().setCurrentNote(args.view.id);
    page.frame.navigate('views/note-view/note-view-page');
}

// Open the navigation drawer when user clicks the button.
export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}

export function goToView() {
    topmost().navigate({
        moduleName: "views/note-view/note-view",
        transition: {
            name: "fade"
        }
    });
}

export function goToAdd() {
    topmost().navigate({
        moduleName: "views/newnote/newnote-page",
        transition: {
            name: "fade"
        }
    });
}

/*
const stackLayout0 = new StackLayout();
const label0 = new Label();
label0.text = "Tab 0";
stackLayout0.addChild(label0);

const stackLayout1 = new StackLayout();
const label1 = new Label();
label1.text = "Tab 1";
stackLayout1.addChild(label1);

const tabViewItem0 = new TabViewItem();
tabViewItem0.title = "Tab 0";
tabViewItem0.view = stackLayout0;

const tabViewItem1 = new TabViewItem();
tabViewItem1.title = "Tab 1";
tabViewItem1.view = stackLayout1;

// creating TabView
const tabView = new TabView();
// setting up its items and the selected index
const items = [];
items.push(tabViewItem0);
items.push(tabViewItem1);
tabView.items = items;
*/
