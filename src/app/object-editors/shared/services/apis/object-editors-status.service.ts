import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMConvertService } from 'app/object-editors/shared/services/convert.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';
import { EIMStatusTypeDomain } from 'app/shared/domains/entity/status-type.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMBaseStatusTypeDomain } from 'app/shared/domains/entity/base-status-type.domain';
import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * ステータスAPIサービス
 */
@Injectable()
export class EIMObjectEditorsStatusService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected domainService: EIMDomainService,
		protected attributeService: EIMAttributeService,
		protected convertService: EIMConvertService) {}

	/**
	 * ステータスを取得します.
	 * @param id
	 * @return ステータスドメイン
	 */
	public getStatus(id: number): Observable<EIMStatusDomain> {
		return this.httpService.postForForm('/rest/dspAttribute/dspStsProperty.mvc', {id: id})
			.pipe(map((res: any) => {
				return this.convertStatusDomain(res.value);
		}));
	}

	/**
	 * 属性を取得します.
	 * @param id
	 * @return 属性ドメイン
	 */
	public getAttribute(id: number): Observable<EIMAttributeDomain[]> {
		return this.httpService.postForForm('/rest/dspAttribute/dspStsAttribute.mvc', {id: id})
			.pipe(map((res: any) => {
				return this.convertService.convertAttributeDomainList(res.value.attrList);
		}));
	}

	/**
	 * ステータスを更新します.
	 * @param status ステータスドメイン
	 * @param objId オブジェクトID
	 * @return 空のObservable
	 */
	public update(status: EIMStatusDomain, objId: number): Observable<null> {
		let param: any = {};
		param.id = status.id;
		param.objId = objId;
		this.convertService.setAttributeRequestParameter(param, this.attributeService.excludeNullAttributeList(status.attributeList));

		return this.httpService.postForForm('/rest/dspAttribute/actUpdateStsAttribute.mvc', param)
		.pipe(mergeMap((res: any) => {
			return of(null);
		}));
	}

	/**
	 * ステータスJSONをステータスドメインに変換して返却します.
	 * @param json JSON
	 * @return ステータスドメイン
	 */
	protected convertStatusDomain(json: any): EIMStatusDomain {
		let status: EIMStatusDomain = new EIMStatusDomain();

		status.id = Number(json.attr.id);
		status.type = new EIMStatusTypeDomain();
		status.type.id = json.attr.stsTypeId;
		status.type.name = json.attr.typeName;
		status.type.base = new EIMBaseStatusTypeDomain();
		status.type.base.name = json.attr.kindName;
		status.type.sequence = Number(json.attr.seq);
		status.creationUser = new EIMUserDomain();
		status.creationUser.name = json.attr.createUserName;
		status.creationDate = json.attr.createDate;
		status.modificationUser = new EIMUserDomain();
		status.modificationUser.name = json.attr.modifyUserName;
		status.modificationDate = json.attr.modifyDate;

		return status;
	}
}
