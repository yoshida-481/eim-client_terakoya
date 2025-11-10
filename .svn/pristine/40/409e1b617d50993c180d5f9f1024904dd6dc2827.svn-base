import {Component, OnDestroy} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {AgRendererComponent} from 'ag-grid-angular';

import { EIMValueTypeRendererComponentService } from 'app/shared/components/renderer/value-type-renderer.component.service';

/**
 * データ型レンダラーコンポーネント
 * @example
 * 		cellRendererFramework: EIMValueTypeRendererComponent
 */
@Component({
    selector: 'eim-value-type-renderer',
    template: `
    {{label}}
    `,
    standalone: false
})
export class EIMValueTypeRendererComponent implements AgRendererComponent {
	public params: any;
	public label: string;

	constructor(private valueTypeRendererComponentService: EIMValueTypeRendererComponentService) {

	}

	agInit(params: any): void {
		this.params = params;
		this.label = this.valueTypeRendererComponentService.getLabel(this.params.data);
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

}
