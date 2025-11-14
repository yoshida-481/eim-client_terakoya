import { Injectable } from '@angular/core';
import { EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCacheEntrySearchAttributeTypeDTO } from 'app/admins/shared/dtos/cache-entry-search-attribute-type.dto';
import { EIMCacheEntryDTO } from 'app/admins/shared/dtos/cache-entry.dto';
import { EIMCacheMonistorViewCacheEntryService } from './cache-monitor-view-cache-entry.service';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMCheckRendererComponent } from 'app/admins/shared/components/renderer/check-renderer.component';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';

/**
 * キャッシュ管理オブジェクトキャッシュエントリサービス
 */
@Injectable()
export class EIMCacheMonistorViewCacheEntryObjectService
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

		// オブジェクトタイプID
		columns.push({field: 'entry_type_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02315'),
				width: 170, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// 最新履歴フラグ
		columns.push({field: 'entry_latest', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02316'),
				width: 120});

		// 履歴番号
		columns.push({field: 'entry_revision', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02317'),
				width: 150, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// 履歴グループID
		columns.push({field: 'entry_revisionGroupId', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02318'),
				width: 120, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// セキュリティID
		columns.push({field: 'entry_security_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02319'),
				width: 120, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// ステータスID
		columns.push({field: 'entry_status_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02320'),
				width: 110, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// ステータスIDリスト
		columns.push({field: 'entry_statusList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02321'),
				width: 150, cellRendererFramework: EIMTooltipRendererComponent});

		// 作成ユーザID
		columns.push({field: 'entry_creationUser_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02322'),
				width: 110, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// 作成日時
		columns.push({field: 'entry_creationDate', headerName: this.translateService.instant('EIM.LABEL_02031'),
				width: 170});

		// 更新ユーザID
		columns.push({field: 'entry_modificationUser_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02323'),
				width: 110, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// 更新日時
		columns.push({field: 'entry_modificationDate', headerName: this.translateService.instant('EIM.LABEL_02033'),
				width: 170});

		// ロックユーザID
		columns.push({field: 'entry_lockUser_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02324'),
				width: 120, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// ロック日時
		columns.push({field: 'entry_lockDate', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02325'),
				width: 170});

		// 属性列を追加
		if (!attributeTypes) {
			return columns;
		}

		for (let i = 0; i < attributeTypes.length; i++) {
			const column: EIMDataGridColumn = {
					field: 'entry_attributeList_' + attributeTypes[i].id,
					headerName: this.getNameValue(attributeTypes[i], 'nameList'),
					width: 150};
			if (attributeTypes[i].multiple) {
				column.cellRendererFramework = EIMTooltipRendererComponent;
			} else if (attributeTypes[i].valueType === 'LONG' ||
					attributeTypes[i].valueType === 'DOUBLE' ||
					attributeTypes[i].valueType === 'OBJECT' ||
					attributeTypes[i].valueType === 'USER' ||
					attributeTypes[i].valueType === 'CODE') {
				column.cellRendererFramework = EIMNumberRendererComponent;
				column.type = EIMDataGridColumnType.number
			}
			columns.push(column);
		}

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
		object['entry_name'] = this.getStringValue(entry, 'entry.name');

		// オブジェクトタイプID
		object['entry_type_id'] = this.getNumberValue(entry, 'entry.type.id');

		// 最新履歴フラグ
		object['entry_latest'] = this.getBooleanValue(entry, 'entry.latest');

		// 履歴番号
		object['entry_revision'] = this.getNumberValue(entry, 'entry.revision');

		// 履歴グループID
		object['entry_revisionGroupId'] = this.getNumberValue(entry, 'entry.revisionGroupId');

		// セキュリティID
		object['entry_security_id'] = this.getNumberValue(entry, 'entry.security.id');

		// ステータスID
		object['entry_status_id'] = this.getNumberValue(entry, 'entry.status.id');

		// ステータスIDリスト
		object['entry_statusList'] = this.getListValue(entry, 'entry.statusList', this.getNumberValue.bind(this), 'id');

		// 作成ユーザID
		object['entry_creationUser_id'] = this.getNumberValue(entry, 'entry.creationUser.id');

		// 作成日時
		object['entry_creationDate'] = this.getDateValue(entry, 'entry.creationDate');

		// 更新ユーザID
		object['entry_modificationUser_id'] = this.getNumberValue(entry, 'entry.modificationUser.id');

		// 更新日時
		object['entry_modificationDate'] = this.getDateValue(entry, 'entry.modificationDate');

		// ロックユーザID
		object['entry_lockUser_id'] = this.getNumberValue(entry, 'entry.lockUser.id');

		// ロック日時
		object['entry_lockDate'] = this.getDateValue(entry, 'entry.lockDate');

		// 属性列を追加
		if (attributeTypes) {
			object = this.setObjectAttribute(object, attributeTypes, entry.attributeValueMap);
		}

		return object;
	}

	/**
	 * オブジェクトに属性値を設定します.
	 * @param object オブジェクト
	 * @param attributeTypes 属性タイプリスト
	 * @param attributeValueMap 属性タイプIDと属性値リストのMap
	 * @return オブジェクト
	 */
	protected setObjectAttribute(object: any, attributeTypes: EIMCacheEntrySearchAttributeTypeDTO[],
			attributeValueMap: any): any {

		for (let i = 0; i < attributeTypes.length; i++) {
			const attributeType: EIMCacheEntrySearchAttributeTypeDTO = attributeTypes[i];
			const attributeValues: any[] = attributeValueMap[attributeType.id];
			const fieldName = 'entry_attributeList_' + attributeType.id;

			if (!attributeValues) {
				continue;
			}

			switch (attributeType.valueType) {
				case 'LONG':
					object[fieldName] = this.getListValue(attributeValues, '', this.getNumberValue.bind(this));
					break;
				case 'STRING':
					object[fieldName] = this.getListValue(attributeValues, '', this.getStringValue.bind(this));
					break;
				case 'DATE':
					object[fieldName] = this.getListValue(attributeValues, '', this.getDateValue.bind(this));
					break;
				case 'TEXT':
					object[fieldName] = this.getListValue(attributeValues, '', this.getStringValue.bind(this));
					break;
				case 'DOUBLE':
					object[fieldName] = this.getListValue(attributeValues, '', this.getNumberValue.bind(this));
					break;
				case 'OBJECT':
					object[fieldName] = this.getListValue(attributeValues, '', this.getNumberValue.bind(this), 'id');
					break;
				case 'USER':
					object[fieldName] = this.getListValue(attributeValues, '', this.getNumberValue.bind(this), 'id');
					break;
				case 'CODE':
					object[fieldName] = this.getListValue(attributeValues, '', this.getNumberValue.bind(this), 'code');
					break;
			}
		}

		return object;
	}
}
