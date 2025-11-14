import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMUserService } from 'app/shared/services/apis/user.service';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMUserCriteriaDTO } from 'app/shared/dtos/criteria/user-criteria.dto';

@Injectable()
export class EIMUserSelectorComponentService extends EIMDataGridSingleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected messageService: EIMMessageService,
  		protected userService: EIMUserService,
  		protected translateService: TranslateService,
	) {
		super(translateService);
	}

	/**
	 * 検索します.
	 * @param info インフォ
	 * @param condition 検索条件
	 */
	public search(info: EIMDataGridSingleSelectorComponentInfo, condition: any): void {
		if (this.userService.searchType !== EIMUserService.USER_SERVICE_SEARCH_TYPE_KEYWORD) {
			// キーワード検索以外の場合
			let criteria: EIMUserCriteriaDTO = new EIMUserCriteriaDTO();
			if (condition.userCode[0]) {
				criteria.code = '*' + condition.userCode + '*';
			}
			if (condition.userName[0]) {
				criteria.name = '*' + condition.userName + '*';
			}
			criteria.disable = false;

			this.userService.searchUser(criteria)
				.subscribe((users: any[]) => {
					if (users.length === 0) {
						this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
					}

					// 一覧表示内容変更
					users.sort(function(a, b) {
						if ( a.code < b.code ) {
							return -1;
						}
						if ( a.code > b.code ) {
							return 1;
						}
						return 0;
					});
					info.dataGrid.setData(users);
				});
		} else {
			// キーワード検索の場合
			this.userService.searchUserByKeyword(condition.keyword, condition.disableUserFilter, condition.systemUserFilter, condition.parentObjId)
			.subscribe((users: any[]) => {
				if (users.length === 0) {
					this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
				}

				// 一覧表示内容変更
				users.sort(function(a, b) {
					if ( a.code < b.code ) {
						return -1;
					}
					if ( a.code > b.code ) {
						return 1;
					}
					return 0;
				});
				info.dataGrid.setData(users);
			});
		}
	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 * @return 同値判定
	 */
	public equals(a: any, b: any): boolean {
		return (a.id == b.id);
	}

}
