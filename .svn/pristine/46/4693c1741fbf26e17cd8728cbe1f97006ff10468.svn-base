import { Component, ViewChild, Input, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EIMObjectTypeTreeComponentService } from 'app/object-editors/components/object-type-tree/object-type-tree.component.service';
import { EIMMenuItem } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMObjectListComponent } from 'app/object-editors/components/object-list/object-list.component';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMObjectNameRendererComponent } from 'app/object-editors/shared/components/renderer/object-name-renderer.component';
import { EIMObjectCriteriaDTO } from 'app/object-editors/shared/dtos/criteria/object-criteria.dto';
import { EIMObjectEditorMainComponent } from 'app/object-editors/components/object-editor-main/object-editor-main.component';
import { EIMObjectListComponentService } from 'app/object-editors/components/object-list/object-list.component.service';

import { EIMDateService } from 'app/shared/services/date.service';

/**
 * 登録、更新オブジェクト一覧コンポーネント
 * @example
 *
 *      <eim-new-object-list
 *          [objId]="objId">
 *      </eim-new-object-list>
 */
@Component({
    selector: 'eim-new-object-list',
    templateUrl: './new-object-list.component.html',
    styleUrls: ['./new-object-list.component.css'],
    providers: [],
    standalone: false
})
export class EIMNewObjectListComponent implements AfterViewInit {

	/** オブジェクトリスト表示コンポーネント */
	@ViewChild('objectList', { static: true })
		objectList: EIMObjectListComponent;

	/** 表示対象のオブジェクトのID */
	@Input() objId: number;

	/** 定数クラス */
	private Constant: EIMConstantService = EIMConstantService;

	/** 一覧表示用のコンポーネント */
	private objectListDataGrid: EIMDataGridComponent;

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

			let criteria: EIMObjectCriteriaDTO = new EIMObjectCriteriaDTO();
			criteria.objId = String(this.objId);
			this.objectEditorsObjectService.search(criteria)
			.subscribe( (objectList: EIMObjectDTO[]) => {
				this.objectListDataGrid.setData(objectList);
			}, () => {
				// エラー時はタブを閉じる
				this.objectListComponentService.closeSelectedTabEmit();
			});
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	protected getColumns(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		// 名前
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 255, cellRendererFramework: EIMObjectNameRendererComponent, suppressFilter: true, suppressSorting: true});
		// オブジェクトタイプ
		columns.push({field: 'typeName', headerName: this.translateService.instant('EIM.LABEL_02060'), width: 180, suppressFilter: true, suppressSorting: true});
		// リビジョン
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02064'), width: 100, suppressFilter: true, suppressSorting: true, type: EIMDataGridColumnType.number});
		// ステータス
		columns.push({field: 'statusTypeName', headerName: this.translateService.instant('EIM.LABEL_02029'), width: 110, suppressFilter: true, suppressSorting: true});
		// 作成者
		columns.push({field: 'createUserName', headerName: this.translateService.instant('EIM.LABEL_02030'), width: 130, suppressFilter: true, suppressSorting: true});
		// 作成日時
		columns.push({field: 'createDate', headerName: this.translateService.instant('EIM.LABEL_02031'), width: 190, suppressFilter: true, suppressSorting: true, comparator: this.dateService.dateComparator});

		return columns;
	}

}
