import { TextView } from "tns-core-modules/ui/text-view";
import { Observable,EventData } from "tns-core-modules/ui/page/page";
import { Page } from "tns-core-modules/ui/page/page";
import { takePicture, requestPermissions } from 'nativescript-camera';
import { View } from 'tns-core-modules/ui/core/view';

// Displaying note description in the desc field
export function descShow(args) {
    const page: Page = <Page> args.object;
    const desc = new Observable();
    desc.set("editState", false);
    desc.set("descText", "Customer is hoping to remove the glass wall between open area and negotiation room.\nContractor said that it will take 2 weeks and will cost 2500€.");
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