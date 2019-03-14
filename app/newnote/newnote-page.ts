import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Observable, EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { NewNoteViewModel } from "./newnote-view-model";

let page, currentTab;

export function onNavigatingTo(args: NavigatedData) {
    page = <Page>args.object;
    page.bindingContext = new NewNoteViewModel();
    currentTab = "a";
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}

export function changeTab(args) {
    let tab = page.getViewById(currentTab);
    if (currentTab === "a") {
        let nexttab = page.getViewById("b");
        tab.className = "form hidden";
        nexttab.className = "form";
        currentTab = "b";
    } else {
        let nexttab = page.getViewById("a");
        tab.className = "form hidden";
        nexttab.className = "form";
        currentTab = "a";
    }
}
