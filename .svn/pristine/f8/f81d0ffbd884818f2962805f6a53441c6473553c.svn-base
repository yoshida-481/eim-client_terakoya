import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, forwardRef, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { MenuItem, SelectItem } from 'primeng/api';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMObjectAPIService, EIMObjectAPIServiceDeleteParam, EIMObjectAPIServiceGetListParam } from 'app/shared/services/apis/object-api.service';
import { EIMSimpleSearchObjectCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-object-criteria.builder';
import { EIMSimpleSearchConditionCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-condition.criteria';
import { EIMSearchOperatorEnum } from 'app/shared/domains/search/search-operator-enum';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent, EIMTreeTreeNode } from 'app/shared/components/tree/tree.component';
import { EIMTaskIconClassFunctionService } from 'app/tasks/services/task-icon-class-function.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMProjectUpdatorComponent } from '../project-updator/project-updator.component';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMResponsibleObjectRoleInputFormItemComponentService } from '../responsible-object-role-input-form-item/responsible-object-role-input-form-item.component.service';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTaskObjectRoleEntryInputFormItemComponentService } from '../task-object-role-entry-input-form-item/task-object-role-entry-input-form-item.component.service';
import { EIMMembersService } from 'app/shared/services/apis/members.service';
import { EIMTaskMainComponent } from 'app/tasks/tasks.component';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMSearchLogicalOperatorEnum } from 'app/shared/domains/search/search-logical-operator-enum';
import { EIMProjectMemberApplierComponent } from '../project-member-applier/project-member-applier.component';
import { EIMSimpleSearchObjectResultAttributeType } from 'app/shared/builders/simple-search/simple-search-result-attribute-type';
import { EIMJsonToListFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-list-format-result-dto-converter.service';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMTaskService } from 'app/tasks/services/apis/task.service';
import { EIMProgressBarRendererComponent } from 'app/shared/components/renderer/progress-bar-renderer.component';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMUpdatedProjectDTO } from 'app/tasks/tasks.interface';
import { EIMTasksModule } from 'app/tasks/tasks.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';

/**
 * プロジェクト管理コンポーネント
 * @example
 *
 *      <eim-project-manager
 *      >
 *      </eim-project-manager>
 */
