import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMTreeDataGridNode } from 'app/shared/components/tree-data-grid/tree-data-grid.component.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMSplitStateService } from 'app/shared/services/split-state.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMWorkflowComponent } from './workflow.component';
import { EIMDuplicationRendererComponent } from 'app/admins/shared/components/renderer/duplication-renderer.component';
import { EIMCheckEssentialRendererComponent } from 'app/admins/shared/components/renderer/check-essential-renderer.component';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMStatusTypeDomain } from 'app/admins/shared/domains/status-type.domain';
import { EIMEventTypeDomain } from 'app/admins/shared/domains/event-type.domain';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { EIMTreeDataGridColumn, EIMTreeDataGridComponent } from 'app/shared/components/tree-data-grid/tree-data-grid.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMWorkflowMailMethodListComponent } from 'app/admins/shared/components/renderer/workflow-mail-method-list-renderer.component';
import { EIMEntryTypeRendererComponent } from 'app/admins/shared/components/renderer/entry-type-renderer.component';
import { EIMWorkflowMailMethodListComponentService } from 'app/admins/shared/components/renderer/workflow-mail-method-list-renderer.component.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';
import { SelectModule } from 'primeng/select';

/**
 * ワークフロー（帳票）コンポーネント
 * @example
 *
 *      <eim-form-workflow>
 *      </eim-form-workflow>
 */
