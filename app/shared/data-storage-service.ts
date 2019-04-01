//import { KJUR, KEYUTIL } from "jsrsasign";
//import * as base64 from "base-64";
import { request, HttpResponse } from 'tns-core-modules/http';
import { Observable } from "tns-core-modules/data/observable";

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

    private creationTime: Date;

    constructor(apiData: object) {
        super();
        this.uuid = apiData['uuid'] ? apiData['uuid'] : '[uuid]';
        this.title = apiData['title'] ? apiData['title'] : '[title]';
        this.attachments = []; // not there anywhere
        this.comments = apiData['replyList'] ? apiData['replyList'] : new Array<object>();
        this.author = apiData['createdBy'] ? apiData['createdBy'] : '[author]';
        this.creationTime = new Date(apiData['createdTimestamp'] ? apiData['createdTimestamp']*1000 : 0);
        this.date = this.creationTime.toLocaleDateString();
        this.property = apiData['propertyUuid'] ? apiData['propertyUuid'] : '[property]';
        this.tenant = '[tenant]';
        this.tags = apiData['tags'] ? apiData['tags'].split(' ') : new Array<string>();
        this.description = apiData['comment'] ? apiData['comment'].replace(/<\/?[a-z]+>/gm, '') : null;
        this.descriptionEditState = false;
    }

    public saveNote(callback: Function): void {
        console.log('saveNote: ' + this.uuid);
        callback(true);
    }

    public addComment(comment: string, callback: Function): void {
        console.log('addComment: ' + this.uuid);
        callback(true);
    }

    public setDescriptionEditable(): void {
        this.descriptionEditState = true;
    }

}

export class UnifiedObservable extends Observable {

    private static _instance: UnifiedObservable = new UnifiedObservable();

    // user data and notes stored here
    public userData: object = { email: '', password: '' };
    public notesList: Array<Note> = new Array<Note>();

    private currentNote: Note;
    private notesCacheExpiry: Date = new Date(1980);
    private notesCacheMaxAge: number = 10;  // seconds
    private host: string = 'https://trial.assetti.pro';

    // public key for auth api
    /*
    private _pubKey = KEYUTIL.getKey(`
        -----BEGIN PUBLIC KEY-----
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg9OFocUU9KHxweyGFrBw
        +PxDzTSvIFjcgvsF7tpiU4PcsFSazeETfWUGqY2CIYCKDUJSjHyyovvvpki9R21+
        hUfqJzfcarEEanMLIUwv7/OJVILswoeqGDGxc/V5udBlmQrS5ZK4aPfpOJHdzW/6
        +uyrFVmTSey9U0HYjbcH3wbQNmXi25wMczHlrrxKlXFGOjQa0qhTfcgsEf9srCpr
        WqBE4RdAbQRquSawGzUGEgTDbK7vcq0AQSViM3wCzwLyRT259IMDTIT9k75KXrfu
        CDC59yJhIUm21MqKJqxISuZHDg+spr+VqkbajtD5DfwQgwmxZixVmZQfYrJnRycM
        tQIDAQAB
        -----END PUBLIC KEY-----`
    );*/

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
                thisObservable.set('currentNote', this.notesList[i]);
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
        this.userData['apiToken'] = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvdHRvLml0a29uZW5Ac3R1ZGVudC5sdXQuZmkiLCJhdWQiOiIzMTlBMzQ2Qi0wNTNELTQ5ODUtQkE2MC00MDVGQUQwMDQ0RTQiLCJpYXQiOjE1NTI1ODA2ODd9.0AgVTm43rwznAs_thvVL19RteIM8-ir-iEvaJ7grIJY';

