import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMFormTypeDisplayColumn, EIMFormTypeDisplayColumnColumn } from 'app/shared/services/apis/local-storage.service';

/**
 * 属性タイプ複数選択コンポーネントサービス
 */
@Injectable()
export class EIMFormListColumnSingleSelectorComponentService extends EIMDataGridSingleSelectorComponentService {

	/**
	 * コンストラクタです.
	 * @param messageService メッセージサービス
	 * @param translateService 翻訳サービス
	 */
	constructor(
			protected messageService: EIMMessageService,
  		protected translateService:TranslateService,
	) {
		super(translateService);
	}

	/**
	 * 検索します.
	 * @param info データグリッドコンポーネント情報
	 * @param condition 検索条件
	 */
	public search(info: any, condition: any): void {

		// フィルタ処理
		let displayColumns: EIMFormTypeDisplayColumnColumn[] = [];
		for (let i = 0; i < info.data.length; i++) {
			let column: EIMFormTypeDisplayColumnColumn = info.data[i];
			if (condition.formTypeName == null || column.name.indexOf(condition.formTypeName) >= 0 || column.definitionName.indexOf(condition.formTypeName) >= 0) {
				displayColumns.push(column);
			}
		}
		
		info.dataGrid.setData(displayColumns);
	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return (a.columnId == b.columnId);
	}
}
