import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output, signal } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TabView } from 'primeng/tabview';
import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMAdminsRoleService } from 'app/admins/shared/services/apis/admins-role.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMGroupAndRoleMultipleSelectorTreeComponentService } from 'app/admins/components/group-and-role-selector/group-and-role-multiple-selector-tree.component.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminsGroupService } from 'app/admins/shared/services/apis/admins-group.service';
import { EIMGroupOrRoleNameRendererComponent } from 'app/admins/shared/components/renderer/group-or-role-name-renderer.component';
import { EIMConstantService } from 'app/shared/services/constant.service';

/** タブインデックス */
export namespace tabIndexConst {
	export const TAB_INDEX_GROUP = 0;
	export const TAB_INDEX_ROLE = 1;
}

/**
 * グループ/ロール選択コンポーネント
 * @example
 * <eim-group-and-role-multiple-selector
 * 		[activeTab]="activeTab"
 * 		[destination]="destination">
 * </eim-group-and-role-multiple-selector>
 */
@Component({
    selector: 'eim-group-and-role-multiple-selector',
    templateUrl: './group-and-role-multiple-selector.component.html',
    styleUrls: ['./group-and-role-multiple-selector.component.css'],
    providers: [
        EIMGroupAndRoleMultipleSelectorTreeComponentService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMGroupAndRoleMultipleSelectorComponent) }
    ],
    standalone: false
})

export class EIMGroupAndRoleMultipleSelectorComponent implements OnInit, EIMComponent, EIMSelectable {

	/** 選択済み一覧設定対象ドキュメント */
	@Input()
	set activeTab(value: number) {
		this.selectedTab.set(value) 
	}

	get activeTab(): number {
		return this.selectedTab();
	}
  	selectedTab = signal(tabIndexConst.TAB_INDEX_GROUP);

