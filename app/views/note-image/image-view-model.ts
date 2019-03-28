import * as bghttp from "nativescript-background-http";
import { isIOS } from "tns-core-modules/platform";
import { Observable, fromObject } from 'tns-core-modules/data/observable';
import { ObservableArray } from "tns-core-modules/data/observable-array";
import * as fs from "tns-core-modules/file-system";
import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
import { takePicture, requestPermissions } from "nativescript-camera";
import { topmost } from "tns-core-modules/ui/frame/frame";
import * as dialogs from "tns-core-modules/ui/dialogs";

export class ImageViewModel extends Observable {
    tasks: ObservableArray<bghttp.Task>;
    events: ObservableArray<{ eventTitle: string, eventData: any }>;
    file: string;
    url: string;
    counter: number;
    session: any;
    filePath: string;
    count:number;

    constructor() {
        super();

        this.tasks = new ObservableArray<bghttp.Task>();
        this.events = new ObservableArray();
        this.counter = 0;
        this.count = 0;
        this.file = fs.path.normalize(fs.knownFolders.currentApp().path + "/Picture.jpeg");
        if (isIOS) {
            // NOTE: This works for emulator. Real device will need other address.
            this.url = "https://trial.assetti.pro/api/v2/notes/BEFA8B6A-CC0B-4B13-A340-957FEA6576CA/attachments?locale=EN";
            
        } else {
            // NOTE: This works for emulator. Real device will need other address.
            this.url = "https://trial.assetti.pro/api/v2/notes/BEFA8B6A-CC0B-4B13-A340-957FEA6576CA/attachments?locale=EN";
        }
        requestPermissions().then(
            () => {
                takePicture({ width: 240, height: 320, keepAspectRatio: true, saveToGallery: true }).
                    then((imageAsset) => {
                       // page.bindingContext.set("cameraImage", imageAsset);
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
                                    this.count=1;
                                    
                                }
                                this.file=filePath;
                                const imageSources = fromObject({imageSr: filePath});
                                
                                
                       });}
                       else{
                           this.file=imageAsset.android;

                       }
                      
                    },
                        (err) => {
                            console.log("Error -> " + err.message);
                        });
            },
            () => alert('permissions rejected')
        );
        this.session = bghttp.session("image-upload");
    }
    backToHome() {
        topmost().navigate({
            moduleName: "views/notes-list/notes-list-page",
            transition: {
                name: "fade"
            }
        });
    }

    

    upload(args) {
       
        this.start_upload(false,true); 
        dialogs.alert({
            title: "Attchment sent!",
            message: "Returning to home screen",
            okButtonText: "OK"
        }).then(() => {
            this.backToHome();
        });

    }

    upload_error(args) {
        this.start_upload(true, false);
    }

    upload_multi(args) {
        this.start_upload(false, true);
    }

    start_upload(should_fail, isMulti) {
        //console.log((should_fail ? "Testing error during upload of " : "Uploading file: ") + this.file + (isMulti ? " using multipart." : ""));
        
        const name = this.file.substr(this.file.lastIndexOf("/") + 1);
        const description = `${name} (${++this.counter})`;
        const request = {
            url: this.url,
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBa2FzaC5TaW5naGFsQHN0dWRlbnQubHV0LmZpIiwiYXVkIjoiNEIxRDQ2OTAtQkQ5Qy00N0RGLUEzM0MtMTMzRUUyNzBEQTM5IiwiaWF0IjoxNTUyNzI3NzQyfQ.QRLfDQvvGT9wcWlelG4vPl5YcCaaJZbirBNzCZDYidQ",

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
                { name: "file", filename: this.file, mimeType: 'image/jpeg' }
            ];
            task = this.session.multipartUpload(params, request);
        } else {
            task = this.session.uploadFile(this.file, request);
        }

        function onEvent(e) {
            if (lastEvent !== e.eventName) {
                // suppress all repeating progress events and only show the first one
                lastEvent = e.eventName;
            } else {
                return;
            }

            this.events.push({
                eventTitle: e.eventName + " " + e.object.description,
                eventData: JSON.stringify({
                    error: e.error ? e.error.toString() : e.error,
                    currentBytes: e.currentBytes,
                    totalBytes: e.totalBytes,
                    body: e.data
                })
            });
        }

        task.on("progress", onEvent.bind(this));
        task.on("error", onEvent.bind(this));
        task.on("responded", onEvent.bind(this));
        task.on("complete", onEvent.bind(this));
        lastEvent = "";
        if(this.count==1)
        this.tasks.push(task);
    }
}
