import { Injectable } from '@angular/core';
import { EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCacheEntrySearchAttributeTypeDTO } from 'app/admins/shared/dtos/cache-entry-search-attribute-type.dto';
import { EIMCacheEntryDTO } from 'app/admins/shared/dtos/cache-entry.dto';
import { EIMCacheMonistorViewCacheEntryService } from './cache-monitor-view-cache-entry.service';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMCheckRendererComponent } from 'app/admins/shared/components/renderer/check-renderer.component';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';

/**
 * キャッシュ管理オブジェクトタイプキャッシュエントリサービス
 */
@Injectable()
export class EIMCacheMonistorViewCacheEntryObjectTypeService
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

		// 定義名称
		columns.push({field: 'entry_definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'),
				width: 150});

		// 名前リスト
		columns.push({field: 'entry_nameList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02326'),
				width: 150, cellRendererFramework: EIMTooltipRendererComponent});

		// 属性タイプIDリスト
		columns.push({field: 'entry_attributeTypeList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02327'),
				width: 150, cellRendererFramework: EIMTooltipRendererComponent});

		// 親オブジェクトタイプID
		columns.push({field: 'entry_parent_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02328'),
				width: 180, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// 子オブジェクトタイプIDリスト
		columns.push({field: 'entry_childList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02329'),
				width: 220, cellRendererFramework: EIMTooltipRendererComponent});

		// オブジェクトタイプオブジェクトID
		columns.push({field: 'entry_objectTypeObject_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02330'),
				width: 250, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// フォーマットIDリスト
		columns.push({field: 'entry_objectTypeFormatList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02331'),
				width: 170, cellRendererFramework: EIMTooltipRendererComponent});

		// ワークフローID
		columns.push({field: 'entry_workflow_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02332'),
				width: 120, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// シーケンスID
		columns.push({field: 'entry_sequence_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02333'),
				width: 110, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

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

		// 定義名称
		object['entry_definitionName'] = this.getStringValue(entry, 'entry.definitionName');

		// 名前リスト
		object['entry_nameList'] = this.getListValue(entry, 'entry.nameList', this.getStringValue.bind(this), 'name');

		// 属性タイプIDリスト
		object['entry_attributeTypeList'] = this.getListValue(entry, 'entry.attributeTypeList', this.getNumberValue.bind(this), 'id');

		// 親オブジェクトタイプID
		object['entry_parent_id'] = this.getNumberValue(entry, 'entry.parent.id');

		// 子オブジェクトタイプIDリスト
		object['entry_childList'] = this.getListValue(entry, 'entry.childList', this.getNumberValue.bind(this), 'id');

		// オブジェクトタイプオブジェクトID
		object['entry_objectTypeObject_id'] = this.getNumberValue(entry, 'entry.objectTypeObject.id');

		// フォーマットIDリスト
		object['entry_objectTypeFormatList'] = this.getListValue(entry, 'entry.objectTypeFormatList', this.getNumberValue.bind(this), 'format.id');

		// ワークフローID
		object['entry_workflow_id'] = this.getNumberValue(entry, 'entry.workflow.id');

		// シーケンスID
		object['entry_sequence_id'] = this.getNumberValue(entry, 'entry.sequence.id');

		return object;
	}
}
