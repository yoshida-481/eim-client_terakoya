import { Injectable } from '@angular/core';
import { EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCacheEntrySearchAttributeTypeDTO } from 'app/admins/shared/dtos/cache-entry-search-attribute-type.dto';
import { EIMCacheEntryDTO } from 'app/admins/shared/dtos/cache-entry.dto';
import { EIMCacheMonistorViewCacheEntryService } from './cache-monitor-view-cache-entry.service';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMCheckRendererComponent } from 'app/admins/shared/components/renderer/check-renderer.component';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';

/**
 * キャッシュ管理ファイルキャッシュエントリサービス
 */
@Injectable()
export class EIMCacheMonistorViewCacheEntryFileService
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
		columns.push({field: 'entry_object_id', headerName: this.translateService.instant('EIM.LABEL_02027'),
				width: 110, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// フォーマットID
		columns.push({field: 'entry_format_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02352'),
				width: 120, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// 名前
		columns.push({field: 'entry_name', headerName: this.translateService.instant('EIM.LABEL_02002'),
				width: 150});

		// ディレクトリID
		columns.push({field: 'entry_directory_id', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02351'),
				width: 120, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// ファイルサイズ(Bytes)
		columns.push({field: 'entry_size', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02354'),
				width: 170, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

		// ファイル作成順
		columns.push({field: 'entry_sequence', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02355'),
				width: 150, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number});

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
		object['pk'] = this.getNumberValue(entry, 'entry.object.id') +
				':' + this.getNumberValue(entry, 'entry.format.id');

		// リロード中
		object['reloading'] = this.getBooleanValue(entry, 'reloading');

		// ID
		object['entry_object_id'] = this.getNumberValue(entry, 'entry.object.id');

		// フォーマットID
		object['entry_format_id'] = this.getNumberValue(entry, 'entry.format.id');

		// 名前
		object['entry_name'] = this.getStringValue(entry, 'entry.name');

		// ディレクトリID
		object['entry_directory_id'] = this.getNumberValue(entry, 'entry.directory.id');

		// ファイルサイズ(Bytes)
		object['entry_size'] = this.getNumberValue(entry, 'entry.size');

		// ファイル作成順
		object['entry_sequence'] = this.getNumberValue(entry, 'entry.sequence');

		return object;
	}
}
