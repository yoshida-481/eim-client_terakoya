import { Component, forwardRef, ViewChild, AfterViewInit, SimpleChanges, Input, EventEmitter, Output, OnInit, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMMenuItem, EIMSelectable } from 'app/shared/shared.interface';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTextInputFormItemComponent } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMEntrySelectorComponentService, EIMSelectTarget } from 'app/shared/components/entry-selector/entry-selector.component.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDialogSharedManagerComponentService } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';
import { EIMPublicNotificationTemplateService, EIMPublicNotificationTemplateNode } from 'app/shared/services/apis/public-notification-template.service';

import { EIMEntryDTO } from 'app/shared/dtos/entry.dto';
import { EIMGroupNameRendererComponent } from 'app/shared/components/renderer/group-name-renderer.component';
import { EIMRoleNameRendererComponent } from 'app/shared/components/renderer/role-name-renderer.component';
import { EIMUserDefaultRendererComponent } from 'app/shared/components/renderer/user-default-renderer.component';
import { EIMNameRendererComponent } from 'app/shared/components/renderer/name-renderer.component';
import { EIMRoleNameKanaRendererComponent } from 'app/shared/components/renderer/role-name-kana-renderer.component';

export namespace tabIndexConst {
	export const TAB_INDEX_USER = 'user';
	export const TAB_INDEX_GROUP = 'group';
	export const TAB_INDEX_ROLE = 'role';
	export const TAB_INDEX_COMPLEX_GROUP = 'compGroup';
	export const TAB_INDEX_USER_DEF_GROUP = 'userDefGroup';
	export const TAB_INDEX_SYSTEM = 'system'
	export const TAB_INDEX_TEMPLATE = 'template';
	export const TAB_INDEX_OBJECT_ROLE = 'objectRole';
}

/** 検索結果情報インターフェース */
export interface EIMSearchResult {
	data: any[];
}

/**
 * エントリ選択コンポーネント
 * @example
 *	<eim-multiple-entry-selector
 *		[documentId]="documentId"
 *		[selectTarget]="selectTarget"
 *		[destination]="destination"
 *		[viewSource]="viewSource">
 *	</eim-multiple-entry-selector>
 */
@Component({
    selector: 'eim-multiple-entry-selector',
    templateUrl: './multiple-entry-selector.component.html',
    styleUrls: ['./entry-selector.component.css'],
    providers: [
        EIMEntrySelectorComponentService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMMultipleEntrySelectorComponent) }
    ],
    standalone: false
})
export class EIMMultipleEntrySelectorComponent implements AfterViewInit, EIMComponent, EIMSelectable, OnInit {
	selectedTab = signal(0); // 初期タブインデックス
	private initData = [];

	/** 選択可能タブとなる対象指定 */
	@Input() selectTarget: EIMSelectTarget = {
		user: true,
		group: true,
		role: true,
		compGroup: true,
		userDefGroup: true,
		system: true,
		template: false,
		objectRole: true,
	}

