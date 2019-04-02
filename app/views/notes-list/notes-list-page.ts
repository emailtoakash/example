// Navigation template imports? Or?
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { SearchBar } from "tns-core-modules/ui/search-bar";

const gestures = require("ui/gestures");

// ListView imports
import { ListView, ItemEventData } from "tns-core-modules/ui/list-view";

// Unused imports for time being
//import { Label } from "tns-core-modules/ui/label";
//import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
//import { TabView, TabViewItem, SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";

// The actual view model for the view
import { NotesListViewModel } from "./notes-list-view-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = new NotesListViewModel();

    /*
    const apiData = new Map<String, any>();
    apiData.set("locale", "EN");
    apiData.set(
        "token",
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvdHRvLml0a29uZW5Ac3R1ZGVudC5sdXQuZmkiLCJhdWQiOiI0QjFENDY5MC1CRDlDLTQ3REYtQTMzQy0xMzNFRTI3MERBMzkiLCJpYXQiOjE1NTQxNDA0MjR9.7OTc8HMf5qX9WAWifiJH9K4OS5mUhmHRmUOHZCwekco"
    ); // set api token here, for testing
    apiData.set("noteLimit", "10");
    apiData.set("noteOffset", "0");

    // above token is only temporary!
    
    const requestUrl =
        "https://trial.assetti.pro/api/v2/notes?locale=" +
        apiData.get("locale") +
        "&limit=" +
        apiData.get("noteLimit") +
        "&offset=" +
        apiData.get("noteOffset");

    //console.log(requestUrl);
    //console.log(apiData);

    fetch(requestUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: apiData.get("token")
        }
    })
        .then(response => response.json())
        .then(r => {
            page.bindingContext.set("notes", r);
        })
        .catch(err => {
            //console.log(err)
        });
        */
    const mockupdata = getMockupNotes();
    page.bindingContext.set("notes", mockupdata);
    page.bindingContext.set("filteredNotes", mockupdata);
}
export function onSearchSubmit(args) {
    /*
    const searchBar = <SearchBar>args.object;
    alert("You are searching for " + searchBar.text);
    */
}

export function searchbarLoaded(args) {
    const search = <SearchBar>args.object;
    search.on("textChange", onSearchTextChanged);
}

export function onSearchClear(args) {}

function onSearchTextChanged(args) {
    const searchBar = <SearchBar>args.object;
    //alert("You are searching for " + searchBar.text);
    const page = <Page>args.object;
    const allNotes = page.bindingContext.get("notes");
    const filteredList = filterNoteList(allNotes, searchBar.text);
    page.bindingContext.set("filteredNotes", filteredList);
}

function filterNoteList(allNotes = [], filterString = "") {
    let returnable = [];
    filterString = filterString.toLowerCase();
    returnable = allNotes.filter(function(item) {
        // just to be sure...
        if (item.comment == null || item.comment === undefined) {
            item.comment = "";
        }
        if (item.title == null || item.title === undefined) {
            item.title = "";
        }
        if (item.createdBy == null || item.createdBy === undefined) {
            item.createdBy = "";
        }
        //
        return (
            item.createdBy.toLowerCase().includes(filterString) ||
            item.title.toLowerCase().includes(filterString) ||
            item.comment.toLowerCase().includes(filterString)
        );
    });
    return returnable;
}

export function onListViewLoaded(args: EventData) {
    const listView = <ListView>args.object;
}

export function onItemTap(args: ItemEventData) {
    const index = args.index;
    console.log("ListView item tab ${index}");
}

// Open the navigation drawer when user clicks the button.
export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}

export function searchBarToggle(args: EventData) {
    const page = <Page>args.object;
    if (page.bindingContext.get("showSearch")) {
        page.bindingContext.set(
            "filteredNotes",
            page.bindingContext.get("notes")
        );
    }
    page.bindingContext.set(
        "showSearch",
        !page.bindingContext.get("showSearch")
    );
}

