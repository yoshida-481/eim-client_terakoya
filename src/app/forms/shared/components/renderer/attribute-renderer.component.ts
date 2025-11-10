import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMFormAttributeRendererComponentService } from 'app/forms/shared/components/renderer/attribute-renderer.component.service';

/**
 * 属性レンダラーコンポーネント
 * @example
 *
 *      <eim-form-attribute-renderer>
 *      </eim-form-attribute-renderer>
 */
@Component({
    selector: 'eim-form-attribute-renderer',
    template: `
    <div pTooltip="{{label}}">{{label}}</div>
    `,
    standalone: false
})
export class EIMFormAttributeRendererComponent implements AgRendererComponent {
	public params: any;
	public label: string;

	constructor(private attributeRendererComponentService: EIMFormAttributeRendererComponentService) {
		
	}
	
	agInit(params: any): void {
		this.params = params;
		this.label = this.attributeRendererComponentService.getLabel(params);
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
