import { Component, OnDestroy, OnInit, ElementRef } from "@angular/core";
import { Subscription } from "rxjs";

import {
  BoxEIMFileDragComponentService,
  BoxEIMFileDragInfo,
} from "./eim-file-drag.component.service";

/**
 * EIMファイルドラッグコンポーネント
 * @example
 *      <box-eim-file-drag>
 *      </box-eim-file-drag>
 */
@Component({
  selector: "box-eim-file-drag",
  templateUrl: "./eim-file-drag.component.html",
  styleUrls: ["./eim-file-drag.component.css"],
  standalone: false,
})
export class BoxEIMFileDragComponent implements OnInit, OnDestroy {
  /** ドラッグファイル情報 */
  info: BoxEIMFileDragInfo[];

  /** ドラッグ中の場合true */
  dragging = false;

  /** ドラッグ開始サブスクリプション */
  private dragStarted: Subscription;

  /** ドラッグ終了サブスクリプション */
  private dragEnded: Subscription;

  /**
   * コンストラクタです.
   */
  constructor(
    protected el: ElementRef,
    protected componentService: BoxEIMFileDragComponentService
  ) {}

  // ----------------------------------------
  // イベントハンドラ
  // ----------------------------------------
  /**
   * 入力値初期化後のイベントハンドラです.
   */
  ngOnInit() {
    // ドラッグ中のファイル情報を表示する
    this.dragStarted = this.componentService.dragStarted$.subscribe(
      ([event, info]) => {
        event.dataTransfer.setDragImage(
          this.el.nativeElement,
          18,
          info.length * 12.5 + 2
        );
        this.info = info;
        this.dragging = true;
      }
    );
    this.dragEnded = this.componentService.dragEnded$.subscribe((_) => {
      this.info = undefined;
      this.dragging = false;
    });
  }

  /**
   * コンポーネント破棄前イベントハンドラです.
   */
  ngOnDestroy() {
    if (this.dragStarted && !this.dragStarted.closed) {
      this.dragStarted.unsubscribe();
    }
    if (this.dragEnded && !this.dragEnded.closed) {
      this.dragEnded.unsubscribe();
    }
  }
}
