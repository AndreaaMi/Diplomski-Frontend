import { Injectable } from "@angular/core";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
    providedIn: 'root'
})
export class StompService {
    private client: Client;

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8081/livelocation-websocket'),
            connectHeaders: {
                login: 'guest',
                passcode: 'guest',
            },
            debug: (str) => {
                console.log(new Date(), str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            console.log('Connected to WS');
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };
    }

    public connectAndSubscribe(topic: string, callback: any): void {
        if (this.client.active) {
            this.subscribeToTopic(topic, callback);
            return;
        }

        this.client.activate();
        this.client.onConnect = () => {
            this.subscribeToTopic(topic, callback);
        };
    }

    private subscribeToTopic(topic: string, callback: any): void {
        this.client.subscribe(topic, (message) => {
            callback(message);
        });
    }
}
