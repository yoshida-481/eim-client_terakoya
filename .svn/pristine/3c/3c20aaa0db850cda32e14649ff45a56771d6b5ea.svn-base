import { Component, forwardRef, ViewChild, OnInit, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { tabIndexConst } from 'app/admins/components/group-and-role-selector/group-and-role-multiple-selector.component';

import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMUserService } from 'app/admins/shared/services/apis/user.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';

import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMAdminsUserDTO } from 'app/admins/shared/dtos/admins-user.dto';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMGroupNameRendererComponent } from 'app/admins/shared/components/renderer/group-name-renderer.component';
import { EIMRoleNameRendererComponent } from 'app/admins/shared/components/renderer/role-name-renderer.component';
import { EIMAdminsGroupService } from 'app/admins/shared/services/apis/admins-group.service';
import { EIMAdminsRoleService } from 'app/admins/shared/services/apis/admins-role.service';
import { EIMAdminUserDefaultRendererComponent } from 'app/admins/shared/components/renderer/admin-user-default-renderer.component';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { EIMCheckBoxComponent } from 'app/shared/components/checkbox/checkbox.component';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';

/**
 * ユーザコンポーネント
 * @example
 *
 *      <eim-user>
 *      </eim-user>
 */
@Component({
	selector: 'eim-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		ButtonDirective,

		AngularSplitModule,
		PanelModule,
		InputTextModule,
		EIMCheckBoxComponent,
		EIMRadioButtonComponent
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMUserComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMUserComponent implements EIMAdminMainComponent, OnInit {

	/** ユーザデータグリッド */
	@ViewChild('userDataGrid', { static: true })
	userDataGrid: EIMDataGridComponent;

	/** 登録 */
	private createUserMenu: EIMMenuItem =
	{ label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), name: 'createUserMenu', icon: 'eim-icon-plus', disabled: true, command: ($event) => {this.onClickUserCreatorMenu(); } };

	/** 更新 */
	private updateUserMenu: EIMMenuItem =
	{ label: this.translateService.instant('EIM.LABEL_03004'), name: 'updateUserMenu', icon: 'eim-icon-pencil', disabled: true, command: ($event) => {this.onClickUserUpdatorMenu(); } };

	/** グループ/ロール選択 */
	private selectGroupAndRoleMenu: EIMMenuItem =
	{ label: this.translateService.instant('EIM.LABEL_03047'), name: 'selectGroupAndRoleMenu', icon: 'fa fa-check', disabled: true, command: ($event) => {this.onClickGroupRoleSelectorMenu(tabIndexConst.TAB_INDEX_GROUP); } };

	/** 削除 */
	private deleteUserMenu: EIMMenuItem =
	{ label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteUserMenu', icon: 'eim-icon-trash', disabled: true, command: ($event) => {this.onClickUserDeletorMenu(); } };

	/** エクスポート */
	private exportMenu: EIMMenuItem =
	{ label: this.translateService.instant('EIM.LABEL_03039'), name: 'exportMenu', icon: 'fa fa-download', disabled: true, command: ($event) => {this.onClickUserExportExecutorMenu(); } };

	/** インポート */
	private importMenu: EIMMenuItem =
	{ label: this.translateService.instant('EIM.LABEL_03049'), name: 'importMenu', icon: 'fa fa-upload', disabled: true, command: ($event) => {this.onClickUserImportExecutorMenu(); } };

	/** ユーザのメニュー */
	public userMenuItems: EIMMenuItem[] = [
		this.createUserMenu,
		this.updateUserMenu,
		this.selectGroupAndRoleMenu,
		this.deleteUserMenu,
		this.exportMenu,
		this.importMenu,
	];

	/** ユーザのコンテキストメニュー */
	public userContextMenuItems: EIMMenuItem[] = [
		this.updateUserMenu,
		this.selectGroupAndRoleMenu,
		this.deleteUserMenu,
	];

	/** フラグ用数値：1 */
	private readonly FLAG_ON = 1;

	/** ユーザ管理権限 */
	private readonly USER_DIGIT = 6;

	/** ユーザ書き込み処理非活性化フラグ */
	private disableCreateFlag = false;

	/** システム管理アプリケーション種別ID */
	public adminAppId = '';

	/** 検索条件「名称」 */
	public userName = '';

	/** 検索条件「ID」 */
	public userCode = '';

	/** 検索条件「Mail」 */
	public userMail = '';

	/** 検索条件「グループ名」 */
	public belongingGroupName = '';

	/** 検索条件「下位のグループを含む」 */
	public includingChildGroup = true;

	/** 検索条件「無効フラグ」 */
	public dispFlag = '2';

	/** 画面識別ID */
	public viewId = 'User';

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected userService: EIMUserService,
		protected adminsEntryService: EIMAdminsEntryService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected entryService: EIMEntryService,
		protected adminsGroupService: EIMAdminsGroupService,
		protected adminsRoleService: EIMAdminsRoleService,
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
	public userDataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.userId === obj2.userId);
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			this.show();
			return;
		}

		// 復元します
		this.userCode = state.userCode;
		this.userName = state.userName;
		this.userMail = state.userMail;
		this.belongingGroupName = state.belongingGroupName;
		this.includingChildGroup = state.includingChildGroup;
		this.dispFlag = state.dispFlag;

		this.userDataGrid.setState(state.userDataGrid);
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			userCode: this.userCode,
			userName: this.userName,
			userMail: this.userMail,
			belongingGroupName: this.belongingGroupName,
			includingChildGroup: this.includingChildGroup,
			dispFlag: this.dispFlag,
			userDataGrid: this.userDataGrid.getState(),
		};
	}

	/**
	 * 画面を表示します
	 */
	public show(): void {
		// ボタンの活性制御処理
		this.setButtonEnable();
	}

	/**
	 * ユーザ管理権限の有無を確認します.
	 */
	public checkAuth(): void {
		this.disableCreateFlag = !this.checkUserAuth();
		this.setButtonEnable();
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// 初期化
		this.adminAppId = this.adminsCacheService.getAppId();

		// 登録・更新・削除処理操作可否を取得
		this.checkAuth();

		let userColumns: EIMDataGridColumn[] = [];
		// ID
		userColumns.push({field: 'userCode', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02074'), width: 150, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		// 名前
		userColumns.push({field: 'userName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 280, cellRendererFramework: EIMAdminNameRendererComponent});
		// グループ
		userColumns.push({field: 'groupName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02078'), width: 280, cellRendererFramework: EIMGroupNameRendererComponent});
		// ロール
		userColumns.push({field: 'roleName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02081'), width: 270, cellRendererFramework: EIMRoleNameRendererComponent});
		// Mail
		userColumns.push({field: 'userMail', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02076'), width: 265, cellRendererFramework: EIMAdminUserDefaultRendererComponent});
		// 無効フラグ
		userColumns.push({field: 'userDisable', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02080'), width: 90, cellRendererFramework: EIMAdminUserDefaultRendererComponent});

		this.userDataGrid.setColumns(userColumns);

		this.show();
	}

	/**
	 * 検索ボタン押下時のイベントハンドラ
	 */
	public onSearch(): void {
		this.userService.searchUser(this.userName, this.userCode, null, this.userMail, this.belongingGroupName, this.includingChildGroup, Number(this.dispFlag)).subscribe(
			(userObject: EIMAdminsUserDTO[]) => {
				this.userDataGrid.setData(userObject);
			}
		);
	}

	/**
	 * ユーザ選択時のイベントハンドラ
	 */
	public onSelectedUser(): void {
		// ボタンの活性制御処理
		this.setButtonEnable();
	}

	/**
	 * グループ/ロール選択メニュー押下時のイベントハンドラ
	 * @param tabIndex タブのインデックス
	 */
	private onClickGroupRoleSelectorMenu(tabIndex: number): void {
		// 選択したユーザ取得
		let selectedDataList = this.userDataGrid.getSelectedData();
		let selectedData = selectedDataList[0];

		let strGroupIds = selectedData.groupId;
		let groupRoleList: any[] = [];

		if (strGroupIds) {
			let groupIdList: any[] = selectedData.groupId.split(',');
			let groupNameList: any[] = selectedData.groupName.split(',');
			for (let idx = 0; idx < groupIdList.length; idx++) {
				let groupParam: any = {};
				groupParam['entryId'] = groupIdList[idx];
				groupParam['entryName'] = groupNameList[idx];
				groupParam['entryTypeId'] = EIMConstantService.ENTRY_TYPE_GROUP;
				groupParam['entryTypeName'] = this.entryService.getEntryTypeName(EIMConstantService.ENTRY_TYPE_GROUP);

				groupRoleList.push(groupParam);
			}
		}

		let strRoleIds = selectedData.roleId;

		if (strRoleIds) {
			let roleIdList: any[] = strRoleIds.split(',');
			let roleNameList: any[] = selectedData.roleName.split(',');
			for (let idx = 0; idx < roleIdList.length; idx++) {
				let roleParam: any = {};
				roleParam['entryId'] = roleIdList[idx];
				roleParam['entryName'] = roleNameList[idx];
				roleParam['entryTypeId'] = EIMConstantService.ENTRY_TYPE_ROLE;
				roleParam['entryTypeName'] = this.entryService.getEntryTypeName(EIMConstantService.ENTRY_TYPE_ROLE);

				groupRoleList.push(roleParam);
			}
		}

		let dialogId: string = this.adminDialogManagerComponentService.showGroupSelector(
			tabIndex,
			groupRoleList,
			{
				selected: (data) => {
					this.updateGroupRoleList(selectedData.userId, groupRoleList, data,
						(result: boolean) => {
							// グループ/ロールに更新がある場合
							if (result) {
								let selectData = this.userDataGrid.getSelectedData();
								this.userDataGrid.select(selectData, true);
								// グループ/ロール選択画面をクローズ
								this.adminDialogManagerComponentService.close(dialogId);
								// グループ/ロール更新メッセージ
								this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_03011')}));
							} else {
								// グループ/ロール選択画面をクローズ
								this.adminDialogManagerComponentService.close(dialogId);
							}
						}
					);
				}
			}
		);
	}

	/**
	 * ユーザ登録メニュー押下時のイベントハンドラ
	 * ユーザ登録ダイアログを表示します.
	 */
	public onClickUserCreatorMenu(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showUserCreator(this.adminAppId, {
			created: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.show();
				let createData = [];
				createData.push(data);
				// 最下行に追加
				this.userDataGrid.addRowData(createData);
				// 最下行にスクロール
				this.userDataGrid.setSelectRow(this.userDataGrid.getData().length);
				this.userDataGrid.ensureIndexVisible(this.userDataGrid.getData().length - 1);
				// ユーザ登録メッセージ
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02123')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * ユーザ更新メニュー押下時のイベントハンドラ
	 * ユーザ更新ダイアログを表示します.
	 */
	public onClickUserUpdatorMenu(): void {
		// 選択したユーザ取得
		let selectedDataList = this.userDataGrid.getSelectedData();
		let selectedData = selectedDataList[0];

		let dialogId: string = this.adminDialogManagerComponentService.showUserUpdator(this.adminAppId, selectedData.userId, {
			updated: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.show();
				let updateData = [];
				updateData.push(data);
				this.userDataGrid.updateRowData(updateData);
				// ユーザ更新メッセージ
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02123')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * ユーザ削除メニュー押下時のイベントハンドラ
	 */
	public onClickUserDeletorMenu(): void {
		// 選択したユーザ取得
		let selectedDataList = this.userDataGrid.getSelectedData();
		let selectedData = selectedDataList[0];

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00008' , {value: selectedData.userCode + ' / ' + selectedData.userName}) ,
			() => {
				this.adminsEntryService.deleteUser(selectedData.userId).subscribe(
					(data: any) => {
						let deleteData = [];
						deleteData.push(selectedData);
						this.userDataGrid.removeRowData(deleteData);
						// ユーザ削除メッセージ
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02123')}));
						this.show();
					},
				);
			}
		);
	}

	/**
	 * エクスポートメニュー押下時のイベントハンドラ
	 * ユーザエクスポートダイアログを表示します.
	 */
	public onClickUserExportExecutorMenu(): void {

		let dialogId: string = this.adminDialogManagerComponentService.showUserExportExecutor(this.adminAppId,
			this.userName, this.userCode, this.userMail, this.belongingGroupName, this.includingChildGroup, Number(this.dispFlag),
			{
				executed: (data) => {
					this.adminDialogManagerComponentService.close(dialogId);
					// エクスポート完了メッセージ
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00008', {value: this.translateService.instant('EIM_ADMINS.LABEL_02123')}));
					this.show();
				},
				errored: () => {
					this.adminDialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * インポートメニュー押下時のイベントハンドラ
	 * ユーザインポートダイアログを表示します.
	 */
	public onClickUserImportExecutorMenu(): void {

		let dialogId: string = this.adminDialogManagerComponentService.showUserImportExecutor(this.adminAppId, {
			executed: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.show();
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ボタンの活性制御処理
	 */
	private setButtonEnable(): void {
		// ユーザ登録の活性非活性を制御します.
		this.createUserMenu.disabled = this.disableCreateFlag;
		this.exportMenu.disabled = this.disableCreateFlag;
		this.importMenu.disabled = this.disableCreateFlag;
		// 選択したユーザ取得
		let selectedUserList = this.userDataGrid.getSelectedData();
		if (selectedUserList && selectedUserList.length === 1) {
			// ユーザ更新・削除ボタン活性にします。
			this.updateUserMenu.disabled = this.disableCreateFlag;
			this.selectGroupAndRoleMenu.disabled = false;
			this.deleteUserMenu.disabled = this.disableCreateFlag;

		} else {
			// ユーザ更新・削除ボタン非活性にします。
			this.updateUserMenu.disabled = true;
			this.selectGroupAndRoleMenu.disabled = true;
			this.deleteUserMenu.disabled = true;
		}
	}


	/**
	 * グループ、ロールを割当てる
	 * @param addData グループ/ロール登録対象リスト
	 * @param removeData グループ/ロール削除対象リスト
	 * @param userId 対象ユーザデータ
	 * @param callbacks コールバック関数
	 */
	private assignGroupRole(addData: any[], removeData: any[], userId: number, callbacks: any ): void {
		const addGroupIds = new Array();
		const addRoleIds = new Array();
		const removeGroupIds = new Array();
		const removeRoleIds = new Array();
		// 追加
		for (let i = 0; i < addData.length; i++) {
			let param = addData[i];
			switch (param.entryTypeId) {
				// グループの場合
				case EIMConstantService.ENTRY_TYPE_GROUP:
					addGroupIds.push(param.entryId);
					break;
				// ロールの場合
				case EIMConstantService.ENTRY_TYPE_ROLE:
					addRoleIds.push(param.entryId);
					break;
			}
		}
		// 除去
		for (let i = 0; i < removeData.length; i++) {
			let param = removeData[i];
			switch (param.entryTypeId) {
				// グループの場合
				case EIMConstantService.ENTRY_TYPE_GROUP:
					removeGroupIds.push(param.entryId);
					break;
				// ロールの場合
				case EIMConstantService.ENTRY_TYPE_ROLE:
					removeRoleIds.push(param.entryId);
					break;
			}
		}
		// アサイン実行
		this.adminsEntryService.assignGroupRole(userId, addGroupIds, addRoleIds, removeGroupIds, removeRoleIds).subscribe(
			(createdData: any) => {
				this.updateUserListRow(userId, callbacks);
			},
			(err: any) => {
				callbacks(false);
			}
		);
	}

	/**
	 * グループ/ロールの登録・削除がすべて完了したら、ユーザ一覧の対象ユーザ行の表示を更新する。
	 * @param userId 対象ユーザデータ
	 * @param callbacks コールバック関数
	 */
	private updateUserListRow(userId: number, callbacks: any): void {
		// 選択後のデータを使って、ユーザ一覧のグループ/ロール情報を更新
		this.userService.searchUserId(userId).subscribe((userObject: EIMAdminsUserDTO) => {
			let updateData = [];
			updateData.push(userObject);
			this.userDataGrid.updateRowData(updateData);
			callbacks(true);
		});
	}

	/**
	 * ユーザ一覧更新処理
	 * @param userId ユーザId
	 * @param beforeList 選択前のグループ/ロールリスト
	 * @param afterList グループ/ロール選択画面で作成したグループ/ロールリスト
	 * @param callbacks コールバック関数
	 */
	private updateGroupRoleList(userId: number, beforeList: any[], afterList: any[], callbacks: any): void {
		let addData = [];
		let removeData = [];

		// 選択前のデータをmapに格納
		let beforeMap = new Map();
		for (let i = 0; i < beforeList.length; i++) {
			beforeMap.set(beforeList[i].entryId, beforeList[i]);
		}
		// 選択後のデータをmapに格納
		let affterMap = new Map();
		for (let i = 0; i < afterList.length; i++) {
			affterMap.set(afterList[i].entryId, afterList[i]);

			// 選択前のデータに存在しない場合、追加データと判断
			let mapData = beforeMap.get(afterList[i].entryId);
			if (!mapData) {
				addData.push(afterList[i]);
			}
		}
		// 選択後データに存在しない場合、削除データと判断
		for (let i = 0; i < beforeList.length; i++) {
			let mapData = affterMap.get(beforeList[i].entryId);
			if (!mapData) {
				removeData.push(beforeList[i]);
			}
		}

		// データの更新予定数を取得
		let totalUpdateCountPlan = addData.length + removeData.length;

		if (0 < removeData.length) {
			// 削除データがある場合
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00039'),
				() => {
					this.assignGroupRole(addData, removeData, userId, callbacks);
				}, () => {
					callbacks(false);
				}
			);
		} else {
			// 削除データがない場合
			if (0 < addData.length) {
				// 登録データがある場合
				this.assignGroupRole(addData, removeData, userId, callbacks);
			}
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
