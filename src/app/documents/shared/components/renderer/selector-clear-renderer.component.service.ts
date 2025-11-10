import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

@Directive()
@Injectable()
export class EIMSelectorClearRendererComponentService {

	/** 削除イベントエミッタ */
	@Output() deleted: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	/**
	 * アイテム削除イベントを発火します.
	 */
	public deleteItem(id: number): void {
		return this.deleted.emit(id);
	}
}
