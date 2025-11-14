import { Injector, StaticProvider } from '@angular/core';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMRelationTypeDomain } from 'app/shared/domains/entity/relation-type.domain';


/**
 * リレーションドメイン
 */
export class EIMRelationDomain {

	/** リレーション属性一覧 */
	public attributeList: EIMAttributeDomain[] = [];

	/** 子オブジェクト */
	public child: EIMObjectDomain = null;

	/** リレーションID */
	public id  = 0;

	/** 親オブジェクト */
	public parent: EIMObjectDomain = null;

	/** リレーションタイプ */
	public type: EIMRelationTypeDomain = null;

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

		this.attributeList = domainService.createObjectList(json.attributeList,
			(_json: any) => {
				return new EIMAttributeDomain(_json);
			});
		this.child = domainService.createObject(json.child,
			(_json: any) => {
				return new EIMObjectDomain(_json);
			});
		this.id = json.id;
		this.parent = domainService.createObject(json.parent,
			(_json: any) => {
				return new EIMObjectDomain(_json);
			});
		this.type = domainService.createObject(json.type,
			(_json: any) => {
				return new EIMRelationTypeDomain(_json);
			});
	}
}
