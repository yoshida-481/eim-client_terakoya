import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMStatusTypeDomain } from './status-type.domain';
import { EIMOtherNameDomain } from 'app/admins/shared/domains/other-name.domain';
import { EIMMailTypeDTO } from 'app/admins/shared/dtos/mail-type.dto';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * イベントタイプドメイン
 */
export class EIMEventTypeDomain {
	/** イベントタイプID */
	public id = 0;

	/** シーケンス */
	public sequence: number;

	/** 遷移元ステータスタイプシーケンス */
	public fromStatusTypeSequence: number;

	/** 遷移先ステータスタイプシーケンス */
	public toStatusTypeSequence: number;

	/** 遷移元ステータスタイプID */
	public fromStatusTypeId: number;

	/** 遷移先ステータスタイプID */
	public toStatusTypeId: number;

	/** 継承するベースイベントタイプID */
	public baseEventTypeId = EIMConstantService.EVENT_TYPE_ID_DEFUALT_BASE;

	/** ガード条件ID */
	public guardConditionId = EIMConstantService.GUARD_COND_ID_NOHTING_FORM;

	/** スキップフラグ */
	public skipFlag: boolean;

	/** イベントタイプ名称一覧Map(key: languageId, value: EIMOtherNameDomain) */
	public nameList: any = {};

	/** メールリスト */
	public mailList: any = [];

	/** イベントタイプ名 */
	public name: string = null;


	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		if ( json.attr ) {
			this.id = Number(json.attr.id);
			this.sequence = Number(json.attr.seq);
			this.fromStatusTypeSequence = Number(json.attr.fromStatusTypeSeq);
			this.toStatusTypeSequence = Number(json.attr.toStatusTypeSeq);
			this.fromStatusTypeId = Number(json.attr.fromStatusTypeId);
			this.toStatusTypeId = Number(json.attr.toStatusTypeId);
			this.baseEventTypeId = Number(json.attr.baseEventTypeId);
			this.guardConditionId = Number(json.attr.guardConditionId);
			this.skipFlag = (json.attr.skipFlag === 'true');
		} else {
			this.id = Number(json.id);
			this.sequence = Number(json.seq);
			this.fromStatusTypeSequence = Number(json.fromStatusTypeSeq);
			this.toStatusTypeSequence = Number(json.toStatusTypeSeq);
			this.fromStatusTypeId = Number(json.fromStatusTypeId);
			this.toStatusTypeId = Number(json.toStatusTypeId);
			this.baseEventTypeId = Number(json.baseEventTypeId);
			this.guardConditionId = Number(json.guardConditionId);
			this.skipFlag = (json.skipFlag === 'true');
		}

		if (json.nameList && json.nameList.name) {
			for (let i = 0; i < json.nameList.name.length; i++) {
				let nameJson: any = json.nameList.name[i];
				if ( nameJson.attr ) {
					this.nameList[nameJson.attr.lang] = nameJson.attr.value;
				} else {
					this.nameList[nameJson.lang] = nameJson.value;
				}
			}
		} else {
			this.nameList = json.nameList;
		}

		if (json.mailList && json.mailList.mail) {

			if (Array.isArray(json.mailList.mail)) {
				for (let i = 0; i < json.mailList.mail.length; i++) {
					// let mail = json.mailList.mail[i];
					// if ( mail.attr ) {
					// mail = mail.attr;
					// }
					let mail = new EIMMailTypeDTO(json.mailList.mail[i]);
					this.mailList.push( mail );
				}
			} else {
				// let mail = {};
				// if ( json.mailList.mail.attr ) {
				// 	mail = json.mailList.mail.attr;
				// } else {
				// 	mail = json.mailList.mail;
				// }
				let mail = new EIMMailTypeDTO(json.mailList.mail);
				this.mailList.push( mail );
			}


		}
		if ( json.nameList && json.nameList.name ) {
			this.name = domainService.getName(json.nameList.name);
		} else {
			this.name = json.name;
		}
	}
}
