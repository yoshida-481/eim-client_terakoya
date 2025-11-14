import { EIMMasterContentsApproveWorkflowDiagramComponent } from 'app/documents/components/master-contents-approve-workflow-diagram/master-contents-approve-workflow-diagram.component';
import { Subscription } from 'rxjs';
import { Component, forwardRef, ViewChild, AfterViewInit, OnDestroy, Input, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMSecurity } from 'app/documents/shared/services/apis/security.service';

import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMClassTreeComponentService, EIMFolderTreeNode } from 'app/admins/components/class-tree/class-tree.component.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMFormatNameRendererComponent } from 'app/admins/shared/components/renderer/format-name-renderer.component';

import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { PanelModule } from 'primeng/panel';
import { AngularSplitModule } from 'angular-split';
import { EIMDocumentsModule } from 'app/documents/documents.module';
import { TabsModule } from 'primeng/tabs';

/** タブインデックス */
export namespace tabIndexConst {
	export const TAB_INDEX_ATTRIBUTE = 0;
	export const TAB_INDEX_FORMAT = 1;
}

/**
 * クラス(汎用)コンポーネント
 * @example
 *
 *      <eim-class>
 *      </eim-class>
 */
@Component({
    selector: 'eim-class',
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
        EIMClassTreeComponentService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMClassComponent) }
    ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMClassComponent implements EIMAdminMainComponent, AfterViewInit, OnDestroy {


	/** クラスツリーコンポーネント */
	@ViewChild('classTree', { static: true })
	classTree: EIMTreeComponent;

	/** 属性データグリッドコンポーネント */
	@ViewChild('attributeList', { static: true })
	attributeList: EIMDataGridComponent;

	/** フォーマットデータグリッドコンポーネント */
	@ViewChild('formatList', { static: true })
	formatList: EIMDataGridComponent;

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram', { static: true })
	workflowDiagram: EIMMasterContentsApproveWorkflowDiagramComponent;

	/** ステータス属性データグリッドコンポーネント */
	@ViewChild('statusAttributeList')
	statusAttributeList: EIMDataGridComponent;

	/** 画面識別ID */
	public viewId = 'Class';

	/** ラベル設定 */
	public classPanelHeader = this.translateService.instant('EIM_ADMINS.LABEL_02086');
	public attributePanelHeader = this.translateService.instant('EIM_ADMINS.LABEL_02087');
	public createDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_02274');
	public updateDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_02275');

	/** 表示列タブ非表示 */
	public visibleFormListColumn = false;
	/** ステータス属性表示 */
	public visibleStatusDataGrid = true;

	/** システム管理アプリケーション種別ID */
	public adminAppId: string;

	/** 選択タブ */
	public tabIndex = signal(0); // 初期タブインデックス

	/** 選択クラスID */
	public selectedClassId = 0;

	/** 選択ワークフローステータスID */
	protected selectedStatusTypeId = 0;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 選択発生時のイベントエミッタ */
	@Output() selected: EventEmitter<null> = new EventEmitter<null>();

	/** ダイアグラム情報取得完了サブスクリプション */
	protected fetched: Subscription;

	/** クラスツリー情報取得完了サブスクリプション */
	protected treeFetched: Subscription;

	/** フォーマット追加/削除処理半分完了フラグ(追加処理か削除処理のいずれかが完了した時true) */
	private halfCompleteFlag = false;

	/** フォーマット変更有無フラグ(1件以上フォーマットに変更があった時true) */
	private formatChangedFlag = false;

	/** 表示列データグリッドのメニュー */
	public formColumnListMenuItems: EIMMenuItem[] = [];
	//
	// メニューの定義
	//
	/** クラスメニュー：登録 */
	public createClassMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', disabled: false, command: ($event) => { this.onClickClassCreator(); }
	};
	/** クラスメニュー：更新 */
	public updateClassMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: ($event) => { this.onClickClassUpdator(); }
	};
	/** クラスメニュー：セキュリティ */
	public securityClassMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03005'), icon: 'eim-icon-pencil', disabled: false, command: ($event) => { this.onClickAccessSecurity(); }
	};
	/** クラスメニュー：更新&セキュリティ */
	public updateAndSecurityClassMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, items: [
			this.updateClassMenuItem, this.securityClassMenuItem,
		]
	};
	/** クラスメニュー：削除 */
	public deleteClassMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => { this.onClickDeleteClass(); }
	};

	/** クラスツリーのメニュー */
	public classTreeMenuItems: EIMMenuItem[] = [
		this.createClassMenuItem, this.updateAndSecurityClassMenuItem, this.deleteClassMenuItem,
	];

	/** 属性メニュー：選択 */
	public selectAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: true, command: (event) => { this.onClickAttributeSelector(); }
	};
	/** 属性メニュー：削除 */
	public deleteAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => { this.onClickDeleteAttribute(); }
	};

	/** 属性データグリッドのメニュー */
	public attributeMenuItems: EIMMenuItem[] = [
		this.selectAttributeMenuItem, this.deleteAttributeMenuItem,
	];

	/** フォーマットメニュー：選択 */
	public selectFormatMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: true, command: (event) => { this.onClickFormatSelector(); }
	};
	/** フォーマットメニュー：デフォルト設定 */
	public defaultFormatMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03037'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickUpdateDefaultFormat(); }
	};
	/** フォーマットメニュー：削除 */
	public deleteFormatMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => { this.onClickDeleteFormat(); }
	};

	/** フォーマットデータグリッドのメニュー */
	public formatMenuItems: EIMMenuItem[] = [
		this.selectFormatMenuItem, this.defaultFormatMenuItem, this.deleteFormatMenuItem,
	];

	/** ワークフローメニュー：選択 */
	public selectWorkflowMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: true, command: (event) => { this.onClickWorkflowSelector(); }
	};
	/** ワークフローメニュー：削除 */
	public deleteWorkflowMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => { this.onClickDeleteWorkflow(); }
	};

	/** ワークフローダイアグラムのメニュー */
	public workflowMenuItems: EIMMenuItem[] = [
		this.selectWorkflowMenuItem, this.deleteWorkflowMenuItem,
	];

	/** クラスツリーの右クリックメニュー */
	public classTreeContextMenuItems: EIMMenuItem[] = [
		this.updateClassMenuItem, this.securityClassMenuItem, this.deleteClassMenuItem,
	];

	/** 属性データグリッドの右クリックメニュー */
	public attributeContextMenuItems: EIMMenuItem[] = [
		this.deleteAttributeMenuItem,
	];

	/** フォーマットデータグリッドの右クリックメニュー */
	public formatContextMenuItems: EIMMenuItem[] = [
		this.defaultFormatMenuItem, this.deleteFormatMenuItem,
	];

	/** ワークフローダイアグラムの右クリックメニュー */
	public workflowContextMenuItems: EIMMenuItem[] = [
		this.deleteWorkflowMenuItem,
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected classTreeComponentService: EIMClassTreeComponentService,
		protected translateService: TranslateService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected attributeTypeService: EIMAttributeTypeService,
		protected objectService: EIMObjectService,
		protected messageService: EIMMessageService,
		protected workflowService: EIMAdminsWorkflowService,
		protected securityService: EIMAdminsSecurityService,
	) {
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
		this.workflowDiagram.setState(state.workflowDiagram);
		this.workflowDiagram.info.component['workflow'] = state.workflow;
		this.statusAttributeList.setState(state.statusAttributeList);
		this.adminAppId = state.adminAppId;
		this.tabIndex.set(state.tabIndex);
		this.selectedClassId = state.selectedClassId;
		window.setTimeout(() => {
			// クラスのメニュー活性を制御
			this.setClassMenuItemEnable();
			// 属性のメニュー活性を制御
			this.setAttMenuItemEnable();
			// フォーマットのメニュー活性を制御
			this.setFmtMenuItemEnable();
			// ワークフローのメニュー活性を制御
			this.setWorkflowMenuItemEnable();
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
			workflowDiagram: this.workflowDiagram.getState(),
			workflow: this.workflowDiagram.info.component['workflow'],
			statusAttributeList: this.statusAttributeList.getState(),
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
	 * ステータス属性データグリッドで *ngIf を設定しているため、ngAfterViewInitを利用.
	 */
	ngAfterViewInit(): void {
		this.adminAppId = EIMAdminsConstantService.ADMIN_APP_ID_GENERAL;
		let attributeColumns: EIMDataGridColumn[] = [];
		// 定義名称
		attributeColumns.push({ field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 215 });
		// 名前
		attributeColumns.push({ field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 215, cellRendererFramework: EIMAdminNameRendererComponent });
		// データ型
		attributeColumns.push({ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 130 });
		// 複数値
		attributeColumns.push({ field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 100 });
		// コードタイプ
		attributeColumns.push({ field: 'codeTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02007'), width: 150 });
		// デフォルト値
		attributeColumns.push({ field: 'defValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 150, cellRendererFramework: EIMDefaultListRendererComponent });
		this.attributeList.setColumns(attributeColumns);

		let formatColumns: EIMDataGridColumn[] = [];
		// 名前
		formatColumns.push({ field: 'formatName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 480, cellRendererFramework: EIMFormatNameRendererComponent });
		// ディレクトリ
		formatColumns.push({ field: 'path', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02025'), width: 480 });
		this.formatList.setColumns(formatColumns);
		let statusColumns: EIMDataGridColumn[] = [];
		// 名前
		statusColumns.push({ field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 160 });
		// データ型
		statusColumns.push({ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 100 });
		this.statusAttributeList.setColumns(statusColumns);

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
	 * コンポーネント破棄前イベントハンドラです.
	 */
	public ngOnDestroy(): void {
		if (this.fetched && !this.fetched.closed) {
			this.fetched.unsubscribe();
		}
		if (this.treeFetched && !this.treeFetched.closed) {
			this.treeFetched.unsubscribe();
		}
	}

	/**
	 * 画面を表示します
	 */
	public show(): void {
		this.classTreeComponentService.initialize(this.classTree.info);
	}

	/**
	 * クラス登録メニュー押下時のイベントハンドラ
	 * クラス登録ダイアログを表示します.
	 */
	onClickClassCreator(): void {
		let selectedDataList = this.classTree.getSelectedData();
		let selectedData = selectedDataList[0];
		let id: number = null;
		let name: string = null;
		if (selectedDataList.length === 1) {
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
	 * クラス更新メニュー押下時のイベントハンドラ
	 * クラス更新ダイアログを表示します.
	 */
	onClickClassUpdator(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		// クラス更新画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showClassUpdator(
			this.adminAppId,
			this.updateDialogLabel,
			selectedData.objTypeId,
			null,
			{
				updated: (data) => {
					// クラス更新画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// クラス一覧最新化
					this.classTreeComponentService.updateLatest(this.classTree.info, selectedData.objTypeId, [], null, this.selected);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02273') }));
				},
				errored: () => {
					// クラス更新画面をクローズ
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
				// クラス削除処理
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
						this.statusAttributeList.setData([]);
						this.attributeList.refreshView();
						this.formatList.refreshView();
						this.statusAttributeList.refreshView();
						// メニュー非活性化
						this.updateClassMenuItem.disabled = true;
						this.securityClassMenuItem.disabled = true;
						this.updateAndSecurityClassMenuItem.disabled = true;
						this.deleteClassMenuItem.disabled = true;
						this.selectAttributeMenuItem.disabled = true;
						this.deleteAttributeMenuItem.disabled = true;
						this.selectFormatMenuItem.disabled = true;
						this.defaultFormatMenuItem.disabled = true;
						this.deleteFormatMenuItem.disabled = true;
						this.selectWorkflowMenuItem.disabled = true;
						this.deleteWorkflowMenuItem.disabled = true;
					}
				);
			}
		);
	}

	/**
	 * アクセスセキュリティ選択メニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickAccessSecurity(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		let selectedObjId = selectedData.objTypeId;

		this.securityService.getProperty(selectedObjId).subscribe(
			(security: any) => {
				let dialogId = this.adminDialogManagerComponentService.showAccessSecurityApplicant(
					EIMAdminsConstantService.ADMIN_APP_ID_GENERAL, security, {
						applied: (selectedSecurities: EIMSecurity[]) => {
							// 変更したセキュリティを反映します
							this.securityService.applySecurity(selectedObjId, selectedSecurities[0].secId).subscribe(
								(result: any) => {
									// アクセスセキュリティ選択画面をクローズ
									this.adminDialogManagerComponentService.close(dialogId);
								},
								(err: any) => {
									// エラーの場合
									// アクセスセキュリティ選択画面をクローズ
									this.adminDialogManagerComponentService.close(dialogId);
								});
						},
						errored: () => {
							// アクセスセキュリティ選択画面をクローズ
							this.adminDialogManagerComponentService.close(dialogId);
						}
					});
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
														this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02070') }));
														// 属性選択画面をクローズ
														this.adminDialogManagerComponentService.close(dialogId);
													},
													(error: any) => {
														// 属性一覧に設定
														this.showSelectAttributeList(selectedData.objTypeId);
														// 配列をクリア
														delList.length = 0;
														addList.length = 0;
													});
										},
										(err: any) => {
											// 属性一覧に設定
											this.showSelectAttributeList(selectedData.objTypeId);
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
									this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02070') }));
									// 属性選択画面をクローズ
									this.adminDialogManagerComponentService.close(dialogId);
								},
								(error: any) => {
									// 属性一覧に設定
									this.showSelectAttributeList(selectedData.objTypeId);
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
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02070') }));
					}
				);
			});
	}

	/**
	 * フォーマット選択メニュー押下時のイベントハンドラ
	 * フォーマット選択ダイアログを表示します.
	 */
	onClickFormatSelector(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		let formatListData = this.formatList.getData();
		let addList: number[] = [];
		let delList: number[] = [];
		// フォーマット選択画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showFormatSelector(
			formatListData,
			{
				selected: (data: any[]) => {
					let workList = data;
					// 追加分抽出
					// 変更前のリストが空の場合、選択済みリスト全追加
					if (formatListData.length < 1) {
						for (let i = 0; i < workList.length; i++) {
							addList.push(workList[i].formatId);
						}
						// 変更前のリストが空でない場合、選択済みリストとの差分追加
					} else {
						let before: any = {};
						for (let i = 0; i < formatListData.length; i++) {
							before[formatListData[i].formatId] = true;
						}
						for (let i = 0; i < workList.length; i++) {
							if (!before[workList[i].formatId]) {
								addList.push(workList[i].formatId);
							}
						}
					}
					// 削除分抽出
					// 選択済みリストが空の場合、変更前のリスト全削除
					if (workList.length < 1) {
						for (let i = 0; i < formatListData.length; i++) {
							if (formatListData[i].isParentFormat) {
								this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00012'));
								return;
							}
							delList.push(formatListData[i].formatId);
						}
						// 選択済みリストが空でない場合、変更前のリストとの差分削除
					} else {
						let work: any = {};
						for (let i = 0; i < workList.length; i++) {
							work[workList[i].formatId] = true;
						}
						for (let i = 0; i < formatListData.length; i++) {
							if (!work[formatListData[i].formatId]) {
								// 削除対象に親クラスのフォーマットが含まれている場合、エラーメッセージ表示し削除処理しない
								if (formatListData[i].isParentFormat) {
									this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00012'));
									return;
								}
								delList.push(formatListData[i].formatId);
							}
						}
					}
					let totalCount = addList.length + delList.length;
					if (delList.length > 0) {
						this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00041'),
							() => {
								// 追加処理
								this.setFormatRecursive(0, addList, selectedData.objTypeId, false, dialogId);

								// 削除処理
								this.deleteFormatRecursive(0, delList, selectedData.objTypeId, false, dialogId);
							},
							() => {
								return;
							});
					} else {
						// 削除処理は完了していると見做す
						this.halfCompleteFlag = true;
						// 追加処理
						this.setFormatRecursive(0, addList, selectedData.objTypeId, false, dialogId);
					}
				},
				errored: () => {
					// フォーマット選択画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
				}
			});
	}

	/**
	 * フォーマットデフォルト設定メニュー押下時のイベントハンドラ
	 * 選択したフォーマットをデフォルトに設定します.
	 */
	onClickUpdateDefaultFormat(): void {
		let selectedFormatDataList: EIMFormatDTO[] = this.formatList.getSelectedData();
		let selectedObjectDataList: any[] = this.classTree.getSelectedData();
		if (!(selectedFormatDataList && selectedFormatDataList.length === 1)) {
			return;
		}
		let selectedFormatData = selectedFormatDataList[0];
		let selectedObjectData = selectedObjectDataList[0];
		// 確認メッセージ
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00033', { value: selectedFormatData.formatName }),
			() => {
				// デフォルト設定処理
				this.objectService.createDefaultFormat(selectedFormatData.id, selectedObjectData.objTypeId).subscribe(
					(data: any) => {
						// フォーマット一覧最新化
						this.showSelectFormatList(selectedObjectData.objTypeId);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02023') }));
					},
					(err: any) => {
					}
				);
			});
	}

	/**
	 * フォーマット削除メニュー押下時のイベントハンドラ
	 * 選択したフォーマットを削除します.
	 */
	onClickDeleteFormat(): void {
		let selectedDataList = this.classTree.getSelectedData();
		let selectedFormatDataList: EIMFormatDTO[] = this.formatList.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		let count = 0;
		// 削除確認メッセージ
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00034'),
			() => {
				let deleteFormatList: number[] = []
				for (let i = 0; i < selectedFormatDataList.length; i++) {
					deleteFormatList.push(selectedFormatDataList[i].id);
				}
				this.halfCompleteFlag = true;
				this.deleteFormatRecursive(0, deleteFormatList, selectedData.objTypeId, false);
			});
	}

	/**
	 * ワークフロー選択メニュー押下時のイベントハンドラ
	 * ワークフロー選択ダイアログを表示します.
	 */
	onClickWorkflowSelector(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		// ワークフロー選択画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowSelector({
			selected: (data) => {
				// ワークフロー選択画面をクローズ
				this.adminDialogManagerComponentService.close(dialogId);
				// ワークフローに設定
				this.objectService.createWorkflow(data.id, selectedData.objTypeId).subscribe(
					(res: any) => {
						// ワークフローダイアグラム最新化
						this.workflowDiagram.show({ objTypeId: selectedData.objTypeId });
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
					});
			}
		});
	}

	/**
	 * ワークフロー削除メニュー押下時のイベントハンドラ
	 * 選択したオブジェクトのワークフローを削除します.
	 */
	onClickDeleteWorkflow(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		// 削除確認メッセージ
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00036', { value1: selectedData.data.objName, value2: this.workflowDiagram.info.diagramName }),
			() => {
				this.objectService.deleteWorkflow(this.workflowDiagram.info.component['workflow'].objId, selectedData.objTypeId).subscribe(
					(res: any) => {
						this.workflowDiagram.clear();
						this.workflowDiagram.setData([]);
						this.workflowDiagram.info.diagramName = null;
						this.deleteWorkflowMenuItem.disabled = true;
						this.workflowDiagram.show({ objTypeId: selectedData.objTypeId });
						this.statusAttributeList.setData([]);
						this.statusAttributeList.refreshView();
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
					}
				);
			});
	}

	/**
	 * オブジェクトノード選択ハンドラ.
	 * オブジェクトIDから、属性一覧、フォーマット一覧、ワークフロー一覧を更新します.
	 * @param event イベント
	 */
	onSelectTreeNode(event: any): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			this.selectedClassId = 0;
			return;
		}
		// メニュー非活性
		this.updateClassMenuItem.disabled = true;
		this.securityClassMenuItem.disabled = true;
		this.updateAndSecurityClassMenuItem.disabled = true;
		this.deleteClassMenuItem.disabled = true;
		this.selectAttributeMenuItem.disabled = true;
		this.deleteAttributeMenuItem.disabled = true;
		this.selectFormatMenuItem.disabled = true;
		this.defaultFormatMenuItem.disabled = true;
		this.deleteFormatMenuItem.disabled = true;
		this.selectWorkflowMenuItem.disabled = true;
		this.deleteWorkflowMenuItem.disabled = true;

		let selectedData = selectedDataList[0];
		// 選択したノード展開
		selectedData.expanded = true;
		this.selectedClassId = selectedData.objTypeId;
		// 属性一覧取得
		this.showSelectAttributeList(selectedData.objTypeId);
		// フォーマット一覧取得
		this.showSelectFormatList(selectedData.objTypeId);
		// ワークフロー取得
		this.showSelectWorkflow(selectedData.objTypeId);
		// クラスのメニュー活性を制御
		this.setClassMenuItemEnable();
	}

	/**
	 * 属性選択ハンドラ.
	 * メニューの活性制御をします.
	 */
	onSelectAttribute(): void {
		// メニューの活性制御処理
		this.setAttMenuItemEnable();
	}

	/**
	 * フォーマット選択ハンドラ.
	 * メニューの活性制御をします.
	 */
	onSelectFormat(): void {
		// メニューの活性制御処理
		this.setFmtMenuItemEnable();
	}

	/**
	 * ダイアグラムのノード、エッジ選択時のイベントハンドラ
	 */
	onChangeDiagram(): void {
		let selectedDataList: any[] = this.workflowDiagram.getSelectedData();
		if (selectedDataList.length !== 1) {
			this.selectedStatusTypeId = 0;
			this.statusAttributeList.setData([]);
			return;
		}
		// ダイアグラムのノード、エッジ選択時の詳細処理へ
		this.changeDiagramDetail(selectedDataList);
	}

	/**
	 * ワークフローノード選択ハンドラ.
	 * ステータス属性一覧を更新します.
	 */
	changeDiagramDetail(selectedDataList: any[]): void {
		let selectedData = selectedDataList[0];
		// ステータス属性一覧取得
		this.selectedStatusTypeId = selectedData.id;
		this.showStatusAttribute(selectedData.id);
	}

	/**
	 * クラスツリー同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsClass(obj1: any, obj2: any): boolean {
		return (obj1.objTypeId === obj2.objTypeId);
	}

	/**
	 * 属性データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsAttribute(obj1: any, obj2: any): boolean {
		return (obj1.attTypeId === obj2.attTypeId);
	}

	/**
	 * フォーマットデータグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsFormat(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}

	/**
	 * ステータス属性データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsStatus(obj1: any, obj2: any): boolean {
		return (obj1.attTypeId === obj2.attTypeId);
	}

	/**
	 * タブ変更のイベントハンドラです.
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		this.tabIndex.set(event);

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
	 * 選択したオブジェクトの属性を取得し、表示します.
	 * @param id オブジェクトタイプID
	 */
	protected showSelectAttributeList(id: number): void {
		this.attributeTypeService.getList(id, false)
			.subscribe(
				(attributeData: EIMAttributeTypeDTO[]) => {
					if (this.selectedClassId === id) {
						this.attributeList.setData(attributeData);
						// メニューの活性制御処理
						this.setAttMenuItemEnable();
					}
				}
			)
	}

	/**
	 * 選択したオブジェクトのフォーマットを取得し、表示します.
	 * @param id オブジェクトタイプID
	 */
	protected showSelectFormatList(id: number): void {
		// フォーマットデータグリッド初期化
		this.formatList.setData([]);
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		// 選択したクラスのルートタイプがタグ、フォルダの場合、取得しない
		if (selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_TAG ||
			selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_FOLDER) {
			this.setFmtMenuItemEnable();
			return;
		}
		this.objectService.getFormatList(id, false)
			.subscribe(
				(formatData: EIMFormatDTO[]) => {
					if (this.selectedClassId === id) {
						this.formatList.setData(formatData);
						this.setFmtMenuItemEnable();
					}
				}
			)
	}

	/**
	 * 選択したオブジェクトのワークフローを取得し、表示します.
	 * @param id オブジェクトタイプID
	 */
	protected showSelectWorkflow(id: number): void {
		// ステータス属性初期化
		this.statusAttributeList.setData([]);
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		this.workflowDiagram.clear();
		this.deleteWorkflowMenuItem.disabled = true;
		if (selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_TAG) {
			return;
		}
		this.workflowDiagram.setData([]);
		this.workflowDiagram.show({ objTypeId: id });
		this.selectWorkflowMenuItem.disabled = false;
	}

	/**
	 * 選択したワークフローステータスのステータス属性一覧を取得し、表示します.
	 * @param statusTypeId ステータスタイプID
	 */
	protected showStatusAttribute(statusTypeId: number): void {
		this.workflowService.getAttributeTypeList(statusTypeId)
			.subscribe(
				(statusData: any) => {
					if (this.selectedStatusTypeId === statusTypeId) {
						this.statusAttributeList.setData(statusData);
					}
				}
			)
	}

	/**
	 * メニューバーの活性制御処理
	 */
	private setMenubarEnable(): void {
	}

	/**
	 * クラスメニューバーの活性制御処理
	 */
	protected setClassMenuItemEnable(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length === 1) {
			// クラス一覧のメニュー活性制御
			this.updateAndSecurityClassMenuItem.disabled = false;
			this.updateClassMenuItem.disabled = false;
			this.securityClassMenuItem.disabled = false;
			this.deleteClassMenuItem.disabled = false;
		} else {
			// クラス一覧のメニュー活性制御
			this.updateAndSecurityClassMenuItem.disabled = true;
			this.updateClassMenuItem.disabled = true;
			this.securityClassMenuItem.disabled = true;
			this.deleteClassMenuItem.disabled = true;
		}
	}

	/**
	 * 属性一覧メニューバーの活性制御処理
	 */
	protected setAttMenuItemEnable(): void {
		// 属性一覧のメニュー活性制御
		this.selectAttributeMenuItem.disabled = false;
		if (this.attributeList.getSelectedData().length > 0) {
			// 属性削除メニュー活性にする
			this.deleteAttributeMenuItem.disabled = false;
		} else {
			// 属性削除メニュー非活性にする
			this.deleteAttributeMenuItem.disabled = true;
		}
	}

	/**
	 * フォーマット一覧メニューバーの活性制御処理
	 */
	protected setFmtMenuItemEnable(): void {
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		if (selectedClassTree.length !== 1 ||
			selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_TAG ||
			selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_FOLDER) {
			this.selectFormatMenuItem.disabled = true;
			this.defaultFormatMenuItem.disabled = true;
			this.deleteFormatMenuItem.disabled = true;
			return;
		}
		this.selectFormatMenuItem.disabled = false;
		// 選択したフォーマット取得
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
		}
		// フォーマット一覧のメニュー活性制御
		this.defaultFormatMenuItem.disabled = defaultFlag;
		this.deleteFormatMenuItem.disabled = deleteFlag;
	}

	/**
	 * ワークフローメニューバーの活性制御処理
	 */
	protected setWorkflowMenuItemEnable(): void {
		// クラス1件選択中の場合
		if (this.classTree.getSelectedData().length === 1) {
			this.selectWorkflowMenuItem.disabled = false;
		}
		// ワークフロー名称が存在する場合は削除ボタンを活性化
		if (this.workflowDiagram.info.diagramName && this.workflowDiagram.info.diagramName.length > 0) {
			this.deleteWorkflowMenuItem.disabled = false;
		} else {
			this.deleteWorkflowMenuItem.disabled = true;
		}
	}

	/**
	 * フォーマットの再帰的割当て処理
	 * @param index 処理対象順序
	 * @param formatList 処理対象フォーマットID一覧
	 * @param objTypeId 処理対象クラスオブジェクトID
	 * @param messageFlag メッセージ表示有無(成功実績有無)
	 * @param dialogId 表示対象画面
	 */
	private setFormatRecursive(index: number, formatList: number[], objTypeId, messageFlag: boolean, dialogId: string): void {
		if (!formatList[index]) {
			if (this.halfCompleteFlag) {
				this.checkCompleteFormat(objTypeId, dialogId);
			} else {
				this.halfCompleteFlag = true;
			}
			return;
		}
		this.objectService.createFormat(formatList[index], objTypeId).subscribe(
			(res: any) => {
				index++;
				this.formatChangedFlag = true;
				if (index >= formatList.length) {
					this.checkCompleteFormat(objTypeId, dialogId);
				} else {
					this.setFormatRecursive(index, formatList, objTypeId, true, dialogId);
				}
			},
			(err: any) => {
				index++;
				if (index >= formatList.length) {
					this.checkCompleteFormat(objTypeId, dialogId);
				} else {
					this.setFormatRecursive(index, formatList, objTypeId, messageFlag, dialogId);
				}
			}
		);
	}

	/**
		 * フォーマットの再帰的削除処理
		 * @param index 処理対象順序
		 * @param formatList 処理対象フォーマットID一覧
		 * @param objTypeId 処理対象クラスオブジェクトID
		 * @param messageFlag メッセージ表示有無(成功実績有無)
		 * @param dialogId 表示対象画面
		 */
	private deleteFormatRecursive(index: number, formatList: number[], objTypeId, messageFlag: boolean, dialogId?: string): void {
		if (!formatList[index]) {
			if (this.halfCompleteFlag) {
				this.checkCompleteFormat(objTypeId, dialogId);
			} else {
				this.halfCompleteFlag = true;
			}
			return;
		}
		this.objectService.deleteFormat(formatList[index], objTypeId).subscribe(
			(res: any) => {
				index++;
				this.formatChangedFlag = true;
				if (index >= formatList.length) {
					this.checkCompleteFormat(objTypeId, dialogId);
				} else {
					this.deleteFormatRecursive(index, formatList, objTypeId, true, dialogId);
				}
			},
			(err: any) => {
				index++;
				if (index >= formatList.length) {
					this.checkCompleteFormat(objTypeId, dialogId);
				} else {
					this.deleteFormatRecursive(index, formatList, objTypeId, messageFlag, dialogId);
				}
			}
		);
	}

	/**
	 * 割当て/削除対象フォーマットが最後かどうか確認します.
	 * @param objTypeId 処理対象クラスID
	 * @param dialogId 表示ダイアログ
	 */
	private checkCompleteFormat(objTypeId: number, dialogId: string): void {
		if (!dialogId) {
			this.showSelectFormatList(objTypeId);
			this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02023') }));
			this.halfCompleteFlag = false;
			return;
		}
		if (this.halfCompleteFlag) {
			this.showSelectFormatList(objTypeId);
			// 変更が1件以上存在する時メッセージ表示
			if (this.formatChangedFlag) {
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02023') }));
			}
			// フォーマット選択画面をクローズ
			this.adminDialogManagerComponentService.close(dialogId);
			this.halfCompleteFlag = false;
			this.formatChangedFlag = false;
		} else {
			this.halfCompleteFlag = true;
		}
	}

}
