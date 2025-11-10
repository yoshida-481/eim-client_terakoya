import { Injectable, Output } from '@angular/core';

import { EIMAttributeService } from 'app/shared/services/attribute.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';

import { EIMFormDomain } from 'app/shared/domains/form.domain';

/**
 * 帳票ドメインサービス
 */
@Injectable()
export class EIMFormDomainService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected attributeService: EIMAttributeService
	) {
	}

	/**
	 * 帳票ドメインの属性情報（オブジェクト属性、ステータス属性）から空の情報を削除した帳票ドメインを複製して返却します.
	 * また、階層レイアウト設定ありの場合はステータス属性をオブジェクト属性に移動します.
	 * @param form 帳票情報
	 * @return 空の属性情報削除後の帳票情報
	 */
	public excludeNullAttributeList(form: EIMFormDomain): EIMFormDomain {

		// 属性値を複製した帳票情報を取得
		// バインドしている変数に影響を出さないため
		let retForm: EIMFormDomain =  this.cloneForm(form);

		if (this.existsAttributeTypeLayoutConf(retForm)) {
			// 階層レイアウトの場合は、階層内の全属性をform.attributeListに移動
			for (let i = 0; i < retForm.statusList.length; i++) {
				// ステータスの空の属性値を削除
				retForm.statusList[i].attributeList = this.attributeService.excludeNullAttributeList(retForm.statusList[i].attributeList);

				// ステータス属性をオブジェクト属性に移動
				Array.prototype.push.apply(retForm.attributeList, retForm.statusList[i].attributeList);
				retForm.statusList[i].attributeList = null;
			}
			retForm.status.attributeList = null;
		} else {
			// 非階層レイアウトの場合は、statusListのattributeListをstatusのattributeListにコピーする
			for (let i = 0; i < retForm.statusList.length; i++) {
				// ステータスの空の属性値を削除
				retForm.statusList[i].attributeList = this.attributeService.excludeNullAttributeList(retForm.statusList[i].attributeList);

				if (retForm.status.id === retForm.statusList[i].id) {
					retForm.status.attributeList = retForm.statusList[i].attributeList;
				}
			}
		}

		// 複数値属性の設定値から未入力分を削除。
		retForm.attributeList = this.attributeService.excludeNullAttributeList(retForm.attributeList);

		return retForm;
	}

	/**
	 * 属性タイプレイアウト設定されているか判定します.
	 * @param form 帳票
	 * @return 属性タイプレイアウトの場合true
	 */
	public existsAttributeTypeLayoutConf(form: EIMFormDomain): boolean {
		return form.formLayout.isHierarchicalLayout;
	}
	
	/**
	 * 帳票情報を複製して返却します.
	 * @param form 帳票情報
	 * @return 複製した帳票情報（属性情報以外はシャローコピー）
	 */
	private cloneForm(form: EIMFormDomain): EIMFormDomain {
		let retForm: EIMFormDomain = new EIMFormDomain();

		retForm.id = form.id;
		retForm.name = form.name;
		retForm.type = form.type;
		retForm.creationUser = form.creationUser;
		retForm.creationDate = form.creationDate;
		retForm.modificationUser = form.modificationUser;
		retForm.modificationDate = form.modificationDate;
		retForm.lockUser = form.lockUser;
		retForm.lockDate = form.lockDate;
		retForm.latest = form.latest;
		retForm.revision = form.revision;
		retForm.revisionGroupId = form.revisionGroupId;
		retForm.security = form.security;
		retForm.status = this.cloneStatus(form.status);
		retForm.statusList = [];
		for (let i = 0; i < form.statusList.length; i++) {
			retForm.statusList.push(this.cloneStatus(form.statusList[i]));
		}
		retForm.attributeList = form.attributeList.concat();

		retForm.formLayout = form.formLayout;
		retForm.accessRoleTypeList = form.accessRoleTypeList;

		return retForm;
	}
	
	/**
	 * ステータス情報を複製して返却します.
	 * @param status ステータス情報
	 * @return 複製したステータス情報（属性情報以外はシャローコピー）
	 */
	private cloneStatus(status: EIMStatusDomain): EIMStatusDomain {
    // WFなしの場合はstatusは空
    if (status == null) {
      return null;
    }
    
		let retStatus: EIMStatusDomain = new EIMStatusDomain();

		retStatus.id = status.id;
		retStatus.type = status.type;
		retStatus.creationUser = status.creationUser;
		retStatus.creationDate = status.creationDate;
		retStatus.modificationUser = status.modificationUser;
		retStatus.modificationDate = status.modificationDate;
		retStatus.sequence = status.sequence;
		retStatus.assignmentList = status.assignmentList;
		retStatus.attributeList = status.attributeList.concat();
	
		return retStatus;
	}
	

	/**
	 * 属性情報リストを複製して返却します.
	 * @param attributeList 属性情報リスト
	 * @return 複製した属性情報リスト
	 */
	private cloneAttributeList(attributeList: EIMAttributeDomain[]): EIMAttributeDomain[] {
		let retAttributeList: EIMAttributeDomain[] = [];
	
		for (let i = 0; i < attributeList.length; i++) {
			let retAttribute: EIMAttributeDomain = new EIMAttributeDomain();
			
			retAttribute.attributeType = attributeList[i].attributeType;
			retAttribute.setValueList(this.cloneValueList(attributeList[i].getValueList()));
			
			retAttributeList.push(retAttribute);
		}
		return retAttributeList;
	}
	
	/**
	 * 値リスト情報を複製して返却します.
	 * @param valueList 値リスト情報
	 * @return 値リスト情報
	 */
	private cloneValueList(valueList: any[]): any[] {
		let retValueList: any[] = [];
	
		for (let i = 0; i < valueList.length; i++) {
			retValueList.push(valueList[i]);
		}
		
		return retValueList;
	}
}
