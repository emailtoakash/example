import { EventData } from "tns-core-modules/ui/page/page";
import { Page } from "tns-core-modules/ui/page/page";
import { takePicture, requestPermissions } from "nativescript-camera";
import { View } from "tns-core-modules/ui/core/view";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view";

// the note view view model
import { NoteViewViewModel } from "./note-view-view-model";

export function onPageLoaded(args: EventData) {
    const page: Page = <Page>args.object;
    const viewModel: NoteViewViewModel = new NoteViewViewModel();
    page.bindingContext = viewModel;
}

export function editDescription(args: EventData) {
    //console.log('editing description!');
    const page: Page = <Page>args.object;
    const viewModel: NoteViewViewModel = <NoteViewViewModel>page.bindingContext;
    viewModel.set('editable', !viewModel.get('editable'));
}

export function onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
    if (args.newIndex == 2) {
        //console.log('opening comments');
        const tabView: TabView = <TabView>args.object;
        const page: Page = <Page>tabView.page;
        page.frame.navigate('views/notes-list/notes-list-page');
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