import { Component, ViewChild, Input, forwardRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { cloneDeep } from 'lodash';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMObjectAPIService, EIMObjectAPIServiceCreateParam, EIMObjectAPIServiceDeleteListParam, EIMObjectAPIServiceGetListParam, EIMObjectAPIServiceUpdateListParam } from 'app/shared/services/apis/object-api.service';
import { EIMSimpleSearchObjectCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-object-criteria.builder';
import { EIMSimpleSearchConditionCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-condition.criteria';
import { EIMSearchOperatorEnum } from 'app/shared/domains/search/search-operator-enum';
import { EIMTaskIconClassFunctionService } from 'app/tasks/services/task-icon-class-function.service';
import { EIMSimpleSearchRelatedObjectCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-related-object.criteria';
import { EIMSimpleSearchRelatedObjectRelationCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-related-object-relation.criteria';
import { EIMSimpleSearchRelationCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-relation-criteria.builder';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMDataGridColumn, EIMDataGridColumnType, EIMDataGridTreeNode } from 'app/shared/components/data-grid/data-grid.component';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMGanttChartComponent, EIMGanttChartOptions, EIMGanttChartTreeNode } from 'app/shared/components/gantt-chart/gantt-chart.component';
import { EIMDateRendererComponent } from 'app/shared/components/renderer/date-renderer.component';
import { EIMRendererComponentRowData, EIMRendererComponentService } from 'app/shared/components/renderer/renderer.component.service';
import { EIMCalendarInputRendererComponent } from 'app/shared/components/renderer/calendar-input-renderer.component';
import { EIMBooleanSwitchButtonInputRendererComponent } from '../renderer/boolean-switch-button-input-renderer.component';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMTaskMainComponent } from 'app/tasks/tasks.component';
import { EIMSearchLogicalOperatorEnum } from 'app/shared/domains/search/search-logical-operator-enum';
import { EIMSimpleSearchObjectResultAttributeType, EIMSimpleSearchRelationResultAttributeType } from 'app/shared/builders/simple-search/simple-search-result-attribute-type';
import { EIMSimpleSearchObjectConditionLeftAttributeType, EIMSimpleSearchRelationConditionLeftAttributeType } from 'app/shared/builders/simple-search/simple-search-condition-left-attribute-type';
import { EIMTreeFormatResultDTO } from 'app/shared/dtos/tree-format-result.dto';
import { EIMJsonToTreeFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-tree-format-result-dto-converter.service';
import { EIMTreeNodeDTO } from 'app/shared/dtos/tree-node.dto';
import { EIMJsonToListFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-list-format-result-dto-converter.service';
import { EIMTreeNodeService } from 'app/shared/services/tree-node.service';
import { EIMTaskService } from 'app/tasks/services/apis/task.service';
import { EIMProgressBarRendererComponent } from 'app/shared/components/renderer/progress-bar-renderer.component';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { RowNode } from 'ag-grid-community';
import { EIMDateService } from 'app/shared/services/date.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { Observable, of, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMConfigService } from 'app/shared/services/config.service';
import { EIMCreatedProcessDTO, EIMCreatedProjectDTO, EIMCreatedTaskDTO, EIMUpdatedProcessDTO, EIMUpdatedProjectDTO, EIMUpdatedTaskDTO } from 'app/tasks/tasks.interface';
import { EIMTasksModule } from 'app/tasks/tasks.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * タスク管理コンポーネント
 * @example
 *
 *      <eim-task-manager
 *      >
 *      </eim-task-manager>
 */
@Component({
	selector: 'eim-task-manager',
	templateUrl: './task-manager.component.html',
	styleUrls: ['./task-manager.component.scss'],
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		EIMTasksModule,
		EIMSharedModule,
		TranslatePipe,
	],
	providers: [ 
		{provide: EIMComponent, useExisting: forwardRef(() => EIMTaskManagerComponent)}, 
		EIMTaskIconClassFunctionService,
		EIMTaskService
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMTaskManagerComponent implements EIMTaskMainComponent {

	// ダイレクトアクセスの処理フロー
	//
	// EIMTaskManagerComponent#ngOnInit():URL、クエリパラメータのtaskIdをローカルストレージに保存
	// ↓　↓ログイン状態の場合
	// ↓　EIMTaskManagerComponent#setState():状態復帰時にローカルストレージの保存したtaskIdを選択
	// ↓　end
	// ↓
	// ↓未ログイン時
	// EIMPortalLoginComponent
	// ↓
	// EIMPortalsComponent#ngOnInit():ローカルストレージの保存したURLにナビゲート
	// ↓
	// EIMTaskManagerComponent#setState():状態復帰時にローカルストレージの保存したtaskIdを選択
	// end

	/** 初期表示時の取得階層(1,2,3,...) */
	static readonly INITIAL_LEVEL = 3;

	/** ガントチャート */
	@ViewChild('taskGanttChart', { static: true }) taskGanttChart: EIMGanttChartComponent;

	/** ワークスペースId(1つのワークスペースのみ表示する際に指定する) */
	@Input() workspaceId: number;

	/** 画面識別ID */
	public viewId = 'taskManager'

	/** 表示中のダイアログ名 */
	public viewDialogName = null;

	/** ツリーで選択された親DTO */
	public parentDTO: EIMSimpleObjectDTO = null;
	public selectedPath: string;

	/** ツリーで選択されたノードのルート階層ノードのDTO */
	public selectedRootDTO: EIMSimpleObjectDTO = null;

	/** 一覧で選択されたDTO */
	public selectedDTO: EIMSimpleObjectDTO = null;

	/** タスク一覧が編集モードか否か */
	public isTaskEditMode = false;

	/** ガントチャートオプション設定 */
	public ganttChartOptions: EIMGanttChartOptions;

	/** 流用元プロジェクト名 */
	public copyResourceProjectName: string;

	/** 新規プロジェクト名 */
	public createProjectName: string;

	public copyResourceTaskName: string;

	public createTaskName: string;

	/** タスク一覧のリスト */
	protected listFormatResult: EIMListFormatResultDTO;

	/** タスク一覧の編集前DTOリスト */
	protected taskTreeNodes: EIMGanttChartTreeNode[];

	/** タスク一覧の編集中のID/DTOマップ */
	protected changedDtoMap: Map<number, EIMSimpleObjectDTO>;

	/** 状態に保存した選択対象ツリーノード（状態にdataを保持しないためデータ読み込み後に手動で選択する必要がある） */
	protected selectedTreeNodesState: EIMGanttChartTreeNode[] = null;

	/** 保持管理者権限ID初期化時のサブスクリプション */
	protected initializedHasAuthIdSubscSubscription: Subscription = null;

	/* ==========================================================================
     メニューの定義
     ========================================================================== */

	/** 絞込み */
	public menuFilter: EIMMenuItem = {
		// label: '', rKey: 'EIM_TASKS.LABEL_03017', name: 'filterProject', icon: 'eim-icon-filter', visible: true,
		label: '', rKey: '絞込み（使用不可）', name: 'filterProject', icon: 'eim-icon-filter', visible: true,
		command: (event) => {}};

	// セパレータ
	public menuSeparator: MenuItem = {separator: true};

	/** ツリーメニュー */
	public treeMenuItems: EIMMenuItem[] = [
		// 絞込み
		this.menuFilter,
	];


	/** 編集 */
	public menuEdit: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03014', name: 'createTask', icon: 'fa fa-pencil', visible: true,
		command: (event) => {this.setTaskEditMode(true);}};

	/** キャンセル */
	public menuCancel: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03015', name: 'createTask', icon: 'fa fa-remove', visible: false,
		command: (event) => {this.setTaskEditMode(false);}};

	/** 保存 */
	public menuSave: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03016', name: 'createTask', icon: 'fa fa-check', visible: false,
		command: (event) => {this.updateTasks(Array.from(this.changedDtoMap.values()));}};

	/** プロジェクトメニュー */
	// プロジェクト登録
	public menuCreateProject: EIMMenuItem = {
			label: '', rKey: 'EIM_TASKS.LABEL_03001', name: 'createProject', icon: 'eim-icon-plus',
			command: (event) => {this.viewDialogName = 'projectCreator';}};
	// プロジェクト更新
	public menuUpdateProject: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03002', name: 'updateProject', icon: 'fa fa-pencil',
		command: (event) => {this.viewDialogName = 'projectUpdator';}};
	// プロジェクト流用
	public menuCopyProject: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03010', name: 'copyProject', icon: 'fa fa-copy',
		command: (event) => {this.openCopyProject()}};
	// プロジェクト削除
	public menuDeleteProject: EIMMenuItem = {
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

	/** プロジェクトリストコンテキストメニュー */
	public menuProject: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03007', name: 'project', icon: 'fa eim-icon-project', items: [
			this.menuCreateProject,
			this.menuUpdateProject,
			this.menuCopyProject,
			this.menuDeleteProject,
			// this.menuCancelProject,
			//this.menuCompleteProject
		]
	};

	/** プロセス登録 */
	public menuCreateProcess: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03023', name: 'createProcess', icon: 'eim-icon-plus',
		command: (event) => {this.viewDialogName = 'processCreator';}};

	/** プロセス詳細 */
	public menuUpdateProcess: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03002', name: 'createProcess', icon: 'fa fa-pencil',
		command: (event) => {this.viewDialogName = 'processUpdator';}};

	/** プロセス削除 */
	public menuDeleteProcess: EIMMenuItem = {
		label: '', rKey: 'EIM.LABEL_03003', name: 'deleteProcess', icon: 'fa fa-remove',
		command: (event) => {this.onClickDeleteProcess()}};

	/** プロセス */
	public menuProcess: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03008', name: 'process', icon: 'fa eim-icon-process', items: [
			this.menuCreateProcess,
			this.menuUpdateProcess,
			this.menuDeleteProcess,
		]
	};

	/** タスク登録 */
	public menuCreateTask: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03025', name: 'createTask', icon: 'eim-icon-plus',
		command: (event) => {this.viewDialogName = 'taskCreator';}};

	/** タスク詳細 */
	public menuUpdateTask: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03002', name: 'updateTask', icon: 'fa fa-pencil',
		command: (event) => {this.viewDialogName = 'taskUpdator';}};

	/** タスクタイプ最新化 */
	public menuUpdateTaskType: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03034', name: 'updateTaskType', icon: 'fa fa-link fa-flip-vertical eim-icon-link-color-gray',
		command: (event) => {this.onClickUpdateTaskType();}};
	/** タスク削除 */
	public menuDeleteTask: EIMMenuItem = {
		label: '', rKey: 'EIM.LABEL_03003', name: 'deleteTask', icon: 'fa fa-remove',
		command: (event) => {this.onClickDeleteTask()}};
	
	/** タスク複製 */
	public menuCopyTask: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03010', name: 'copyTask', icon: 'fa fa-copy',
		command: (event) => {this.openCopyTask()}};

	/** タスク */
	public menuTask: EIMMenuItem = {
		label: '', rKey: 'EIM_TASKS.LABEL_03009', name: 'task', icon: 'fa eim-icon-task', items: [
			this.menuCreateTask,
			this.menuUpdateTask,
			this.menuCopyTask,
			this.menuUpdateTaskType,
			this.menuDeleteTask,
		]
	};

	/** タスク一覧メニュー */
	public tasksMenuItems: EIMMenuItem[] = [
		// 編集
		this.menuEdit,
		// 保存
		this.menuSave,
		// キャンセル
		this.menuCancel,
		// プロジェクト
		this.menuProject,
		// プロセス
		this.menuProcess,
		// タスク
		this.menuTask
	];

	/** ダミーメニュー */
	public menuDummy: EIMMenuItem = {
		label: '', rKey: '', name: '', icon: ''};

	/** コンテンツツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
		// dummy
		this.menuDummy
	];

	/** 定数クラス */
	public constant: EIMTaskConstantService = EIMTaskConstantService;


	/**
	 * コンストラクタです.
	 */
	constructor(
		public treeComponentService: EIMTreeComponentService,
		protected router: Router,
		protected route: ActivatedRoute,
		protected localStorageService: EIMLocalStorageService,
		protected translateService: TranslateService,
		protected objectAPIService: EIMObjectAPIService,
		protected taskIconClassFunctionService: EIMTaskIconClassFunctionService,
		protected dataGridComponentService: EIMDataGridComponentService,
		protected messageService: EIMMessageService,
		protected treeNodeService: EIMTreeNodeService,
		protected rendererComponentService: EIMRendererComponentService,
		protected jsonToTreeFormatResultDTOConverterService: EIMJsonToTreeFormatResultDTOConverterService,
		protected jsonToListFormatResultDTOConverterService: EIMJsonToListFormatResultDTOConverterService,
		protected taskService: EIMTaskService,
		protected cacheService: EIMCacheService,
		protected dateServce: EIMDateService,
		protected configService: EIMConfigService
	) {
		// TranslateServiceでリソースが利用可能かどうかを判定する
		let checkKey: string = 'EIM_TASKS.LABEL_01000';
		let checkValue: string = this.translateService.instant(checkKey);
		if (checkKey !== checkValue) {
			// キーと値が一致していない場合はキーから値を取得できているので利用可能とみなす
			// メニューアイテムラベルを更新する
			this.refreshMenuItemLabel();
		}

		// 保持管理者権限IDが初期化されたらメニューアイテムの押下可否を設定
		this.initializedHasAuthIdSubscSubscription = this.cacheService.initializedHasAuthId.subscribe(
			(hasAuthId: any) => {

				this.updateMenuItems();
			}
		);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
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
		changeLabel(this.treeMenuItems);
		changeLabel(this.tasksMenuItems);
		let newMenuItems: EIMMenuItem[] = Object.assign([], this.treeMenuItems);
		this.treeMenuItems = newMenuItems;
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {

		// 当関数で選択状態を復帰するため不要となる
		this.selectedTreeNodesState = null;

		// プロジェクトツリーの画面状態を復元
		let selectedTreeNodeIdPath = null; // ルートから選択オブジェクトへのオブジェクトIDのリスト

		// ダイレクトアクセスの場合
		const directAccessInfo = this.localStorageService.getUserItemByKeys(
			EIMConstantService.LOCAL_STORAGE_KEYS_DIRECT_ACCESS_INFO);
		if (directAccessInfo) {

			// stateを設定して再度setState()を呼び出す
			const selectDto = {id: directAccessInfo.taskManagerComponent.taskId};
	
			this.getTreeNodeIdPath(selectDto).subscribe((treeNodeIdPath: string[]) => {
							
				const directAccessState = {

					displayTaskUpdatorDialog: true,
					workspaceId: directAccessInfo.taskManagerComponent.workspaceId,
		
					taskGanttChart: {
						selectedData: {
							treeNodeId:  this.treeNodeService.convertObjectDTOToTreeNodeId(selectDto)
						},
						selectedTreeNodeIdPath: treeNodeIdPath
					}
				};
	
				// ダイレクトアクセス情報クリア
				this.localStorageService.removeUserItemByKeys(EIMConstantService.LOCAL_STORAGE_KEYS_DIRECT_ACCESS_INFO);

				this.setState(directAccessState);
			});

			return;
		}
		else if (state) {

			selectedTreeNodeIdPath = state?.taskGanttChart?.selectedTreeNodeIdPath ?? null;

			// ワークスペースID
			if (state.workspaceId) {
				this.workspaceId = state.workspaceId;
			}

			// ガントチャート
			if (state.taskGanttChart) {
				this.taskGanttChart.setState(state.taskGanttChart);

				// 選択状態はデータ読み込み後に反映するため退避
				this.selectedTreeNodesState = state.taskGanttChart?.selectedData ?? null;
			}

		}

		// ガントチャート初期化
		this.setTaskDataGridColumns();

		// ガントチャートのoptionsを初期化する
		this.initializeGanttChartOptions();

		// プロジェクトツリー読み込み
		this.setRootTreeNodes(selectedTreeNodeIdPath);

		// 読み込み完了後の処理
		const taskGanttChartInitialized = this.taskGanttChart.initialized.subscribe(() => {

			taskGanttChartInitialized.unsubscribe();

			window.setTimeout(() => {
				// ガントチャート
				if (this.selectedTreeNodesState) {
					this.taskGanttChart.select(this.selectedTreeNodesState);
					this.selectedDTO = this.taskGanttChart.getSelectedData()[0]?.dto ?? null;
					this.selectedTreeNodesState = null;

					// ダイレクトアクセスの場合
					if (this.selectedDTO && state?.displayTaskUpdatorDialog === true) {

						// タスク詳細を開く
						this.viewDialogName = 'taskUpdator';

					}

					this.updateMenuItems();
				}
			});
		});
	}

	/**
	 * ツリーノードIDのパスを返却します.
	 * @param dto オブジェクト
	 * @returns ツリーノードIDのパス（999/999/999）
	 */
	public getTreeNodeIdPath(dto: EIMSimpleObjectDTO): Observable<String[]> {
		const apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.resultConverterId = 'treeFormatResultDTOConverter';

		// タスク取得条件設定
		apiParam.objectCriteria = new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(
						new EIMSimpleSearchObjectConditionLeftAttributeType().baseType().definitionName().end(), 
							EIMSearchOperatorEnum.EQ, EIMTaskConstantService.OBJECT_TYPE_NAME_TASK),
					new EIMSimpleSearchConditionCriteria(
						new EIMSimpleSearchObjectConditionLeftAttributeType().id().end(), EIMSearchOperatorEnum.EQ, dto.id)]
			}).build();

		// 親階層の条件設定
		const destCriteria: EIMSimpleSearchRelatedObjectCriteria = new EIMSimpleSearchRelatedObjectCriteria();
		destCriteria.relationParent = new EIMSimpleSearchRelatedObjectRelationCriteria();
		destCriteria.relationParent.objectCriteria =
				new EIMSimpleSearchObjectCriteriaBuilder()
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
					.setConditionGroup({
						op: EIMSearchLogicalOperatorEnum.AND,
						conditions: [
							new EIMSimpleSearchConditionCriteria(
								['baseType', 'definitionName'], 
								EIMSearchOperatorEnum.IN, [EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT, EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS])
						]
					})
					.build();

		destCriteria.relationParent.relationCriteria =
				new EIMSimpleSearchRelationCriteriaBuilder()
					.addResultAttributeType(new EIMSimpleSearchRelationResultAttributeType().id().end())
					.setConditionGroup({
						op: EIMSearchLogicalOperatorEnum.AND,
						conditions: [
							new EIMSimpleSearchConditionCriteria(
								new EIMSimpleSearchRelationConditionLeftAttributeType().type().definitionName().end(), 
								EIMSearchOperatorEnum.IN, [EIMTaskConstantService.RELATION_TYPE_NAME_TASK])
						]
					})
					.build();
	
		apiParam.repeatRelatedObjectCriteriasNum = 10;
		apiParam.relatedObjectCriterias = [destCriteria];

		// プロジェクトツリー情報取得
		return this.objectAPIService.getList(apiParam)			
			.pipe(mergeMap((res: any) => {
				const treeFormatResult: EIMTreeFormatResultDTO =
					this.jsonToTreeFormatResultDTOConverterService.convert(res);

				let pathObjIdArray = [];
				let treeNode = treeFormatResult.treeNodes?.[0];
				while (treeNode) {
					pathObjIdArray.push(this.treeNodeService.convertObjectDTOToTreeNodeId(treeNode.dto));
					treeNode = treeNode.childTreeNodes?.[0];
				}

				return of(pathObjIdArray.reverse());
			}));

	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {

		const taskGanttChartState = this.taskGanttChart.getState();
		taskGanttChartState.data = null; // データは保持しない
		if (this.selectedTreeNodesState) {
			// setState()にてデータ読み込み完了時に選択状態を設定する。
			// 上記の選択処理前にgetState()が呼ばれた場合、状態に設定された選択状態を設定する。
			taskGanttChartState.selectedData = this.selectedTreeNodesState;
		}
		return {
			workspaceId: this.workspaceId,

			taskGanttChart: taskGanttChartState
		};
	}

	/**
	 * タスク表示内容を更新します.
	 * 
	 * @param parentDTO 更新されたタスクオブジェクトの親オブジェクト
	 * @param updatedDTO 更新されたタスクオブジェクト
	 */
	public updateTask(parentDTO: EIMSimpleObjectDTO, updatedDTO: EIMSimpleObjectDTO): void {

		// タスク情報を更新
		if (this.taskGanttChart.getTreeNodeByDTO(updatedDTO)) {
			this.replaceTreeNodes([updatedDTO]);
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		this.setTaskDataGridColumns();

		this.updateMenuItems();

		// ガントチャートのoptionsを初期化する
		this.initializeGanttChartOptions();

		// URLのパスから選択するワークスペースを決定
		const taskId: number = Number(this.route.snapshot.queryParamMap.get('taskId'));

		if (!isNaN(taskId) && taskId !== 0) { // クエリパラメータ未指定の場合はtaskIdが0となる
			this.localStorageService.setUserItemByKeys(
				EIMConstantService.LOCAL_STORAGE_KEYS_DIRECT_ACCESS_INFO,
				{
					url: this.router.url.split('?')[0],
					taskManagerComponent: {
						workspaceId: this.workspaceId,
						taskId: taskId
					}
				}
			);
		}
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (this.initializedHasAuthIdSubscSubscription && !this.initializedHasAuthIdSubscSubscription.closed) {
			this.initializedHasAuthIdSubscSubscription.unsubscribe();
		}
	}

	/**
	 * 名称リンククリック時のイベントハンドラです.
	 * @param dto タスク情報DTO
	 */
	public onClickLink(treeNode: EIMGanttChartTreeNode): void {

		this.taskGanttChart.select([treeNode], true);
		this.selectedDTO = treeNode.dto;
		this.parentDTO = treeNode.parentTreeNode?.dto ?? null;
		this.selectedRootDTO = (this.treeNodeService.getRootTreeNode(treeNode) as EIMDataGridTreeNode).dto;

		// タスクの場合
		if (treeNode.dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK) {
			this.viewDialogName = 'taskUpdator';
		} 
		// タスク以外の場合
		else {
			// TODO: プロジェクト/プロセスの場合はツリーを開閉する？詳細画面を開く？
			// this.viewDialogName = 'processUpdator';
			// ツリーにて該当プロセス選択状態にする
			const _treeNode = this.taskGanttChart.getTreeNodeByTreeNodeId(treeNode.treeNodeId);

			// 子階層が未取得の場合
			if (_treeNode.childTreeNodes === null) {
				this.setChildTreeNodes(treeNode);
			} else {
				_treeNode.expanded = !_treeNode.expanded;
				this.taskGanttChart.ganttChartDataGrid.expandTreeNode(_treeNode, _treeNode.expanded);
			}
		}
	}

	/**
	 * ダイアログクローズ時のイベントハンドラです.
	 */
	public onCloseDialog() {
		this.viewDialogName = null;
	}

	/**
	 * タスク一覧の行選択変更時のイベントハンドラです.
	 * @param event イベント
	 */
	public onChanged(event): void {

		this.selectedDTO = null;
		this.parentDTO = null;
		this.selectedRootDTO = null;

		if (this.taskGanttChart.getSelectedData().length === 1) {
			const selectedTreeNode = this.taskGanttChart.getSelectedData()[0];
			this.selectedDTO = selectedTreeNode.dto;
			this.parentDTO = selectedTreeNode.parentTreeNode?.dto ?? null;
			this.selectedRootDTO = (this.treeNodeService.getRootTreeNode(selectedTreeNode) as EIMDataGridTreeNode).dto;
		}

		this.updateMenuItems();
	}

	/**
	 * ツリーの開閉時のイベントハンドラです.
	 *
	 * @param event イベント
	 */
	public onExpanded(event): void {

		const treeNode: EIMDataGridTreeNode = event.expandedData;
		if (treeNode.dto.exAttributeMap?.['baseObjTypeDefName'] !== 'ワークスペース' &&
				treeNode.dto.exAttributeMap?.['baseObjTypeDefName'] !== EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS
		) {
			return;
		}

		// 子階層が未取得の場合
		if (treeNode.childTreeNodes === null) {
			this.setChildTreeNodes(treeNode);
		}
	}

	/**
	 * 行ダブルクリック時のイベントハンドラです.
	 * @param event イベント
	 */
	public onDoubleClicked(event): void {
		if (event.data.dto.exAttributeMap?.['baseObjTypeDefName'] === 'ワークスペース') {
			this.selectedDTO = event.data.dto;
			this.viewDialogName = 'projectUpdator';
		} else if (event.data.dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS) {
			this.selectedDTO = event.data.dto;
			this.viewDialogName = 'processUpdator';
		} else if (event.data.dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK) {
			this.selectedDTO = event.data.dto;
			this.viewDialogName = 'taskUpdator';
		}
	}

	/**
	 * プロジェクト削除クリックイベントハンドラです.
	 */
	public onClickDeleteProject() {
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM.CONFIRM_00006' , {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}) ,
			() => {

				this.messageService.show(EIMMessageType.confirm,
					this.translateService.instant('EIM_TASKS.CONFIRM_00003' , {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}) ,
					() => {

						const selectedTreeNodes: EIMGanttChartTreeNode[] = this.taskGanttChart.getSelectedData();

						const dtos = [];
						for (const selectedTreeNode of selectedTreeNodes) {
							dtos.push(selectedTreeNode.dto);
						}
						const param = new EIMObjectAPIServiceDeleteListParam();
						param.dtos = dtos;
				
						this.objectAPIService.deleteList(param).subscribe((res: any) => {
							
							// プロジェクトツリーから該当ツリーノード削除
							this.onDeletedProject({parentTreeNode: selectedTreeNodes[0].parentTreeNode, deletedTreeNodes: selectedTreeNodes});

						});
					}
				);
			}
		);
	}

	/**
	 * プロセス削除クリックイベントハンドラです.
	 */
	protected onClickDeleteProcess(): void {

		// プロセスマスタから生成されたプロセスは削除不可
		const selectedTreeNodes: EIMGanttChartTreeNode[] = this.taskGanttChart.getSelectedData();
		const param = new EIMObjectAPIServiceDeleteListParam();
		param.dtos = [];
		let deletedTreeNodes = [];

		const processTreeNodes = (treeNode: any, deletedTreeNodes: any[]) => {
			if (treeNode.childTreeNodes === null) {
				return;
			}
	
			for (const childTreeNode of treeNode.childTreeNodes) {
				deletedTreeNodes.push(childTreeNode);
				processTreeNodes(childTreeNode, deletedTreeNodes);
			}
		};

		for (const treeNode of selectedTreeNodes) {
			// プロセス(マスタ)
			if (treeNode.dto.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROCESS_MASTER]?.['values'][0] ?? null !== null) {
				this.messageService.show(EIMMessageType.error
					,this.translateService.instant('EIM_TASKS.ERROR_00002', {value: this.translateService.instant('EIM_TASKS.LABEL_02011')}));

				return;
			}

			treeNode.dto.type.definitionName = EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS;
			param.dtos.push(treeNode.dto);
			deletedTreeNodes.push(treeNode);
			processTreeNodes(treeNode, deletedTreeNodes);
		}

		// 削除処理
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM.CONFIRM_00006' , {value: this.translateService.instant('EIM_TASKS.LABEL_02011')}) ,
			() => {

				this.objectAPIService.deleteList(param).subscribe((res: any) => {
					this.onDeletedProcess({parentTreeNode: selectedTreeNodes[0].parentTreeNode, deletedTreeNodes: deletedTreeNodes});
				});
			}
		);
	}

	/**
	 * タスクタイプ最新化クリックイベントハンドラです.
	 */
	protected onClickUpdateTaskType(): void {

		const selectedTreeNodes: EIMGanttChartTreeNode[] = this.taskGanttChart.getSelectedData();
		const dtos = [];
		for (let selectedTreeNode of selectedTreeNodes) {
			dtos.push({
				id: selectedTreeNode.dto.id,
				type: selectedTreeNode.dto.type
			});
		}
		let apiParam: EIMObjectAPIServiceUpdateListParam = new EIMObjectAPIServiceUpdateListParam();
		apiParam = {
			dtos: dtos,
			updateAttributeTypeDefinitionNamePaths: [['type']],
			// isRetrieveLatestObjects: true,
			exParameter: {
				[EIMTaskConstantService.PLUG_IN_PARAM_NAME_SETTING_TASK_TYPE_TO_LATEST_FLAG]: true,
				[EIMTaskConstantService.PLUG_IN_PARAM_NAME_UPDATE_OUTPUT_STATUS_FLAG]: true
			}
		};

		// タスクのタイプ更新
		this.objectAPIService.updateList(apiParam).subscribe((res: any) => {

			let updatedDtos: EIMSimpleObjectDTO[] = res.dtos;

			// ツリーノード置き換え
			this.replaceTreeNodes(updatedDtos);

			let isNotUpdatedForExistsEventCnt = 0;
			for (const dto of updatedDtos) {

				// ステータス更新済みのためタスクタイプ更新しなかった場合
				const isNotUpdatedForExistsEvent = dto.exAttributeMap?.[EIMTaskConstantService.EX_ATTRIBUTE_KEY_NOT_UPDATED_TASK_FOR_EXISTS_EVENT] ?? false;
				if (isNotUpdatedForExistsEvent) {
					isNotUpdatedForExistsEventCnt++;
				}
			}

			if (dtos.length === isNotUpdatedForExistsEventCnt) {

				// エラーメッセージ表示
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_TASKS.ERROR_00009'));
			}
			else {

				// 完了メッセージ表示
				this.messageService.showGrowl(this.translateService.instant(
					'EIM_TASKS.INFO_00008', {value: this.translateService.instant('EIM_TASKS.LABEL_02026')}));
			}

			this.viewDialogName = null;
		});

	}

	/**
	 * タスク削除クリックイベントハンドラです.
	 */
	protected onClickDeleteTask() {
		// タスクマスタから生成されたタスクは削除不可
		const selectedTreeNodes: EIMGanttChartTreeNode[] = this.taskGanttChart.getSelectedData();

		for (const treeNode of selectedTreeNodes) {
			// タスク(マスタ)
			if (treeNode.dto.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TASK_MASTER]?.['values'][0] ?? null !== null) {
				this.messageService.show(EIMMessageType.error
					,this.translateService.instant('EIM_TASKS.ERROR_00002', {value: this.translateService.instant('EIM_TASKS.LABEL_02012')}));

				return;
			}
		}

		// 削除処理
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM.CONFIRM_00006' , {value: this.translateService.instant('EIM_TASKS.LABEL_02012')}) ,
			() => {

				let params = new EIMObjectAPIServiceDeleteListParam();
				params.dtos = this.treeNodeService.getDtos(selectedTreeNodes);
				this.objectAPIService.deleteList(params).subscribe((res: any) => {

					this.onDeletedTask({parentTreeNode: selectedTreeNodes[0].parentTreeNode, deletedTreeNodes: selectedTreeNodes});
				});
			}
		);
	}

	/**
	 * プロジェクト登録完了時のイベントハンドラです.
	 *
	 * @param event プロジェクト登録結果情報
	 */
	public onCreatedProject(event: EIMCreatedProjectDTO): void {
		
		// ダイアログクローズ
		this.viewDialogName = null;

		this.addTreeNodes(event.createdDTO);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00001', {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}));

	}

	/**
	 * プロジェクト更新時のイベントハンドラです.
	 *
	 * @param event プロジェクト更新結果情報
	 */
	public onUpdatedProject(event: EIMUpdatedProjectDTO): void {

		// ダイアログ消去
		this.viewDialogName = null;

		this.replaceTreeNodes([event.updatedDTO]);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00002',
				{value: this.translateService.instant('EIM_TASKS.LABEL_02010')}));

	}

	/**
	 * プロジェクト削除完了イベントハンドラです.
	 * @param event プロジェクト削除結果情報
	 */
	public onDeletedProject(event: {parentTreeNode: EIMGanttChartTreeNode, deletedTreeNodes: EIMGanttChartTreeNode[]}): void {

		this.taskGanttChart.removeTreeNodes(event.deletedTreeNodes);
		
		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00003', {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}));
	}

	/**
	 * プロセス登録時のイベントハンドラです.
	 *
	 * @param event プロセス登録結果情報
	 */
	public onCreatedProcess(event: EIMCreatedProcessDTO): void {

		// ダイアログ消去
		this.viewDialogName = null;

		this.addTreeNodes(event.createdDTO, event.parentDTO);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00001',
				{value: this.translateService.instant('EIM_TASKS.LABEL_02011')}));
	}

	/**
	 * プロセス更新時のイベントハンドラです.
	 *
	 * @param event プロセス更新結果情報
	 */
	public onUpdatedProcess(event: EIMUpdatedProcessDTO): void {

		// ダイアログ消去
		this.viewDialogName = null;

		this.replaceTreeNodes([event.updatedDTO]);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00002',
				{value: this.translateService.instant('EIM_TASKS.LABEL_02011')}));

	}

	/**
	 * プロセス削除完了イベントハンドラです.
	 * @param event プロセス削除結果情報
	 */
	public onDeletedProcess(event: {parentTreeNode: EIMGanttChartTreeNode, deletedTreeNodes: EIMGanttChartTreeNode[]}): void {

		this.taskGanttChart.removeTreeNodes(event.deletedTreeNodes);
		
		// 上位階層を選択状態にする
		this.taskGanttChart.select([event.parentTreeNode], true);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00003', {value: this.translateService.instant('EIM_TASKS.LABEL_02011')}));
	}

	/**
	 * タスク登録時のイベントハンドラです.
	 *
	 * @param event タスク登録結果情報
	 */
	public onCreatedTask(event: EIMCreatedTaskDTO): void {
		this.viewDialogName = null;

		this.addTreeNodes(event.createdDTO, event.parentDTO);
		
		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00001',
				{value: this.translateService.instant('EIM_TASKS.LABEL_02012')}));

	}

	/**
	 * タスク更新時のイベントハンドラです.
	 *
	 * @param event タスク更新結果情報
	 */
	public onUpdatedTask(event: EIMUpdatedTaskDTO): void {

		// ダイアログ消去
		this.viewDialogName = null;

		this.replaceTreeNodes([event.updatedDTO]);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00002',
				{value: this.translateService.instant('EIM_TASKS.LABEL_02012')}));

	}

	/**
	 * タスク削除完了イベントハンドラです.
	 * @param event タスク削除結果情報
	 */
	public onDeletedTask(event: {parentTreeNode: EIMGanttChartTreeNode, deletedTreeNodes: EIMGanttChartTreeNode[]}): void {

		this.taskGanttChart.removeTreeNodes(event.deletedTreeNodes);
		
		// 上位階層を選択状態にする
		this.taskGanttChart.select([event.parentTreeNode], true);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00003', {value: this.translateService.instant('EIM_TASKS.LABEL_02012')}));
	}

	/**
	 * タスク一覧編集モードの値変更イベントハンドラです.
	 * @param value 変更後の値
	 * @param params データグリッドの該当列のパラメータ
	 */
	public onChangeValue(value: any, rowData: EIMRendererComponentRowData): void {

		const nodeTree: EIMGanttChartTreeNode = rowData.dto;
		const dto: EIMSimpleObjectDTO = nodeTree.dto;

		// 変更した属性のみを含むDTOを作成する

		let changedDto: EIMSimpleObjectDTO = null;

		if (!this.changedDtoMap.has(dto.id)) {
			// 新たに属性値を変更したDTOの場合
			changedDto = {
				id: dto.id,
				name: dto.name,
				type: dto.type,
				lockUser: dto.lockUser,
				security: dto.security,
				attributeMap: dto.attributeMap
			};
			this.changedDtoMap.set(dto.id, changedDto);

		} else {
			// すでに属性値を変更したDTOの場合
			changedDto = this.changedDtoMap.get(dto.id);
		}

		// 保存ボタンを押下可否を設定する
		this.menuSave.disabled = false;
		for (const changedDto of this.changedDtoMap.values()) {

			// 入力値を検証する
			const valid = this.validateForBulkUpdate(changedDto);
			if (valid === false) {

				// 保存ボタンを押下不可にする
				this.menuSave.disabled = true;
				break;
			}
		}

		// 変更済みDTOに変更値を設定
		if (value !== null) {
			// ツリー表示のためrowDataのcolumn.fileldがdto.xxxの指定となっている
			// そのため{dto: changedDto}と指定することで属性値の反映階層がずれないようにしている
			this.rendererComponentService.setChangedValue(rowData, {dto: changedDto}, [value]);
		} else {
			// ツリー表示のためrowDataのcolumn.fileldがdto.xxxの指定となっている
			// そのため{dto: changedDto}と指定することで属性値の反映階層がずれないようにしている
			this.rendererComponentService.setChangedValue(rowData, {dto: changedDto}, [null]);
		}

		// データグリッドツリーノード更新
		const updatedTreeNode = this.taskGanttChart.getTreeNodeByDTO(dto);
		this.setAdditionalPropertiesToTreeNodeFunction(updatedTreeNode, dto);
		this.taskGanttChart.refreshChartView();
	}

	/**
	 * プロジェクトの複製を行います.
	 */
	onClickCopyProject(event) {

		let apiParam: EIMObjectAPIServiceCreateParam = new EIMObjectAPIServiceCreateParam();
		apiParam = {
			dto: {
				id: this.selectedDTO.id,
				type: this.selectedDTO.type,
				name: this.createProjectName
			},
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_IS_INVOKE_DUPLICATE]: true,
				[EIMTaskConstantService.PLUG_IN_PARAM_NAME_IS_PROJECT_DUPLICATE]: true,
				[EIMTaskConstantService.PLUG_IN_PARAM_NAME_UPDATE_OUTPUT_STATUS_FLAG]: true
			}
		};

		// プロジェクト流用
		this.objectAPIService.create(apiParam).subscribe((res: any) => {

			const resultDto = new EIMFormFormatResultDTO(res).dto;

			// 返却されない属性を複製元から設定
			resultDto.exAttributeMap["accessRoleTypeNameMap"] = this.selectedDTO.exAttributeMap?.["accessRoleTypeNameMap"];

			const treeNode: EIMGanttChartTreeNode = this.taskGanttChart.convertDTOToTreeNode(resultDto);
			const rootTreeNodes: EIMGanttChartTreeNode[] = this.taskGanttChart.getData() as EIMGanttChartTreeNode[];
			const childTreeNodeIndex = rootTreeNodes ? rootTreeNodes.length : 0;
	
			this.taskGanttChart.setChildTreeNodesToIndex(null, [treeNode], childTreeNodeIndex);

			// 追加したツリーノードを選択状態にする
			this.taskGanttChart.select([treeNode], true);
			const selectedTreeNode = this.taskGanttChart.getSelectedData()[0];
			this.selectedDTO = selectedTreeNode.dto;
			this.updateMenuItems();

			// 完了メッセージ表示
			this.messageService.showGrowl(this.translateService.instant(
				'EIM_TASKS.INFO_00006', {value: this.translateService.instant('EIM_TASKS.LABEL_03007')}));

			this.viewDialogName = null;
		});
	}

	/**
	 * タスクの複製を行います.
	 */
	onClickCopyTask(event) {

		let apiParam: EIMObjectAPIServiceCreateParam = new EIMObjectAPIServiceCreateParam();
		apiParam = {
			dto: {
				id: this.selectedDTO.id,
				type: this.selectedDTO.type,
				name: this.createTaskName
			},
			parentObjectId: this.parentDTO.id,
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_IS_INVOKE_DUPLICATE]: true,
				[EIMTaskConstantService.PLUG_IN_PARAM_NAME_IS_TASK_DUPLICATE]: true,
				[EIMTaskConstantService.PLUG_IN_PARAM_NAME_UPDATE_OUTPUT_STATUS_FLAG]: true
			}
		};

		// タスク複製
		this.objectAPIService.create(apiParam).subscribe((res: any) => {

			const createdDto = new EIMFormFormatResultDTO(res).dto;

			this.addTreeNodes(createdDto, this.parentDTO);

			// 完了メッセージ表示
			this.messageService.showGrowl(this.translateService.instant(
				'EIM_TASKS.INFO_00006', {value: this.translateService.instant('EIM_TASKS.LABEL_03009')}));

			this.viewDialogName = null;
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * タスク一覧の編集モードを設定します.
	 *
	 * 設定によりタスク一覧メニュー、タスク一覧の編集可否を切り替えます.
	 *
	 * @param taskEditMode 編集可否（true:編集可）
	 */
	private setTaskEditMode(taskEditMode: boolean): void {

		this.isTaskEditMode = taskEditMode;

		// メニューの表示非表示を変更
		this.menuEdit.visible = !taskEditMode;
		this.menuCancel.visible = taskEditMode;
		this.menuSave.visible = taskEditMode;
		this.menuSave.disabled = true;

		const scrollTop = this.taskGanttChart.getScrollTop();
		const chartScrollLeft = this.taskGanttChart.getChartScrollLeft();

		// タスク一覧の編集可否表示切替
		if (this.isTaskEditMode === true) {
			// 編集モード用に複製したDTOを設定する
			this.taskTreeNodes = this.taskGanttChart.getData();
			let cloneTaskTreeNodes = cloneDeep(this.taskTreeNodes);
			this.taskGanttChart.setData(cloneTaskTreeNodes);
		} else {
			// 編集前のDTOを設定する
			this.taskGanttChart.setData(this.taskTreeNodes);
		}

		window.setTimeout(() => {
			this.taskGanttChart.setScrollTop(scrollTop);
			this.taskGanttChart.setChartScrollLeft(chartScrollLeft);
		});

		this.changedDtoMap = new Map();

		this.updateMenuItems();
	}

	/**
	 * メニューの有効/無効を切り替えます.
	 */
	protected updateMenuItems(): void {

		const selectedTreeNodes = this.taskGanttChart.getSelectedData();

		// 表示非表示
		if (this.workspaceId) {
			this.menuProject.visible = false;
		} else {
			this.menuProject.visible = true;
		}

		// 全て無効化
		this.menuEdit.disabled = true;

		this.menuProject.disabled = true;
		this.menuProcess.disabled = true;
		this.menuTask.disabled = true;

		this.menuCreateProject.disabled = true;
		this.menuUpdateProject.disabled = true;
		this.menuCopyProject.disabled = true;
		this.menuDeleteProject.disabled = true;
		this.menuCancelProject.disabled = true;
		this.menuCompleteProject.disabled = true;

		this.menuCreateProcess.disabled = true;
		this.menuUpdateProcess.disabled = true;
		this.menuDeleteProcess.disabled = true;

		this.menuCreateTask.disabled = true;
		this.menuUpdateTask.disabled = true;
		this.menuCopyTask.disabled = true;
		this.menuUpdateTaskType.disabled = true;
		this.menuDeleteTask.disabled = true;

		// 選択行がすべてプロジェクト
		const isSelectedAllProject = 
				this.isSameBaseObjectTypeDefinitionName(selectedTreeNodes, EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT);
		// 選択行がすべてプロセス
		const isSelectedAllProcess = 
				this.isSameBaseObjectTypeDefinitionName(selectedTreeNodes, EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS);
		// 選択行がすべてタスク
		const isSelectedAllTask = 
				this.isSameBaseObjectTypeDefinitionName(selectedTreeNodes, EIMTaskConstantService.OBJECT_TYPE_NAME_TASK);

		// 個別に有効化

		// 編集メニュー
		this.menuEdit.disabled = false;
		
		// プロジェクト管理の管理者権限を保持しているかどうか
		const hasProjectAdminAuthority = this.cacheService.getHasAuthId()?.project ?? false;

		// 登録権限を保持しているかどうか
		const hasCreateAccessAuthority = 
				this.selectedDTO?.exAttributeMap?.accessRoleTypeNameMap?.CREATE === true;

		// プロジェクトメニュー
		if (hasProjectAdminAuthority) {
			this.menuCreateProject.disabled = false;
		}
		if (selectedTreeNodes.length === 1 && 
				this.selectedDTO &&
				this.selectedDTO.exAttributeMap?.['baseObjTypeDefName'] === 
					EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT) {

			// 詳細は詳細画面で入力可否を切り替える
			this.menuUpdateProject.disabled = false;

			if (hasProjectAdminAuthority) {
				this.menuCopyProject.disabled = false;
				this.menuCancelProject.disabled = false;
				this.menuCompleteProject.disabled = false;
			}

			// ワークスペースがCREATE権限を保持する場合
			// 子階層の操作を有効に切り替える
			if (hasCreateAccessAuthority) {
				this.menuCreateProcess.disabled = false;
				this.menuCreateTask.disabled = false;
			}
		}

		// プロセスメニュー
		if (selectedTreeNodes.length === 1 && 
				this.selectedDTO &&
				this.selectedDTO.exAttributeMap?.['baseObjTypeDefName'] === 
					EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS) {

			// 詳細は詳細画面で入力可否を切り替える
			this.menuUpdateProcess.disabled = false;

			// プロセスがCREATE権限を保持する場合
			// 子階層の操作を有効に切り替える
			if (hasCreateAccessAuthority) {
				this.menuCreateProcess.disabled = false;
				this.menuCreateTask.disabled = false;
			}

		}

		// タスクメニュー
		if (selectedTreeNodes.length === 1 && 
				this.selectedDTO &&
				this.selectedDTO.exAttributeMap?.['baseObjTypeDefName'] ===
					EIMTaskConstantService.OBJECT_TYPE_NAME_TASK) {

			const parentDTO = selectedTreeNodes[0].parentTreeNode.dto;
			// 親が登録権限を保持しているかどうか
			const hasCreateAccessAuthorityForParent = 
					parentDTO?.exAttributeMap?.accessRoleTypeNameMap?.CREATE === true;

			// 詳細は詳細画面で入力可否を切り替える
			this.menuUpdateTask.disabled = false;

			if (hasCreateAccessAuthorityForParent) {
				this.menuCopyTask.disabled = false;
			}
		}

		if (selectedTreeNodes.length > 0) {

			// プロジェクト複数選択
			if (isSelectedAllProject) {

				// プロジェクト管理の管理者権限を保持している場合
				if (hasProjectAdminAuthority) {
					
					this.menuDeleteProject.disabled = false;
				}
	
			}
			// プロセス複数選択
			if (isSelectedAllProcess) {

				// 削除権限を保持している場合
				if (this.hasAccessAccessAuthority(selectedTreeNodes, 'DELETE')) {
					
					this.menuDeleteProcess.disabled = false;
				}
	
			}
			// タスク複数選択
			if (isSelectedAllTask) {

				// 更新権限を保持している場合
				if (this.hasAccessAccessAuthority(selectedTreeNodes, 'UPDATE')) {

					this.menuUpdateTaskType.disabled = false;
				}

				// 削除権限を保持している場合
				if (this.hasAccessAccessAuthority(selectedTreeNodes, 'DELETE')) {
					
					this.menuDeleteTask.disabled = false;
				}
	
			}
		} 

		if (!this.menuCreateProject.disabled || !this.menuUpdateProject.disabled || !this.menuDeleteProject.disabled 
				|| !this.menuCancelProject.disabled || !this.menuCompleteProject.disabled) {
			
			this.menuProject.disabled = false;
		}

		if (!this.menuCreateProcess.disabled || !this.menuUpdateProcess.disabled || !this.menuDeleteProcess.disabled) {
			this.menuProcess.disabled = false;
		}
		if (!this.menuCreateTask.disabled || !this.menuUpdateTask.disabled || !this.menuDeleteTask.disabled || 
				!this.menuCopyTask.disabled || !this.menuUpdateTaskType.disabled) {

			this.menuTask.disabled = false;
		}

		if (this.isTaskEditMode) {
		
			// 一括編集中は、詳細以外のメニューは無効化
			// 詳細画面は編集不可状態で表示する
			this.menuEdit.disabled = true;

			this.menuProject.disabled = true;
			this.menuProcess.disabled = true;
			this.menuTask.disabled = true;
	
			this.menuCreateProject.disabled = true;
			//this.menuUpdateProject.disabled = true;
			this.menuCopyProject.disabled = true;
			this.menuDeleteProject.disabled = true;
			this.menuCancelProject.disabled = true;
			this.menuCompleteProject.disabled = true;
	
			this.menuCreateProcess.disabled = true;
			//this.menuUpdateProcess.disabled = true;
			this.menuDeleteProcess.disabled = true;
	
			this.menuCreateTask.disabled = true;
			//this.menuUpdateTask.disabled = true;
			this.menuCopyTask.disabled = true;
			this.menuUpdateTaskType.disabled = true;
			this.menuDeleteTask.disabled = true;

			if (!this.menuUpdateProject.disabled) {
			
				this.menuProject.disabled = false;
			}

			if (!this.menuUpdateProcess.disabled) {
				this.menuProcess.disabled = false;
			}
			if (!this.menuUpdateTask.disabled) {

				this.menuTask.disabled = false;
			}
		}

		// コンテキストメニュー設定
		if (this.taskGanttChart.getSelectedData().length === 0) {
			this.contentsTreeMenuItems = [];
		}
		else if (this.taskGanttChart.getSelectedData().length > 0) {

			// 左部ツリーメニュー変更
			// プロジェクト選択の場合
			if (isSelectedAllProject) {
				this.contentsTreeMenuItems = [
					// 詳細
					this.menuUpdateProject,
					// 流用
					this.menuCopyProject,
					// 削除
					this.menuDeleteProject,
					this.menuSeparator,
					// プロセス登録
					this.menuCreateProcess,
					// タスク登録
					this.menuCreateTask,
				];
			}
			// プロセス選択の場合
			else if (isSelectedAllProcess) {
				this.contentsTreeMenuItems = [
					// 詳細
					this.menuUpdateProcess,
					// 削除
					this.menuDeleteProcess,
					this.menuSeparator,
					// プロセス登録
					{label: this.translateService.instant('EIM_TASKS.LABEL_03023'), name: 'createProcess', icon: 'eim-icon-plus', disabled: this.menuCreateProcess.disabled,
						command: (event) => {this.viewDialogName = 'processCreator';}},
					// タスク登録
					{label: this.translateService.instant('EIM_TASKS.LABEL_03025'), name: 'createTask', icon: 'eim-icon-plus', disabled: this.menuCreateTask.disabled,
						command: (event) => {this.viewDialogName = 'taskCreator';}},
				];
			}
			// タスクの場合
			else if (isSelectedAllTask) {
				this.contentsTreeMenuItems = [
					// 詳細
					this.menuUpdateTask,
					// 複製
					this.menuCopyTask,
					// タスクタイプ最新化
					this.menuUpdateTaskType,
					// 削除
					this.menuDeleteTask
				];
			}
			else {
				this.contentsTreeMenuItems = [];
			}
		}

		// ガントチャートのoptionsを初期化する
		this.initializeGanttChartOptions();

	}

	/**
	 * ツリーノードのオブジェクトタイプが指定したオブジェクトタイプ定義名称かチェックします.
	 * 
	 * @param treeNodes ツリーノードリスト
	 * @param accessRoleTypeName オブジェクトタイプ定義名称
	 * @returns 全てのツリーノードのオブジェクトタイプが指定したオブジェクトタイプ定義名称の場合はtrueを返却
	 */
	private isSameBaseObjectTypeDefinitionName(treeNodes: EIMGanttChartTreeNode[], baseObjTypeDefName: string): boolean {

		for (const treeNode of treeNodes) {

			if (treeNode.dto.exAttributeMap?.['baseObjTypeDefName'] !== baseObjTypeDefName) {
					return false;
			}
		}

		return true;
	}

	/**
	 * ツリーノードが指定したアクセス権限を保持しているかチェックします.
	 * 
	 * @param treeNodes ツリーノードリスト
	 * @param accessRoleTypeName アクセスロールタイプ名
	 * @returns 全てのツリーノードが指定したアクセス権限を保持している場合はtrueを返却
	 */
	private hasAccessAccessAuthority(treeNodes: EIMGanttChartTreeNode[], accessRoleTypeName: string): boolean {

		for (const treeNode of treeNodes) {
			const hasUpdateAccessAuthority = (treeNode?.dto?.exAttributeMap?.accessRoleTypeNameMap?.[accessRoleTypeName] ?? false) === true;
			if (!hasUpdateAccessAuthority) {

				return false;
			}
		}

		return true;
	}

	/**
	 * 子階層オブジェクト取得用のクライテリアを生成します.
	 * 
	 * @param parentObjectId 親オブジェクトID（選択ツリー展開時に使用）
	 * @return 子階層オブジェクト取得用のクライテリア
	 */
	private createChildRelatedObjectCriteria(parentObjectId: number = null): EIMSimpleSearchRelatedObjectCriteria {
		
		// 子階層のプロセス情報取得条件指定
		const destCriteria: EIMSimpleSearchRelatedObjectCriteria = new EIMSimpleSearchRelatedObjectCriteria();
		destCriteria.relationChild = new EIMSimpleSearchRelatedObjectRelationCriteria();
		destCriteria.relationChild.objectCriteria = 
				this.addResultAttributeType(new EIMSimpleSearchObjectCriteriaBuilder())
				.setConditionGroup({
					op: EIMSearchLogicalOperatorEnum.AND,
					conditions: [
						new EIMSimpleSearchConditionCriteria(
							['baseType', 'definitionName'], 
							EIMSearchOperatorEnum.IN, [EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS, EIMTaskConstantService.OBJECT_TYPE_NAME_TASK])
					]
				})
				.build();

		destCriteria.relationChild.relationCriteria =
				new EIMSimpleSearchRelationCriteriaBuilder()
					.addResultAttributeType(new EIMSimpleSearchRelationResultAttributeType().id().end())
					.setConditionGroup({
						op: EIMSearchLogicalOperatorEnum.AND,
						conditions: [
							new EIMSimpleSearchConditionCriteria(
								new EIMSimpleSearchRelationConditionLeftAttributeType().type().definitionName().end(), 
								EIMSearchOperatorEnum.IN, [EIMTaskConstantService.RELATION_TYPE_NAME_TASK])
						]
					})
					.build();

		if (parentObjectId) {
			destCriteria.relationChild.srcObjectCriteria = 
			new EIMSimpleSearchObjectCriteriaBuilder()
				.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
				.setConditionGroup({
					op: EIMSearchLogicalOperatorEnum.AND,
					conditions: [
						new EIMSimpleSearchConditionCriteria(['id'], EIMSearchOperatorEnum.EQ, parentObjectId)
					]
				})
				.build();
		}

		return destCriteria;
	}

	/**
	 * ビルダに取得対象のオブジェクト返却項目を追加します.
	 * 
	 * @param builder ビルダ
	 */
	private addResultAttributeType(builder: EIMSimpleSearchObjectCriteriaBuilder): EIMSimpleSearchObjectCriteriaBuilder {

		builder
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().type().definitionName().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().status().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().security().id().end())
			// プロジェクト進捗状況
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_PROGRESS).end())
			// 進捗率
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE).end())
			// 開始予定日
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE).end())
			// 終了予定日
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE).end())
			// 完了日
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE).end())
			// 担当
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE).end())
			// 無効フラグ
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_DISABLED_FLAG).end())
			// プロセス(マスタ)
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROCESS_MASTER).end())
			// タスク(マスタ)
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TASK_MASTER).end());

		return builder;
	}

	/**
	 * プロセスとタスク取得時の拡張パラメータを返却します.
	 * 
	 * @return 拡張パラメータ
	 */
	private getExParamenter(): object {

		return {
			includeAssign: true,
			[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ACCESS_ROLE_TYPE_NAME_MAP]: {
				[EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT]: 
						[EIMConstantService.PROC_DEFNAME_CREATE],
				[EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS]: 
						[EIMConstantService.PROC_DEFNAME_CREATE, EIMConstantService.PROC_DEFNAME_DELETE],
				[EIMTaskConstantService.OBJECT_TYPE_NAME_TASK]: 
						[EIMConstantService.PROC_DEFNAME_UPDATE, EIMConstantService.PROC_DEFNAME_DELETE]
			},
			[EIMTaskConstantService.PLUG_IN_PARAM_NAME_INCLUDE_PROGRESS_AND_SCHEDULE]: true,
		};
	}

	/**
	 * プロジェクトツリーノードを初期化します.
	 * @param selectedTreeNodeIdPath ツリーノードIDパス
	 */
	private setRootTreeNodes(selectedTreeNodeIdPath: string[] = null): void {

		const apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.resultConverterId = 'treeFormatResultDTOConverter';

		// プロジェクト取得条件設定
		const projectCriteriaBuilder: EIMSimpleSearchObjectCriteriaBuilder = new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().type().definitionName().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().status().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().security().id().end())
			// プロジェクト進捗状況
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_PROGRESS).end())
			// 進捗率
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE).end())
			// 開始予定日
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE).end())
			// 終了予定日
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE).end())
			// 完了日
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE).end())

		if (this.workspaceId) {

			// 親階層をIDで絞る
			projectCriteriaBuilder.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(
						new EIMSimpleSearchObjectConditionLeftAttributeType().id().end(), EIMSearchOperatorEnum.EQ, this.workspaceId)]
			});

		} else {

			// 親階層をオブジェクトタイプで絞る
			projectCriteriaBuilder.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(
						new EIMSimpleSearchObjectConditionLeftAttributeType().baseType().definitionName().end(),
						EIMSearchOperatorEnum.EQ, 'ワークスペース')]
			});

		}
		apiParam.objectCriteria = projectCriteriaBuilder.build();
		
		// 子階層取得条件設定
		apiParam.relatedObjectCriterias = [];
		// TODO：選択ツリー展開時、初回に開く階層数はINITIAL_LEVELまで展開するか
		// if (selectedTreeNodeIdPath && selectedTreeNodeIdPath.length > EIMTaskManagerComponent.INITIAL_LEVEL) {
		if (selectedTreeNodeIdPath && selectedTreeNodeIdPath.length > 1) {

			for (let i = 0; i < selectedTreeNodeIdPath.length - 1; i++) { // 配列の最後は選択するツリーノードのため無視
				const parentObjectId = this.treeNodeService.convertTreeNodeIdToObjectId(selectedTreeNodeIdPath[i]);
				apiParam.relatedObjectCriterias.push(this.createChildRelatedObjectCriteria(parentObjectId));
			}

		} else {

			// 表示するプロジェクトが絞られている場合は指定階層まで取得
			if (this.workspaceId && EIMTaskManagerComponent.INITIAL_LEVEL > 1) {
				apiParam.relatedObjectCriterias.push(this.createChildRelatedObjectCriteria());
				apiParam.repeatRelatedObjectCriteriasNum = EIMTaskManagerComponent.INITIAL_LEVEL - 1;
			}

		}

		apiParam.exParameter = this.getExParamenter();

		// プロジェクトツリー情報取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const treeFormatResult: EIMTreeFormatResultDTO =
					this.jsonToTreeFormatResultDTOConverterService.convert(res, [this.baseObjectTypeNameComparator, this.defaultComparator]);
			
			// プロセスが保持しない属性値（進捗率/開始予定日/終了予定日/完了日）をexAttributeMapから設定
			this.appendTreeNodeAttributes(treeFormatResult.treeNodes, selectedTreeNodeIdPath);
			
			this.taskGanttChart.setTreeFormatResult(treeFormatResult);

			this.taskGanttChart.initialized.emit();
		});
	}

	/**
	 * 子ツリーノードをDBから取得しツリーに設定します.
	 * 選択するツリーノードの指定があればツリーノードを選択します.
	 * 
	 * @param parentTreeNode 設定対象の親ツリーノード
	 * @param treeNodesToSelect 選択するツリーノード
	 */
	private setChildTreeNodes(parentTreeNode: EIMDataGridTreeNode, treeNodesToSelect: EIMGanttChartTreeNode[] = null): void {

		// 親オブジェクト取得条件設定
		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.resultConverterId = 'treeFormatResultDTOConverter';

		apiParam.objectCriteria = new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(
					new EIMSimpleSearchObjectConditionLeftAttributeType().id().end(), EIMSearchOperatorEnum.EQ, parentTreeNode.dto.id)]
			})
			.build();
		
		// 子階層取得条件設定
		apiParam.relatedObjectCriterias = [this.createChildRelatedObjectCriteria()];

		apiParam.exParameter = this.getExParamenter();

		// プロジェクトツリー情報取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const treeFormatResult: EIMTreeFormatResultDTO =
					this.jsonToTreeFormatResultDTOConverterService.convert(res, [this.baseObjectTypeNameComparator, this.defaultComparator]);
			
			// プロセスが保持しない属性値（進捗率/開始予定日/終了予定日/完了日）をexAttributeMapから設定
			this.appendTreeNodeAttributes(treeFormatResult.treeNodes);
			
			this.taskGanttChart.setChildTreeFormatResult(treeFormatResult);

			if (this.isTaskEditMode === true) {
				// 編集モード用に複製したDTOを退避する
				const updatedParentTreeNode = this.taskGanttChart.getTreeNodeByTreeNodeId(parentTreeNode.treeNodeId);
				const childTreeNodes = updatedParentTreeNode.childTreeNodes;
				const clonedChildTreeNodes = cloneDeep(childTreeNodes);
				this.taskTreeNodes = this.taskTreeNodes.concat(clonedChildTreeNodes);
			}

			// ツリーノードを選択状態にする
			if (treeNodesToSelect !== null) {
				this.selectTreeNode(treeNodesToSelect);
			}

			this.taskGanttChart.initialized.emit();
		});
	}

	/**
	 * プロセス登録、タスク登録、タスク複製時、ツリーへ登録データを追加します.<br>
	 * 登録データをDBから取得しなおすことで表示に必要な情報を取得します.
	 * 
	 * @param createDTO 登録データ情報DTO
	 * @param parentDTO 親データ情報DTO(ワークスペースの場合はnullをして)
	 */
	protected addTreeNodes(createDTO: EIMSimpleObjectDTO, parentDTO: EIMSimpleObjectDTO = null): void {
		
		const apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.resultConverterId = 'treeFormatResultDTOConverter';

		// オブジェクト取得条件設定
		const objectCriteriaBuilder: EIMSimpleSearchObjectCriteriaBuilder = 				
			this.addResultAttributeType(new EIMSimpleSearchObjectCriteriaBuilder())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(
						new EIMSimpleSearchObjectConditionLeftAttributeType().id().end(), EIMSearchOperatorEnum.EQ, createDTO.id)]
			});
		apiParam.objectCriteria = objectCriteriaBuilder.build();
		
		// 子階層取得条件設定
		apiParam.relatedObjectCriterias = [];

		apiParam.exParameter = this.getExParamenter();

		// プロジェクトツリー情報取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const treeFormatResult: EIMTreeFormatResultDTO =
					this.jsonToTreeFormatResultDTOConverterService.convert(res, [this.baseObjectTypeNameComparator, this.defaultComparator]);

			// ルート階層に追加する場合
			if (parentDTO === null) {

				const rootDTO = treeFormatResult.treeNodes[0].dto;

				const rootTreeNode: EIMGanttChartTreeNode = this.taskGanttChart.convertDTOToTreeNode(rootDTO);
				const rootTreeNodes: EIMGanttChartTreeNode[] = this.taskGanttChart.getData() as EIMGanttChartTreeNode[];
				const childTreeNodeIndex = rootTreeNodes ? rootTreeNodes.length : 0;

				this.taskGanttChart.setChildTreeNodesToIndex(null, [rootTreeNode], childTreeNodeIndex);

				// 追加したツリーノードを選択状態にする
				this.selectTreeNode([rootTreeNode]);
			}
			// ルート階層以外に追加する場合
			else {
				const parentTreeNode = this.taskGanttChart.getTreeNodeByDTO(parentDTO);
				const childDTO = treeFormatResult.treeNodes[0].dto;
				const childTreeNode = this.taskGanttChart.convertDTOToTreeNode(childDTO);

				// 子階層をまだ読み込んでいない場合
				if (parentTreeNode.childTreeNodes === null) {
					// 子を取得して表示
					this.setChildTreeNodes(parentTreeNode, [childTreeNode]);

				// 子階層を読み込み済みな場合
				} else {

					childTreeNode.childTreeNodes = [];
					this.taskGanttChart.setChildTreeNodesToIndex(parentTreeNode, [childTreeNode]);

					// 追加したツリーノードを選択状態にする
					this.selectTreeNode([childTreeNode]);
				}
			}
		});
	}

	/**
	 * 更新データを置き換えます.<br>
	 * 更新データをDBから取得しなおすことで表示に必要な情報を取得します.
	 * 
	 * @param updatedDTOs 置き換え対象のDTOリスト
	 */
	private replaceTreeNodes(updatedDTOs: EIMSimpleObjectDTO[]): void {

		if (updatedDTOs === null || updatedDTOs.length === 0) {
			return;
		}

		// 取得対象のオブジェクトID配列を作成
		const ids: number[] = [];
		for (let updatedDTO of updatedDTOs) {

			ids.push(updatedDTO.id);
		}
		// オブジェクト取得条件設定
		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.resultConverterId = 'treeFormatResultDTOConverter';

		apiParam.objectCriteria = 
			this.addResultAttributeType(new EIMSimpleSearchObjectCriteriaBuilder())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(
					new EIMSimpleSearchObjectConditionLeftAttributeType().id().end(), EIMSearchOperatorEnum.IN, ids)]
			})
			.build();
		
		apiParam.exParameter = this.getExParamenter();

		// ツリー情報取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const treeFormatResult: EIMTreeFormatResultDTO =
					this.jsonToTreeFormatResultDTOConverterService.convert(res, [this.baseObjectTypeNameComparator, this.defaultComparator]);
			
			// プロセスが保持しない属性値（進捗率/開始予定日/終了予定日/完了日）をexAttributeMapから設定
			this.appendTreeNodeAttributes(treeFormatResult.treeNodes);
			
			for (const treeNode of treeFormatResult.treeNodes) {

				// データ反映
				const oldTreeNode = this.taskGanttChart.getTreeNodeByDTO(treeNode.dto);
				const newTreeNode = this.taskGanttChart.convertDTOToTreeNode(treeNode.dto);
				newTreeNode.leaf = oldTreeNode.leaf;
				newTreeNode.expanded = oldTreeNode.expanded;
				this.taskGanttChart.updateTreeNodes([newTreeNode]);
	
			}
		});
	}

	/**
	 * ツリーノードを選択します.
	 * 
	 * @param treeNodes 選択対象のツリーノードリスト
	 */
	private selectTreeNode(treeNodes: EIMGanttChartTreeNode[]): void {

		this.taskGanttChart.select(treeNodes, true);
		const selectedTreeNode = this.taskGanttChart.getSelectedData()[0];
		this.selectedDTO = selectedTreeNode.dto;
		this.updateMenuItems();

	}

	/**
	 * データ取得後のツリーノードに付加属性を追加します.
	 * 
	 * @param treeNodes ツリーノードリスト
	 * @param selectedTreeNodeIdPath ツリーノードIDパス
	 */
	private appendTreeNodeAttributes(treeNodes: EIMTreeNodeDTO[], selectedTreeNodeIdPath: string[] = null): void {

		this.treeNodeService.updateTreeNodes(treeNodes, (treeNodeDTO: EIMTreeNodeDTO, level: number) => {

			const dto: EIMSimpleObjectDTO = treeNodeDTO.dto;

			// ワークスペース、プロセスが保持しない属性値（進捗率/開始予定日/終了予定日/完了日）をexAttributeMapから設定
			if (dto.exAttributeMap['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT 
				|| dto.exAttributeMap['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS) {

				const attributes = [
					{ key: 'progressRate', attr: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE, valueType: 'LONG' },
					{ key: 'minStartDate', attr: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE, valueType: 'DATE' },
					{ key: 'maxEndDate', attr: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE, valueType: 'DATE' },
					{ key: 'maxCompletionDate', attr: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE, valueType: 'DATE' }
				];

				attributes.forEach(({ key, attr, valueType }) => {
					if (dto.exAttributeMap[key]) {
						if (dto.attributeMap[attr]) {
							dto.attributeMap[attr].values = [dto.exAttributeMap[key]];
						} else {
							dto.attributeMap[attr] = {
								valueType: valueType,
								values: dto.exAttributeMap[key]
							};
						}
					}
				});
			}

			// 取得対象ルート以外の子階層の有無（childTreeNodes）をクリア
			if (selectedTreeNodeIdPath && level < selectedTreeNodeIdPath.length) {
				const pathTreeNodeId = selectedTreeNodeIdPath?.[level - 1] ?? '';
				if (this.treeNodeService.convertObjectDTOToTreeNodeId(treeNodeDTO.dto) !== pathTreeNodeId) {
					// 子階層がない設定をクリア
					treeNodeDTO.childTreeNodes = null;
				}
			}
		});		
	}

	/**
	 * タスク一覧の表示カラムを設定します.
	 */
	private setTaskDataGridColumns(): void {
		let columns: EIMDataGridColumn[] = [];

		// 名称
		columns.push({fieldPath: ['dto', 'name'], headerName: this.translateService.instant('EIM_TASKS.LABEL_02016'), width: 300,
			cellRendererFramework: EIMValueRendererComponent, pinned: true, lockPinned: true, suppressMovable: true,
			// headerClass: 'eim-editable-column-header',
			cellRendererParams: {
				iconClassFunctions: [
					this.taskIconClassFunctionService.iconClassFunction.bind(this.taskIconClassFunctionService)
				],
				linkableFunction: (dto: EIMSimpleObjectDTO): boolean => { return this.getInvalidFlag(dto) !== 1},
				onClickLinkFunction: this.onClickLink.bind(this),
				enableTreeView: true,
				isDispMouseOverMenu: true
			}

		});

		// 開始予定日
		columns.push({
			fieldPath: ['dto', 'attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE, 'values'],
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02014'), width: 100,
			type: EIMDataGridColumnType.date,
 			cellRendererFramework: EIMCalendarInputRendererComponent,
			cellRendererParams: {
				editableFunction: (treeNode: EIMGanttChartTreeNode) => {
					return (
						treeNode.dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK &&
						(treeNode.dto.exAttributeMap?.['accessRoleTypeNameMap']?.['UPDATE'] ?? false) === true  &&
						(treeNode.dto.status?.type?.base?.id ?? 0) !== EIMTaskConstantService.STATUS_TYPE_KIND_ID_DONE &&
						this.isTaskEditMode)
				},
				onChangeFunction: this.onChangeValue.bind(this),
				validateFunction: (params: any): boolean => {

					return this.validateForBulkUpdate(params.data.dto);
				}
			}
		});
		
		// 終了予定日
		columns.push({
			fieldPath: ['dto', 'attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE, 'values'],
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02015'), width: 100,
			type: EIMDataGridColumnType.date,
			cellRendererFramework: EIMCalendarInputRendererComponent,
			cellRendererParams: {
				editableFunction: (treeNode: EIMGanttChartTreeNode) => {
					return (
						treeNode.dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK &&
						(treeNode.dto.exAttributeMap?.['accessRoleTypeNameMap']?.['UPDATE'] ?? false) === true  &&
						(treeNode.dto.status?.type?.base?.id ?? 0) !== EIMTaskConstantService.STATUS_TYPE_KIND_ID_DONE &&
						this.isTaskEditMode)
				},
				onChangeFunction: this.onChangeValue.bind(this),
				validateFunction: (params: any): boolean => {

					return this.validateForBulkUpdate(params.data.dto);
				}
			}
		});

		// ステータス
		columns.push({
			fieldPath: ['dto', 'status', 'type', 'name'],
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02017'), width: 150,
			cellRendererFramework: EIMValueRendererComponent,
			valueGetter: function(params) {
				const dto = params.data.dto;

				// プロジェクト進捗状況
				const projectProgress = dto.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_PROGRESS]?.['values']?.[0] ?? null;
				if (projectProgress !== null) {
					const mapObject = this.configService.get('tasks.projectProgressIdToResourceId');
					return this.translateService.instant(mapObject[String(projectProgress)]);
				}

				// 進捗率
				const progressRate = dto.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE]?.['values']?.[0] ?? 0;
				const now = new Date();
				now.setHours(0, 0, 0, 0);
				
				const getYoteiDate = (attribute: string): Date => {
					const attrValue = dto.attributeMap?.[`app.task.dev:${attribute}`]?.['values'][0];
					if (!attrValue) return now;
					const attrDate = new Date(attrValue);
					return new Date(attrDate.getFullYear(), attrDate.getMonth(), attrDate.getDate());
				};
				
				const startYoteiDate = getYoteiDate('開始予定日');
				const endYoteiDate = getYoteiDate('終了予定日');
				
				if ((startYoteiDate < now && progressRate === 0) || (endYoteiDate < now && progressRate !== 100)) {

					// プロセスの場合
					if (dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS) {
						return this.translateService.instant('EIM_TASKS.LABEL_02075'); // 遅延中
					}
					// タスクの場合
					else if (dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK) {
						const dispStatus = dto.status?.type?.name ?? '';
						return `${dispStatus}` + this.translateService.instant('EIM_TASKS.LABEL_02076');	// (遅延中)
					}
				}
				
				// プロセスの場合
				if (dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS) {
					// 進捗率
					const progressRate = dto.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE]?.['values'][0] ?? 0;

					const mapObject = this.configService.get('tasks.processProgressRateToResourceId');
					for (const key in mapObject) {
						const maxProgressRate = Number(key);
						if (maxProgressRate < progressRate) {
							continue;
						}

						return this.translateService.instant(mapObject[key]);
					}
				}
				
				// タスクの場合
				if (dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK) {
					return dto.status?.type?.name ?? '-';
				}
				
				return '';
			}.bind(this),
			comparators: [
				// ステータスタイプのシーケンスでソート
				(valueA: any, valueB: any, rowNodeA: RowNode, rowNodeB: RowNode): number => {

					return (rowNodeA.data.dto.status?.type?.sequence ?? -1) - (rowNodeB.data.dto.status?.type?.sequence?? -1);
				},
				// 開始予定日でソート
				(valueA: any, valueB: any, rowNodeA: RowNode, rowNodeB: RowNode): number => {

					return this.dateServce.dateComparator(
						rowNodeA.data.dto?.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE]?.values?.[0] ?? null, 
						rowNodeB.data.dto?.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE]?.values?.[0] ?? null);
				}
			],
			cellRendererParams: {
				styleFunctions:  [
					(treeNode: any): string => {

						const dto = treeNode.dto;

						if (dto.exAttributeMap?.['baseObjTypeDefName'] === 'ワークスペース') {
							return;
						}

						// タスク進捗率に応じた背景クラス返却
						const progressRate = dto.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE]?.['values'][0] ?? 0;
						const now = new Date();
						now.setHours(0, 0, 0, 0);
						
						const getYoteiDate = (attribute: string): Date => {
							const attrValue = dto.attributeMap?.[`app.task.dev:${attribute}`]?.['values'][0];
							if (!attrValue) return now;
							const attrDate = new Date(attrValue);
							return new Date(attrDate.getFullYear(), attrDate.getMonth(), attrDate.getDate());
						};
						
						const startYoteiDate = getYoteiDate('開始予定日');
						const endYoteiDate = getYoteiDate('終了予定日');
						
						if (progressRate === 100) {
							return 'eim-task-manager-tasks-complete';
						} else if (endYoteiDate < now || (startYoteiDate < now && progressRate === 0)) {
							return 'eim-task-manager-tasks-delay';
						} else if (progressRate > 0) {
							return 'eim-task-manager-tasks-working';
						}
						
						return '';
					}
				]

			}
		});

		// 担当者
		columns.push({
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02041'), width: 300,
			cellRendererFramework: EIMValueRendererComponent,
			valueGetter(params) {
				let assign = params.data.dto.exAttributeMap.assign;
				if (assign) {
					let assignNames = [];
					for (let i = 0; i < assign.length; i++) {
						assignNames.push(assign[i].entryElement.name);
					}
					return assignNames.join('|');
				}

				return '';
			}
		});

		// 担当役割
		columns.push({
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02020'), width: 150,
			cellRendererFramework: EIMValueRendererComponent,
			valueGetter(params) {
				let objectRoles = params.data.dto.exAttributeMap.objectRoles;
				if (objectRoles) {
					let objectRoleNames = [];
					for (let i = 0; i < objectRoles.length; i++) {
						objectRoleNames.push(objectRoles[i].name);
					}
					return objectRoleNames.join('|');
				}

				return '';
			}
		});

		// 進捗率
		columns.push({
			fieldPath: ['dto', 'attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE, 'values'],
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02018'), width: 100,
			type: EIMDataGridColumnType.number,
			cellRendererFramework: EIMProgressBarRendererComponent
		});

		// 完了日
		columns.push({
			fieldPath: ['dto', 'attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE, 'values'],
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02019'), width: 100,
			type: EIMDataGridColumnType.date,
			cellRendererFramework: EIMDateRendererComponent,
		});

		// 有効/無効
		columns.push({
			fieldPath: ['dto', 'attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_DISABLED_FLAG, 'values'],
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02022'), width: 80,
			cellRendererFramework: EIMBooleanSwitchButtonInputRendererComponent,
			cellRendererParams: {
				editableFunction: (treeNode: EIMGanttChartTreeNode) => {
					return (
						treeNode.dto.exAttributeMap?.['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK &&
						(treeNode.dto.exAttributeMap?.['accessRoleTypeNameMap']?.['UPDATE'] ?? false) === true  &&
						(treeNode.dto.status?.type?.base?.id ?? 0) !== EIMTaskConstantService.STATUS_TYPE_KIND_ID_DONE &&
						this.isTaskEditMode)
				},
				onChangeFunction: this.onChangeValue.bind(this),
			}
		});

		this.taskGanttChart.setColumns(columns);

	}

	private createNotifyOptions(): any[] {
		return [
			{label: ' ', value: null},
			{label: '3日前', value: 3},
			{label: '7日前', value: 7},
			{label: '14日前', value: 14},
		];
	}

	/**
	 * タスク情報を一括更新します.
	 *
	 * @param dtos タスク情報リスト
	 */
	protected updateTasks(dtos: EIMSimpleObjectDTO[]): void {

		// タスク情報一括更新パラメータ設定
		let apiParam: EIMObjectAPIServiceUpdateListParam = new EIMObjectAPIServiceUpdateListParam();
		apiParam.dtos = dtos;
		apiParam.updateAttributeTypeDefinitionNamePaths = [
			// 開始予定日
			['attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE],
			// 終了予定日
			['attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE],
			// 有効/無効
			['attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_DISABLED_FLAG]
		];

		// タスク情報一括更新
		this.objectAPIService.updateList(apiParam).subscribe((res: any) => {

			// 画面表示中のデータに変更値を反映
			let destDtos: EIMSimpleObjectDTO[] = this.treeNodeService.getDtos(this.taskTreeNodes);
			const copiedDtos = this.copyDtos(dtos, destDtos);

			// ツリーノード更新
			let updatedTreeNodes: EIMGanttChartTreeNode[] = [];
			for (let i = 0; i < destDtos.length; i++) {
				updatedTreeNodes.push(this.taskGanttChart.convertDTOToTreeNode(destDtos[i]));
			}
			this.taskGanttChart.updateTreeNodes(updatedTreeNodes);

			// コンポーネントで保持しているツリーノードリストを更新後のデータに変更する
			this.taskTreeNodes = this.taskGanttChart.getData();

			this.setTaskEditMode(false);

			// 完了メッセージ表示
			this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00002',
					{value: this.translateService.instant('EIM_TASKS.LABEL_02024')}));
		});
	}

	private copyDtos(srcDtos: EIMSimpleObjectDTO[], destDtos: EIMSimpleObjectDTO[]): EIMSimpleObjectDTO[] {

		let destDtoMap = new Map();
		for (let destDto of destDtos) {
			destDtoMap.set(destDto.id, destDto);
		}

		let retDots: EIMSimpleObjectDTO[] = [];
		for (let srcDto of srcDtos) {
			retDots.push(this.copyDto(srcDto, destDtoMap.get(srcDto.id)));
		}

		return retDots;
	}

	private copyDto(srcDto: EIMSimpleObjectDTO, destDto: EIMSimpleObjectDTO): EIMSimpleObjectDTO {

		let srcAttributeMap = srcDto.attributeMap;
		let destAttributeMap = destDto.attributeMap;

		for (let key in srcAttributeMap) {
			destAttributeMap[key].values = srcAttributeMap[key].values
		}

		return destDto;
	}

	private getPath(node: EIMTreeNode): string {
		let path = '';
		do {
			path = '/' + node.data.name + path;
			node = node.parent;
		} while (node);

		return path;
	}

	/**
	 * ルートオブジェクトタイプ定義名称の比較結果を返却します。
	 * @return 比較結果
	 */
	private baseObjectTypeNameComparator(valueA: EIMTreeNodeDTO, valueB: EIMTreeNodeDTO) {

		const order = {
			[EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT]: 1,
			[EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS]: 2,
			[EIMTaskConstantService.OBJECT_TYPE_NAME_TASK]: 3
		};

		let orderA = order[valueA.dto.exAttributeMap?.['baseObjTypeDefName']];
		orderA = orderA ?? Number.MAX_VALUE;
		let orderB = order[valueB.dto.exAttributeMap?.['baseObjTypeDefName']];
		orderB = orderB ?? Number.MAX_VALUE;
		return orderA - orderB;
	}

	/**
	 * デフォルトの比較結果を返却します。
	 * @return 比較結果
	 */
	private defaultComparator(valueA: EIMTreeNodeDTO, valueB: EIMTreeNodeDTO) {

		return valueA.dto.name - valueB.dto.name;
	}

	/**
	 * タスク一覧の背景クラスを返却します.
	 *
	 * @param params パラメータ
	 * @returns タスク一覧の背景クラス
	 */
	protected getTasksRowClass(dto: EIMSimpleObjectDTO): string {

		// 未変更の値からチェック
		// 有効の場合
		if (this.getInvalidFlag(dto) !== 1) {
			return '';
		}
		// 無効の場合
		return 'eim-task-manager-tasks-invalid-row';
	}

	/**
	 * DTOの無効フラグを返却します.
	 *
	 * @param dto DTO
	 * @returns 無効フラグ0/1
	 */
	protected getInvalidFlag(dto: EIMSimpleObjectDTO): number {
		let invalidFlagValues = dto.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_DISABLED_FLAG]?.['values'] ?? null;
		if (invalidFlagValues === null || invalidFlagValues.length === 0) {
			return 0;
		}

		return invalidFlagValues[0];

	}

	/**
	 * ツリーノードに対して追加でプロパティ設定します.
	 * 
	 * @param treeNode 設定対象のツリーノード
	 * @param dto タスク情報DTO
	 * @returns 設定後のツリーノード
	 */
	protected setAdditionalPropertiesToTreeNodeFunction(treeNode: EIMGanttChartTreeNode, dto: EIMSimpleObjectDTO): EIMGanttChartTreeNode {

		treeNode.leaf = dto.exAttributeMap['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK ? true : false;
		treeNode.type = dto.exAttributeMap['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK ? 'TASK' : 'TASK_GROUP';
		treeNode.startDate = this.getDate(dto, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE);
		treeNode.endDate = this.getDate(dto, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE);
		treeNode.completionPercent = dto.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE]?.['values'][0] ?? 0;

		return treeNode;
	}

	/**
	 * ツリーノードの親子間の関連を設定します.
	 * 
	 * @param parentTreeNode 親ツリーノード
	 * @param childTreeNodes 子ツリーノードリスト
	 */
	protected setAdditionalTreeNodeRelationFunction(parentTreeNode: EIMDataGridTreeNode, childTreeNodes: EIMDataGridTreeNode[]): void {

		if (parentTreeNode 
				&& parentTreeNode.dto.exAttributeMap['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK) {
			parentTreeNode.leaf = true;
		}
	}

	/**
	 * 日付型属性の属性値（日付）を返却します.
	 * @param dto タスク情報DTO
	 * @param attrDefName 属性タイプ定義名称
	 * @returns 日付
	 */
	private getDate(dto: EIMSimpleObjectDTO, attrDefName: string): Date {
		if (dto.attributeMap?.[attrDefName]?.values?.length !== 1) {
			return null;
		}

		return new Date(dto.attributeMap?.[attrDefName].values?.[0]);
	}

	/**
	 * プロジェクト流用ダイアログを表示します.
	 */
	protected openCopyProject() {
	
		this.viewDialogName = 'copyProject';
		this.copyResourceProjectName = this.selectedDTO.name;
		this.createProjectName = this.selectedDTO.name;
	}

	/**
	 * タスク複製ダイアログを表示します.
	 */
	protected openCopyTask() {
	
		this.viewDialogName = 'copyTask';
		this.copyResourceTaskName = this.selectedDTO.name;
		this.createTaskName = this.selectedDTO.name;
	}

	/**
	 * 一括編集時の検証を実施します.
	 * 開始予定日<=終了予定日であることをチェックします.
	 * 
	 * @param dto DTO
	 * @returns 値が有効であればtrue
	 */
	protected validateForBulkUpdate(dto: EIMSimpleObjectDTO): boolean {

		const startDate = dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE].values[0];
		const endDate = dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE].values[0];

		if (startDate === null || endDate === null) {
			return true;
		}

		return (startDate <= endDate);

	}

	/**
	 * ガントチャートのoptionsを初期化します.
	 */
	protected initializeGanttChartOptions(): void {

		this.ganttChartOptions = {
			multiple: true,
			contextMenuItems: this.contentsTreeMenuItems,
			enableTreeView: true,
			setAdditionalPropertiesToTreeNodeFunction: this.setAdditionalPropertiesToTreeNodeFunction.bind(this),
			setAdditionalTreeNodeRelationFunction: this.setAdditionalTreeNodeRelationFunction.bind(this),
			rowClassFunction: this.getTasksRowClass.bind(this),
			defaultFormatItemValue: this.configService.get('tasks.ganttChart.defaultFormatItem.value')
		}
	}
}
