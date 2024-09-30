export interface BestResponse {
    utterance: string;
    score: number;
    options: any[];
    topic: string;
    imageUrl: string;
    url: string;
    isAutoResponse: boolean;
    extensions: any | null;
    shouldSelectOption: boolean;
    state: string;
    embededHtml: string;
}

export interface MeboAPIResponse {
    utterance: string;
    bestResponse: BestResponse;
    avatarIconUrl: string;
    userState: Record<string, any>;
    isError: boolean;
}