@Component({
	selector: 'eim-project-manager',
	templateUrl: './project-manager.component.html',
	styleUrls: ['./project-manager.component.scss'],
	imports: [
		CommonModule,
		EIMTasksModule,
		EIMSharedModule,
		TranslatePipe, 
		AngularSplitModule,
		PanelModule,
		TabsModule,
	],
	providers: [ 
		{provide: EIMComponent, useExisting: forwardRef(() => EIMProjectManagerComponent)},
		TranslateService,
	 ],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMProjectManagerComponent implements EIMTaskMainComponent {

	/** プロジェクトツリー */
	@ViewChild('projectTree', { static: true }) projectTree: EIMTreeComponent;

	/** プロジェクトフォーム */
	@ViewChild('projectUpdator', { static: true }) projectUpdator: EIMProjectUpdatorComponent;

	/** 遅延タスク情報データグリッド */
	@ViewChild('delayedTaskListDataGrid', { static: true })
	delayedTaskListDataGrid: EIMDataGridComponent;

	/** 本日完了予定タスク情報データグリッド */
	@ViewChild('todayCompletePlanTaskListDataGrid', { static: true })
	todayCompletePlanTaskListDataGrid: EIMDataGridComponent;
	
	/** 対応予定期間内タスク情報データグリッド */
	@ViewChild('scheduledScopeTaskListDataGrid', { static: true })
	scheduledScopeTaskListDataGrid: EIMDataGridComponent;

	/** メンバフォーム */
	@ViewChild('memberForm', { static: true }) memberForm: EIMFormComponent;

	/** メンバデータグリッド */
	@ViewChild('memberDataGrid', { static: true }) memberDataGrid: EIMDataGridComponent;

	/** プロジェクトメンバー適用コンポーネント */
	@ViewChild('projectMemberApplier', { static: true }) projectMemberApplier: EIMProjectMemberApplierComponent;

	/** 画面識別ID */
	public viewId = 'projectManager'

	/** 表示タブのインデックス */
	public tabIndex = signal(0);

	/** 表示中のダイアログ名 */
	public viewDialogName = null;

	/** 選択中のプロジェクトID */
	public selectedProjectId: number = null;

	/** プロジェクト詳細が編集モードか否か */
	public isProjectEditMode = false;

	/** メンバ一覧が編集モードか否か */
	public isMemberEditMode = false;

	/** メンバ編集モード時に選択した役割リスト */
	public selectedObjectRoleSelectItems: SelectItem[] = [];

	/** メンバ編集モード時に選択したエントリリスト */
	public selectedEntryElementSelectItems: SelectItem[] = [];

	/** タブの活性・非活性フラグ */
	public tabDisabled: boolean = false;

	public taskId: any;
	
	public parent: EIMSimpleObjectDTO;

	/* ==========================================================================
     メニューの定義
     ========================================================================== */
	/** プロジェクトメニュー */
	/** 絞込み */
	public menuFilter: EIMMenuItem = {
		// label: '', rKey: 'EIM_TASKS.LABEL_03017', name: 'filterProject', icon: 'eim-icon-filter', visible: true,
		label: '', rKey: '絞込み（使用不可）', name: 'filterProject', icon: 'eim-icon-filter', visible: true,
		command: (event) => {}};

	// プロジェクト登録
	public menuCreateProject: EIMMenuItem = {
			label: '', rKey: 'EIM_TASKS.LABEL_03001', name: 'createProject', icon: 'eim-icon-plus',
			command: (event) => {this.viewDialogName = 'projectCreator';}};
	// プロジェクト削除
	public menuStartProject: EIMMenuItem = {
			// label: '', rKey: 'EIM.LABEL_03003', name: 'deleteProject', icon: 'eim-icon-trash',
			label: '', rKey: 'EIM.LABEL_03003', name: 'deleteProject', icon: 'eim-icon-trash',disabled:true,
			command: (event) => {this.onClickDeleteProject()}};
	// プロジェクト完了
	public menuCompleteProject: EIMMenuItem = {
			// label: '', rKey: 'EIM_TASKS.LABEL_03003', name: 'completeProject', icon: 'eim-icon-file',
			label: '', rKey: '完了（使用不可）', name: 'completeProject', icon: 'eim-icon-file',disabled:true,
			command: (event) => {}};
	// プロジェクト中止
	public menuCancelProject: EIMMenuItem = {
			// label: '', rKey: 'EIM_TASKS.LABEL_03004', name: 'cancelProject', icon: 'eim-icon-file',
			label: '', rKey: '中止（使用不可）', name: 'cancelProject', icon: 'eim-icon-file',disabled:true,
			command: (event) => {}};
	// セパレータ
	public menuSeparator: MenuItem = {separator: true};

	/** プロジェクトリストコンテキストメニュー */
	public projectsMenuItems: EIMMenuItem[] = [
		// 絞込み
		this.menuFilter,
		// プロジェクト
		{
			label: '', rKey: 'EIM_TASKS.LABEL_03007', name: 'project', icon: 'fa eim-icon-project', items: [
				Object.assign({}, this.menuCreateProject),
				Object.assign({}, this.menuStartProject),
				Object.assign({}, this.menuCancelProject),
				Object.assign({}, this.menuCompleteProject),
			]
		}
	];

	/** 編集 */
	public menuEdit: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03014', name: 'createTask', icon: 'fa fa-pencil', visible: true,
		command: (event) => {this.setProjectEditMode(true);}, disabled: true};

	/** キャンセル */
	public menuCancel: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03015', name: 'createTask', icon: 'fa fa-remove', visible: false,
		command: (event) => {this.setProjectEditMode(false);}};

	/** 保存 */
	public menuSave: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03016', name: 'createTask', icon: 'fa fa-check', visible: false,
		command: (event) => {this.onClickProjectSave();}};

	/** 編集 */
	public menuEditMember: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03014', name: 'createTask', icon: 'fa fa-pencil', visible: true,
		command: (event) => {this.setMemberEditMode(true);}, disabled: true};

	/** キャンセル */
	public menuCancelMember: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03015', name: 'createTask', icon: 'fa fa-remove', visible: false,
		command: (event) => {this.setMemberEditMode(false);}};

	/** 保存 */
	public menuSaveMember: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03016', name: 'createTask', icon: 'fa fa-check', visible: false,
		command: (event) => {this.onClickMemberSave();}};

	/** プロジェクト詳細メニュー */
	public projectFormMenuItems: EIMMenuItem[] = [
		// 編集
		this.menuEdit,
		// 保存
		this.menuSave,
		// キャンセル
		this.menuCancel,
	];

	/** メンバー一覧メニュー */
	public memberFormMenuItems: EIMMenuItem[] = [
		// 編集
		this.menuEditMember,
		// 保存
		this.menuSaveMember,
		// キャンセル
		this.menuCancelMember,
	];



	/** コンテンツツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
		// 削除
		{label: '削除', rKey: 'EIM.LABEL_03003', name: 'deleteProject', icon: 'eim-icon-trash', command: (event) => {this.onClickDeleteProject()}},
		// 中止
		{label: '中止', rKey: '中止（使用不可）', name: 'cancelProject', icon: 'eim-icon-file', command: (event) => {}},
		// 完了
		{label: '完了', rKey: '完了（使用不可）', name: 'completeProject', icon: 'eim-icon-file', command: (event) => {}}
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		public treeComponentService: EIMTreeComponentService,
		protected translateService: TranslateService,
		protected objectAPIService: EIMObjectAPIService,
		protected membersService: EIMMembersService,
		protected taskIconClassFunctionService: EIMTaskIconClassFunctionService,
		protected messageService: EIMMessageService,
		protected responsibleObjectRoleInputFormItemComponentService: EIMResponsibleObjectRoleInputFormItemComponentService,
		protected taskObjectRoleEntryInputFormItemComponentService: EIMTaskObjectRoleEntryInputFormItemComponentService,
		protected jsonToListFormatResultDTOConverterService: EIMJsonToListFormatResultDTOConverterService,
		protected taskService: EIMTaskService,
		protected cacheService: EIMCacheService,
	) {
		// TranslateServiceでリソースが利用可能かどうかを判定する
		let checkKey: string = 'EIM_TASKS.LABEL_01000';
		let checkValue: string = this.translateService.instant(checkKey);
		if (checkKey !== checkValue) {
			// キーと値が一致していない場合はキーから値を取得できているので利用可能とみなす
			// メニューアイテムラベルを更新する
			this.refreshMenuItemLabel();
		}
	}

	/**
	 * TreeTreeNodeへの追加設定
	 */
	public setAdditionalPropertiesToTreeNodeFunction(treeNode: EIMTreeTreeNode, dto: EIMSimpleObjectDTO): EIMTreeTreeNode {

		const icon = this.taskIconClassFunctionService.iconClassFunction(dto);
		treeNode.expandedIcon = icon;
		treeNode.collapsedIcon = icon;

		return treeNode;
	};

	/**
	 * メニューアイテムラベルをリフレッシュします.
	 */
	public refreshMenuItemLabel(): void {
		let changeLabel: (menuItems: EIMMenuItem[]) => void = (menuItems: EIMMenuItem[]) => {
			for (let i = 0; i < menuItems.length; i++) {
				let menuItem: EIMMenuItem = menuItems[i];
				if (menuItem.hasOwnProperty('rKey')) {
					menuItem.label = this.translateService.instant(menuItem.rKey);
				}
				if (menuItem.items && menuItem.items.length > 0) {
					changeLabel(menuItem.items);
				}
			}
		};
		changeLabel(this.projectsMenuItems);
		changeLabel(this.projectFormMenuItems);
		changeLabel(this.memberFormMenuItems);
		let newMenuItems: EIMMenuItem[] = Object.assign([], this.projectsMenuItems);
		this.projectsMenuItems = newMenuItems;
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		// プロジェクトツリーの画面状態を復元
		if (state) {
			// プロジェクトツリー読み込み完了
			const treeInitialized = this.projectTree.initialized.subscribe(() => {
				treeInitialized.unsubscribe();

				// ノード選択
				const selectedData = state.projectTree.selectedData;
				if (selectedData && selectedData.length > 0) {
					this.projectTree.select(selectedData, true);
				}

				// スクロール
				const offsetTop = state.projectTree.offsetTop;
				window.setTimeout(() => {
					this.projectTree.setScrollTop(offsetTop);
				});
			});

			// タブ選択
			this.tabIndex.set(state.tabIndex);

			// 基本概要状態復帰
			this.projectUpdator.setState(state?.projectUpdator ?? null);

			// メンバー状態復帰
			this.projectMemberApplier.setState(state?.projectMemberApplier ?? null);
		}

		// プロジェクトツリー読み込み
		this.initProjectTreeData();

	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			projectTree: this.projectTree?.getState() ?? null,
			tabIndex: this.tabIndex(),
			projectUpdator: this.projectUpdator?.getState() ?? null,
			projectMemberApplier: this.projectMemberApplier?.getState() ?? null
		};
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngOnInit(): void {
		this.tabDisabled = true;
		this.setGridColumns();
	}

	/**
	 * 選択タブ変更時のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangeTab(event){
		this.tabIndex.set(event);
	}

	/**
	 * プロジェクトツリー選択時のイベントハンドラです.
	 * @param event イベント
	 */
	public onSelectTreeNode(event): void {
		let projectId = event.selectedData[0].dto.id;

		this.menuEdit.disabled = false;
		this.menuEditMember.disabled = false;

		for (const menuItem of this.projectsMenuItems[1].items) {
			// プロジェクトツリー選択時にプロジェクトメニューの活性化
			menuItem.disabled = false;
		}

		// 別のプロジェクトを選択した場合
		if (this.selectedProjectId !== projectId) {

			// selectedProjectIdが変更されることで
			// 基本概要/メンバーが各コンポーネント内で初期化される
			this.selectedProjectId = projectId;

			this.tabDisabled = false;

			// 遅延タスク情報取得
			this.taskService.getTaskListForManagement(this.selectedProjectId).subscribe((taskListDtos: any) => {
					this.delayedTaskListDataGrid.setData(taskListDtos.delayedTaskList);
					this.todayCompletePlanTaskListDataGrid.setData(taskListDtos.todayCompletePlanTaskList);
					this.scheduledScopeTaskListDataGrid.setData(taskListDtos.scheduledScopeTaskList);
			});
		}
		// 同じプロジェクトを再選択した場合
		else {

			// selectedProjectIdが変更されないため
			// 基本概要/メンバーが各コンポーネント内で初期化されない
			// 上記の理由により党コンポーネントで初期化を指示する
			const state = this.getState();

			// 基本概要状態復帰
			this.projectUpdator.setState(state?.projectUpdator ?? null);

			// メンバー状態復帰
			this.projectMemberApplier.setState(state?.projectMemberApplier ?? null);

			// 遅延タスク情報取得
			this.taskService.getTaskListForManagement(this.selectedProjectId).subscribe((taskListDtos: any) => {
				this.delayedTaskListDataGrid.setData(taskListDtos.delayedTaskList);
				this.todayCompletePlanTaskListDataGrid.setData(taskListDtos.todayCompletePlanTaskList);
				this.scheduledScopeTaskListDataGrid.setData(taskListDtos.scheduledScopeTaskList);
		});
	}
	}

	/**
	 * ダイアログクローズ時のイベントハンドラです.
	 */
	public onCloseDialog() {
		this.viewDialogName = null;
	}

	/**
	 * プロジェクト登録完了時のイベントハンドラです.
	 *
	 * @param result フォーム形式結果情報
	 */
	public onCreatedProject(result: EIMFormFormatResultDTO): void {
		
		// ダイアログクローズ
		this.viewDialogName = null;

		const treeNode: EIMTreeTreeNode = this.projectTree.convertDTOToTreeNode(result.dto);
		const rootTreeNodes: EIMTreeTreeNode[] = this.projectTree.getData() as EIMTreeTreeNode[];
		const childTreeNodeIndex = rootTreeNodes ? rootTreeNodes.length : 0;

		this.projectTree.setChildTreeNodesToIndex(null, [treeNode], childTreeNodeIndex);

		// 追加したツリーノードを選択状態にする
		this.projectTree.select([treeNode], true);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00001', {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}));

	}

	/**
	 * プロジェクトフォーム保存ボタンクリック時のイベントハンドラです.
	 */
	public onClickProjectSave(): void {

		this.projectUpdator.update();

	}

	/**
	 * プロジェクト情報取得完了時のイベントハンドラです.
	 * @param result EIMSimpleObjectDTO
	 */
	public onInitializedProject(result: EIMSimpleObjectDTO): void {
	}

	/**
	 * プロジェクト更新完了時のイベントハンドラです.
	 * @param result プロジェクト更新結果情報
	 */
	public onUpdatedProject(result: EIMUpdatedProjectDTO): void {

		this.isProjectEditMode = false;

		result.updatedDTO.exAttributeMap.baseObjTypeDefName = EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT;
		
		// ツリーノード更新
		const treeNode: EIMTreeTreeNode = this.projectTree.convertDTOToTreeNode(result.updatedDTO);
		this.projectTree.updateTreeNodes([treeNode]);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00002', {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}));
		// 編集モードの終了
		this.setProjectEditMode(false);
	}

	/**
	 * プロジェクト属性値変更時のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangedProjectAttribute(event): void {
		this.menuSave.disabled = false;
	}

	/**
	 * プロジェクト削除時のイベントハンドラです.
	 */
	public onClickDeleteProject() {
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00048' , {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}) ,
			() => {

				this.messageService.show(EIMMessageType.confirm,
					this.translateService.instant('EIM_TASKS.CONFIRM_00003') ,
					() => {
						let param: EIMObjectAPIServiceDeleteParam = {
							dto: {id: this.projectTree.getSelectedData()[0].dto.id}
						}
		
						this.objectAPIService.delete(param).subscribe((res: any) => {
							
							// プロジェクトツリーから該当ツリーノード削除
							const selectedTreeNode = this.projectTree.getTreeNodeByTreeNodeId('' + param.dto.id);
							this.projectTree.removeTreeNodes([selectedTreeNode]);
		
							this.menuEdit.disabled = true;
							this.menuEditMember.disabled = true;
							
							this.tabIndex.set(0);
							this.tabDisabled = true;

							// 完了メッセージ表示
							this.messageService.showGrowl(this.translateService.instant(
								'EIM_TASKS.INFO_00003', {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}));
						});
					}
				);
			}
		);

	}

	/**
	 * メンバ一覧初期化時のイベントハンドラです.
	 * @param event イベント
	 */
	public onInitializedMembers(event): void {

		this.menuEditMember.disabled = false;

	}

	/**
	 * メンバ一覧変更時のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangedMembers(event): void {

		this.menuSaveMember.disabled = false;

	}

	/**
	 * メンバフォーム保存ボタンクリック時のイベントハンドラです.
	 */
	public onClickMemberSave(): void {

		this.projectMemberApplier.apply();
	}

	/**
	 * メンバー一覧適用完了時のイベントハンドラです.
	 * @param event イベント
	 */
	public onAppliedMembers(event): void {

		// 編集モードの終了
		this.setMemberEditMode(false);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00001', {value: this.translateService.instant('EIM_TASKS.LABEL_02004')}));

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 各種グリッドのカラム設定を行います。
	 */
	private setGridColumns() {
		let columns: EIMDataGridColumn[] = [];

		// プロジェクト名
		// columns.push({ headerName: 'プロジェクト名', field: 'projectName', width: 220 });
		// タスク名
		columns.push({
			field: 'taskName',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_03009'),
			width: 200,
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				linkableFunction: (dto: any): boolean => { return true; },
				onClickLinkFunction: this.onClickTask.bind(this),
			}
		});
		// 担当者
		columns.push({
			field: 'tantoUserName',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02041'),
			width: 220 });

		// ステータス
		columns.push({
			field: 'statusName',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02017'),
			width: 180,
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				styleFunctions:  [
					(dto: any): string => {
						if (dto.statusName.includes("遅延中")) {
							return 'eim-task-manager-tasks-delay';
						}
						return '';
					}
				]
			}
		});
		
		// 開始予定日
		columns.push({
			field: 'startYoteiDate',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02014'),
			width: 100 });
		// 終了予定日
		columns.push({
			field: 'endYoteiDate',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02015'),
			width: 100 });
		// 進捗率
		columns.push({
			field: 'progressRate', 
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02018'),
			width: 100,
			cellRendererFramework: EIMProgressBarRendererComponent,
		});
		// 依頼日時
		columns.push({
			field: 'orderDate',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02054'),
			width: 150 });
		// 依頼者
		columns.push({
			field: 'orderUserName',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02055'),
			width: 220 });

		this.delayedTaskListDataGrid.setColumns(columns);
		this.delayedTaskListDataGrid.showAllSelectButton = false;
		this.todayCompletePlanTaskListDataGrid.setColumns(columns);
		this.todayCompletePlanTaskListDataGrid.showAllSelectButton = false;
		this.scheduledScopeTaskListDataGrid.setColumns(columns);
		this.scheduledScopeTaskListDataGrid.showAllSelectButton = false;
	}

	/**
	 * プロジェクト詳細の編集モードを設定します.
	 *
	 * 設定によりプロジェクト詳細メニュー、プロジェクト詳細の編集可否を切り替えます.
	 *
	 * @param isProjectEditoMode 編集可否（true:編集可）
	 */
	private setProjectEditMode(isProjectEditoMode: boolean): void {

		this.isProjectEditMode = isProjectEditoMode;

		// メニューの表示非表示を変更
		this.menuEdit.visible = !isProjectEditoMode;
		this.menuCancel.visible = isProjectEditoMode;
		this.menuSave.visible = isProjectEditoMode;
		this.menuSave.disabled = true;

	}

	/**
	 * プロジェクトツリーに情報を設定します.
	 */
	private initProjectTreeData(): void {

		// プロジェクト一覧取得条件設定
		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		// apiParam.comparatorIds = ['baseObjectTypeComparator'];
		apiParam.objectCriteria =
			new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().type().definitionName().end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(['type', 'definitionName'], EIMSearchOperatorEnum.EQ, 'ワークスペース')
				]
			})
			.build();

		// プロジェクト一覧取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			let listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);
			this.projectTree.setListFormatResult(listFormatResult);
			this.projectTree.getData().forEach((node: EIMTreeNode) => {
				node.leaf = true;
			})

			// 初期化完了イベント発行
			this.projectTree.initialized.emit();
		});
	}

	/**
	 * メンバ一覧の編集モードを設定します.
	 *
	 * 設定によりメンバメニュー、メンバの編集可否を切り替えます.
	 *
	 * @param isMemberEditMode 編集可否（true:編集可）
	 */
	private setMemberEditMode(isMemberEditMode: boolean): void {

		this.isMemberEditMode = isMemberEditMode;

		// メニューの表示非表示を変更
		this.menuEditMember.visible = !isMemberEditMode;
		this.menuCancelMember.visible = isMemberEditMode;
		this.menuSaveMember.visible = isMemberEditMode;
		this.menuSaveMember.disabled = true;
	}

	/**
	 * タスク名称リンククリック時のイベントハンドラです.
	 * @param dto タスク情報DTO
	 */
	public onClickTask(dto: any): void {
		this.taskId = dto.taskId;
		this.parent = dto.parent;
		this.viewDialogName = 'taskUpdator';
	}

	/**
	 * タスク更新時のイベントハンドラです.
	 *
	 * @param dto タスク情報
	 */
	public onUpdateTask(): void {
		this.viewDialogName = null;

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00002',
				{value: this.translateService.instant('EIM_TASKS.LABEL_02012')}));

	}
}
