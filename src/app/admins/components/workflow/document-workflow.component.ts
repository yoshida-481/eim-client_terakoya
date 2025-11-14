import { Component, forwardRef, ViewChild, OnInit, OnChanges, AfterViewInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMTreeDataGridNode } from 'app/shared/components/tree-data-grid/tree-data-grid.component.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMStatusTypeDomain } from 'app/admins/shared/domains/status-type.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMEventTypeDomain } from 'app/admins/shared/domains/event-type.domain';
import { EIMSplitStateService } from 'app/shared/services/split-state.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMWorkflowComponent } from 'app/admins/components/workflow/workflow.component';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMWorkflowUneditMailMethodListComponent } from 'app/admins/shared/components/renderer/workflow-unedit-mail-method-list-renderer.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMEntryTypeRendererComponent } from 'app/admins/shared/components/renderer/entry-type-renderer.component';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMWorkflowDTO } from 'app/admins/shared/dtos/workflow.dto';
import { EIMTreeDataGridColumn, EIMTreeDataGridComponent } from 'app/shared/components/tree-data-grid/tree-data-grid.component';
import { EIMWorkflowMailMethodListComponentService } from 'app/admins/shared/components/renderer/workflow-mail-method-list-renderer.component.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';
import { TabsModule } from 'primeng/tabs';
import { EIMCheckBoxComponent } from 'app/shared/components/checkbox/checkbox.component';
import { SelectModule } from 'primeng/select';

/**
 * ワークフロー（ドキュメント）コンポーネント
 * @example
 *
 *      <eim-document-workflow>
 *      </eim-document-workflow>
 */
