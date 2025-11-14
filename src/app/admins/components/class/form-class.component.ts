import { EIMClassComponent } from 'app/admins/components/class/class.component';
import { EIMMasterContentsApproveWorkflowDiagramComponent } from 'app/documents/components/master-contents-approve-workflow-diagram/master-contents-approve-workflow-diagram.component';
import { Subscription } from 'rxjs';
import { Component, forwardRef, ViewChild, AfterViewInit, OnDestroy, Input, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMClassTreeComponentService, EIMFolderTreeNode } from 'app/admins/components/class-tree/class-tree.component.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMObjectDTO } from 'app/admins/shared/dtos/object.dto';

import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMCheckEssentialRendererComponent } from 'app/admins/shared/components/renderer/check-essential-renderer.component';
import { EIMCheckCopyRendererComponent } from 'app/admins/shared/components/renderer/check-copy-renderer.component';
import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { EIMFormatNameRendererComponent } from 'app/admins/shared/components/renderer/format-name-renderer.component';
import { EIMWorkflowAttributeCopySettingUpdatorComponent } from 'app/admins/components/workflow-attribute-copy-setting-updator/workflow-attribute-copy-setting-updator.component';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMFormClassTreeComponentService } from 'app/admins/components/class-tree/form-class-tree.component.service';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { EIMDocumentsModule } from 'app/documents/documents.module';

/** タブインデックス */
export namespace tabIndexConst {
	export const TAB_INDEX_ATTRIBUTE = 0;
	export const TAB_INDEX_FORMAT = 1;
	export const TAB_INDEX_FORMCOLUMN = 2;
}

/**
 * クラス(帳票)コンポーネント
 * @example
 *
 *      <eim-form-class>
 *      </eim-form-class>
 */
