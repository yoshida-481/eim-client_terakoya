import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMObjectMasterService } from 'app/shared/services/apis/object-master.service';

import { EIMObjectAPIService, EIMObjectAPIServiceGetListParam } from 'app/shared/services/apis/object-api.service';
import { EIMObjectRoleService } from 'app/shared/services/apis/object-role.service';
import { EIMObjectRoleDomain } from 'app/shared/domains/entity/object-role.domain';

/**
 * 役割単数選択コンポーネントサービス
 */
@Injectable()
export class EIMResponsibleObjectRoleSingleSelectorComponentService extends EIMDataGridSingleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
  		protected objectMasterService: EIMObjectMasterService,
  		protected translateService: TranslateService,
		protected objectAPIService: EIMObjectAPIService,
		protected objectRoleService: EIMObjectRoleService
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

		// マスタ情報をフィルタリング
		if (condition.keyword === '') {

			info.dataGrid.setData(info.data);
			return;
		}

		const filterdObjectRoles = [];
		for (const objectRole of info.data) {

			if ((objectRole as EIMObjectRoleDomain).name.indexOf(condition.keyword) === -1) {
				continue;
			}

			filterdObjectRoles.push(objectRole);
		}

		info.dataGrid.setData(filterdObjectRoles);
		// this.objectRoleService.getList(null).subscribe((res: any) => {
		// 	let objectRoles: EIMObjectRoleDomain[] = res;
		// 	info.dataGrid.setData(objectRoles);
		// });
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
