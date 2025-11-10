import { Injectable } from '@angular/core';
import { EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCacheEntrySearchAttributeTypeDTO } from 'app/admins/shared/dtos/cache-entry-search-attribute-type.dto';
import { EIMCacheEntryDTO } from 'app/admins/shared/dtos/cache-entry.dto';
import { EIMCacheMonistorViewCacheEntryService } from './cache-monitor-view-cache-entry.service';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMCheckRendererComponent } from 'app/admins/shared/components/renderer/check-renderer.component';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';

/**
 * キャッシュ管理属性タイプキャッシュエントリサービス
 */
@Injectable()
export class EIMCacheMonistorViewCacheEntryAttributeTypeService
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

		// データ型
		columns.push({field: 'entry_valueType', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'),
				width: 150});

		// 複数値を保持する
		columns.push({field: 'entry_multiple', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02096'),
				width: 140});

		// デフォルト値リスト 数値型
		columns.push({field: 'entry_defaultLongValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02336'),
				width: 220, cellRendererFramework: EIMTooltipRendererComponent});

		// デフォルト値リスト 日付型
		columns.push({field: 'entry_defaultDateValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02337'),
				width: 220, cellRendererFramework: EIMTooltipRendererComponent});

		// デフォルト値リスト 実数型
		columns.push({field: 'entry_defaultDoubleValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02338'),
				width: 220, cellRendererFramework: EIMTooltipRendererComponent});

		// デフォルト値リスト テキスト型
		columns.push({field: 'entry_defaultTextValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02339'),
				width: 220, cellRendererFramework: EIMTooltipRendererComponent});

		// デフォルト値リスト 文字列型
		columns.push({field: 'entry_defaultStringValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02340'),
				width: 220, cellRendererFramework: EIMTooltipRendererComponent});

		// コードタイプID
		columns.push({field: 'entry_codeType_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02341'),
				width: 120, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

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

		// データ型
		object['entry_valueType'] = this.getStringValue(entry, 'entry.valueType');

		// 複数値を保持する
		object['entry_multiple'] = this.getBooleanValue(entry, 'entry.multiple');

		// デフォルト値リスト 数値型
		object['entry_defaultLongValueList'] = this.getListValue(entry, 'entry.defaultLongValueList', this.getNumberValue.bind(this));

		// デフォルト値リスト 日付型
		object['entry_defaultDateValueList'] = this.getListValue(entry, 'entry.defaultDateValueList', this.getDateValue.bind(this));

		// デフォルト値リスト 実数型
		object['entry_defaultDoubleValueList'] = this.getListValue(entry, 'entry.defaultDoubleValueList', this.getNumberValue.bind(this));

		// デフォルト値リスト テキスト型
		object['entry_defaultTextValueList'] = this.getListValue(entry, 'entry.defaultTextValueList', this.getStringValue.bind(this));

		// デフォルト値リスト 文字列型
		object['entry_defaultStringValueList'] = this.getListValue(entry, 'entry.defaultStringValueList', this.getStringValue.bind(this));

		// コードタイプID
		object['entry_codeType_id'] = this.getNumberValue(entry, 'entry.codeType.id');

		return object;
	}
}
