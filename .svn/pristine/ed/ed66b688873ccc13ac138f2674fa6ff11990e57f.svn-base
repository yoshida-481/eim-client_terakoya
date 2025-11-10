import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';


export class EIMInputRendererComponentParam {
	/** バリデート関数リスト */
	validateFunctions?: [(params: any) => boolean];
}

/**
 * 入力レンダラーコンポーネント
 * 継承して使用すること
 */
@Component({
	template: ``
})
export class EIMInputRendererComponent implements AgRendererComponent {

	/** バリデータ関数 */
	protected validateFunction: (params: any) => boolean;

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {

		this.validateFunction = params?.colDef?.cellRendererParams?.validateFunction ?? null;
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * 入力値を検証します.
	 * 
	 * @param params レンダラパラメータ
	 * @returns 検証結果が正しければtrue
	 */
	protected validate(params: any): boolean {

		if (!this.validateFunction) {
			return true;
		}

		return this.validateFunction(params);

	}
}
