import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMAttrTreeService } from 'app/admins/shared/services/apis/attributeTreeView.service' ;
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

/**
 * 属性選択コンポーネントサービス
 */
@Injectable()
export class EIMAttributeSingleSelectorComponentService extends EIMDataGridSingleSelectorComponentService {

	/**
	 * コンストラクタです.
	 * @param messageService メッセージサービス
	 * @param translateService 翻訳サービス
	 * @param adminAttributeService 属性サービス
	 * @param attrTreeService 属性ツリービューサービス
	 */
	constructor(
			protected messageService: EIMMessageService,
  		protected translateService: TranslateService,
			protected adminAttributeService: EIMAdminAttributeService,
			protected attrTreeService: EIMAttrTreeService,
	) {
		super(translateService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 検索します.
	 * @param info データグリッドコンポーネント情報
	 * @param condition 検索条件
	 */
	public search(info: EIMDataGridSingleSelectorComponentInfo, condition: any): void {
		// 属性名の曖昧検索条件
		let searchCond: string = '*' + condition.attributeName + '*';
		function compare(a: any, b: any) {
			let comparison = 0;
			if (a.attTypeName < b.attTypeName) {
				comparison = -1;
			}
			if (a.attTypeName > b.attTypeName) {
				comparison = 1;
			}
			return comparison;
		}

		// 呼出し元が属性ツリービューの場合
		if (condition.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT &&
				condition.attrTreeFlag === true) {
			this.attrTreeService.postAttributeTypeList(searchCond)
				.subscribe(
					(attributeTypes: EIMAttributeTypeDTO[]) => {
						if (attributeTypes.length === 0) {
							this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
						}
						// 一覧表示内容変更
						attributeTypes.sort(compare);
						info.dataGrid.setData(attributeTypes);
					}
				);
		// 呼出し元が属性ツリービュー以外の場合
		} else {
			this.adminAttributeService.getListByName(searchCond, condition.relationFlag, condition.documentTypeFlag)
			.subscribe(
					(attributeTypes: EIMAttributeTypeDTO[]) => {
						if (attributeTypes.length === 0) {
							this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
						}
						// 一覧表示内容変更
						attributeTypes.sort(compare);
						info.dataGrid.setData(attributeTypes);
					}
			);
		}
	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return (a.attTypeId === b.attTypeId);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
