/**
 * 対話ログの型
 */
export type DialogueLog ={

    _id: string;
    from: string;
    to: string;
    contents: string;
    dataType: string;
    timestamp: string; // ISO 8601形式の日時文字列
    tag: string;
    time: string; // ISO 8601形式の日時文字列（UTC）
}