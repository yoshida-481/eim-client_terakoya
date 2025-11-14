import { Component } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';
import { EIMObjectEditorsIconService } from 'app/object-editors/shared/services/object-editors-icon.service';

/**
 * オブジェクト名レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMObjectNameRendererComponent
 */
@Component({
    selector: 'eim-object-name-renderer',
    template: `
		<div style="height: 100%; display: flex; align-items: center;">
    		<span class="fa {{icon}}" style="padding-left:3px; padding-right:3px;"></span>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data[this.field]}}</span>
		</div>
    `,
    standalone: false
})
export class EIMObjectNameRendererComponent implements AgRendererComponent {

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
		protected objectEditorsIconService: EIMObjectEditorsIconService,
	) {}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.field = params.colDef.field;
		this.icon = this.objectEditorsIconService.getIcon(this.params.data.typeName);
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
