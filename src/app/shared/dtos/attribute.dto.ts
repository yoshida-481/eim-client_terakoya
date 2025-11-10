import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';

import { EIMAttributeTypeDTO } from './attribute-type.dto';

/**
 * 属性DTO
 */
export class EIMAttributeDTO {

	/** 属性タイプ */
	public attributeType: EIMAttributeTypeDTO = null;

	/** 属性値 */
	public valueList: any[] = [];

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.attributeType = new EIMAttributeTypeDTO(json.attributeType);
		if (json.valueList) {
			this.valueList = json.valueList;
		} else if (json instanceof EIMAttributeDomain) {
			this.valueList = json.getValueList();
		}

	}
}
