import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMWorkspace, EIMWorkspaceProperty, EIMSelectableObjectType, EIMSelectableSecurity } from './../../shared/services/apis/workspace.service';
import { EIMSecurityNameRendererComponent } from './../../shared/components/renderer/security-name-renderer.component';
import { EIMSecuritySelectorComponent } from './../security-selector/security-selector.component';

import { Component, forwardRef, EventEmitter, Input, Output, ViewChild, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable, EIMMenuItem, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';

import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';

import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMProcessingResultRendererComponent } from 'app/documents/shared/components/renderer/processing-result-renderer.component';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMMasterContentsApproveWorkflowDiagramComponent } from 'app/documents/components/master-contents-approve-workflow-diagram/master-contents-approve-workflow-diagram.component';
import { EIMSecurity } from 'app/documents/shared/services/apis/security.service';
import { EIMObjectTypeAttributeComponent } from 'app/documents/components/workspace-creator/object-type-attribute.component';
import { EIMWorkspaceService } from 'app/documents/shared/services/apis/workspace.service';
import { EIMWorkSpaceAdministratorItemComponent } from 'app/documents/components/workspace-creator/workspace-administrator-item.component';
import { EIMEntryDTO } from 'app/shared/dtos/entry.dto';
import { EIMWorkspaceCreatorComponentService, EIMWorkspaceCreatorComponentInfo } from 'app/documents/components/workspace-creator/workspace-creator.component.service';
import { BlockUI } from 'primeng/blockui';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * ワークスペース登録コンポーネント
 * @example
 *
 *      <eim-workspace-creator
 *         [objId]="objId">
 *      </eim-workspace-creator>
 */
