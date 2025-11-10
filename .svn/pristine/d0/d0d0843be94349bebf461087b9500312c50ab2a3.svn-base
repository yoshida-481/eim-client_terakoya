import { Injectable } from '@angular/core';
import { EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCacheEntrySearchAttributeTypeDTO } from 'app/admins/shared/dtos/cache-entry-search-attribute-type.dto';
import { EIMCacheEntryDTO } from 'app/admins/shared/dtos/cache-entry.dto';
import { EIMCacheMonistorViewCacheEntryService } from './cache-monitor-view-cache-entry.service';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMCheckRendererComponent } from 'app/admins/shared/components/renderer/check-renderer.component';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';

/**
 * キャッシュ管理ユーザキャッシュエントリサービス
 */
@Injectable()
export class EIMCacheMonistorViewCacheEntryUserService
		extends EIMCacheMonistorViewCacheEntryService {

	/**
	 * キャッシュエントリ一覧に表示するカラムリストを返却します.
	 * @param attributeTypes 属性タイプリスト
	 * @return カラムリスト
	 */
	public getColumns(attributeTypes?: EIMCacheEntrySearchAttributeTypeDTO[]): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		// リロード中
		columns.push({field: 'reloading', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02314'),
				width: 90, suppressFilter: true, cellRendererFramework: EIMCheckRendererComponent});

		// ID
		columns.push({field: 'entry_id', headerName: this.translateService.instant('EIM.LABEL_02027'),
				width: 110, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// 名前
		columns.push({field: 'entry_name', headerName: this.translateService.instant('EIM.LABEL_02002'),
				width: 150});

		// ユーザコード
		columns.push({field: 'entry_code', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02342'),
				width: 150});

		// 定義名称
		columns.push({field: 'entry_definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'),
				width: 150});

		// 名前リスト
		columns.push({field: 'entry_nameList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02326'),
				width: 150, cellRendererFramework: EIMTooltipRendererComponent});

		// かな
		columns.push({field: 'entry_kana', headerName: this.translateService.instant('EIM.LABEL_02047'),
				width: 150});

		// Mail
		columns.push({field: 'entry_mail', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02076'),
				width: 150});

		// 管理者権限フラグ
		columns.push({field: 'entry_admin', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02343'),
				width: 150, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// 無効フラグ
		columns.push({field: 'entry_disable', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02080'),
				width: 90});

		// 受信メール言語
		columns.push({field: 'entry_lang', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02091'),
				width: 150});

		// グループIDリスト
		columns.push({field: 'entry_groupList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02344'),
				width: 150, cellRendererFramework: EIMTooltipRendererComponent});

		// ロールIDリスト
		columns.push({field: 'entry_roleList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02345'),
				width: 150, cellRendererFramework: EIMTooltipRendererComponent});

		// ユーザオブジェクトID
		columns.push({field: 'entry_userObject_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02346'),
				width: 170, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		return columns;
	}

	/**
	 * キャッシュエントリ情報を画面表示用にコンバートします.
	 * @param entry キャッシュエントリ情報
	 * @param attributeTypes 属性タイプリスト
	 * @return コンバート後のオブジェクト
	 */
	public convertToObject(entry: EIMCacheEntryDTO, attributeTypes?: EIMCacheEntrySearchAttributeTypeDTO[]): any {
		let object = {};

		// PK（行選択用）
		object['pk'] = this.getNumberValue(entry, 'entry.id');

		// リロード中
		object['reloading'] = this.getBooleanValue(entry, 'reloading');

		// ID
		object['entry_id'] = this.getNumberValue(entry, 'entry.id');

		// 名前
		object['entry_name'] = this.getNameValue(entry, 'entry.nameList');

		// ユーザコード
		object['entry_code'] = this.getStringValue(entry, 'entry.code');

		// 定義名称
		object['entry_definitionName'] = this.getStringValue(entry, 'entry.definitionName');

		// 名前リスト
		object['entry_nameList'] = this.getListValue(entry, 'entry.nameList', this.getStringValue.bind(this), 'name');

		// かな
		object['entry_kana'] = this.getStringValue(entry, 'entry.kana');

		// Mail
		object['entry_mail'] = this.getStringValue(entry, 'entry.mail');

		// 管理者権限フラグ
		object['entry_admin'] = this.getNumberValue(entry, 'entry.admin');

		// 無効フラグ
		object['entry_disable'] = this.getBooleanValue(entry, 'entry.disable');

		// 受信メール言語
		object['entry_lang'] = this.getStringValue(entry, 'entry.lang');

		// グループIDリスト
		object['entry_groupList'] = this.getListValue(entry, 'entry.groupList', this.getNumberValue.bind(this), 'id');

		// ロールIDリスト
		object['entry_roleList'] = this.getListValue(entry, 'entry.roleList', this.getNumberValue.bind(this), 'id');

		// ユーザオブジェクトID
		object['entry_userObject_id'] = this.getNumberValue(entry, 'entry.userObject.id');

		return object;
	}
}
