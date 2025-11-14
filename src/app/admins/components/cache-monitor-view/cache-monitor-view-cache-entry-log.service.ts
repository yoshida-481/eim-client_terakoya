import { Injectable } from '@angular/core';
import { EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCacheEntrySearchAttributeTypeDTO } from 'app/admins/shared/dtos/cache-entry-search-attribute-type.dto';
import { EIMCacheEntryDTO } from 'app/admins/shared/dtos/cache-entry.dto';
import { EIMCacheMonistorViewCacheEntryService } from './cache-monitor-view-cache-entry.service';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';

/**
 * キャッシュ管理ログキャッシュエントリサービス
 */
@Injectable()
export class EIMCacheMonistorViewCacheEntryLogService
		extends EIMCacheMonistorViewCacheEntryService {

	/**
	 * キャッシュエントリ一覧に表示するカラムリストを返却します.
	 * @param attributeTypes 属性タイプリスト
	 * @return カラムリスト
	 */
	public getColumns(attributeTypes?: EIMCacheEntrySearchAttributeTypeDTO[]): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		// ログID
		columns.push({field: 'entry_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02356'),
				width: 90});

		// ID
		columns.push({field: 'entry_primaryKey', headerName: this.translateService.instant('EIM.LABEL_02027'),
				width: 110});

		// クラス
		columns.push({field: 'entry_type', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02273'),
				width: 550});

		// 作成日時
		columns.push({field: 'entry_timestamp', headerName: this.translateService.instant('EIM.LABEL_02031'),
				width: 170});

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

		// ログID
		object['entry_id'] = this.getStringValue(entry, 'entry.id');

		// ID
		object['entry_primaryKey'] = this.getStringValue(entry, 'entry.primaryKey');

		// クラス
		object['entry_type'] = this.getStringValue(entry, 'entry.type');

		// 作成日時
		object['entry_timestamp'] = this.getDateValue(entry, 'entry.timestamp');

		return object;
	}
}
