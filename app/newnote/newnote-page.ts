import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Observable, EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { TabView } from "tns-core-modules/ui/tab-view";

import { NewNoteViewModel } from "./newnote-view-model";

export function onLoaded(args) {
    const tabView: TabView = <TabView>args.object;
    const vm = new Observable();
    vm.set("tabSelectedIndex", 0);

    tabView.bindingContext = vm;
}

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new NewNoteViewModel();
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}

export function changeTab(args) {
    const vm = args.object.bindingContext;
    const tabSelectedIndex = vm.get("tabSelectedIndex");
    if (tabSelectedIndex === 0) {
        vm.set("tabSelectedIndex", 1);
    } else if (tabSelectedIndex === 1) {
        vm.set("tabSelectedIndex", 2);
    } else if (tabSelectedIndex === 2) {
        vm.set("tabSelectedIndex", 3);
    } else {
        vm.set("tabSelectedIndex", 0);
    }
}