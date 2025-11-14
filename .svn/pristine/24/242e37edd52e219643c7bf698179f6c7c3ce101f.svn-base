import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * 属性タイプDTO
 */
export class EIMAttributeTypeDTO {

	/** 属性タイプID */
	public id: number = null;

	/** 属性タイプ名称 */
	public name: string = null;

	/** 属性タイプ定義名称 */
	public definitionName: string = null;

	/** 表示用属性タイプ定義名称 */
	public displayDefinitionName: string = null;

	/** データ型 */
	public valueType: string = null;

	/** 多重度 */
	public multiple = false;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.name = json.name;
		this.definitionName = json.definitionName;
		this.displayDefinitionName = (json.definitionName).slice((json.definitionName).indexOf(':'));
		this.valueType = json.valueType;
		this.multiple = json.multiple;

	}
}
