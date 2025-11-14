import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

/**
 * データ型レンダラーコンポーネントサービス
 */
@Injectable()
export class EIMValueTypeRendererComponentService {

	public valueGetter: (params: any) => string;

	public valueFormatter: (params: any) => string;

	constructor(
		protected translateService: TranslateService,
	) {

		let func: (params: any) => string = (params: any): string => {
			let value = '';
			value = this.getLabel(params.data);
			return value;
		};

		this.valueGetter = func;
		this.valueFormatter = func;
	}

	public getLabel(data): string {
		let label = '';
		let valueTypeId: number = Number(data.attValTypeId);

		switch (valueTypeId) {
			case 1:
				label = this.translateService.instant('EIM.VALUETYPE.LONG');
				break;
			case 2:
				label = this.translateService.instant('EIM.VALUETYPE.STRING');
				break;
			case 3:
				label = this.translateService.instant('EIM.VALUETYPE.DATE');
				break;
			case 4:
				label = this.translateService.instant('EIM.VALUETYPE.TEXT');
				break;
			case 5:
				label = this.translateService.instant('EIM.VALUETYPE.DOUBLE');
				break;
			case 6:
				label = this.translateService.instant('EIM.VALUETYPE.OBJECT');
				break;
			case 7:
				label = this.translateService.instant('EIM.VALUETYPE.USER');
				break;
			case 8:
				label = this.translateService.instant('EIM.VALUETYPE.CODE');
				break;
		}

		return label;
	}
}
