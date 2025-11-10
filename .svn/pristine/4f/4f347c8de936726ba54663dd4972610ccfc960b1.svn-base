import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';

/**
 * 履歴レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMHistoryRendererComponent
 *
 */
@Component({
    selector: 'eim-history-renderer',
    template: `
    <div class="eim-history-renderer">
    	<div style="display: flex; justify-content: flex-end; height: 100%; align-items: center;">{{value}}</div>
    </div>
    `,
    styles: [`
			::ng-deep .eim-history-renderer {
				height: 100%;
				width: 100%;
				position: relative;
			}
		`],
    standalone: false
})
export class EIMHistoryRendererComponent implements AgRendererComponent {
	private params: any;
	public value: string;

	/**
	 * コンストラクタです.
	 */
	constructor(private historyRendererComponentService: EIMHistoryRendererComponentService) {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.value = this.historyRendererComponentService.getValue(params);
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
