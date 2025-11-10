import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';


/**
 * チェックレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMCheckRendererComponent
 */
@Component({
    selector: 'eim-check-renderer',
    template: `
		<div *ngIf="check" align="center" style="height: 100%; display: flex; align-items: center;" >
			<i class="fa fa-lg fa-check" style="margin: auto;"></i>
		</div>
		`,
    standalone: false
})
export class EIMCheckRendererComponent implements AgRendererComponent {

	/** 真偽 */
	public check: boolean;

	/**
	 * コンストラクタです.
	 */
	constructor() {}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.check = params.value;
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}
}
