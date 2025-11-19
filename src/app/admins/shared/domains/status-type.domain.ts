import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMOtherNameDomain } from 'app/admins/shared/domains/other-name.domain';
import { TranslateService } from '@ngx-translate/core';
import { EIMConstantService } from 'app/shared/services/constant.service';

// import { EIMOtherNameDomain } from './other-name.domain';

/**
 * ステータスタイプドメイン
 */
export class EIMStatusTypeDomain {

	/** ステータスタイプID */
	public id = 0;

	/** ステータスタイプの並び順 */
	public seq = 0;

	/** ステータスタイプ種別 */
	public kind = EIMConstantService.STATUS_TYPE_KIND_DEFUALT;

	/** アサイン自動 */
	public auto = 'true';

	/** 通過条件 */
	public through = 3;

	/** 承認中のチェックインを許可 */
	public enableCheckIn = false;

	/** 上長のみ表示デフォルト設定 */
	public defBossOnly = false;

	/** アサインエントリー一覧 */
	public asEntryList: any[] = [];

	/** 属性一覧 */
	public attTypeList: any[] = [];

	/** イベント一覧 */
	public eventList: any[] = [];

	/** ステータスタイプ名称Map(key: languageId, value: EIMOtherNameDomain) */
	public nameList: any = {};

