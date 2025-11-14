import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

/**
 * 属性レンダラーコンポーネントサービス
 */
@Injectable()
export class EIMAttributeRendererComponentService {

	public valueGetter: (params: any) => string;

	constructor(
		protected translateService: TranslateService,

	) {
		this.valueGetter = (params: any) => {
			let value = '';
			value = this.getLabel(params);
			return value;
		}
	}

	public getLabel(params: any): string {
		let label = '';

		let value: any = params.data[params.colDef.field];
		if (params.colDef.field.indexOf('multivalue') > -1) {
			let values: any[] = params.data[params.colDef.field];
			if (values) {
				label = values.join('|');
			}
		} else {
			if (params.colDef.headerName === this.translateService.instant('EIM_DOCUMENTS.LABEL_03126')) {
				label = params.data['objId'];
			} else {
				label = params.data[params.colDef.field];
			}
		}
		return label;
	}
}
