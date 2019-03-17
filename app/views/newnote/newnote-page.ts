import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from 'tns-core-modules/application';
import { Observable, EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { NewNoteViewModel } from "./newnote-view-model";
import { takePicture, requestPermissions } from 'nativescript-camera';
import { View } from 'tns-core-modules/ui/core/view';
import { request } from 'tns-core-modules/http';
import { topmost } from "tns-core-modules/ui/frame";
import * as dialogs from "tns-core-modules/ui/dialogs";

let page, currentTab, nextButton;

export function onNavigatingTo(args: NavigatedData) {
    page = <Page>args.object;
    
    nextButton = page.getViewById("nextButton");
    const properties = ["Skinnarila", "Sammonlahti", "Leiri", "Keskusta"];
    let viewModel = new Observable();
    viewModel.set("items", properties);
    viewModel.set("selectedIndex", 0);

    page.bindingContext = viewModel;
    currentTab = "a";
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
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
                headers: { "Content-Type": "application/json" , "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBa2FzaC5TaW5naGFsQHN0dWRlbnQubHV0LmZpIiwiYXVkIjoiNEIxRDQ2OTAtQkQ5Qy00N0RGLUEzM0MtMTMzRUUyNzBEQTM5IiwiaWF0IjoxNTUyNzI3NzQyfQ.QRLfDQvvGT9wcWlelG4vPl5YcCaaJZbirBNzCZDYidQ" },
                content: JSON.stringify({
                    title: title,
                    comment: desc
                })
            }).then((response) => {
                const result = response.content.toJSON();
                console.log(result);
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

export function onTakePictureTap(args: EventData) {
    let page = <Page>(<View>args.object).page;
    let saveToGallery = page.bindingContext.get("saveToGallery");
    let keepAspectRatio = page.bindingContext.get("keepAspectRatio");
    let width = page.bindingContext.get("width");
    let height = page.bindingContext.get("height");
    requestPermissions().then(
        () => {
            takePicture({ width: width, height: height, keepAspectRatio: keepAspectRatio, saveToGallery: saveToGallery }).
                then((imageAsset) => {
                    page.bindingContext.set("tns", imageAsset);
                    imageAsset.getImageAsync(function (nativeImage) {
                        let scale = 1;
                        let actualWidth = 0;
                        let actualHeight = 0;
                        if (imageAsset.android) {
                            // get the current density of the screen (dpi) and divide it by the default one to get the scale 
                            //scale = nativeImage.getDensity() / android.util.DisplayMetrics.DENSITY_DEFAULT;
                            scale = nativeImage.scale;
                            actualWidth = nativeImage.getWidth();
                            actualHeight = nativeImage.getHeight();
                        } else {
                            scale = nativeImage.scale;
                            actualWidth = nativeImage.size.width * scale;
                            actualHeight = nativeImage.size.height * scale;
                        }


                    

                    });
                },
                    (err) => {
                        console.log("Error -> " + err.message);
                    });
        },
        () => alert('permissions rejected')
    );
}

function backToHome() {
    topmost().navigate({
        moduleName: "home/home-page",
        transition: {
            name: "fade"
        }
    });
}