import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * チェックインレンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMLumpDocumentsCheckinRendererComponentService {

	/** ステータス変更イベントエミッタ */
	@Output() changed: EventEmitter<any> = new EventEmitter<any>();

	constructor(
	) {
	}

	/**
	 * ステータス変更エミッタをエミットします.
	 */
	public checkChanged(data: any): void {
		this.changed.emit(data);
	 }
}
