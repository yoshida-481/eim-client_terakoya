import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * 遷移先ステータスレンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMTransitionDestinationRendererComponentService {

	/** ステータス変更イベントエミッタ */
	@Output() statusChanged: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	/**
	 * ステータス変更イベントを発火します.
	 */
	public changed(): void {
		return this.statusChanged.emit();
	}
}
