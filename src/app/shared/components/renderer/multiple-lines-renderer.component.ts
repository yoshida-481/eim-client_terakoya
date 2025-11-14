import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';


/**
 * 複数行レンダラーコンポーネント
 * \nで改行して表示します.
 * @example
 *
 *      <eim-multiple-lines-renderer>
 *      </eim-multiple-lines-renderer>
 */
@Component({
    selector: 'eim-multiple-lines-renderer',
    template: `
    <div style="height: 100%; overflow: auto;">
    	<div *ngFor="let row of rows;">{{row}}</div>
    </div>
    `,
    standalone: false
})
export class EIMMultipleLinesRendererComponent implements AgRendererComponent {
	private params: any;
	public rows: string[];

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {}

	/**
	 * 初期化処理
	 * @param params DataGridパラメータ
	 */
	agInit(params: any): void {
		this.params = params;

		let field = params.colDef.field;
		if (params.data[field]) {
			this.rows = params.data[field].split('\n');
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
