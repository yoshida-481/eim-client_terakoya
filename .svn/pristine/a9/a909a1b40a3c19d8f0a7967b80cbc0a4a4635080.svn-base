import {Component, OnDestroy} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {AgRendererComponent} from 'ag-grid-angular';

import { EIMStatusRendererComponentService } from 'app/documents/shared/components/renderer/status-renderer.component.service';

/**
 * ステータスレンダラーコンポーネント
 * @example
 * 		cellRendererFramework: EIMStatusRendererComponent
 */
@Component({
    selector: 'eim-status-renderer',
    template: `
    <div style="height: 100%; display: flex; align-items: center;">
    	<i *ngIf="icon" class="fa {{icon}}" style="padding-left:3px; padding-right:3px;"></i>{{label}}
    </div>
    `,
    standalone: false
})
export class EIMStatusRendererComponent implements AgRendererComponent {
	private params: any;
	public icon: string;
	public label: string;

	constructor(private statusRendererComponentService: EIMStatusRendererComponentService) {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;

		// アイコン決定
		if (this.params.data.lockUserName && this.params.data.lockUserName != '') {
			this.icon = 'eim-icon-lock eim-icon-lock-color';
		} else {

			this.icon = '';
		}

		this.label = this.statusRendererComponentService.getLabel(this.params.data);
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */

	refresh(params: any): boolean {
		this.params = params;
		return false;
	}


}