	/** 選択済み一覧データグリッド */
	@ViewChild('destinationListGrid', { static: true }) destinationListGrid: EIMDataGridComponent;
	/** ユーザ一覧データグリッド */
	@ViewChild('userListGrid', { static: true }) userListGrid: EIMDataGridComponent;
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
	/** ユーザ一定義グループデータグリッド */
	@ViewChild('userDefGroupListGrid') userDefGroupListGrid: EIMDataGridComponent;
	/** システム処理データグリッド */
	@ViewChild('systemFuncListGrid') systemFuncListGrid: EIMDataGridComponent;
	/** テンプレートツリー */
	@ViewChild('templateTree') templateTree: EIMTreeComponent;
	/** テンプレートエントリーデータグリッド */
	@ViewChild('templateAssignListGrid') templateAssignListGrid: EIMDataGridComponent;
	/** オブジェクトロールデータグリッド */
	@ViewChild('objectRoleListGrid') objectRoleListGrid: EIMDataGridComponent;
	/** 設定対象ドキュメント */
	@Input() documentId: number;
	/** 呼び出し元画面判定フラグ */
	@Input() viewSource: string;
	/** 設定済み */
	@Input()
	set destination(destination: any[]) {

		for (let i = 0; i < destination.length; i++) {
			let data = Object.assign({}, destination[i]);
			if (data.hasOwnProperty('entryObjId')) {
				data.backupEntryId = data.entryId;
				data.entryId = data.entryObjId;
			}
			this.initData.push(data);
		}

		// 選択済み一覧
		let columns: EIMDataGridColumn[] = null;
		columns = [];
		columns.push({ field: 'entryTypeName', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 130, suppressFilter: true });
		columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 466, suppressFilter: true });
		this.destinationListGrid.setColumns(columns);
		// 選択済み一覧に追加
		this.destinationListGrid.setData(this.initData);
	}

	/** 選択処理完了のイベントエミッタ */
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();

	/** ユーザ検索リスト */
	private searchResultUserList: EIMSearchResult = { data: [] };
	/** グループユーザ検索リスト */
	private searchResultGroupUserList: EIMSearchResult = { data: [] };
	/** ロールユーザ検索リスト */
	private searchResultRoleUserList: EIMSearchResult = { data: [] };
	/** 複合グループユーザ検索リスト */
	private searchResultComplexGroupUserList: EIMSearchResult = { data: [] };
	/** テンプレート検索リスト */
	private searchResultTemplateAssignList: EIMSearchResult = { data: [] };
	/** テンプレートメニュー */
	public templateMenuItems: EIMMenuItem[] = [];
	private templateCreateMenuItem: EIMMenuItem;
	private templateUpdateMenuItem: EIMMenuItem;
	private templateDeleteMenuItem: EIMMenuItem;
	/** ユーザ検索条件 */
	public keyword: string = null;
	public disabled = false;
	public tabIdx: string[] = [];
	/** 選択ボタン押下可否 */
	public selectableFlg = false;
	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;
	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 * @param messageService メッセージサービス
	 * @param entryService エントリサービス
	 * @param complexGroupService 複合グループサービス
	 * @param treeComponentService ツリーコンポーネントサービス
	 */

	constructor(
		private translateService: TranslateService,
		private messageService: EIMMessageService,
		private entryService: EIMEntryService,
		public treeComponentService: EIMEntrySelectorComponentService,
		private publicNotificationTemplateService: EIMPublicNotificationTemplateService,
		private dialogManagerComponentService: EIMDialogSharedManagerComponentService,
	) {
		this.keyword = '';
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 選択ボタン押下時の処理を実施します.
	 */
	public select(): void {

		let selectData: any[] = [];
		selectData = this.destinationListGrid.getData();
		for (let i = 0; i < selectData.length; i++) {
			if (selectData[i].hasOwnProperty('backupEntryId')) {
				selectData[i].entryId = selectData[i].backupEntryId;
			}
		}
		this.selected.emit(selectData);
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {

		if (this.selectableFlg) {
			return true;
		} else {
			return false;
		}
	}

	/**
 * 選択対象の行かどうか判定します.
 * @param arg1 比較対象1
 * @param arg2 比較対象2
 */
	public defaultEquals(obj1: any, obj2: any): boolean {
		return Number(obj1.entryId) === Number(obj2.entryId);
	};

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	ngOnInit() {
		if (this.selectTarget.template) {
			this.templateCreateMenuItem = { label: this.translateService.instant('EIM.LABEL_03005'), icon: 'eim-icon-plus', command: event => this.onClickCreateTemplate(event) };
			this.templateUpdateMenuItem = { label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: event => this.onClickUpdateTemplate(event) };
			this.templateDeleteMenuItem = { label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: event => this.onClickDeleteTemplate(event) };
			this.templateMenuItems.push(this.templateCreateMenuItem, this.templateUpdateMenuItem, this.templateDeleteMenuItem);
		}
	}

	ngAfterViewInit() {
		let columns: EIMDataGridColumn[] = null;

		// ユーザ一覧
		if (this.selectTarget.user) {
			columns = [];
			columns.push({ field: 'userCode', headerName: this.translateService.instant('EIM.LABEL_02001'), width: 100, suppressFilter: true, cellRendererFramework: EIMUserDefaultRendererComponent });
			columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 100, suppressFilter: true, cellRendererFramework: EIMNameRendererComponent });
			columns.push({ field: 'groupName', headerName: this.translateService.instant('EIM.LABEL_02003'), width: 145, cellRendererFramework: EIMGroupNameRendererComponent, suppressFilter: true });
			columns.push({ field: 'roleName', headerName: this.translateService.instant('EIM.LABEL_02004'), width: 145, cellRendererFramework: EIMRoleNameRendererComponent, suppressFilter: true });
			columns.push({ field: 'userKana', headerName: this.translateService.instant('EIM.LABEL_02047'), width: 92, suppressFilter: true, cellRendererFramework: EIMRoleNameKanaRendererComponent });
			this.userListGrid.setColumns(columns);
		}

		// グループユーザ一覧
		if (this.selectTarget.group) {
			columns = [];
			columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 380, suppressFilter: true, cellRendererFramework: EIMNameRendererComponent });
			columns.push({ field: 'roleName', headerName: this.translateService.instant('EIM.LABEL_02004'), width: 203, cellRendererFramework: EIMRoleNameRendererComponent, suppressFilter: true });
			this.groupUserListGrid.setColumns(columns);
		}

		// ロールユーザ一覧
		if (this.selectTarget.role) {
			columns = [];
			columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 380, suppressFilter: true, cellRendererFramework: EIMNameRendererComponent });
			columns.push({ field: 'groupName', headerName: this.translateService.instant('EIM.LABEL_02003'), width: 203, cellRendererFramework: EIMGroupNameRendererComponent, suppressFilter: true });
			this.roleUserListGrid.setColumns(columns);
		}

		// 複合グループユーザ一覧
		if (this.selectTarget.compGroup) {
			columns = [];
			columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 583, suppressFilter: true, cellRendererFramework: EIMNameRendererComponent });
			this.complexGroupUserListGrid.setColumns(columns);
		}

		// ユーザ定義グループ一覧
		if (this.selectTarget.userDefGroup) {
			columns = [];
			columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 583, suppressFilter: true });
			this.userDefGroupListGrid.setColumns(columns);
		}

		// システム処理一覧
		if (this.selectTarget.system) {
			columns = [];
			columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 583, suppressFilter: true });
			this.systemFuncListGrid.setColumns(columns);
		}

		// テンプレート一覧
		if (this.selectTarget.template) {
			columns = [];
			columns.push({ field: 'entryTypeName', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 130, suppressFilter: true });
			columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 453, suppressFilter: true });
			this.templateAssignListGrid.setColumns(columns);
		}

		// オブジェクトロール一覧
		if (this.selectTarget.objectRole) {
			columns = [];
			columns.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 583, suppressFilter: true });
			this.objectRoleListGrid.setColumns(columns);
		}

		let select = this.selectTarget;
		let idx: string[] = [];
		Object.keys(this.selectTarget).forEach(function (value, key) {
			if (select[value]) {
				idx.push(value);
			}
		});
		this.selectTarget = select;
		this.tabIdx = idx;


		if (!this.tabIdx || this.tabIdx.length === 0) {
			return;
		}

		if (this.tabIdx[0] === tabIndexConst.TAB_INDEX_GROUP) {
			this.showGroup();
		} else if (this.tabIdx[0] === tabIndexConst.TAB_INDEX_ROLE) {
			this.showRole();
		} else if (this.tabIdx[0] === tabIndexConst.TAB_INDEX_COMPLEX_GROUP) {
			this.showCompGroup();
		} else if (this.tabIdx[0] === tabIndexConst.TAB_INDEX_USER_DEF_GROUP) {
			this.showUserDefGroup();
		} else if (this.tabIdx[0] === tabIndexConst.TAB_INDEX_SYSTEM) {
			this.showSystemFunc();
		} else if (this.tabIdx[0] === tabIndexConst.TAB_INDEX_TEMPLATE) {
			this.showTemplate();
		} else if (this.tabIdx[0] === tabIndexConst.TAB_INDEX_OBJECT_ROLE) {
			this.showObjectRole();
		}
	}

	/**
	 * タブ変更のイベントハンドラです.
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		this.selectedTab.set(event);

		if (this.tabIdx[event] === tabIndexConst.TAB_INDEX_GROUP) {
			this.showGroup();
		} else if (this.tabIdx[event] === tabIndexConst.TAB_INDEX_ROLE) {
			this.showRole();
		} else if (this.tabIdx[event] === tabIndexConst.TAB_INDEX_COMPLEX_GROUP) {
			this.showCompGroup();
		} else if (this.tabIdx[event] === tabIndexConst.TAB_INDEX_USER_DEF_GROUP) {
			this.showUserDefGroup();
		} else if (this.tabIdx[event] === tabIndexConst.TAB_INDEX_SYSTEM) {
			this.showSystemFunc();
		} else if (this.tabIdx[event] === tabIndexConst.TAB_INDEX_USER) {
			this.userListGridFilter();
		} else if (this.tabIdx[event] === tabIndexConst.TAB_INDEX_TEMPLATE) {
			this.showTemplate();
		} else if (this.tabIdx[event] === tabIndexConst.TAB_INDEX_OBJECT_ROLE) {
			this.showObjectRole();
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
	onSelectGruopUserList(event: any): void {
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
				const pushData: EIMTreeNode = this.publicNotificationTemplateService.convertTemplateToTreeNode(template) as EIMTreeNode;
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

		} else if (this.getSelectedTabIndex() === tabIndexConst.TAB_INDEX_USER_DEF_GROUP) {
			// ユーザ定義グループリスト
			addEntrys = addEntrys.concat(this.getSelectedEntryByGrid(this.userDefGroupListGrid));

		} else if (this.getSelectedTabIndex() === tabIndexConst.TAB_INDEX_SYSTEM) {
			// システム処理リスト
			addEntrys = addEntrys.concat(this.getSelectedEntryByGrid(this.systemFuncListGrid));

		} else if (this.getSelectedTabIndex() === tabIndexConst.TAB_INDEX_OBJECT_ROLE) {
			// オブジェクトロールリスト
			addEntrys = addEntrys.concat(this.getSelectedEntryByGrid(this.objectRoleListGrid));

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

			let initAddData;
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

			this.selectableFlg = true;
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

			this.selectableFlg = true;
		}
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
	}

	/**
	 * ロールを表示します．
	 */
	private showRole(): void {
		if (0 < this.roleTree.info.data.length) {
			return;
		}
		// ロールタブ選択時、ロール一覧取得
		this.entryService.getRoleList(this.documentId, true).subscribe(
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
		this.entryService.getComplexGroupList(this.documentId, true).subscribe(
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
	 * ユーザー定義グループを表示します．
	 */
	private showUserDefGroup(): void {
		if (0 < this.userDefGroupListGrid.getData().length) {
			return;
		}
		// ユーザ定義グループタブ選択時、ユーザ定義グループ一覧取得
		this.entryService.getUserDefGroupList(this.documentId, true, this.viewSource).subscribe(
			(data: any) => {
				let groupList = data.userDefGroups.userDefGroup;
				let setData = this.entryService.convertUserDefGroupToEntrys(groupList);

				// ユーザ定義グループリストに要素を設定
				this.userDefGroupListGrid.setData(setData);
			}
		);
	}

	/**
	 * システム処理リストを表示します．
	 */
	private showSystemFunc(): void {
		if (0 < this.systemFuncListGrid.getData().length) {
			return;
		}
		// システムタブ選択時、システム処理一覧取得
		this.entryService.getSysFuncEntryList().subscribe(
			(data: any) => {
				this.systemFuncListGrid.setData([]);
				let systemFunc = data.systemFunctions.systemFunction;
				if (systemFunc) {
					let setData = this.entryService.convertSystemFuncListToEntrys(systemFunc);
					// システム処理リストに要素を設定
					this.systemFuncListGrid.setData(setData);
				}
			}
		);
	}

	/**
	 * テンプレートリストを表示します.
	 */
	private showTemplate(): void {
		if (0 < this.templateTree.getData().length) {
			return;
		}
		// テンプレートタブ選択時、テンプレート一覧取得
		this.publicNotificationTemplateService.getTemplateTree().subscribe(
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
	 * オブジェクトロールを表示します．
	 */
	private showObjectRole(): void {
		if (0 < this.objectRoleListGrid.getData().length) {
			return;
		}
		// 業務役割タブ選択時、オブジェクトロール一覧取得
		this.entryService.getObjectRoleList().subscribe(
			(data: any) => {
				let entrys = this.entryService.convertObjectRolesToEntrys(data);

				// オブジェクトロールリストに要素を設定
				this.objectRoleListGrid.setData(entrys);
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
	 * エントリ一覧とのフィルタ結果を取得します.
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
	private getSelectedTabIndex(): string {
		return this.tabIdx[this.selectedTab()];
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
			case tabIndexConst.TAB_INDEX_USER_DEF_GROUP:
				searchResultDataGrid = this.userDefGroupListGrid;
				break;
			case tabIndexConst.TAB_INDEX_SYSTEM:
				searchResultDataGrid = this.systemFuncListGrid;
				break;
			case tabIndexConst.TAB_INDEX_OBJECT_ROLE:
				searchResultDataGrid = this.objectRoleListGrid;
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
		if (!this.userListGrid.info.gridApi) {
			return;
		}

		// AG-Grid v31以降はsetGridOptionを使用して動的にオプションを更新
		this.userListGrid.info.gridApi.setGridOption('isExternalFilterPresent', () => {
			return this.isExternalFilterPresent();
		});

		this.userListGrid.info.gridApi.setGridOption('doesExternalFilterPass', (node: any) => {
			return this.doesExternalFilterPass(node);
		});

		// フィルタの変更を適用
		this.userListGrid.info.gridApi.onFilterChanged();

		// 合計数、選択数を更新
		this.updateRowCountAndSelectedData();
	}

	/**
	 * 外部フィルタが存在するかどうか.
	 * @return 存在する場合trueを返却.
	 */
	private isExternalFilterPresent(): boolean {
		// 選択済みリストにデータがある場合のみフィルタを有効にする
		return this.destinationListGrid && this.destinationListGrid.getData().length > 0;
	}

	/**
	 * 外部フィルタを実行します.
	 * @param node ノード
	 * @return 表示対象ならtrueを返却
	 */
	private doesExternalFilterPass(node: any): boolean {
		if (!this.destinationListGrid) {
			return true;
		}

		const nodeData = node.data || node;
		const unvisibleData = this.destinationListGrid.getData();

		for (let i = 0; i < unvisibleData.length; i++) {
			if (this.defaultEquals(nodeData, unvisibleData[i])) {
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
		if (!this.userListGrid.info.gridApi) {
			return;
		}

		// 合計数から外部フィルタされた行数を除く
		this.userListGrid.info.rowCount = this.userListGrid.info.gridApi.getDisplayedRowCount();

		// 選択数からフィルタされた行数を除く
		let selectedData: any[] = [];
		let selectDataOld: any[] = this.userListGrid.getSelectedData();
		for (let i = 0; i < selectDataOld.length; i++) {
			let node = selectDataOld[i];
			// 外部フィルタ関数を直接呼び出す
			if (this.doesExternalFilterPass(node)) {
				selectedData.push(selectDataOld[i]);
			}
		}
		this.userListGrid.select(selectedData);
	}

}
