import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef, DoCheck, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTreeDataGridColumn, EIMTreeDataGridComponent } from 'app/shared/components/tree-data-grid/tree-data-grid.component';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMWorkflowDTO } from 'app/admins/shared/dtos/workflow.dto';
import { EIMTreeDataGridNode } from 'app/shared/components/tree-data-grid/tree-data-grid.component.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMWorkflowDiagramComponent } from 'app/admins/components/workflow-diagram/workflow-diagram.component';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMStatusTypeDomain } from 'app/admins/shared/domains/status-type.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMEventTypeDomain } from 'app/admins/shared/domains/event-type.domain';
import { EIMSplitStateService } from 'app/shared/services/split-state.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { SelectItem } from 'primeng/api';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMWorkflowMailMethodListComponent, } from 'app/admins/shared/components/renderer/workflow-mail-method-list-renderer.component';
import { EIMEntryTypeRendererComponent } from 'app/admins/shared/components/renderer/entry-type-renderer.component';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { EIMMailTypeDTO } from 'app/admins/shared/dtos/mail-type.dto';
import { EIMWorkflowMailMethodListComponentService } from 'app/admins/shared/components/renderer/workflow-mail-method-list-renderer.component.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';
import { SelectModule } from 'primeng/select';

/**
 * ワークフロー（汎用）コンポーネント
 * @example
 *
 *      <eim-workflow>
 *      </eim-workflow>
 */
