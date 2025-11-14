import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

/**
 * 属性リストレンダラーコンポーネント
 * @example
 *
 *      <eim-attribute-list-value-renderer>
 *      </eim-attribute-list-value-renderer>
 */
@Component({
    selector: 'eim-attribute-list-value-renderer',
    template: `<div [ngStyle]="style">{{label}}</div>`,
    standalone: false
})

export class EIMAttributeValueListRendererComponent implements AgRendererComponent {
	public params: any;
	public label: string;
	public style;

	constructor() {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = params.data[params.colDef.field];
		if (this.params.data[params.colDef.cellStyle]) {
			this.style = {'background-color': EIMAdminsConstantService.COLOR_HASH + this.params.data[params.colDef.cellStyle],
			'height': '100%', 'display': 'flex', 'align-items': 'center'};
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
