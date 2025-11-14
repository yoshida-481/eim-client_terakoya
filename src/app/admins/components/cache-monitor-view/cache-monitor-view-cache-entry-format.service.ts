import { Injectable } from '@angular/core';
import { EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCacheEntrySearchAttributeTypeDTO } from 'app/admins/shared/dtos/cache-entry-search-attribute-type.dto';
import { EIMCacheEntryDTO } from 'app/admins/shared/dtos/cache-entry.dto';
import { EIMCacheMonistorViewCacheEntryService } from './cache-monitor-view-cache-entry.service';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMCheckRendererComponent } from 'app/admins/shared/components/renderer/check-renderer.component';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';

/**
 * キャッシュ管理フォーマットキャッシュエントリサービス
 */
@Injectable()
export class EIMCacheMonistorViewCacheEntryFormatService
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

		// ディレクトリIDリスト
		columns.push({field: 'entry_directoryList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02334'),
				width: 170, cellRendererFramework: EIMTooltipRendererComponent});

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

		// ディレクトリIDリスト
		object['entry_directoryList'] = this.getListValue(entry, 'entry.directoryList', this.getNumberValue.bind(this), 'id');

		return object;
	}
}
