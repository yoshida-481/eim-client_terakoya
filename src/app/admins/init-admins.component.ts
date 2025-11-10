import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';

/**
 * システム管理初期表示用コンポーネント
 */
@Component({
    selector: 'eim-init-admins',
    template: '',
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMInitAdminsComponent {

	/**
	 * コンストラクタです.
	 */
	constructor() {}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
	}


	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
	}

}
