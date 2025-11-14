import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';

/**
 * 日時レンダラーコンポーネント
 * @example
 *
 *      <eim-date-time-renderer>
 *      </eim-date-time-renderer>
 */
@Component({
    selector: 'eim-date-time-renderer',
    template: `
    <div class="eim-date-time-renderer">
    	<div style="width: 100%; display: table-cell; vertical-align: middle;">{{dateTimeString}}</div>
    </div>
    `,
    styles: [`
			::ng-deep .eim-date-time-renderer {
				height: 100%;
				width: 100%;
				display: table;
			}
		`],
    standalone: false
})
export class EIMDateTimeRendererComponent implements AgRendererComponent {
	private params: any;
	public dateTimeString: string;

	constructor(
			protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
	) {}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		let field: string = params.colDef.field;
		this.dateTimeString = this.dateTimeRendererComponentService.getLabel(this.params.data[field]);
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