        if (bypass) {

            // these three lines to bypass login requirement, need to type token here in code
            callback(true);

        } else {

            const loginData = {
                'email': this.userData['email'],
                'password': this.userData['password'],
                'deviceInfo': 'some device info here',
                'deviceUuid': '5c89b883-ada1-4e5e-8115-3ad522d5a562'
            };

            const bodyContent = {
                //data: this.encryptLoginData(loginData)
            };

            this.apiRequest('/api/v2/login', 'POST', null, bodyContent, function(response: HttpResponse, userData: object) {
                console.log('response.statusCode = ' + response.statusCode);
                this.userData['name'] = userData['name'] ? userData['name'] : '[unknown]';
                this.userData['uuid'] = userData['uuid'] ? userData['uuid'] : '[unknown]';
                this.userData['apiToken'] = userData['token'] ? userData['token'] : '[unknown]';
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
        console.log('getProperty(\'' + uuid + '\',' + callback.name +')');
        if (uuid == null) {
            callback({});
        } else {
            this.apiRequest('/api/ui/property/' + uuid, 'GET', null, null, (resp: HttpResponse, json: object) => {
                callback(json);
            });
        }
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
            UnifiedObservable.getInstance().set('notesList', notes);
            callback(UnifiedObservable.getInstance().notesList.slice(offset, count));
        });
    }

    /*
    private encryptLoginData(loginData: any): string {
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
    }*/


}

export class DataStorageService {

    private static _instance: DataStorageService = new DataStorageService();

    // user data and notes stored here
    private _userData: Map<string, any> = new Map<string, any>();
    private _notes: Array<Map<string, any>> = new Array<Map<string, any>>();
    private _notesCacheExpiry: Date = new Date(1980);
    private _notesCacheMaxAge: number = 10;  // seconds
    private _currentNote: Map<string,any> = new Map<string,any>();
    private _host: string = 'https://trial.assetti.pro';
    private _statusCode: number;  // probably not used anywhere?

    // api token here for use in the application
    private _apiToken: string = 'api token here';

    // public key for auth api
    /*
    private _pubKey = KEYUTIL.getKey(`
        -----BEGIN PUBLIC KEY-----
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg9OFocUU9KHxweyGFrBw
        +PxDzTSvIFjcgvsF7tpiU4PcsFSazeETfWUGqY2CIYCKDUJSjHyyovvvpki9R21+
        hUfqJzfcarEEanMLIUwv7/OJVILswoeqGDGxc/V5udBlmQrS5ZK4aPfpOJHdzW/6
        +uyrFVmTSey9U0HYjbcH3wbQNmXi25wMczHlrrxKlXFGOjQa0qhTfcgsEf9srCpr
        WqBE4RdAbQRquSawGzUGEgTDbK7vcq0AQSViM3wCzwLyRT259IMDTIT9k75KXrfu
        CDC59yJhIUm21MqKJqxISuZHDg+spr+VqkbajtD5DfwQgwmxZixVmZQfYrJnRycM
        tQIDAQAB
        -----END PUBLIC KEY-----`
    );*/

    constructor() {
        if (DataStorageService._instance) {
            throw new Error("Use DataStorageService.getInstance() instead of new.");
        }
        DataStorageService._instance = this;
    }

    public static getInstance(): DataStorageService {
        return DataStorageService._instance; // singleton
    }

    public userLogin(userEmail: string, userPassword: string, callback: Function, bypass: boolean = false): any {
        console.log('Login (' + userEmail + ',' + userPassword + ')');
        this._userData.set('locale', 'EN');
        this._userData.set('name', 'John Smith');
        this._userData.set('email', userEmail);

        if (bypass) {
            // these three lines to bypass login requirement, need to type token here in code
            this._apiToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvdHRvLml0a29uZW5Ac3R1ZGVudC5sdXQuZmkiLCJhdWQiOiIzMTlBMzQ2Qi0wNTNELTQ5ODUtQkE2MC00MDVGQUQwMDQ0RTQiLCJpYXQiOjE1NTI1ODA2ODd9.0AgVTm43rwznAs_thvVL19RteIM8-ir-iEvaJ7grIJY';
            callback(true);
        } else {
            /*
            let loginData = {
                'email': userEmail,
                'password': userPassword,
                'deviceInfo': 'some device info here',
                'deviceUuid': '5c89b883-ada1-4e5e-8115-3ad522d5a562'
            }
            request({
                url: this._host + '/api/v2/login',
                method: "POST",
                headers: { "Content-Type": "application/json" , "Accept": "application/json" },
                content: JSON.stringify({
                    data: this.encryptLoginData(loginData)
                })
            }).then((response) => {
                const r = response.content.toJSON();
                //console.log('response.statusCode = ' + response.statusCode);
                this._userData.set('name', r.name);
                this._userData.set('uuid', r.uuid);
                this._apiToken = r.token;
                this._statusCode = response.statusCode;
                callback((response.statusCode == 200 && r.token!=undefined) ? true : false);
            }, (e) => {
                console.log("Error has happened");
                callback(false);
            });
            */
        }
    }

