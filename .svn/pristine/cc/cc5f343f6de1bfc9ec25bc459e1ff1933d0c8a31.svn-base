import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * セキュリティ名称レンダラーコンポーネント
 * @example
 *
 *      <eim-security-name-renderer>
 *      </eim-security-name-renderer>
 */
@Component({
    selector: 'eim-security-name-renderer',
    template: `
		<div style="display: flex; height: 100%; align-items: center;">
		<i class="fa eim-icon-security fa-lg" style="padding-left:3px; padding-right:3px;"></i>
		<label>{{label}}</label>
		</div>
    `,
    standalone: false
})
export class EIMSecurityNameRendererComponent implements AgRendererComponent {
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