@Component({
    selector: 'eim-document-workflow',
    templateUrl: './document-workflow.component.html',
    styleUrls: ['./workflow.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe, 
		ButtonDirective,

		AngularSplitModule,
		PanelModule,
		TabsModule,
		InputTextModule,
		EIMRadioButtonComponent,
		EIMCheckBoxComponent
	],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentWorkflowComponent) }
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMDocumentWorkflowComponent extends EIMWorkflowComponent implements OnInit, OnChanges, AfterViewInit {

	/** ワークフローツリーのメニュー */
	// ステータス/イベント更新メニュー
	private menuItemWorkflowStatusEvent: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03037'), name: 'updateStatusEvent', icon: 'eim-icon-pencil', disabled: true,
			command: (event) => { this.onClickUpdateStatusEvent(event); }
		};

	/** ワークフローツリーのメニュー */
	public workflowTreeMenuItems: EIMMenuItem[] = [
		this.menuItemWorkflowCreate,
		{
			label: this.translateService.instant('EIM.LABEL_03035'), name: 'updateSubMenu', icon: 'eim-icon-pencil', disabled: true, items: [
				this.menuItemWorkflowUpdate,
				this.menuItemWorkflowStatusEvent,
				this.menuItemWorkflowCopy,
				this.menuItemWorkflowRevisionup,
			]
		},
		this.menuItemWorkflowDelete,
	];


	/** ワークフローのコンテキストメニュー */
	public workflowContentsMenuItems: EIMMenuItem[] = [
		this.menuItemWorkflowUpdate,
		this.menuItemWorkflowStatusEvent,
		this.menuItemWorkflowCopy,
		this.menuItemWorkflowRevisionup,
		this.menuItemSeparator,
		this.menuItemWorkflowDelete,
	];

	/**  承認中のチェックイン可否 */
	public enableApproverCheckinFlg = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		public serverConfigService: EIMServerConfigService,
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
		super(
			workflowService,
			translateService,
			localStorageService,
			splitStateService,
			adminDialogManagerComponentService,
			messageService,
			hierarchicalDomainService,
			adminsCacheService,
			checkboxRendererComponentService,
			changeDetectorRef,
			entryService
		);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 登録ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickCreateWorkflow(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showDocumentWorkflowCreator(
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
	 * 初期処理のイベントハンドラ
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
						if (guardList && guardList.length > 0) {
							for (let i = 0; i < guardList.length; i++) {
								let guard = guardList[i];
								this.guardList.push({
									label: guard.attr.name,
									value: guard.attr.id
								});
							}
						}

						// ベースイベントタイプリスト取得
						let baseEventTypeList = this.confList.baseEventTypeList.baseEventType;
						this.baseEventTypeList = [];
						if (baseEventTypeList && baseEventTypeList.length > 0) {
							for (let i = 0; i < baseEventTypeList.length; i++) {
								let bEvent = baseEventTypeList[i];
								this.baseEventTypeList.push({
									label: bEvent.attr.name,
									value: Number(bEvent.attr.id)
								});
							}
						}

						// ステータスタイプ種別リスト取得
						let statusTypeKindList = this.confList.statusTypeKindList.statusTypeKind;
						this.statusTypeKindList = [];
						if (statusTypeKindList && statusTypeKindList.length > 0) {
							for (let i = 0; i < statusTypeKindList.length; i++) {
								let st = statusTypeKindList[i];
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
			columns.push({ field: 'revision', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02302'), width: 40, cellStyle: { 'text-align': 'right' } });
			// 更新日時
			columns.push({ field: 'modifyDateTimeString', headerName: this.translateService.instant('EIM.LABEL_02033'), width: 160 });

			this.workflowTreeDataGrid.setColumns(columns);

			this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').visible = false;
			this.enableApproverCheckinFlg = this.serverConfigService.enableApproverCheckinFlg;
			let columns2: EIMDataGridColumn[] = [];
			// メール種別
			columns2.push({ field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02112'), width: 260, suppressFilter: true });
			// 送信方法
			columns2.push({ field: 'method', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02113'), width: 255, suppressFilter: true, cellRendererFramework: EIMWorkflowUneditMailMethodListComponent });
			this.mailTypeDataGrid.setColumns(columns2);
			this.mailTypeDataGrid.multiple = false;

			// アサイン先エントリー
			columns2 = [];
			// タイプ
			columns2.push({ field: 'entryType', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 180, cellRendererFramework: EIMEntryTypeRendererComponent, suppressFilter: true });
			// 名前
			columns2.push({ field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 330, suppressFilter: true });
			this.assignDataGrid.setColumns(columns2);

		});
	}

	/**
	 * 更新ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickUpdateWorkflow(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showDocumentWorkflowUpdator(
			this.selectedWorkflow,
			{
				updated: (workflow: EIMWorkflowDomain) => {
					// ワークフロー更新（ドキュメント）画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);
					this.completed(workflow, this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
				},
				errored: () => {
					this.adminDialogManagerComponentService.close(dialogId);
				}
			}
		);
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
			userDefGroup: false,
			objectRole: false,
		}

		let dialogId: string = this.adminDialogManagerComponentService.showEntrySelector(
			null,
			entryList,
			selectTarget,
			null,
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
	 * ステータス/イベント更新ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickUpdateStatusEvent(event: any): void {

		this.workflowService.checkStatusExist(this.selectedWorkflow.id)
			.subscribe((res: any) => {
				if (res[0].attr.notDocument === 'true') {
					// ドキュメントの確認
					this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.CONFIRM_00023'));
					return;
				} else if (res[0].attr.exist === 'true') {
					// 既に使用されている場合変更不可
					this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00023'));
					return;
				} else {
					let dialogId: string = this.adminDialogManagerComponentService.showWorkflowStatusEventUpdator(
						this.selectedWorkflow,
						{
							updated: (workflow: EIMWorkflowDomain) => {
								// ステータス/イベント更新画面をクローズ
								this.adminDialogManagerComponentService.close(dialogId);
								this.completed(workflow, this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
							},
							errored: () => {
								this.adminDialogManagerComponentService.close(dialogId);
							}
						}
					);
				}
			}, (err: any) => {
				// エラーの場合
				return;
			});
	}

	/**
	 * 流用作成ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickCopyWorkflow(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showDocumentWorkflowCopyExecutor(
			this.selectedWorkflow,
			{
				created: (workflow: EIMWorkflowDomain) => {
					// 流用作成（ドキュメント）画面をクローズ
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
		let selectedData = this.workflowTreeDataGrid.getSelectedData()[0].data;
		let dialogId: string = this.adminDialogManagerComponentService.showDocumentWorkflowRevisionUpCreator(
			this.selectedWorkflow,
			this.isRevisionUpRegist,
			{
				created: (workflow: EIMWorkflowDomain) => {
					// ワークフロー登録（ドキュメント）画面をクローズ
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
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * フォーマットコンテンツメニューアイテムの活性非活性制御を行う
	 */
	onContextMenuWorkflow(event: any): void {
		window.setTimeout(() => {
			// 選択したワークフロー取得
			let selectedList = this.workflowTreeDataGrid.getSelectedData();
			if (selectedList && selectedList.length === 1) {
				this.selectTreeNode(selectedList[0]);

			} else {
				// ワークフローメニュー活性初期化処理
				this.disableWorkflowMenuItems();
			}
		});
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
							this.workflowService.workflowRegistForDocument(this.workflowDiagram.getWorkflow())
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
	 * 削除ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickDeleteWorkflow(event: any): void {
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00024'),
			() => {
				this.workflowService.deleteForDocument(this.selectedWorkflow.id)
					.subscribe(() => {
						let selectedNode: EIMTreeNode = this.workflowTreeDataGrid.getSelectedData()[0];
						let parent: EIMTreeNode = selectedNode.parent;
						let workflow: EIMWorkflowDomain = null;
						if (parent) {
							workflow = new EIMWorkflowDomain();
							workflow.id = parent.data.id;
						}
						this.completed(workflow, this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
						this.statusSelected = false;
						this.eventSelected = false;
						this.workflowDiagram.setData([]);
						this.workflowDiagram.workflowClear();
					}, (err: any) => {
						// エラーの場合
						return;
					});
			});
	}

	/**
	 * ダイアグラムのノード、エッジ選択時の詳細処理
	 */
	changeDiagramDetail(): void {
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
				if (Number(this.selectedStatusType.kind) === EIMAdminsConstantService.STATUS_TYPE_KIND_ID_APPROVAL_REQUEST
					|| Number(this.selectedStatusType.kind) === EIMAdminsConstantService.STATUS_TYPE__KIND_ID_DEFAULT
					|| Number(this.selectedStatusType.kind) === EIMAdminsConstantService.STATUS_TYPE__KIND_ID_FORM_DEFAULT) {
					this.getMenuItem(this.assignDataGridMenuItems, 'selectAssign').disabled = false;
				} else {
					this.getMenuItem(this.assignDataGridMenuItems, 'selectAssign').disabled = true;
				}

				this.assignDataGrid.setData(this.selectedStatusType.asEntryList);

				// イベント優先設定データの設定
				let baseEventTypeList = this.confList.baseEventTypeList.baseEventType;
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
										id: baseEvent.attr.id,
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
										data: Object.assign({
											icon: 'fa-lg fa-arrow-circle-right',
										}, eventList[i]),
										leaf: true,
										seq: eventList[i].sequence,
									};
									children.push(childNode);
								}
							}
							this.sort(children, 'seq', 'ASC');
							this.hierarchicalDomainService.setChildren(parentNode, children);
							parentNode.expanded = true;
							eventTreeNodeList.push(parentNode);
						}
					}
				}

				this.getMenuItem(this.eventSortDataGridMenuItems, 'eventSort').disabled = true;
				for (let n = 0; n < eventTreeNodeList.length; n++) {
					let evt = eventTreeNodeList[n];
					if (evt.children.length > 1) {
						this.getMenuItem(this.eventSortDataGridMenuItems, 'eventSort').disabled = false;
					}
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

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ツリーノード選択時の処理
	 * @param selectedData 選択されたノードリスト
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
			this.workflowDiagram.setData([]);
			this.workflowDiagram.workflowClear();
		}

		if (!doGetWorkflow) {
			return;
		}

		this.workflowService.getWorkFlowDefByIdForDocument(node.data.id)
			.subscribe((workflow: EIMWorkflowDomain) => {
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
	 * ワークフローメニューの活性初期化処理
	 */
	protected disableWorkflowMenuItems(): void {
		// ワークフロー更新・流用作成・リビジョンアップ・削除ボタン非活性にします。
		super.disableWorkflowMenuItems();
		// ワークフローステータス/イベント非活性にします。
		this.getMenuItem(this.workflowContentsMenuItems, 'updateStatusEvent').disabled = true;
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
		// ワークフローステータス/イベント活性にします。
		if (this.selectedWorkflow.defBossApproval === 'unnecessary') {
			this.getMenuItem(this.workflowContentsMenuItems, 'updateStatusEvent').disabled = true;
		} else {
			this.getMenuItem(this.workflowContentsMenuItems, 'updateStatusEvent').disabled = false;
		}
	}

}
