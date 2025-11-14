import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * チェックボックスレンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMWorkflowMailMethodListComponentService {

	/** ステータス変更イベントエミッタ */
	@Output() changed: EventEmitter<any> = new EventEmitter<any>();

	constructor(
	) {
	}


	/**
	 * ステータス変更エミッタをエミットします.
	 * @param data 変更対象データ
	 */
	public checkChanged(data: any): void {
		this.changed.emit(data);
	 }
}
