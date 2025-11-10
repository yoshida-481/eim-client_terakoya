import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * タグ名称レンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMTagNameRendererComponentService {

	clicked$: (objId: any) => void;

	/** 場所クリックイベントエミッタ */
	@Output() nameClicked: EventEmitter<any>;

	constructor(
	) {
		this.nameClicked = new EventEmitter<any>();
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
	 * @param data オブジェクトID
	 */
	public clicked(data: any): void {
		if (this.clicked$) {
			this.clicked$(data);
		}
		if (this.nameClicked) {
			this.nameClicked.emit(data);
		}
	}

}