@Component({
    selector: 'eim-form-workflow',
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
		SelectModule,
		InputTextModule,
		EIMRadioButtonComponent
	],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormWorkflowComponent) }
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMFormWorkflowComponent extends EIMWorkflowComponent implements AfterViewInit {

	/** ネームスペース */
	protected readonly namespace = EIMAdminsConstantService.NAMESPACE_FORM_USER;

	/** 属性タイプのメニュー */
	public attributeTypeDataGridMenuItems: EIMMenuItem[] = [
		this.menuItemAttributeTypeApply,
		this.menuItemAttributeTypeChangeSort,
		this.menuItemAttributeTypeDelete,
		this.menuItemAttributeTypeCope
	];

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
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngAfterViewInit(): void {
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
			columns.push({ field: 'revision', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02302'), width: 40, cellStyle: { 'text-align': 'right' } });
			// 更新日時
			columns.push({ field: 'modifyDateTimeString', headerName: this.translateService.instant('EIM.LABEL_02033'), width: 160 });

			this.workflowTreeDataGrid.setColumns(columns);

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
	 * 更新ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickUpdateWorkflow(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showFormWorkflowUpdator(
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
		let dialogId: string = this.adminDialogManagerComponentService.showFormWorkflowCopyExecutor(
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
	 * 削除ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickDeleteWorkflow(event: any): void {
		this.messageService.show(
			EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00024'),
			() => {
				this.workflowService.deleteForDocument(this.selectedWorkflow.id)
					.subscribe((data: any) => {
						let selectedNode: EIMTreeNode = this.workflowTreeDataGrid.getSelectedData()[0];
						let parent: EIMTreeNode = selectedNode.parent;
						let workflow: EIMWorkflowDomain = null;
						if (parent) {
							workflow = new EIMWorkflowDomain();
							workflow.id = parent.data.id;
						}
						this.completed(workflow, this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
						this.selectTreeNode(null, false);
					}, (err: any) => {
						// エラーの場合
						return;
					});
			});
	}

	/**
	 * 登録ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickCreateWorkflow(event: any): void {

		let dialogId: string = this.adminDialogManagerComponentService.showFormWorkflowCreator(
			this.namespace,
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

				// アサインエントリー選択メニュー活性にする
				this.getMenuItem(this.assignDataGridMenuItems, 'selectAssign').disabled = false;
				// イベント優先度並べメニューの非活性にする
				this.getMenuItem(this.eventSortDataGridMenuItems, 'eventSort').disabled = true;

				// アサインエントリーデータの設定
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
				this.eventTreeDataGrid.setData(eventTreeNodeList);

				this.getMenuItem(this.eventSortDataGridMenuItems, 'eventSort').disabled = true;
				for (let n = 0; n < eventTreeNodeList.length; n++) {
					let evt = eventTreeNodeList[n];
					if (evt.children.length > 1) {
						this.getMenuItem(this.eventSortDataGridMenuItems, 'eventSort').disabled = false;
					}
				}

				this.setAttributeTypeDataGrid(Number(selected.id));
				this.attributeTypeDataGrid?.setScrollTop(2);
				this.attributeTypeDataGrid?.setData(this.selectedStatusType.attTypeList);
				this.attributeTypeDataGrid?.refreshView();
				if (Number(selected.id) === 1) {
					// 属性データの設定
					if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getData() && this.attributeTypeDataGrid.getData().length > 0) {
						this.getMenuItem(this.attributeTypeDataGridMenuItems, 'copyAttr').disabled = false;
					} else {
						this.getMenuItem(this.attributeTypeDataGridMenuItems, 'copyAttr').disabled = true;
					}
				} else {
					this.getMenuItem(this.attributeTypeDataGridMenuItems, 'copyAttr').disabled = true;
				}
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
		};

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
			if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getData() && this.attributeTypeDataGrid.getData().length > 0) {
				this.getMenuItem(this.attributeTypeDataGridMenuItems, 'copyAttr').disabled = false;
			} else {
				this.getMenuItem(this.attributeTypeDataGridMenuItems, 'copyAttr').disabled = true;
			}

			if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getData() && this.attributeTypeDataGrid.getData().length > 1) {
				this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').disabled = false;
			} else {
				this.getMenuItem(this.attributeTypeDataGridMenuItems, 'sortAttr').disabled = true;
			}

		}
	}

	/**
	 * 属性選択ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickAttributeTypeApply(event: any): void {
		let callerId = EIMAdminsConstantService.APP_ID_GENERAL;
		callerId = EIMAdminsConstantService.APP_ID_FORM;
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
					let selectedList: any[] = this.workflowDiagram.getSelectedData();
					let selected = selectedList[0];	// 単数選択の前提
					if (Number(selected.id) === 1 && this.attributeTypeDataGrid && this.attributeTypeDataGrid.getData() && this.attributeTypeDataGrid.getData().length > 0) {
						this.getMenuItem(this.attributeTypeDataGridMenuItems, 'copyAttr').disabled = false;
					} else {
						this.getMenuItem(this.attributeTypeDataGridMenuItems, 'copyAttr').disabled = true;
					}
					this.getMenuItem(this.attributeTypeDataGridMenuItems, 'deleteAttr').disabled = true;
				}
			}
		);
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
	 * リビジョンアップボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickRevisionUpWorkflow(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showFormWorkflowRevisionUpCreator(
			this.selectedWorkflow,
			this.isRevisionUpRegist,
			{
				created: (workflow: EIMWorkflowDomain) => {
					// ワークフロー登録（帳票）画面をクローズ
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

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 属性を設定する。
	 * @param no 設定属性の番目
	 */
	protected setAttributeTypeDataGrid(no: number): void {

		if (!this.attributeTypeDataGrid) {
			return;
		}
		// 属性データの設定
		window.setTimeout(() => {
			if (no === 1) {
				let columns: EIMDataGridColumn[] = [];
				columns = [];
				// 複製
				columns.push({ field: 'newCopyFlag', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02009'), width: 60, cellRendererFramework: EIMDuplicationRendererComponent, suppressFilter: true });
				// 定義名称
				columns.push({ field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 150, suppressFilter: true });
				// 名前
				columns.push({ field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), cellRendererFramework: EIMAdminNameRendererComponent, suppressFilter: true });
				// データ型
				columns.push({ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 80, suppressFilter: true });
				// 複数値
				columns.push({ field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 90, suppressFilter: true });
				// UIコントロール
				columns.push({ field: 'uiControlName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02243'), width: 120, suppressFilter: true });
				// 必須項目
				columns.push({ field: 'attTypeEssential', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02244'), width: 100, cellRendererFramework: EIMCheckEssentialRendererComponent, suppressFilter: true });
				// コードタイプ
				columns.push({ field: 'codeTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02007'), width: 110, suppressFilter: true });
				// デフォルト値
				columns.push({ field: 'initValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 110, cellRendererFramework: EIMDefaultListRendererComponent, suppressFilter: true });
				this.attributeTypeDataGrid.setColumns(columns);
			} else {
				let columns: EIMDataGridColumn[] = [];
				columns = [];
				// 定義名称
				columns.push({ field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 220, suppressFilter: true });
				// 名前
				columns.push({ field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), cellRendererFramework: EIMAdminNameRendererComponent, suppressFilter: true });
				// データ型
				columns.push({ field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 80, suppressFilter: true });
				// 複数値
				columns.push({ field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 90, suppressFilter: true });
				// UIコントロール
				columns.push({ field: 'uiControlName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02243'), width: 120, suppressFilter: true });
				// 必須項目
				columns.push({ field: 'attTypeEssential', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02244'), width: 100, cellRendererFramework: EIMCheckEssentialRendererComponent, suppressFilter: true });
				// コードタイプ
				columns.push({ field: 'codeTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02007'), width: 110, suppressFilter: true });
				// デフォルト値
				columns.push({ field: 'initValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 110, cellRendererFramework: EIMDefaultListRendererComponent, suppressFilter: true });
				this.attributeTypeDataGrid.setColumns(columns);
			}
		});
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
		if (this.attributeTypeDataGrid && this.attributeTypeDataGrid.getData() && this.attributeTypeDataGrid.getData().length > 0) {
			this.getMenuItem(this.attributeTypeDataGridMenuItems, 'copyAttr').disabled = false;
		} else {
			this.getMenuItem(this.attributeTypeDataGridMenuItems, 'copyAttr').disabled = true;
		}
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
