import { Component, OnDestroy, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * ツールチップレンダラーコンポーネント
 * @example
 * 	cellRendererFramework:EIMTooltipRendererComponent
 */
@Component({
    selector: 'eim-tooltip-renderer',
    template: `
		<label pTooltip="{{params.value}}" style="display: block; width: 100%;">{{params.value}}</label>
		`,
    standalone: false
})
export class EIMTooltipRendererComponent implements AgRendererComponent {

	/** パラメータ */
	public params: any;

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
