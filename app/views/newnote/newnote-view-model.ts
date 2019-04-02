import { Observable } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel, RadAutoCompleteTextView } from "nativescript-ui-autocomplete";
import { SelectedPageService } from "~/shared/selected-page-service";
import { request } from 'tns-core-modules/http';
import { UnifiedObservable } from "~/shared/shared-data-structures";

export class NewNoteViewModel extends Observable {
    private autocomplete: RadAutoCompleteTextView;

    constructor(page) {
        super();
        this.autocomplete = <RadAutoCompleteTextView>page.getViewById("autocomplete");
        this.autocomplete.loadSuggestionsAsync = function (text) {      
            let properties;
    
            const promise = new Promise((resolve, reject) => 
                request({
                    url: "https://trial.assetti.pro/api/v2/properties?locale=EN&limit=5&offset=0",
                    method: "GET",
                    headers: { "Content-Type": "application/json" , "Authorization" : UnifiedObservable.getInstance().userData['apiToken']},
                }).then((response) => {
                    properties = response.content.toJSON();
                    const items: Array<TokenModel> = new Array();
                    for (let i = 0; i < properties.length; i++) {
                        items.push(new TokenModel(properties[i].name, null));
                    }
                    resolve(items);
                }, (e) => {
                    console.log("Error!")
                    reject();
                }
                    
                
            ));
    
            return promise;
        }

        SelectedPageService.getInstance().updateSelectedPage("New Note");
        // this.initDataItems();
    }
    
    // private properties = ["Skinnarila", "Sammonlahti", "Leiri", "Keskusta"];

    get dataItems(): ObservableArray<TokenModel> {
        return this.get("_dataItems");
    }

    set dataItems(value: ObservableArray<TokenModel>) {
        this.set("_dataItems", value);
    }

    private initDataItems(text) {
        let dataItems = new ObservableArray<TokenModel>();

        let properties;

        const promise = new Promise((resolve, reject) =>
            request({
                url: "https://trial.assetti.pro/api/v2/properties?locale=EN&limit=5&offset=0",
                method: "GET",
                headers: { "Content-Type": "application/json" , "Authorization" : UnifiedObservable.getInstance().userData['apiToken']},
            }).then((response) => {
                properties = response.content.toJSON();
                // console.log(response);
                for (let i = 0; i < properties.length; i++) {
                    dataItems.push(new TokenModel(properties[i].name, undefined));
                }
                console.log("DataItems during request:");
                console.log(dataItems);
                resolve(dataItems);
            }, (e) => {
                console.log("Error!")
                reject();
            }
        ));

        return promise;
    }
}

