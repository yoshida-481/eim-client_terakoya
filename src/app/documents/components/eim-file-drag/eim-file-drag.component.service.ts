import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

/**
 * EIMファイルドラッグ情報
 */
export interface BoxEIMFileDragInfo {
  // BoxドキュメントオブジェクトID
  id: number;
  // ファイル名
  name: string;
  // ファイルアイコン
  icon: string;
}

/**
 * EIMファイルドラッグコンポーネントサービス
 */
@Injectable()
export class BoxEIMFileDragComponentService {
  /** ドラッグ開始イベント */
  private dragStarted = new Subject<[DragEvent, BoxEIMFileDragInfo[]]>();
  dragStarted$ = this.dragStarted.asObservable();

  /** ドラッグ終了イベント */
  private dragEnded = new Subject<DragEvent>();
  dragEnded$ = this.dragEnded.asObservable();

  // ----------------------------------------
  // 公開メソッド
  // ----------------------------------------
  /**
   * ドラッグを開始します.
   * @param event ドラッグイベント
   * @param info ドラッグファイル情報
   */
  dragStart(event: DragEvent, info: BoxEIMFileDragInfo[]) {
    const userAgent = window.navigator.userAgent;
    const isIE = userAgent.indexOf("Trident/") >= 0;
    const data = JSON.stringify(info);
    event.dataTransfer.setData(isIE ? "text" : "application/json", data);
    this.dragStarted.next([event, info]);
  }

  /**
   * ドラッグを終了します.
   * @param event ドラッグイベント
   */
  dragEnd(event: DragEvent) {
    this.dragEnded.next(event);
  }
}
