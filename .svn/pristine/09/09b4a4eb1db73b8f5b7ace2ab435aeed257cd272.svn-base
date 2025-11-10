import { Component, ViewChild, Input, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EIMObjectTypeTreeComponentService } from 'app/object-editors/components/object-type-tree/object-type-tree.component.service';
import { EIMMenuItem } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMObjectListComponent } from 'app/object-editors/components/object-list/object-list.component';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMObjectNameRendererComponent } from 'app/object-editors/shared/components/renderer/object-name-renderer.component';
import { EIMObjectEditorMainComponent } from 'app/object-editors/components/object-editor-main/object-editor-main.component';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';
import { EIMObjectListComponentService } from 'app/object-editors/components/object-list/object-list.component.service';

import { EIMDateService } from 'app/shared/services/date.service';

/**
 * リビジョン一覧コンポーネント
 * @example
 *
 *      <eim-revision-list [objId]="objId">
 *      </eim-revision-list>
 */
@Component({
    selector: 'eim-revision-list',
    templateUrl: './revision-list.component.html',
    styleUrls: ['./revision-list.component.css'],
    providers: [],
    standalone: false
})
export class EIMRevisionListComponent implements AfterViewInit {

	/** オブジェクトリスト表示コンポーネント */
	@ViewChild('objectList', { static: true })
		objectList: EIMObjectListComponent;

	/** 表示対象のオブジェクトのID */
	@Input() objId: number;

	/** 定数クラス */
	private Constant: EIMConstantService = EIMConstantService;

	/** オブジェクトリスト */
	private objectListDataGrid: EIMDataGridComponent;

	/** リビジョン一覧ID */
	private versionId = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectEditorsObjectService: EIMObjectEditorsObjectService,
		public objectEditorMainComponent: EIMObjectEditorMainComponent,
		protected objectListComponentService: EIMObjectListComponentService,
		protected dateService: EIMDateService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * スクロールバーの位置を返却します.
	 */
	public getScrollPosition(): {} {
		let result = {
			objectList: this.objectList.objectList.getScrollTop(),
		};
		return result;
	}

	/**
	 * スクロールバーの位置を設定します.
	 */
	public setScrollPosition(positions: {}): void {
		this.objectList.objectList.setScrollTop(positions['objectList']);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngAfterViewInit(): void {
		window.setTimeout(() => {
			// オブジェクトリストのカラムを設定
			this.objectListDataGrid = (this.objectList.getComponent() as EIMDataGridComponent);
			this.objectListDataGrid.setColumns(this.getColumns());

			this.objectEditorsObjectService.getAllVersion(this.objId, this.versionId)
			.subscribe( (res: any) => {
				this.versionId = res.versionId;
				this.objectListDataGrid.setData(res.versionList);
			}, () => {
				// エラー時はタブを閉じる
				this.objectListComponentService.closeSelectedTabEmit();
			});
		});
	}

	/**
	 * オブジェクトリスト更新要求のイベントハンドラです.
	 * @param selectedData 更新前選択データ
	 */
	public onInvalidatedObjectList(selectedData: EIMObjectDTO[]): void {
		this.objectEditorsObjectService.getAllVersion(this.objId, this.versionId)
		.subscribe( (res: any) => {
			let pos = this.objectListDataGrid.getScrollTop();
			this.objectListDataGrid.setData(res.versionList);
			this.objectListDataGrid.select(selectedData, true);
			this.objectListDataGrid.setScrollTop(pos);
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	protected getColumns(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		// 名前
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 252, cellRendererFramework: EIMObjectNameRendererComponent, suppressFilter: false, suppressSorting: false});
		// オブジェクトタイプ
		columns.push({field: 'typeName', headerName: this.translateService.instant('EIM.LABEL_02060'), width: 200, suppressFilter: false, suppressSorting: false});
		// リビジョン
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02064'), width: 103, suppressFilter: false, suppressSorting: false, type: EIMDataGridColumnType.number});
		// ステータス
		columns.push({field: 'statusTypeName', headerName: this.translateService.instant('EIM.LABEL_02029'), width: 120, suppressFilter: false, suppressSorting: false});
		// 作成者
		columns.push({field: 'createUserName', headerName: this.translateService.instant('EIM.LABEL_02030'), width: 120, suppressFilter: false, suppressSorting: false});
		// 作成日時
		columns.push({field: 'createDate', headerName: this.translateService.instant('EIM.LABEL_02031'), width: 167, suppressFilter: false, suppressSorting: false, comparator: this.dateService.dateComparator});
		// 最新版
		columns.push({field: 'latestNumber', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02019'), type: EIMDataGridColumnType.number, width: 85, suppressFilter: false, suppressSorting: false});
		// ロックユーザ
		columns.push({field: 'lockUserName', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02022'), width: 130, suppressFilter: false, suppressSorting: false});
		// ロック日時
		columns.push({field: 'lockDate', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02082'), width: 170, suppressFilter: false, suppressSorting: false});

		return columns;
	}

}
