import { Injectable } from '@angular/core';
import { EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCacheEntrySearchAttributeTypeDTO } from 'app/admins/shared/dtos/cache-entry-search-attribute-type.dto';
import { EIMCacheEntryDTO } from 'app/admins/shared/dtos/cache-entry.dto';
import { EIMCacheMonistorViewCacheEntryService } from './cache-monitor-view-cache-entry.service';
import { EIMCheckRendererComponent } from 'app/admins/shared/components/renderer/check-renderer.component';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';

/**
 * キャッシュ管理ディレクトキャッシュエントリサービス
 */
@Injectable()
export class EIMCacheMonistorViewCacheEntryDirectoryService
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

		// パス
		columns.push({field: 'entry_path', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02017'),
				width: 400});

		// onlineフラグ
		columns.push({field: 'entry_online', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02335'),
				width: 110});

		// 合計ファイルサイズ(Bytes)
		columns.push({field: 'entry_currentSize', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02028'),
				width: 200, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

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

		// パス
		object['entry_path'] = this.getStringValue(entry, 'entry.path');

		// onlineフラグ
		object['entry_online'] = this.getBooleanValue(entry, 'entry.online');

		// 合計ファイルサイズ(Bytes)
		object['entry_currentSize'] = this.getNumberValue(entry, 'entry.currentSize');

		return object;
	}
}
