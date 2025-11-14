import { Component, forwardRef, ViewChild, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTreeDataGridColumn, EIMTreeDataGridComponent } from 'app/shared/components/tree-data-grid/tree-data-grid.component';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMTreeDataGridNode } from 'app/shared/components/tree-data-grid/tree-data-grid.component.service';
import { EIMAdminsFormWorkspaceService } from 'app/admins/shared/services/apis/admins-form-workspace.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMSplitStateService } from 'app/shared/services/split-state.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMFormWorkspaceDTO } from 'app/admins/shared/dtos/form-workspace.dto';
import { EIMWorkspaceFormTypeDTO } from 'app/admins/shared/dtos/workspace-form-type.dto';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormFolderDTO } from 'app/admins/shared/dtos/form-folder.dto'
import { EIMSecurity } from 'app/documents/shared/services/apis/security.service';
import { EIMObjectSecurityDTO } from 'app/admins/shared/dtos/object-security.dto';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';


/**
 * 帳票ワークスペースコンポーネント
 * @example
 *
 *      <eim-form-workspace>
 *      </eim-form-workspace>
 */
@Component({
	selector: 'eim-form-workspace',
	templateUrl: './form-workspace.component.html',
	styleUrls: ['./form-workspace.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,

		AngularSplitModule,
		PanelModule
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMFormWorkspaceComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMFormWorkspaceComponent implements EIMAdminMainComponent, OnInit {

	/** 帳票ワークスペースデータグリッド */
	@ViewChild('formWorkspaceList', { static: true }) formWorkspaceList: EIMDataGridComponent;

	/** 帳票タイプデータグリッド */
	@ViewChild('formTypeDataGrid', { static: true }) formTypeDataGrid: EIMDataGridComponent;

	/** 帳票フォルダツリー */
	@ViewChild('formFolderTreeGrid', { static: true }) formFolderTreeGrid: EIMTreeDataGridComponent;

	/** スプリットの設定 */
	public splitSetting = { splitLeft: { size: 25 } };

	/** 画面識別ID */
	public viewId = 'FormWorkspace';

	/** アクセスセキュリティ名称 */
	public accessSecurityName: string;

	/** メニュー 帳票ワークスペース登録 */
	private menuItemWorkspaceCreate: EIMMenuItem =
		{ label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', command: (event) => { this.onClickCreateFormWorkspace(); } };
	/** メニュー 帳票ワークスペース更新 */
	private menuItemWorkspaceUpdate: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickUpdateFormWorkspace(); } };
	/** メニュー 帳票ワークスペース削除 */
	private menuItemWorkspaceDelete: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: (event) => { this.onClickDeleteFormWorkspace(); } };

	/** メニュー 帳票タイプ選択 */
	private menuItemFormTypeSelect: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: true, command: (event) => { this.onClickSelectFormType(); } };
	/** メニュー 帳票タイプ削除 */
	private menuItemFormTypeDelete: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: (event) => { this.onClickDeleteFormType(); } };

	/** メニュー 帳票フォルダ登録 */
	private menuItemFormFolderCreate: EIMMenuItem =
		{ label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', disabled: true, command: (event) => { this.onClickCreateFormFolder(); } };
	/** メニュー 帳票フォルダ更新 */
	private menuItemFormFolderUpdate: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickUpdateFormFolder(); } };
	/** メニュー 帳票フォルダ削除 */
	private menuItemFormFolderDelete: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: (event) => { this.onClickDeleteFormFolder(); } };
	/** メニュー 帳票フォルダセキュリティ変更 */
	private menuItemFormFolderSecApplicant: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03050'), icon: 'fa fa-check', disabled: true, command: (event) => { this.onClickApplyAdminSecurity(); } };

	/** 帳票ワークスペースの メニュー*/
	public workspaceFormMenubarItems: EIMMenuItem[] = [
		this.menuItemWorkspaceCreate,
		this.menuItemWorkspaceUpdate,
		this.menuItemWorkspaceDelete,
	];

	/** 帳票ワークスペースのコンテキストメニュー */
	public formWorkspaceContentsMenuItems: EIMMenuItem[] = [
		this.menuItemWorkspaceUpdate,
		this.menuItemWorkspaceDelete,
	];

	/** 帳票タイプのメニュー */
	public formTypeMenubarItems: EIMMenuItem[] = [
		this.menuItemFormTypeSelect,
		this.menuItemFormTypeDelete,
	];

	/** 帳票タイプのコンテキストメニュー */
	public formTypeContensMenuItems: EIMMenuItem[] = [
		this.menuItemFormTypeDelete,
	];

	/** 帳票フォルダのメニュー */
	public formFolderMenubarItems: EIMMenuItem[] = [
		this.menuItemFormFolderCreate,
		this.menuItemFormFolderUpdate,
		this.menuItemFormFolderDelete,
		this.menuItemFormFolderSecApplicant,
	];

	/** 帳票フォルダのコンテキストメニュー */
	public formFolderContensMenuItems: EIMMenuItem[] = [
		this.menuItemFormFolderUpdate,
		this.menuItemFormFolderDelete,
		this.menuItemFormFolderSecApplicant,
	];

	/** 選択帳票ワークスペースID */
	private selectedFormWorkspaceId = 0;

	/** 選択帳票タイプID */
	private selectedFormTypeId = 0;

	/** 処理名称 */
	private procName = '';

	/** スクロール位置 */
	private scrollTop = 0;


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected adminsFormWorkspaceService: EIMAdminsFormWorkspaceService,
		protected splitStateService: EIMSplitStateService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected securityService: EIMAdminsSecurityService,
	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		if (obj1 && obj2) {
			return (obj1.id === obj2.id);
		}
		return false;

	}


	/**
	 * 画面の状態を復元する.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			this.show();
			return;
		}

		// 復元する
		this.formWorkspaceList.setState(state.formWorkspaceList);
		this.formTypeDataGrid.setState(state.formTypeDataGrid);
		this.accessSecurityName = state.accessSecurityName;
		this.formFolderTreeGrid.setState(state.formFolderTreeGrid);
		this.splitStateService.setState(state.split, this.splitSetting);

		// メニューバーの活性制御処理
		window.setTimeout(() => {
			this.setMenubarEnable();
		});
	}


	/**
	 * 画面の状態を返却する.
	 * @return 状態
	 */
	public getState(): any {
		return {
			formWorkspaceList: this.formWorkspaceList.getState(),
			formTypeDataGrid: this.formTypeDataGrid.getState(),
			accessSecurityName: this.accessSecurityName,
			formFolderTreeGrid: this.formFolderTreeGrid.getState(),
			split: this.splitStateService.getState(this.splitSetting)

		};
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// 帳票ワークスペース一覧項目
		let columnsWorkspace: EIMDataGridColumn[] = [];
		// 名前
		columnsWorkspace.push({ field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 308, suppressFilter: true, suppressSorting: true, cellRendererFramework: EIMAdminNameRendererComponent });
		this.formWorkspaceList.setColumns(columnsWorkspace);
		this.formWorkspaceList.showAllSelectButton = false;
		this.formWorkspaceList.multiple = false;

		// 帳票タイプ一覧項目
		let formTypeColumns: EIMDataGridColumn[] = [];
		// 定義名称
		formTypeColumns.push({ field: 'formTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 232, suppressFilter: true });
		// ワークフロー
		formTypeColumns.push({ field: 'workflowName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02057'), width: 234, suppressFilter: true });
		this.formTypeDataGrid.setColumns(formTypeColumns);
		this.formTypeDataGrid.showAllSelectButton = true;

		// 帳票フォルダ一覧項目
		let formFolderColumns: EIMTreeDataGridColumn[] = [];
		// 帳票フォルダの名前
		formFolderColumns.push({ field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), icon: 'fa-lg eim-icon-folder eim-icon-folder-color' });
		// セキュリティ
		formFolderColumns.push({ field: 'securityName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02015'), width: 243 });
		this.formFolderTreeGrid.setColumns(formFolderColumns);

	}


	/**
	 * 帳票ワークスペース選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectedFormWorkspace(event: any): void {

		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace && selectedDataWorkspace.length === 1) {
			// 帳票フォルダリストをクリア
			this.formFolderTreeGrid.setData([]);
			let formWorkspaceId = selectedDataWorkspace[0].id;

			// 帳票タイプ一覧を取得
			this.getFormTypeList(formWorkspaceId);
		} else {
			this.selectedFormWorkspaceId = 0;
			this.selectedFormTypeId = 0;
			// 帳票タイプリストをクリア
			this.formTypeDataGrid.setData([]);
			// 帳票フォルダリストをクリア
			this.formFolderTreeGrid.setData([]);
			// アクセスセキュリティをクリア
			this.accessSecurityName = '';
		}

		// メニューの活性制御処理
		this.disableFormWorkspaceMenubarItem();
		this.setWorkspaceMenubarItemEnable();
	}


	/**
	 * 帳票ワークスペース登録メニュー押下時のイベントハンドラです.
	 * 帳票ワークスペース登録ダイアログを表示する.
	 */
	onClickCreateFormWorkspace(): void {
		// 帳票ワークスペース登録画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showFormWorkspaceCreator({
			created: (formWorksapceDto: EIMFormWorkspaceDTO[]) => {
				// 帳票ワークスペース登録画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
				// 処理名称を設定
				this.procName = EIMAdminsConstantService.PROC_NAME_CREATE;
				// 帳票ワークスペース一覧を取得
				this.show(formWorksapceDto[0].id);
				// 帳票ワークスペース登録メッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02011') }));
			},
			errored: () => {
				// 帳票ワークスペース登録画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}


	/**
	 * 帳票ワークスペース更新メニュー押下時のイベントハンドラです.
	 * 帳票ワークスペース更新ダイアログを表示する.
	 */
	onClickUpdateFormWorkspace(): void {
		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formWorkspaceId = selectedDataWorkspace[0].id;

		// スクロール位置を保持
		this.scrollTop = this.formWorkspaceList.getScrollTop();

		// 帳票ワークスペース更新画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showFormWorkspaceUpdator(formWorkspaceId, {
			updated: (data) => {
				// 帳票ワークスペース更新画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
				// 処理名称を設定
				this.procName = EIMAdminsConstantService.PROC_NAME_UPDATE;
				// 帳票ワークスペース一覧を取得
				this.show(formWorkspaceId);
				// 帳票ワークスペース更新メッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02011') }));

			},
			errored: () => {
				// 帳票ワークスペース更新画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});

	}


	/**
	 * 帳票ワークスペース削除メニュー押下時のイベントハンドラです.
	 * 選択されたの帳票ワークスペースを削除します.
	 */
	onClickDeleteFormWorkspace(): void {
		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let selectedData = selectedDataWorkspace[0];

		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00009', { value: selectedData.name }),
			() => {
				// 帳票ワークスペースを削除
				this.adminsFormWorkspaceService.delete(selectedData.id).subscribe(
					(result: string) => {
						// 帳票ワークスペース一覧を取得
						this.show();
						// 帳票ワークスペース削除メッセージを表示
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02011') }));
					}
				);
			}
		);
	}


	/**
	 * 帳票タイプの選択メニュー押下のイベントハンドラです.
	 */
	onClickSelectFormType(): void {
		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		// 帳票ワークスペースID
		let formWorkspaceId = selectedDataWorkspace[0].id;

		// 既に選択済み帳票タイプリスト
		let formTypeListOld = this.formTypeDataGrid.getData();
		// 帳票タイプ選択画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showFormTypeMultiSelector(formTypeListOld, {
			selected: (formTypeList) => {
				// 新追加帳票タイプIDリストを取得
				let addFormTypeIds: number[] = [];
				// 削除帳票タイプIDリストを取得
				let deleteFormTypeIds: number[] = [];

				// 帳票タイプ選択画面の選択済み一覧データが既に選択済み帳票タイプリストに存在しない帳票タイプを新追加帳票タイプIDリストに追加
				let loopCnt = formTypeList.length;
				for (let idx = 0; idx < loopCnt; idx++) {
					let formTypeId = formTypeList[idx].id;
					let addFlag = true;
					let loopCntY = formTypeListOld.length;
					for (let idy = 0; idy < loopCntY; idy++) {
						if (formTypeId === formTypeListOld[idy].id) {
							addFlag = false;
							break;
						}
					}
					// trueの場合
					if (addFlag) {
						// 帳票タイプIDを新追加帳票タイプIDリストに追加
						addFormTypeIds.push(formTypeId);
					}
				}

				// 既に選択済み帳票タイプデータが帳票タイプ選択画面の選択済み一覧データに存在しない帳票タイプを削除帳票タイプIDリストに追加
				loopCnt = formTypeListOld.length;
				for (let idx = 0; idx < loopCnt; idx++) {
					let formTypeId = formTypeListOld[idx].id;
					let deleteFlag = true;
					let loopCntY = formTypeList.length;
					for (let idy = 0; idy < loopCntY; idy++) {
						if (formTypeId === formTypeList[idy].id) {
							deleteFlag = false;
							break;
						}
					}
					// trueの場合
					if (deleteFlag) {
						// 帳票タイプIDを新追加帳票タイプIDリストに追加
						deleteFormTypeIds.push(formTypeId);
					}
				}

				// 削除される帳票タイプIDリストが存在する場合
				if (deleteFormTypeIds.length > 0) {
					this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00042'),
						() => {
							// 帳票タイプを削除
							this.adminsFormWorkspaceService.deleteFormType(formWorkspaceId, deleteFormTypeIds).subscribe(
								(resultDelete: string) => {
									// サーバ側チェックエラー
									if (resultDelete === EIMAdminsConstantService.CHECK_ERROR) {
										this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00005'));
										return;
									} else {
										// 帳票タイプ選択画面を閉じる
										this.adminDialogManagerComponentService.close(dialogId);
										// 帳票タイプ追加処理を行う
										this.addFormTypeList(formWorkspaceId, addFormTypeIds);
										if (addFormTypeIds.length === 0) {
											// 帳票タイプを取得
											this.getFormTypeList(formWorkspaceId);
										}
									}
								}
							);
						}
					);
				} else {
					// 帳票タイプ選択画面を閉じる
					this.adminDialogManagerComponentService.close(dialogId);
					// 帳票タイプ追加処理を行う
					this.addFormTypeList(formWorkspaceId, addFormTypeIds);
				}
			},
			errored: () => {
				// 帳票タイプ選択画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});

	}


	/**
	 * 帳票タイプ削除メニュー押下時のイベントハンドラです.
	 * 選択されたの帳票タイプを削除します.
	 */
	onClickDeleteFormType(): void {
		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		// 帳票ワークスペースID
		let formWorkspaceId = selectedDataWorkspace[0].id;

		// 選択した帳票タイプを取得
		let selectedDataFormType = this.formTypeDataGrid.getSelectedData();
		if (!(selectedDataFormType && selectedDataFormType.length > 0)) {
			// 未選択の場合、何もしない
			return;
		}

		// 選択した帳票タイプIDを取得
		let selectedFormTypeIds: number[] = [];
		let loopCnt = selectedDataFormType.length;
		for (let idx = 0; idx < loopCnt; idx++) {
			selectedFormTypeIds.push(selectedDataFormType[idx].id);
		}

		// 帳票タイプ削除確認メッセージを表示
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00010', {value: selectedDataFormType[0].formTypeName}),
			() => {
				// 帳票タイプを削除
				this.adminsFormWorkspaceService.deleteFormType(formWorkspaceId, selectedFormTypeIds).subscribe(
					(result: string) => {
						// サーバ側チェックエラー
						if (result === EIMAdminsConstantService.CHECK_ERROR) {
							this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00005'));
						} else {
							// 帳票タイプ一覧を取得
							this.getFormTypeList(formWorkspaceId);
							// 帳票タイプ削除メッセージを表示
							this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02013') }));
						}
					}
				);
			}
		);
	}


	/**
	 * 帳票フォルダ登録メニュー押下時のイベントハンドラです.
	 * 帳票フォルダ登録ダイアログを表示する.
	 */
	onClickCreateFormFolder(): void {
		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formWorkspaceId = selectedDataWorkspace[0].id;

		// 選択した帳票タイプを取得
		let selectedDataFormType = this.formTypeDataGrid.getSelectedData();
		if (selectedDataFormType.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formTypeId = selectedDataFormType[0].id;

		// 選択した帳票フォルダ取得
		let selectedDataFormFolder = this.formFolderTreeGrid.getSelectedData();
		let formFolderId: number;
		let formFolderName: string;
		let formFolderHierarchy = 0;
		if (selectedDataFormFolder.length === 1) {
			// 選択帳票フォルダの階層数を取得
			formFolderHierarchy = this.adminsFormWorkspaceService.countNodeHierarchy(selectedDataFormFolder[0]);
			// 階層最大数未満の場合、帳票フォルダIDと名称を設定
			if (formFolderHierarchy < EIMAdminsConstantService.FORM_FOLDER_MAX_HIERARCHY ) {
				formFolderId = selectedDataFormFolder[0].data.id;
				formFolderName = selectedDataFormFolder[0].data.name;
			}
		}

		// 帳票フォルダ登録画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showFormFolderCreator(formWorkspaceId, formTypeId, formFolderId, formFolderName, formFolderHierarchy, {
			created: (formFolderDto: EIMFormFolderDTO[]) => {
				// 帳票フォルダ登録画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
				// 処理名称を設定
				this.procName = EIMAdminsConstantService.PROC_NAME_CREATE;
				// 帳票フォルダ一覧を取得
				this.getFormFolderList(formWorkspaceId, formTypeId, formFolderDto[0].id);
				// 帳票フォルダ登録メッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02014') }));
			},
			errored: () => {
				// 帳票フォルダ登録画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});


	}


	/**
	 * 帳票フォルダ更新メニュー押下時のイベントハンドラです.
	 * 帳票フォルダ更新ダイアログを表示する.
	 */
	onClickUpdateFormFolder(): void {
		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formWorkspaceId = selectedDataWorkspace[0].id;

		// 選択した帳票タイプ取得
		let selectedDataFormType = this.formTypeDataGrid.getSelectedData();
		if (selectedDataFormType.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formTypeId = selectedDataFormType[0].id;

		// 選択した帳票フォルダ取得
		let selectedDataFormFolder = this.formFolderTreeGrid.getSelectedData();
		if (selectedDataFormFolder.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formFolderId = selectedDataFormFolder[0].data.id;

		// スクロール位置を保持
		this.scrollTop = this.formFolderTreeGrid.getScrollTop();

		// 帳票フォルダ更新画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showFormFolderUpdator(formWorkspaceId, formTypeId, formFolderId, {
			updated: (result: string) => {
				// 帳票フォルダ更新画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
				// 処理名称を設定
				this.procName = EIMAdminsConstantService.PROC_NAME_UPDATE;
				// 帳票フォルダ一覧を取得
				this.getFormFolderList(formWorkspaceId, formTypeId, formFolderId);
				// 帳票フォルダ更新メッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02014') }));

			},
			errored: () => {
				// 帳票フォルダ更新画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});

	}


	/**
	 * 帳票フォルダ削除メニュー押下時のイベントハンドラです.
	 * 選択されたの帳票フォルダを削除します.
	 */
	onClickDeleteFormFolder(): void {
		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formWorkspaceId = selectedDataWorkspace[0].id;

		// 選択した帳票タイプ取得
		let selectedDataFormType = this.formTypeDataGrid.getSelectedData();
		if (selectedDataFormType.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formTypeId = selectedDataFormType[0].id;

		// 選択した帳票フォルダ取得
		let selectedDataFormFolder = this.formFolderTreeGrid.getSelectedData();
		if (selectedDataFormFolder.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let selectedData = selectedDataFormFolder[0];

		// 親帳票フォルダ
		let parentFolder: EIMTreeDataGridNode;
		let parentFolderId: number;
		if (selectedData.parent) {
			parentFolder = (<EIMTreeDataGridNode>selectedData.parent);
			parentFolderId = parentFolder.data.id;
		}
		// 帳票フォルダ削除確認メッセージを表示
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00011', { value: selectedData.label }),
			() => {
				this.adminsFormWorkspaceService.deleteFormFolder(selectedData.data.id).subscribe(
					(result: string) => {
						// 帳票フォルダ一覧を取得
						this.getFormFolderList(formWorkspaceId, formTypeId, parentFolderId);

						// 帳票フォルダ削除メッセージを表示
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02014') }));
					}
				);
			}
		);

	}


	/**
	 * 帳票フォルダのセキュリティメニュー押下時のイベントハンドラです.
	 * 帳票フォルダのセキュリティ変更ダイアログを表示する.
	 */
	onClickApplyAdminSecurity(): void {
		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formWorkspaceId = selectedDataWorkspace[0].id;

		// 選択した帳票タイプを取得する
		let selectedDataFormType = this.formTypeDataGrid.getSelectedData();
		if (selectedDataFormType.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formTypeId = selectedDataFormType[0].id;

		// 選択した帳票フォルダを取得する
		let selectedDataFormFolder = this.formFolderTreeGrid.getSelectedData();
		if (selectedDataFormFolder.length !== 1) {
			// 未選択の場合、何もしない
			return;
		}
		let formFolderId = selectedDataFormFolder[0].data.id;
		let selectedFormFolderId = formFolderId;

		// 帳票フォルダのセキュリティを取得
		this.securityService.getProperty(selectedFormFolderId).subscribe(
			(security: EIMObjectSecurityDTO) => {
				// セキュリティ変更画面を表示
				let dialogId: string = this.adminDialogManagerComponentService.showAccessSecurityApplicant(
					EIMAdminsConstantService.ADMIN_APP_ID_FORM, security, {
						applied: (selectedSecurityList: EIMSecurity[]) => {
							// 選択したセキュリティを帳票フォルダに変更
							this.securityService.applySecurity(selectedFormFolderId, selectedSecurityList[0].secId).subscribe(
								(result: string) => {
									// セキュリティ変更画面を閉じる
									this.adminDialogManagerComponentService.close(dialogId);
									// 帳票フォルダ一覧を取得する．
									this.getFormFolderList(formWorkspaceId, formTypeId, formFolderId);
									// 帳票フォルダにセキュリティ適用メッセージを表示
									this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00006', { value: this.translateService.instant('EIM_ADMINS.LABEL_02014') }));
								},
								(errored: any) => {
									// セキュリティ変更画面を閉じる
									this.adminDialogManagerComponentService.close(dialogId);
								});
						},
						errored: () => {
							// セキュリティ変更画面を閉じる
							this.adminDialogManagerComponentService.close(dialogId);
						}
					}
				);
			}
		);
	}


	/**
	 * 帳票タイプ選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectedFormType(event: any): void {
		// 帳票タイプ削除メニュー非活性にする
		this.disableFormTypeMenubarItem();
		// 帳票フォルダ登録メニューを活性にする
		this.setFormFolderCreateMenuItemEnable();
		// 選択した帳票ワークスペースを取得
		let selectedDataWorkspace = this.formWorkspaceList.getSelectedData();
		if (selectedDataWorkspace.length !== 1) {
			// 未選択の場合、何もしない
			// 帳票フォルダのメニューを非活性化する
			this.disableFormTypeFolderMenubarItem();
			return;
		}
		let formWorkspaceId = selectedDataWorkspace[0].id;
		// 選択した帳票タイプを取得
		let selectedDataFormType = this.formTypeDataGrid.getSelectedData();
		if (selectedDataFormType && (selectedDataFormType.length === 0 || selectedDataFormType.length > 1)) {
			// 帳票フォルダ一覧をクリア
			this.selectedFormTypeId = 0;
			this.formFolderTreeGrid.setData([]);

			window.setTimeout(() => {
				this.setFormTypeMenubarItemEnable();
				if (selectedDataFormType.length > 1) {
					// 帳票タイプ削除メニューを活性化する
					this.menuItemFormTypeDelete.disabled = false;
				}
			});
		}

		if (selectedDataFormType.length === 1) {
			// 帳票フォルダ一覧を取得する．
			let formTypeId = selectedDataFormType[0].id;
			this.formFolderTreeGrid.setData([]);
			this.getFormFolderList(formWorkspaceId, formTypeId);
		}
	}


	/**
	 * 帳票フォルダ選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectedFormFolderNode(event: any): void {
		// メニューの活性制御処理
		this.setMenubarEnable();
		// 選択行を展開
		event.selectedData[0].expanded = !event.selectedData[0].expanded;
		this.formFolderTreeGrid.info.data = [...this.formFolderTreeGrid.info.data];
	}


	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * コンテンツメニューアイテムの活性非活性制御を行う
	 * @param event イベント
	 */
	onContextMenuFormFolder(event: any): void {
		// メニューの活性制御処理
		this.setFormFolderMenubarItemEnable();
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 帳票ワークスペース一覧を取得します.
	 * @param formWorkspaceId ワークスペースID
	 */
	private show(formWorkspaceId?: number): void {
		// 帳票ワークスペース一覧を取得する．
		this.adminsFormWorkspaceService.getList().subscribe(
			(formWorkspacesDto: EIMFormWorkspaceDTO[]) => {
				// 帳票ワークスペース一覧を表示
				this.formWorkspaceList.setData(formWorkspacesDto);

				// 画面に帳票ワークスペースを選択
				if (formWorkspaceId) {
					this.formWorkspaceList.select([{ id: formWorkspaceId }], false);
					// スクロールの位置を設定
					if (EIMAdminsConstantService.PROC_NAME_CREATE === this.procName) {
						// 登録処理の場合
						let rowIndex: number = this.formWorkspaceList.getRowIndex();
						this.formWorkspaceList.ensureIndexVisible(rowIndex);
					} else if (EIMAdminsConstantService.PROC_NAME_UPDATE === this.procName) {
						// 更新処理の場合
						this.formWorkspaceList.setScrollTop(this.scrollTop);
					}

				} else {
					// クリア
					this.formTypeDataGrid.setData([]);
					this.accessSecurityName = '';
					this.formFolderTreeGrid.setData([]);

				}

				// メニューの活性制御処理
				this.setMenubarEnable();

			}, (err: any) => {
				// エラーの場合
				this.formWorkspaceList.setData([]);
			});
	}


	/**
	 * 帳票タイプリストを追加します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param addFormTypeIds 帳票タイプIDリスト
	 */
	private addFormTypeList(formWorkspaceId: number, addFormTypeIds: number[]): void {

		if (addFormTypeIds.length === 0) {
			// 新追加帳票タイプID存在しない場合、なにもしない
			return;
		}
		// 新追加帳票タイプID存在すれば、帳票ワークスペースに追加する
		this.adminsFormWorkspaceService.addFormType(formWorkspaceId, addFormTypeIds).subscribe(
			(result: string) => {
				// 帳票タイプを取得
				this.getFormTypeList(formWorkspaceId, addFormTypeIds);
				// 帳票タイプ選択メッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00005', { value: this.translateService.instant('EIM_ADMINS.LABEL_02013') }));
			}
		);
	}


	/**
	 * 帳票タイプ一覧を取得します.
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param selectdFormTypeIds 帳票タイプIDリスト
	 */
	private getFormTypeList(formWorkspaceId: number, selectdFormTypeIds?: any[]): void {

		// クリア
		this.formTypeDataGrid.setData([]);
		this.formFolderTreeGrid.setData([]);
		this.accessSecurityName = '';
		this.selectedFormTypeId = 0;

		// 帳票タイプ一覧選択変更時の問い合わせ前のメニュー活性初期化を行う
		this.menuItemFormTypeSelect.disabled = true;
		this.disableFormTypeMenubarItem();

		// 選択した帳票ワークスペースを取得
		this.selectedFormWorkspaceId = formWorkspaceId;
		this.adminsFormWorkspaceService.getById(formWorkspaceId, false).subscribe(
			(workspaceForm: EIMFormWorkspaceDTO) => {
				if (this.selectedFormWorkspaceId !== formWorkspaceId) {
					// 問い合わせ前と問い合わせ後で選択帳票ワークスペースが異なる場合は何もしない
					return;
				}

				// 帳票タイプIDリストを設定
				let childrenFormTypeList = workspaceForm.children;
				let childrenFormTypeIds: number[] = [];
				if (childrenFormTypeList && childrenFormTypeList.length > 0) {
					let loopCnt = childrenFormTypeList.length;
					for (let idx = 0; idx < loopCnt; idx++) {
						childrenFormTypeIds.push(childrenFormTypeList[idx].id);
					}
				}

				// 帳票タイプIDリストがない場合
				if (childrenFormTypeIds.length === 0) {
					// メニューを活性化
					window.setTimeout(() => {
						this.setFormTypeMenubarItemEnable();
						this.setFormTypeDeleteMenuItemEnable();
					});
					// アクセスセキュリティ
					this.accessSecurityName = workspaceForm.security.name;
					return;
				}

				// 帳票タイプ一覧を取得
				this.adminsFormWorkspaceService.getFormTypeList(childrenFormTypeIds).subscribe(
					(formTypeDtoList: EIMFormTypeDTO[]) => {
						if (this.selectedFormWorkspaceId !== formWorkspaceId) {
							// 問い合わせ前と問い合わせ後で選択帳票ワークスペースが異なる場合は何もしない
							return;
						}

						// アクセスセキュリティ
						this.accessSecurityName = workspaceForm.security.name;
						// 帳票タイプ一覧を表示
						let formTypeList: EIMWorkspaceFormTypeDTO[] = [];
						if (formTypeDtoList && formTypeDtoList.length > 0) {
							let loopCnt = formTypeDtoList.length;
							for (let idx = 0; idx < loopCnt; idx++) {
								let formTypeDto = new EIMWorkspaceFormTypeDTO(formTypeDtoList[idx]);
								// 帳票タイプ定義名称
								formTypeDto.formTypeName = this.getNameNoNamespace(formTypeDto.definitionName);
								// ワークフロー名称
								formTypeDto.workflowName = this.getNameNoNamespace(formTypeDto.workflowName);
								formTypeList.push(formTypeDto);

							}
							this.formTypeDataGrid.setData(formTypeList);

							// 画面に指定した帳票タイプIDを選択
							if (selectdFormTypeIds) {
								loopCnt = selectdFormTypeIds.length;
								let addFormTypeList: any[] = [];
								for (let idx = 0; idx < loopCnt; idx++) {
									addFormTypeList.push({ id: selectdFormTypeIds[idx] });
								}
								this.formTypeDataGrid.select(addFormTypeList, false);
								// スクロール位置を設定
								let rowIndex: number = this.formTypeDataGrid.getFirstRowIndex();
								this.formTypeDataGrid.ensureIndexVisible(rowIndex);
							}
						}

						// メニューを活性化
						window.setTimeout(() => {
							this.setFormTypeMenubarItemEnable();
							this.setFormTypeDeleteMenuItemEnable();
						});
					}
				);
			}
		);

	}


	/**
	 * 帳票フォルダ一覧を取得する。
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeId 帳票タイプID
	 * @param formFolderId 帳票フォルダID
	 */
	private getFormFolderList(formWorkspaceId: number, formTypeId: number, formFolderId?: number): void {
		this.selectedFormTypeId = formTypeId;
		// 帳票フォルダ一覧を取得する．
		this.adminsFormWorkspaceService.getFormFolderList(formWorkspaceId, formTypeId, false).subscribe(
			(formTypeFolderList: EIMFormFolderDTO[]) => {
				if (this.selectedFormTypeId !== formTypeId) {
					return;
				}
				// 帳票フォルダDTOを帳票フォルダツリーノードに変換
				let formFolderTreeNodeList: EIMTreeDataGridNode[] = [];
				if (formTypeFolderList && formTypeFolderList.length > 0) {
					let loopCnt = formTypeFolderList.length;
					for (let idx = 0; idx < loopCnt; idx++) {
						let treeDataNode = this.convertToFormFolderTreeNode(formTypeFolderList[idx]);
						formFolderTreeNodeList.push(treeDataNode);
					}
				}
				// 帳票フォルダ一覧を表示
				this.formFolderTreeGrid.setData(formFolderTreeNodeList);

				// 画面に帳票フォルダを選択
				if (formFolderId) {
					// 登録・更新帳票フォルダを選択
					let selectTreeDataNode: EIMTreeDataGridNode = {};
					selectTreeDataNode.data = { id: formFolderId };
					this.formFolderTreeGrid.select([selectTreeDataNode], true);

					// スクロールの位置を設定
					if (EIMAdminsConstantService.PROC_NAME_CREATE === this.procName) {
						// 登録処理の場合
						this.formFolderTreeGrid.ensureIndexVisible(selectTreeDataNode);

					} else if (EIMAdminsConstantService.PROC_NAME_UPDATE === this.procName) {
						// 更新処理の場合
						window.setTimeout(() => {
							this.formFolderTreeGrid.setScrollTop(this.scrollTop);
						});
					}
					// 選択行を展開
					this.selectNodeParentExpand(this.formFolderTreeGrid.getSelectedData()[0]);
				}

				// 選択メニューを活性化
				window.setTimeout(() => {
					this.setFormFolderMenubarItemEnable();
				});
			}, (err: any) => {
				// エラーの場合
				this.selectedFormTypeId = 0;
				this.formFolderTreeGrid.setData([]);
			});
	}


	/**
	 * 帳票フォルダDTOを帳票フォルダツリーノードに変換する.
	 * @param formFolderDto 帳票フォルダDTO
	 * @return ツリーノード
	 */
	private convertToFormFolderTreeNode(formFolderDto: EIMFormFolderDTO): EIMTreeDataGridNode {

		// 帳票フォルダのセキュリティ
		formFolderDto.securityName = this.getNameNoNamespace(formFolderDto.securityName);

		// 親ノッドデータを設定
		let parent: EIMTreeDataGridNode = {
			label: formFolderDto.name,
			data: formFolderDto,
			leaf: (formFolderDto.children.length === 0),
		};

		// 子ノッドデータを設定
		let children: EIMTreeDataGridNode[] = [];
		let loopCnt = formFolderDto.children.length
		for (let idx = 0; idx < loopCnt; idx++) {
			children.push(this.convertToFormFolderTreeNode(formFolderDto.children[idx]));
		}

		this.hierarchicalDomainService.setChildren(parent, children);
		parent.expanded = false;

		return parent;
	}


	/**
	 * アイコンを取得する.
	 * @param dto 帳票ワークスペースDTOとその子クラスのDTO
	 * @return アイコンクラス
	 */
	private getIcon(dto: any): string {
		// 帳票ワークスペースの場合
		if (dto instanceof EIMFormWorkspaceDTO) {
			return 'fa-fw fa-lg eim-icon-form-workspace eim-icon-form-workspace-color';
		}

		// 帳票フォルダの場合
		if (dto instanceof EIMFormFolderDTO) {
			return 'fa-lg eim-icon-folder eim-icon-folder-color';
		}

		return 'fa-fw fa-lg eim-icon-form-workspace eim-icon-form-workspace-color';
	}


	/**
	 * 復元時用メニューバーの活性制御処理
	 */
	private setMenubarEnable(): void {
		if (this.formWorkspaceList.getSelectedData().length === 0) {
			this.disableFormWorkspaceMenubarItem();
			return;
		}

		// 帳票ワークスペース一覧のメニューバー制御
		this.setWorkspaceMenubarItemEnable();
		// 帳票対象一覧のメニューバー制御
		this.setFormTypeMenubarItemEnable();
		// 帳票フォルダ一覧のメニューバー制御
		this.setFormFolderMenubarItemEnable();
		// 帳票フォルダ登録メニューを活性にする
		this.setFormFolderCreateMenuItemEnable();
	}


	/**
	 * 帳票ワークスペース一覧の制御対象メニューの活性制御処理
	 */
	private setWorkspaceMenubarItemEnable(): void {
		// 選択した帳票ワークスペースを取得
		let selectedWorkspaceList = this.formWorkspaceList.getSelectedData();
		if (selectedWorkspaceList && selectedWorkspaceList.length === 1) {
			// 帳票ワークスペース更新メニュー活性にする
			this.menuItemWorkspaceUpdate.disabled = false;
		} else {
			// 帳票ワークスペース更新メニュー非活性にする
			this.menuItemWorkspaceUpdate.disabled = true;
		}

		// 帳票ワークスペース削除メニュー非活性にする
		this.menuItemWorkspaceDelete.disabled = true;
	}


	/**
	 * 帳票タイプ一覧の制御対象メニューの活性制御処理
	 */
	private setFormTypeMenubarItemEnable(): void {
		this.menuItemFormTypeSelect.disabled = false;
		// 帳票タイプが存在するかどうかを判定
		let formTypeList = this.formTypeDataGrid.getData();
		if (!formTypeList || formTypeList.length === 0) {
			// 帳票ワークスペース削除メニューを活性化する
			this.menuItemWorkspaceDelete.disabled = false;
		} else {
			// 帳票ワークスペース削除メニュー非活性にする
			this.menuItemWorkspaceDelete.disabled = true;
		}
		// 帳票フォルダ一覧の登録メニュー活性制御処理
		this.setFormFolderCreateMenuItemEnable();
	}


	/**
	 * 帳票タイプ一覧の削除メニュー活性制御処理
	 */
	private setFormTypeDeleteMenuItemEnable(): void {
		// 帳票フォルダ存在するかどうかを判定
		let formFolderList = this.formFolderTreeGrid.getData();
		if (this.formTypeDataGrid.getSelectedData().length === 1 && formFolderList.length === 0) {
			// 帳票タイプ削除メニューを活性化する
			this.menuItemFormTypeDelete.disabled = false;
		} else {
			// 帳票タイプ削除メニュー非活性にする
			this.menuItemFormTypeDelete.disabled = true;
		}
	}


	/**
	 * 帳票フォルダ一覧の登録メニュー活性制御処理
	 */
	private setFormFolderCreateMenuItemEnable(): void {
		// 選択した帳票タイプ取得
		let selectedFormTypeList = this.formTypeDataGrid.getSelectedData();
		if (selectedFormTypeList && selectedFormTypeList.length === 1) {
			// 帳票フォルダ登録メニュー活性にする
			this.menuItemFormFolderCreate.disabled = false;
		} else {
			// 帳票フォルダ登録メニュー非活性にする
			this.menuItemFormFolderCreate.disabled = true;
		}
	}


	/**
	 * 帳票フォルダ一覧の制御対象メニュー活性制御処理
	 */
	private setFormFolderMenubarItemEnable(): void {
		// 選択した帳票フォルダ取得
		let selectedFormFolderList = this.formFolderTreeGrid.getSelectedData();
		if (selectedFormFolderList && selectedFormFolderList.length === 1) {
			// 帳票フォルダ更新メニュー活性にする。
			this.menuItemFormFolderUpdate.disabled = false;

			// 子帳票フォルダがあるかどうかを判定
			let children = selectedFormFolderList[0].children;
			if (!children || children.length === 0) {
				// 子帳票フォルダがない場合、帳票フォルダ削除メニュー活性にする。
				this.menuItemFormFolderDelete.disabled = false;
			} else {
				// 子帳票フォルダがある場合、帳票フォルダ削除メニュー非活性にする。
				this.menuItemFormFolderDelete.disabled = true;
			}

			// 帳票フォルダセキュリティメニュー活性にする。
			this.menuItemFormFolderSecApplicant.disabled = false;
		} else {
			// 帳票フォルダ更新メニュー非活性にする。
			this.menuItemFormFolderUpdate.disabled = true;
			// 帳票フォルダ削除メニュー非活性にする。
			this.menuItemFormFolderDelete.disabled = true;
			// 帳票フォルダセキュリティメニュー非活性にする。
			this.menuItemFormFolderSecApplicant.disabled = true;
		}

		// 帳票タイプ一覧の削除メニュー活性制御処理
		this.setFormTypeDeleteMenuItemEnable();

	}


	/**
	 * 帳票ワークスペース一覧選択変更時の問い合わせ前のメニュー活性初期化を行います.
	 */
	private disableFormWorkspaceMenubarItem(): void {
		this.menuItemWorkspaceUpdate.disabled = true;
		this.menuItemWorkspaceDelete.disabled = true;
		this.menuItemFormTypeSelect.disabled = true;
		this.disableFormTypeMenubarItem();
	}

	/**
	 * 帳票タイプ一覧選択変更時の問い合わせ前のメニュー活性初期化を行います.
	 */
	private disableFormTypeMenubarItem(): void {
		this.menuItemFormTypeDelete.disabled = true;
		this.disableFormTypeFolderMenubarItem();
	}


	/**
	 * 帳票フォルダ一覧選択変更時の問い合わせ前のメニュー活性初期化を行います.
	 */
	private disableFormTypeFolderMenubarItem(): void {
		this.menuItemFormFolderCreate.disabled = true;
		this.menuItemFormFolderUpdate.disabled = true;
		this.menuItemFormFolderDelete.disabled = true;
		this.menuItemFormFolderSecApplicant.disabled = true;
	}


	/**
	 * ネームスペース文字列を除いた定義名称を取得する。
	 * @param definitionName ネームスペース文字列を含む定義名称
	 * @return ネームスペース文字列を除いた定義名称
	 */
	private getNameNoNamespace(name: string): string {
		let nameNoNamespace = '';
		if (name) {
			let index = name.indexOf(EIMAdminsConstantService.DELIMITER_COLON);
			nameNoNamespace = name.substring(index + 1);
		}
		return nameNoNamespace;
	}


	/**
	 * 選択されたノードの親ノードを展開時
	 * @param node ノード
	 */
	private selectNodeExpand(node: EIMTreeDataGridNode): void {

		if (node.parent) {
			this.selectNodeParentExpand(node.parent);
		}
	}


	/**
	 * 選択されたノードの親ノードを展開時
	 * @param node ノード
	 */
	private selectNodeParentExpand(node: EIMTreeDataGridNode): void {
		node.expanded = true;
		if (node.parent) {
			this.selectNodeParentExpand(node.parent);
			return;
		}

	}

}
