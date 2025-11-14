import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output, signal } from '@angular/core';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UntypedFormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem, EIMSelectable } from 'app/shared/shared.interface';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTextInputFormItemComponent } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';

import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDocumentPublicDestinationSelectorTreeComponentService } from 'app/documents/components/document-public-destination-selector/document-public-destination-selector-tree.component.service';
import { EIMPublicNotificationTemplateService, EIMPublicNotificationTemplateNode } from 'app/shared/services/apis/public-notification-template.service';
import { EIMDialogSharedManagerComponentService } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';

/** タブインデックス */
export namespace tabIndexConst {
	export const TAB_INDEX_USER = 0;
	export const TAB_INDEX_GROUP = 1;
	export const TAB_INDEX_ROLE = 2;
	export const TAB_INDEX_COMPLEX_GROUP = 3;
	export const TAB_INDEX_TEMPLATE = 4;
}

/** 検索結果情報インターフェース */
export interface EIMSearchResult {
	data: any[];
}


/**
 * 公開通知先選択コンポーネント
 * @example
 * 		<eim-document-public-destination-selector>
 * 		</eim-document-public-destination-selector>
 */
@Component({
    selector: 'eim-document-public-destination-selector',
    templateUrl: './document-public-destination-selector.component.html',
    styleUrls: ['./document-public-destination-selector.component.css'],
    providers: [
        EIMDocumentPublicDestinationSelectorTreeComponentService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentPublicDestinationSelectorComponent) }
    ],
    standalone: false
})
export class EIMDocumentPublicDestinationSelectorComponent implements OnInit, EIMComponent, EIMSelectable {

	/** 公開通知先一覧データグリッド */
	@ViewChild('destinationListGrid', { static: true }) destinationListGrid: EIMDataGridComponent;
	/** ユーザ一覧データグリッド */
	@ViewChild('userListGrid', { static: true }) userListGrid: EIMDataGridComponent;
	/** グループユーザ一覧データグリッド */
	@ViewChild('groupUserListGrid', { static: true }) groupUserListGrid: EIMDataGridComponent;
	/** ロールユーザ一覧データグリッド */
	@ViewChild('roleUserListGrid', { static: true }) roleUserListGrid: EIMDataGridComponent;
	/** 複合グループユーザ一覧データグリッド */
	@ViewChild('complexGroupUserListGrid', { static: true }) complexGroupUserListGrid: EIMDataGridComponent;
	/** グループツリー */
	@ViewChild('groupTree', { static: true }) groupTree: EIMTreeComponent;
	/** ロールツリー */
	@ViewChild('roleTree', { static: true }) roleTree: EIMTreeComponent;
	/** 複合グループツリー */
	@ViewChild('complexGroupTree', { static: true }) complexGroupTree: EIMTreeComponent;
	/** テンプレートツリー */
	@ViewChild('templateTree', { static: true }) templateTree: EIMTreeComponent;
	/** テンプレートエントリーデータグリッド */
	@ViewChild('templateAssignListGrid', { static: true }) templateAssignListGrid: EIMDataGridComponent;

	/** 公開通知先設定対象ドキュメント */
	@Input() documentId: number;
	/** 設定済み公開通知先 */
	@Input() destination: any[];

	/** 公開通知先選択処理完了のイベントエミッタ */
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();

	/** ユーザ検索リスト */
	private searchResultUserList: EIMSearchResult = {data: []};
	/** グループユーザ検索リスト */
	private searchResultGroupUserList: EIMSearchResult = {data: []};
	/** ロールユーザ検索リスト */
	private searchResultRoleUserList: EIMSearchResult = {data: []};
	/** 複合グループユーザ検索リスト */
	private searchResultComplexGroupUserList: EIMSearchResult = {data: []};
	/** テンプレート検索リスト */
	private searchResultTemplateAssignList: EIMSearchResult = { data: [] };

	/** テンプレートメニュー */
	public templateMenuItems: EIMMenuItem[] = [];
	private templateCreateMenuItem: EIMMenuItem;
	private templateUpdateMenuItem: EIMMenuItem;
	private templateDeleteMenuItem: EIMMenuItem;

	/** ユーザ検索条件 */
	public userSearchCondition: string = null;


	public disabled = false;

