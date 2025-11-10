import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMCheckboxRendererComponent } from 'app/shared/components/renderer/checkbox-renderer.component';
/**
 * チェックボックスレンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMCheckboxRendererComponentService {

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