	/** タブ */
	@ViewChild('entryTabView', { static: true }) entryTabView: TabView;
	/** 選択済み一覧データグリッド */
	@ViewChild('destinationListGrid', { static: true }) destinationListGrid: EIMDataGridComponent;
	/** グループツリー */
	@ViewChild('groupTree', { static: true }) groupTree: EIMTreeComponent;
	/** ロールツリー */
	@ViewChild('roleTree', { static: true }) roleTree: EIMTreeComponent;
	/** 選択済み一覧 */
	@Input() destination: any[];
	/** 選択済み一覧処理完了のイベントエミッタ */
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();
	/** 選択ボタン表示・非表示 */
	public disabled = false;
	/** 選択ボタン押下可否 */
	public selectableFlg = false;

	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 * @param messageService メッセージサービス
	 * @param entryService エントリサービス
	 * @param treeComponentService ツリーコンポーネントサービス
	 * @param formBuilder フォームビルダー
	 */
	constructor(
			private translateService: TranslateService,
			private messageService: EIMMessageService,
			private entryService: EIMEntryService,
			public treeComponentService: EIMGroupAndRoleMultipleSelectorTreeComponentService,
			protected adminsGroupService: EIMAdminsGroupService,
			protected adminsRoleService: EIMAdminsRoleService,
			public formBuilder: UntypedFormBuilder,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択ボタン押下時の処理を実施します.
	 */
	public select(): void {
		this.selected.emit(this.destinationListGrid.getData());
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 * @return 選択ボタン押下可否
	 */
	public selectable(): boolean {
		if (this.selectableFlg) {
			return true;
		} else {
			return false;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = null;
		// 選択済み一覧
		columns = [];
		columns.push({field: 'entryTypeName', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 120, suppressFilter: true});
		columns.push({field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 325, cellRendererFramework: EIMGroupOrRoleNameRendererComponent, suppressFilter: true});
		this.destinationListGrid.setColumns(columns);
		// 選択済み一覧に追加
		this.destinationListGrid.setData(this.destination);
		if ( this.activeTab === tabIndexConst.TAB_INDEX_GROUP ) {
			this.showGroup();
		} else if ( this.activeTab === tabIndexConst.TAB_INDEX_ROLE ) {
			this.showRole();
		}
	}

	/**
	 * タブ変更のイベントハンドラです.
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		this.activeTab = event;
		if (event === tabIndexConst.TAB_INDEX_GROUP) {
			this.showGroup();
		} else if (event === tabIndexConst.TAB_INDEX_ROLE) {
			this.showRole();
		}
	}

	/**
	 * 選択済み一覧に追加ボタン押下時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectEntryAdd(event: any): void {
		// 追加対象エントリ
		let addEntrys: any[] = [];
		if (this.activeTab === tabIndexConst.TAB_INDEX_GROUP) {
			// グループツリー
			addEntrys = addEntrys.concat(this.getSelectedEntryByTree(this.groupTree));
		} else if (this.activeTab === tabIndexConst.TAB_INDEX_ROLE) {
			// ロールツリー
			addEntrys = addEntrys.concat(this.getSelectedEntryByTree(this.roleTree));
		}

		// グリッドリストに表示されている最後尾のグループのインデックス取得する
		let groupCount = 0;
		let roleCount = 0;
		let destinationListGrid = this.destinationListGrid.getData();
		for (let i = 0; i < destinationListGrid.length; i++) {
			let contents: any = destinationListGrid[i];
			if (contents.entryTypeId === EIMConstantService.ENTRY_TYPE_GROUP) {
				groupCount++;
				roleCount++;
			} else if (contents.entryTypeId === EIMConstantService.ENTRY_TYPE_ROLE) {
				roleCount++;
			}
		}

		if (0 < addEntrys.length) {
			for (let i = 0; i < addEntrys.length; i++) {
				if (addEntrys[i].entryTypeId === EIMConstantService.ENTRY_TYPE_GROUP) {
					// 選択済み一覧のグループ最後尾に追加
				this.destinationListGrid.addRowDataToIndex(addEntrys, groupCount);
				} else if (addEntrys[i].entryTypeId === EIMConstantService.ENTRY_TYPE_ROLE) {
					// 選択済み一覧のロール最後尾に追加
					this.destinationListGrid.addRowDataToIndex(addEntrys, roleCount);
				}
			}
			this.selectableFlg = true;
		}
	}

	/**
	 * 選択済み一覧から削除ボタン押下時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectEntryDelete(event: any): void {
		let deleteData = this.destinationListGrid.getSelectedData();
		if (0 < deleteData.length) {
			// 選択済み一覧から削除
			this.destinationListGrid.removeRowData(deleteData);
			this.selectableFlg = true;
		}
	}

	/**
	 * ツリーノード選択イベントハンドラです.
	 * @param event イベント
	 */
	onSelectTreeNode(event: any) {
		if (event.selectedData[0].hasOwnProperty('expanded')) {
			event.selectedData[0].expanded = true;
		}

		if (event.selectedData[0].parent) {
			let parentNode = event.selectedData[0].parent;
			parentNode.expanded = true;
			if (parentNode.parent) {
				parentNode = parentNode.parent;
				parentNode.expanded = true;
			}
		}
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * グループ一覧を表示します．
	 */
	private showGroup(): void {
		if ( this.groupTree.info && 0 < this.groupTree.info.data.length) {
			return;
		}
		// グループタブ選択時、グループ一覧取得
		this.adminsGroupService.getGroupList().subscribe(
			(object: any) => {
				// グループツリーに要素を設定
				if (object.groups.group != null) {
					let treeNodes: EIMTreeNode[] = this.treeComponentService.convertGroupsToTreeNodes(object.groups.group);
					this.groupTree.setData(treeNodes);
				}
			}
		);
	}

	/**
	 * ロール一覧を表示します．
	 */
	private showRole(): void {
		if ( this.roleTree.info && 0 < this.roleTree.info.data.length) {
			return;
		}
		// ロールタブ選択時、ロール一覧取得
		this.adminsRoleService.getRoleList().subscribe(
			(object: any) => {
				// ロールツリーに要素を設定
				if (object.roles.role != null) {
					let treeNodes: EIMTreeNode[] = this.treeComponentService.convertRolesToTreeNodes(object.roles.role);
					this.roleTree.setData(treeNodes);
				}
			}
		);
	}

	/**
	 * ツリー選択アイテムを取得します.
	 * @param tree ツリー
	 * @return ツリー選択アイテムリスト
	 */
	private getSelectedEntryByTree(tree: EIMTreeComponent): any[] {
		let rtEntrys: any[] = [];
		for (let i = 0; i < tree.getSelectedData().length; i++) {
			if (tree.getSelectedData()[i] != null) {
				if (!this.isIncludeEntry(tree.getSelectedData()[i].data)) {
					rtEntrys.push(tree.getSelectedData()[i].data);
				}
			}
		}
		return rtEntrys;
	}

	/**
	 * エントリに含まれているか判定します.
	 * @param target 判定対象
	 * @return 判定結果
	 */
	private isIncludeEntry(target: any): boolean {
		for (let i = 0; i < this.destinationListGrid.getData().length; i++) {
			if (target.entryId === this.destinationListGrid.getData()[i].entryId) {
				return true;
			}
		}
		return false;
	}
}
