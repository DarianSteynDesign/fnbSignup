export class EventPayloadModel {
    channel: string;
    body: any;

    constructor(channel: string, body: any) {
        this.channel = channel;
        this.body = body;
    }
}