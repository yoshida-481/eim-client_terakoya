import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * 非活性化あり名称レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMDisabledNameRendererComponent
 *
 */
@Component({
    selector: 'eim-disabled-name-renderer',
    template: `
		<div style="height: 100%; display: flex; align-items: center;">
			<span *ngIf="!disable">{{params.value}}</span>
			<span *ngIf="disable" style="color: #BBBBBB;">{{params.value}}</span>
		</div>
    `,
    standalone: false
})
export class EIMDisabledNameRendererComponent implements AgRendererComponent {
	public params: any;
	public disable = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.disable = params.data.disable;
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
