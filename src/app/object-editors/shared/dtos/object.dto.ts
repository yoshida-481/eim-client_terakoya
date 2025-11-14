import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMAttributeTypeDTO } from 'app/object-editors/shared/dtos/attribute-type.dto';

/**
 * オブジェクトDTO
 */
export class EIMObjectDTO {

	/** オブジェクトID */
	public id = 0;

	/** オブジェクト名 */
	public name: string = null;

	/** オブジェクトタイプID */
	public typeId = 0;

	/** オブジェクトタイプ名 */
	public typeName: string = null;

	/** リビジョン番号 */
	public revision = 0;

	/** 最新履歴フラグ */
	public latest = false;

	/** 最新履歴値 */
	public latestNumber = null;

	/** ステータスタイプID */
	public statusTypeId = 0;

	/** ステータスタイプ名 */
	public statusTypeName: string = null;

	/** 作成者 */
	public createUserName: string = null;

	/** 作成日時 */
	public createDate: string = null;

	/** ロック者 */
	public lockUserName: string = null;

	/** ロック日時 */
	public lockDate: string = null;

	/** リレーションID */
	public relId = 0;

	/** リレーションタイプID */
	public relationTypeId = 0;

	/** リレーションタイプ名 */
	public relationTypeName: string = null;

	/** 属性情報 */
	public attributeInfo = {};

	/** 属性値取得用ヘッダー固定文字列 */
	private readonly ATTTYPE = 'attType_'

	/** 属性値取得用フッター固定文字列 */
	private readonly MULTI_VALUE = '_multivalue'

	constructor(json?: any, attrList?: EIMAttributeTypeDTO[]) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = Number(json.attr.objId);
		this.name = json.attr.objName;
		this.typeId = Number(json.attr.objTypeId);
		this.typeName = json.attr.objTypeName;
		this.revision = Number(json.attr.rev);
		this.latest = json.attr.latest === '1' ? true : false;
		this.latestNumber = json.attr.latest === '1' ? 1 : 0;
		this.statusTypeId = Number(json.attr.statusTypeId);
		this.statusTypeName = json.attr.statusTypeName;
		this.createUserName = json.attr.createUserName;
		this.createDate = json.attr.createDate;
		this.lockUserName = json.attr.lockUserName;
		this.lockDate = json.attr.lockDate;
		this.relId = json.attr.relId;
		this.relationTypeId = Number(json.attr.relTypeId);
		this.relationTypeName = json.attr.relTypeName;

		// 属性リストがある場合
		if (attrList) {
			// 属性リスト分ループ
			for (let i = 0; i < attrList.length; i++) {
				let attr = attrList[i];
				let value: any;
				// 複数の場合
				if (attr.multiple) {
					let list = [];
					let multiValue = json[this.ATTTYPE + attr.id + this.MULTI_VALUE];
					if (multiValue) {
						let multiList = multiValue.attValue;
						if (multiList  instanceof Array) {
							for (let j = 0; j < multiList.length; j++) {
								list.push(multiList[j].attr.value);
							}
							value = list.join('|');
						} else {
							value = multiList.attr.value;
						}
					}
				} else {
					value = json.attr[this.ATTTYPE + attr.id]
				}
				this.attributeInfo[this.ATTTYPE + attr.id] = value;
			}
		}
	}
}
