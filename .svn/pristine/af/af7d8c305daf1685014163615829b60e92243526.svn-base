import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * フォーマットアイコンレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMFormatIconRendererComponent
 */
@Component({
    selector: 'eim-format-icon-renderer',
    template: `
	<div style="height: 100%; display: flex; align-items: center;">
	<span class="fa {{icon}}" style="padding-left:3px; padding-right:3px;"></span>
	<span style="padding-left:3px; padding-right:3px;">{{this.params.data[this.field]}}</span>
</div>
	`,
    standalone: false
})
export class EIMFormatIconRendererComponent implements AgRendererComponent {

	/** パラメータ */
	public params: any;

	/** フィールド名 */
	public field: string;

	/** アイコン */
	public icon: string;

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {}

	agInit(params: any): void {
		this.params = params;
		this.field = params.colDef.field;
		this.icon = this.getIcon();
	}

		/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}
		/**
	 * アイコンを取得する.
	 * @param value オブジェクト名称
	 * @return アイコンクラス
	 */
	public getIcon(): string {
		return 'eim-icon-format';
	}
}
