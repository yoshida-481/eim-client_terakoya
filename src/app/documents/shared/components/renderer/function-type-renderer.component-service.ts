import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * 処理レンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMFunctionTypeRendererComponentService {

	/** 処理欄変更イベントエミッタ */
	@Output() functionTypeSelectableChanged: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	/**
	 * 処理欄変更イベントを発火します.
	 * @param noApprover 承認者不要フラグ
	 */
	public functionTypeChanged(noApprover: boolean): void {
		let params: any = {noApprover: noApprover};
		return this.functionTypeSelectableChanged.emit(params);
	}
}
