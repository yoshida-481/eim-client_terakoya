import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMAttributeRendererComponentService } from 'app/documents/shared/components/renderer/attribute-renderer.component.service';

/**
 * 属性レンダラーコンポーネント
 * @example
 *
 *      <eim-attribute-renderer>
 *      </eim-attribute-renderer>
 */
@Component({
    selector: 'eim-attribute-renderer',
    template: `
    <div pTooltip="{{label}}" [ngStyle]="style">{{label}}</div>
    `,
    standalone: false
})
export class EIMAttributeRendererComponent implements AgRendererComponent {
	public params: any;
	public label: string;
	public style;

	constructor(private attributeRendererComponentService: EIMAttributeRendererComponentService) {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = this.attributeRendererComponentService.getLabel(params);
		if (this.params.data[params.colDef.field + '_color']) {
			this.style = {'background-color': '#' + this.params.data[params.colDef.field + '_color'],
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