@Component({
    selector: 'eim-workspace-creator',
    templateUrl: './workspace-creator.component.html',
    styleUrls: ['./workspace-creator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceCreatorComponent) }],
    standalone: false
})
export class EIMWorkspaceCreatorComponent implements OnInit, EIMCreatable, EIMUpdatable {

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	/** ワークスペース登録コンポーネント情報 */
	public info: EIMWorkspaceCreatorComponentInfo = {
		name : '',
		accessSecurity: {},
		folderSecurity: {},
		adminUsers: [],
		docTypeCondition: this.FLAG_FALSE,
		selectedDocumentType: [],
		folderTypeCondition: this.FLAG_FALSE,
		selectedFolderType: [],
		tagTypeCondition: this.FLAG_FALSE,
		selectedTagType: [],
		securityCondition: this.FLAG_FALSE,
		isUpdateSecurity: this.FLAG_FALSE,
		isManualDeleteFlag: false,
		isWorkspaceSystemAuth: true
	};

	/** フォーム */
	@ViewChild('workspaceForm', { static: true }) workspaceForm: NgForm;

	/** 管理者入力項目 */
	@ViewChild('administratorList', { static: true }) administratorList: EIMWorkSpaceAdministratorItemComponent

	/** 編集対象ワークスペースのobjId */
	@Input() objId: number;

	/** 登録完了時のイベントエミッタ */
	@Output() created: EventEmitter<any> = new EventEmitter<any>();

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 実行中かどうか */
	public creating = false;

	/** 選択中タブ */
	public selectedTab = signal(0);

	/** スプリットエリア上部サイズ(%) */
	public splitAreaFirstSize = 31;

	/** 作成ボタン表示可否 */
	public visibleCreate = false;

	/** 更新ボタン表示可否 */
	public visibleUpdate = false;

	/** 情報表示のみフラグ */
	@Input() readOnly = false;

	/** ドキュメントタイプ一覧のメニュー */
	public documentTypeMenuItems: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM.LABEL_03006'), name: 'select', icon: 'fa fa-check', disabled: true, command: (event) => {this.onClickSelectDocumentType(event); }},
		{label: this.translateService.instant('EIM.LABEL_03003'), name: 'delete', icon: 'fa fa-trash-o', disabled: true, command: (event) => {this.onClickDeleteDocumentType(event); }},
	];
	/** フォルダタイプ一覧のメニュー */
	public folderTypeMenuItems: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM.LABEL_03006'), name: 'select', icon: 'fa fa-check', disabled: true, command: (event) => {this.onClickSelectFolderType(event); }},
		{label: this.translateService.instant('EIM.LABEL_03003'), name: 'delete', icon: 'fa fa-trash-o', disabled: true, command: (event) => {this.onClickDeleteFolderType(event); }},
	];

	/** タグタイプ一覧のメニュー */
	public tagTypeMenuItems: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM.LABEL_03006'), name: 'select', icon: 'fa fa-check', disabled: true, command: (event) => {this.onClickSelectTagType(event); }},
		{label: this.translateService.instant('EIM.LABEL_03003'), name: 'delete', icon: 'fa fa-trash-o', disabled: true, command: (event) => {this.onClickDeleteTagType(event); }},
	];

	/** セキュリティ一覧のメニュー */
	public securityMenuItems: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM.LABEL_03006'), name: 'select', icon: 'fa fa-check', disabled: true, command: (event) => {this.onClickSelectSecurity(event); }},
		{label: this.translateService.instant('EIM.LABEL_03003'), name: 'delete', icon: 'fa fa-trash-o', disabled: true, command: (event) => {this.onClickDeleteSecurity(event); }},
	];

	/** ツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM.LABEL_03027'), name: '', icon: 'fa fa-fw fa-expand', command: (event) => { this.expandAll(); }},
		{label: this.translateService.instant('EIM.LABEL_03028'), name: '', icon: 'fa fa-fw fa-compress', command: (event) => { this.collapseAll(); }},
	];

	/** ドキュメントタイプワークフローダイアグラム */
	@ViewChild('documentTypeWorkflowDiagram', { static: true }) documentTypeWorkflowDiagram: EIMMasterContentsApproveWorkflowDiagramComponent;

	/** ドキュメントタイプ属性一覧 */
	@ViewChild('docTypeAttributeList', { static: true }) docTypeAttributeList: EIMObjectTypeAttributeComponent;

	/** ドキュメントツリーコンポーネント */
	@ViewChild('documentTypeTree', { static: true }) documentTypeTree: EIMTreeComponent;

	/** フォルダタイプワークフローダイアグラム */
	@ViewChild('folderTypeWorkflowDiagram', { static: true }) folderTypeWorkflowDiagram: EIMMasterContentsApproveWorkflowDiagramComponent;

	/** フォルダタイプ属性一覧 */
	@ViewChild('folderTypeAttributeList', { static: true }) folderTypeAttributeList: EIMObjectTypeAttributeComponent;

		/** フォルダツリーコンポーネント */
	@ViewChild('folderTypeTree', { static: true }) folderTypeTree: EIMTreeComponent;

	/** タグタイプ属性一覧 */
	@ViewChild('tagTypeAttributeList', { static: true }) tagTypeAttributeList: EIMObjectTypeAttributeComponent;

	/** タグツリーコンポーネント */
	@ViewChild('tagTypeTree', { static: true }) tagTypeTree: EIMTreeComponent;

	/** アクセスエントリー */
	@ViewChild('accessEntry', { static: true }) accessEntry: EIMSecuritySelectorComponent;

	/** セキュリティデータグリッドコンポーネント */
	@ViewChild('securityList', { static: true }) securityList: EIMDataGridComponent;

	/** BlockUIドキュメントタイプ */
	@ViewChild('docPnlBlock', {static: true}) docPnlBlock: BlockUI;

	/** BlockUIドキュメントタイプ属性ワークフロー */
	@ViewChild('docPnlBlock2', {static: true}) docPnlBlock2: BlockUI;

	/** BlockUIフォルダタイプ */
	@ViewChild('folderPnlBlock', {static: true}) folderPnlBlock: BlockUI;

	/** BlockUIフォルダタイプ属性ワークフロー */
	@ViewChild('folderPnlBlock2', {static: true}) folderPnlBlock2: BlockUI;

	/** BlockUIタグタイプ */
	@ViewChild('tagPnlBlock', {static: true}) tagPnlBlock: BlockUI;

	/** BlockUIタグタイプ属性 */
	@ViewChild('tagPnlBlock2', {static: true}) tagPnlBlock2: BlockUI;

	/** BlockUIセキュリティ */
	@ViewChild('secPnlBlock', {static: true}) secPnlBlock: BlockUI;

	/** ドキュメント管理で管理しているセキュリティかどうか */
	public isDocumentAccessSecurity = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected objectTypeService: EIMObjectTypeService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected workspaceService: EIMWorkspaceService,
		protected workspaceCreatorComponentService: EIMWorkspaceCreatorComponentService,
		protected serverConfigService: EIMServerConfigService
	) {
		this.info.name = '';
		this.info.accessSecurity = {};
		this.info.folderSecurity = {};
		this.info.adminUsers = [];
		this.info.docTypeCondition = this.FLAG_FALSE;
		this.info.selectedDocumentType = [];
		this.info.folderTypeCondition = this.FLAG_FALSE;
		this.info.selectedFolderType = [];
		this.info.tagTypeCondition = this.FLAG_FALSE;
		this.info.selectedTagType = [];
		this.info.securityCondition = this.FLAG_FALSE;
		this.info.isUpdateSecurity = this.FLAG_FALSE;
		this.info.isManualDeleteFlag = false;
		this.info.isWorkspaceSystemAuth = true;

		window.setTimeout(() => {
			this.docPnlBlock.blocked = this.docPnlBlock.blocked;
			this.docPnlBlock2.blocked = this.docPnlBlock2.blocked;
			this.folderPnlBlock.blocked = this.folderPnlBlock.blocked;
			this.folderPnlBlock2.blocked = this.folderPnlBlock2.blocked;
			this.tagPnlBlock.blocked = this.tagPnlBlock.blocked;
			this.tagPnlBlock2.blocked = this.tagPnlBlock2.blocked;
			this.secPnlBlock.blocked = this.secPnlBlock.blocked;
		});
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ワークスペースを新規登録します.
	 */
	public create(): void {

		// 入力値のチェック
		if (this.isIllegalWorkspaceName()) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00009'));
			return;
		}

		this.creating = true;
		let workspace = this.workspaceCreatorComponentService.getWorkspaceObject(this.info);
		this.workspaceService.create(workspace)
			.subscribe(
					(res: any) => {
						// 完了
						this.created.emit([{objId: res.objId, isDocument: false}]);
					},
					(err: any) => {
						this.creating = false
					});
	}

	/**
	 * 対象ワークスペースを更新します.
	 */
	public update(): void {

		// 入力値のチェック
		if (this.isIllegalWorkspaceName()) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00009'));
			return;
		}

		this.creating = true;
		let workspace = this.workspaceCreatorComponentService.getWorkspaceObject(this.info);
		if (!workspace.lowerSuccessionSecId) {
			workspace.lowerSuccessionSecId = -1;
			workspace.checkedLowerSuccession = this.FLAG_FALSE;
		}
		workspace.objId = this.objId;
		this.workspaceService.update(workspace)
			.subscribe(
					(res: any) => {
						// 完了
						this.updated.emit([{objId: res.objId, isDocument: false}]);
					},
					(err: any) => {
						this.creating = false
					});
	}

	/**
	 * 登録可否を返却します.
	 * @return フォルダ登録可否
	 */
	public creatable(): boolean {
		return this.info.name.length > 0 && !this.creating && this.info.accessSecurity.secName != null && !this.isIllegalLimitationType();
	}

	/**
	 * 更新可否を返却します.
	 * @return フォルダ更新可否
	 */
	public updatable(): boolean {
		return this.info.name.length > 0 && !this.creating && !this.isIllegalLimitationType() && (this.workspaceForm.dirty || this.administratorList.dirty);
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		if (this.workspaceForm.dirty || this.administratorList.dirty) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						close.emit();
					}
			);

		} else {
			close.emit();
		}
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.info.docTypeAttributeList = this.docTypeAttributeList;
		this.info.documentTypeTree = this.documentTypeTree;
		this.info.documentTypeWorkflowDiagram = this.documentTypeWorkflowDiagram;
		this.info.folderTypeWorkflowDiagram = this.folderTypeWorkflowDiagram;
		this.info.folderTypeAttributeList = this.folderTypeAttributeList;
		this.info.folderTypeTree = this.folderTypeTree;
		this.info.tagTypeAttributeList = this.tagTypeAttributeList;
		this.info.tagTypeTree = this.tagTypeTree;
		this.info.accessEntry = this.accessEntry;
		this.info.securityList = this.securityList;

		// ワークスペース編集の場合、初期表示情報の問い合わせを行う.
		// ワークスペース情報表示
		if (this.objId !== null) {
			this.visibleUpdate = true;
			this.creating = true;
			let wsId = this.objId;
			this.workspaceService.dspProperty(Number(this.objId), !this.readOnly)
			.subscribe((data: EIMWorkspaceProperty) => {
				if (!this.readOnly || wsId === this.objId) {
					this.info.name = data.objName;
					this.info.accessSecurity.secId = data.secId;
					this.info.accessSecurity.secName = data.secName;
					this.info.accessSecurity.secDefName = data.secDefName;
					this.info.isManualDeleteFlag = data.isManualDeleteFlag;
					this.info.isWorkspaceSystemAuth = data.isWorkspaceSystemAuth;
					if (data.checkedThisLowerSuccession) {
						this.info.folderSecurity.secId = data.lowerSuccessionSecId;
						this.info.folderSecurity.secName = data.lowerSuccessionSecName;
					}

					this.creating = false;
					}

					// ドキュメント管理外のセキュリティかどうかチェック
					if (data.secDefName !== null) {

						let isDocumentAccessSecurity = true;
						for (const nameSpaceToExclude of this.serverConfigService.nameSpacesToExclude) {

							if (data.secDefName.indexOf(nameSpaceToExclude) === 0) {

								isDocumentAccessSecurity = false;
								break;
							}
						}
						this.isDocumentAccessSecurity = isDocumentAccessSecurity;
					}
					else {
						this.isDocumentAccessSecurity = true;
					}

				},
				(err: any) => {
					// エラーの場合、画面を閉じる
					window.setTimeout(() => {
						this.errored.emit();
					});
			});
			// ワークスペース管理者情報表示
			this.workspaceService.getAdminEntryList(Number(this.objId), !this.readOnly)
			.subscribe(
				(data: EIMEntryDTO[]) => {
					if (!this.readOnly || wsId === this.objId) {
						this.administratorList.setData(data);
					}
				},
				(err: any) => {
					// エラーの場合、画面を閉じる
					window.setTimeout(() => {
						this.errored.emit();
					});
				});

			// 使用可能制限タイプ取得
			this.workspaceService.dspSelectableObjectTypeTree(Number(this.objId), !this.readOnly)
			.subscribe(
				(data: EIMSelectableObjectType) => {
					if (!this.readOnly || wsId === this.objId) {
						this.splitType(data.documentTypeList.objType, this.info.selectedDocumentType);
						this.workspaceCreatorComponentService.setTreeData(this.info, this.info.selectedDocumentType, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT);
						if (!data.documentTypeList.isAllDocType) {
							this.info.docTypeCondition = this.FLAG_TRUE;
							this.getMenuItem(this.documentTypeMenuItems, 'select').disabled = false;
						}
						this.splitType(data.folderTypeList.objType, this.info.selectedFolderType);
						this.workspaceCreatorComponentService.setTreeData(this.info, this.info.selectedFolderType, EIMDocumentsConstantService.OBJECT_TYPE_FOLDER);
						if (!data.folderTypeList.isAllFolderType) {
							this.info.folderTypeCondition = this.FLAG_TRUE;
							this.getMenuItem(this.folderTypeMenuItems, 'select').disabled = false;
						}
						this.splitType(data.tagTypeList.objType, this.info.selectedTagType);
						this.workspaceCreatorComponentService.setTreeData(this.info, this.info.selectedTagType, EIMDocumentsConstantService.OBJECT_TYPE_TAG);
						if (!data.tagTypeList.isAllTagType) {
							this.info.tagTypeCondition = this.FLAG_TRUE;
							this.getMenuItem(this.tagTypeMenuItems, 'select').disabled = false;
						}
						this.info.documentTypeWorkflowDiagram.disableButtons = this.info.docTypeCondition !== this.FLAG_TRUE;
						this.info.folderTypeWorkflowDiagram.disableButtons = this.info.folderTypeCondition !== this.FLAG_TRUE;
					}
				},
				(err: any) => {
					// エラーの場合、画面を閉じる
					window.setTimeout(() => {
						this.errored.emit();
					});
			});

			// 使用可能制限セキュリティ取得
			this.workspaceService.dspSelectableSecurity(Number(this.objId), !this.readOnly)
			.subscribe(
				(data: EIMSelectableSecurity) => {
					if (!this.readOnly || wsId === this.objId) {
						this.info.securityList.setData(data.security);
						if (!data.isAllSec) {
							this.info.securityCondition = this.FLAG_TRUE;
							this.getMenuItem(this.securityMenuItems, 'select').disabled = false;
						}
					}
				},
				(err: any) => {
					// エラーの場合、画面を閉じる
					window.setTimeout(() => {
						this.errored.emit();
					});
			});
		}
		// ワークスペース登録時
		else {
			this.visibleCreate = true;
			this.info.documentTypeWorkflowDiagram.disableButtons = true;
			this.info.folderTypeWorkflowDiagram.disableButtons = true;
			this.isDocumentAccessSecurity = true;
		}

		let columns: EIMDataGridColumn[] = [];
		columns.push({ field: 'secName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 210,
			cellRendererFramework: EIMSecurityNameRendererComponent, suppressFilter: true, suppressSorting: true });
		this.info.securityList.setColumns(columns);
	}

	/**
	 * ビュー初期化後のイベントハンドラです.
	 */
	ngAfterViewInit(): void {
		// システム管理から参照されている時、エレメントの高さからスプリット位置の計算処理を行う
		if (this.readOnly) {
			this.splitAreaFirstSize = 130 * 100 / (window.document.getElementById('workspaceCreator').clientHeight);
		}
	}

	/**
	 * ワークスペース管理画面(システム管理)用のリフレッシュ処理
	 */
	public refresh(): void {
		// すべてのデータをクリアする
		this.info.name = '';
		this.info.accessSecurity = {};
		this.info.folderSecurity = {};
		this.info.adminUsers = [];
		this.info.docTypeCondition = this.FLAG_FALSE;
		this.info.selectedDocumentType = [];
		this.info.folderTypeCondition = this.FLAG_FALSE;
		this.info.selectedFolderType = [];
		this.info.tagTypeCondition = this.FLAG_FALSE;
		this.info.selectedTagType = [];
		this.info.securityCondition = this.FLAG_FALSE;
		this.info.isUpdateSecurity = this.FLAG_FALSE;
		this.info.isManualDeleteFlag = false;
		this.info.isWorkspaceSystemAuth = true;
		this.info.documentTypeWorkflowDiagram.clear();
		this.info.docTypeAttributeList.clear();
		this.info.folderTypeWorkflowDiagram.clear();
		this.info.folderTypeAttributeList.clear();
		this.info.tagTypeAttributeList.clear();
		this.info.securityList.setData([]);
		this.info.accessEntry.clearAccessEntryAndAccessRole();
		this.info.documentTypeTree.setData([]);
		this.info.folderTypeTree.setData([]);
		this.info.tagTypeTree.setData([]);
		// 初期処理
		this.ngOnInit();
		this.ngAfterViewInit();
	}


	/**
	 * 全展開イベントハンドラ.
	 * ツリーノードを全て展開する
	 */
	public expandAll(): void {
		this.workspaceCreatorComponentService.expandAll(this.info, this.selectedTab());
	}

	/**
	 * 全縮小イベントハンドラ.
	 * ツリーノードを全て折り畳む
	 */
	public collapseAll(): void {
		this.workspaceCreatorComponentService.collapseAll(this.info, this.selectedTab());
	}

	/**
	 * アクセスセキュリティ選択ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickAccessSecurity(event: any): void {
		let contents: any = {objId: this.objId};
		let dialogId = this.dialogManagerComponentService.showAccessSecurityApplicable(contents, this.info.accessSecurity, {
			applied: (security: EIMSecurity[]) => {
				this.dialogManagerComponentService.close(dialogId);
				this.info.accessSecurity = security[0];
				this.info.isUpdateSecurity = this.FLAG_TRUE;
				this.workspaceForm.control.markAsDirty();
			}
		});
	}
	
	/**
	 * アクセスセキュリティ編集ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	 onClickAccessSecurityEdit(event: any): void {
		this.dialogManagerComponentService.showAccessSecurityEdit(null, this.info.accessSecurity, null, this.isDocumentAccessSecurity);
	}
	
	/**
	 * フォルダセキュリティ編集ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	 onClickFolderSecurityEdit(event: any): void {
		this.dialogManagerComponentService.showAccessSecurityEdit(null, this.info.folderSecurity, null);
	}
	/**
	 * フォルダ構成管理セキュリティ選択ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickFolderSecurity(event: any): void {
		let contents: any = {objId: this.objId};
		let dialogId = this.dialogManagerComponentService.showFolderConfigurationSecurityApplicable(contents, this.info.folderSecurity, {
			applied: (security: EIMSecurity[]) => {
				this.dialogManagerComponentService.close(dialogId);
				this.info.folderSecurity = security[0];
				this.info.isUpdateSecurity = this.FLAG_TRUE;
				this.workspaceForm.control.markAsDirty();
			}
		});
	}

	/**
	 * ドキュメントタイプ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickSelectDocumentType(event: any): void {
		// ドキュメントタイプツリーを表示する
		let dialogId = this.dialogManagerComponentService.showObjectTypeMultipleSelector(null,
				EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT, this.info.selectedDocumentType,
				{
					selected: (hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
						this.info.selectedDocumentType = hierarchicalContentsType;
						this.dialogManagerComponentService.close(dialogId);
						this.workspaceCreatorComponentService.setTreeData(this.info, hierarchicalContentsType, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT);
						this.info.documentTypeWorkflowDiagram.clear();
						this.info.docTypeAttributeList.clear();
						this.workspaceForm.control.markAsDirty();
					},
					errored: (err: any) => {
						this.dialogManagerComponentService.close(dialogId);
					}
				});
	}

	/**
	 * ドキュメントタイプ削除ボタンクリックイベントハンドラです.
	 * @param event イベント
	 */
	onClickDeleteDocumentType(event: any): void {
		this.deleteType(this.info.selectedDocumentType, this.info.documentTypeTree.info.selectedData[0].data.id, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT);
		if (!this.workspaceCreatorComponentService.checkExistSelected(this.info.documentTypeTree.info.data[0].data)) {
			this.info.documentTypeTree.info.data = [];
		}
		this.info.documentTypeWorkflowDiagram.show([]);
		this.info.docTypeAttributeList.clear();
		this.getMenuItem(this.documentTypeMenuItems, 'delete').disabled = true;
	}

	/**
	 * ドキュメントタイプ制限変更イベントハンドラ.
	 */
	public onChangeDocTypeCond(): void {
		let selectedNodes: EIMTreeNode[] = this.documentTypeTree.getSelectedData();
		this.getMenuItem(this.documentTypeMenuItems, 'select').disabled = this.info.docTypeCondition !== this.FLAG_TRUE;
		this.getMenuItem(this.documentTypeMenuItems, 'delete').disabled = this.info.docTypeCondition !== this.FLAG_TRUE
			|| selectedNodes.length === 0 || !selectedNodes[0].data.selected;
		this.info.documentTypeWorkflowDiagram.disableButtons = this.info.docTypeCondition !== this.FLAG_TRUE;
	}

	/**
	 * ノード選択イベントハンドラ.
	 * @param event ツリーノード選択データ
	 */
	public onSelectDocumentTreeNode(event: any): void {
		this.info.documentTypeWorkflowDiagram.clear();
		let selectedDocumentTypeTreeNode: EIMTreeNode = event.selectedData[0];
		// 削除ボタン押下可否制御
		this.getMenuItem(this.documentTypeMenuItems, 'delete').disabled = !(selectedDocumentTypeTreeNode.data.selected);

		let param: any = {objTypeId: selectedDocumentTypeTreeNode.data.id}
		this.info.documentTypeWorkflowDiagram.show(param);
		this.info.docTypeAttributeList.show(selectedDocumentTypeTreeNode.data.id);
		if (!selectedDocumentTypeTreeNode.expanded) {
			selectedDocumentTypeTreeNode.expanded = true;
		}
	}

	/**
	 * フォルダタイプ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickSelectFolderType(event: any): void {
		// フォルダタイプツリーを表示する
		let dialogId = this.dialogManagerComponentService.showObjectTypeMultipleSelector(null,
				EIMDocumentsConstantService.OBJECT_TYPE_FOLDER, this.info.selectedFolderType,
				{
					selected: (hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
						this.info.selectedFolderType = hierarchicalContentsType;
						this.dialogManagerComponentService.close(dialogId);
						this.workspaceCreatorComponentService.setTreeData(this.info, hierarchicalContentsType, EIMDocumentsConstantService.OBJECT_TYPE_FOLDER);
						this.info.folderTypeWorkflowDiagram.clear();
						this.info.folderTypeAttributeList.clear();
						this.workspaceForm.control.markAsDirty();
					},
					errored: (err: any) => {
						this.dialogManagerComponentService.close(dialogId);
					}
				});
	}

	/**
	 * フォルダタイプ削除ボタンクリックイベントハンドラです.
	 * @param event イベント
	 */
	onClickDeleteFolderType(event: any): void {
		this.deleteType(this.info.selectedFolderType, this.info.folderTypeTree.info.selectedData[0].data.id, EIMDocumentsConstantService.OBJECT_TYPE_FOLDER);
		if (!this.workspaceCreatorComponentService.checkExistSelected(this.info.folderTypeTree.info.data[0].data)) {
			this.info.folderTypeTree.info.data = [];
		}
		this.info.folderTypeWorkflowDiagram.show([]);
		this.info.folderTypeAttributeList.clear();
		this.getMenuItem(this.folderTypeMenuItems, 'delete').disabled = true;
	}

	/**
	 * フォルダタイプ制限変更イベントハンドラ.
	 */
	public onChangeFolderTypeCond(): void {
		let selectedNodes: EIMTreeNode[] = this.folderTypeTree.getSelectedData()
		this.getMenuItem(this.folderTypeMenuItems, 'select').disabled = this.info.folderTypeCondition !== this.FLAG_TRUE;
		this.getMenuItem(this.folderTypeMenuItems, 'delete').disabled = this.info.folderTypeCondition !== this.FLAG_TRUE
			|| selectedNodes.length === 0 || !selectedNodes[0].data.selected;
			this.info.folderTypeWorkflowDiagram.disableButtons = this.info.folderTypeCondition !== this.FLAG_TRUE;
	}

	/**
	 * ノード選択イベントハンドラ.
	 * @param event ツリーノード選択データ
	 */
	public onSelectFolderTreeNode(event: any): void {
		this.info.folderTypeWorkflowDiagram.clear();
		let selectedFolderTypeTreeNode: EIMTreeNode = event.selectedData[0];
		// 削除ボタン押下可否制御
		this.getMenuItem(this.folderTypeMenuItems, 'delete').disabled = !selectedFolderTypeTreeNode.data.selected;
		// 仮にobjIdとworkspaceIdを定義する
		let param: any = {objTypeId: selectedFolderTypeTreeNode.data.id}
		this.info.folderTypeWorkflowDiagram.show(param);
		this.info.folderTypeAttributeList.show(selectedFolderTypeTreeNode.data.id);
		if (!selectedFolderTypeTreeNode.expanded) {
			selectedFolderTypeTreeNode.expanded = true;
		}
	}

	/**
	 * タグタイプ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickSelectTagType(event: any): void {
		// タグタイプツリーを表示する
		let dialogId = this.dialogManagerComponentService.showObjectTypeMultipleSelector(null,
				EIMDocumentsConstantService.OBJECT_TYPE_TAG, this.info.selectedTagType,
				{
					selected: (hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
						this.info.selectedTagType = hierarchicalContentsType;
						this.dialogManagerComponentService.close(dialogId);
						this.workspaceCreatorComponentService.setTreeData(this.info, hierarchicalContentsType, EIMDocumentsConstantService.OBJECT_TYPE_TAG);
						this.info.tagTypeAttributeList.clear();
						this.workspaceForm.control.markAsDirty();
					},
					errored: (err: any) => {
						this.dialogManagerComponentService.close(dialogId);
					}
				});
	}

	/**
	 * タグタイプ削除ボタンクリックイベントハンドラです.
	 * @param event イベント
	 */
	onClickDeleteTagType(event: any): void {
		this.deleteType(this.info.selectedTagType, this.info.tagTypeTree.info.selectedData[0].data.id, EIMDocumentsConstantService.OBJECT_TYPE_TAG);
		if (!this.workspaceCreatorComponentService.checkExistSelected(this.info.tagTypeTree.info.data[0].data)) {
			this.info.tagTypeTree.info.data = [];
		}
		this.info.tagTypeAttributeList.clear();
		this.getMenuItem(this.tagTypeMenuItems, 'delete').disabled = true;
	}

	/**
	 * タグタイプ制限変更イベントハンドラ.
	 */
	public onChangeTagTypeCond(): void {
		let selectedNodes: EIMTreeNode[] = this.tagTypeTree.getSelectedData();
		this.getMenuItem(this.tagTypeMenuItems, 'select').disabled = this.info.tagTypeCondition !== this.FLAG_TRUE;
		this.getMenuItem(this.tagTypeMenuItems, 'delete').disabled = this.info.tagTypeCondition !== this.FLAG_TRUE
			|| selectedNodes.length === 0 || !selectedNodes[0].data.selected;
	}

	/**
	 * ノード選択イベントハンドラ.
	 * @param event ツリーノード選択データ
	 */
	public onSelectTagTreeNode(event: any): void {
		let selectedTagTypeTreeNode: EIMTreeNode = event.selectedData[0];
		// 削除ボタン押下可否制御
		this.getMenuItem(this.tagTypeMenuItems, 'delete').disabled = !selectedTagTypeTreeNode.data.selected;
		// 仮にobjIdとworkspaceIdを定義する
		let param: any = {objTypeId: selectedTagTypeTreeNode.data.id}
		this.info.tagTypeAttributeList.show(selectedTagTypeTreeNode.data.id);
		if (!selectedTagTypeTreeNode.expanded) {
			selectedTagTypeTreeNode.expanded = true;
		}
	}


	/**
	 * セキュリティ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickSelectSecurity(event: any): void {
		this.workspaceService.getAllSecurityList(true, '')
		.subscribe((res: EIMSecurity[]) => {
			let dialogId = this.dialogManagerComponentService.showSelectableSecuritySelector(this.info.securityList.getData(), res,
			{
				selected: (data: EIMSecurity[]) => {
					this.dialogManagerComponentService.close(dialogId);
					this.info.securityList.setData(data);
					this.info.accessEntry.clearAccessEntryAndAccessRole();
					this.workspaceForm.control.markAsDirty();
				}
			});
		});
	}

	/**
	 * セキュリティ削除ボタンクリックイベントハンドラです.
	 * @param event イベント
	 */
	onClickDeleteSecurity(event: any): void {
		this.info.securityList.removeRowData(this.info.securityList.getSelectedData());
		this.info.accessEntry.clearAccessEntryAndAccessRole();
		this.workspaceForm.control.markAsDirty();
	}

	/**
	 * セキュリティ制限変更イベントハンドラ.
	 */
	public onChangeSecurityCond(): void {
		this.getMenuItem(this.securityMenuItems, 'select').disabled = this.info.securityCondition !== this.FLAG_TRUE;
		this.getMenuItem(this.securityMenuItems, 'delete').disabled = this.info.securityCondition !== this.FLAG_TRUE
			|| this.info.securityList.getSelectedData().length === 0;
	}

	/**
	 * セキュリティノード選択イベントハンドラ.
	 * @param event ツリーノード選択データ
	 */
	public onSelectSecurity(event: any): void {
		if (this.info.securityList.getSelectedData().length === 0) {
			this.getMenuItem(this.securityMenuItems, 'delete').disabled = true;
			this.info.accessEntry.clearAccessEntryAndAccessRole();
			return;
		}
		// 削除ボタン押下可否制御
		this.getMenuItem(this.securityMenuItems, 'delete').disabled = false;
		this.info.accessEntry.showBySecurityId(this.info.securityList.getSelectedData()[0].secId);
	}

	/**
	 * 各タイプタブ選択イベントハンドラ
	 * @param event イベント
	 */
	public onChangeTab(event: any): void {
		this.selectedTab.set(event);

		// タブコンテンツの初期化を遅延実行（DOMレンダリング完了を待つ）
		setTimeout(() => {
			this.initializeTabContent(event);
		}, 100);
	}

	/**
	 * タブコンテンツを初期化します.
	 * @param tabIndex タブインデックス
	 */
	private initializeTabContent(tabIndex: number): void {
		switch(tabIndex) {
			case 0: // ドキュメントタブ
				if (this.documentTypeWorkflowDiagram && this.documentTypeTree && this.documentTypeTree.info.selectedData && this.documentTypeTree.info.selectedData.length > 0) {
					const selectedNode = this.documentTypeTree.info.selectedData[0];
					if (selectedNode && selectedNode.data) {
						const param = {
							objTypeId: selectedNode.data.id,
							workspaceId: this.objId
						};
						this.documentTypeWorkflowDiagram.show(param);
					}
				}
				break;

			case 1: // フォルダタブ
				if (this.folderTypeWorkflowDiagram && this.folderTypeTree && this.folderTypeTree.info.selectedData && this.folderTypeTree.info.selectedData.length > 0) {
					const selectedNode = this.folderTypeTree.info.selectedData[0];
					if (selectedNode && selectedNode.data) {
						const param = {
							objTypeId: selectedNode.data.id,
							workspaceId: this.objId
						};
						this.folderTypeWorkflowDiagram.show(param);
					}
				}
				break;

			case 2: // タグタブ
				// タグタブにはCytoscapeを使用していない
				break;

			case 3: // セキュリティタブ
				// セキュリティタブにはCytoscapeを使用していない
				break;
		}
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 選択されたオブジェクトタイプを削除します.
	 * @param selectedDomainList 選択済みオブジェクトタイプ一覧
	 * @param deleteId 削除対象オブジェクトタイプID
	 * @param typeName オブジェクトタイプ種別
	 */
	private deleteType(selectedDomainList: EIMHierarchicalObjectTypeDomain[], deleteId: number, typeName: string): void {
		for (let i = 0; i < selectedDomainList.length; i++) {
			if (selectedDomainList[i].id === deleteId) {
				selectedDomainList.splice(i, 1);
			}
		}
		this.workspaceCreatorComponentService.setTreeData(this.info, selectedDomainList, typeName);
		this.workspaceForm.control.markAsDirty();
	}

	/**
	 * 親ノードから選択されたオブジェクトタイプを分割します.
	 * @param parentNode オブジェクトタイプ親ノード
	 * @param selectedDomainList 選択済みオブジェクトタイプ一覧
	 */
	private splitType(parentNode: EIMHierarchicalObjectTypeDomain[], selectedDomainList: EIMHierarchicalObjectTypeDomain[]): void {
		for (let i = 0; i < parentNode.length; i++) {
			if (parentNode[i].selected) {
				selectedDomainList.push(parentNode[i]);
			}
			this.splitType(parentNode[i].children, selectedDomainList);
		}
	}

	/**
	 * ワークスペース名に禁則文字が含まれているかどうかを返却します.
	 * @return 禁則文字が含まれている場合trueを返却
	 */
	private isIllegalWorkspaceName(): boolean {
		let match = this.info.name.match(EIMConstantService.FORBIDDEN_PATTERN);
		return match != null;
	}

	/**
	 * 使用制限をするにも関わらず設定数が0のオブジェクトタイプがあるかどうか調べます.
	 * @return オブジェクトタイプが不正な場合trueを返却
	 */
	private isIllegalLimitationType(): boolean {
		if ((this.info.docTypeCondition === this.FLAG_TRUE && this.info.selectedDocumentType.length === 0)
			|| (this.info.folderTypeCondition === this.FLAG_TRUE && this.info.selectedFolderType.length === 0)
			|| (this.info.tagTypeCondition === this.FLAG_TRUE && this.info.selectedTagType.length === 0)
			|| (this.info.securityCondition === this.FLAG_TRUE && this.info.securityList.getData().length === 0)) {
			return true;
		}
		return false;
	}

	/**
	 * メニューアイテムリストから名前を元に対象アイテムを取得します.
	 * @param menuItems 対象メニューアイテムリスト
	 * @param name 選択対象メニュー名称
	 * @return 選択対象メニューアイテム
	 */
	private getMenuItem(menuItems: EIMMenuItem[], name: string): EIMMenuItem {
		for (let i = 0; i < menuItems.length; i++) {
			if (menuItems[i].name === name) {
				return menuItems[i];
			}
		}
		return null;
	}
}
