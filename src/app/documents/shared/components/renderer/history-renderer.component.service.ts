import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * 履歴レンダラーコンポーネントサービス
 */
@Injectable()
export class EIMHistoryRendererComponentService {

	public valueGetter: (params: any) => string;

	constructor(

	) {
		this.valueGetter = (params: any) => {
			return this.getValue(params);
		}
	}

	public getValue(params: any): string {
		let value: string = null;
		let key: string = params.colDef.field;

		if (params.data) {
			if (params.data[key] == '-') {
				value = '';
			} else {
				value = params.data[key];
			}
		}

		return value;
	}

}
