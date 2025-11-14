import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * 公開通知先選択レンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMPublicDestinationRendererComponentService {

	/** 削除イベントエミッタ */
	@Output() deleted: EventEmitter<any> = new EventEmitter<any>();
	/** ダブルクリックイベントエミッタ */
	@Output() doubleClicked: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	/**
	 * アイテム削除イベントを発火します.
	 */
	public deleteItem(documentId: number, entryId: number): void {
		let params: any = {documentId: documentId, entryId: entryId};
		return this.deleted.emit(params);
	}

	/**
	 * アイテムダブルクリックイベントを発火します.
	 */
	public doubleClickItem(): void {
		return this.doubleClicked.emit();
	}
}
