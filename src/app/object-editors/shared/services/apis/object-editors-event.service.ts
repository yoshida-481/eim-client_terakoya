import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMConvertService } from 'app/object-editors/shared/services/convert.service';
import { EIMAttributeService } from 'app/shared/services/attribute.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMEventDomain } from 'app/shared/domains/entity/event.domain';
import { EIMEventTypeDomain } from 'app/shared/domains/entity/event-type.domain';
import { EIMBaseEventTypeDomain } from 'app/shared/domains/entity/base-event-type.domain';
import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';
import { EIMStatusTypeDomain } from 'app/shared/domains/entity/status-type.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * イベントAPIサービス
 */
@Injectable()
export class EIMObjectEditorsEventService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected attributeService: EIMAttributeService,
		protected convertService: EIMConvertService) {}

	/**
	 * イベントを取得します.
	 * @param id イベントID
	 * @return イベントドメイン
	 */
	public getEvent(id) :Observable<EIMEventDomain>{
		return this.httpService.postForForm('/rest/dspAttribute/dspEvtProperty.mvc', {id: id})
			.pipe(map((res: any) => {
				return this.convertEventDomain(res.value);
		}));
	}

	/**
	 * 属性を取得します.
	 * @param id イベントID
	 * @return 属性ドメイン
	 */
	public getAttribute(id) :Observable<EIMAttributeDomain[]>{
		return this.httpService.postForForm('/rest/dspAttribute/dspEvtAttribute.mvc', {id: id})
			.pipe(map((res: any) => {
				return this.convertService.convertAttributeDomainList(res.value.attrList.attribute);
		}));
	}

	/**
	 * イベントを更新します.
	 * @param event イベントドメイン
	 * @param objId オブジェクトID
	 * @return 空のObservable
	 */
	public update(event: EIMEventDomain, objId: number): Observable<null> {
		let param: any = {};
		param.id = event.id;
		param.objId = objId;
		this.convertService.setAttributeRequestParameter(param, this.attributeService.excludeNullAttributeList(event.attributeList));

		return this.httpService.postForForm('/rest/dspAttribute/actUpdateEvtAttribute.mvc', param)
		.pipe(mergeMap((res: any) => {
			return of(null);
		}));
	}

	/**
	 * イベントJSONをイベントドメインに変換して返却します.
	 * @param json JSON
	 * @return イベントドメイン
	 */
	protected convertEventDomain(json: any): EIMEventDomain {
		let event: EIMEventDomain = new EIMEventDomain();

		event.id = Number(json.attr.id);
		event.type = new EIMEventTypeDomain();
		event.type.name = json.attr.typeName;
		event.type.priority = Number(json.attr.seq);
		event.type.base = new EIMBaseEventTypeDomain();
		event.type.base.name = json.attr.baseEventTypeName;
		event.fromStatus = new EIMStatusDomain();
		event.fromStatus.id = Number(json.attr.fromStatusId);
		event.fromStatus.type = new EIMStatusTypeDomain();
		event.fromStatus.type.name = json.attr.fromStatusTypeName;
		event.toStatus = new EIMStatusDomain();
		event.toStatus.id = Number(json.attr.toStatusId);
		event.toStatus.type = new EIMStatusTypeDomain();
		event.toStatus.type.name = json.attr.toStatusTypeName;
		event.creationUser = new EIMUserDomain();
		event.creationUser.name = json.attr.createUserName;
		event.creationDate = json.attr.createDate;

		return event;
	}

}
