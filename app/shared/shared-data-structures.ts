//UNCOMMENT THIS FOR LOGIN VIA API
//import { KJUR, KEYUTIL } from "jsrsasign";
//import * as base64 from "base-64";
import { request, HttpResponse } from 'tns-core-modules/http';
import { Observable } from "tns-core-modules/data/observable";

import { Button } from "tns-core-modules/ui/button";
import { EventData, Page } from "tns-core-modules/ui/page/page";
import { TextField } from "tns-core-modules/ui/text-field";

export class Note extends Observable {

    public uuid: string;
    public title: string;
    public attachments: Array<object>;
    public comments: Array<object>;
    public description: string;
    public author: string;
    public date: string;
    public property: string;
    public tenant: string;
    public tags: Array<string>;
    public descriptionEditState: boolean;
    public newCommentText: string;

    private creationTime: Date;

    constructor(apiData: object) {
        super();
        this.set('uuid', apiData['uuid'] ? apiData['uuid'] : '[uuid]');
        this.set('title', apiData['title'] ? apiData['title'] : '[title]');
        this.set('attachments', new Array<object>()); // not there anywhere
        this.set('author', apiData['createdBy'] ? apiData['createdBy'] : '[author]');
        this.set('creationTime', new Date(apiData['createdTimestamp'] ? apiData['createdTimestamp']*1000 : 0));
        this.set('date', this.creationTime.toLocaleDateString());
        this.set('property', '[property]');
        this.set('tenant', '[tenant]');
        this.set('tags', apiData['tags'] ? apiData['tags'].split(' ') : new Array<string>());
        this.set('description', this.stripHtmlTags(apiData['comment']));
        this.set('descriptionEditState', false);
        this.set('comments', new Array<object>());
        (apiData['replyList'] as Array<object>).forEach((comment) => {
            this.comments.push({
                authorId: comment['createdBy'],
                text: this.stripHtmlTags(comment['comment'])
            })
        });
        /* UnifiedObservable.getInstance().getProperty(apiData['propertyUuid'], function(propertyData: object) {
            this.set('property', propertyData['name'] ? propertyData['name'] : '[undefined]');
        }); */
    }

    private stripHtmlTags(text: string): string {
        return text ? text.replace(/<\/?[a-z]+>/gm, '') : null;
    }

    private updateSelfInNotesList(): void {
        const uniObservable: UnifiedObservable = UnifiedObservable.getInstance();
        for (let i=0; i<uniObservable.notesList.length; i++) {
            //console.log(uniObservable.notesList[i].uuid, this.uuid);
            if (uniObservable.notesList[i].uuid == this.uuid) {
                //console.log('replacing at index ' + i);
                uniObservable.notesList.splice(i, 1, this);
                break;
            }
        }
    }

    public saveNote(callback: Function): void {
        console.log('saveNote: ' + this.uuid);
        callback(true);
    }

    public addComment(args: EventData): void {
        const button: Button = <Button>args.object;
        const page: Page = <Page>button.page;
        const inputField: TextField = <TextField>page.getViewById('newComment');
        //console.log('addComment: ' + this.newCommentText);
        //console.log('addComment: ' + this.uuid);
        this.comments.push({
            authorId: UnifiedObservable.getInstance().userData['name'],
            text: this.newCommentText
        });
        this.set('newCommentText', null);
        this.updateSelfInNotesList();
        inputField.dismissSoftInput();
    }
    
    public blurDescription(args: EventData) {
        //console.log('updateDescription: ' + this.uuid);
        this.updateSelfInNotesList();
    }

    public toggleDescriptionEditable(args: EventData) {
        const descriptionField: TextField = <TextField>args.object;
        const newState = !this.descriptionEditState;
        this.set('descriptionEditState', newState);
        if (!newState) {
            descriptionField.dismissSoftInput();
        }
    }

}

export class UnifiedObservable extends Observable {

    private static _instance: UnifiedObservable = new UnifiedObservable();

    // user data and notes stored here
    public userData: object = { email: '', password: '', name: '', uuid: '', apiToken: '',locale: ''};
    public notesList: Array<Note> = new Array<Note>();

