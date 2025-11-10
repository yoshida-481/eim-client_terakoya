import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, Input, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TabView } from 'primeng/tabview';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';

import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMAdminsComplexGroupService } from 'app/admins/shared/services/apis/admins-complex-group.service';
import { EIMAdminsGroupService } from 'app/admins/shared/services/apis/admins-group.service';
import { EIMAdminsRoleService } from 'app/admins/shared/services/apis/admins-role.service';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMSplitStateService } from 'app/shared/services/split-state.service';
import { EIMAdminsApplicationService } from 'app/admins/shared/services/apis/admins-application.service';

import { EIMEntrySelectorComponentService, EIMSelectTarget } from 'app/shared/components/entry-selector/entry-selector.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';

import { tabIndexConst } from 'app/shared/components/entry-selector/multiple-entry-selector.component';
import { EIMDialogSharedManagerComponentService } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';
import { EIMGroupRoleUserDTO } from 'app/admins/shared/dtos/group-role-user.dto';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMAdminUserDefaultRendererComponent } from 'app/admins/shared/components/renderer/admin-user-default-renderer.component';
import { EIMGroupNameRendererComponent } from 'app/admins/shared/components/renderer/group-name-renderer.component';
import { EIMRoleNameRendererComponent } from 'app/admins/shared/components/renderer/role-name-renderer.component';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';

/** グループ画面の左スプリットの初期パーセント */
const INIT_GROUP_SPLIT_LEFT_PERCENT = 25;

/** ロール画面の左スプリットの初期パーセント */
const INIT_ROLE_SPLIT_LEFT_PERCENT = 25;

/** 複合グループ画面の左スプリットの初期パーセント */
const INIT_COMPLEX_GROUP_SPLIT_LEFT_PERCENT = 25;

/**
 * ユーザグループロールコンポーネント
 * @example
 *      <eim-group-and-role>
 *      </eim-group-and-role>
 */
