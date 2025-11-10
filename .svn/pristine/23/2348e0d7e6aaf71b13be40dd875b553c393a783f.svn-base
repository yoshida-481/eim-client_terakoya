import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMSelectable, EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMEntrySelectorComponentService } from 'app/shared/components/entry-selector/entry-selector.component.service';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAdminsGroupService } from 'app/admins/shared/services/apis/admins-group.service';

/**
 * グループ選択ツリーコンポーネント
 * @example
 *
 *      <eim-group-single-selector
 *        [displayAccordionNum]="displayAccordionNum">
 *      </eim-group-single-selector>
 */
@Component({
    selector: 'eim-group-single-selector',
    templateUrl: './group-single-selector.component.html',
    styleUrls: ['./group-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMGroupSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMGroupSingleSelectorComponent) }],
    standalone: false
})
export class EIMGroupSingleSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMSelectable {

	/** グループツリーコンポーネント */
	@ViewChild('singleGroupContentsTree')
	singleGroupContentsTree: EIMTreeComponent;

	/** グループデータグリッド(パス表示用) */
	@ViewChild('groupSelectDataGrid')
	groupSelectDataGrid: EIMDataGridComponent;

	/** グループ一覧の表示方法（０ ＝ パス表示、１ ＝ ツリー表示） */
	@Input() displayAccordionNum: number;

	/** オブジェクトタイプグリッド行選択イベントエミッタ */
	@Output() public selected: EventEmitter<any> = new EventEmitter<any>();

	/** ツリー選択ノード */
	public selectedTreeNode: EIMTreeNode;

	/** 選択したグリッド */
	public selectedDataGrid: any[];

	/** 検索グループ名 */
	public searchGroupName: string;

	/**
	 * コンストラクタ.
	 */
	constructor(
		protected adminsEntryService: EIMAdminsEntryService,
		public treeComponentService: EIMEntrySelectorComponentService,
		protected translateService: TranslateService,
		protected adminsGroupService: EIMAdminsGroupService,
	) {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択ボタン押下時の処理を実施します.
	 * selectedイベントエミッタを発火します.
	 */
	public select(): void {
		// 呼び出し元に選択したグループを返却する
		if (this.displayAccordionNum === 1) {
			this.selected.emit(this.singleGroupContentsTree.getSelectedData()[0].data);
		} else if (this.displayAccordionNum === 0) {
			this.selected.emit(this.selectedDataGrid);
		}
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 * @return ボタン押下可否
	 */
	public selectable(): boolean {
		if (this.displayAccordionNum === 1) {
			return (this.selectedTreeNode != null);
		} else if (this.displayAccordionNum === 0) {
			return (this.selectedDataGrid != null);
		}
	}

	/**
	 * 画面を表示します.
	 */
	public show(): void {
		// グループ一覧の表示方法がツリー表示の場合
		if (this.displayAccordionNum === 1) {
			this.adminsGroupService.getGroupList().subscribe(
				(groupObject: any) => {
					// グループツリーに要素を設定
					if (groupObject.groups.group != null) {
						let treeNodes: EIMTreeNode[] = this.treeComponentService.convertGroupsToTreeNodes(groupObject.groups.group);
						window.setTimeout(() => {
							this.singleGroupContentsTree.setData(treeNodes);
						});
					}
				}
			);
		// グループ一覧の表示方法がパス表示の場合
		} else if (this.displayAccordionNum === 0) {
			let groupColumns: EIMDataGridColumn[] = [];
			// グループ名
			groupColumns.push({field: 'groupName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02077'), width: 260});
			// 親グループ名
			groupColumns.push({field: 'parentGroupName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02157'), width: 260});
			window.setTimeout(() => {
				this.groupSelectDataGrid.setColumns(groupColumns);
			});
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit(): void {
		this.show();
	}

	/**
	 * 検索ボタン押下時のイベントハンドラ
	 * @param event 検索データ
	 */
	public onSearch(event: any): void {
		this.adminsGroupService.getGroupListPath(this.searchGroupName)
			.subscribe((groupObject: any) => {
				let groupList = groupObject.groups.group;
				let groupArry: any[] = [];
				for (let idx = 0; idx < groupList.length; idx++) {
					groupArry.push(groupList[idx].attr);
				}
				this.groupSelectDataGrid.setData(groupArry);
			});
	}

	/**
	 * ノード選択イベントハンドラ.
	 * @param event ツリーノード選択データ
	 */
	public onSelectGroupTreeNode(event: any): void {
		this.selectedTreeNode = event.selectedData[0];
		if (!this.selectedTreeNode.expanded) {
			this.selectedTreeNode.expanded = true;
		}
	}

	/**
	 * グループ選択時のイベントハンドラ
	 * @param event イベント
	 */
	public onSelectedGroup(event: any): void {
		this.selectedDataGrid = this.groupSelectDataGrid.getSelectedData()[0];
	}
}
