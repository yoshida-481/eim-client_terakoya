import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMFormTypeDisplayColumn, EIMFormTypeDisplayColumnColumn } from 'app/shared/services/apis/local-storage.service';
import { EIMUserDTO } from "app/shared/dtos/user.dto";
import { EIMEntryUserDTO } from "app/shared/dtos/entry-user.dto";

/**
 * 属性タイプ複数選択コンポーネントサービス
 */
@Injectable()
export class EIMTaskEntryListSingleSelectorComponentService extends EIMDataGridSingleSelectorComponentService {

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
		let displayColumns: EIMUserDTO[] = [];
		for (let i = 0; i < info.data.length; i++) {
			let column: EIMEntryUserDTO = info.data[i];
			if (condition.showOnlySuperior && !column.isBoss) {
				continue;
			}
			if (this.check(column,condition)) {
				displayColumns.push(column);
			}
		}
		info.dataGrid.setData(displayColumns);
	}
	
	/**
	 * 初期表示時のフィルタ処理を行います.
	 * @param info データグリッドコンポーネント情報
	 * @param condition 検索条件
	 */
	public initFilter(info: any, condition: any): void {
		// フィルタ処理
		let filteredUsers: EIMUserDTO[] = [];
		for (let i = 0; i < info.data.length; i++) {
			let user: EIMEntryUserDTO = info.data[i];
			if (!condition.showOnlySuperior) {
				filteredUsers.push(user);
			} else if (user.isBoss) {
				filteredUsers.push(user);
			}
		}
		info.dataGrid.setData(filteredUsers);
	}
	
	/**
	 * 対象ユーザが表示条件を満たすか判定します.
	 * @param user チェック対象ユーザ
	 * @param condition 検索条件
	 * @return ユーザ表示可否
	 */
	public check(user: EIMUserDTO, condition: any): boolean {

		// フィルタ処理
	// 検索値取得
		var keyWord:string = condition.userName;
		
	// 検索語未指定ならtrue
		if (keyWord == null || keyWord.length == 0) {
			return true;
		}
	// ユーザID
		if (user.code != null && user.code.indexOf(keyWord) != -1) {
			return true;
		}
		// 名前
		if (user.name != null && user.name.indexOf(keyWord) != -1) {
			return true;
		}
		// グループ
		if (user.groupNames != null && user.groupNames.indexOf(keyWord) != -1) {
			return true;
		}
		// ロール
		if (user.roleNames != null && user.roleNames.indexOf(keyWord) != -1) {
			return true;
		}
		// ここまで到達した場合、合致せず
		return false;
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
