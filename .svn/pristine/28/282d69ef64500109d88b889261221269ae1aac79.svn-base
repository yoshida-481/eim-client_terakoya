import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * デフォルトレンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMDefaultRendererComponent
 *
 */
@Component({
    selector: 'eim-default-renderer',
    template: `
    <div class="eim-default-renderer">
    	<div class="eim-default-renderer-string">{{label}}</div>
    </div>
    `,
    styles: [`
			.eim-default-renderer {
				height: 100%;
				width: 100%;
				display: table;
			}
			::ng-deep .eim-default-renderer-string {
				display: table-cell;
				vertical-align: middle;
				width: 100%;
			}
		`],
    standalone: false
})
export class EIMDefaultRendererComponent implements AgRendererComponent {
	private params: any;
	public label: string;

	/**
	 * コンストラクタ
	 */
	constructor(

	) {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = this.getLabel(params.data, params.colDef.field);
	}

	/**
	 * セルの表示内容を更新します.(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return agGridがセルを更新（ngInitを実行）する必要がある場合false、そうでない場合true
	 */
	refresh(params: any): boolean {
		// agGridがセルを更新（ngInitを実行）する必要がある場合false、自前でラベル編集を更新する場合true
		return false;
	}

	/**
	 * ラベルを取得します.配列指定は未対応です.
	 * @param data データ
	 * @param field フィールド名
	 * @return ラベル
	 */
	getLabel(data, field: string): string {
		let targetData = data;

		let fields: string[] = field.split('.');
		for (let i = 0; i < fields.length; i++) {
			targetData = targetData[fields[i]];
			if (targetData === null || targetData === undefined) {
				return '';
			}
		}

		return Array.isArray(targetData) ? targetData.join('|') : targetData;
	}
}
