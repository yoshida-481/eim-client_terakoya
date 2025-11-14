import {Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {EIMCheckViewNoValuesRendererComponent} from 'app/admins/shared/components/renderer/check-viewnovalues-renderer.component';
import {TranslateService} from '@ngx-translate/core';
import {EIMComponent, EIMUpdatable} from 'app/shared/shared.interface';
import {EIMDataGridComponent, EIMDataGridColumn} from 'app/shared/components/data-grid/data-grid.component';
import {EIMAdminDialogManagerComponentService, dialogName} from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttrTreeItemDTO } from 'app/admins/shared/dtos/attrTreeItem.dto';


/**
 * 属性階層並べ替えコンポーネント
 * @example
 *
 *      <eim-attribute-tree-view-attribute-sort-updator
 *          [sortTarget]="sortTarget"
 *      </eim-attribute-tree-view-attribute-sort-updator>
 */
@Component({
  selector: 'eim-attribute-tree-view-attribute-sort-updator',
  templateUrl: './attribute-tree-view-attribute-sort-updator.component.html',
  styleUrls: ['./attribute-tree-view-attribute-sort-updator.component.css'],
  providers: [
    {provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeTreeViewAttribuetSortUpdatorComponent)}
  ],
  standalone: false,
})

export class EIMAttributeTreeViewAttribuetSortUpdatorComponent implements OnInit, EIMUpdatable {
	/** 属性階層データグリッド */
	@ViewChild('attrGrid', { static: true })
		attrGrid: EIMDataGridComponent;

	/** 属性階層順序リスト */
	@Input() sortTarget: EIMAttrTreeItemDTO[];

	/** 作成完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 更新可否フラグ */
	public updatableFlag = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性タイプ並べ替えを登録します.
	 */
	public update(): void {
		this.adminDialogManagerComponentService.close(dialogName.ATTRIBUTE_TREE_VIEW_ATTRIBUTE_SORT_UPDATOR);
		this.updated.emit(this.attrGrid.getData());
	}

	/**
	 * 属性タイプ並べ替え可否を返却します.
	 * @return 属性タイプ並べ替え可否
	 */
	public updatable(): boolean {
		return this.updatableFlag;
	}

	/**
	 * グリッドで使用するequalsメソッドです.
	 * 行の追加や削除時に対象行特定のため、グリッド内で使用されます.
	 * @param data1 比較データ1
	 * @param data2 比較データ2
	 */
	public equals (data1: any, data2: any) {
		return (data1.attTypeId === data2.attTypeId)
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 */
	onClickUp(): void {
		this.updatableFlag = this.attrGrid.moveUpSelectedData() || this.updatableFlag;
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(): void {
		this.updatableFlag = this.attrGrid.moveDownSelectedData() || this.updatableFlag;
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let attributeTypeColumns: EIMDataGridColumn[] = [];
		// 定義名称
		attributeTypeColumns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02071'), width: 328, suppressSorting: true, suppressFilter: true});
		// 「属性値なしも表示」
		attributeTypeColumns.push({field: 'viewNoValuesFlag', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02072'), width: 150, cellRendererFramework: EIMCheckViewNoValuesRendererComponent, suppressSorting: true, suppressFilter: true});
		this.attrGrid.setColumns(attributeTypeColumns);
			// 親画面からの属性タイプデータを表示する
		this.attrGrid.setData(this.sortTarget)
	}

}

