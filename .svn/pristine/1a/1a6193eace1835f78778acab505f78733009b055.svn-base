import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeDTO } from './attribute.dto';

/**
 * オブジェクトマスタDTO
 */
export class EIMObjectMasterDTO {

	/** 属性マップ */
	public attributeMap: Map<number, EIMAttributeDTO[]>;

	/** オブジェクトID */
	public id = 0;

	/** オブジェクト名 */
	public name: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.attributeMap = domainService.createObjectMap(json.attributeList,
				(res: any) => {return res.attributeType.id; },
				(res: any) => {return new EIMAttributeDTO(res); }
		);

		this.id = Number(json.id);
		this.name = json.name;

	}
}
