import { Component, ViewChild, Input, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectListComponent } from 'app/object-editors/components/object-list/object-list.component';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMTreeDataGridComponent, EIMTreeDataGridColumn } from 'app/shared/components/tree-data-grid/tree-data-grid.component';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';
import { EIMTreeDataGridNode } from 'app/shared/components/tree-data-grid/tree-data-grid.component.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMObjectEditorsIconService } from 'app/object-editors/shared/services/object-editors-icon.service';
import { EIMObjectEditorMainComponent } from 'app/object-editors/components/object-editor-main/object-editor-main.component';
import { EIMObjectListComponentService } from 'app/object-editors/components/object-list/object-list.component.service';

/**
 * リレーションオブジェクトツリーコンポーネント
 * @example
 *
 *      <eim-relation-object-tree
 *          [objId]="objId",
 *          [isReverse]="false">
 *      </eim-relation-object-tree>
 */
@Component({
    selector: 'eim-relation-object-tree',
    templateUrl: './relation-object-tree.component.html',
    styleUrls: ['./relation-object-tree.component.css'],
    providers: [],
    standalone: false
})
export class EIMRelationObjectTreeComponent implements AfterViewInit, OnInit {

	/** オブジェクトリスト表示コンポーネント */
	@ViewChild('objectList', { static: true })
		objectList: EIMObjectListComponent;

	/** ルートのオブジェクトのID */
	@Input() objId: number;

	/** 逆展開かどうか */
	@Input() isReverse = false;

	/** タブタイプ */
	public tabType: string;

	/** ツリーデータグリッド */
	private objectListDataGrid: EIMTreeDataGridComponent;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected objectEditorsIconService: EIMObjectEditorsIconService,
		protected objectEditorsObjectService: EIMObjectEditorsObjectService,
		protected objectEditorMainComponent: EIMObjectEditorMainComponent,
		protected objectListComponentService: EIMObjectListComponentService,
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
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		if (this.isReverse) {
			// 逆展開
			this.tabType = this.objectEditorMainComponent.TAB_TYPE_REVERSE_EXPAND_RELATION;
		} else {
			// 正展開
			this.tabType = this.objectEditorMainComponent.TAB_TYPE_EXPAND_RELATION;
		}
	}


	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngAfterViewInit(): void {
		window.setTimeout(() => {
			// オブジェクトリストのカラムを設定
			this.objectListDataGrid = (this.objectList.getComponent() as EIMTreeDataGridComponent);
			this.objectListDataGrid.rowHeight = 20;
			this.objectListDataGrid.setColumns(this.getColumns());

			if (this.isReverse) {
				// 逆展開
				this.objectEditorsObjectService.getParentList(this.objId).subscribe( (objectList: EIMObjectDTO[]) => {
					let nodes: EIMTreeDataGridNode[] = this.hierarchicalDomainService.convert(objectList, (object: EIMObjectDTO): EIMTreeDataGridNode => {
						return {
							icon: this.objectEditorsIconService.getIcon(object.typeName),
							expanded: true,
							data: object
						};
					});
					this.objectListDataGrid.setData(nodes);
				}, () => {
					// エラー時はタブを閉じる
					this.objectListComponentService.closeSelectedTabEmit();
				});
			} else {
				// 正展開
				this.objectEditorsObjectService.getChildList(this.objId).subscribe( (objectList: EIMObjectDTO[]) => {
					let nodes: EIMTreeDataGridNode[] = this.hierarchicalDomainService.convert(objectList, (object: EIMObjectDTO): EIMTreeDataGridNode => {
						return {
							icon: this.objectEditorsIconService.getIcon(object.typeName),
							expanded: true,
							data: object
						};
					});
					this.objectListDataGrid.setData(nodes);
				}, () => {
					// エラー時はタブを閉じる
					this.objectListComponentService.closeSelectedTabEmit();
				});
			}
		});
	}

	/**
	 * オブジェクトリスト更新要求のイベントハンドラです.
	 * @param selectedData 更新前選択データ
	 */
	public onInvalidatedObjectList(selectedData: EIMTreeDataGridNode[]): void {
		if (this.isReverse) {
			// 逆展開
			this.objectEditorsObjectService.getParentList(this.objId).subscribe( (objectList: EIMObjectDTO[]) => {
				let nodes: EIMTreeDataGridNode[] = this.hierarchicalDomainService.convert(objectList, (object: EIMObjectDTO): EIMTreeDataGridNode => {
					return {
						icon: this.objectEditorsIconService.getIcon(object.typeName),
						expanded: true,
						data: object
					};
				});
				let pos: number = this.objectListDataGrid.getScrollTop();
				this.objectListDataGrid.setData(nodes);
				this.objectListDataGrid.select(selectedData, true);
				this.objectListDataGrid.setScrollTop(pos);
			});
		} else {
			// 正展開
			this.objectEditorsObjectService.getChildList(this.objId).subscribe( (objectList: EIMObjectDTO[]) => {
				let nodes: EIMTreeDataGridNode[] = this.hierarchicalDomainService.convert(objectList, (object: EIMObjectDTO): EIMTreeDataGridNode => {
					return {
						icon: this.objectEditorsIconService.getIcon(object.typeName),
						expanded: true,
						data: object
					};
				});
				let pos: number = this.objectListDataGrid.getScrollTop();
				this.objectListDataGrid.setData(nodes);
				this.objectListDataGrid.select(selectedData, true);
				this.objectListDataGrid.setScrollTop(pos);
			});
		}
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	protected getColumns(): EIMTreeDataGridColumn[] {
		let columns: EIMTreeDataGridColumn[] = [];

		// 名前
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002')});
		// オブジェクトタイプ
		columns.push({field: 'typeName', headerName: this.translateService.instant('EIM.LABEL_02060'), tooltip: true, width: 180});
		// リレーションタイプ
		columns.push({field: 'relationTypeName', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02011'), tooltip: true, width: 180});
		// リビジョン
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02064'), width: 100});
		// ステータス
		columns.push({field: 'statusTypeName', headerName: this.translateService.instant('EIM.LABEL_02029'), width: 110});
		// 作成者
		columns.push({field: 'createUserName', headerName: this.translateService.instant('EIM.LABEL_02030'), tooltip: true, width: 130});
		// 作成日時
		columns.push({field: 'createDate', headerName: this.translateService.instant('EIM.LABEL_02031'), width: 190});

		return columns;
	}

}
