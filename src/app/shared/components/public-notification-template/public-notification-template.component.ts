import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMPublicNotificationTemplateService } from 'app/shared/services/apis/public-notification-template.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { TabView } from 'primeng/tabview';

import { Component, OnInit, ViewChild, AfterViewInit, signal } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMDataGridColumn, EIMDataGridComponent } from '../data-grid/data-grid.component';
import { EIMEntrySelectorComponentService } from '../entry-selector/entry-selector.component.service';
import { EIMSearchResult } from '../entry-selector/multiple-entry-selector.component';
import { EIMGroupNameRendererComponent } from '../renderer/group-name-renderer.component';
import { EIMNameRendererComponent } from '../renderer/name-renderer.component';
import { EIMRoleNameKanaRendererComponent } from '../renderer/role-name-kana-renderer.component';
import { EIMRoleNameRendererComponent } from '../renderer/role-name-renderer.component';
import { EIMTooltipRendererComponent } from '../renderer/tooltip-renderer.component';
import { EIMUserDefaultRendererComponent } from '../renderer/user-default-renderer.component';
import { EIMTreeComponent } from '../tree/tree.component';
import { EIMTreeNode } from '../tree/tree.component.service';

/** タブインデックス */
enum tabIndexConst {
	TAB_INDEX_USER = 0,
	TAB_INDEX_GROUP = 1,
	TAB_INDEX_ROLE = 2,
	TAB_INDEX_COMPLEX_GROUP = 3,
}

