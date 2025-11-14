import { Injector, StaticProvider } from '@angular/core';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';


/**
 * リレーションタイプドメイン
 */
export class EIMRelationTypeDomain {
	/** 属性タイプ一覧 */
	public attributeTypeList: EIMAttributeTypeDomain[] = [];

	/** リレーションタイプID */
	public id  = 0;

	/** リレーションタイプ定義名称 */
	public definitionName: string = null;

	// revisionUp
	// mutual

	/** リレーションタイプ名 */
	public name: string = null;

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
		this.attributeTypeList = domainService.createObjectList(json.attributeTypeList,
			(_json: any) => {
				return new EIMAttributeTypeDomain(_json);
			});
		this.name = json.name;
		this.id = Number(json.id);
		this.definitionName = json.definitionName;
		this.name = json.name;
	}
}