    public userLogout(): boolean {
        console.log('Logout');
        return true;
    }

    public getUserData(): Map<string, any> {
        return this._userData;
    }

    private apiRequest(url: string, method: string, headers: Map<string,any>, bodyContent: Map<string,any>, callback: Function): void {
        if (headers == null) {
            headers = new Map<string,any>();
        }
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', 'Bearer ' + this._apiToken);
        headers.set('Accept', 'application/json');
        console.log(headers);
        request({
            url: this._host + url,
            method: method,
            headers: headers,
            content: bodyContent ? JSON.stringify(bodyContent) : null
        }).then((response) => {
            callback(response, response.content.toJSON());
        }, (e) => {
            console.log("Error has happened");
            callback(null);
        });
    }

    public getProperty(uuid: string, callback: Function): void {
        console.log('getProperty(\'' + uuid + '\',' + callback.name +')');
        if (uuid == null) {
            callback({});
        } else {
            this.apiRequest('/api/ui/property/' + uuid, 'GET', null, null, (resp: HttpResponse, json: Object) => {
                //console.log('get properties status: ' + resp.statusCode);
                //console.log(json);
                callback(json);
            });
        }
    }

    public getNotes(offset: number, count: number, callback: Function): void {

        const currentTime = new Date();

        if (this._notes.length >= offset + count && this._notesCacheExpiry > currentTime) {
            console.log('Fetch none, use cache.');
            callback(this._notes.slice(offset, offset + count));
            return;
        }

        let queryOffset = 0;
        let queryLimit = offset + count;

        if (this._notesCacheExpiry > currentTime) {
            //console.log('Fetch only missing pieces.');
            queryOffset = Math.max(this._notes.length, offset);
            queryLimit = Math.max(offset - this._notes.length + count, 0);
        } else {
            //console.log('Fetch all, reset expiration.');
            this._notesCacheExpiry = new Date();
            this._notesCacheExpiry.setSeconds(this._notesCacheExpiry.getSeconds() + this._notesCacheMaxAge);
        }

        const requestUrl = [
            this._host + '/api/v2/notes?locale=' + this._userData.get('locale'),
            'limit=' + queryLimit,
            'offset=' + queryOffset
        ].join('&');

        //console.log('Fetch notes ]' + offset + ',' + (offset + count) + '] -> ]' + queryOffset + ',' + (queryOffset + queryLimit) + ']');
        //console.log(requestUrl);
    
        fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this._apiToken
                //'Authorization': this._apiToken
            }
        })
            .then((response) => response.json())
            .then((r) => {
                this._notes.push(...r);
                //console.log(this._notes.length);
                //console.log('fetch done');
                callback(this._notes.slice(offset, offset + count));
            }).catch((err) => {
                //console.log(err)
            });
    }

    public setCurrentNote(uuid: string): void {
        for (let i=0; i<this._notes.length; i++) {
            if (this._notes[i]['uuid'] == uuid) {
                this._currentNote = this._notes[i];
                //console.log('found current note and assigned');
                break;
            }
        }
    }

    public getCurrentNote(): Map<string,any> {
        return this._currentNote;
    }

    /*
    private encryptLoginData(loginData: any): string {
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
    }*/

}
