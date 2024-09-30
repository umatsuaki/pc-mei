/**
 * 対話ログをPOSTする際のデータ構造
 */
export interface DialogueLogForPost {
    from: string;
    to: string;
    contents: string;
    dataType: string;
    timestamp: string; // ISO 8601形式の日時文字列
}