@Component({
    selector: 'eim-form-class',
    templateUrl: './class.component.html',
    styleUrls: ['./class.component.css'],
	imports: [
		CommonModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe, 

		AngularSplitModule,
		PanelModule, 
		TabsModule,
		EIMDocumentsModule
	],
    providers: [
        EIMFormClassTreeComponentService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormClassComponent) }
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMFormClassComponent extends EIMClassComponent implements EIMAdminMainComponent, AfterViewInit, OnDestroy {

	/** 表示列データグリッドコンポーネント */
	@ViewChild('formListColumnList')
	formListColumnList: EIMDataGridComponent;

	/** ラベル設定 */
	public classPanelHeader = this.translateService.instant('EIM_ADMINS.LABEL_02013');
	public attributePanelHeader = this.translateService.instant('EIM_ADMINS.LABEL_02282');

	/** 部品表示設定 */
	public visibleFormListColumn = true;
	public disabledFormListColumn = true;

	/** システム管理アプリケーション種別ID */
	public adminAppId: string;

	public formListColumnData: EIMObjectDTO[];

	/** 選択タブ */
	public tabIndex = signal(0); // 初期タブインデックス

	/** 選択クラスID */
	public selectedClassId = 0;

	/** 選択ワークフローステータスID */
	protected selectedStatusTypeId = 0;

	/** ダイアグラム情報取得完了サブスクリプション */
	protected fetched: Subscription;

	/** クラスツリー情報取得完了サブスクリプション */
	protected treeFetched: Subscription;

	//
	// メニューの定義
	//
	/** クラスメニュー：流用作成 */
	public copyClassMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03045'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickClassCopy(); }
	};
	/** クラスメニュー：更新&流用作成 */
	public updateAndCopyClassMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, items: [
			this.updateClassMenuItem, this.copyClassMenuItem,
		]
	};
	/** クラスツリーのメニュー */
	public classTreeMenuItems: EIMMenuItem[] = [
		this.createClassMenuItem, this.updateAndCopyClassMenuItem, this.deleteClassMenuItem,
	];

	/** 属性メニュー：並べ替え */
	public sortAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03027'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickAttributeSortUpdator(); }
	};
	/** 属性メニュー：複製設定 */
	public copySettingAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03015'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickNewCopyAttributeSelector(); }
	};
	/** 属性メニュー：更新 */
	public updateAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, items: [
			this.sortAttributeMenuItem, this.copySettingAttributeMenuItem,
		]
	};
	/** 属性データグリッドのメニュー */
	public attributeMenuItems: EIMMenuItem[] = [
		this.selectAttributeMenuItem, this.updateAttributeMenuItem, this.deleteAttributeMenuItem,
	];

	/** 表示列メニュー：更新 */
	public updateformColumnListMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickAdminDisplayColumnEdit(); }
	};

	/** 表示列データグリッドのメニュー */
	public formColumnListMenuItems: EIMMenuItem[] = [
		this.updateformColumnListMenuItem,
	];

	/** クラスツリーの右クリックメニュー */
	public classTreeContextMenuItems: EIMMenuItem[] = [
		this.updateClassMenuItem, this.copyClassMenuItem, this.deleteClassMenuItem,
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected classTreeComponentService: EIMFormClassTreeComponentService,
		protected translateService: TranslateService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected attributeTypeService: EIMAttributeTypeService,
		protected objectService: EIMObjectService,
		protected messageService: EIMMessageService,
		protected workflowService: EIMAdminsWorkflowService,
		protected securityService: EIMAdminsSecurityService,
	) {
		super(classTreeComponentService, translateService, adminDialogManagerComponentService,
			attributeTypeService, objectService, messageService, workflowService, securityService);
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
		this.classTree.setState(state.classTree);
		this.attributeList.setState(state.attributeList);
		this.formatList.setState(state.formatList);
		this.disabledFormListColumn = state.disabledFormListColumn;
		if (this.formListColumnList) {
			this.formListColumnList.setState(state.formListColumnList);
		}
		this.formListColumnData = state.formListColumnData;
		this.workflowDiagram.setState(state.workflowDiagram);
		this.workflowDiagram.info.component['workflow'] = state.workflow;
		if (this.visibleStatusDataGrid) {
			this.statusAttributeList.setState(state.statusAttributeList);
		}
		this.adminAppId = state.adminAppId;
		this.tabIndex.set(state.tabIndex);
		this.selectedClassId = state.selectedClassId;
		window.setTimeout(() => {
			this.setClassMenuItemEnable();
			this.setAttMenuItemEnable();
			this.setFmtMenuItemEnable();
			this.setWorkflowMenuItemEnable();
			this.setFormListColumnMenuItemEnable();
		});
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			classTree: this.classTree.getState(),
			attributeList: this.attributeList.getState(),
			formatList: this.formatList.getState(),
			formListColumnList: this.formListColumnList ? this.formListColumnList.getState() : null,
			disabledFormListColumn: this.disabledFormListColumn,
			formListColumnData: this.formListColumnData,
			workflowDiagram: this.workflowDiagram.getState(),
			workflow: this.workflowDiagram.info.component['workflow'],
			statusAttributeList: this.visibleStatusDataGrid ? this.statusAttributeList.getState() : null,
			adminAppId: this.adminAppId,
			tabIndex: this.tabIndex(),
			selectedClassId: this.selectedClassId,
		};
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 * 表示列、ステータス属性一覧で *ngIf を設定しているため、ngAfterViewInitを利用.
	 */
	ngAfterViewInit(): void {
		this.adminAppId = EIMAdminsConstantService.ADMIN_APP_ID_FORM;
		let attributeColumns: EIMDataGridColumn[] = [];
		// 表示順
		attributeColumns.push({ field: 'dispOrder', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02021'), width: 100, type: EIMDataGridColumnType.number });
		// 複製
		attributeColumns.push({ field: 'newCopyFlag', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02009'), width: 75, cellRendererFramework: EIMCheckCopyRendererComponent });
		// 定義名称
		attributeColumns.push({ field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 140 });
		// 名前
		attributeColumns.push({ field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 140, cellRendererFramework: EIMAdminNameRendererComponent });
		// データ型
		attributeColumns.push({ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 100 });
		// 複数値
		attributeColumns.push({ field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 90 });
		// UIコントロール
		attributeColumns.push({ field: 'uiControlName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02243'), width: 110 });
		// 必須項目
		attributeColumns.push({ field: 'attTypeEssential', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02244'), cellRendererFramework: EIMCheckEssentialRendererComponent, width: 110 });
		// コードタイプ
		attributeColumns.push({ field: 'codeTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02007'), width: 110 });
		// デフォルト値
		attributeColumns.push({ field: 'initValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 110, cellRendererFramework: EIMDefaultListRendererComponent });
		this.attributeList.setColumns(attributeColumns);

		let formatColumns: EIMDataGridColumn[] = [];
		// 名前
		formatColumns.push({ field: 'formatName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 480, cellRendererFramework: EIMFormatNameRendererComponent });
		// ディレクトリ
		formatColumns.push({ field: 'path', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02025'), width: 480 });
		this.formatList.setColumns(formatColumns);

		if (this.visibleStatusDataGrid) {
			let statusAttributeColumns: EIMDataGridColumn[] = [];
			// 名前
			statusAttributeColumns.push({ field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 150 });
			// データ型
			statusAttributeColumns.push({ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 110 });
			this.statusAttributeList.setColumns(statusAttributeColumns);
		}

		// 表示列一覧設定
		if (this.formListColumnList) {
			let formListColumnColumns: EIMDataGridColumn[] = [];
			// 定義名称
			formListColumnColumns.push({ field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 480 });
			// 名前
			formListColumnColumns.push({ field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 480 });
			this.formListColumnList.setColumns(formListColumnColumns);
		}

		this.fetched = this.workflowDiagram.fetched.subscribe((target: any) => { this.setWorkflowMenuItemEnable(); });
		this.treeFetched = this.selected.subscribe((target: any) => {
			// 親クラス展開
			function parentExpand(parent: EIMFolderTreeNode, tmpClassTree: any) {
				tmpClassTree.expand(parent, true);
				if (parent.parent) {
					let nextParent = parent.parent;
					// 再帰呼出し
					parentExpand(nextParent, tmpClassTree);
				}
			}
			// 最も上位の親クラスまで展開
			if (this.classTree.getSelectedData()[0].parent) {
				parentExpand(this.classTree.getSelectedData()[0].parent, this.classTree);
			}
			this.onSelectTreeNode(null);
			window.setTimeout(() => {
				// 選択中のクラスへスクロール位置調整
				this.classTree.ensureIndexVisible(this.classTree.getSelectedData()[0]);
			});
		});
	}

	/**
	 * クラス登録メニュー押下時のイベントハンドラ
	 * クラス登録ダイアログを表示します.
	 */
	onClickClassCreator(): void {
		let id: number;
		let name: string;
		let selectedDataList: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		let selectedData = selectedDataList[0];
		if (selectedDataList.length !== 1 ||
			selectedDataList[0].rootObjTypeDefName !== EIMAdminsConstantService.OBJECT_TYPE_NAME_FORM) {
			id = null;
			name = null;
		} else {
			id = selectedData.objTypeId;
			name = selectedData.label;
		}
		// クラス登録画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showClassCreator(
			this.adminAppId,
			this.createDialogLabel,
			id,
			name,
			null,
			{
				created: (data) => {
					// クラス登録画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// クラス一覧最新化
					this.classTreeComponentService.updateLatest(this.classTree.info, data[0].objTypeId, [], null, this.selected);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02273') }));
				},
				errored: () => {
					// クラス登録画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
				}
			});
	}

	/**
	 * クラス流用作成メニュー押下時のイベントハンドラ
	 * クラス流用作成ダイアログを表示します.
	 */
	onClickClassCopy(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		// 流用作成画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showClassCopy(
			selectedData.objTypeId,
			{
				created: (data) => {
					// 流用作成画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// クラス一覧最新化
					this.classTreeComponentService.updateLatest(this.classTree.info, data[0].objTypeId, [], null, this.selected);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02273') }));
				},
				errored: () => {
					// 流用作成画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
				}
			});
	}

	/**
	 * クラス削除メニュー押下時のイベントハンドラ
	 * クラス削除ダイアログを表示します.
	 */
	onClickDeleteClass(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		// 削除確認メッセージ
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00035', { value: selectedData.label }),
			() => {
				this.objectService.delete(selectedData.objTypeId).subscribe(
					(data: any) => {
						// クラス一覧最新化
						let parentId = null
						if (selectedData.parent) {
							parentId = selectedData.parent['objTypeId'];
						}
						this.classTreeComponentService.updateLatest(this.classTree.info, parentId, [], null, this.selected);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02273') }));
						// クラス未選択状態になるため、各一覧の初期化
						this.attributeList.setData([]);
						this.formatList.setData([]);
						this.workflowDiagram.clear();
						this.workflowDiagram.setData([]);
						if (this.visibleStatusDataGrid) {
							this.statusAttributeList.setData([]);
						}
						if (this.formListColumnList) {
							this.formListColumnList.setData([]);
						}
						this.attributeList.refreshView();
						this.formatList.refreshView();
						if (this.visibleStatusDataGrid) {
							this.statusAttributeList.refreshView();
						}
						if (this.formListColumnList) {
							this.formListColumnList.refreshView();
						}
						// メニュー非活性化
						this.updateClassMenuItem.disabled = true;
						this.copyClassMenuItem.disabled = true;
						this.updateAndCopyClassMenuItem.disabled = true;
						this.deleteClassMenuItem.disabled = true;
						this.selectAttributeMenuItem.disabled = true;
						this.sortAttributeMenuItem.disabled = true;
						this.copySettingAttributeMenuItem.disabled = true;
						this.deleteAttributeMenuItem.disabled = true;
						this.selectFormatMenuItem.disabled = true;
						this.defaultFormatMenuItem.disabled = true;
						this.deleteFormatMenuItem.disabled = true;
						this.updateformColumnListMenuItem.disabled = true;
						this.selectWorkflowMenuItem.disabled = true;
						this.deleteWorkflowMenuItem.disabled = true;
					},
					(err: any) => {
						return;
					}
				);
			}
		);
	}

	/**
	 * 属性選択メニュー押下時のイベントハンドラ
	 * 属性選択ダイアログを表示します.
	 */
	onClickAttributeSelector(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];

		let beforeDataList = this.attributeList.getData();
		let addList: number[] = [];
		let delList: number[] = [];
		let workList: EIMAttributeTypeDTO[] = [];
		// 属性選択画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showAttributeSelector(
			this.attributeList.getData(),
			this.adminAppId,
			false,
			null,
			null,
			{
				selected: (data: EIMAttributeTypeDTO[]) => {
					workList = data;
					// 追加分抽出
					// 選択前のリストが空の場合、選択済みリスト全追加
					if (beforeDataList.length < 1) {
						for (let i = 0; i < workList.length; i++) {
							addList.push(workList[i].attTypeId);
						}
						// 選択前のリストが空でない場合、差分追加
					} else {
						let before: any = {};
						for (let i = 0; i < beforeDataList.length; i++) {
							before[beforeDataList[i].attTypeId] = true;
						}
						for (let i = 0; i < workList.length; i++) {
							if (!before[workList[i].attTypeId]) {
								addList.push(workList[i].attTypeId);
							}
						}
					}
					// 削除分抽出
					// 選択済みリストがない場合、選択前のリスト全削除
					if (workList.length < 1) {
						for (let i = 0; i < beforeDataList.length; i++) {
							delList.push(beforeDataList[i].attTypeId);
						}
						// 選択済みリストがある場合、差分削除
					} else {
						let work: any = {};
						for (let i = 0; i < workList.length; i++) {
							work[workList[i].attTypeId] = true;
						}
						for (let i = 0; i < beforeDataList.length; i++) {
							if (!work[beforeDataList[i].attTypeId]) {
								delList.push(beforeDataList[i].attTypeId);
							}
						}
					}
					if (delList.length > 0) {
						this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00031'),
							() => {
								// 削除処理
								this.objectService.deleteAttributeType(delList, selectedData.objTypeId)
									.subscribe(
										(res: any) => {
											// 追加処理
											this.objectService.createAttributeType(addList, selectedData.objTypeId)
												.subscribe(
													(result: any) => {
														// 属性一覧に設定
														this.showSelectAttributeList(selectedData.objTypeId);
														// 表示列最新化
														this.showSelectFormListColumnList(selectedData.objTypeId);
														this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02070') }));
														// 属性選択画面をクローズ
														this.adminDialogManagerComponentService.close(dialogId);
													},
													(error: any) => {
														// 属性一覧に設定
														this.showSelectAttributeList(selectedData.objTypeId);
														// 表示列最新化
														this.showSelectFormListColumnList(selectedData.objTypeId);
														// 配列をクリア
														delList.length = 0;
														addList.length = 0;
													});
										},
										(err: any) => {
											// 属性一覧に設定
											this.showSelectAttributeList(selectedData.objTypeId);
											// 表示列最新化
											this.showSelectFormListColumnList(selectedData.objTypeId);
											// 配列をクリア
											delList.length = 0;
											addList.length = 0;
										});
							},
							() => {
								return;
							}
						);
					} else {
						// 追加処理
						this.objectService.createAttributeType(addList, selectedData.objTypeId)
							.subscribe(
								(result: any) => {
									// 属性一覧に設定
									this.showSelectAttributeList(selectedData.objTypeId);
									// 表示列最新化
									this.showSelectFormListColumnList(selectedData.objTypeId);
									this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02070') }));
									// 属性選択画面をクローズ
									this.adminDialogManagerComponentService.close(dialogId);
								},
								(error: any) => {
									// 属性一覧に設定
									this.showSelectAttributeList(selectedData.objTypeId);
									// 表示列最新化
									this.showSelectFormListColumnList(selectedData.objTypeId);
									// 配列をクリア
									addList.length = 0;
								});
					}
				},
				errored: () => {
					// 属性選択画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * 並べ替えメニュー押下時のイベントハンドラ
	 * 属性タイプ並べ替えダイアログを表示します.
	 */
	onClickAttributeSortUpdator(): void {
		let objTypeId: number = this.classTree.getSelectedData()[0].objTypeId;
		if (this.attributeList && this.attributeList.getData() && this.attributeList.getData().length > 0) {
			let dialogId: string = this.adminDialogManagerComponentService.showAttTypeSortUpdator(
				objTypeId,
				this.adminAppId,
				null,
				{
					updated: (data) => {
						// 属性タイプ並べ替え画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
						this.attributeTypeService.getList(objTypeId).subscribe(
							(attTypeList: EIMAttributeTypeDTO[]) => {
								this.attributeList.setData(attTypeList);
								this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02070') }));
								// エラーの場合
							}, (err: any) => {
								window.setTimeout(() => {
									this.errored.emit();
								})
							});
					},
					errored: () => {
						// 属性タイプ並べ替え画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
					}
				}
			);
		}
	}

	/**
	 * 複製設定メニュー押下時のイベントハンドラ
	 * 複製設定ダイアログを表示します.
	 */
	onClickNewCopyAttributeSelector(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];

		let attributeData: any[];
		attributeData = this.attributeList.getData();
		// 複製設定画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowAttributeCopySetting(
			attributeData,
			{
				updated: (data) => {
					// 複製設定画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// 複製設定
					if (data.length > 0) {
						let attributeId: number[] = [];
						let copyFlag: boolean[] = [];
						for (let i = 0; i < data.length; i++) {
							copyFlag.push(data[i].newCopyFlag);
							attributeId.push(data[i].attTypeId);
						}
						this.objectService.createNewCopyAttributeType(copyFlag, selectedData.objTypeId, attributeId)
							.subscribe(
								(res: any) => {
									// 属性一覧を最新化
									this.showSelectAttributeList(selectedData.objTypeId);
									this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02070') }));
								}
							);
					}
				},
				errored: (err) => {
					// 複製設定画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * 属性削除メニュー押下時のイベントハンドラ
	 * 属性削除ダイアログを表示します.
	 */
	onClickDeleteAttribute(): void {
		let selectedDataList = this.classTree.getSelectedData();
		let selectedAttributeDataList = this.attributeList.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		let attributeId: number[] = [];
		// 削除する属性ID格納
		for (let i = 0; i < selectedAttributeDataList.length; i++) {
			attributeId.push(selectedAttributeDataList[i].id);
		}

		// 削除確認メッセージ
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00030'),
			() => {
				// 削除処理
				this.objectService.deleteAttributeType(attributeId, selectedData.objTypeId).subscribe(
					(res: any) => {
						// 属性一覧最新化
						this.showSelectAttributeList(selectedData.objTypeId);
						// 表示列最新化
						this.showSelectFormListColumnList(selectedData.objTypeId);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02070') }));
					}
				);
			});
	}

	/**
	 * 表示列更新メニュー押下時のイベントハンドラ
	 * 表示列更新ウィンドウを表示します.
	 */
	onClickAdminDisplayColumnEdit(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		// 表示列更新画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showClassDisplayColumnEditor(
			selectedData.objTypeId, this.formListColumnData, {
				applied: (data: EIMObjectDTO[]) => {
					if (!data) {
						// 表示列更新画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
					} else {
						if (this.formListColumnList) {
							this.formListColumnList.setData(data);
						}
						// 表示列最新化
						this.showSelectFormListColumnList(selectedData.objTypeId);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02276') }));
						// 表示列更新画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
					}
				},
				errored: () => {
					// 表示列更新画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * オブジェクトノード選択ハンドラ.
	 * オブジェクトIDから、属性一覧、フォーマット一覧、表示列、ワークフローを更新します.
	 * @param event イベント
	 */
	onSelectTreeNode(event: any): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			this.selectedClassId = 0;
			return;
		}
		// メニュー非活性化
		this.updateClassMenuItem.disabled = true;
		this.copyClassMenuItem.disabled = true;
		this.updateAndCopyClassMenuItem.disabled = true;
		this.deleteClassMenuItem.disabled = true;
		this.selectAttributeMenuItem.disabled = true;
		this.sortAttributeMenuItem.disabled = true;
		this.copySettingAttributeMenuItem.disabled = true;
		this.deleteAttributeMenuItem.disabled = true;
		this.selectFormatMenuItem.disabled = true;
		this.defaultFormatMenuItem.disabled = true;
		this.deleteFormatMenuItem.disabled = true;
		this.updateformColumnListMenuItem.disabled = true;
		this.selectWorkflowMenuItem.disabled = true;
		this.deleteWorkflowMenuItem.disabled = true;

		let selectedData = selectedDataList[0];
		// 選択したノード展開
		selectedData.expanded = true;
		this.selectedClassId = selectedData.objTypeId;
		// クラスメニュー活性制御
		this.setClassMenuItemEnable();
		// 属性一覧取得
		this.showSelectAttributeList(selectedData.objTypeId);
		// フォーマット一覧取得
		this.showSelectFormatList(selectedData.objTypeId);
		// 表示列取得
		this.showSelectFormListColumnList(selectedData.objTypeId);
		// ワークフロー取得
		this.showSelectWorkflow(selectedData.objTypeId);
	}

	/**
	 * ワークフローノード選択ハンドラ.
	 * ステータス属性一覧を更新します.
	 */
	onSelectWorkflow(): void {
		let selectedDataList: any[] = this.workflowDiagram.getSelectedData();
		if (selectedDataList.length !== 1) {
			this.selectedStatusTypeId = 0;
			return;
		}
		let selectedData = selectedDataList[0];
		// ステータス属性一覧取得
		this.selectedStatusTypeId = selectedData.id;
		this.showStatusAttribute(selectedData.id);
	}

	/**
	 * 表示列データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsFormListColumn(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 選択したオブジェクトのフォーマットを取得し、表示します.
	 * @param id オブジェクトタイプID
	 */
	protected showSelectFormatList(id: number): void {
		this.objectService.getFormatList(id, false)
			.subscribe(
				(formatData: EIMFormatDTO[]) => {
					if (this.selectedClassId === id) {
						this.formatList.setData(formatData);
						// メニューの活性制御処理
						this.setFmtMenuItemEnable();
					}
				}
			);
	}

	/**
	 * 選択したオブジェクトの表示列を取得し、表示します.
	 * @param id オブジェクトタイプID
	 */
	private showSelectFormListColumnList(id: number): void {
		let selectedDataList: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			this.setFormListColumnMenuItemEnable();
			return;
		}
		let selectedData = selectedDataList[0];
		// 選択したクラスがルートタイプの場合、取得しない
		if (selectedDataList[0].objTypeName === this.translateService.instant('EIM_ADMINS.LABEL_02248') ||
			selectedDataList[0].objTypeName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT ||
			selectedDataList[0].objTypeName === EIMAdminsConstantService.PRIMARY_ATTACHMENT) {
			// グリッドをクリアする
			if (this.formListColumnList) {
				this.formListColumnList.setData([]);
			}
			this.setFormListColumnMenuItemEnable();
			return;
		}
		this.objectService.getFormListColumn(id, false)
			.subscribe(
				(formListColumnData: EIMObjectDTO[]) => {
					if (this.selectedClassId === id) {
						this.formListColumnData = formListColumnData;
						if (this.formListColumnList) {
							this.formListColumnList.setData(formListColumnData[0].systemSettingFormListColumns);
						}
						this.setFormListColumnMenuItemEnable();
						this.disabledFormListColumn = false;
					}
				},
				(err: any) => {
					// グリッドをクリアする
					if (this.formListColumnList) {
						this.formListColumnList.setData([]);
					}
					this.setFormListColumnMenuItemEnable();
				}
			)
	}

	/**
	 * 選択したオブジェクトのワークフローを取得し、表示します.
	 * @param id オブジェクトタイプID
	 */
	protected showSelectWorkflow(id: number): void {
		let tempId = { objTypeId: id };
		// ステータス属性初期化
		if (this.visibleStatusDataGrid) {
			this.statusAttributeList.setData([]);
		}
		this.workflowDiagram.clear();
		this.deleteWorkflowMenuItem.disabled = true;
		this.workflowDiagram.setData([]);
		this.workflowDiagram.show(tempId);
		this.selectWorkflowMenuItem.disabled = false;
	}

	/**
	 * クラスメニューバーの活性制御処理
	 * @param setValue 設定値 true: 非活性 false: 活性
	 */
	protected setClassMenuItemEnable(): void {
		// クラス一覧のメニュー活性制御
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		if (selectedClassTree.length > 0) {
			// 選択したオブジェクトがルートタイプの場合は非活性
			if (selectedClassTree[0].objTypeName === this.translateService.instant('EIM_ADMINS.LABEL_02248') ||
				selectedClassTree[0].objTypeName === this.translateService.instant('EIM_ADMINS.LABEL_02285') ||
				selectedClassTree[0].objTypeName === this.translateService.instant('EIM_ADMINS.LABEL_02284')) {
				this.updateAndCopyClassMenuItem.disabled = true;
				this.updateClassMenuItem.disabled = true;
				this.copyClassMenuItem.disabled = true;
				this.deleteClassMenuItem.disabled = true;
			} else {
				this.updateAndCopyClassMenuItem.disabled = false;
				this.updateClassMenuItem.disabled = false;
				this.copyClassMenuItem.disabled = false;
				this.deleteClassMenuItem.disabled = false;
			}
		} else {
			this.updateAndCopyClassMenuItem.disabled = true;
			this.updateClassMenuItem.disabled = true;
			this.copyClassMenuItem.disabled = true;
			this.deleteClassMenuItem.disabled = true;
		}
	}

	/**
	 * 属性一覧メニューバーの活性制御処理
	 * @param setValue 設定値 true: 非活性 false: 活性
	 */
	protected setAttMenuItemEnable(): void {
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		if (selectedClassTree && selectedClassTree.length > 0) {
			this.selectAttributeMenuItem.disabled = false;
			let attributeData = this.attributeList.getData();
			if (attributeData && attributeData.length > 0) {
				this.copySettingAttributeMenuItem.disabled = false;
				if (attributeData.length > 1) {
					this.sortAttributeMenuItem.disabled = false;
				} else {
					this.sortAttributeMenuItem.disabled = true;
				}
			} else {
				this.copySettingAttributeMenuItem.disabled = true;
				this.sortAttributeMenuItem.disabled = true;
			}
			// 選択した属性取得
			let selectedAttList = this.attributeList.getSelectedData();
			if (selectedAttList && selectedAttList.length > 0) {
				// 属性削除メニュー活性にする
				this.deleteAttributeMenuItem.disabled = false;
			} else {
				// 属性削除メニュー非活性にする
				this.deleteAttributeMenuItem.disabled = true;
			}
		} else {
			this.selectAttributeMenuItem.disabled = true;
			this.copySettingAttributeMenuItem.disabled = true;
			this.sortAttributeMenuItem.disabled = true;
			this.deleteAttributeMenuItem.disabled = true;
		}
		this.updateAttributeMenuItem.disabled = (this.copySettingAttributeMenuItem.disabled && this.sortAttributeMenuItem.disabled);
	}

	/**
	 * フォーマット一覧メニューバーの活性制御処理
	 */
	protected setFmtMenuItemEnable(): void {
		// フォーマット一覧のメニュー活性制御
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		if (selectedClassTree.length > 0) {
			this.selectFormatMenuItem.disabled = false;
			// 選択中のフォーマット取得
			let selectedFmtList = this.formatList.getSelectedData();
			let deleteFlag = true;
			let defaultFlag = true;
			// フォーマットを１件以上選択している場合
			if (selectedFmtList && selectedFmtList.length > 0) {
				for (let i = 0; i < selectedFmtList.length; i++) {
					// 親クラスのフォーマットの場合は削除メニュー非活性
					if (selectedFmtList[i].isParentFormat) {
						deleteFlag = true;
						break;
						// 親クラスのフォーマットでない場合は削除メニュー活性
					} else {
						deleteFlag = false;
					}
				}
				// フォーマットを1件のみ選択している場合、デフォルト設定メニュー活性
				if (selectedFmtList && selectedFmtList.length === 1) {
					defaultFlag = false;
				}
				// フォーマット未選択の場合、デフォルト設定、削除メニュー非活性
			}
			this.defaultFormatMenuItem.disabled = defaultFlag;
			this.deleteFormatMenuItem.disabled = deleteFlag;
			// クラス未選択の場合、フォーマット全メニュー非活性
		} else {
			this.selectFormatMenuItem.disabled = true;
			this.defaultFormatMenuItem.disabled = true;
			this.deleteFormatMenuItem.disabled = true;
		}
	}

	/**
	 * 表示列メニューバーの活性制御処理
	 */
	private setFormListColumnMenuItemEnable(): void {
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		if (selectedClassTree.length > 0) {
			// 選択したオブジェクトが帳票、もしくはルートタイプが帳票添付ファイル、一時添付ファイルの場合は非活性
			if (selectedClassTree[0].objTypeName === this.translateService.instant('EIM_ADMINS.LABEL_02248') ||
				selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT ||
				selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.PRIMARY_ATTACHMENT) {
				// 表示列のメニュー活性
				this.updateformColumnListMenuItem.disabled = true;
			} else {
				// 表示列のメニュー非活性
				this.updateformColumnListMenuItem.disabled = false;
			}
		} else {
			// 表示列のメニュー非活性
			this.updateformColumnListMenuItem.disabled = true;
		}
	}
}