    /** 選択中タブ */
    selectedTab = signal(0); // 初期タブインデックス

	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 * @param messageService メッセージサービス
	 * @param entryService エントリサービス
	 * @param complexGroupService 複合グループサービス
	 * @param treeComponentService ツリーコンポーネントサービス
	 * @param publicNotificationTemplateService 公開通知テンプレートサービス
	 * @param dialogManagerComponentService ダイアログマネージャコンポーネントサービス
	 * @param formBuilder フォームビルダー
	 */
	constructor(
			private translateService: TranslateService,
			private messageService: EIMMessageService,
			private entryService: EIMDocumentsEntryService,
			public treeComponentService: EIMDocumentPublicDestinationSelectorTreeComponentService,
			private publicNotificationTemplateService: EIMPublicNotificationTemplateService,
			private dialogManagerComponentService: EIMDialogSharedManagerComponentService,
			formBuilder: UntypedFormBuilder,
	) {
		this.userSearchCondition = '';
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
	 */
	public selectable(): boolean {
		return true;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = null;

		// 公開通知先一覧
		columns = [];
		columns.push({field: 'entryTypeName', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 120, suppressFilter: true});
		columns.push({field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 275, suppressFilter: true});
		this.destinationListGrid.setColumns(columns);
		this.destinationListGrid.setData(this.destination);

		// ユーザ一覧
		columns = [];
		columns.push({field: 'userCode', headerName: this.translateService.instant('EIM.LABEL_02001'), width: 100, suppressFilter: true});
		columns.push({field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 100, suppressFilter: true});
		columns.push({field: 'groupName', headerName: this.translateService.instant('EIM.LABEL_02003'), width: 145, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		columns.push({field: 'roleName', headerName: this.translateService.instant('EIM.LABEL_02004'), width: 145, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		columns.push({field: 'userKana', headerName: this.translateService.instant('EIM.LABEL_02047'), width: 100, suppressFilter: true});
		this.userListGrid.setColumns(columns);

		// グループユーザ一覧
		columns = [];
		columns.push({field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 150, suppressFilter: true});
		columns.push({field: 'groupName', headerName: this.translateService.instant('EIM.LABEL_02003'), width: 250, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		columns.push({field: 'roleName', headerName: this.translateService.instant('EIM.LABEL_02004'), width: 250, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		this.groupUserListGrid.setColumns(columns);

		// ロールユーザ一覧
		columns = [];
		columns.push({field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 150, suppressFilter: true});
		columns.push({field: 'groupName', headerName: this.translateService.instant('EIM.LABEL_02003'), width: 250, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		columns.push({field: 'roleName', headerName: this.translateService.instant('EIM.LABEL_02004'), width: 250, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		this.roleUserListGrid.setColumns(columns);

		// 複合グループユーザ一覧
		columns = [];
		columns.push({field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 150, suppressFilter: true});
		columns.push({field: 'groupName', headerName: this.translateService.instant('EIM.LABEL_02003'), width: 250, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		columns.push({field: 'roleName', headerName: this.translateService.instant('EIM.LABEL_02004'), width: 250, cellRendererFramework: EIMTooltipRendererComponent, suppressFilter: true});
		this.complexGroupUserListGrid.setColumns(columns);

		// テンプレート一覧
		columns = [];
		columns.push({ field: 'entryTypeName', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 120, suppressFilter: true });
		columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 322, suppressFilter: true });
		this.templateAssignListGrid.setColumns(columns);

		this.templateCreateMenuItem = { label: this.translateService.instant('EIM.LABEL_03005'), icon: 'eim-icon-plus', command: event => this.onClickCreateTemplate(event) };
		this.templateUpdateMenuItem = { label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: event => this.onClickUpdateTemplate(event) };
		this.templateDeleteMenuItem = { label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: event => this.onClickDeleteTemplate(event) };
		this.templateMenuItems.push(this.templateCreateMenuItem, this.templateUpdateMenuItem, this.templateDeleteMenuItem);
	}

	/**
	 * タブ変更のイベントハンドラです.
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		this.selectedTab.set(event);

		if (event === tabIndexConst.TAB_INDEX_GROUP) {

			if (this.groupTree.info.data.length > 0) {
				return;
			}
			// グループタブ選択時、グループ一覧取得
			this.entryService.getGroupList(this.documentId, true)
			.subscribe(
				(object: any) => {
					// グループツリーに要素を設定
					if (object.groups.group != null) {
						let treeNodes: EIMTreeNode[] = this.treeComponentService.convertGroupsToTreeNodes(object.groups.group);
						this.groupTree.setData(treeNodes);
					}
				}
			);

		} else if (event === tabIndexConst.TAB_INDEX_ROLE) {

			if (this.roleTree.info.data.length > 0) {
				return;
			}
			// ロールタブ選択時、ロール一覧取得
			this.entryService.getRoleList(this.documentId, true)
				.subscribe(
					(object: any) => {
						// ロールツリーに要素を設定
						if (object.roles.role != null) {
							let treeNodes: EIMTreeNode[] = this.treeComponentService.convertRolesToTreeNodes(object.roles.role);
							this.roleTree.setData(treeNodes);
						}
					}
			);

		} else if (event === tabIndexConst.TAB_INDEX_COMPLEX_GROUP) {

			if (this.complexGroupTree.info.data.length > 0) {
				return;
			}
			// 複合グループタブ選択時、複合グループ一覧取得
			this.entryService.getComplexGroupList(this.documentId, true)
				.subscribe(
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
		} else if (event === tabIndexConst.TAB_INDEX_TEMPLATE) {

			if (0 < this.templateTree.getData().length) {
				return;
			}
			// テンプレートタブ選択時、テンプレート一覧取得
			this.publicNotificationTemplateService.getTemplateTree()
				.subscribe(
					data => {
						// テンプレートリストに要素を設定
						const treeNodes = this.publicNotificationTemplateService.convertTemplatesToTreeNodes(data);
						this.templateTree.setData(treeNodes);

						// 更新、削除ボタンを無効化
						this.templateUpdateMenuItem.disabled = true;
						this.templateDeleteMenuItem.disabled = true;
					}
				);
		}
	}

	/**
	 * ユーザ検索ボタン押下のイベントハンドラです.
	 * @param event イベント
	 */
	onClickUserSearh(event: any): void {

		// キーワード指定でユーザ一覧取得
		this.entryService.getUserList(this.userSearchCondition, true)
		.subscribe(
			(object: any) => {

				if (object.users.user !== void 0 || object.users.user != null) {
					// ユーザ検索リストを保持
					this.searchResultUserList.data = this.entryService.convertUsersToEntrys(object.users.user);
					// 公開通知先一覧に表示されていないエントリのみ表示
					this.userListGrid.setData(this.getFilterList(this.searchResultUserList.data));
				} else {
					this.searchResultUserList.data = [];
					this.userListGrid.setData([]);
					this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
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
		this.entryService.getGroupUserList(this.groupTree.getSelectedData()[0].data.entryId, this.documentId, true).subscribe(
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
	onSelectGroupUserList(event: any): void {
		this.groupTree.select([], false);
	}

	/**
	 * ロールツリー選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectRoleTree(event: any): void {

		// ロール所属ユーザリスト取得
		this.entryService.getRoleUserList(this.roleTree.getSelectedData()[0].data.entryId, this.documentId, true).subscribe(
				(object: any) => {
					// ロールユーザ検索リストを保持
					if (object.users.user !== void 0 || object.users.user != null) {
						this.searchResultRoleUserList.data = this.entryService.convertUsersToEntrys(object.users.user);
					} else {
						this.searchResultRoleUserList.data = [];
					}
					// 公開通知先一覧に表示されていないエントリのみ表示
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
		this.entryService.getComplexGroupUserList(this.complexGroupTree.getSelectedData()[0].data.entryId, this.documentId, true).subscribe(
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
	 * テンプレート選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectTemplateTree(event: any): void {
		// テンプレート所属エントリーリスト取得
		this.publicNotificationTemplateService.getTemplateAssign(this.templateTree.getSelectedData()[0].data.entryId)
			.pipe(catchError(err => of([])))
			.subscribe(
				assigns => {
					const entries = this.publicNotificationTemplateService.convertTemplateAssignListToEntrys(assigns);
					// テンプレート所属エントリーリストを保持
					this.searchResultTemplateAssignList.data = entries;
					this.templateAssignListGrid.setData(entries);

					this.templateUpdateMenuItem.disabled = false;
					this.templateDeleteMenuItem.disabled = false;
				}
			);
	}

	/**
	 * テンプレートエントリー一覧選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectTemplateAssignList(event: any): void {
		this.templateTree.select([], false);

		// 更新、削除ボタンを無効化
		this.templateUpdateMenuItem.disabled = true;
		this.templateDeleteMenuItem.disabled = true;
	}

	/**
	 * テンプレート登録ボタン押下時のイベントハンドラです.
	 * @param event イベント
	 */
	private onClickCreateTemplate(event: any): void {
		const dialogId = this.dialogManagerComponentService.showPublicNotificationTemplateCreator({
			created: (template: EIMPublicNotificationTemplateNode) => {
				// ツリー、グリッドに更新データを反映
				const setData: EIMTreeNode[] = this.templateTree.getData();
				const pushData = this.publicNotificationTemplateService.convertTemplateToTreeNode(template);
				setData.push(pushData);
				this.templateTree.setData(setData);
				this.templateAssignListGrid.setData([]);

				// 追加したテンプレートを選択
				this.templateTree.select([pushData]);
				this.templateTree.ensureIndexVisible(pushData);

				// 更新、削除ボタンを有効化
				this.templateUpdateMenuItem.disabled = false;
				this.templateDeleteMenuItem.disabled = false;

				this.dialogManagerComponentService.close(dialogId);

				// テンプレートを登録しました。
				this.messageService.showGrowl(this.translateService.instant('EIM.INFO_00004'));
			}
		});
	}

	/**
	 * テンプレート更新ボタン押下時のイベントハンドラです.
	 * @param event イベント
	 */
	private onClickUpdateTemplate(event: any): void {
		const { entryId, entryName } = this.templateTree.getSelectedData()[0].data;
		const destination = this.templateAssignListGrid.getData();
		const dialogId = this.dialogManagerComponentService.showPublicNotificationTemplateUpdater(entryId, entryName, destination, {
			updated: (template: EIMPublicNotificationTemplateNode) => {
				// 更新したテンプレートをツリーに反映
				const data = this.templateTree.getData();
				const updateData = this.publicNotificationTemplateService.convertTemplateToTreeNode(template);
				const removeIndex = data.findIndex(node => node.data.entryId === entryId);
				data.splice(removeIndex, 1, updateData);

				// 更新したテンプレートを選択
				this.templateTree.select([updateData]);
				this.templateTree.ensureIndexVisible(updateData);

				// 更新、削除ボタンを有効化
				this.templateUpdateMenuItem.disabled = false;
				this.templateDeleteMenuItem.disabled = false;

				this.dialogManagerComponentService.close(dialogId);

				// テンプレートを更新しました。
				this.messageService.showGrowl(this.translateService.instant('EIM.INFO_00005'));
			}
		});
	}

	/**
	 * テンプレート削除ボタン押下時のイベントハンドラです.
	 * @param event イベント
	 */
	private onClickDeleteTemplate(event: any): void {
		// テンプレートを削除します。よろしいですか。
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00005'),
			() => {
				const entryId: number = this.templateTree.getSelectedData()[0].data.entryId;
				this.publicNotificationTemplateService.deleteTemplate(entryId)
					.subscribe(_ => {
						// ツリーから削除したテンプレートを削除
						const data = this.templateTree.getData();
						const deleteIndex = data.findIndex(node => node.data.entryId === entryId);
						data.splice(deleteIndex, 1);
						this.templateTree.setData(data);
						this.templateAssignListGrid.setData([]);

						// 削除したテンプレートの前のテンプレートにスクロール位置をあわせる
						if (data.length > 0) {
							this.templateTree.ensureIndexVisible(data[Math.max(deleteIndex - 1, 0)]);
						}

						// 更新、削除ボタンを無効化
						this.templateUpdateMenuItem.disabled = true;
						this.templateDeleteMenuItem.disabled = true;

						// テンプレートを削除しました。
						this.messageService.showGrowl(this.translateService.instant('EIM.INFO_00006'));
					});
			});
	}

	/**
	 * 公開通知先一覧に追加ボタン押下時のイベントハンドラです.
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

		} else if (this.getSelectedTabIndex() === tabIndexConst.TAB_INDEX_TEMPLATE) {
			// テンプレート所属エントリーリスト
			addEntrys = addEntrys.concat(this.getSelectedEntryByTemplateTree());
		}

		// 公開通知先一覧に追加
		this.destinationListGrid.addRowData(addEntrys);

		// 選択行番号取得
		let currUserDataGrid = this.getCurrUserDataGrid();
		let rowIndex: number = currUserDataGrid.getFirstRowIndex();
		let scrollTop: number = currUserDataGrid.getScrollTop();
		// 各タブのユーザ一覧更新
		this.filterAllUserList();

		// 候補一覧の行選択
		let filterFlag  =  this.getFilterFlag();
		if (filterFlag === true) {
			currUserDataGrid.setSelectRow(rowIndex, scrollTop);
		}

		// 選択済み一覧に追加されたデータ行選択
		this.destinationListGrid.select(addEntrys);
		let rowIndex2 = this.destinationListGrid.getFirstRowIndex();
		if (rowIndex2 > 0) {
			this.destinationListGrid.ensureIndexVisible(rowIndex2);
		}
	}

	/**
	 * 公開通知先一覧から削除ボタン押下時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectEntryDelete(event: any): void {
		// 選択済み一覧の行番号取得
		let rowIndex: number = this.destinationListGrid.getFirstRowIndex();
		let scrollTop: number = this.destinationListGrid.getScrollTop();
		// 候補一覧から削除
		let deleteDataList = this.destinationListGrid.getSelectedData();
		this.destinationListGrid.removeRowData(this.destinationListGrid.getSelectedData());

		// 選択済み一覧の行選択
		this.destinationListGrid.setSelectRow(rowIndex, scrollTop);

		// 各タブのユーザ一覧更新
		this.filterAllUserList();

		// 候補一覧に削除されたデータ選択
		this.selectDataCurrUserDataGrid(deleteDataList);
	}

	/**
	 * 選択対象の行かどうか判定します.
	 * @param arg1 比較対象1
	 * @param arg2 比較対象2
	 */
	public defaultEquals(obj1: any, obj2: any): boolean {
		return Number(obj1.entryId) === Number(obj2.entryId);
	};

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
	 * テンプレート選択アイテムを取得します.
	 * @return 選択アイテムリスト
	 */
	private getSelectedEntryByTemplateTree(): any[] {
		let rtEntrys: any[];
		// テンプレートツリーが選択中の場合、データグリッドの全アイテムを設定
		if (this.templateTree.getSelectedData().length) {
			rtEntrys = this.templateAssignListGrid.getData().filter(data => !this.isIncludeEntry(data));
		} else {
			rtEntrys = this.getSelectedEntryByGrid(this.templateAssignListGrid);
		}
		return rtEntrys;
	}

	/**
	 * すべてのタブのユーザ一覧を更新します.
	 * 公開通知先一覧のユーザ一覧をもとに、すべてのタブのユーザ一覧を更新します.
	 */
	private filterAllUserList(): void {
		let filterFlag  =  this.getFilterFlag();
		if (filterFlag === true) {
			this.userListGrid.setData(this.getFilterList(this.searchResultUserList.data));
			this.groupUserListGrid.setData(this.getFilterList(this.searchResultGroupUserList.data));
			this.roleUserListGrid.setData(this.getFilterList(this.searchResultRoleUserList.data));
			this.complexGroupUserListGrid.setData(this.getFilterList(this.searchResultComplexGroupUserList.data));
		}
	}

	/**
	 * 公開先エントリに含まれているか判定します.
	 * @param target 判定対象
	 * @return 判定結果
	 */
	private isIncludeEntry(target: any): boolean {
		for (let i = 0; i < this.destinationListGrid.getData().length; i++) {
			if (Number(target.entryId) === Number(this.destinationListGrid.getData()[i].entryId)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 公開先エントリ一覧とのフィルタ結果を取得します.
	 * @param target フィルタ対象
	 * @return フィルタ後リスト
	 */
	private getFilterList(target: any[]): any[] {
		let filterResults: any[] = (target).filter(
			(element) => {
				if (this.isIncludeEntry(element)) {
					return;
				} else {
					return element;
				}
			}
		);
		return filterResults;
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
	 */
	private selectDataCurrUserDataGrid(selectedData: any[]): void {
		// 現在ユーザデータグリッド取得
		let currUserDataGrid = this.getCurrUserDataGrid();
		currUserDataGrid.select(selectedData);
		let rowIndex = currUserDataGrid.getFirstRowIndex();
		if (rowIndex > 0 ) {
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
	 * フィルタフラグを取得します.
	 * @returns フィルタフラグ
	 */
	private getFilterFlag(): boolean {
		// フィルタフラグ
		let filterFlag  =  true;
		switch (this.getSelectedTabIndex()) {
			case tabIndexConst.TAB_INDEX_GROUP:
			case tabIndexConst.TAB_INDEX_ROLE:
			case tabIndexConst.TAB_INDEX_COMPLEX_GROUP:
				filterFlag = false;
				break;

			default:
			filterFlag = true;
			break;
		}
		return filterFlag;
	}

}
