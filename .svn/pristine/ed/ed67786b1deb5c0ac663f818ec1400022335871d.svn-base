import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMMasterContentsApproveWorkflowDiagramComponent } from 'app/documents/components/master-contents-approve-workflow-diagram/master-contents-approve-workflow-diagram.component';
import { Subscription } from 'rxjs';
import { EIMAttributeTypeNameRendererComponent } from 'app/admins/shared/components/renderer/attribute-type-name-renderer.component';
import { Component, forwardRef, ViewChild, OnInit, OnDestroy, SimpleChanges, Input, EventEmitter, Output, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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

import { EIMAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMObjectDTO } from 'app/admins/shared/dtos/object.dto';
import { EIMObjectSecurityDTO } from 'app/admins/shared/dtos/object-security.dto';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMSecurity } from 'app/documents/shared/services/apis/security.service';

import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { EIMFormatNameRendererComponent } from 'app/admins/shared/components/renderer/format-name-renderer.component';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMClassComponent } from 'app/admins/components/class/class.component';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
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
}

/**
 * クラス(ドキュメント)コンポーネント
 * @example
 *
 *      <eim-document-class>
 *      </eim-document-class>
 */
@Component({
    selector: 'eim-document-class',
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
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentClassComponent) }
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMDocumentClassComponent extends EIMClassComponent implements OnInit, AfterViewInit {

	/** ラベル設定 */
	public classPanelHeader = this.translateService.instant('EIM_ADMINS.LABEL_02279');
	public createDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_02280');
	public updateDialogLabel = this.translateService.instant('EIM_ADMINS.LABEL_02281');

	/** ステータス属性表示 */
	public visibleStatusDataGrid = false;

	//
	// メニューの定義
	//
	/** 属性メニュー：並べ替え */
	public sortAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03027'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickAttributeSortUpdator(); }
	};
	/** 属性メニュー：引継ぎ・関連付け設定 */
	public inheritanceAndRelationMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03038'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickInheritanceAndRelationAttributeUpdator(); }
	};
	/** 属性メニュー：更新 */
	public updateAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, items: [
			this.sortAttributeMenuItem, this.inheritanceAndRelationMenuItem,
		]
	};
	/** 属性データグリッドのメニュー */
	public attributeMenuItems: EIMMenuItem[] = [
		this.selectAttributeMenuItem, this.updateAttributeMenuItem, this.deleteAttributeMenuItem,
	];

	/** 前回選択ドキュメントタイプフラグ */
	private wasSelectedDocumentType = false;

	/** ドキュメントタイプ選択時属性カラム */
	private docTypeAttributeColumns: EIMDataGridColumn[] = [
		// 表示順
		{ field: 'dispOrder', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02021'), width: 100, type: EIMDataGridColumnType.number },
		// 名前
		{ field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 180, cellRendererFramework: EIMAttributeTypeNameRendererComponent },
		// データ型
		{ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 140 },
		// 入力規則
		{ field: 'inputRuleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02256'), width: 130 },
		// 複数値
		{ field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 115 },
		// UIコントロール
		{ field: 'uiControlName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02243'), width: 140 },
		// デフォルト値
		{ field: 'initValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 160, cellRendererFramework: EIMDefaultListRendererComponent },
	];

	/** ドキュメントタイプ以外選択時属性カラム */
	private defAttributeColumns: EIMDataGridColumn[] = [
		// 名前
		{ field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 320, cellRendererFramework: EIMAttributeTypeNameRendererComponent },
		// データ型
		{ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 250 },
		// 入力規則
		{ field: 'inputRuleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02256'), width: 180 },
		// 複数値
		{ field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 160 },
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
		protected adminsCacheService: EIMAdminsCacheService,
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
		this.workflowDiagram.setState(state.workflowDiagram);
		this.workflowDiagram.info.component['workflow'] = state.workflow;
		this.adminAppId = state.adminAppId;
		this.tabIndex.set(state.tabIndex);
		this.selectedClassId = state.selectedClassId;
		this.wasSelectedDocumentType = state.wasSelectedDocumentType;
		window.setTimeout(() => {
			this.setClassMenuItemEnable();
			this.setAttMenuItemEnable();
			this.setFmtMenuItemEnable();
			this.setWorkflowMenuItemEnable();
		});
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		// タイプ管理画面から離れるタイミングでキャッシュ情報を削除する(過去の情報に変更が入った可能性があるため)
		this.adminsCacheService.clearHierarchicalObjectTypes();
		return {
			classTree: this.classTree.getState(),
			attributeList: this.attributeList.getState(),
			formatList: this.formatList.getState(),
			workflowDiagram: this.workflowDiagram.getState(),
			workflow: this.workflowDiagram.info.component['workflow'],
			adminAppId: this.adminAppId,
			tabIndex: this.tabIndex(),
			selectedClassId: this.selectedClassId,
			wasSelectedDocumentType: this.wasSelectedDocumentType,
		};
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.adminAppId = EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT;
		this.attributeList.setColumns(this.docTypeAttributeColumns);

		let formatColumns: EIMDataGridColumn[] = [];
		// 名前
		formatColumns.push({ field: 'formatName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 480, cellRendererFramework: EIMFormatNameRendererComponent });
		// ディレクトリ
		formatColumns.push({ field: 'path', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02025'), width: 480 });
		this.formatList.setColumns(formatColumns);

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
	 * 入力値初期化後のイベントハンドラです.
	 * 継承元の初期化後のロジックを非活性化するために実装しています.
	 */
	ngAfterViewInit(): void {
	}

	/**
	 * クラス登録メニュー押下時のイベントハンドラ
	 * クラス登録ダイアログを表示します.
	 */
	onClickClassCreator(): void {
		let id: number;
		let name: string;
		let rootObjTypeDefName: string;
		let selectedDataList: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		let selectedData = selectedDataList[0];
		if (selectedDataList.length !== 1) {
			id = null;
			name = null;
			rootObjTypeDefName = null;
		} else {
			id = selectedData.objTypeId;
			name = selectedData.label;
			rootObjTypeDefName = selectedDataList[0].rootObjTypeDefName;
		}
		// クラス登録画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showClassCreator(
			this.adminAppId,
			this.createDialogLabel,
			id,
			name,
			rootObjTypeDefName,
			{
				created: (data) => {
					// クラス登録画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// クラス一覧最新化
					this.classTreeComponentService.updateLatest(this.classTree.info, data[0].objTypeId, [], null, this.selected);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02020') }));
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
		let selectedDataList: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		// クラス更新画面表示
		let dialogId: string = this.adminDialogManagerComponentService.showClassUpdator(
			this.adminAppId,
			this.updateDialogLabel,
			selectedData.objTypeId,
			selectedData.rootObjTypeDefName,
			{
				updated: (data) => {
					// クラス更新画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// クラス一覧最新化
					this.classTreeComponentService.updateLatest(this.classTree.info, data[0].objTypeId, [], null, this.selected);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02020') }));
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
			this.translateService.instant('EIM_ADMINS.CONFIRM_00037', { value: selectedData.label }),
			() => {
				this.objectService.delete(selectedData.objTypeId).subscribe(
					(data: EIMObjectDTO[]) => {
						// クラス一覧最新化
						let parentId = null
						if (selectedData.parent) {
							parentId = selectedData.parent['objTypeId'];
						}
						this.classTreeComponentService.updateLatest(this.classTree.info, parentId, [], null, this.selected);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02020') }));
						// クラス未選択状態になるため、各一覧の初期化
						this.attributeList.setData([]);
						this.formatList.setData([]);
						this.workflowDiagram.clear();
						this.workflowDiagram.setData([]);
						this.attributeList.refreshView();
						this.formatList.refreshView();
						// メニュー非活性化
						this.updateClassMenuItem.disabled = true;
						this.securityClassMenuItem.disabled = true;
						this.updateAndSecurityClassMenuItem.disabled = true;
						this.deleteClassMenuItem.disabled = true;
						this.selectAttributeMenuItem.disabled = true;
						this.updateAttributeMenuItem.disabled = true;
						this.sortAttributeMenuItem.disabled = true;
						this.inheritanceAndRelationMenuItem.disabled = true;
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
 */
	onClickAccessSecurity(): void {
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		let selectedObjId = selectedData.objTypeId;

		this.securityService.getProperty(selectedObjId).subscribe(
			(security: EIMObjectSecurityDTO) => {
				let dialogId = this.adminDialogManagerComponentService.showAccessSecurityApplicant(
					EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT, security, {
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
		let selectedDataList: EIMFolderTreeNode[] = this.classTree.getSelectedData();
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
			selectedData.rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_DOCUMENT,
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
	 * 並べ替えメニュー押下時のイベントハンドラ
	 * 属性タイプ並べ替えダイアログを表示します.
	 */
	onClickAttributeSortUpdator(): void {
		let objTypeId: number = this.classTree.getSelectedData()[0].objTypeId;
		if (this.attributeList && this.attributeList.getData() && this.attributeList.getData().length > 0) {
			// 属性タイプ並べ替え画面表示
			let dialogId: string = this.adminDialogManagerComponentService.showAttTypeSortUpdator(
				objTypeId,
				EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT,
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
	 * 引継ぎ・関連付け設定メニュー押下時のイベントハンドラ
	 * 引継ぎ・関連付け設定ダイアログを表示します.
	 */
	onClickInheritanceAndRelationAttributeUpdator(): void {
		let isObjectFlag = false;
		let allAttributeList = this.attributeList.getData();
		// データ型がオブジェクト型の属性があるか
		for (let i = 0; i < allAttributeList.length; i++) {
			if (allAttributeList[i].valTypeId === EIMAdminsConstantService.VALUE_TYPE_OBJECT) {
				isObjectFlag = true;
				break;
			}
		}
		// オブジェクト型の属性がない場合、処理しない
		if (isObjectFlag === false) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00011'));
			return;
		}
		let selectedDataList = this.classTree.getSelectedData();
		if (selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		let dialogId: string = this.adminDialogManagerComponentService.showClassAttributeTypeInheritanceAndRelationUpdator(
			selectedData.objTypeId,
			{
				updated: (data) => {
					// 引継ぎ・関連付け設定画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// 属性リスト最新化
					this.showSelectAttributeList(selectedData.objTypeId);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02070') }));
				},
				errored: (err) => {
					// 引継ぎ・関連付け設定画面をクローズ
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
						// メニューの活性制御処理
						this.setAttMenuItemEnable();
					},
					(err: any) => {
					}
				);
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
			this.translateService.instant('EIM_ADMINS.CONFIRM_00038', { value1: selectedData.data.objName, value2: this.workflowDiagram.info.diagramName }),
			() => {
				this.objectService.deleteWorkflow(this.workflowDiagram.info.component['workflow'].objId, selectedData.objTypeId).subscribe(
					(res: EIMWorkflowDomain[]) => {
						this.workflowDiagram.clear();
						this.workflowDiagram.setData([]);
						this.workflowDiagram.info.diagramName = null;
						this.deleteWorkflowMenuItem.disabled = true;
						this.workflowDiagram.show({ objTypeId: selectedData.objTypeId });
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
		// メニュー非活性化
		this.updateClassMenuItem.disabled = true;
		this.securityClassMenuItem.disabled = true;
		this.updateAndSecurityClassMenuItem.disabled = true;
		this.deleteClassMenuItem.disabled = true;
		this.selectAttributeMenuItem.disabled = true;
		this.updateAttributeMenuItem.disabled = true;
		this.sortAttributeMenuItem.disabled = true;
		this.inheritanceAndRelationMenuItem.disabled = true;
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
		// クラスツリーメニュー活性制御
		this.setClassMenuItemEnable();
		// 属性一覧取得
		this.showSelectAttributeList(selectedData.objTypeId);
		// フォーマット一覧取得
		this.showSelectFormatList(selectedData.objTypeId);
		// ワークフロー取得
		this.showSelectWorkflow(selectedData.objTypeId);
	}

	/**
	 * ワークフローノード選択ハンドラ.
	 * ステータス属性一覧を更新します.
	 */
	onSelectWorkflow(): void {
	}

	/**
	 * ダイアグラムのノード、エッジ選択時のイベントハンドラ
	 */
	onChangeDiagram(): void {
	}

	/**
	 * タブ変更のイベントハンドラです.
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		super.onChangeTab(event);

		if (this.tabIndex() === tabIndexConst.TAB_INDEX_ATTRIBUTE) {
			window.setTimeout(() => {
				// 属性タブ表示時、ドキュメントかそれ以外で属性タイプ一覧のカラムを変更する
				// オブジェクトタイプツリーの選択変更時にカラムを変更しているが属性タブが非表示中の場合変更を検知できないためか反映できない
				// （再現手順）
				//   1."一般フォルダ"オブジェクトタイプを選択し、"フォーマット"タブを選択
				//   2."一般文書"オブジェクトタイプを選択する。
				//     上記のタイミングでカラムを設定しているが、"属性"タブを選択すると属性タイプ一覧のカラムが表示されない。
				// カラムを設定しなおすことで一覧のカラムを表示できるように修正
				let columns: EIMDataGridColumn[] = this.attributeList.getColumns();
				this.attributeList.setColumns(columns);
			});
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 選択したオブジェクトの属性を取得し、表示します.
	 * @param id オブジェクトタイプID
	 */
	protected showSelectAttributeList(id: number): void {
		this.attributeList.setData([]);
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		// 選択したクラスのルートタイプがドキュメントタイプの場合、ドキュメントタイプ用カラムを表示する
		if (selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_DOCUMENT) {
			if (!this.wasSelectedDocumentType) {
				this.attributeList.setColumns(this.docTypeAttributeColumns);
			}
			this.wasSelectedDocumentType = true;
			// 選択したクラスのルートタイプがドキュメントタイプ以外の場合、通常カラムを表示する
		} else {
			if (this.wasSelectedDocumentType) {
				this.attributeList.setColumns(this.defAttributeColumns);
			}
			this.wasSelectedDocumentType = false;
		}
		// 選択したクラスのルートタイプが文書添付ファイル、一時添付ファイルの場合、取得しない
		if (selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT ||
			selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.PRIMARY_ATTACHMENT) {
			this.setAttMenuItemEnable();
			return;
		}
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
	 * 選択したオブジェクトのワークフローを取得し、表示します.
	 * @param id オブジェクトタイプID
	 */
	protected showSelectWorkflow(id: number): void {
		this.workflowDiagram.clear();
		this.workflowDiagram.setData([]);
		this.deleteWorkflowMenuItem.disabled = true;
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		// 選択したクラスのルートタイプがタグ、文書添付ファイル、一時添付ファイルの場合、取得しない
		if (selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_TAG ||
			selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT ||
			selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.PRIMARY_ATTACHMENT) {
			this.setWorkflowMenuItemEnable();
			return;
		}
		let tempId = { objTypeId: id };
		this.workflowDiagram.show(tempId);
		this.setWorkflowMenuItemEnable();
	}

	/**
	 * クラスメニューバーの活性制御処理
	 * @param setValue 設定値 true: 非活性 false: 活性
	 */
	protected setClassMenuItemEnable(): void {
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		// メニュー活性処理
		if (selectedClassTree.length === 1) {
			// 選択したオブジェクトがルートタイプの場合は、更新・削除メニュー非活性
			if (selectedClassTree[0].objTypeName === this.translateService.instant('EIM_ADMINS.DOCUMENT') ||
				selectedClassTree[0].objTypeName === this.translateService.instant('EIM_ADMINS.FOLDER') ||
				selectedClassTree[0].objTypeName === this.translateService.instant('EIM_ADMINS.TAG')
			) {
				this.createClassMenuItem.disabled = false;
				this.updateAndSecurityClassMenuItem.disabled = false;
				this.updateClassMenuItem.disabled = true;
				this.securityClassMenuItem.disabled = false;
				this.deleteClassMenuItem.disabled = true;
			} else {
				// ルートタイプが文書添付ファイル、一時添付ファイルの場合、各メニュー非活性
				if (selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT ||
					selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.PRIMARY_ATTACHMENT) {
					this.createClassMenuItem.disabled = true;
					this.updateClassMenuItem.disabled = true;
					this.updateAndSecurityClassMenuItem.disabled = true;
					this.securityClassMenuItem.disabled = true;
					this.deleteClassMenuItem.disabled = true;
				} else {
					this.createClassMenuItem.disabled = false;
					this.updateClassMenuItem.disabled = false;
					this.updateAndSecurityClassMenuItem.disabled = false;
					this.securityClassMenuItem.disabled = false;
					this.deleteClassMenuItem.disabled = false;
				}
			}
			// クラスが選択されていない場合
		} else {
			// タイプの更新・セキュリティ・削除メニュー非活性
			this.createClassMenuItem.disabled = false;
			this.updateAndSecurityClassMenuItem.disabled = true;
			this.updateClassMenuItem.disabled = true;
			this.securityClassMenuItem.disabled = true;
			this.deleteClassMenuItem.disabled = true;
		}
	}

	/**
	 * 属性一覧メニューバーの活性制御処理
	 * @param setValue 設定値 true: 非活性 false: 活性
	 */
	protected setAttMenuItemEnable(): void {
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		if (selectedClassTree.length === 1) {
			// 属性一覧のメニュー活性制御
			this.selectAttributeMenuItem.disabled = false;
			// ルートタイプがドキュメント以外の場合、並べ替え・引継ぎ関連付け設定を非活性
			if (selectedClassTree[0].rootObjTypeDefName !== EIMAdminsConstantService.OBJECT_TYPE_DOCUMENT) {
				this.sortAttributeMenuItem.disabled = true;
				this.inheritanceAndRelationMenuItem.disabled = true;
				// ルートタイプが文書添付ファイル、一時添付ファイルの場合、属性メニュー非活性、ワークフローメニュー非活性
				if (selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT ||
					selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.PRIMARY_ATTACHMENT) {
					this.selectAttributeMenuItem.disabled = true;
				}
				// ルートタイプがドキュメントの場合、並べ替え・引継ぎ関連付け設定を活性
			} else {
				let isObjectFlag = false;
				let attributeData = this.attributeList.getData();
				// 属性一覧に1件以上データがある場合
				if (attributeData.length > 0) {
					// オブジェクト型があるかチェック
					for (let i = 0; i < attributeData.length; i++) {
						if (attributeData[i].valTypeId === EIMAdminsConstantService.VALUE_TYPE_OBJECT) {
							isObjectFlag = true;
							break;
						}
					}
					// オブジェクト型がある場合は、引継ぎ・関連付け設定メニュー活性
					if (isObjectFlag) {
						this.inheritanceAndRelationMenuItem.disabled = false;
					} else {
						this.inheritanceAndRelationMenuItem.disabled = true;
					}
					// 属性一覧に2件以上データがある場合、並べ替えメニュー活性
					if (attributeData.length > 1) {
						this.sortAttributeMenuItem.disabled = false;
					} else {
						this.sortAttributeMenuItem.disabled = true;
					}
				} else {
					this.sortAttributeMenuItem.disabled = true;
					this.inheritanceAndRelationMenuItem.disabled = true;
				}
			}
			// クラスが選択されていない場合
		} else {
			// 属性の全メニュー非活性
			this.selectAttributeMenuItem.disabled = true;
			this.sortAttributeMenuItem.disabled = true;
			this.inheritanceAndRelationMenuItem.disabled = true;
		}
		// 属性更新メニュー活性制御
		this.updateAttributeMenuItem.disabled = (this.sortAttributeMenuItem.disabled && this.inheritanceAndRelationMenuItem.disabled);

		let attrList: EIMAttributeTypeDTO[] = this.attributeList.getSelectedData();
		if (attrList.length > 0) {
			// 属性削除メニュー活性にする：必須属性が1件以上含まれている場合非活性とする
			let deleteDisabled = false;
			for (let i = 0; i < attrList.length; i++) {
				if (attrList[i].attTypeEssential) {
					deleteDisabled = true;
					break;
				}
			}
			this.deleteAttributeMenuItem.disabled = deleteDisabled;
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
		if (selectedClassTree.length === 1) {
			// ルートタイプがタグ、フォルダの場合、フォーマット選択メニュー非活性
			if (selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_TAG ||
				selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_FOLDER) {
				// フォーマット一覧のメニュー活性制御
				this.selectFormatMenuItem.disabled = true;
				this.defaultFormatMenuItem.disabled = true;
				this.deleteFormatMenuItem.disabled = true;
			} else {
				// フォーマット一覧のメニュー活性制御
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
		} else {
			// フォーマットメニュー全非活性
			this.selectFormatMenuItem.disabled = true;
			this.defaultFormatMenuItem.disabled = true;
			this.deleteFormatMenuItem.disabled = true;
		}
	}

	/**
	 * ワークフローメニューバーの活性制御処理
	 */
	protected setWorkflowMenuItemEnable(): void {
		let selectedClassTree: EIMFolderTreeNode[] = this.classTree.getSelectedData();
		// クラス1件選択中の場合
		if (selectedClassTree.length === 1) {
			// ルートタイプがタグ、文書添付ファイル、一時添付ファイルの場合、ワークフローメニュー非活性
			if (selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_TAG ||
				selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT ||
				selectedClassTree[0].rootObjTypeDefName === EIMAdminsConstantService.PRIMARY_ATTACHMENT) {
				this.selectWorkflowMenuItem.disabled = true;
			} else {
				this.selectWorkflowMenuItem.disabled = false;
			}
			// クラス1件選択中でない場合、ワークフローメニュー非活性
		} else {
			this.selectWorkflowMenuItem.disabled = true;
			this.deleteWorkflowMenuItem.disabled = true;
			return;
		}
		// ワークフロー名称が存在する場合は削除ボタンを活性化
		if (this.workflowDiagram.info.diagramName && this.workflowDiagram.info.diagramName.length > 0) {
			this.deleteWorkflowMenuItem.disabled = false;
		} else {
			this.deleteWorkflowMenuItem.disabled = true;
		}
	}
}