/**
 * 公開通知テンプレートコンポーネント
 */
 @Component({
    template: '',
    standalone: false
})
 export abstract class EIMPublicNotificationTemplateComponent implements OnInit, AfterViewInit {
	/** フォームグループ */
	templateForm = new UntypedFormGroup({
		templateName: new UntypedFormControl('')
	});

	/** ユーザ検索条件 */
	keyword = '';

	/** 入力最大数 */
	inputMaxLength = EIMConstantService.INPUT_MAX_LENGTH;

	/** 選択済み一覧データグリッド */
	@ViewChild('destinationListGrid') destinationListGrid: EIMDataGridComponent;
	/** ユーザ一覧データグリッド */
	@ViewChild('userListGrid') userListGrid: EIMDataGridComponent;
	/** グループユーザ一覧データグリッド */
	@ViewChild('groupUserListGrid') groupUserListGrid: EIMDataGridComponent;
	/** ロールユーザ一覧データグリッド */
	@ViewChild('roleUserListGrid') roleUserListGrid: EIMDataGridComponent;
	/** 複合グループユーザ一覧データグリッド */
	@ViewChild('complexGroupUserListGrid') complexGroupUserListGrid: EIMDataGridComponent;
	/** グループツリー */
	@ViewChild('groupTree') groupTree: EIMTreeComponent;
	/** ロールツリー */
	@ViewChild('roleTree') roleTree: EIMTreeComponent;
	/** 複合グループツリー */
	@ViewChild('complexGroupTree') complexGroupTree: EIMTreeComponent;

	/** ユーザ検索リスト */
	protected searchResultUserList: EIMSearchResult = { data: [] };
	/** グループユーザ検索リスト */
	protected searchResultGroupUserList: EIMSearchResult = { data: [] };
	/** ロールユーザ検索リスト */
	protected searchResultRoleUserList: EIMSearchResult = { data: [] };
	/** 複合グループユーザ検索リスト */
	private searchResultComplexGroupUserList: EIMSearchResult = {data: []};

	protected initData = [];

	/** 選択済みエントリー件数 */
	protected destinationCount = 0;

	/** 選択中タブ */
	selectedTab = signal(0); // 初期タブインデックス


	/**
	 * コンストラクタです.
	 * @param messageService メッセージサービス
	 * @param publicNotificationTemplateService 公開通知テンプレートサービス
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected entryService: EIMEntryService,
		public treeComponentService: EIMEntrySelectorComponentService,
		protected publicNotificationTemplateService: EIMPublicNotificationTemplateService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 選択対象の行かどうか判定します.
	 * @param arg1 比較対象1
	 * @param arg2 比較対象2
	 */
	defaultEquals(obj1: any, obj2: any): boolean {
		return Number(obj1.entryId) === Number(obj2.entryId);
	};

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	ngOnInit() {
	}

	ngAfterViewInit(){
		let columns: EIMDataGridColumn[];

		// 選択済み一覧
		columns = [];
		columns.push({ field: 'entryTypeName', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 130, suppressFilter: true });
		columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 266, suppressFilter: true });
		this.destinationListGrid.setColumns(columns);
		// 選択済み一覧に追加
		window.setTimeout(() => {
			this.destinationListGrid.setData(this.initData);
		});

		// ユーザ一覧
		columns = [];
		columns.push({ field: 'userCode', headerName: this.translateService.instant('EIM.LABEL_02001'), width: 100, suppressFilter: true, cellRendererFramework: EIMUserDefaultRendererComponent });
		columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 100, suppressFilter: true, cellRendererFramework: EIMNameRendererComponent });
		columns.push({ field: 'groupName', headerName: this.translateService.instant('EIM.LABEL_02003'), width: 145, cellRendererFramework: EIMGroupNameRendererComponent, suppressFilter: true });
		columns.push({ field: 'roleName', headerName: this.translateService.instant('EIM.LABEL_02004'), width: 145, cellRendererFramework: EIMRoleNameRendererComponent, suppressFilter: true });
		columns.push({ field: 'userKana', headerName: this.translateService.instant('EIM.LABEL_02047'), width: 92, suppressFilter: true, cellRendererFramework: EIMRoleNameKanaRendererComponent });
		this.userListGrid.setColumns(columns);

		// グループユーザ一覧
		columns = [];
		columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 200, suppressFilter: true, cellRendererFramework: EIMNameRendererComponent });
		columns.push({ field: 'roleName', headerName: this.translateService.instant('EIM.LABEL_02004'), width: 183, cellRendererFramework: EIMRoleNameRendererComponent, suppressFilter: true });
		this.groupUserListGrid.setColumns(columns);

		// ロールユーザ一覧
		columns = [];
		columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 200, suppressFilter: true, cellRendererFramework: EIMNameRendererComponent });
		columns.push({ field: 'groupName', headerName: this.translateService.instant('EIM.LABEL_02003'), width: 183, cellRendererFramework: EIMGroupNameRendererComponent, suppressFilter: true });
		this.roleUserListGrid.setColumns(columns);

		// 複合グループユーザ一覧
		columns = [];
		columns.push({field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 100, suppressFilter: true});
		columns.push({field: 'groupName', headerName: this.translateService.instant('EIM.LABEL_02003'), width: 145, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		columns.push({field: 'roleName', headerName: this.translateService.instant('EIM.LABEL_02004'), width: 138, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		this.complexGroupUserListGrid.setColumns(columns);
	}

	/**
	 * タブ変更のイベントハンドラです.
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		this.selectedTab.set(event);

		if (event === tabIndexConst.TAB_INDEX_GROUP) {
			this.showGroup();
		} else if (event === tabIndexConst.TAB_INDEX_ROLE) {
			this.showRole();
		} else if (event === tabIndexConst.TAB_INDEX_COMPLEX_GROUP) {
			this.showCompGroup();
		} else if (event === tabIndexConst.TAB_INDEX_USER) {
			this.userListGridFilter();
		}
	}

	/**
	 * ユーザ検索ボタン押下のイベントハンドラです.
	 * @param event イベント
	 */
	onClickUserSearh(event: any): void {
		// キーワード指定でユーザ一覧取得
		this.entryService.getUserList(this.keyword, true).subscribe(
			(object: any) => {
				if (object.users.user !== void 0 || object.users.user != null) {
					// ユーザ検索リストを保持
					this.searchResultUserList.data = this.entryService.convertUsersToEntrys(object.users.user);
					// 選択済み一覧に表示されていないエントリのみ表示
					this.userListGrid.setData(this.searchResultUserList.data);
					this.userListGridFilter();

				} else {
					this.searchResultUserList.data = [];
					this.userListGrid.setData([]);
					this.messageService.showGrowl(this.translateService.instant('EIM.INFO_00003'));
				}
			}
		);
	}

	/**
	 * グループツリー選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectGruopTree(event: any): void {
		// グループ所属ユーザリスト取得
		this.entryService.getGroupUserList(this.groupTree.getSelectedData()[0].data.entryId, null, true).subscribe(
			(object: any) => {
				// グループユーザ検索リストを保持
				if (object.users.user !== void 0 || object.users.user != null) {
					this.searchResultGroupUserList.data = this.entryService.convertUsersToEntrys(object.users.user);
				} else {
					this.searchResultGroupUserList.data = [];
				}
				this.groupUserListGrid.setData(this.searchResultGroupUserList.data);
			}
		);
		// グループツリー展開
		event.selectedData[0].expanded = true;
	}

	/**
	 * グループタブのユーザー一覧選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectGruopUserList(event: any): void {
		this.groupTree.select([], false);
	}

	/**
	 * ロールツリー選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectRoleTree(event: any): void {
		// ロール所属ユーザリスト取得
		this.entryService.getRoleUserList(this.roleTree.getSelectedData()[0].data.entryId, null, true).subscribe(
			(object: any) => {
				// ロールユーザ検索リストを保持
				if (object.users.user !== void 0 || object.users.user != null) {
					this.searchResultRoleUserList.data = this.entryService.convertUsersToEntrys(object.users.user);
				} else {
					this.searchResultRoleUserList.data = [];
				}
				this.roleUserListGrid.setData(this.searchResultRoleUserList.data);
			}
		);

		// ロールツリー展開
		event.selectedData[0].expanded = true;
	}

	/**
	 * ロールタブのユーザー一覧選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectRoleUserList(event: any): void {
		this.roleTree.select([], false);
	}

	/**
	 * 複合グループツリー選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectComplexGroupTree(event: any): void {

		// 複合グループ所属ユーザリスト取得
		this.entryService.getComplexGroupUserList(this.complexGroupTree.getSelectedData()[0].data.entryId, null, true).subscribe(
				(object: any) => {
					// 複合グループユーザ検索リストを保持
					if (object.userList.user !== void 0 || object.userList.user != null) {
						this.searchResultComplexGroupUserList.data = this.entryService.convertUsersToEntrys(object.userList.user);
					} else {
						this.searchResultComplexGroupUserList.data = [];
					}
					// 公開通知先一覧に表示されていないエントリのみ表示
					this.complexGroupUserListGrid.setData(this.searchResultComplexGroupUserList.data);
				}
		);
	}

	/**
	 * 複合グループタブのユーザー一覧選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectComplexGroupUserList(event: any): void {
		this.complexGroupTree.select([], false);
	}

	/**
	 * 追加ボタン押下時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectEntryAdd(event: any): void {
		// 追加対象エントリ
		let addEntrys: any[] = [];
		if (this.getSelectedTabIndex() === tabIndexConst.TAB_INDEX_USER) {
			// ユーザリスト
			addEntrys = addEntrys.concat(this.getSelectedEntryByGrid(this.userListGrid));

		} else if (this.getSelectedTabIndex() === tabIndexConst.TAB_INDEX_GROUP) {
			// グループツリー
			addEntrys = addEntrys.concat(this.getSelectedEntryByTree(this.groupTree));
			// グループユーザリスト
			addEntrys = addEntrys.concat(this.getSelectedEntryByGrid(this.groupUserListGrid));

		} else if (this.getSelectedTabIndex() === tabIndexConst.TAB_INDEX_ROLE) {
			// ロールツリー
			addEntrys = addEntrys.concat(this.getSelectedEntryByTree(this.roleTree));
			// ロールユーザリスト
			addEntrys = addEntrys.concat(this.getSelectedEntryByGrid(this.roleUserListGrid));

		} else if (this.getSelectedTabIndex() === tabIndexConst.TAB_INDEX_COMPLEX_GROUP) {
			// 複合グループツリー
			addEntrys = addEntrys.concat(this.getSelectedEntryByTree(this.complexGroupTree));
			// 複合グループユーザリスト
			addEntrys = addEntrys.concat(this.getSelectedEntryByGrid(this.complexGroupUserListGrid));
		}

		if (0 < addEntrys.length) {
			// 選択行番号取得
			let currUserDataGrid = this.getCurrUserDataGrid();
			let rowIndex: number = currUserDataGrid.getFirstRowIndex();
			let scrollTop: number = currUserDataGrid.getScrollTop();

			let initMap = new Map();
			for (let i = 0; i < this.initData.length; i++) {
				initMap.set(this.initData[i].entryObjId, this.initData[i]);
			}

			let initAddData: any;
			for (let i = 0; i < addEntrys.length; i++) {
				initAddData = initMap.get(Number(addEntrys[i].entryId));
				if (initAddData) {
					addEntrys[i] = initAddData;
				}
			}

			// 選択済み一覧に追加
			this.destinationListGrid.addRowData(addEntrys);
			// ユーザータブのユーザー一覧更新
			this.userListGridFilter();
			// 候補一覧の行選択
			currUserDataGrid.setSelectRow(rowIndex, scrollTop);

			// 選択済み一覧に追加されたデータ行選択
			this.destinationListGrid.select(addEntrys);
			let rowIndex2 = this.destinationListGrid.getFirstRowIndex();
			if (0 < rowIndex2) {
				this.destinationListGrid.ensureIndexVisible(rowIndex2);
			}

			this.destinationCount = this.destinationListGrid.getRowCount();
		}
	}

	/**
	 * 選択済み一覧から削除ボタン押下時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectEntryDelete(event: any): void {
		// 選択済み一覧の行番号取得
		let rowIndex: number = this.destinationListGrid.getFirstRowIndex();
		let scrollTop: number = this.destinationListGrid.getScrollTop();
		// 選択済み一覧から削除
		let deleteDataList = this.destinationListGrid.getSelectedData();

		if (0 < deleteDataList.length) {
			this.destinationListGrid.removeRowData(deleteDataList);

			// 選択済み一覧の行選択
			this.destinationListGrid.setSelectRow(rowIndex, scrollTop);
			// ユーザータブのユーザー一覧更新
			this.userListGridFilter();

			// 候補一覧で選択済み一覧から削除されたデータを選択
			this.selectDataCurrUserDataGrid(deleteDataList);
		}

		this.destinationCount = this.destinationListGrid.getRowCount();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * グループを表示します．
	 */
	private showGroup(): void {
		if (0 < this.groupTree.info.data.length) {
			return;
		}
		// グループタブ選択時、グループ一覧取得
		this.entryService.getGroupList(null, true)
			.subscribe(
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
	 * ロールを表示します．
	 */
	private showRole(): void {
		if (0 < this.roleTree.info.data.length) {
			return;
		}
		// ロールタブ選択時、ロール一覧取得
		this.entryService.getRoleList(null, true).subscribe(
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
	 * 複合グループを表示します．
	 */
	private showCompGroup(): void {
		if (0 < this.complexGroupTree.info.data.length) {
			return;
		}
		// 複合グループタブ選択時、複合グループ一覧取得
		this.entryService.getComplexGroupList(null, true).subscribe(
			(object: any) => {
				// 複合グループツリーに要素を設定
				if (object.compList.comp != null) {
					let treeNodes: EIMTreeNode[] = this.treeComponentService.convertComplexGroupsToTreeNodes(object.compList.comp);
					if (treeNodes) {
						this.complexGroupTree.setData(treeNodes);
					}
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
	 * データグリッド選択アイテムを取得します.
	 * @param grid データグリッド
	 * @return データグリッド選択アイテムリスト
	 */
	private getSelectedEntryByGrid(grid: EIMDataGridComponent): any[] {
		let rtEntrys: any[] = [];
		for (let j = 0; j < grid.getSelectedData().length; j++) {
			if (!this.isIncludeEntry(grid.getSelectedData()[j])) {
				rtEntrys.push(grid.getSelectedData()[j]);
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
		let checkData = this.destinationListGrid.getData();
		for (let i = 0; i < checkData.length; i++) {
			if (Number(target.entryId) === Number(checkData[i].entryId)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 選択タブインデックスを取得します.
	 * @return 選択タブインデックス
	 */
	private getSelectedTabIndex(): number {
		return this.selectedTab();
	}

	/**
	 * 選択されたタブのユーザ一覧に削除データを選択する.
	 * @param selectedData 選択データ
	 */
	private selectDataCurrUserDataGrid(selectedData: any[]): void {
		// 現在ユーザデータグリッド取得
		let currUserDataGrid = this.getCurrUserDataGrid();
		currUserDataGrid.select(selectedData);
		let rowIndex = currUserDataGrid.getFirstRowIndex();
		if (0 < rowIndex) {
			currUserDataGrid.ensureIndexVisible(rowIndex);
		}
	}

	/**
	 * 現在ユーザデータグリッドを取得します.
	 * @returns 現在ユーザデータグリッド
	 */
	private getCurrUserDataGrid(): EIMDataGridComponent {
		let searchResultDataGrid: EIMDataGridComponent;

		switch (this.getSelectedTabIndex()) {
			case tabIndexConst.TAB_INDEX_USER:
				searchResultDataGrid = this.userListGrid;
				break;
			case tabIndexConst.TAB_INDEX_GROUP:
				searchResultDataGrid = this.groupUserListGrid;
				break;
			case tabIndexConst.TAB_INDEX_ROLE:
				searchResultDataGrid = this.roleUserListGrid;
				break;
			case tabIndexConst.TAB_INDEX_COMPLEX_GROUP:
				searchResultDataGrid = this.complexGroupUserListGrid;
				break;
			default:
				searchResultDataGrid = this.userListGrid;
				break;
		}
		return searchResultDataGrid;
	}

	/**
	 * ユーザ一覧にフィルタを実行します.
	 * @param info 単体選択データグリッドコンポーネント情報
	 */
	private userListGridFilter(): void {
		this.userListGrid.info.gridApi.setGridOption('isExternalFilterPresent', () => {
			return this.isExternalFilterPresent();
		});

		this.userListGrid.info.gridApi.setGridOption('doesExternalFilterPass', (node): boolean => {
			return this.doesExternalFilterPass(node, this.destinationListGrid.getData());
		});

		this.userListGrid.info.gridApi.onFilterChanged();
		// this.userListGrid.refreshView();

		// 合計数、選択数を更新
		this.updateRowCountAndSelectedData();
	}

	/**
	 * 外部フィルタが存在するかどうか.
	 * @return 存在する場合trueを返却.
	 */
	private isExternalFilterPresent(): boolean {
		return true;
	}

	/**
	 * 外部フィルタを実行します.
	 * @param node ノード
	 * @param unvisibleData 非表示データ
	 * @return 表示対象ならtrueを返却
	 */
	private doesExternalFilterPass(node: any, unvisibleData?: any[]): boolean {

		if (node.hasOwnProperty('data')) {
			node = node.data;
		}

		for (let i = 0; i < unvisibleData.length; i++) {
			if (this.defaultEquals(node, unvisibleData[i])) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 件数を更新します.
	 * @param info 単体選択データグリッドコンポーネント情報
	 */
	private updateRowCountAndSelectedData(): void {
		// 合計数から外部フィルタされた行数を除く
		this.userListGrid.info.rowCount = this.userListGrid.info.gridApi.getDisplayedRowCount();

		// 選択数からフィルタされた行数を除く
		let selectedData: any[] = [];
		let selectDataOld: any[] = this.userListGrid.getSelectedData();
		for (let i = 0; i < selectDataOld.length; i++) {
			let node = selectDataOld[i];
			if (this.userListGrid.info.gridOptions.doesExternalFilterPass(node)) {
				selectedData.push(selectDataOld[i]);
			}
		}
		this.userListGrid.select(selectedData);
	}

}