//////////////////////////////////////////////////////////
function getMockupNotes() {
    return JSON.parse(
        '[{"uuid":"9BE15D41-C248-488F-AE9C-D4AFB6B91B5B","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"Under screening by my client","tags":null,"comment":"<p>Decision  by the end of March.</p>\\n","status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[],"createdBy":"Kimmo Kilpeläinen","createdTimestamp":1454578923},{"uuid":"C68B03B0-191B-4E69-9E15-180DC7F4094B","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"fönstrena sönder","tags":"fönster","comment":"<p>På norra sidan fönstret invid till ingången var sönder.</p>\\n","status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[],"createdBy":"Hannu Rantanen","createdTimestamp":1455543896},{"uuid":"54D9B790-3CC1-4110-B6D3-DEAEDB45F20F","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"Test","tags":"Test","comment":"<p>Test test</p>\\n","status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[],"createdBy":"Hannu Rantanen","createdTimestamp":1455805707},{"uuid":"9439BF3B-359C-445A-B396-0862F882F674","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"fönstrens måste åtgärdas","tags":"fönster","comment":"<p>hjphpi</p>\\n","status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[{"uuid":"08099435-2765-4CFA-9D0C-79D504F77504","email":"kimmo@assetti.pro","phone":"+358 40 510 9969","address":{"country":""},"tenant":true,"firstName":"Kimmo","lastName":"Kilpeläinen","title":"Sales&Channel Management","organisationUuid":"CB2D8B99-E5F6-44A3-9A21-7BFD0045E74E","invoiceContact":false}],"createdBy":"Hannu Rantanen","createdTimestamp":1456749018},{"uuid":"99FC15EA-D83A-4AAC-A8CA-574DE5898F7A","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"hyresgästen ville ha förändringar","tags":"asfalt","comment":"<p>asfalten</p>\\n","status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[{"uuid":"7261B8DC-1D38-4945-B272-D6CDA87FD804","email":"lasse@nastatech.com","address":{"city":"Bellshill","country":"GB","postCode":"ML4 1EN","streetAddress":"12 North Road"},"tenant":false,"firstName":"Lasse","lastName":"Vento","organisationUuid":"CB2D8B99-E5F6-44A3-9A21-7BFD0045E74E","invoiceContact":false}],"createdBy":"Hannu Rantanen","createdTimestamp":1457083321},{"uuid":"81C25291-3A33-4C9A-A023-EC4CFCEBBDF9","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"hdigfuo","tags":"WINDOWS","comment":"<p>fgiusGUGF</p>\\n","status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[{"uuid":"26344C72-6EF2-4D91-BCB5-AFC5D524F837","email":"rob@assetti.pro","phone":"+44 208 638 0821, + 358 50 585 1302","address":{"country":""},"tenant":true,"firstName":"Rob","lastName":"Connell","organisationUuid":"CB2D8B99-E5F6-44A3-9A21-7BFD0045E74E","invoiceContact":false}],"createdBy":"Hannu Rantanen","createdTimestamp":1458057175},{"uuid":"D36F4379-A324-49F8-B054-071DBCB55294","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"complaints","tags":"tenant","comment":null,"status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[],"createdBy":"Hannu Rantanen","createdTimestamp":1458131471},{"uuid":"7BD70FF9-7126-486A-B683-0F574345D247","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"I met Marco in Bruseels","tags":"windows","comment":null,"status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[],"createdBy":"Hannu Rantanen","createdTimestamp":1458146825},{"uuid":"747D76EA-194F-4C02-AD27-C92631A93013","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"dhohvohdiovh","tags":"windows","comment":null,"status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[{"uuid":"26344C72-6EF2-4D91-BCB5-AFC5D524F837","email":"rob@assetti.pro","phone":"+44 208 638 0821, + 358 50 585 1302","address":{"country":""},"tenant":true,"firstName":"Rob","lastName":"Connell","organisationUuid":"CB2D8B99-E5F6-44A3-9A21-7BFD0045E74E","invoiceContact":false}],"createdBy":"Hannu Rantanen","createdTimestamp":1458229984},{"uuid":"CE42E46A-EB02-443E-815A-56FD07D7685C","propertyUuid":null,"portfolioUuid":null,"leaseUuid":null,"unitUuid":null,"contactUuid":null,"organisationUuid":null,"title":"Hyresgäst inte nöjd","tags":"Hyresgäst","comment":"<p>hpihpihpi</p>\\n","status":"OPEN","privateNote":false,"read":false,"type":"NOTE","dueDate":null,"replyList":[],"assignees":[{"uuid":"26344C72-6EF2-4D91-BCB5-AFC5D524F837","email":"rob@assetti.pro","phone":"+44 208 638 0821, + 358 50 585 1302","address":{"country":""},"tenant":true,"firstName":"Rob","lastName":"Connell","organisationUuid":"CB2D8B99-E5F6-44A3-9A21-7BFD0045E74E","invoiceContact":false}],"createdBy":"Hannu Rantanen","createdTimestamp":1458634942}]'
    );
}
/*
const stackLayout0 = new StackLayout();
const label0 = new Label();
label0.text = "Tab 0";
stackLayout0.addChild(label0);

const stackLayout1 = new StackLayout();
const label1 = new Label();
label1.text = "Tab 1";
stackLayout1.addChild(label1);

const tabViewItem0 = new TabViewItem();
tabViewItem0.title = "Tab 0";
tabViewItem0.view = stackLayout0;

const tabViewItem1 = new TabViewItem();
tabViewItem1.title = "Tab 1";
tabViewItem1.view = stackLayout1;

// creating TabView
const tabView = new TabView();
// setting up its items and the selected index
const items = [];
items.push(tabViewItem0);
items.push(tabViewItem1);
tabView.items = items;
*/
