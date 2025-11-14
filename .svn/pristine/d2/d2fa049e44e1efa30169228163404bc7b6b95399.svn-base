import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMDateService } from 'app/shared/services/date.service';

/**
 * 日時レンダラーコンポーネント
 */
@Injectable()
export class EIMDateRendererComponentService {

	public valueGetter: (params: any) => string;

	constructor(
			protected dateService: EIMDateService,
	) {
		this.valueGetter = (params: any) => {
			let value = '';
			let field: string = params.colDef.field;
			value = this.getLabel(params.data[field]);
			return value;
		}
	}

	public getLabel(data): string {
		let date: any;
		if (data) {
			if (String(data).length == 10) {
				if(data.match(/^\d{4}\-\d{1,2}\-\d{1,2}$/) || data.match(/^\d{1,2}\-\d{1,2}\-\d{4}$/)){
					return data;
				} 

				// 10桁の場合は13桁にする(主に文書管理の場合)
				date = data * 1000;
			} else {
				// 帳票管理の場合
				date = data;
			}
		}

		return this.dateService.getDateString(new Date(date));
	}

}
