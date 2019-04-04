// Navigation template imports? Or?
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { EventData } from "tns-core-modules/data/observable";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { SelectedPageService } from "~/shared/selected-page-service";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { topmost } from "tns-core-modules/ui/frame";
// The actual view model for the view
import { UnifiedObservable } from "~/shared/shared-data-structures";
import { SearchBar } from "tns-core-modules/ui/search-bar";

export function onNavigatingTo(args: NavigatedData) {
    SelectedPageService.getInstance().updateSelectedPage("Home");
    const page = <Page>args.object;
    page.bindingContext = UnifiedObservable.getInstance();
    page.bindingContext.set("notesList", getMockupNotes());
    page.bindingContext.set("filteredNotesList", getMockupNotes());
    /*page.bindingContext.getNotes(0, 60, () => {
        return;
    });*/
}

export function onNotesListItemTap(args: ItemEventData) {
    UnifiedObservable.getInstance().setCurrentNote(args.view.id);
    const page: Page = <Page>args.view.page;
    page.frame.navigate({
        moduleName: "views/note-view/note-view-page",
        transition: {
            name: "fade"
        }
    });
}

// Open the navigation drawer when user clicks the button.
export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
}

export function goToAdd() {
    topmost().navigate({
        moduleName: "views/newnote/newnote-page",
        transition: {
            name: "fade"
        }
    });
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
    const allNotes = page.bindingContext.get("notesList");
    const filteredList = filterNoteList(allNotes, searchBar.text);
    page.bindingContext.set("filteredNotesList", filteredList);
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
        if (item.tags == null || item.tags === undefined) {
            item.tags = "";
        }
        //
        return (
            item.createdBy.toLowerCase().includes(filterString) ||
            item.title.toLowerCase().includes(filterString) ||
            item.comment.toLowerCase().includes(filterString) ||
            item.tags.toLowerCase().includes(filterString)
        );
    });
    return returnable;
}
export function searchBarToggle(args: EventData) {
    const page = <Page>args.object;
    if (page.bindingContext.get("showSearch")) {
        page.bindingContext.set(
            "filteredNotesList",
            page.bindingContext.get("notesList")
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
