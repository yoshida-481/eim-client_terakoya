import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * ユーザーアイコンレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMUserIconRendererComponent
 */
@Component({
    selector: 'eim-user-icon-renderer',
    template: `
	<div style="height: 100%; display: flex; align-items: center;">
	<span class="fa {{icon}}" style="padding-left:3px; padding-right:3px;"></span>
	<span style="padding-left:3px; padding-right:3px;">{{this.params.data[this.field]}}</span>
</div>
	`,
    standalone: false
})
export class EIMUserIconRendererComponent implements AgRendererComponent {

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
		protected translateService: TranslateService,
	) {}

	agInit(params: any): void {
		this.params = params;
		this.field = params.colDef.field;
		this.icon = this.getIcon(params.data);
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
	public getIcon(data: any): string {
		if (data.entryTypeName === this.translateService.instant('EIM.LABEL_02017')) {
			if (data.addedDataFlag) {
				return 'fa fa-user-plus';
			} else {
				return 'eim-icon-user';
			}
		} else if (data.entryTypeName === this.translateService.instant('EIM.LABEL_02055')) {
			if (data.addedDataFlag) {
				return 'fa fa-plus-circle';
			} else {
				return 'fa fa-check-circle';
			}
		}
	}
}
