import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMMessageService } from 'app/shared/services/message.service';

import { EIMMembersService } from 'app/shared/services/apis/members.service';
import { EIMMembersDomain } from 'app/shared/domains/entity/members.domain';
import { EIMMemberEntryDomain } from 'app/shared/domains/entity/member-entry.domain';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';

/**
 * プロジェクトメンバー単数選択コンポーネントサービス
 */
@Injectable()
export class EIMProjectMemberSingleSelectorComponentService extends EIMDataGridSingleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected messageService: EIMMessageService,
			protected translateService: TranslateService,
			protected membersService: EIMMembersService
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

		// メンバーズフィルタリング
		const keyword = condition.keyword; 

		// ユーザリスト
		const users: EIMUserDTO[] = condition.users;
		// ユーザが存在しない場合、0件表示
		if (users === null || users.length === 0) {

			info.dataGrid.setData([]);
			info.dataGrid.refreshView();
			return;
		}

		// キーワードの指定がない場合、全メンバーを表示する
		if (keyword === '') {

			info.dataGrid.setData(users);
			info.dataGrid.refreshView();
			return;
		}

		// フィルタリング
		const filteredUsers = users
				.filter((user) => {
					if (user.code.indexOf(keyword) >= 0) {
						return true;
					}
					if (user.name.indexOf(keyword) >= 0) {
						return true;
					}
					return false;
				});

		info.dataGrid.setData(filteredUsers);
		info.dataGrid.refreshView();
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
