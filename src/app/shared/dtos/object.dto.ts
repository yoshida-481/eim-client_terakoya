import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeDTO } from './attribute.dto';
import { EIMUserDTO } from './user.dto';

/**
 * オブジェクトDTO
 */
export class EIMObjectDTO {

	/** 属性リスト */
	public attributeList: EIMAttributeDTO[] = [];

	/** 作成ユーザ */
	// public creationUser: EIMUserDTO = null;
	public creationUserName: string = null;

	/** 作成日 */
	public creationDate: Date = null;

	/** オブジェクトID */
	public id = 0;

	/** 最新履歴フラグ */
	public latest = false;

	/** ロックユーザ */
	// public lockUser: EIMUserDTO = null;
	public lockUserName: string = null;

	/** ロック日 */
	public lockDate: Date = null;

	/** 更新ユーザ */
	// public modificationUser: EIMUserDTO = null;
	public modificationUserName: string = null;

	/** 更新日 */
	public modificationDate: Date = null;

	/** オブジェクト名 */
	public name: string = null;

	/** オブジェクトタイプ */
// public ObjectTypeDomain type = null;

	/** リビジョン番号 */
	public revision = 0;

	/** セキュリティ */
// public SecurityDomain security = null;

	/** ステータス */
// public StatusDomain status = null;

	/** リビジョングループID */
	public revisionGroupId = 0;

	/** ステータスリスト */
// public List<StatusDomain> statusList = new ArrayList<StatusDomain>();

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		// this.creationUser = new EIMUserDTO(json.creationUser);
		this.creationUserName = json.creationUserName;
		this.creationDate = json.creationDate;
		this.id = Number(json.id);
		this.latest = json.latest == 'true' ? true : false;
		// this.lockUser = new EIMUserDTO(json.lockUser);
		this.lockUserName = json.lockUserName;
		// this.lockDate = json.lockDate;
		// this.modificationUser = new EIMUserDTO(json.modificationUser);
		this.modificationUserName = json.modificationUserName;
		this.modificationDate = json.modificationDate;
		this.name = json.name;
		this.revision = Number(json.revision);
		this.revisionGroupId = Number(json.revisionGroupId);
		this.attributeList = domainService.createObjectList(json.attributeList, (res: any) => {return new EIMAttributeDTO(res); });
	}
}
