import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from 'tns-core-modules/application';
import { TextView } from "tns-core-modules/ui/text-view";
import { Observable, EventData, Page, NavigatedData } from "tns-core-modules/ui/page/page";
import { takePicture, requestPermissions } from 'nativescript-camera';
import { topmost } from "tns-core-modules/ui/frame";
import { View } from 'tns-core-modules/ui/core/view';
import { fromObject } from "tns-core-modules/data/observable/observable";
import { TextField } from "tns-core-modules/ui/text-field";
import { Label } from "tns-core-modules/ui/label";
import { BindingOptions } from "tns-core-modules/ui/core/bindable";

// Displaying note when one is opened.
export function onNavigatingTo(args: EventData) {
    const title = fromObject({titleSource: "Tenant Alterations for Assetti Oy"});
    const owner = fromObject({ownerSource: "Samuli Hiltunen"});
    const cdate = fromObject({cdateSource: "13.03.2019"});
    const property = fromObject({targetSource: "KOy Askonneliö"});
    const tenant = fromObject({tenantSource: "Assetti Oy"});
    const description = fromObject({
        descSource: "Customer is hoping to remove the glass wall between open area and negotiation room.\n\nContractor said that it will take 2 weeks and will cost 2500€."
    });
    const page: Page = <Page> args.object;
    page.bindingContext = description;
    
    const targetTitle = new Label();
    const targetOwner = new Label();
    const targetCDate = new Label();
    const targetProperty = new Label();
    const targetTenant = new Label();

    const targetDescription = new TextView();

    // Note title
    const titleBindingOptions: BindingOptions = {
        sourceProperty: "titleSource",
        targetProperty: "text",
        twoWay: true
    };
    targetTitle.bind(titleBindingOptions, title);
    
    // Note owner
    const ownerBindingOptions: BindingOptions = {
        sourceProperty: "ownerSource",
        targetProperty: "text",
        twoWay: true
    };
    targetOwner.bind(ownerBindingOptions, owner);
    
    // Note creation date
    const cdateBindingOptions: BindingOptions = {
        sourceProperty: "cdateSource",
        targetProperty: "text",
        twoWay: true
    };
    targetCDate.bind(cdateBindingOptions, cdate);
    
    // Note target property
    const propertyBindingOptions: BindingOptions = {
        sourceProperty: "propertySource",
        targetProperty: "text",
        twoWay: true
    };
    targetProperty.bind(propertyBindingOptions, property);
    
    // Note target tenant
    const tenantBindingOptions: BindingOptions = {
        sourceProperty: "tenantSource",
        targetProperty: "text",
        twoWay: true
    };
    targetTenant.bind(tenantBindingOptions, tenant);

    // Note description
    const descriptionBindingOptions: BindingOptions = {
        sourceProperty: "descSource",
        targetProperty: "text",
        twoWay: true
    };
    targetDescription.bind(descriptionBindingOptions, description);
    
    //source.set("onLoad", function(EventData) {
    //    console.log("page loaded");
    //});
    //page.bindingContext = source;

    // desc.set("editState", false);
    // desc.set("descText", "Customer is hoping to remove the glass wall between open area and negotiation room.\nContractor said that it will take 2 weeks and will cost 2500€.");
}

// Open the navigation drawer when user taps the button.
export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}

// Open camera when user taps the camera button.
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