@Component({
    selector: 'eim-group-and-role',
    templateUrl: './user-group-and-role.component.html',
    styleUrls: ['./user-group-and-role.component.css'],
	imports: [
		CommonModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		
		AngularSplitModule,
		PanelModule,
		TabsModule
	],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMGroupAndRoleComponent) }
    ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMGroupAndRoleComponent implements EIMAdminMainComponent, OnInit, AfterViewInit {

	/** 選択可能タブとなる対象指定 */
	@Input() selectTarget: EIMSelectTarget = {
		user: false,
		group: true,
		role: true,
		compGroup: true,
		userDefGroup: false,
	}

	/** エントリタブ */
	@ViewChild('entryTabView', { static: true }) entryTabView: TabView;

	/** グループユーザデータグリッド */
	@ViewChild('groupUserDataGrid', { static: true })
	groupUserDataGrid: EIMDataGridComponent;

	/** ロールユーザデータグリッド */
	@ViewChild('roleUserDataGrid', { static: true })
	roleUserDataGrid: EIMDataGridComponent;

	/** 複合グループユーザデータグリッド */
	@ViewChild('compGroupUserDataGrid', { static: true })
	compGroupUserDataGrid: EIMDataGridComponent;

	/** グループデータグリッド(パス表示用) */
	@ViewChild('groupDataGrid')
	groupDataGrid: EIMDataGridComponent;

	/** グループツリー */
	@ViewChild('groupTree') groupTree: EIMTreeComponent;

	/** ロールツリー */
	@ViewChild('roleTree', { static: true }) roleTree: EIMTreeComponent;

	/** 複合グループツリー */
	@ViewChild('complexGroupTree', { static: true }) complexGroupTree: EIMTreeComponent;

	/** フラグ用数値：1 */
	private readonly FLAG_ON = 1;

	/** ユーザ管理権限 */
	private readonly USER_DIGIT = 6;

	/** ユーザ書き込み処理非活性化フラグ */
	private disableCreateFlag = false;

	/** 画面識別ID */
	public viewId = 'UserGroupRole'

	/** システム管理アプリケーション種別ID */
	private adminAppId = '';

	/** タブのインデックス */
	private tabIdx: string[] = [];

	/** タブのインデックス位置記憶用 */
	public selectedTabIdx = signal(0); // 初期タブインデックス

	/** スプリットの設定 */
	public splitSetting = {
		groupSplitLeft: {size: -1},
		roleSplitLeft: {size: -1},
		complexGroupSplitLeft: {size: -1}
	}

	/** 検索ユーザ名 */
	public searchGroupName: string;

	/** グループユーザ一覧 */
	public groupUserData: EIMGroupRoleUserDTO[] = [];

	/** ロールユーザ一覧 */
	public roleUserData: EIMGroupRoleUserDTO[] = [];

	/** 絞り込みユーザ名 */
	public filterUserName = '';

	/** グループ一覧の表示方法（０ ＝ パス表示、１ ＝ ツリー表示） */
	public displayAccordionNum = 1;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 選択グループID */
	private selectedGroupId = 0;

	/** 選択ロールID */
	private selectedRoleId = 0;

	/** 選択ロールID */
	private selectedComplexGroupId = 0;

	/** ロールタブ展開有無フラグ */
	private roleGotFlag = false;

	/** 複合グループタブ展開有無フラグ */
	private complexGotFlag = false;

	/** グループ登録 */
	groupCreateMenu: EIMMenuItem = {label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', disabled: true, command: ($event) => {this.showGroupCreator(); }}

	/** グループ更新 */
	groupUpdateMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: ($event) => {this.showGroupUpdator(); }}

	/** グループ削除 */
	groupDeleteMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => {this.showGroupDeletor(); }}

	/** グループユーザ選択 */
	groupUserMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_01000'), icon: 'fa fa-check', disabled: true, command: ($event) => {this.showGroupUserSelector(); }}

	/** グループメニュー */
	public groupMenuItems: EIMMenuItem[] = [
		this.groupCreateMenu,
		this.groupUpdateMenu,
		this.groupDeleteMenu
	]

	/** グループのコンテキストメニュー */
	public groupContextMenuItems: EIMMenuItem[] = [
		this.groupUpdateMenu,
		this.groupDeleteMenu
	];

	/** グループのユーザ選択メニュー */
	public groupUserMenuItems: EIMMenuItem[] = [
		this.groupUserMenu,
	];

	/** ロール登録 */
	roleCreateMenu: EIMMenuItem = {label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', disabled: true, command: ($event) => {this.showRoleCreator(); }}

	/** ロール更新 */
	roleUpdateMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: ($event) => {this.showRoleUpdator(); }}

	/** ロール削除 */
	roleDeleteMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => {this.showRoleDeletor(); }}

	/** ロールユーザ選択 */
	roleUserMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_01000'), icon: 'fa fa-check', disabled: true, command: ($event) => {this.showRoleUserSelector(); }}

	/** ロールメニュー */
	public roleMenuItems: EIMMenuItem[] = [
		this.roleCreateMenu,
		this.roleUpdateMenu,
		this.roleDeleteMenu
	];

	/** ロールのコンテキストメニュー */
	public roleContextMenuItems: EIMMenuItem[] = [
		this.roleUpdateMenu,
		this.roleDeleteMenu
	];

	/** ロールのユーザ選択メニュー */
	public roleUserMenuItems: EIMMenuItem[] = [
		this.roleUserMenu,
	];

	/** 複合グループ登録 */
	compGroupCreateMenu: EIMMenuItem = {label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), disabled: true, icon: 'eim-icon-plus', command: ($event) => {this.showCompGroupCreator(); }}

	/** 複合グループ削除 */
	compGroupDeleteMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => {this.showCompGroupDeletor(); }}

	/** 複合グループメニュー */
	public compGroupMenuItems: EIMMenuItem[] = [
		this.compGroupCreateMenu,
		this.compGroupDeleteMenu
	];

	/** 複合グループのコンテキストメニュー */
	public compGroupContextMenuItems: EIMMenuItem[] = [
		this.compGroupDeleteMenu
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
			protected adminsEntryService: EIMAdminsEntryService,
			protected adminsComplexGroupService: EIMAdminsComplexGroupService,
			protected adminsGroupService: EIMAdminsGroupService,
			protected adminsRoleService: EIMAdminsRoleService,
			protected messageService: EIMMessageService,
			public treeComponentService: EIMEntrySelectorComponentService,
			protected localStorageService: EIMLocalStorageService,
			protected splitStateService: EIMSplitStateService,
			protected adminsApplicationService: EIMAdminsApplicationService,
			protected dialogManagerComponentService: EIMDialogSharedManagerComponentService,
			protected adminsCacheService: EIMAdminsCacheService,
		) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public userGroupRoleDataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.groupId === obj2.groupId);
	}

	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public equals(obj1: any, obj2: any): boolean {
		return (obj1.data.entryId === obj2.data.entryId);
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			// スプリットのサイズを初期化
			this.selectedTabIdx.set(0);
			this.show();
			return;
		}

		// 復元します
		this.displayAccordionNum = state.displayAccordionNum;
		this.groupUserDataGrid.setState(state.groupUserDataGrid);
		this.roleUserDataGrid.setState(state.roleUserDataGrid);
		this.compGroupUserDataGrid.setState(state.compGroupUserDataGrid);
		this.roleTree.setState(state.roleTree);
		this.complexGroupTree.setState(state.complexGroupTree);
		this.adminAppId = state.adminAppId;
		this.tabIdx = state.tabIdx;
		this.groupUserData = state.groupUserData;
		this.complexGotFlag = state.complexGotFlag;
		this.roleGotFlag = state.roleGotFlag;
		// タブのインデックス位置
		this.selectedTabIdx.set(state.selectedTabIdx);
		// スプリットのサイズを初期化
		window.setTimeout(() => {
			if (this.displayAccordionNum === 1) {
				this.groupTree.setState(state.groupTree);
			} else if (this.displayAccordionNum === 0) {
				this.groupDataGrid.setState(state.groupDataGrid);
				this.searchGroupName = state.searchGroupName;
				this.filterUserName = state.filterUserName;
			}
			this.initSplitSize(this.selectedTabIdx());
			this.setButtonEnable();
			this.setUserSelectButtonEnable();
		})
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		let params: any = {};
		if (this.displayAccordionNum === 1) {
			params.groupTree = this.groupTree.getState();
		} else if (this.displayAccordionNum === 0) {
			params.groupDataGrid = this.groupDataGrid.getState();
			params.searchGroupName = this.searchGroupName;
			params.filterUserName = this.filterUserName;
		}
		params.selectedTabIdx = this.selectedTabIdx();
		params.groupUserDataGrid = this.groupUserDataGrid.getState();
		params.roleUserDataGrid = this.roleUserDataGrid.getState();
		params.compGroupUserDataGrid = this.compGroupUserDataGrid.getState();
		params.roleTree = this.roleTree.getState();
		params.complexGroupTree = this.complexGroupTree.getState();
		params.adminAppId = this.adminAppId;
		params.tabIdx = this.tabIdx;
		params.groupUserData = this.groupUserData;
		params.displayAccordionNum = this.displayAccordionNum;
		params.complexGotFlag = this.complexGotFlag;
		params.roleGotFlag = this.roleGotFlag;
		return params;
	}

	/**
	 * 画面を表示します
	 */
	public show(): void {
		// グループ一覧の表示方法設定値取得
		this.adminsApplicationService.getSelectAccordion().subscribe(
			(res: string) => {
				this.displayAccordionNum = Number(res);
				window.setTimeout(() => {
					// グループがパス表示の場合
					if (this.displayAccordionNum === 0) {
						let groupColumns: EIMDataGridColumn[] = [];
						// グループ名
						groupColumns.push({field: 'groupName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02077'), width: 200});
						// 親グループ名
						groupColumns.push({field: 'parentGroupName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02157'), width: 200});
						this.groupDataGrid.setColumns(groupColumns);
					}

					let select = this.selectTarget;
					let idx: string[] = [];
					Object.keys(this.selectTarget).forEach(function (value, key) {
						if ( select[value] ) {
							idx.push( value );
						}
					});
					this.selectTarget = select;
					this.tabIdx = idx;

					if ( !this.tabIdx || this.tabIdx.length === 0 ) {
						return;
					}
					if ( this.tabIdx[this.selectedTabIdx()] === tabIndexConst.TAB_INDEX_GROUP ) {
						if (this.displayAccordionNum === 1 && this.groupTree.info.data.length === 0) {
							this.showGroup();
						}
					} else if (this.tabIdx[this.selectedTabIdx()] === tabIndexConst.TAB_INDEX_ROLE ) {
						this.showRole();
					} else if (this.tabIdx[this.selectedTabIdx()] === tabIndexConst.TAB_INDEX_COMPLEX_GROUP ) {
						this.showCompGroup();
					}
					// スプリットのサイズを初期化
					this.initSplitSize(this.selectedTabIdx());
				});
			});
	}

	/**
	 * ユーザ管理権限の有無を確認します.
	 */
	public checkAuth(): void {
		this.disableCreateFlag = !this.checkUserAuth();
		this.setButtonEnable();
	}

	/**
	 * グループ登録ボタン押下時のイベントハンドラ
	 * グループ登録ダイアログを表示します.
	 */
	public showGroupCreator(): void {
		let groupId: number;
		let groupName: string;

		if (this.displayAccordionNum === 1) {
			let selectedDataList = this.groupTree.getSelectedData();
			if (selectedDataList && selectedDataList.length === 1) {
				// 選択したグループ取得
				groupId = Number(selectedDataList[0].data.entryId);
				groupName = selectedDataList[0].data.entryName;
			} else {
				groupId = null;
				groupName = null;
			}
		} else if (this.displayAccordionNum === 0) {
			let selectedDataList = this.groupDataGrid.getSelectedData();
			if (selectedDataList && selectedDataList.length === 1) {
				// 選択したグループ取得
				groupId = Number(selectedDataList[0].groupId);
				groupName = selectedDataList[0].groupName;
			} else {
				groupId = null;
				groupName = null;
			}
		}

		let dialogId: string = this.adminDialogManagerComponentService.showGroupCreator(groupId, groupName, this.displayAccordionNum, {
			created: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
					if (this.displayAccordionNum === 1) {
						this.complete(data);
					} else if (this.displayAccordionNum === 0) {
						let creatData = [];
						creatData.push(data);
						this.groupDataGrid.addRowData(creatData);
						this.groupDataGrid.select(creatData, true);
					}
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02078')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * グループ更新ボタン押下時のイベントハンドラ
	 * グループ更新ダイアログを表示します.
	 */
	public showGroupUpdator(): void {
		let groupId: number;

		if (this.displayAccordionNum === 1) {
			// 選択したグループ取得
			let selectedDataList = this.groupTree.getSelectedData();
			groupId = selectedDataList[0].data.entryId;

		} else if (this.displayAccordionNum === 0) {
			// 選択したグループ取得
			let selectedDataList = this.groupDataGrid.getSelectedData();
			groupId = selectedDataList[0].groupId;
		}

		let dialogId: string = this.adminDialogManagerComponentService.showGroupUpdator(groupId, this.displayAccordionNum, {
			updated: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				if (this.displayAccordionNum === 1) {
					this.complete(data);
				} else if (this.displayAccordionNum === 0) {
					let updateData = [];
					updateData.push(data);
					this.groupDataGrid.updateRowData(updateData);
				}
				// 複合グループを開いた事がある場合更新処理を行う
				if (this.complexGotFlag) {
					this.showCompGroup(this.complexGroupTree.getSelectedData()[0].data);
				}
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02078')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * グループ削除ボタン押下時のイベントハンドラ
	 */
	public showGroupDeletor(): void {
		let groupId: number;
		let groupName: string;
		let selectedDataList = [];

		if (this.displayAccordionNum === 1) {
			// 選択したユーザ取得
			selectedDataList = this.groupTree.getSelectedData();
			groupId = selectedDataList[0].data.entryId;
			groupName = selectedDataList[0].data.entryName;
		} else if (this.displayAccordionNum === 0) {
			// 選択したグループ取得
			selectedDataList = this.groupDataGrid.getSelectedData();
			groupId = selectedDataList[0].groupId;
			groupName = selectedDataList[0].groupName;
		}
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00019' , {value: groupName}) ,
			() => {
				this.adminsGroupService.deleteGroup(groupId).subscribe(
					(data: any) => {
						if (this.displayAccordionNum === 1) {
							this.groupTree.select([]);
							this.complete(data);
						} else if (this.displayAccordionNum === 0) {
							this.groupDataGrid.select([]);
							this.groupDataGrid.removeRowData(selectedDataList);
						}
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02078')}));
						this.setButtonEnable();
					},
				);
			}
		);
	}

	/**
	 * ロール登録ボタン押下時のイベントハンドラ
	 * ロール登録ダイアログを表示します.
	 */
	public showRoleCreator(): void {
		// 選択したロール取得
		let roleId: number;
		let roleName: string;
		let selectData = this.roleTree.getSelectedData();
		if (selectData && selectData.length === 1) {
			roleId = Number(selectData[0].data.entryId);
			roleName = selectData[0].data.entryName;
		} else {
			roleId = null;
			roleName = null;
		}

		let dialogId: string = this.adminDialogManagerComponentService.showRoleCreator(roleId, roleName, {
			created: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.complete(data);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02081')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * ロール更新ボタン押下時のイベントハンドラ
	 * ロール更新ダイアログを表示します.
	 */
	public showRoleUpdator(): void {
		// 選択したロール取得
		let selectedDataList = this.roleTree.getSelectedData();
		let selectedData = selectedDataList[0];
		let dialogId: string = this.adminDialogManagerComponentService.showRoleUpdator(selectedData.data.entryId, {
			updated: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.complete(data);
				// 複合グループを開いた事がある場合更新処理を行う
				if (this.complexGotFlag) {
					this.showCompGroup(this.complexGroupTree.getSelectedData()[0]);
				}
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02081')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * ロール削除ボタン押下時のイベントハンドラ
	 */
	public showRoleDeletor(): void {
		// 選択したユーザ取得
		let selectedDataList = this.roleTree.getSelectedData();
		let selectedData = selectedDataList[0];
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00020' , {value: selectedData.data.entryName}) ,
			() => {
				this.adminsRoleService.deleteRole(selectedData.data.entryId).subscribe(
					(data: any) => {
						this.roleTree.select([]);
						this.complete(data);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02081')}));
						this.setButtonEnable();
					},
				);
			}
		);
	}

	/**
	 * 複合グループ選択ボタン押下時のイベントハンドラ
	 * 複合グループ登録ダイアログを表示します.
	 */
	public showCompGroupCreator(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showCompGroupCreator({
			created: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.complete();
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02085')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * 複合グループ削除ボタン押下時のイベントハンドラ
	 */
	public showCompGroupDeletor(): void {
		// 選択したユーザ取得
		let selectedDataList = this.complexGroupTree.getSelectedData();
		let selectedData = selectedDataList[0];

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00021' , {value: selectedData.data.entryName}) ,
			() => {
				this.adminsComplexGroupService.deleteComp(selectedData.data.entryId).subscribe(
					(data: any) => {
						this.complexGroupTree.select([]);
						this.complete(data);
						this.compGroupUserDataGrid.setData([]);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02085')}));
						this.setButtonEnable();
					},
				);
			}
		);
	}

	/**
	 * グループタブのユーザ選択ボタン押下時のイベントハンドラ
	 */
	public showGroupUserSelector(): void {
		let groupId: number;
		let entryTypeId = EIMConstantService.ENTRY_TYPE_GROUP;
		let selectData = [];
		if (this.displayAccordionNum === 1) {
			groupId = Number(this.groupTree.getSelectedData()[0].data.entryId);
		} else if (this.displayAccordionNum === 0) {
			groupId = Number(this.groupDataGrid.getSelectedData()[0].groupId);
		}
		let dialogId: string = this.dialogManagerComponentService.showUserMultiSelector(
			this.groupUserData,
			{
				selected: (data) => {
					this.upDateUserList(groupId, entryTypeId, this.groupUserData, data ,
					(result: boolean) => {
						// ユーザに更新がある場合
						if (result) {
							this.groupUserData = data;
							if (this.displayAccordionNum === 1) {
								selectData = this.groupTree.getSelectedData();
								this.groupTree.select(selectData, true);
							} else if (this.displayAccordionNum === 0) {
								selectData = this.groupDataGrid.getSelectedData();
								this.groupDataGrid.select(selectData, true);
							}
							this.dialogManagerComponentService.close(dialogId);
						} else {
							this.dialogManagerComponentService.close(dialogId);
						}
					});
				}
			}
		);
	}

	/**
	 * ロールタブのユーザ選択ボタン押下時のイベントハンドラ
	 */
	public showRoleUserSelector(): void {
		let roleUserList = this.roleUserDataGrid.getData();
		let roleId = Number(this.roleTree.getSelectedData()[0].data.entryId);
		let entryTypeId = EIMConstantService.ENTRY_TYPE_ROLE;
		let selectData = [];
		let dialogId: string = this.dialogManagerComponentService.showUserMultiSelector(
			roleUserList,
			{
				selected: (data) => {
					this.upDateUserList(roleId, entryTypeId, roleUserList, data ,
					(result: boolean) => {
						// ユーザに更新がある場合
						if (result) {
							selectData = this.roleTree.getSelectedData();
							this.roleTree.select(selectData, true);
							this.dialogManagerComponentService.close(dialogId);
						} else {
							this.dialogManagerComponentService.close(dialogId);
						}
					});
				}
			}
		);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	ngOnInit(): void {
		this.adminAppId = this.localStorageService.getAdminAppId();
		// 登録・更新・削除処理操作可否を取得
		this.checkAuth();
	}


	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngAfterViewInit(): void {
		// グループユーザグリッド
		let groupUserColumns: EIMDataGridColumn[] = [];
		// ID (= userCode)
		groupUserColumns.push({field: 'code', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02074'), width: 130, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		// 名前
		groupUserColumns.push({field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 170, cellRendererFramework: EIMAdminNameRendererComponent});
		// グループ
		groupUserColumns.push({field: 'groupNames', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02078'), width: 190, cellRendererFramework: EIMGroupNameRendererComponent});
		// ロール
		groupUserColumns.push({field: 'roleNames', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02081'), width: 185, cellRendererFramework: EIMRoleNameRendererComponent});
		// Mail
		groupUserColumns.push({field: 'mail', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02076'), width: 200, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		// 無効フラグ
		groupUserColumns.push({field: 'userDisable', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02080'), width: 90, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		this.groupUserDataGrid.setColumns(groupUserColumns);

		// ロールユーザグリッド
		let roleUserColumns: EIMDataGridColumn[] = [];
		// ID (= userCode)
		roleUserColumns.push({field: 'code', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02074'), width: 130, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		// 名前
		roleUserColumns.push({field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 170, cellRendererFramework: EIMAdminNameRendererComponent});
		// グループ
		roleUserColumns.push({field: 'groupNames', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02078'), width: 190, cellRendererFramework: EIMGroupNameRendererComponent});
		// ロール
		roleUserColumns.push({field: 'roleNames', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02081'), width: 185, cellRendererFramework: EIMRoleNameRendererComponent});
		// Mail
		roleUserColumns.push({field: 'mail', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02076'), width: 200, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		// 無効フラグ
		roleUserColumns.push({field: 'userDisable', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02080'), width: 90, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		this.roleUserDataGrid.setColumns(roleUserColumns);

		// 複合グループユーザグリッド
		let compoundGroupUserColumns: EIMDataGridColumn[] = [];
		// ID (= userCode)
		compoundGroupUserColumns.push({field: 'code', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02074'), width: 130, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		// 名前
		compoundGroupUserColumns.push({field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 170, cellRendererFramework: EIMAdminNameRendererComponent});
		// グループ
		compoundGroupUserColumns.push({field: 'groupNames', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02078'), width: 190, cellRendererFramework: EIMGroupNameRendererComponent});
		// ロール
		compoundGroupUserColumns.push({field: 'roleNames', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02081'), width: 185, cellRendererFramework: EIMRoleNameRendererComponent});
		// Mail
		compoundGroupUserColumns.push({field: 'mail', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02076'), width: 200, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		// 無効フラグ
		compoundGroupUserColumns.push({field: 'userDisable', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02080'), width: 90, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		this.compGroupUserDataGrid.setColumns(compoundGroupUserColumns);
	}

	/**
	 * 検索ボタン押下時のイベントハンドラ
	 */
	onSearch(): void {
		this.adminsGroupService.getGroupListPath(this.searchGroupName)
			.subscribe((groupObject: any) => {
				let groupList = groupObject.groups.group;
				let groupArry: any[] = [];
				if (groupList.length === undefined || groupList.length === null) {
					groupArry.push(groupList.attr);
				}
				for (let i = 0; i < groupList.length; i++) {
					groupArry.push(groupList[i].attr);
				}
				this.groupDataGrid.setData(groupArry);
				this.groupUserDataGrid.setData([]);
				// ボタンの活性制御処理
				this.setButtonEnable();
			});
	}

	/**
	 * タブ変更のイベントハンドラです.
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		this.selectedTabIdx.set(event);
		if (this.tabIdx[ event ] === tabIndexConst.TAB_INDEX_GROUP) {
			if (this.displayAccordionNum === 1 && this.groupTree.info.data.length === 0) {
				this.showGroup();
			}
		} else if (this.tabIdx[ event ] === tabIndexConst.TAB_INDEX_ROLE && !this.roleGotFlag) {
			this.showRole();
			this.roleGotFlag = true;
		} else if (this.tabIdx[ event ] === tabIndexConst.TAB_INDEX_COMPLEX_GROUP && !this.complexGotFlag) {
			this.showCompGroup();
			this.complexGotFlag = true;
		}
		// スプリットのサイズを初期化
		this.initSplitSize(event);
	}

	/**
	 * グループ選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectedGroup(event: any): void {
		this.groupUserMenu.disabled = true;
		let groupId: number;
		let groupName: string;
		if (this.displayAccordionNum === 1) {
			// ツリーで選択したユーザ取得
			let selectedDataList = this.groupTree.getSelectedData();
			if (!(selectedDataList && selectedDataList.length === 1)) {
				this.selectedGroupId = 0;
				return;
			}
			let selectedData = selectedDataList[0];
			groupId = selectedData.data.entryId;
			groupName = selectedData.data.entryName;
			// グループツリー展開
			event.selectedData[0].expanded = true;

		} else if (this.displayAccordionNum === 0) {
			// リストで選択したユーザ取得
			let selectedDataList = this.groupDataGrid.getSelectedData();
			if (!(selectedDataList && selectedDataList.length === 1)) {
				this.selectedGroupId = 0;
				this.groupUserDataGrid.setData([]);
				// ボタンの活性制御処理
				this.setButtonEnable();
				return;
			}
			let selectedData = selectedDataList[0];
			groupId = selectedData.groupId;
			groupName = selectedData.groupName;
		}

		// ボタンの活性制御処理
		this.setButtonEnable();

		// グループ所属ユーザリスト取得
		this.selectedGroupId = groupId;
		this.adminsGroupService.getUserList(groupId, null, false).subscribe(
			(userList: EIMGroupRoleUserDTO[]) => {
				if (this.selectedGroupId === groupId) {
					// グループユーザ検索リストを保持
					this.groupUserDataGrid.setData(userList);
					this.groupUserData = userList;
					// グループに対応するユーザの選択を活性にします。
					this.groupUserMenu.disabled = false;
				}
			}
		);
	}

	/**
	 * ロール選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectedRole(event: any): void {
		this.roleUserMenu.disabled = true;
		// 選択したユーザ取得
		let selectedDataList = this.roleTree.getSelectedData();
		if (!(selectedDataList && selectedDataList.length === 1)) {
			this.selectedRoleId = 0;
			return;
		}
		let selectedData = selectedDataList[0];
		// ロールツリー展開
		event.selectedData[0].expanded = true;
		// ボタンの活性制御処理
		this.setButtonEnable();
		// ロール所属ユーザリスト取得
		let selectedRoleId: number = selectedData.data.entryId;
		this.selectedRoleId = selectedRoleId;
		this.adminsRoleService.getUserList(selectedRoleId, null, false).subscribe(
			(userList: EIMGroupRoleUserDTO[]) => {
				if (this.selectedRoleId === selectedRoleId) {
					this.roleUserDataGrid.setData(userList);
					this.roleUserData = userList;
					// ロールに対応するユーザの選択を活性にします。
					this.roleUserMenu.disabled = false;
				}
			}
		);
	}

	/**
	 * 複合グループ選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectedCompGroup(event?: any): void {
		// 選択したユーザ取得
		let selectedDataList = this.complexGroupTree.getSelectedData();
		if (!(selectedDataList && selectedDataList.length === 1)) {
			this.selectedComplexGroupId = 0;
			return;
		}
		let selectedData = selectedDataList[0];

		// ボタンの活性制御処理
		this.setButtonEnable();

		// 複合グループ所属ユーザリスト取得
		let selectedCompGroupId: number = selectedData.data.entryId;
		this.selectedComplexGroupId = selectedCompGroupId;
		this.adminsComplexGroupService.getUserList(selectedData.data.entryId, null, false).subscribe(
			(userList: EIMGroupRoleUserDTO[]) => {
				if (this.selectedComplexGroupId === selectedCompGroupId) {
					this.compGroupUserDataGrid.setData(userList);
				}
			}
		);
	}

	/**
	 * グループ配下のユーザ選択時のイベントハンドラ
	 */
	onSelectedGroupUser(): void {
		// 選択したユーザ取得
		let selectedDataList = this.groupUserDataGrid.getSelectedData();
		if (!(selectedDataList && selectedDataList.length === 1)) {
			return;
		}
		// ボタンの活性制御処理
		this.setButtonEnable();
	}

	/**
	 * ロール配下のユーザ選択時のイベントハンドラ
	 */
	onSelectedRoleUser(): void {
		// 選択したユーザ取得
		let selectedDataList = this.roleUserDataGrid.getSelectedData();
		if (!(selectedDataList && selectedDataList.length === 1)) {
			return;
		}
		// ボタンの活性制御処理
		this.setButtonEnable();
	}

	/**
	 * 複合グループ配下のユーザ選択時のイベントハンドラ
	 */
	onSelectedCompGroupUser(): void {
		// 選択したユーザ取得
		let selectedDataList = this.compGroupUserDataGrid.getSelectedData();
		if (!(selectedDataList && selectedDataList.length === 1)) {
			return;
		}
		// ボタンの活性制御処理
		this.setButtonEnable();
	}

	/**
	 * フィルターボタン押下イベントハンドラです.
	 */
	onClickFilter(): void {

		let tmpDataGrid: EIMGroupRoleUserDTO[] = [];
		if (this.filterUserName === '') {
			tmpDataGrid = this.groupUserData;
		} else {
			for (let i = 0; i < this.groupUserData.length; i++) {
				if (this.groupUserData[i].name.indexOf(this.filterUserName) !== -1) {
					tmpDataGrid.push(this.groupUserData[i]);
				}
			}
		}
		this.groupUserDataGrid.setData(tmpDataGrid);
		this.groupUserDataGrid.refreshView();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 登録・更新・削除の完了後処理
	 * @param updataData 更新データ
	 */
	private complete(updataData?: any): void {
		// ユーザリストを表示します．
	  if ( this.tabIdx[this.selectedTabIdx()] === tabIndexConst.TAB_INDEX_GROUP ) {
			this.showGroup(updataData);
	  } else if (this.tabIdx[this.selectedTabIdx()] === tabIndexConst.TAB_INDEX_ROLE ) {
			this.showRole(updataData);
	  } else if (this.tabIdx[this.selectedTabIdx()] === tabIndexConst.TAB_INDEX_COMPLEX_GROUP ) {
			this.showCompGroup();
		}
	}

	/**
	 * グループ表示
	 * @param updataData 更新データ
	 */
	private showGroup(updataData?: any): void {
		let treeNodes: EIMTreeNode[];
		// グループタブ選択時、グループ一覧取得
		this.adminsGroupService.getGroupList()
			.subscribe((groupObject: any) => {
				// グループツリーに要素を設定
				treeNodes = this.treeComponentService.convertGroupsToTreeNodes(groupObject.groups.group);
				this.groupTree.setData(treeNodes);
				// 変更処理がかかった場合対象を選択する
				if (updataData) {
					for (let i = 0; i < treeNodes.length; i++) {
						this.selectedTree(treeNodes[i], updataData.groupId, this.groupTree);
					}
				}
			});
	}

	/**
	 * ロール表示
	 * @param updataData 更新データ
	 */
	private showRole(updataData?: any): void {
		let treeNodes: EIMTreeNode[]
		// ロールタブ選択時、ロール一覧取得
		this.adminsRoleService.getRoleList()
			.subscribe((roleObject: any) => {
					// ロールツリーに要素を設定
					treeNodes = this.treeComponentService.convertRolesToTreeNodes(roleObject.roles.role);
					this.roleTree.setData(treeNodes);
					// 変更処理がかかった場合対象を選択する
					if (updataData) {
						for (let i = 0; i < treeNodes.length; i++) {
							this.selectedTree(treeNodes[i], updataData.roleId, this.roleTree);
						}
					}
			});
	}

	/**
	 * 複合グループ表示
	 */
	private showCompGroup(updataData?: any): void {
		let treeNodes: EIMTreeNode[];
		// 複合グループタブ選択時、複合グループ一覧取得
		this.adminsComplexGroupService.getComplexGroupList()
			.subscribe((object: any) => {
					// 複合グループツリーに要素を設定
					treeNodes = this.treeComponentService.convertComplexGroupsToTreeNodes(object.compList.comp);
					this.complexGroupTree.setData(treeNodes);
					// 変更処理がかかった場合対象を選択する
					if (updataData) {
						for (let i = 0; i < treeNodes.length; i++) {
							this.selectedTree(treeNodes[i], updataData.data.entryId, this.complexGroupTree);
						}
						this.onSelectedCompGroup();
					}
			});
	}

	/**
	 * ボタンの活性制御処理
	 */
	protected setButtonEnable(): void {
		// 登録ボタン活性制御を行います.
		this.groupCreateMenu.disabled = this.disableCreateFlag;
		this.roleCreateMenu.disabled = this.disableCreateFlag;
		this.compGroupCreateMenu.disabled = this.disableCreateFlag;

		if ( this.tabIdx[this.selectedTabIdx()] === tabIndexConst.TAB_INDEX_GROUP ) {
			let selectedGroupList: any[];
			if (this.displayAccordionNum === 1) {
				// 選択したグループ取得
				selectedGroupList = this.groupTree.getSelectedData();
			} else if (this.displayAccordionNum === 0) {
				// 選択したグループ取得
				selectedGroupList = this.groupDataGrid.getSelectedData();
			}
			let selectedGroupUserList = this.groupUserDataGrid.getSelectedData();
			if (selectedGroupList && selectedGroupList.length === 1) {
				// グループ更新・削除ボタン活性にします。
				this.groupUpdateMenu.disabled = this.disableCreateFlag;
				this.groupDeleteMenu.disabled = this.disableCreateFlag;
			} else {
				// グループ更新・削除ボタン非活性にします。
				this.groupUpdateMenu.disabled = true;
				this.groupDeleteMenu.disabled = true;
				// 選択したグループに対応するユーザの全てのボタンを非活性にします。
				this.groupUserMenu.disabled = true;
			}

		} else if (this.tabIdx[this.selectedTabIdx()] === tabIndexConst.TAB_INDEX_ROLE ) {
			// 選択したロール取得
			let selectedRoleList = this.roleTree.getSelectedData();
			let selectedRoleUserList = this.roleUserDataGrid.getSelectedData();
			if (selectedRoleList && selectedRoleList.length === 1) {
				// ロール更新・削除ボタン活性にします。
				this.roleUpdateMenu.disabled = this.disableCreateFlag;
				this.roleDeleteMenu.disabled = this.disableCreateFlag;
			} else {
				// ロール更新・削除ボタン非活性にします。
				this.roleUpdateMenu.disabled = true;
				this.roleDeleteMenu.disabled = true;
				// 選択したロールに対応するユーザの全てのボタンを非活性にします。
				this.roleUserMenu.disabled = true;
			}

		} else if (this.tabIdx[this.selectedTabIdx()] === tabIndexConst.TAB_INDEX_COMPLEX_GROUP ) {
			// 選択した複合グループ取得
			let selectedCompGroupList = this.complexGroupTree.getSelectedData();
			let selectedCompGroupUserList = this.compGroupUserDataGrid.getSelectedData();
			if (selectedCompGroupList && selectedCompGroupList.length === 1) {
				// 複合グループ削除ボタン活性にします。
				this.compGroupDeleteMenu.disabled = this.disableCreateFlag;
			} else {
				// 複合グループ削除ボタン非活性にします。
				this.compGroupDeleteMenu.disabled = true;
			}
		}
	}

	/**
	 * ユーザ選択ボタンの活性制御処理
	 */
	protected setUserSelectButtonEnable(): void {
		// グループに対応するユーザの選択を活性にします。
		let groupDisable = false;
		if (this.displayAccordionNum === 1) {
			groupDisable = this.groupTree.getSelectedData().length === 0;
		} else if (this.displayAccordionNum === 0) {
			groupDisable = this.groupDataGrid.getSelectedData().length === 0;
		}
		this.groupUserMenu.disabled = groupDisable;
		// ロールに対応するユーザの選択を活性にします。
		let roleDisable = this.roleTree.getSelectedData().length === 0;
		this.roleUserMenu.disabled = roleDisable;
	}

	/**
	 * スプリットのサイズを初期化します.
	 * タブ内にスプリットを配置する場合は、表示してからでないと
	 * サイズを指定できないための処理です.
	 * @param tabIndex タブインデックス
	 */
	private initSplitSize(tabIndex: number): void {
		window.setTimeout(() => {
			if (this.tabIdx[ tabIndex ] === tabIndexConst.TAB_INDEX_GROUP
					&& this.splitSetting.groupSplitLeft.size === -1) {
				this.splitSetting.groupSplitLeft.size = INIT_GROUP_SPLIT_LEFT_PERCENT;
			}
			if (this.tabIdx[ tabIndex ] === tabIndexConst.TAB_INDEX_ROLE
					&& this.splitSetting.roleSplitLeft.size === -1) {
				this.splitSetting.roleSplitLeft.size = INIT_ROLE_SPLIT_LEFT_PERCENT;
			}
			if (this.tabIdx[ tabIndex ] === tabIndexConst.TAB_INDEX_COMPLEX_GROUP
					&& this.splitSetting.complexGroupSplitLeft.size === -1) {
				this.splitSetting.complexGroupSplitLeft.size = INIT_COMPLEX_GROUP_SPLIT_LEFT_PERCENT;
			}
		});
	}

	/**
	 * ツリー選択要素を選択します.
	 * @param treeDataNode 変更したツリーデータ
	 * @param entryId 変更対象エントリID
	 * @param targetTree ツリーデータ
	 * @return 選択結果
	 */
	private selectedTree(treeDataNode: EIMTreeNode , entryId, targetTree): boolean {
		if (Number(treeDataNode.data.entryId) === Number(entryId)) {
			targetTree.select([treeDataNode] , true);
			return true;
		}
		if (!treeDataNode.children) {
			return false;
		}
		for (let i = 0; i < treeDataNode.children.length; i++) {
			if (this.selectedTree(treeDataNode.children[i], entryId, targetTree)) {
				targetTree.expand(treeDataNode, true);
				return true;
			}
		}
		return false;
	}

	/**
	 * ユーザ一覧更新処理
	 * @param id エントリId
	 * @param entryTypeId エントリタイプId
	 * @param beforeuserList 選択前のユーザリスト
	 * @param afterList ユーザ選択画面で作成したユーザリスト
	 * @param callbacks コールバック関数
	 */
	private upDateUserList(id: number , entryTypeId: number, beforeuserList: any[], afterList: any[] , callbacks?: any): void {
		let creatData = [];
		let deleteData = [];
		let maxCount: number;
		let successCount = 0;

		// 選択前のデータをmapに格納
		let beforeMap = new Map();
		for (let i = 0; i < beforeuserList.length; i++) {
			beforeMap.set(beforeuserList[i].id, beforeuserList[i]);
		}
		// 選択後のデータをmapに格納
		let affterMap = new Map();
		for (let i = 0; i < afterList.length; i++) {
			affterMap.set(afterList[i].id, afterList[i]);

			// 選択前のデータに存在しない場合、追加データと判断
			let mapData = beforeMap.get(afterList[i].id);
			if (!mapData) {
				creatData.push(afterList[i]);
			}
		}
		// 選択後データに存在しない場合、削除データと判断
		for (let i = 0; i < beforeuserList.length; i++) {
			let mapData = affterMap.get(beforeuserList[i].id);
			if (!mapData) {
				deleteData.push(beforeuserList[i]);
			}
		}
		maxCount = creatData.length + deleteData.length;
		// 削除データがある場合はメッセージ出力後更新処理を行う
		if (0 < deleteData.length) {
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00032'),
				() => {
					// 登録処理実行
					if (0 < creatData.length) {
						for (let i = 0; i < creatData.length; i++) {
							if (entryTypeId === EIMConstantService.ENTRY_TYPE_GROUP) {
								this.adminsGroupService.createGroupUser(id, creatData[i].id).subscribe(
									(data: any) => {
										successCount++;
										if (maxCount === successCount) {
											callbacks(true);
										}
									},
									(err: any) => {
										callbacks(false);
									}
								);
							} else if (entryTypeId === EIMConstantService.ENTRY_TYPE_ROLE) {
								this.adminsRoleService.createRoleUser(id, creatData[i].id).subscribe(
									(data: any) => {
										successCount++;
										if (maxCount === successCount) {
											callbacks(true);
										}
									},
									(err: any) => {
										callbacks(false);
									}
								);
							}
						}
					}
					// 削除処理実行
					for (let i = 0; i < deleteData.length; i++) {
						if (entryTypeId === EIMConstantService.ENTRY_TYPE_GROUP) {
							this.adminsGroupService.deleteGroupUser(id, Number(deleteData[i].id)).subscribe(
								(data: any) => {
									successCount++;
									if (maxCount === successCount) {
										callbacks(true);
									}
								},
								(err: any) => {
									callbacks(false);
								}
							);
						} else if (entryTypeId === EIMConstantService.ENTRY_TYPE_ROLE) {
							this.adminsRoleService.deleteRoleUser(id, Number(deleteData[i].id)).subscribe(
								(data: any) => {
									successCount++;
									if (maxCount === successCount) {
										callbacks(true);
									}
								},
								(err: any) => {
									callbacks(false);
								}
							);
						}
					}
				}
			);
		// 削除データが無い場合はそのまま更新処理を行う
		} else if (0 < creatData.length) {
			for (let i = 0; i < creatData.length; i++) {
				if (entryTypeId === EIMConstantService.ENTRY_TYPE_GROUP) {
					this.adminsGroupService.createGroupUser(id, creatData[i].id).subscribe(
						(data: any) => {
							successCount++;
							if (maxCount === successCount) {
								callbacks(true);
							}
						},
						(err: any) => {
							callbacks(false);
						}
					);
				} else if (entryTypeId === EIMConstantService.ENTRY_TYPE_ROLE) {
					this.adminsRoleService.createRoleUser(id, creatData[i].id).subscribe(
						(data: any) => {
							successCount++;
							if (maxCount === successCount) {
								callbacks(true);
							}
						},
						(err: any) => {
							callbacks(false);
						}
					);
				}
			}
		} else {
			callbacks(false);
		}
	}

	/**
	 * ユーザ管理権限の有無を確認します.
	 * @return ユーザ管理権限有無(登録等操作可能ならtrueを返却)
	 */
	private checkUserAuth(): boolean {
		if (this.adminAppId !== EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
			return true;
		}
		let user = this.adminsCacheService.getLoginUser();
		// 取得失敗時(URL直接指定等)
		if (!user) {
			return false;
		}
		let binaryAdmin = user.admin.toString(2);
		let checkDigit = this.USER_DIGIT;
		if (checkDigit <= binaryAdmin.length ) {
			let userSystemAuth = binaryAdmin.substr(-checkDigit, 1);
			if (Number(userSystemAuth) === this.FLAG_ON) {
				return true;
			}
		}
		return false;
	}

}

