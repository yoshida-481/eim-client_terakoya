import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMAttributeDTO } from 'app/shared/dtos/attribute.dto';
import { EIMAttributeTypeDTO } from 'app/shared/dtos/attribute-type.dto';
import { EIMFormsConstantService } from 'app/forms/shared/services/forms-constant.service';


/**
 * 属性レンダラーコンポーネントサービス
 */
@Injectable()
export class EIMFormAttributeRendererComponentService {
	
	public valueGetter: (params: any) => string;
	
	constructor(
		protected translateService: TranslateService,
		
	) {
		this.valueGetter = (params: any) => {
			let value: string = '';
			value = this.getLabel(params);
			return value;
		}
	}
	
	public getLabel(params: any): string {
		let label: string = '';
		
		let attribute: EIMAttributeDTO = params.data[params.colDef.field];
		if (!attribute) {
			return label;
		}
		
		let valueList: any[] = attribute.valueList;
		if (attribute.attributeType.multiple) {
			label = valueList.join('|');
		} else {
			label = valueList[0]
		}
		
		// データ型がテキスト型の場合、対象タグを空に置換する
		if (attribute.attributeType.valueType === 'TEXT') {
			label = label.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
		}

		return label;
	}
	
}