    private currentNote: Note;
    private notesCacheExpiry: Date = new Date(1980);
    private notesCacheMaxAge: number = 30;  // seconds
    private propertiesCache: Map<string,object> = new Map<string,object>();
    private host: string = 'https://trial.assetti.pro';

    // public key for auth api
    //UNCOMMENT THIS FOR LOGIN VIA API
    /* private _pubKey = KEYUTIL.getKey(`
        -----BEGIN PUBLIC KEY-----
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg9OFocUU9KHxweyGFrBw
        +PxDzTSvIFjcgvsF7tpiU4PcsFSazeETfWUGqY2CIYCKDUJSjHyyovvvpki9R21+
        hUfqJzfcarEEanMLIUwv7/OJVILswoeqGDGxc/V5udBlmQrS5ZK4aPfpOJHdzW/6
        +uyrFVmTSey9U0HYjbcH3wbQNmXi25wMczHlrrxKlXFGOjQa0qhTfcgsEf9srCpr
        WqBE4RdAbQRquSawGzUGEgTDbK7vcq0AQSViM3wCzwLyRT259IMDTIT9k75KXrfu
        CDC59yJhIUm21MqKJqxISuZHDg+spr+VqkbajtD5DfwQgwmxZixVmZQfYrJnRycM
        tQIDAQAB
        -----END PUBLIC KEY-----`
    );  */

    constructor() {
        super();
        if (UnifiedObservable._instance) {
            throw new Error("Use DataStorageService.getInstance() instead of new.");
        }
        UnifiedObservable._instance = this;
    }

    public static getInstance(): UnifiedObservable {
        return UnifiedObservable._instance; // singleton
    }

    public setCurrentNote(uuid: string): void {
        const thisObservable: UnifiedObservable = UnifiedObservable.getInstance();
        for (let i=0; i<thisObservable.notesList.length; i++) {
            if (thisObservable.notesList[i].uuid == uuid) {
                //console.log('found note: ' + uuid + ' -> ' + i);
                thisObservable.set('currentNote', thisObservable.notesList[i]);
            }
        }
    }

    public getCurrentNote(): Note {
        return this.currentNote;
    }

    public userLogin(bypass: boolean, callback: Function): any {
        //console.log('userLogin(' + this.userData['email'] + ',' + this.userData['password'] + ')');
        this.userData['locale'] = 'EN';
        this.userData['name'] = 'John Smith';
        this.userData['email'] = 'john@assetti.fi'
        this.userData['uuid'] = 'xyz'
        //this.userData.name ='John Smith';
        //this.userData.email ='John Smith';
        if (bypass) {
            this.userData['apiToken'] = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBa2FzaC5TaW5naGFsQHN0dWRlbnQubHV0LmZpIiwiYXVkIjoiNEIxRDQ2OTAtQkQ5Qy00N0RGLUEzM0MtMTMzRUUyNzBEQTM5IiwiaWF0IjoxNTU0MTkxMTE3fQ.NESl83lLOP8K9AZkHXQ10V19PsuR7Wl6YkEJuQvmpOw'; // <- API token here when bypassing
            callback(true);
        } else {
            const loginData = {
                'email': this.userData['email'],
                'password': this.userData['password'],
                'deviceInfo': 'some device info here',
                'deviceUuid': '5c89b883-ada1-4e5e-8115-3ad522d5a562'
            };
            const bodyContent = {
                //UNCOMMENT THIS FOR LOGIN VIA API
                //data: this.encryptLoginData(loginData)
            };
            this.apiRequest('/api/v2/login', 'POST', null, bodyContent, function(response: HttpResponse, userData: object) {
                const r = response.content.toJSON();
                console.log('response.statusCode = ' + response.statusCode);
                console.log("####1"+ userData['name']); 
                /* this.userData['name'] = userData['name'] ? userData['name'] : '[unknown]';
                console.log("####2"); 
                this.userData['uuid'] = userData['uuid'] ? userData['uuid'] : '[unknown]';
                console.log("####3"); 
                this.userData['apiToken'] = userData['token'] ? userData['token'] : '[unknown]'; */
                //console.log(userData['token'] + "####" + r.token); 
                if(response.statusCode == 200)
                {
                console.log("####2"); 
                this.userData.name = userData['name'] ;
                console.log("####2"); 
                this.userData.uuid = userData['uuid'];
                console.log("####3"); 
                this.userData.apiToken = userData['token'];
                }
                callback((response.statusCode == 200 && userData['token'] != undefined) ? true : false);
            });
        }
    }

