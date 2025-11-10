import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectTypeDomain } from './object-type.domain';
import { EIMAttributeDomain } from './attribute.domain';
import { EIMEventTypeDomain } from './event-type.domain';
import { EIMUserDomain } from './user.domain';
import { EIMSecurityDomain } from './security.domain';
import { EIMStatusTypeDomain } from './status-type.domain';

/**
 * ワークフロードメイン
 */
export class EIMWorkflowDomain {

	/** ワークフローID */
	public id = 0;

	/** ワークフロー定義名称 */
	public definitionName: string = null;

	/** ステータスタイプリスト */
	public statusTypeList: EIMStatusTypeDomain[] = [];

	/** イベントタイプタイプリスト */
	public eventTypeList: EIMEventTypeDomain[] = [];

	/** ワークフロー名称一覧 */
// private List<OtherNameDomain> nameList = new ArrayList<OtherNameDomain>();
	/** ワークフロー名 */
	public name: string = null;


	/** リビジョン番号 */
	public revision = 0;

	/** リビジョングループID */
	public revisionGroupId = 0;

	/** 作成日時 */
	public creationDate: Date = null;

	/** 更新日時 */
	public modificationDate: Date = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.definitionName = json.definitionName;
		this.statusTypeList = domainService.createObjectList(json.statusTypeList,
				(_json: any) => {
					return new EIMStatusTypeDomain(_json);
				});
		this.eventTypeList = domainService.createObjectList(json.eventTypeList,
				(_json: any) => {
					return new EIMEventTypeDomain(_json);
				});
		this.name = json.name;
		this.revision = json.revision;
		this.revisionGroupId = json.revisionGroupId;

		this.creationDate = domainService.createObject(json.creationDate,
				(_json: any) => {
					return domainService.convertDate(_json);
				});
		this.modificationDate = domainService.createObject(json.modificationDate,
				(_json: any) => {
					return domainService.convertDate(_json);
				});
	}
}