	/** ステータスタイプ名称 */
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
			this.seq = Number(json.attr.seq);
			this.kind = Number(json.attr.kind);
			this.auto = json.attr.auto;
			this.through = Number(json.attr.through) ? Number(json.attr.through) : 0;
			this.enableCheckIn = (json.attr.enableCheckIn === 'true');
			this.defBossOnly = (json.attr.defBossOnly === 'true');
		} else {
			this.id = Number(json.id);
			this.seq = Number(json.seq);
			this.kind = Number(json.kind);
			this.auto = json.auto;
			this.through = Number(json.through) ? Number(json.through) : 0;
			this.enableCheckIn = (json.enableCheckIn === 'true');
			this.defBossOnly = (json.defBossOnly === 'true');
		}

		// 名前情報
		if (json.nameList && json.nameList.name) {
			for (let i = 0; i < json.nameList.name.length; i++) {
				let nameJson: any = json.nameList.name[i];
			  if ( nameJson.attr ) {
					// this.nameList[nameJson.attr.lang] = new EIMOtherNameDomain(nameJson);
					this.nameList[nameJson.attr.lang] = nameJson.attr.value;
			  } else {
					// this.nameList[nameJson.lang] = new EIMOtherNameDomain(nameJson);
					this.nameList[nameJson.lang] = nameJson.lang.value;
			  }
			}
			this.name = domainService.getName(json.nameList.name);
		} else {
			this.nameList = json.nameList;
			this.name = domainService.getName(this.nameList);
		}


		// アサインエントリー情報
		if ( json.asEntryList ) {
			let asEntryList = json.asEntryList;
			if (0 !== Object.keys(asEntryList).length) {
				if (Array.isArray(json.asEntryList.asEntry)) {
					for (let i = 0; i < json.asEntryList.asEntry.length; i++) {
						if ( json.asEntryList.asEntry[i].attr ) {
							let asEntry: any = {
									entryId: json.asEntryList.asEntry[i].attr.id,
									entryName: json.asEntryList.asEntry[i].attr.name,
									entryType: json.asEntryList.asEntry[i].attr.type,
							}
							// ユーザーの場合、無効フラグを設定
							if (json.asEntryList.asEntry[i].attr.type === 'USER' || json.asEntryList.asEntry[i].attr.type === '1' || json.asEntryList.asEntry[i].attr.type === 'user') {
								asEntry.entryTypeId = EIMConstantService.ENTRY_TYPE_USER;
								asEntry.typeName = 'user';
								let disable = json.asEntryList.asEntry[i].attr.disable;
								if (disable !== undefined && disable !== null) {
									asEntry.userDisable = (disable === '1' || disable === 1 || disable === 'on') ? 'on' : 'off';
								} else {
									asEntry.userDisable = 'off';
								}
							}
							this.asEntryList.push(asEntry);
						} else {
							let asEntry: any = {
									entryId: Number(json.asEntryList.asEntry[i].id),
									entryName: json.asEntryList.asEntry[i].name,
									entryType: json.asEntryList.asEntry[i].type,
							}
							// ユーザーの場合、無効フラグを設定
							if (json.asEntryList.asEntry[i].type === 'USER' || json.asEntryList.asEntry[i].type === '1' || json.asEntryList.asEntry[i].type === 'user') {
								asEntry.entryTypeId = EIMConstantService.ENTRY_TYPE_USER;
								asEntry.typeName = 'user';
								let disable = json.asEntryList.asEntry[i].disable;
								if (disable !== undefined && disable !== null) {
									asEntry.userDisable = (disable === '1' || disable === 1 || disable === 'on') ? 'on' : 'off';
								} else {
									asEntry.userDisable = 'off';
								}
							}
							this.asEntryList.push(asEntry);
						}
					}
				} else {
					if (json.asEntryList.asEntry && json.asEntryList.asEntry.attr ) {
						let asEntry: any = {
									entryId: Number(json.asEntryList.asEntry.attr.id),
									entryName: json.asEntryList.asEntry.attr.name,
									entryType: json.asEntryList.asEntry.attr.type,
							}
						// ユーザーの場合、無効フラグを設定
						if (json.asEntryList.asEntry.attr.type === 'USER' || json.asEntryList.asEntry.attr.type === '1' || json.asEntryList.asEntry.attr.type === 'user') {
							asEntry.entryTypeId = EIMConstantService.ENTRY_TYPE_USER;
							asEntry.typeName = 'user';
							let disable = json.asEntryList.asEntry.attr.disable;
							if (disable !== undefined && disable !== null) {
								asEntry.userDisable = (disable === '1' || disable === 1 || disable === 'on') ? 'on' : 'off';
							} else {
								asEntry.userDisable = 'off';
							}
						}
						this.asEntryList.push(asEntry);
					} else if (json.asEntryList.asEntry) {
						let asEntry: any = {
								entryId: Number(json.asEntryList.asEntry.id),
								entryName: json.asEntryList.asEntry.name,
								entryType: json.asEntryList.asEntry.type,
						}
						// ユーザーの場合、無効フラグを設定
						if (json.asEntryList.asEntry.type === 'USER' || json.asEntryList.asEntry.type === '1' || json.asEntryList.asEntry.type === 'user') {
							asEntry.entryTypeId = EIMConstantService.ENTRY_TYPE_USER;
							asEntry.typeName = 'user';
							let disable = json.asEntryList.asEntry.disable;
							if (disable !== undefined && disable !== null) {
								asEntry.userDisable = (disable === '1' || disable === 1 || disable === 'on') ? 'on' : 'off';
							} else {
								asEntry.userDisable = 'off';
							}
						}
						this.asEntryList.push(asEntry);

					} else {
						this.asEntryList = json.asEntryList;
					}
				}
			}
		}

		// 属性情報
		if ( json.attTypes ) {
			let attTypes = json.attTypes;
			if (0 !== Object.keys(attTypes).length) {
				if (Array.isArray(json.attTypes.attType)) {
					for (let i = 0; i < json.attTypes.attType.length; i++) {
						// 初期値
						let tmpInitValueList = json.attTypes.attType[i].initValueList;
						let initValueList: any[] = [];
						if ( tmpInitValueList && tmpInitValueList.initValue ) {
							if (Array.isArray(tmpInitValueList.initValue)) {
								for ( let n = 0; n < tmpInitValueList.initValue.length; n++ ) {
									initValueList.push(tmpInitValueList.initValue[n].attr.value);
								}
							} else {
								initValueList.push(tmpInitValueList.initValue.attr.value);
							}
						}

						// ディフォルト値
						let tmpDefValueList = json.attTypes.attType[i].defValueList;
						let defValueList: any[] = [];
						if ( tmpDefValueList && tmpDefValueList.defValue ) {
							if (Array.isArray(tmpDefValueList.defValue)) {
								for ( let n = 0; n < tmpDefValueList.defValue.length; n++ ) {
									defValueList.push(tmpDefValueList.defValue[n].attr.value);
								}
							} else {
								defValueList.push(tmpDefValueList.defValue.attr.value);
							}
						}

						let attType = {
								newCopyFlag: this.toBoolean(json.attTypes.attType[i].attr.newCopyFlag),
								dispOrder: json.attTypes.attType[i].attr.dispOrder,
								attTypeId: Number(json.attTypes.attType[i].attr.attTypeId),
								attTypeName: json.attTypes.attType[i].attr.attTypeName,
								typeName: 'attributeType',
								typeLabel: json.attTypes.attType[i].attr.attTypeName,
								definitionName: json.attTypes.attType[i].attr.definitionName,
								valTypeId: Number(json.attTypes.attType[i].attr.valTypeId),
								valTypeName: json.attTypes.attType[i].attr.valTypeName,
								isMultipleValue: json.attTypes.attType[i].attr.isMultipleValue,
								codeTypeName: json.attTypes.attType[i].attr.codeTypeName,
								uiControlName: json.attTypes.attType[i].attr.uiControlName,
								attTypeEssential: this.toBoolean(json.attTypes.attType[i].attr.attTypeEssential),
								defValueList: json.attTypes.attType[i].defValueList,
								initValueList: initValueList,
								// defValueList: '',
								// initValueList: '',
						}
						this.attTypeList.push(attType);

					}
				} else {
					let attType = {
							newCopyFlag: this.toBoolean(json.attTypes.attType.attr.newCopyFlag),
							dispOrder: json.attTypes.attType.attr.dispOrder,
							attTypeId: Number(json.attTypes.attType.attr.attTypeId),
							attTypeName: json.attTypes.attType.attr.attTypeName,
							typeName: 'attributeType',
							typeLabel: json.attTypes.attType.attr.attTypeName,
							definitionName: json.attTypes.attType.attr.definitionName,
							valTypeId: Number(json.attTypes.attType.attr.valTypeId),
							valTypeName: json.attTypes.attType.attr.valTypeName,
							isMultipleValue: json.attTypes.attType.attr.isMultipleValue,
							codeTypeName: json.attTypes.attType.attr.codeTypeName,
							uiControlName: json.attTypes.attType.attr.uiControlName,
							attTypeEssential: this.toBoolean(json.attTypes.attType.attr.attTypeEssential),
							defValueList: json.attTypes.attType.defValueList,
							initValueList: json.attTypes.attType.initValueList,
							// defValueList: '',
							// initValueList: '',
					}
					this.attTypeList.push(attType);
				}
			}
		}
	}

	private toBoolean(booleanStr: string): boolean {
		// "true"文字列と比較した結果を返す
		// 念のため小文字化しておく
		if ( !booleanStr ) {
			return false;
		}
		return booleanStr.toLowerCase() === 'true';
	}
}
