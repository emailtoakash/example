import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from 'tns-core-modules/application';
import { EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { NewNoteViewModel } from "./newnote-view-model";
import { takePicture, requestPermissions } from 'nativescript-camera';
import { request } from 'tns-core-modules/http';
import { topmost } from "tns-core-modules/ui/frame";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Button } from "tns-core-modules/ui/button";
import * as bghttp from "nativescript-background-http";
import { isIOS } from "tns-core-modules/platform";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as fs from "tns-core-modules/file-system";
import {ImageSource} from "tns-core-modules/image-source";
import { UnifiedObservable } from "~/shared/shared-data-structures";

let page, currentTab, nextButton;
let count:boolean = false;
export function onNavigatingTo(args: NavigatedData) {
    page = <Page>args.object;
    
    nextButton = page.getViewById("nextButton");
    let viewModel = new NewNoteViewModel(page);

    page.bindingContext = viewModel;
    currentTab = "a";
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}
export function onTapImageHandler(args: EventData): void {
    const button: Button = <Button>args.object;
    const page: Page = button.page;
    requestPermissions().then(
        () => {
            takePicture({ width: 480, height: 640, keepAspectRatio: true, saveToGallery: true }).
                then((imageAsset) => {
                   if(isIOS){
                    const source = new ImageSource();
                    source.fromAsset(imageAsset)
                        .then((imageSource: ImageSource) => {
                            const folderPath: string = fs.knownFolders.currentApp().path;
                            const fileName = "Picture.jpeg";
                             const filePath = fs.path.join(folderPath, fileName);
                            const saved: boolean = imageSource.saveToFile(filePath, "jpeg");
                            if (saved) {
                                console.log("Image saved successfully!");
                                count=true;
                            }
                   });}
                   else{
                    const source = new ImageSource();
                    source.fromAsset(imageAsset)
                        .then((imageSource: ImageSource) => {
                            const folderPath: string = fs.knownFolders.currentApp().path;
                            const fileName = "Picture.jpeg";
                             const filePath = fs.path.join(folderPath, fileName);

                            const saved: boolean = imageSource.saveToFile(filePath, "jpeg");
                            if (saved) {
                                console.log("Image saved successfully!");
                                count=true;
                            }
                   });
                   }
                  
                },
                    (err) => {
                        console.log("Error -> " + err.message);
                    });
        },
        () => alert('permissions rejected')
    );
    
}

export function changeTab(args) {
    let button = args.object;
    let tab = page.getViewById(currentTab);
    if (currentTab === "a") {
        if (button.id == "nextButton") {
            let nexttab = page.getViewById("b");
            tab.className = "form hidden";
            nexttab.className = "form";
            currentTab = "b";
            nextButton.text = "SAVE";
        } else { // Back from tab a
            backToHome();
        }
    } else { // tab b
        if (button.id == "nextButton") { // User pressed "SAVE" button
            const title = page.getViewById("notetitle").text;
            const desc = page.getViewById("description").text;
            console.log("Sending the note to Assetti...");
            request({
                url: "https://trial.assetti.pro/api/v2/notes?locale=EN&limit=2&offset=0",
                method: "POST",
                headers: { "Content-Type": "application/json" , "Authorization" : UnifiedObservable.getInstance().userData['apiToken'] },
                content: JSON.stringify({
                    title: title,
                    comment: desc
                })
            }).then((response) => {
                const result = response.content.toJSON();
                console.log(result);
                const UUID = result.newRecord.uuid;
                console.log(count);
                if(count)
                {   
                    console.log("YESSSS");
                    start_upload(false, true, UUID);
                }
                
                dialogs.alert({
                    title: "Note sent!",
                    message: "Returning to home screen",
                    okButtonText: "OK"
                }).then(() => {
                    backToHome();
                });
            }, (e) => {
                console.log("Error has happened");
            });
        } else { // User pressed "BACK" button
            let nexttab = page.getViewById("a");
            tab.className = "form hidden";
            nexttab.className = "form";
            currentTab = "a";
            nextButton.text = "NEXT";
        }
    }
}
function start_upload(should_fail, isMulti, UUID) {
    var tasks: ObservableArray<bghttp.Task>;
    var events: ObservableArray<{ eventTitle: string, eventData: any }>;
    var file: string;
    var url: string;
    var counter: number;
    var session: any;
    var filePath: string;
    var count:number;
    session = bghttp.session("image-upload");
    tasks = new ObservableArray<bghttp.Task>();
        events = new ObservableArray();
        counter = 0;
        count = 0;
        file = fs.path.normalize(fs.knownFolders.currentApp().path + "/Picture.jpeg");
        url = "https://trial.assetti.pro/api/v2/notes/" + UUID + "/attachments?locale=EN";
    
    const name = file.substr(file.lastIndexOf("/") + 1);
    const description = `${name} (${++counter})`;
    const request = {
        url: url,
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream",
            "Authorization": UnifiedObservable.getInstance().userData['apiToken'],
            "File-Name": name
        },
        description: description,
        androidAutoDeleteAfterUpload: false,
        androidNotificationTitle: 'NativeScript HTTP background'
    };

    if (should_fail) {
        request.headers["Should-Fail"] = true;
    }

    let task: bghttp.Task;
    let lastEvent = "";
    if (isMulti) {
        const params = [
            { name: "description", value: "Attachment" },
            { name: "file", filename: file, mimeType: 'image/jpeg' }
        ];
        task = session.multipartUpload(params, request);
        console.log("Upload Success for Image");
    } else {
        task = session.uploadFile(file, request);
    }

    function onEvent(e) {
        if (lastEvent !== e.eventName) {
            // suppress all repeating progress events and only show the first one
            lastEvent = e.eventName;
        } else {
            return;
        }

    }
    lastEvent = "";
    tasks.push(task);
}
function backToHome() {
    topmost().navigate({
        moduleName: "views/notes-list/notes-list-page",
        transition: {
            name: "fade"
        }
    });
}