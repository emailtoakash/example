import { TextView } from "tns-core-modules/ui/text-view";
import { Observable,EventData } from "tns-core-modules/ui/page/page";
import { Page } from "tns-core-modules/ui/page/page";
import { takePicture, requestPermissions } from 'nativescript-camera';
import { View } from 'tns-core-modules/ui/core/view';
import { Button } from "tns-core-modules/ui/button/button";

// Displaying note description in the desc field
export function descShow(args) {
    const page: Page = <Page> args.object;
    const desc = new Observable();
    desc.set("editState", false);
    desc.set("descText", "Customer is hoping to remove the glass wall between open area and negotiation room.\nContractor said that it will take 2 weeks and will cost 2500€.");
}
export function onTapImageHandler(args: EventData): void {
    const button: Button = <Button>args.object;
    const page: Page = button.page;
    page.frame.navigate("views/note-image/note-image");
}