import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * オブジェクトタイプ入力レンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMObjectTypeInputRendererComponentService {

	/** ステータス変更イベントエミッタ */
	@Output() changed: EventEmitter<any> = new EventEmitter<any>();

	constructor(
	) {
	}

	/**
	 * 変更エミッタをエミットします.
	 * @param data 変更対象データ
	 */
	public checkChanged(data: any): void {
		this.changed.emit();
	}
}
