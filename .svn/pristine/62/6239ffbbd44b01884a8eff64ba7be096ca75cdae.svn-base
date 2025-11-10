import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * 属性タイプ名称レンダラーコンポーネント
 * @example
 *
 *      <eim-format-name-renderer>
 *      </eim-format-name-renderer>
 */
@Component({
    selector: 'eim-format-name-renderer',
    template: `
		<div style="height: 100%; display: flex; align-items: center;">
		<i class="fa fa-fw eim-icon-format" style="padding-left:3px; padding-right:3px;"></i>
		<label [ngClass]="{'eim-form-label': true}">{{label}}</label>
		</div>
    `,
    standalone: false
})
export class EIMFormatNameRendererComponent implements AgRendererComponent {
	public params: any;
	public label: string;

	constructor() {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = params.value;
		if ((params.data.def === true) || (params.data.def === 'true')) {
			this.label += ' [default]'
		}
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
