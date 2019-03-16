import { Observable, fromObject, EventData } from "tns-core-modules/data/observable";
import { Button } from "tns-core-modules/ui/button";
import { Page } from "tns-core-modules/ui/page";

const user: Observable = fromObject({
    email: 'akash@assetti.com',
    password: 'password'
});

export function loaded(args: EventData): void {
    const page: Page = <Page>args.object;
    page.bindingContext = user;
}

export function onTap(args: EventData): void {
    const button: Button = <Button>args.object;
    const page: Page = button.page;
    page.frame.navigate("views/notes-list/notes-list-page");
}