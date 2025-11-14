import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMAttributeTypeService } from 'app/documents/shared/services/apis/attribute-type.service';

/**
 * 属性タイプ選択コンポーネントサービス
 */
@Injectable()
export class EIMAttributeTypeSelectorComponentService extends EIMDataGridSingleSelectorComponentService {

	/**
	 * コンストラクタです.
	 * @param messageService メッセージサービス
	 * @param translateService 翻訳サービス
	 * @param attributeTypeService 属性タイプサービス
	 */
	constructor(
			protected messageService: EIMMessageService,
  		protected translateService: TranslateService,
  		protected attributeTypeService: EIMAttributeTypeService,
	) {
		super(translateService);
	}

	/**
	 * 検索します.
	 * @param info データグリッドコンポーネント情報
	 * @param condition 検索条件
	 */
	public search(info: EIMDataGridSingleSelectorComponentInfo, condition: any): void {

		// 属性名の曖昧検索条件
		let searchCond = '*' + condition.attributeTypeName + '*';

		this.attributeTypeService.getListByName(searchCond)
					.subscribe(
							(attributeTypes: any[]) => {

								if (attributeTypes.length == 0) {
									this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
								}

								// 一覧表示内容変更
								attributeTypes.sort(
									function(a, b) {
										if (a.attTypeName < b.attTypeName) {
											return -1;
										}
										if (a.attTypeName > b.attTypeName) {
											return 1;
										}
										return 0;
									}
								);
								info.dataGrid.setData(attributeTypes);
							}
				);
	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return (a.attTypeId == b.attTypeId);
	}
}
