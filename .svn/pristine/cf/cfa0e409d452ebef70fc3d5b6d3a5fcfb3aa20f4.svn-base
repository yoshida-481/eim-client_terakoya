import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMObjectMasterService } from 'app/shared/services/apis/object-master.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMObjectMasterDTO } from 'app/shared/dtos/object-master.dto';

/**
 * マスタ単数選択コンポーネントサービス
 */
@Injectable()
export class EIMMasterSingleSelectorComponentService extends EIMDataGridSingleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected messageService: EIMMessageService,
  		protected objectMasterService: EIMObjectMasterService,
  		protected translateService: TranslateService,
	) {
		super(translateService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 検索します.
	 * @param info 単体選択データグリッドコンポーネント情報
	 * @param condition 検索条件
	 */
	public search(info: EIMDataGridSingleSelectorComponentInfo, condition: any): void {

		// 検索条件生成
		let criteria: any = {};
		criteria.objectTypeId = condition.objectTypeId;
		criteria.limit = condition.limit;
		criteria.invalidateAttribute = condition.invalidateAttribute;

		let criteriaList: any[] = [];

		let attributeTypeList: EIMAttributeTypeDomain[] = condition.displayDialogAttributeTypeList;
		for (let i = 0; i < attributeTypeList.length; i++) {

			let attributeType: EIMAttributeTypeDomain = attributeTypeList[i];

			// 文字列型属性以外は検索対象外
			if ( attributeType.valueType !== 'STRING') {
				continue;
			}
			let attribute: EIMAttributeDomain = new EIMAttributeDomain();

			attribute.attributeType = attributeType;
			attribute.stringList = [condition.keyword];

			let objectMasterCriteria: any = {};
			objectMasterCriteria.attribute = attribute;

			criteriaList.push(objectMasterCriteria);
		}

		criteria.objectMasterCriteriaList = criteriaList;

		this.objectMasterService.getList(criteria)
			.subscribe((objects: EIMObjectMasterDTO[]) => {
				if (objects.length == 0) {
					this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
				}

				info.dataGrid.setData(objects);
			});
	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return (a.id == b.id);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
