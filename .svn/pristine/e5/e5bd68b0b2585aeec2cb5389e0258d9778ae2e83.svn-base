import { EventEmitter, Injectable, NgZone, Output, Directive } from '@angular/core';

/**
 * 場所レンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMPlaceRendererComponentService {

	clicked$: (objId: any) => void;

	/** 場所クリックイベントエミッタ */
	@Output() placeClicked: EventEmitter<any>;

	constructor(
		private ngZone: NgZone,
	) {
		this.placeClicked = new EventEmitter<any>();
	}

	/**
	 * クリックエミッタを設定します.
	 * @param clicked エミッタ
	 */
	public setClicked(clicked: (objId: any) => void): void {
		this.clicked$ = clicked;
	}

	/**
	 * クリックエミッタをエミットします.
	 * @param objId オブジェクトID
	 */
	public clicked(data: any): void {
		if (this.clicked$) {
			this.clicked$(data);
		}
		if (this.placeClicked) {
			this.ngZone.run(() => this.placeClicked.emit(data));
		}
	}

}
