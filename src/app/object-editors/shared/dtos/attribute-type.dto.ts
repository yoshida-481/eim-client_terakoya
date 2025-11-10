import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';

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

	/** データ型ID */
	public valueTypeId: number = null;

	/** 多重度 */
	public multiple = false;

	/** コード型属性値配列 */
	public codeList: EIMCodeDomain[];

	/** コードタイプID */
	public codeTypeId: number = null;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = Number(json.attr.attTypeId);
		this.name = json.attr.attTypeName;
		this.definitionName = json.attr.attTypeDefName;
		this.valueTypeId = Number(json.attr.valTypeId);
		if (json.attr.multiple) {
			this.multiple = json.attr.multiple === 'true' ? true : false;
		} else {
			this.multiple = json.attr.isMultiple === 'true' ? true : false;
		}

		if (json.codeList && json.codeList.code) {
			this.codeTypeId = Number(json.attr.codeTypeId);
			this.codeList = [];
			for (let i = 0; i < json.codeList.code.length; i++) {
				let code = json.codeList.code[i];
				let codeDomain = new EIMCodeDomain();
				codeDomain.id = code.attr.id;
				codeDomain.name = code.attr.name;
				codeDomain.code = code.attr.value;
				codeDomain.sequence = code.attr.sequence;
				this.codeList.push(codeDomain);
			}
		}
	}
}
