import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from 'tns-core-modules/application';
import { Observable, EventData, Page, NavigatedData } from "tns-core-modules/ui/page/page";
import { fromObject } from "tns-core-modules/data/observable/observable";

// Displaying note comments when they are opened.
export function onNavigatingTo(args: EventData) {
    const page: Page = <Page> args.object;

    const content = fromObject({
        comments: [
            {authorId: "778231", text: "Questioning comment"},
            {authorId: "789123", text: "Angry answer"},
            {authorId: "778231", text: "Agitated response"},
            {authorId: "789123", text: "Generic insult"}
        ]
    });
    page.bindingContext = content;
}

// Open the navigation drawer when user taps the button.
export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}