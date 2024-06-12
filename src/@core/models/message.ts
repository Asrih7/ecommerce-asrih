

export interface Message {
    id?: number;
    subject?: string;
    body: string;
    recipient: string;
    recipient_name?: string;
    file?: string;
    sender: string;
    sender_name?: string;
    sent_at?: string;
    read_at?: string;
}

export interface PopulateMessage {
    message_ids?: number[];
    read_at?: Date;
}

export interface MessageToAdmin {
    email: string;
    name: string;
    body: string;
    file?: string;
}