@Component({
	selector: 'eim-workflow',
	templateUrl: './workflow.component.html',
	styleUrls: ['./workflow.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		ButtonDirective,
		
		AngularSplitModule,
		PanelModule, 
		TabsModule,
		InputTextModule,
		SelectModule,
		EIMRadioButtonComponent
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMWorkflowComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMWorkflowComponent implements EIMAdminMainComponent, OnInit, AfterViewInit, OnChanges, DoCheck {
	/** ワークフローフォーム */
	@ViewChild('workflowForm', { static: true }) workflowForm: NgForm;

	/** ワークフロー属性フォーム */
	@ViewChild('workflowStatusForm', { static: true }) workflowStatusForm: NgForm;

	/** ワークフロータイプツリーデータグリッド */
	@ViewChild('workflowTreeDataGrid', { static: true })
	workflowTreeDataGrid: EIMTreeDataGridComponent;

	/** ワークフロータイプツリーデータグリッド */
	@ViewChild('workflowDiagram', { static: true })
	workflowDiagram: EIMWorkflowDiagramComponent;

	/** アサイメント先エントリーデータグリッド */
	@ViewChild('assignDataGrid', { static: true })
	assignDataGrid: EIMDataGridComponent;

	/** 属性データグリッド */
	@ViewChild('attributeTypeDataGrid')
	attributeTypeDataGrid: EIMDataGridComponent;

	/** メール種別データグリッド */
	@ViewChild('mailTypeDataGrid', { static: true })
	mailTypeDataGrid: EIMDataGridComponent;

	/** イベント優先度設定ツリーデータグリッド */
	@ViewChild('eventTreeDataGrid')
	eventTreeDataGrid: EIMTreeDataGridComponent;

	/** 画面識別ID */
	public viewId = 'Workflow'

	/** 使用可能言語リスト */
	public languages: any[] = [];

	/** セパレータ */
	public menuItemSeparator: EIMMenuItem = { separator: true };

	/** ステータス属性タブパネル表示 */
	public visibleStatusTabPanel = true;

	/** 選択ワークフローID */
	protected selectedWorkflowId = 0;

	/** WorkFlowConfのidのうち表示する最小値のid（マイナス値のためMin/Maxを間違えないように） */
	protected idMin = Number.MIN_SAFE_INTEGER;
	/** WorkFlowConfのidのうち表示する最大値のid */
	protected idMax = 0;

	/** ワークフローツリーのメニュー */
	// 登録メニュー
	protected menuItemWorkflowCreate: EIMMenuItem =
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), name: 'createWorkflow', icon: 'eim-icon-plus',
			command: (event) => { this.onClickCreateWorkflow(event); }
		};

	// 更新メニュー
	protected menuItemWorkflowUpdate: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03036'), name: 'updateWorkflow', icon: 'eim-icon-pencil', disabled: true,
			command: (event) => { this.onClickUpdateWorkflow(event); }
		};

	// 流用作成メニュー
	protected menuItemWorkflowCopy: EIMMenuItem =
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_03048'), name: 'copyWorkflow', icon: 'eim-icon-copy', disabled: true,
			command: (event) => { this.onClickCopyWorkflow(event); }
		};

	// リビジョンアップメニュー
	protected menuItemWorkflowRevisionup: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03051'), name: 'revisionupWorkflow', icon: 'eim-icon-pencil', disabled: true,
			command: (event) => { this.onClickRevisionUpWorkflow(event); }
		};

	// 削除メニュー
	protected menuItemWorkflowDelete: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteWorkflow', icon: 'eim-icon-trash', disabled: true,
			command: (event) => { this.onClickDeleteWorkflow(event); }
		};

	/** ワークフローツリーのメニュー */
	public workflowTreeMenuItems: EIMMenuItem[] = [
		this.menuItemWorkflowCreate,
		{
			label: this.translateService.instant('EIM.LABEL_03035'), name: 'updateSubMenu', icon: 'eim-icon-pencil', disabled: true, items: [
				this.menuItemWorkflowUpdate,
				this.menuItemWorkflowCopy,
				this.menuItemWorkflowRevisionup,
			]
		},
		this.menuItemWorkflowDelete,
	];

	/** ワークフローのコンテキストメニュー */
	public workflowContentsMenuItems: EIMMenuItem[] = [
		this.menuItemWorkflowUpdate,
		this.menuItemWorkflowCopy,
		this.menuItemWorkflowRevisionup,
		this.menuItemSeparator,
		this.menuItemWorkflowDelete,
	];

	/** アサイン先エントリデータグリッドのメニュー */
	// 選択メニュー
	private menuItemAssignApply: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03006'), name: 'selectAssign', icon: 'fa fa-check',
			command: (event) => { this.onClickAssignApply(event); }
		};

	// 削除メニュー
	private menuItemAssignDelete: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteAssign', icon: 'fa fa-trash-o', disabled: true,
			command: (event) => { this.onClickAssignDelete(event); }
		};

	// アサイン先エントリデータグリッドのメニュー
	public assignDataGridMenuItems: EIMMenuItem[] = [
		this.menuItemAssignApply,
		this.menuItemAssignDelete
	];

	/** イベント優先度設定データグリッドのメニュー */
	private menuItemEventSort: EIMMenuItem =
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_03027'), name: 'eventSort', icon: 'fa fa-check', disabled: true,
			command: (event) => { this.onClickEventChangeSort(event); }
		};

	// イベント優先度設定データグリッドのメニュー
	public eventSortDataGridMenuItems: EIMMenuItem[] = [
		this.menuItemEventSort,
	];

	/** メール種別一覧データグリッドのメニュー */
	// 選択メニュー
	private menuItemMailKindApply: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03006'), name: 'selectMailkind', icon: 'fa fa-check',
			command: (event) => { this.onClickMailKindApply(event); }
		};

	// 削除メニュー
	private menuItemMailKindDelete: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteMailKind', icon: 'fa fa-trash-o', disabled: true,
			command: (event) => { this.onClickMailKindDelete(event); }
		};

	// メール種別一覧データグリッドのメニュー
	public mailKindDataGridMenuItems: EIMMenuItem[] = [
		this.menuItemMailKindApply,
		this.menuItemMailKindDelete
	];

	/** 属性データグリッドのメニュー */
	// 選択メニュー
	protected menuItemAttributeTypeApply: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03006'), name: 'selectAttr', icon: 'fa fa-check',
			command: (event) => { this.onClickAttributeTypeApply(event); }
		};

	// 並べ替えメニュー
	protected menuItemAttributeTypeChangeSort: EIMMenuItem =
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_03027'), name: 'sortAttr', icon: 'fa fa-sort', disabled: true,
			command: (event) => { this.onClickAttributeTypeChangeSort(event); }
		};

	// 削除メニュー
	protected menuItemAttributeTypeDelete: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteAttr', icon: 'fa fa-trash-o', disabled: true,
			command: (event) => { this.onClickAttributeTypeDelete(event); }
		};

	// 複製設定メニュー
	protected menuItemAttributeTypeCope: EIMMenuItem =
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_03015'), name: 'copyAttr', icon: 'fa fa-copy', disabled: true,
			command: (event) => { this.onClickAttributeCopySetting(event); }
		};

	// 属性データグリッドのメニュー
	public attributeTypeDataGridMenuItems: EIMMenuItem[] = [
		this.menuItemAttributeTypeApply,
		this.menuItemAttributeTypeChangeSort,
		this.menuItemAttributeTypeDelete,
	];

	/** アサイン先エントリーのコンテキストメニュー */
	public assignContentsMenuItems: EIMMenuItem[] = [
		this.menuItemAssignDelete,
	];

	/** 属性のコンテキストメニュー */
	public attributeTypeContentsMenuItems: EIMMenuItem[] = [
		this.menuItemAttributeTypeDelete,
	];

	/** メール種別一覧のコンテキストメニュー */
	public mailTypeContentsMenuItems: EIMMenuItem[] = [
		this.menuItemMailKindDelete,
	];

	/** スプリットの設定 */
	public splitSetting = {
		splitLeft: { size: 27 },
		splitRightTop: { size: 45 }
	}

	/** ダイアグラムで選択されたステータスタイプ */
	public selectedStatusType: EIMStatusTypeDomain = new EIMStatusTypeDomain();

	/** ダイアグラムで選択されたイベントタイプ */
	public selectedEventType: EIMEventTypeDomain = new EIMEventTypeDomain();

	/** ステータス情報部を表示するかどうか */
	public statusSelected = false;

	/** イベント情報部を表示するかどうか */
	public eventSelected = false;

	/** イベント情報部を表示するかどうか */
	public lang = '';

	/** 設定情報リスト */
	public confList: any;

	/** ガード条件リスト */
	public guardList: SelectItem[] = [];

	/**  ベースイベントタイプリスト */
	public baseEventTypeList: SelectItem[] = [];

	/**  ステータスタイプ種別リスト */
	public statusTypeKindList: SelectItem[] = [];

	/** 選択対象ワークフロー */
	protected selectedWorkflow: EIMWorkflowDomain;

	/** ステータス属性部dirty状態復元用フラグ */
	private tmpStatusDirtyFlg = false;

	/** タブ指定用 */
	protected TAB_INDEX = {
		STATUS_INFO: 0,
		ATTR_INFO: 1,
	};

	/** タブ制御 */
	public index = signal(this.TAB_INDEX.STATUS_INFO); // 初期タブインデックス


	/** 登録からリビジョンアップか */
	public isRevisionUpRegist = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected workflowService: EIMAdminsWorkflowService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected splitStateService: EIMSplitStateService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected messageService: EIMMessageService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		public adminsCacheService: EIMAdminsCacheService,
		protected checkboxRendererComponentService: EIMWorkflowMailMethodListComponentService,
		protected changeDetectorRef: ChangeDetectorRef,
		protected entryService: EIMEntryService
	) {
		checkboxRendererComponentService.changed.subscribe(() => { this.onChangedCheck(); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 * @param workflow 選択するワークフロー
	 */
	public show(workflow?: EIMWorkflowDomain): void {

		this.workflowService.getLatestList()
			.subscribe((workflows: EIMWorkflowDTO[]) => {
				let nodes: EIMTreeDataGridNode[] = [];
				for (let i = 0; i < workflows.length; i++) {
					nodes.push(this.convertWorkflowToTreeDataGridNode(workflows[i], false));
				}

				// 選択するかどうか
				if (workflow) {
					if (workflow.parentId) {
						let node: EIMTreeDataGridNode;
						for (let i = 0; i < nodes.length; i++) {
							if (workflow.parentId === nodes[i].data.id) {
								node = nodes[i];
								break;
							}
						}
						if (node) {
							this.expandTreeNode(workflow, nodes, node);
						} else {
							this.subShow(workflow, nodes);
						}
					} else {
						this.subShow(workflow, nodes);
					}
				} else {
					this.workflowTreeDataGrid.select([], false);
					let scrollTop = this.workflowTreeDataGrid.getScrollTop();
					this.workflowTreeDataGrid.setData(nodes);
					window.setTimeout(() => {
						// 削除時スクロール位置が最下行に移動するため上書き指定
						this.workflowTreeDataGrid.setScrollTop(scrollTop);
					});
					this.selectTreeNode(null, false);
				}
			}, (err: any) => {
				// エラーの場合
				return;
			});

		this.languages = this.localStorageService.getLanguages();
	}


	/**
	 * 画面を表示します.
	 * @param workflow 選択するワークフロー
	 */
	public subShow(workflow, nodes: EIMTreeDataGridNode[]): void {
		this.workflowTreeDataGrid.setData(nodes);
		let loopCnt = nodes.length;

		let node: EIMTreeDataGridNode = {};
		node.data = { id: Number(workflow.id) };
		this.workflowTreeDataGrid.select([node], false);
		this.workflowTreeDataGrid.ensureIndexVisible(node);

		if (this.workflowTreeDataGrid.getSelectedData() && this.workflowTreeDataGrid.getSelectedData().length > 0) {
			this.selectTreeNode(this.workflowTreeDataGrid.getSelectedData()[0]);
		}
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
		this.workflowTreeDataGrid.setState(state.workflowTreeDataGrid);
		this.splitStateService.setState(state.split, this.splitSetting);
		this.languages = state.languages;
		this.selectedWorkflow = state.workflowDiagram.workflow;
		if ( this.selectedWorkflow ) {
			this.selectedWorkflowId = this.selectedWorkflow.id;
		}
		this.workflowDiagram.setState(state.workflowDiagram);
		this.confList = state.confList;
		this.guardList = state.guardList;
		this.baseEventTypeList = state.baseEventTypeList;
		this.statusTypeKindList = state.statusTypeKindList;
		this.tmpStatusDirtyFlg = state.tmpStatusDirtyFlg;
		this.index.set(state.index);

		// メニューの活性状態を復元
		let selectedNode: any[] = this.workflowTreeDataGrid.getSelectedData();
		window.setTimeout(
			() => {
				this.onChangeDiagram();

				this.assignDataGrid.setState(state.assignDataGrid);
				if (state.attributeTypeDataGrid && state.attributeTypeDataGrid.columns) {
					this.attributeTypeDataGrid.setState(state.attributeTypeDataGrid);
				}
				this.mailTypeDataGrid.setState(state.mailTypeDataGrid);
				if (state.eventTreeDataGrid) {
					window.setTimeout(() => {
						this.eventTreeDataGrid.setState(state.eventTreeDataGrid);
					});
				}
				if (selectedNode && selectedNode.length > 0) {
					let node: EIMTreeDataGridNode = selectedNode[0];
					window.setTimeout(() => {
						this.setWorkflowMenuItems(node);
					});
				} else {
					this.disableWorkflowMenuItems();
				}
			}
		);

	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		let attributeTypeDataGrid;
		if (this.attributeTypeDataGrid) {
			attributeTypeDataGrid = this.attributeTypeDataGrid.getState();
		}
		let eventTreeDataGrid;
		if (this.eventTreeDataGrid) {
			eventTreeDataGrid = this.eventTreeDataGrid.getState();
		}
		return {
			workflowTreeDataGrid: this.workflowTreeDataGrid.getState(),
			split: this.splitStateService.getState(this.splitSetting),
			languages: this.languages,
			workflowDiagram: this.workflowDiagram.getState(),
			confList: this.confList,
			guardList: this.guardList,
			baseEventTypeList: this.baseEventTypeList,
			statusTypeKindList: this.statusTypeKindList,
			tmpStatusDirtyFlg: this.tmpStatusDirtyFlg,
			assignDataGrid: this.assignDataGrid.getState(),
			attributeTypeDataGrid: attributeTypeDataGrid,
			mailTypeDataGrid: this.mailTypeDataGrid.getState(),
			eventTreeDataGrid: eventTreeDataGrid,
			index: this.index(),
		};
	}

	/**
	 * ワークフロー登録可否を返却します.
	 * @return クラス登録可否
	 */
	public creatable(): boolean {
		return this.workflowTreeDataGrid.getSelectedData().length > 0 && this.workflowForm.valid
			&& (this.workflowForm.dirty || this.workflowStatusForm.dirty) && this.checkWorkflowName() && !this.workflowDiagram.addingEvent;
	}


	/**
	 * 同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}

	/**
	 * 属性同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public attDataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.attTypeId === obj2.attTypeId);
	}

	/**
	 * アサインエントリー同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public entryDataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.entryId === obj2.entryId);
	}

	/**
	 * イベント優先度同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public eventTreeDataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.data.id === obj2.data.id);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
	}

	/**
	 * メールの送信方法変更時イベントハンドラです.
	 */
	onChangedCheck(): void {
		this.workflowStatusForm.form.markAsDirty();
	}

	/**
	 * ワークフロー変更イベントハンドラ
	 * @param event イベント
	 */
	onWorkflowChange(event: any): void {
		window.setTimeout(() => {
			this.refreshWorkflowName();
			this.workflowDiagram.refresh();
		});
	}

	/**
	 * イベントタイプ変更イベントハンドラ
	 * @param event イベント
	 */
	onWorkflowEventChange(event: any): void {
		this.refreshWorkflowName();
	}

	/**
	 * 初期化のイベントハンドラです.
	 */
	ngAfterViewInit() {
		// メール種別設定
		window.setTimeout(() => {
			if (!this.statusTypeKindList || this.statusTypeKindList.length <= 0 || !this.guardList || this.guardList.length <= 0 || !this.baseEventTypeList || this.baseEventTypeList.length <= 0) {
				this.workflowService.getConfList()
					.subscribe((confList: any) => {
						this.confList = confList[0];
						// ガード条件リスト取得
						let guardList = this.confList.guardConditionList.guardCondition;
						this.guardList = [];
						if (!(guardList instanceof Array)) {
							guardList = [guardList]
						}
						if (guardList && guardList.length > 0) {
							for (let i = 0; i < guardList.length; i++) {
								let guard = guardList[i];
								// 表示対象外ははじく
								if (!(this.idMin <= Number(guard.attr.id) && Number(guard.attr.id) <= this.idMax)) {
									continue;
								}
								this.guardList.push({
									label: guard.attr.name,
									value: Number(guard.attr.id)
								});
							}
						}

						// ベースイベントタイプリスト取得
						let baseEventTypeList = this.confList.baseEventTypeList.baseEventType;
						this.baseEventTypeList = [];
						if (!(baseEventTypeList instanceof Array)) {
							baseEventTypeList = [baseEventTypeList]
						}
						if (baseEventTypeList && baseEventTypeList.length > 0) {
							for (let i = 0; i < baseEventTypeList.length; i++) {
								let bEvent = baseEventTypeList[i];
								// 表示対象外ははじく
								if (!(this.idMin <= Number(bEvent.attr.id) && Number(bEvent.attr.id) <= this.idMax)) {
									continue;
								}
								this.baseEventTypeList.push({
									label: bEvent.attr.name,
									value: Number(bEvent.attr.id)
								});
							}
						}

						// ステータスタイプ種別リスト取得
						let statusTypeKindList = this.confList.statusTypeKindList.statusTypeKind;
						this.statusTypeKindList = [];
						if (!(statusTypeKindList instanceof Array)) {
							statusTypeKindList = [statusTypeKindList]
						}
						if (statusTypeKindList && statusTypeKindList.length > 0) {
							for (let i = 0; i < statusTypeKindList.length; i++) {
								let st = statusTypeKindList[i];
								// 表示対象外ははじく
								if (!(this.idMin <= Number(st.attr.id) && Number(st.attr.id) <= this.idMax)) {
									continue;
								}
								this.statusTypeKindList.push({
									label: st.attr.name,
									value: Number(st.attr.id)
								});
							}
						}

					}, (err: any) => {
						// エラーの場合
						return;
					});
			}

			let columns: EIMTreeDataGridColumn[] = [];
			// 名前
			columns.push({ field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), icon: 'fa-lg eim-icon-thumb-up' });
			// 改定
			columns.push({ field: 'revision', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02302'), width: 40 });
			// 更新日時
			columns.push({ field: 'modifyDateTimeString', headerName: this.translateService.instant('EIM.LABEL_02033'), width: 160 });

			this.workflowTreeDataGrid.setColumns(columns);

			this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').visible = false;

			let columns2: EIMDataGridColumn[] = [];
			// メール種別
			columns2.push({ field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02112'), width: 270, suppressFilter: true });
			// 送信方法
			columns2.push({ field: 'method', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02113'), width: 250, suppressFilter: true, cellRendererFramework: EIMWorkflowMailMethodListComponent });
			this.mailTypeDataGrid.setColumns(columns2);

			// アサイン先エントリー
			columns2 = [];
			// タイプ
			columns2.push({ field: 'entryType', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 130, cellRendererFramework: EIMEntryTypeRendererComponent, suppressFilter: true });
			// 名前
			columns2.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 220, suppressFilter: true });
			this.assignDataGrid.setColumns(columns2);

			// イベント優先先設定
			columns = [];
			// 名前
			columns.push({ field: 'label', headerName: this.translateService.instant('EIM.LABEL_02002') });
			this.eventTreeDataGrid.setColumns(columns);
		});
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	ngOnChanges(changes: SimpleChanges): void {
		this.show();
	}

	/**
	 * 変更検知後イベントハンドラ.
	 */
	ngDoCheck(): void {
		// ngFor内に存在するために描写されていない部品のinvalid情報を復元するために常に監視する
		if (this.tmpStatusDirtyFlg && !this.workflowStatusForm.dirty) {
			this.workflowStatusForm.form.markAsDirty();
			window.setTimeout(() => {
				if (this.workflowDiagram.getSelectedData().length > 0) {
					for (let i = 0; i < this.languages.length; i++) {
						if (this.workflowStatusForm.form.controls['name_' + this.languages[i].lang]) {
							this.workflowStatusForm.form.controls['name_' + this.languages[i].lang].markAsDirty();
						}
					}
				}
			});
		} else if (this.workflowStatusForm.dirty) {
			this.tmpStatusDirtyFlg = true;
		}
	}

	/**
	 * 登録ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickCreateWorkflow(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowCreator(
			{
				created: (workflow: EIMWorkflowDomain) => {
					// ワークフロー登録（汎用）画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					this.completed(workflow, this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
				},
				errored: () => {
					this.adminDialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * タブ切り替えのイベントハンドラ
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		this.index.set(event);
		window.setTimeout(() => {
			let selectedList: any[] = this.workflowDiagram.getSelectedData();
			let selected = selectedList[0];	// 単数選択の前提
			this.setAttributeTypeDataGrid(Number(selected.id));
			this.changeDetectorRef.detectChanges();
		});
	}

	/**
	 * 更新ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickUpdateWorkflow(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowUpdator(
			this.selectedWorkflow,
			{
				updated: (workflow: EIMWorkflowDomain) => {
					// ワークフロー更新（汎用）画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					workflow.parentId = this.selectedWorkflow.parentId;
					this.completed(workflow, this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
				},
				errored: () => {
					this.adminDialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * 流用作成ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickCopyWorkflow(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowCopyExecutor(
			this.selectedWorkflow,
			{
				created: (workflow: EIMWorkflowDomain) => {
					// 流用作成（汎用）画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					this.completed(workflow, this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
				},
				errored: () => {
					this.adminDialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * リビジョンアップボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickRevisionUpWorkflow(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowRevisionUpCreator(
			this.selectedWorkflow,
			this.isRevisionUpRegist,
			{
				created: (workflow: EIMWorkflowDomain) => {
					// ワークフロー登録（汎用）画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					this.completed(workflow, this.translateService.instant('EIM_ADMINS.INFO_00004', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
					this.isRevisionUpRegist = false;
				},
				errored: () => {
					this.adminDialogManagerComponentService.close(dialogId);
					this.isRevisionUpRegist = false;
				}
			}
		);
	}

	/**
	 * 削除ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickDeleteWorkflow(event: any): void {
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00024'),
			() => {
				this.workflowService.delete(this.selectedWorkflow.id)
					.subscribe(() => {
						let selectedNode: EIMTreeNode = this.workflowTreeDataGrid.getSelectedData()[0];
						let parent: EIMTreeNode = selectedNode.parent;
						let workflow: EIMWorkflowDomain = null;
						if (parent) {
							workflow = new EIMWorkflowDomain();
							workflow.id = parent.data.id;
						}
						this.completed(workflow, this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
					}, (err: any) => {
						// エラーの場合
						return;
					});
			});
	}

	/**
	 * ツリーノード選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectTreeNode(event: any): void {
		if (this.creatable()) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
				() => {
					this.workflowDiagram.resetDirty();
					this.tmpStatusDirtyFlg = false;
					this.workflowStatusForm.form.reset();
					this.workflowStatusForm.form.markAsPristine();

					if (event.selectedData && event.selectedData.length > 0) {
						this.selectedWorkflowId = event.selectedData[0].data.id;
						let node: EIMTreeDataGridNode = event.selectedData[0];

						this.selectTreeNode(node);
					} else {
						this.selectedWorkflowId = 0;
						this.selectTreeNode(null, false);
					}
				},
				() => {
					this.workflowTreeDataGrid.select([{ data: { id: Number(this.selectedWorkflowId) } }], false);
				}
			);

		} else {
			this.workflowDiagram.resetDirty();
			this.tmpStatusDirtyFlg = false;
			this.workflowStatusForm.form.reset();
			this.workflowStatusForm.form.markAsPristine();
			if (event.selectedData && event.selectedData.length > 0) {
				this.selectedWorkflowId = event.selectedData[0].data.id;
				let node: EIMTreeDataGridNode = event.selectedData[0];

				this.selectTreeNode(node);
			} else {
				this.selectedWorkflowId = 0;
				this.selectTreeNode(null, false);
			}
		}

	}

	/**
	 * ツリーノード展開時のイベントハンドラ
	 * @param treeNodes 展開されたノードリスト
	 */
	onExpandTreeNode(treeNodes: EIMTreeDataGridNode[]): void {

		if (!treeNodes || treeNodes[0]['isSearch']) {
			return;
		}
		this.workflowService.getRevisionList(treeNodes[0].data.id)
			.subscribe((workflows: EIMWorkflowDTO[]) => {
				// データ更新時にスクロールバーが最下行に移動するため上書き指定
				let nodes: EIMTreeDataGridNode[] = [];
				for (let i = 0; i < workflows.length; i++) {
					if (workflows[i].type === 'backToList' || workflows[i].isLatest) {
						continue;
					}
					nodes.push(this.convertWorkflowToTreeDataGridNode(workflows[i], true));
				}
				if (nodes.length === 0) {
					treeNodes[0].children = [];
					treeNodes[0].leaf = true;
				} else {
					for (let i = 0; i < nodes.length; i++) {
						nodes[i].parent = treeNodes[0];
					}
					this.workflowTreeDataGrid.setChildren(treeNodes[0], nodes);
				}
				treeNodes[0]['isSearch'] = true;
			}, (err: any) => {
				// エラーの場合
				return;
			});
	}

	/**
	 * ツリーノード展開時のイベントハンドラ
	 * @param workflow ワークフロー
	 * @param treeNodes 展開されたノードリスト
	 * @param node ツリーのノード
	 */
	expandTreeNode(workflow: EIMWorkflowDomain, treeNodes: EIMTreeDataGridNode[], node: EIMTreeDataGridNode): void {

		if (!node || node['isSearch']) {
			return;
		}
		this.workflowService.getRevisionList(node.data.id)
			.subscribe((workflows: EIMWorkflowDTO[]) => {
				let nodes: EIMTreeDataGridNode[] = [];
				for (let i = 0; i < workflows.length; i++) {
					if (workflows[i].type === 'backToList' || workflows[i].isLatest) {
						continue;
					}
					nodes.push(this.convertWorkflowToTreeDataGridNode(workflows[i], true));
				}
				if (nodes.length === 0) {
					node.children = [];
					node.leaf = true;
				} else {
					node.children = nodes;
					node.expanded = true;
					for (let i = 0; i < nodes.length; i++) {
						nodes[i].parent = node;
					}
				}
				node['isSearch'] = true;

				this.subShow(workflow, treeNodes);

			}, (err: any) => {
				// エラーの場合
				return;
			});
	}


	/**
	 * 属性選択ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickAttributeTypeApply(event: any): void {
		let callerId = EIMAdminsConstantService.APP_ID_GENERAL;
		let orgDataList = this.attributeTypeDataGrid.getData();
		let newData: EIMAttributeTypeDTO[] = [];
		for (let i = 0; i < orgDataList.length; i++) {
			let dto = new EIMAttributeTypeDTO();
			dto.newCopyFlag = orgDataList[i].newCopyFlag;
			dto.dispOrder = orgDataList[i].dispOrder;
			dto.attTypeId = orgDataList[i].attTypeId;
			dto.attTypeName = orgDataList[i].attTypeName;
			dto.typeLabel = orgDataList[i].typeLabel;
			dto.definitionName = orgDataList[i].definitionName;

			dto.valTypeId = orgDataList[i].valTypeId;
			dto.valTypeName = orgDataList[i].valTypeName;
			dto.isMultipleValue = orgDataList[i].isMultipleValue;
			dto.codeTypeName = orgDataList[i].codeTypeName;
			dto.uiControlName = orgDataList[i].uiControlName;
			dto.attTypeEssential = orgDataList[i].attTypeEssential;
			dto.defValueList = orgDataList[i].defValueList;
			dto.initValueList = orgDataList[i].initValueList;

			newData.push(dto);
		}

		let dialogId: string = this.adminDialogManagerComponentService.showAttributeSelector(
			newData,
			callerId,
			false,
			null,
			null,
			{
				selected: (data: EIMAttributeTypeDTO[]) => {
					// 属性選択画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// 属性一覧に設定
					this.selectedStatusType.attTypeList = data;
					this.attributeTypeDataGrid.setData(data);
					this.workflowStatusForm.form.markAsDirty();
					if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getData() && this.attributeTypeDataGrid.getData().length > 1) {
						this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').disabled = false;
					} else {
						this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').disabled = true;
					}
					this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = true;
				}
			}
		);
	}

	/**
	 * ダイアグラムのノード、エッジ選択時のイベントハンドラ
	 */
	onChangeDiagram(): void {
		this.getMenuItem(this.assignDataGridMenuItems, 'deleteAssign').disabled = true;
		this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = true;
		this.getMenuItem(this.mailKindDataGridMenuItems, 'deleteMailKind').disabled = true;
		// ダイアグラムのノード、エッジ選択時の詳細処理へ
		this.changeDiagramDetail();
	}

	/**
	 * ダイアグラムのノード、エッジ選択時の詳細処理
	 */
	public changeDiagramDetail(): void {
		let selectedList: any[] = this.workflowDiagram.getSelectedData();
		window.setTimeout(() => {
			this.statusSelected = false;
			this.eventSelected = false;
			if (!selectedList || selectedList.length === 0) {
				return;
			}
			this.workflowDiagram.getWorkflow().selfAddInfo();
			let selected = selectedList[0];	// 単数選択の前提
			if (selected.domain instanceof EIMStatusTypeDomain) {
				this.statusSelected = true;
				this.eventSelected = false;
				// ステータスタイプ選択時
				this.selectedStatusType = selected.domain;
				// アサインエントリーデータの設定
				this.getMenuItem(this.assignDataGridMenuItems, 'selectAssign').disabled = false;

				// イベント優先度並べメニューの設定
				this.getMenuItem(this.eventSortDataGridMenuItems, 'eventSort').disabled = false;

				this.assignDataGrid.setData(this.selectedStatusType.asEntryList);

				// イベント優先設定データの設定
				let baseEventTypeList = this.confList.baseEventTypeList.baseEventType;
				if (!(baseEventTypeList instanceof Array)) {
					baseEventTypeList = [baseEventTypeList]
				}
				//
				let eventTreeNodeList: EIMTreeDataGridNode[] = [];
				let eventList = selected.domain.eventList;
				// イベント取得
				if (eventList && eventList.length > 0) {
					// イベントがある場合
					let parantNodes = {};

					for (let idx = 0; idx < eventList.length; idx++) {

						for (let m = 0; m < baseEventTypeList.length; m++) {
							let baseEvent = baseEventTypeList[m];
							if (Number(baseEvent.attr.id) === eventList[idx].baseEventTypeId) {
								parantNodes[baseEvent.attr.id] = {
									data: {
										id: Number(baseEvent.attr.id),
										label: baseEvent.attr.name,
										icon: 'fa-lg fa-list-alt',
									},
									leaf: true,
								};
							}
						}
					}

					for (let key in parantNodes) {
						if (key) {
							let parentNode = parantNodes[key];
							let children: EIMTreeDataGridNode[] = [];
							for (let i = 0; i < eventList.length; i++) {
								if (Number(key) === eventList[i].baseEventTypeId) {
									let childNode = {
										data: {
											id: Number(eventList[i].id),
											label: eventList[i].label,
											sequence: eventList[i].sequence,
											icon: 'fa-lg fa-arrow-circle-right',
										},
										leaf: true,
										sequence: eventList[i].sequence,
									};
									children.push(childNode);
								}
							}
							this.sort(children, 'sequence', 'ASC');
							this.hierarchicalDomainService.setChildren(parentNode, children);
							parentNode.expanded = true;
							eventTreeNodeList.push(parentNode);
						}
					}
				}
				this.eventTreeDataGrid.setData(eventTreeNodeList);

				this.getMenuItem(this.eventSortDataGridMenuItems, 'eventSort').disabled = true;
				for (let n = 0; n < eventTreeNodeList.length; n++) {
					let evt = eventTreeNodeList[n];
					if (evt.children.length > 1) {
						this.getMenuItem(this.eventSortDataGridMenuItems, 'eventSort').disabled = false;
					}
				}

				// 属性データの設定
				this.setAttributeTypeDataGrid(Number(selected.id));
				this.attributeTypeDataGrid.setScrollTop(2);
				this.attributeTypeDataGrid.setData(this.selectedStatusType.attTypeList);
				this.attributeTypeDataGrid.refreshView();
				if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getData() && this.attributeTypeDataGrid.getData().length > 1) {
					this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').disabled = false;
				} else {
					this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').disabled = true;
				}
				if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getSelectedData() && this.attributeTypeDataGrid.getSelectedData().length > 0) {
					this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = false;
				} else {
					this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = true;
				}

				this.changeDetectorRef.detectChanges();
			} else if (selected.domain instanceof EIMEventTypeDomain) {
				// ステータスタイプ選択時
				this.selectedEventType = selected.domain;
				//
				this.mailTypeDataGrid.setData(this.selectedEventType.mailList);
				this.statusSelected = false;
				this.eventSelected = true;
			}
		});

	}

	/**
	 * アサインエントリー選択ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickAssignApply(event: any): void {
		let entryList = this.assignDataGrid.getData();
		for (let i = 0; i < entryList.length; i++) {
			entryList[i].entryTypeId = EIMAdminsConstantService.ENTRY_TYPE_ID_EN[entryList[i].entryType];
			entryList[i].entryTypeName = this.entryService.getEntryTypeName(entryList[i].entryTypeId);
		}

		let selectTarget: any = {
			system: true,
		}

		let dialogId: string = this.adminDialogManagerComponentService.showEntrySelector(
			null,
			entryList,
			selectTarget,
			"1",
			{
				selected: (data) => {
					// アサインエントリー選択画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					for (let i = 0; i < data.length; i++) {
						data[i].entryType = EIMAdminsConstantService.ENTRY_TYPE_EN[data[i].entryTypeId];
					}
					this.selectedStatusType.asEntryList = data;
					this.assignDataGrid.setData(data)
					this.workflowStatusForm.form.markAsDirty();
					// アサインエントリー削除ボタンを非活性にします。
					this.getMenuItem(this.assignDataGridMenuItems, 'deleteAssign').disabled = true;
				}
			}
		);

	}

	/**
	 * メール種別選択ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickMailKindApply(event: any): void {

		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowMailKindSelector(
			this.mailTypeDataGrid.getData(), this.idMin, this.idMax,
			{
				selected: (data: EIMMailTypeDTO[]) => {
					// メール種別選択画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					this.selectedEventType.mailList = data;
					this.mailTypeDataGrid.setData(data)
					this.workflowStatusForm.form.markAsDirty();
					// メール種別の削除ボタンを非活性にします。
					this.getMenuItem(this.mailKindDataGridMenuItems, 'deleteMailKind').disabled = true;
				},
				errored: () => {
					this.adminDialogManagerComponentService.close(dialogId);
				}

			}
		);
	}

	/**
	 * メール種別削除ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickMailKindDelete(event: any): void {

		if (this.mailTypeDataGrid && this.mailTypeDataGrid.getSelectedData() && this.mailTypeDataGrid.getSelectedData().length > 0) {
			let selectData = this.mailTypeDataGrid.getSelectedData();
			this.mailTypeDataGrid.removeRowData(selectData);
			this.workflowStatusForm.form.markAsDirty();
			this.selectedEventType.mailList = this.mailTypeDataGrid.getData();
			this.getMenuItem(this.mailKindDataGridMenuItems, 'deleteMailKind').disabled = true;
		}
	}

	/**
	 * 属性削除ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickAssignDelete(event: any): void {
		if (this.assignDataGrid && this.assignDataGrid.getSelectedData() && this.assignDataGrid.getSelectedData().length > 0) {
			let selectData = this.assignDataGrid.getSelectedData();
			this.assignDataGrid.removeRowData(selectData);
			this.selectedStatusType.asEntryList = this.assignDataGrid.getData();
			this.getMenuItem(this.assignDataGridMenuItems, 'deleteAssign').disabled = true;
			this.workflowStatusForm.form.markAsDirty();
		}
	}

	/**
	 * 属性タイプ並べ替えボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickAttributeTypeChangeSort(event: any): void {
		if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getData() && this.attributeTypeDataGrid.getData().length > 0) {
			let dialogId: string = this.adminDialogManagerComponentService.showAttTypeSortUpdator(
				null,
				EIMAdminsConstantService.ADMIN_APP_ID_FORM,
				this.attributeTypeDataGrid.getData(),
				{
					updated: (data: EIMAttributeTypeDTO[]) => {
						for (let i = 0; i < data.length; i++) {
							data[i].dispOrder = i + 1;
						}
						this.adminDialogManagerComponentService.close(dialogId);
						this.selectedStatusType.attTypeList = data;
						this.attributeTypeDataGrid.setData(data);
						this.workflowStatusForm.form.markAsDirty();
					},
					errored: () => {
						this.adminDialogManagerComponentService.close(dialogId);
					}
				}
			);
		}
	}

	/**
	 * 属性削除ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickAttributeTypeDelete(event: any): void {
		if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getSelectedData() && this.attributeTypeDataGrid.getSelectedData().length > 0) {
			let selectData = this.attributeTypeDataGrid.getSelectedData();
			this.attributeTypeDataGrid.removeRowData(selectData);
			this.workflowStatusForm.form.markAsDirty();
			this.selectedStatusType.attTypeList = this.attributeTypeDataGrid.getData();
			this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = true;
			if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getData() && this.attributeTypeDataGrid.getData().length > 1) {
				this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').disabled = false;
			} else {
				this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').disabled = true;
			}

		}
	}

	/**
	 * 属性複製設定ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickAttributeCopySetting(event: any): void {

		let orgDataList = this.attributeTypeDataGrid.getData();
		let newData: EIMAttributeTypeDTO[] = [];
		for (let i = 0; i < orgDataList.length; i++) {
			let dto = new EIMAttributeTypeDTO();
			dto.newCopyFlag = orgDataList[i].newCopyFlag;
			dto.dispOrder = orgDataList[i].dispOrder;
			dto.attTypeId = orgDataList[i].attTypeId;
			dto.attTypeName = orgDataList[i].attTypeName;
			dto.typeLabel = orgDataList[i].typeLabel;
			dto.definitionName = orgDataList[i].definitionName;

			dto.valTypeId = orgDataList[i].valTypeId;
			dto.valTypeName = orgDataList[i].valTypeName;
			dto.isMultipleValue = orgDataList[i].isMultipleValue;
			dto.codeTypeName = orgDataList[i].codeTypeName;
			dto.uiControlName = orgDataList[i].uiControlName;
			dto.attTypeEssential = orgDataList[i].attTypeEssential;
			dto.defValueList = orgDataList[i].defValueList;
			dto.initValueList = orgDataList[i].initValueList;

			newData.push(dto);
		}
		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowAttributeCopySetting(
			newData,
			{
				updated: (data: EIMAttributeTypeDTO[]) => {
					// 属性選択画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					// 属性一覧に設定
					this.selectedStatusType.attTypeList = data;
					this.attributeTypeDataGrid.setData(data);
					this.workflowStatusForm.form.markAsDirty();
				}
			}
		);

	}

	/**
	 * イベント優先度設定並べ替えボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickEventChangeSort(event: any): void {
		if (this.eventTreeDataGrid && this.eventTreeDataGrid.getData() && this.eventTreeDataGrid.getData().length > 0) {
			let eventData = this.clone(this.eventTreeDataGrid.getData())
			let dialogId: string = this.adminDialogManagerComponentService.showEventSortCreator(
				eventData,
				{
					updated: (data: EIMTreeDataGridNode[]) => {
						this.adminDialogManagerComponentService.close(dialogId);
						//
						let eventList = this.workflowDiagram.getWorkflow().eventTypeList;

						for (let i = 0; i < data.length; i++) {
							let children = data[i].children;
							for (let m = 0; m < children.length; m++) {
								let child: EIMTreeDataGridNode = children[m];
								for (let n = 0; n < eventList.length; n++) {
									let evt = eventList[n];
									if (evt.id === child.data.id) {
										evt.sequence = child.data.sequence;
									}
								}
							}

						}
						//
						this.eventTreeDataGrid.setData(data);
						this.workflowStatusForm.form.markAsDirty();
					},
					errored: () => {
						this.adminDialogManagerComponentService.close(dialogId);
					}
				}
			);
		}
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * コンテンツメニューアイテムの活性非活性制御を行う
	 * @param event イベント
	 */
	onContextMenuWorkflow(event: any): void {
		window.setTimeout(() => {
			// 選択したワークフロー取得
			let selectedWorkflowList = this.workflowTreeDataGrid.getSelectedData();
			if (selectedWorkflowList && selectedWorkflowList.length === 1) {
				this.selectTreeNode(selectedWorkflowList[0]);

			} else {
				// ワークフローメニュー活性初期化処理
				this.disableWorkflowMenuItems();
			}
		});
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * コンテンツメニューアイテムの活性非活性制御を行う
	 * @param event イベント
	 */
	onAssignContextMenuWorkflow(event: any): void {
		// 選択したアサインエントリー取得
		let selectedAssignEntryList = this.assignDataGrid.getSelectedData();
		if (selectedAssignEntryList && selectedAssignEntryList.length > 0) {
			// アサインエントリー削除ボタンを活性にします。
			this.getMenuItem(this.assignContentsMenuItems, 'deleteAssign').disabled = false;
		} else {
			// アサインエントリー削除ボタンを非活性にします。
			this.getMenuItem(this.assignContentsMenuItems, 'deleteAssign').disabled = true;
		}
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * コンテンツメニューアイテムの活性非活性制御を行う
	 * @param event イベント
	 */
	onAttributeTypeContextMenuWorkflow(event: any): void {
		// 選択した属性取得
		let selectedAttributeList = this.attributeTypeDataGrid.getSelectedData();
		if (selectedAttributeList && selectedAttributeList.length > 0) {
			// 属性の削除ボタンを活性にします。
			this.getMenuItem(this.attributeTypeContentsMenuItems, 'deleteAttr').disabled = false;
		} else {
			// 属性の削除ボタンを非活性にします。
			this.getMenuItem(this.attributeTypeContentsMenuItems, 'deleteAttr').disabled = true;
		}
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * コンテンツメニューアイテムの活性非活性制御を行う
	 * @param event イベント
	 */
	onMailTypeContextMenuWorkflow(event: any): void {
		// 選択したメール種別取得
		let selectedMailTypeList = this.mailTypeDataGrid.getSelectedData();
		if (selectedMailTypeList && selectedMailTypeList.length > 0) {
			// メール種別の削除ボタンを活性にします。
			this.getMenuItem(this.mailTypeContentsMenuItems, 'deleteMailKind').disabled = false;
		} else {
			// メール種別の削除ボタンを非活性にします。
			this.getMenuItem(this.mailTypeContentsMenuItems, 'deleteMailKind').disabled = true;
		}
	}

	/**
	 * 登録ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickRegistWorkflow(event: any): void {
		if (this.selectedWorkflow.parentId) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00018'));
			return;
		}
		if (!this.checkWorkflowName()) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00015'));
			return;
		}

		let msgValue = this.checkStatusNameDuplication();
		if (msgValue) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00017', { value: msgValue }));
			return;
		}

		let msgValues = this.checkEventNameDuplication();
		if (msgValues) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00019', { value1: msgValues.value1, value2: msgValues.value2, value3: msgValues.value3 }));
			return;
		}

		this.workflowService.checkWorkFlowObj(this.selectedWorkflow.id)
			.subscribe((res: any) => {
				if (res[0].attr.satisfy === '') {
					// 登録確認
					this.messageService.show(EIMMessageType.confirm,
						this.translateService.instant('EIM_ADMINS.CONFIRM_00022'),
						() => {
							let workflow = this.workflowDiagram.getWorkflow();
							if (workflow.namespace && workflow.namespace !== '') {
								workflow.name = workflow.name + '(' + workflow.namespace + ')'
							}
							this.workflowService.workflowRegist(workflow)
								.subscribe(() => {
									this.completed(this.selectedWorkflow, this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
								}, (err: any) => {
									// エラーの場合
									return;
								});
						});
				} else if (res[0].attr.satisfy === 'true') {
					// リビジョンアップ確認
					this.messageService.show(EIMMessageType.confirm,
						this.translateService.instant('EIM_ADMINS.CONFIRM_00026'),
						() => {
							this.isRevisionUpRegist = true;
							this.onClickRevisionUpWorkflow(event)
						});
				}
			}, (err: any) => {
				// エラーの場合
				return;
			});
	}

	/**
	 * 属性一覧データ選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectAttributeTypeData(event: any): void {
		if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getSelectedData() && this.attributeTypeDataGrid.getSelectedData().length > 0) {
			this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = false;
		} else {
			this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = true;
		}
	}

	/**
	 * アサインエントリー一覧データ選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectAssignData(event: any): void {
		if (this.assignDataGrid && this.assignDataGrid.getSelectedData() && this.assignDataGrid.getSelectedData().length > 0) {
			this.getMenuItem(this.assignDataGridMenuItems, 'deleteAssign').disabled = false;
		} else {
			this.getMenuItem(this.assignDataGridMenuItems, 'deleteAssign').disabled = true;
		}
	}

	/**
	 * メール種別データ選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectMailTypeData(event: any): void {
		if (this.mailTypeDataGrid && this.mailTypeDataGrid.getSelectedData() && this.mailTypeDataGrid.getSelectedData().length > 0) {
			this.getMenuItem(this.mailKindDataGridMenuItems, 'deleteMailKind').disabled = false;
		} else {
			this.getMenuItem(this.mailKindDataGridMenuItems, 'deleteMailKind').disabled = true;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 終了処理
	 * @param msg メッセージ
	 */
	protected completed(workflow: EIMWorkflowDomain, msg?: string): void {
		if (msg && msg !== '') {
			this.messageService.showGrowl(msg);
		}
		this.workflowDiagram.resetDirty();
		this.tmpStatusDirtyFlg = false;
		this.workflowStatusForm.resetForm();
		this.workflowStatusForm.form.reset();
		this.workflowStatusForm.form.markAsPristine();
		this.show(workflow);
	}

	/**
	 * idよりselectItemsリストから名称を取得する.
	 * @param selectItemsリスト
	 * @param idx
	 * @return 名称
	 */
	public getSelectItemsLabel(selectItems: any[], idx: number): string {
		let label = ''
		for (let i = 0; i < selectItems.length; i++) {
			if (Number(selectItems[i].value) === Number(idx)) {
				label = selectItems[i].label;
			}
		}
		return label;
	}

	/**
	 * ツリーノード選択時の処理
	 * @param node 選択されたノード
	 * @param doGetWorkflow ワークフロー情報を取得するかどうか
	 */
	protected selectTreeNode(node?: EIMTreeDataGridNode, doGetWorkflow = true): void {
		this.statusSelected = false;
		this.eventSelected = false;

		// ワークフローメニューの初期化処理
		this.disableWorkflowMenuItems();

		if (node) {
			this.selectedWorkflowId = node.data.id;
		} else {
			this.selectedWorkflowId = 0;
			this.workflowDiagram.workflowClear();
			this.workflowDiagram.setData([]);
		}

		if (!doGetWorkflow) {
			return;
		}

		this.workflowService.getWorkFlowDefById(node.data.id)
			.subscribe((workflow: EIMWorkflowDomain) => {
				this.statusSelected = false;
				this.eventSelected = false;
				if (this.selectedWorkflowId === node.data.id) {
					if (node.parent) {
						let parent: EIMTreeDataGridNode = node.parent;
						let dto: EIMWorkflowDTO = parent.data;
						workflow.parentId = dto.id;
					}
					this.selectedWorkflow = workflow;
					this.workflowDiagram.show({ workflow: workflow });

					// ワークフローメニューの活性化処理
					this.setWorkflowMenuItems(node);
				}
			}, (err: any) => {
				// エラーの場合
				return;
			});
	}

	/**
	 * 属性一覧項目の設定
	 * @param no ステータスの番号
	 */
	protected setAttributeTypeDataGrid(no: number): void {
		// 属性データの設定
		window.setTimeout(() => {
			let columns: EIMDataGridColumn[] = [];
			// 定義名称
			columns.push({ field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 260, suppressFilter: true });
			// 名前
			columns.push({ field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 260, cellRendererFramework: EIMAdminNameRendererComponent, suppressFilter: true });
			// データ型
			columns.push({ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 100, suppressFilter: true });
			// 複数値
			columns.push({ field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 90, suppressFilter: true });
			// コードタイプ
			columns.push({ field: 'codeTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02007'), width: 110, suppressFilter: true });
			// デフォルト値
			columns.push({ field: 'defValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 110, cellRendererFramework: EIMDefaultListRendererComponent, suppressFilter: true });
			this.attributeTypeDataGrid.setColumns(columns);
		});
	}

	/**
	 * ワークフロータイプDTOをツリーデータグリッドで使用できる型に変換して返却します.
	 * @param type ワークフローDTO
	 * @param isLeaf 末端かどうか
	 * @return ツリーデータグリッドノード
	 */
	private convertWorkflowToTreeDataGridNode(type: EIMWorkflowDTO, isLeaf: boolean): EIMTreeDataGridNode {
		let leaf: boolean = (isLeaf || type.revision === 0);
		return {
			label: type.name,
			data: type,
			leaf: leaf,
			expanded: false
		};
	}

	/**
	 * アイコンを取得します.
	 * @param dto 帳票ワークスペースDTOとその子クラスのDTO
	 * @return アイコンクラス
	 */
	protected getIcon(dto: any): string {
		return 'fa-fw fa-lg eim-icon-form-workspace eim-icon-form-workspace-color';
	}

	/**
	 * メニューアイテムリストから名前を元に対象アイテムを取得します.
	 * @param menuItems 対象メニューアイテムリスト
	 * @param name 選択対象メニュー名称
	 * @return 選択対象メニューアイテム
	 */
	protected getMenuItem(menuItems: EIMMenuItem[], name: string): EIMMenuItem {
		for (let i = 0; i < menuItems.length; i++) {
			if (menuItems[i].name === name) {
				return menuItems[i];
			}
		}
		return null;
	}


	/**
	 * ワークフローステータス/イベントの名前の入力有無をチェックする。
	 * @return チェック結果
	 */
	protected checkWorkflowName(): boolean {
		let workflow: EIMWorkflowDomain = this.workflowDiagram.getWorkflow();
		if (workflow === null) {
			return false;
		}
		// ステータスリストに対して、名前有無をチェックする。
		for (let i = 0; i < workflow.statusTypeList.length; i++) {
			let statusType = workflow.statusTypeList[i];
			let nameList = statusType.nameList;
			let keys = Object.keys(nameList);
			for (let m = 0; m < keys.length; m++) {
				let key = keys[m];
				if (nameList[key] === '') {
					return false;
				}
			}
			return true;
		}

		// ステータスリストに対して、名前有無をチェックする。
		for (let i = 0; i < workflow.eventTypeList.length; i++) {
			let eventType = workflow.eventTypeList[i];
			let nameList = eventType.nameList;
			let keys = Object.keys(nameList);
			for (let m = 0; m < keys.length; m++) {
				let key = keys[m];
				if (nameList[key] === '') {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * ワークフローステータス/イベントの名前の入力有無をチェックする。
	 * @return チェック結果
	 */
	protected checkStatusNameDuplication(): string {
		let workflow: EIMWorkflowDomain = this.workflowDiagram.getWorkflow();

		let buff: any[] = [];
		// ステータスリストに対して、名前有無をチェックする。
		for (let i = 0; i < workflow.statusTypeList.length; i++) {
			let statusType = workflow.statusTypeList[i];
			let nameList = statusType.nameList;
			for (let n = 0; n < buff.length; n++) {
				if (nameList[EIMAdminsConstantService.MAIN_LANGUAGE_CODE] === buff[n]) {
					return nameList[EIMAdminsConstantService.MAIN_LANGUAGE_CODE];
				}
			}
			buff.push(nameList[EIMAdminsConstantService.MAIN_LANGUAGE_CODE]);
		}

		return null;
	}

	/**
	 * ワークフローステータス/イベントの名前の入力有無をチェックする。
	 * @return チェック結果
	 */
	protected checkEventNameDuplication(): any {
		let workflow: EIMWorkflowDomain = this.workflowDiagram.getWorkflow();

		let buff: any[] = [];
		let eventName: string;
		let fromStatusName: string;
		let toStatusName: string;

		// ステータスリストに対して、名前有無をチェックする。
		for (let i = 0; i < workflow.eventTypeList.length; i++) {
			let eventType = workflow.eventTypeList[i];
			let nameList = eventType.nameList;
			for (let n = 0; n < buff.length; n++) {
				if (nameList[EIMAdminsConstantService.MAIN_LANGUAGE_CODE] === buff[n].name && eventType.fromStatusTypeId === buff[n].fromStatusTypeId && eventType.toStatusTypeId === buff[n].toStatusTypeId) {
					for (let j = 0; j < workflow.statusTypeList.length; j++) {
						if (Number(buff[n].fromStatusTypeId) === Number(workflow.statusTypeList[j].id)) {
							fromStatusName = workflow.statusTypeList[j].name;
						}
						if (Number(buff[n].toStatusTypeId) === Number(workflow.statusTypeList[j].id)) {
							toStatusName = workflow.statusTypeList[j].name;
						}

					}
					return {
						value1: fromStatusName,
						value2: toStatusName,
						value3: nameList[EIMAdminsConstantService.MAIN_LANGUAGE_CODE],
					}
				}
			}
			buff.push({
				name: nameList[EIMAdminsConstantService.MAIN_LANGUAGE_CODE],
				fromStatusTypeId: eventType.fromStatusTypeId,
				toStatusTypeId: eventType.toStatusTypeId
			});
		}
		return null;
	}

	/**
	 * 名前を更新する。
	 */
	protected refreshWorkflowName(): void {
		// ステータスリストに対して、名前有無をチェックする。
		if (this.selectedStatusType) {
			this.selectedStatusType.name = this.selectedStatusType.nameList[this.localStorageService.getLangId()];
		}
		if (this.selectedEventType) {
			this.selectedEventType.name = this.selectedEventType.nameList[this.localStorageService.getLangId()];
		}
	}

	/**
	 * 配列をソートします.
	 * @param ary 対象配列
	 * @param key ソートキー
	 * @param order ソート順（desc：降順、その他：昇順）
	 */
	protected sort(ary, key, order): void {
		let reverse = 1;
		if (order && order.toLowerCase() === 'desc') {
			reverse = -1;
		}
		ary.sort(function (a, b) {
			if (a[key] < b[key]) {
				return -1 * reverse;
			} else if (a[key] === b[key]) {
				return 0;
			} else {
				return 1 * reverse;
			}
		});
	}

	/**
	 * オブジェクトを複製します.
	 * @param obj 元オブジェクト
	 * @return 複製したオブジェクト
	 */
	protected clone(obj) {
		if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj) {
			return obj;
		}
		let temp: any;
		if (obj instanceof Date) {
			temp = new Date(obj);
		} else {
			temp = obj.constructor();
		}

		for (let key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				obj['isActiveClone'] = null;
				temp[key] = this.clone(obj[key]);
				delete obj['isActiveClone'];
			}
		}

		return temp;
	}

	/**
	 * ワークフローメニューの活性初期化処理
	 */
	protected disableWorkflowMenuItems(): void {
		// ワークフロー更新・流用作成・リビジョンアップ・削除ボタン非活性にします。
		this.getMenuItem(this.workflowTreeMenuItems, 'updateSubMenu').disabled = true;
		this.getMenuItem(this.workflowContentsMenuItems, 'updateWorkflow').disabled = true;
		this.getMenuItem(this.workflowContentsMenuItems, 'copyWorkflow').disabled = true;
		this.getMenuItem(this.workflowContentsMenuItems, 'revisionupWorkflow').disabled = true;
		this.getMenuItem(this.workflowContentsMenuItems, 'deleteWorkflow').disabled = true;

	}

	/**
	 * ワークフローメニューの活性初期化処理
	 * @param node 選択されたノード
	 */
	protected setWorkflowMenuItems(node: EIMTreeDataGridNode): void {
		// ワークフロー更新・流用作成・リビジョンアップ・削除ボタン活性にします。
		this.getMenuItem(this.workflowTreeMenuItems, 'updateSubMenu').disabled = false;
		this.getMenuItem(this.workflowContentsMenuItems, 'updateWorkflow').disabled = false;
		this.getMenuItem(this.workflowContentsMenuItems, 'copyWorkflow').disabled = false;

		if (node.parent) {
			this.getMenuItem(this.workflowContentsMenuItems, 'revisionupWorkflow').disabled = true;
		} else {
			this.getMenuItem(this.workflowContentsMenuItems, 'revisionupWorkflow').disabled = false;
		}
		this.getMenuItem(this.workflowContentsMenuItems, 'deleteWorkflow').disabled = false;

		// 属性データのメニュー設定
		if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getSelectedData() && this.attributeTypeDataGrid.getSelectedData().length > 0) {
			this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = false;
		} else {
			this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = true;
		}

		// アサイン先エントリーデータのメニュー設定
		if (this.assignDataGrid && this.assignDataGrid.getSelectedData() && this.assignDataGrid.getSelectedData().length > 0) {
			this.getMenuItem(this.assignDataGridMenuItems, 'deleteAssign').disabled = false;
		} else {
			this.getMenuItem(this.assignDataGridMenuItems, 'deleteAssign').disabled = true;
		}

		// メール種別一覧データのメニュー設定
		if (this.mailTypeDataGrid && this.mailTypeDataGrid.getSelectedData() && this.mailTypeDataGrid.getSelectedData().length > 0) {
			this.getMenuItem(this.mailKindDataGridMenuItems, 'deleteMailKind').disabled = false;
		} else {
			this.getMenuItem(this.mailKindDataGridMenuItems, 'deleteMailKind').disabled = true;
		}
	}

}
