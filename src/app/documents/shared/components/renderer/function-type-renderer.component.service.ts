import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * 処理レンダラーコンポーネントサービス
 */
@Injectable()
export class EIMFunctionTypeRendererComponentService {

	/** 処理変更イベントエミッタ */
	@Output() changed: EventEmitter<any> = new EventEmitter<any>();

	constructor(
	) {
	}

	/**
	 * 処理変更エミッタをエミットします.
	 */
	public change(data: any): void {
		this.changed.emit(data);
	 }
}
