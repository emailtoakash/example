import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Observable, EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { NewNoteViewModel } from "./newnote-view-model";
import { takePicture, requestPermissions } from 'nativescript-camera';
import { android }from 'tns-core-modules/application';
import { View } from 'tns-core-modules/ui/core/view';

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