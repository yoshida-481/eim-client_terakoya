import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * 承認依頼先レンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMApproverRendererComponentService {

	/** 削除イベントエミッタ */
	@Output() deleted: EventEmitter<any> = new EventEmitter<any>();
	/** ダブルクリックイベントエミッタ */
	@Output() doubleClicked: EventEmitter<any> = new EventEmitter<any>();
	/** 承認選択条件変更イベントエミッタ */
	@Output() changed: EventEmitter<any> = new EventEmitter<any>();
	/** 承認選択条件変更イベントエミッタ */
	@Output() approverSelectableChanged: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	/**
	 * アイテム削除イベントを発火します.
	 * @param documentId 削除対象のドキュメントID
	 * @param entryId 削除対象承認者のユーザID
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

	/**
	 * 承認者変更時イベントを発火します.
	 * @param noApprover 承認者不要フラグ
	 */
	public approverChanged(noApprover: boolean): void {
		let params: any = {noApprover: noApprover};
		return this.approverSelectableChanged.emit(params);
	}
}
