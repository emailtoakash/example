//import { KJUR, KEYUTIL } from "jsrsasign";
//import * as base64 from "base-64";

export class DataStorageService {

    private static _instance: DataStorageService = new DataStorageService();

    // user data and notes stored here
    private _userData: Map<string, any> = new Map<string, any>();
    private _notes: Array<Map<string, any>> = new Array<Map<string, any>>();
    private _notesCacheExpiry: Date = new Date(1980);
    private _host: string = 'https://trial.assetti.pro';

    // api token here for use in the application
    private _apiToken: string = 'api token here';

    // public key for auth api
    /*
    private _pubKey = KEYUTIL.getKey(`-----BEGIN PUBLIC KEY-----
        key here
        -----END PUBLIC KEY-----`);
    */

    constructor() {
        if (DataStorageService._instance) {
            throw new Error("Use DataStorageService.getInstance() instead of new.");
        }
        DataStorageService._instance = this;
    }

    public static getInstance(): DataStorageService {
        return DataStorageService._instance; // singleton
    }

    public userLogin(userEmail: string, userPassword: string, callback: Function): void {
        console.log('Login (' + userEmail + ',' + userPassword + ')');
        this._userData.set('locale', 'EN');
        callback(true);
        /*
        let loginData = {
            'email': userEmail,
            'password': userPassword,
            'deviceInfo': 'some device info here',
            'deviceUuid': '5c89b883-ada1-4e5e-8115-3ad522d5a562'
        }
        fetch(this._host + '/api/v2/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'data': this.encryptLoginData(JSON.stringify(loginData))
            })
        })
            .then((response) => response.json())
            .then((r) => {
               console.log(r);
               this._userData.set('name', r.get('name'));
               this._userData.set('uuid', r.get('uuid'));
               this._apiToken = r.get('token');
            }).catch((err) => {
                //console.log(err)
            });
        */
    }

    public userLogout(): boolean {
        console.log('Logout');
        return true;
    }

    public getUserData(): Map<string, any> {
        return this._userData;
    }

    public getNotes(offset: number, count: number, callback: Function): void {

        const currentTime = new Date();

        if (this._notes.length >= offset + count && this._notesCacheExpiry > currentTime) {
            //console.log('Fetch none, use cache.');
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
            this._notesCacheExpiry.setSeconds(this._notesCacheExpiry.getSeconds() + 10);
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
                //'Authorization': 'Bearer ' + this._apiToken
                'Authorization': this._apiToken
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
    }
    */

}