    public userLogout(): boolean {
        console.log('Logout');
        return true;
    }

    private apiRequest(url: string, method: string, headers: object, bodyContent: object, callback: Function): void {
        if (headers == null) {
            headers = {};
        }
        headers['Content-Type'] = 'application/json';
        headers['Authorization'] = this.userData['apiToken'];
        //console.log(this.userData['apiToken']);
        headers['Accept'] = 'application/json';
        request({
            url: this.host + url,
            method: method,
            headers: headers,
            content: bodyContent ? JSON.stringify(bodyContent) : null
        }).then((response) => {
            callback(response, response.content.toJSON() as object);
        }, (e) => {
            console.log("Error has happened");
            callback(null);
        });
    }

    public getProperty(uuid: string, callback: Function): void {
        console.log('getProperty(\'' + uuid + '\')');
        if (uuid == null) {
            //console.log('no property uuid provided');
            callback({});
        } else if (this.propertiesCache.has(uuid)) {
            //console.log('use cached property');
            callback(this.propertiesCache.get(uuid));
        } else {
            this.apiRequest('/api/ui/property/' + uuid, 'GET', null, null, (resp: HttpResponse, json: object) => {
                UnifiedObservable.getInstance().setCachedProperty(json);
                callback(json);
            });
        }
    }

    public setCachedProperty(propertyData: object) {
        this.propertiesCache.set(propertyData['uuid'], propertyData);
    }

    public getNotes(offset: number, count: number, callback: Function): void {

        const currentTime = new Date();

        if (this.notesList.length >= offset + count && this.notesCacheExpiry > currentTime) {
            //console.log('Fetch none, use cache.');
            callback(this.notesList.slice(offset, offset + count));
            return;
        }

        let queryOffset = 0;
        let queryLimit = offset + count;

        if (this.notesCacheExpiry > currentTime) {
            //console.log('Fetch only missing pieces.');
            queryOffset = Math.max(this.notesList.length, offset);
            queryLimit = Math.max(offset - this.notesList.length + count, 0);
        } else {
            //console.log('Fetch all, reset expiration.');
            this.set('notesList', new Array<Note>());
            this.notesCacheExpiry = new Date();
            this.notesCacheExpiry.setSeconds(this.notesCacheExpiry.getSeconds() + this.notesCacheMaxAge);
        }

        const requestUrl = [
            '/api/v2/notes?locale=' + this.userData['locale'],
            'limit=' + queryLimit,
            'offset=' + queryOffset
        ].join('&');

        //console.log(requestUrl);
        //console.log('Fetch notes ]' + offset + ',' + (offset + count) + '] -> ]' + queryOffset + ',' + (queryOffset + queryLimit) + ']');
    
        this.apiRequest(requestUrl, 'GET', null, null, function(response: HttpResponse, jsonData: object) {
            const notes = Array.from(UnifiedObservable.getInstance().notesList);
            Array.from(jsonData as Array<object>).forEach((noteData: object) => {
                notes.push(new Note(noteData));
            });
            UnifiedObservable.getInstance().set('notesList', notes.reverse());
            callback(UnifiedObservable.getInstance().notesList.slice(offset, count));
        });
    }

    //UNCOMMENT THIS FOR LOGIN VIA API
   /*  private encryptLoginData(loginData: any): string {
        let encryptedHex: string = KJUR.crypto.Cipher.encrypt(
            JSON.stringify(loginData),
            this._pubKey,
            'RSA'
        );
        let encryptedRaw: string = '';
        // KJUR.crypto.Cipher.encrypt() returns a string of hex digits.
        // Decode that into a string of bytes and put it in encryptedRaw.
        let encryptedByteCount = Math.ceil(encryptedHex.length / 2);
        for (let i = 0; i < encryptedByteCount; i++) {
            encryptedRaw += String.fromCharCode(parseInt(encryptedHex.substr(i * 2, 2), 16));
        }
        return base64.encode(encryptedRaw);
    } */ 


}
