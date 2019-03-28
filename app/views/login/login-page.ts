import { Observable, fromObject, EventData } from "tns-core-modules/data/observable";
import { Button } from "tns-core-modules/ui/button";
import { Page } from "tns-core-modules/ui/page";
import { alert } from "tns-core-modules/ui/dialogs";

// import data storage service for storing user data
import { DataStorageService } from "~/shared/data-storage-service";

const user: Observable = fromObject({
    email: 'Akash.Singhal@student.lut.fi',
    password: '',
    error: null
});

export function loaded(args: EventData): void {
    const page: Page = <Page>args.object;
    page.bindingContext = user;
}

export function onTap(args: EventData): void {
    const button: Button = <Button>args.object;
    const page: Page = button.page;
    DataStorageService.getInstance().userLogin(user.get('email'), user.get('password'), (success: boolean) => {
        if (success) {
            page.frame.navigate("views/notes-list/notes-list-page");
        } else {
            alert({
                title: 'Login failed',
                message: 'Please check your credentials and network connection.',
                okButtonText: 'Close'
            }).then(() => {
                user.set('password', '');
            });
        }
    });
    // for testing only 
    /*
    DataStorageService.getInstance().getNotes(0, 10, (notes: Array<Object>) => {
        console.log('success 1: ' + notes.length);
        DataStorageService.getInstance().getNotes(5, 20, (notes: Array<Object>) => {
            console.log('success 2: ' + notes.length);
        })
    })*/
}
export function onTapByPass(args: EventData): void {
    const button: Button = <Button>args.object;
    const page: Page = button.page;
     
            page.frame.navigate("views/notes-list/notes-list-page");
        }