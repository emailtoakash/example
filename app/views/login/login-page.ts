import { EventData } from "tns-core-modules/data/observable";
import { Button } from "tns-core-modules/ui/button";
import { Page } from "tns-core-modules/ui/page";
import { alert } from "tns-core-modules/ui/dialogs";

import { UnifiedObservable } from "~/shared/shared-data-structures";

export function loaded(args: EventData): void {
    const page: Page = <Page>args.object;
    page.bindingContext = UnifiedObservable.getInstance();
}

export function tapLogin(args: EventData): void {
    const button: Button = <Button>args.object;
    const page: Page = button.page;
    UnifiedObservable.getInstance().userLogin(false, (success: boolean) => {
        if (success) {
            page.frame.navigate("views/notes-list/notes-list-page");
        } else {
            alert({
                title: 'Login failed',
                message: 'Please check your credentials and network connection.',
                okButtonText: 'Close'
            }).then(() => {
                UnifiedObservable.getInstance().userData['password'] = null;
            });
        }
    });
}

export function tapLoginBypass(args: EventData): void {
    const button: Button = <Button>args.object;
    const page: Page = button.page;
    console.log('bypass login');
    UnifiedObservable.getInstance().userLogin(true, (success: boolean) => {
        page.frame.navigate("views/notes-list/notes-list-page");
    });
}