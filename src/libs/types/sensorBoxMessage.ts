export type SensorBoxMessage ={
    messageId: number;
    data: string;
    attributes: Attributes;
    publishTime: string;
    topic: string;
    publisher: string;
}

export type Attributes ={
    datetime: string;
    recorder: string;
    subject: string;
    description: string;
    location: string;
    event: string;
    rdatetime: string;
    object: string;
}
