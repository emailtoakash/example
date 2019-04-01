import { EventData, Page } from "tns-core-modules/ui/page/page";
import { topmost } from "tns-core-modules/ui/frame";
import { takePicture, requestPermissions } from "nativescript-camera";
import { View } from "tns-core-modules/ui/core/view";

// the note view view model
import { UnifiedObservable, Note } from "~/shared/shared-data-structures";

export function onPageLoaded(args: EventData) {
    const page: Page = <Page>args.object;
    page.bindingContext = <Note>UnifiedObservable.getInstance().getCurrentNote();
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

// User taps the back button, go back to menu.
export function onBackTap() {
    topmost().navigate({
        moduleName: "views/notes-list/notes-list-page",
        transition: {
            name: "fade"
        }
    });
}