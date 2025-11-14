import {Component, OnDestroy} from '@angular/core';
import {DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {AgRendererComponent} from 'ag-grid-angular';

import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';

/**
 * ステータスレンダラーコンポーネント
 * @example
 * 		cellRendererFramework: EIMTypePathRendererComponent
 */
@Component({
    selector: 'eim-type-path-renderer',
    template: `
		<div style="height: 100%; display: flex; align-items: center;">
			{{label}}
    </div>
    `,
    standalone: false
})
export class EIMTypePathRendererComponent implements AgRendererComponent {
	private params: any;
	public label: string;

	constructor() {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = this.addParentName(this.params.data);
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

	private addParentName(node: EIMHierarchicalObjectTypeDomain): any {
		// 最上位タイプは名称を記載しない
		if (node.parent !== null && node.parent.parent !== null) {
			return  this.addParentName(node.parent) + node.parent.name + '/';
		}
		return '/';
	}
}
