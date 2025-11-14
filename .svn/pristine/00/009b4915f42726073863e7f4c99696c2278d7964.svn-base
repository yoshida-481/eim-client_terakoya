import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, forwardRef } from '@angular/core';

import { EIMBaseTreeNode, EIMComponent, EIMComponentTreeNode, EIMMenuItem } from 'app/shared/shared.interface';
import { MenuItem } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMTreeComponentService } from 'app/shared/components/tree/tree.component.service';
import { EIMObjectAPIService, EIMObjectAPIServiceDeleteListParam, EIMObjectAPIServiceGetListParam } from 'app/shared/services/apis/object-api.service';
import { EIMSimpleSearchObjectCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-object-criteria.builder';
import { EIMSimpleSearchConditionCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-condition.criteria';
import { EIMSearchOperatorEnum } from 'app/shared/domains/search/search-operator-enum';
import { EIMTreeTreeNode } from 'app/shared/components/tree/tree.component';
import { EIMSimpleSearchRelatedObjectCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-related-object.criteria';
import { EIMSimpleSearchRelatedObjectRelationCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-related-object-relation.criteria';
import { EIMSimpleSearchRelationCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-relation-criteria.builder';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMDataGridColumn, EIMDataGridColumnType, EIMDataGridComponent, EIMDataGridTreeNode } from 'app/shared/components/data-grid/data-grid.component';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMTreeFormatResultDTO } from 'app/shared/dtos/tree-format-result.dto';
import { EIMTaskIconClassFunctionService } from 'app/tasks/services/task-icon-class-function.service';
import { EIMTaskMainComponent } from 'app/tasks/tasks.component';
import { EIMSearchLogicalOperatorEnum } from 'app/shared/domains/search/search-logical-operator-enum';
import { EIMSimpleSearchObjectResultAttributeType, EIMSimpleSearchRelationResultAttributeType } from 'app/shared/builders/simple-search/simple-search-result-attribute-type';
import { EIMJsonToTreeFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-tree-format-result-dto-converter.service';
import { EIMJsonToListFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-list-format-result-dto-converter.service';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMTreeNodeDTO } from 'app/shared/dtos/tree-node.dto';
import { EIMTreeNodeService } from 'app/shared/services/tree-node.service';
import { EIMSimpleSearchObjectCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-object.criteria';
import { EIMSimpleSearchRelationCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-relation.criteria';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMGanttChartTreeNode } from 'app/shared/components/gantt-chart/gantt-chart.component';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMCreatedProcessMasterDTO, EIMCreatedProjectMasterDTO, EIMCreatedTaskMasterDTO, EIMUpdatedProcessMasterDTO, EIMUpdatedProjectMasterDTO, EIMUpdatedTaskMasterDTO } from 'app/tasks/tasks.interface';
import { EIMSimpleSearchRelationConditionLeftAttributeType } from 'app/shared/builders/simple-search/simple-search-condition-left-attribute-type';
import { EIMTasksModule } from 'app/tasks/tasks.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';

/**
 * プロジェクトマスタ管理コンポーネント
 * @example
 *
 *      <eim-project-master-manager
 *      >
 *      </eim-project-master-manager>
 */
@Component({
	selector: 'eim-project-master-manager',
	templateUrl: './project-master-manager.component.html',
	styleUrls: ['./project-master-manager.component.scss'],
	imports: [
		CommonModule,
		EIMTasksModule,
		EIMSharedModule,
		TranslatePipe,
	],
	providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMProjectMasterManagerComponent) },],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMProjectMasterManagerComponent implements EIMTaskMainComponent {

	/** 初期表示時の取得階層(1,2,3,...)★1のみ指定可能 */
	static readonly INITIAL_LEVEL = 1;

	/** データグリッド */
	@ViewChild('masterDataGrid', { static: true }) masterDataGrid: EIMDataGridComponent;

	/** 画面識別ID */
	public viewId = 'projectMasterManager';

	/** 表示タブのインデックス */
	public tabIndex = 0;

	/** 表示中のダイアログ名 */
	public viewDialogName = null;

	/** ツリーにて選択中のプロジェクトマスタDTO or プロセスマスタDTO */
	public selectedNode: EIMTreeTreeNode = null;

	/** ツリーにて選択中のプロジェクトマスタDTO or プロセスマスタDTOまでのパス文字列 */
	public selectedPath: string;

	/** データグリッドにて選択中のプロセスマスタDTO or タスクマスタDTO */
	public selectedDataGridDtos: EIMSimpleObjectDTO[] = [];

	/** 状態に保存した選択対象ツリーノード（状態にdataを保持しないためデータ読み込み後に手動で選択する必要がある） */
	protected selectedTreeNodesState: EIMDataGridTreeNode[] = null;

	/* ==========================================================================
     メニューの定義
     ========================================================================== */
	/** プロジェクトマスタ登録 */
	public menuCreateProjectMaster: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), disabled: false, name: 'createProjectMaster', icon: 'eim-icon-plus',
		command: (event) => {this.viewDialogName = 'projectMasterCreator';}};
	/** プロジェクトマスタ更新 */
	public menuUpdateProjectMaster: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, name: 'updateProjectMaster', icon: 'eim-icon-pencil',
		command: (event) => {this.viewDialogName = 'projectMasterUpdator';}};
	/** プロジェクトマスタ削除 */
	public menuDeleteProjectMaster: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, name: 'deleteProjectMaster', icon: 'eim-icon-trash',
		command: (event) => {this.onClickDeleteProjectMaster()}};

	/** プロセスマスタ登録 */
	public menuCreateProcessMaster: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_01009'), disabled: true, name: 'createProcessMaster', icon: 'eim-icon-plus',
		command: (event) => {this.viewDialogName = 'processMasterCreator';}};
	/** プロセスマスタ更新 */
	public menuUpdateProcessMaster: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, name: 'updateProcessMaster', icon: 'eim-icon-pencil',
		command: (event) => {this.viewDialogName = 'processMasterUpdator';}};
	/** プロセスマスタ削除 */
	public menuDeleteProcessMaster: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, name: 'deleteProcessMaster', icon: 'eim-icon-trash',
		command: (event) => {this.onClickDeleteProcessMaster()}};

	/** タスクマスタ登録 */
	public menuCreateTaskMaster: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_01011'), disabled: true, name: 'createTaskMaster', icon: 'eim-icon-plus',
		command: (event) => {this.viewDialogName = 'taskMasterCreator';}};

	/** タスクマスタ更新 */
	public menuUpdateTaskMaster: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, name: 'updateTaskMaster', icon: 'eim-icon-pencil',
		command: (event) => {this.viewDialogName = 'taskMasterUpdator';}};

	/** タスクマスタ削除 */
	public menuDeleteTaskMaster: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, name: 'deleteTaskMaster', icon: 'eim-icon-trash',
		command: (event) => {this.onClickDeleteTaskMaster();}};

	// セパレータ
	public menuSeparator: MenuItem = {separator: true};

	/** マスタメニュー */
	public masterMenuItems: EIMMenuItem[] = [
		// プロジェクトマスタ
		{
			label: this.translateService.instant('EIM_TASKS.LABEL_03020'), name: 'project', icon: 'fa eim-icon-project', items: [
				this.menuCreateProjectMaster,
				this.menuUpdateProjectMaster,
				this.menuDeleteProjectMaster,
			]
		},
		// プロセスマスタ
		{
			label: this.translateService.instant('EIM_TASKS.LABEL_03021'), name: 'process', icon: 'fa eim-icon-process', items: [
				this.menuCreateProcessMaster,
				this.menuUpdateProcessMaster,
				this.menuDeleteProcessMaster,
			]
		},
		// タスクマスタ
		{
			label: this.translateService.instant('EIM_TASKS.LABEL_03026'), name: 'task', icon: 'fa eim-icon-task', items: [
				this.menuCreateTaskMaster,
				this.menuUpdateTaskMaster,
				this.menuDeleteTaskMaster,
			]
		}
	];

	/** コンテンツツリーコンテキストメニュー */
	public contextMenuCreateProcessMaster: EIMMenuItem = {
		label: 'プロセスマスタ登録', rKey: 'EIM.LABEL_03003', name: 'createProcessMaster', icon: 'eim-icon-plus', 
		command: (event) => {this.onClickProcessCreate()}}
	public contextMenuCreateTaskMaster: EIMMenuItem = {
		label: 'タスクマスタ登録', rKey: 'EIM.LABEL_03003', name: 'createTaskMaster', icon: 'eim-icon-plus', 
		command: (event) => {this.onClickTaskCreate()}};
	public contentsTreeMenuItems: EIMMenuItem[] = [];
	/**
	 * コンストラクタです.
	 */
	constructor(
		public treeComponentService: EIMTreeComponentService,
		protected translateService: TranslateService,
		protected objectAPIService: EIMObjectAPIService,
		protected taskIconClassFunctionService: EIMTaskIconClassFunctionService,
		protected dataGridComponentService: EIMDataGridComponentService,
		protected messageService: EIMMessageService,
		protected jsonToTreeFormatResultDTOConverterService: EIMJsonToTreeFormatResultDTOConverterService,
		protected jsonToListFormatResultDTOConverterService: EIMJsonToListFormatResultDTOConverterService,
		protected treeNodeService: EIMTreeNodeService,
		protected cacheService: EIMCacheService
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
	 * ツリーノードの親子間の関連を設定します.
	 * 
	 * @param parentTreeNode 親ツリーノード
	 * @param childTreeNodes 子ツリーノードリスト
	 */
	public setAdditionalTreeNodeRelationFunction(parentTreeNode: EIMDataGridTreeNode, childTreeNodes: EIMDataGridTreeNode[]): void {

		if (parentTreeNode 
				&& parentTreeNode.dto.exAttributeMap['baseObjTypeDefName'] === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER) {
			parentTreeNode.leaf = true;
		}
	}
	
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
		changeLabel(this.masterMenuItems);
		let newMenuItems: EIMMenuItem[] = Object.assign([], this.masterMenuItems);
		this.masterMenuItems = newMenuItems;
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {

		if (state) {

			// プロジェクトマスタツリーの表示状態を復元
			if (state.masterDataGrid) {
				this.masterDataGrid.setState(state.taskGanttChart);

				// 選択状態はデータ読み込み後に反映するため退避
				this.selectedTreeNodesState = state.masterDataGrid?.selectedData ?? null;
			}

		}

		// ツリー階層読み込み
		this.setRootTreeNodes(state?.masterDataGrid?.selectedTreeNodeIdPath ?? null);

		// プロジェクトマスタツリー読み込み完了
		const treeInitialized = this.masterDataGrid.initialized.subscribe(() => {
			treeInitialized.unsubscribe();

			// ノード選択
			window.setTimeout(() => {
				// ガントチャート
				if (this.selectedTreeNodesState) {
					this.masterDataGrid.select(this.selectedTreeNodesState);
					this.selectedTreeNodesState = null;
				}
			});

		});
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		const masterDataGridState = this.masterDataGrid.getState();
		masterDataGridState.data = null; // データは保持しない
		if (this.selectedTreeNodesState) {
			// setState()にてデータ読み込み完了時に選択状態を設定する。
			// 上記の選択処理前にgetState()が呼ばれた場合、状態に設定された選択状態を設定する。
			masterDataGridState.ganttChartDataGrid.selectedData = this.selectedTreeNodesState;
		}

		return {
			masterDataGrid: masterDataGridState,
		};
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		this.initTaskDataGridColumns();
	}

	public onChangeTab(event){}

	/**
	 * データグリッド選択イベントハンドラです.
	 *
	 * @param event イベント
	 */
	public onChangedTreeNode(event: any): void {

		const selectedNodes = this.masterDataGrid.getSelectedData();
		if (selectedNodes && selectedNodes.length > 0) {
			this.selectedNode = selectedNodes[0];
		} else {
			this.selectedNode = null;
		}
		this.selectedPath = this.getPath(this.selectedNode);
		// this.selectedNode.expanded = true;

		// メニューの活性状態切替
		this.updateMenuItems();
	}

	/**
	 * 行ダブルクリックイベントハンドラです.
	 *
	 * @param event イベント
	 */
	public onRowDoubleClicked(event: any): void {
		
		switch (event.data.dto.exAttributeMap['baseObjTypeDefName']) {
			case EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER:
				this.viewDialogName = 'projectMasterUpdator';
				break;
			case EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER:
				this.viewDialogName = 'processMasterUpdator';
				break;
			case EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER:
				this.viewDialogName = 'taskMasterUpdator';
				break;
		}
	}

	/**
	 * 業務マスタツリー開閉時のイベントハンドラです.
	 *
	 * @param event イベント
	 */
	public onExpandedTreeNode(event): void {
		const expandedTreeNode: EIMTreeTreeNode = event.expandedData;
		if (expandedTreeNode.childTreeNodes !== null) {
			return;
		}
		this.setChildTreeNodes(expandedTreeNode);
	}
	/**
	 * タスクマスタの登録クリックイベントハンドラです.
	 * コンテンツツリーコンテキストメニューから呼び出されます.
	 */
	public onClickTaskCreate() {
		this.selectedNode = this.masterDataGrid.getSelectedData()[0];
		this.viewDialogName = 'taskMasterCreator';
	}
	/**
	 * プロセスマスタの登録クリックイベントハンドラです.
	 * コンテンツツリーコンテキストメニューから呼び出されます.
	 */
	public onClickProcessCreate() {
		this.selectedNode = this.masterDataGrid.getSelectedData()[0];
		this.viewDialogName = 'processMasterCreator';
	}

	/**
	 * プロジェクトマスタ、または、プロセスマスタの削除クリックイベントハンドラです.
	 * コンテンツツリーコンテキストメニューから呼び出されます.
	 */
	public onClickDelete() {
		this.selectedNode = this.masterDataGrid.getSelectedData()[0];

		// プロジェクト(マスタ)の場合
		if (this.selectedNode.dto.type.definitionName === EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER) {
			this.onClickDeleteProjectMaster();
		} 
		// プロセス(マスタ)の場合
		else if (this.selectedNode.dto.type.definitionName === EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER) {
			this.onClickDeleteProcessMaster();
		}
		// タスク(マスタ)の場合
		else if (this.selectedNode.dto.type.definitionName  === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER) {
			this.onClickDeleteTaskMaster();
		}
	}

	/**
	 * プロジェクトマスタ、または、プロセスマスタの更新クリックイベントハンドラです.
	 * コンテンツツリーコンテキストメニューから呼び出されます.
	 */
	public onClickUpdate() {
		this.selectedNode = this.masterDataGrid.getSelectedData()[0];

		// プロジェクト(マスタ)の場合
		if (this.selectedNode.dto.type.definitionName === EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER) {
			this.viewDialogName = 'projectMasterUpdator';
		}
		// プロセス(マスタ)の場合
		else if (this.selectedNode.dto.type.definitionName  === EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER) {
			this.viewDialogName = 'processMasterUpdator';
		}
		// タスク(マスタ)の場合
		else if (this.selectedNode.dto.type.definitionName  === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER) {
			this.viewDialogName = 'taskMasterUpdator';
		}
	}

	/**
	 * プロジェクトマスタ削除クリックイベントハンドラです.
	 */
	public onClickDeleteProjectMaster() {
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM.CONFIRM_00006' , {value: this.translateService.instant('EIM_TASKS.LABEL_02046')}) ,
			() => {

				const selectedTreeNodes: EIMDataGridTreeNode[] = this.masterDataGrid.getSelectedData();
				const selectedTreeNodeId = this.selectedNode.treeNodeId;

				const type = new EIMObjectTypeDomain();
				type.definitionName = EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER;
				
				const param = new EIMObjectAPIServiceDeleteListParam();
				param.dtos = this.treeNodeService.getDtos(selectedTreeNodes);

				this.objectAPIService.deleteList(param).subscribe((res: any) => {

					this.onDeletedProjectMaster({parentTreeNode: selectedTreeNodes[0].parentTreeNode, deletedTreeNodes: selectedTreeNodes});
				});
			}
		);
	}

	/**
	 * プロセスマスタ削除クリックイベントハンドラです.
	 */
	public onClickDeleteProcessMaster() {
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM.CONFIRM_00006' , {value: this.translateService.instant('EIM_TASKS.LABEL_02047')}) ,
			() => {

				const selectedTreeNodes: EIMDataGridTreeNode[] = this.masterDataGrid.getSelectedData();
				const selectedTreeNodeId = this.selectedNode.treeNodeId;

				const type = new EIMObjectTypeDomain();
				type.definitionName = EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER;
				
				const param = new EIMObjectAPIServiceDeleteListParam();
				param.dtos = this.treeNodeService.getDtos(selectedTreeNodes);

				this.objectAPIService.deleteList(param).subscribe((res: any) => {

					this.onDeletedProcessMaster({parentTreeNode: selectedTreeNodes[0].parentTreeNode, deletedTreeNodes: selectedTreeNodes});
				});
			}
		);
	}

	/**
	 * タスクマスタ削除クリックイベントハンドラです.
	 *
	 */
	public onClickDeleteTaskMaster() {

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM.CONFIRM_00006' , {value: this.translateService.instant('EIM_TASKS.LABEL_02048')}) ,
			() => {

				const selectedTreeNodes: EIMDataGridTreeNode[] = this.masterDataGrid.getSelectedData();

				const type = new EIMObjectTypeDomain();
				type.definitionName = EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER;

				const param = new EIMObjectAPIServiceDeleteListParam();
				param.dtos = this.treeNodeService.getDtos(selectedTreeNodes);

				this.objectAPIService.deleteList(param).subscribe((res: any) => {

					this.onDeletedTaskMaster({parentTreeNode: selectedTreeNodes[0].parentTreeNode, deletedTreeNodes: selectedTreeNodes});
				});
			}
		);
	}

	/**
	 * 名称列リンククリックイベントハンドラです.
	 *
	 * @param dto タスク情報
	 */
	public onClickLink(treeNode: EIMDataGridTreeNode): void {

		this.masterDataGrid.select([treeNode], true);

		this.selectedNode = treeNode;

		switch (treeNode.dto.exAttributeMap['baseObjTypeDefName']) {

			// プロジェクト(マスタ)の場合
			case EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER:
				this.masterDataGrid.expandTreeNode(treeNode, !treeNode.expanded);
				break;
			// プロセス(マスタ)の場合
			case EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER:
				this.masterDataGrid.expandTreeNode(treeNode, !treeNode.expanded);
				break;
			// タスク(マスタ)の場合
			case EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER:
				this.viewDialogName = 'taskMasterUpdator';
				break;
		}
	}

	public onCloseDialog() {
		this.viewDialogName = null;
	}

	/**
	 * プロジェクトマスタ登録完了イベントハンドラ
	 *
	 * @param event プロジェクト登録結果情報
	 */
	public onCreatedProjectMaster(event: EIMCreatedProjectMasterDTO): void {
		
		// ダイアログクローズ
		this.viewDialogName = null;

		// ツリーノード追加表示
		const treeNode: EIMDataGridTreeNode = this.masterDataGrid.convertDTOToTreeNode(event.createdDTO);
		this.masterDataGrid.setChildTreeNodesToIndex(null, [treeNode]);

		// 追加したツリーノードを選択状態にする
		this.masterDataGrid.select([treeNode], true);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00001', {value: this.translateService.instant('EIM_TASKS.LABEL_03020')}));

	}

	/**
	 * プロジェクトマスタ更新完了イベントハンドラ
	 *
	 * @param event プロジェクトマスタ更新結果情報
	 */
	public onUpdatedProjectMaster(event: EIMUpdatedProjectMasterDTO): void {
		
		// ダイアログクローズ
		this.viewDialogName = null;

		// データ反映
		this.updateTreeNode(event.updatedDTO.id);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00002', {value: this.translateService.instant('EIM_TASKS.LABEL_03020')}));
	}

	/**
	 * プロジェクトマスタ削除完了イベントハンドラです.
	 * @param event プロジェクトマスタ削除結果情報
	 */
	public onDeletedProjectMaster(event: {parentTreeNode: EIMDataGridTreeNode, deletedTreeNodes: EIMDataGridTreeNode[]}): void {

		this.masterDataGrid.removeTreeNodes(event.deletedTreeNodes);

		this.updateMenuItems();

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00003', {value: this.translateService.instant('EIM_TASKS.LABEL_03020')}));
	}

	/**
	 * プロセスマスタ登録完了イベントハンドラ
	 *
	 * @param event プロセスマスタ登録結果情報
	 */
	public onCreatedProcessMaster(event: EIMCreatedProcessMasterDTO): void {
		
		// ダイアログクローズ
		this.viewDialogName = null;

		// ツリーに追加表示
		this.appendChildTreeNodes(event.parentDTO, event.createdDTO);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00001', {value: this.translateService.instant('EIM_TASKS.LABEL_03021')}));
	}

	/**
	 * プロセスマスタ更新完了イベントハンドラ
	 *
	 * @param event プロセスマスタ更新結果情報
	 */
	public onUpdatedProcessMaster(event: EIMUpdatedProcessMasterDTO): void {

		// ダイアログクローズ
		this.viewDialogName = null;

		// データ反映
		this.updateTreeNode(event.updatedDTO.id);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00002', {value: this.translateService.instant('EIM_TASKS.LABEL_03021')}));
	}

	/**
	 * プロセスマスタ削除完了イベントハンドラです.
	 * @param event プロセスマスタ削除結果情報
	 */
	public onDeletedProcessMaster(event: {parentTreeNode: EIMDataGridTreeNode, deletedTreeNodes: EIMDataGridTreeNode[]}): void {

		this.masterDataGrid.removeTreeNodes(event.deletedTreeNodes);

		// 上位階層を選択状態にする
		this.masterDataGrid.select([event.parentTreeNode], true);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00003', {value: this.translateService.instant('EIM_TASKS.LABEL_03021')}));
	}

	/**
	 * タスクマスタ登録完了イベントハンドラ
	 *
	 * @param event タスク登録結果情報
	 */
	public onCreatedTaskMaster(event: EIMCreatedTaskMasterDTO): void {

		// ダイアログ消去
		this.viewDialogName = null;

		this.appendChildTreeNodes(event.parentDTO, event.createdDTO);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00001', {value: this.translateService.instant('EIM_TASKS.LABEL_03026')}));

	}

	/**
	 * タスクマスタ更新完了イベントハンドラ
	 *
	 * @param event タスク更新結果情報
	 */
	public onUpdatedTaskMaster(event: EIMUpdatedTaskMasterDTO): void {

		// ダイアログ消去
		this.viewDialogName = null;

		// データ反映
		this.updateTreeNode(event.updatedDTO.id);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00002', {value: this.translateService.instant('EIM_TASKS.LABEL_03026')}));
	}

	/**
	 * タスクマスタ削除完了イベントハンドラです.
	 * @param event タスクマスタ削除結果情報
	 */
	public onDeletedTaskMaster(event: {parentTreeNode: EIMDataGridTreeNode, deletedTreeNodes: EIMDataGridTreeNode[]}): void {

		this.masterDataGrid.removeTreeNodes(event.deletedTreeNodes);

		// 上位階層を選択状態にする
		this.masterDataGrid.select([event.parentTreeNode], true);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant(
			'EIM_TASKS.INFO_00003', {value: this.translateService.instant('EIM_TASKS.LABEL_03026')}));
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * プロジェクトマスタツリーを初期化します.
	 * 
	 * @param selectedTreeNodeIdPath ツリーノードIDパス
	 */
	private setRootTreeNodes(selectedTreeNodeIdPath: string[] = null): void {

		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.resultConverterId = 'treeFormatResultDTOConverter';

		// プロジェクトマスタ取得条件設定
		apiParam.objectCriteria = new EIMSimpleSearchObjectCriteriaBuilder()
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(['type', 'definitionName'], 
						EIMSearchOperatorEnum.EQ, EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER)
				]
			})
			.build();

		// 子階層取得条件設定
		apiParam.relatedObjectCriterias = [];
		if (selectedTreeNodeIdPath && selectedTreeNodeIdPath.length > 1) {

			for (let i = 0; i < selectedTreeNodeIdPath.length - 1; i++) { // 配列の最後は選択するツリーノードのため無視
				const parentObjectId = this.treeNodeService.convertTreeNodeIdToObjectId(selectedTreeNodeIdPath[i]);
				apiParam.relatedObjectCriterias.push(this.createChildRelatedObjectCriteria(parentObjectId));
			}

		} else {

			if (EIMProjectMasterManagerComponent.INITIAL_LEVEL > 1) {
				apiParam.relatedObjectCriterias.push(this.createChildRelatedObjectCriteria());
				apiParam.repeatRelatedObjectCriteriasNum = EIMProjectMasterManagerComponent.INITIAL_LEVEL - 1;
			}
		}

		// プロジェクトマスタツリー情報取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const treeFormatResult: EIMTreeFormatResultDTO = 
					this.jsonToTreeFormatResultDTOConverterService.convert(res, [this.baseObjectTypeNameComparator, this.defaultComparator]);

			this.appendTreeNodeAttributes(treeFormatResult.treeNodes, selectedTreeNodeIdPath);

			// 初期化完了イベント発行
			this.masterDataGrid.setTreeFormatResult(treeFormatResult);
			this.masterDataGrid.initialized.emit();
		});
	}

	/**
	 * 子ツリーノードをDBから取得しツリーに設定します.
	 * @param parentTreeNode 設定対象の親ツリーノード
	 */
	private setChildTreeNodes(parentTreeNode: EIMDataGridTreeNode): void {

		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.resultConverterId = 'treeFormatResultDTOConverter';

		// 親オブジェクト取得条件設定
		apiParam.objectCriteria = new EIMSimpleSearchObjectCriteriaBuilder()
				.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
				.setConditionGroup({
					op: EIMSearchLogicalOperatorEnum.AND,
					conditions: [
						new EIMSimpleSearchConditionCriteria(['id'], EIMSearchOperatorEnum.EQ, parentTreeNode.dto.id)
					]
				})
				.build();

		// 子階層取得条件設定
		apiParam.relatedObjectCriterias = [];
		apiParam.relatedObjectCriterias.push(this.createChildRelatedObjectCriteria());

		// プロジェクトマスタツリー情報取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const treeFormatResult: EIMTreeFormatResultDTO = 
					this.jsonToTreeFormatResultDTOConverterService.convert(res, [this.baseObjectTypeNameComparator, this.defaultComparator]);

			// 初期化完了イベント発行
			this.masterDataGrid.setChildTreeFormatResult(treeFormatResult);
			this.masterDataGrid.initialized.emit();
		});
	}

	/**
	 * ツリーノードをDBから取得した値で更新します.
	 * @param id オブジェクトID
	 */
	private updateTreeNode(id: number): void {

		// データ反映
		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.objectCriteria =
					this.addResultAttributeTypeForColumns(new EIMSimpleSearchObjectCriteriaBuilder())
					// 作業内容
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
						.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT).end())
					.setConditionGroup({
						op: EIMSearchLogicalOperatorEnum.AND,
						conditions: [
							new EIMSimpleSearchConditionCriteria(['id'], EIMSearchOperatorEnum.EQ, id)
						]
					})
					.build();

		// プロジェクトマスタツリー情報取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);

			const oldTreeNode = this.masterDataGrid.getTreeNodeByDTO(listFormatResult.dtos[0]);
			const newTreeNode = this.masterDataGrid.convertDTOToTreeNode(listFormatResult.dtos[0]);
			newTreeNode.leaf = oldTreeNode.leaf;
			newTreeNode.expanded = oldTreeNode.expanded;
			this.masterDataGrid.updateTreeNodes([newTreeNode]);

		});
	}

	/**
	 * プロジェクトマスタ一覧のデータグリッドカラムを初期化します.
	 */
	private initTaskDataGridColumns(): void {
		let columns: EIMDataGridColumn[] = [];

		// プロジェクトマスタ名
		columns.push({fieldPath: ['dto', 'name'], headerName: this.translateService.instant('EIM_TASKS.LABEL_02016'), width: 300,
			cellRendererFramework: EIMValueRendererComponent,
			// headerClass: 'eim-editable-column-header',
			cellRendererParams: {
				iconClassFunctions: [
					this.taskIconClassFunctionService.iconClassFunction.bind(this.taskIconClassFunctionService)
				],
				linkableFunction: (dto: EIMSimpleObjectDTO): boolean => { return true; },
				onClickLinkFunction: this.onClickLink.bind(this),
				enableTreeView: true,
				isDispMouseOverMenu: true
			}
		});

		// 作業内容
		columns.push({
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02040'), width: 600,
			fieldPath: ['dto', 'attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT, 'values'], 
			type: EIMDataGridColumnType.text, suppressFilter: true
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

		// 作成者
		columns.push({fieldPath: ['dto', 'creationUser', 'name'], headerName: this.translateService.instant('EIM.LABEL_02030'), width: 120});

		// 作成日時
		columns.push(this.dataGridComponentService.createAttributeColumn(
			this.translateService.instant('EIM.LABEL_02031'), 'DATE', ['dto', 'creationDate']));

		// 更新者
		columns.push({fieldPath: ['dto', 'modificationUser', 'name'], headerName: this.translateService.instant('EIM.LABEL_02032'), width: 120});

		// 更新日時
		columns.push(this.dataGridComponentService.createAttributeColumn(
			this.translateService.instant('EIM.LABEL_02033'), 'DATE', ['dto', 'modificationDate']));

		this.masterDataGrid.setColumns(columns);

	}

	/**
	 * プロジェクトマスタのノード情報から生成したパス文字列を返却します.
	 * @param node ノード情報
	 * @returns パス文字列
	 */
	private getPath(node: EIMTreeTreeNode): string {
		let path = '';
		do {
			path = '/' + node.dto.name + path;
			node = node.parentTreeNode;
		} while (node);

		return path;
	}

	/**
	 * メニューの活性状態の切替.
	 * @param menuItems 対象メニューアイテムリスト
	 * @param name 選択対象メニュー名称
	 * @return 選択対象メニューアイテム
	 */
	private updateMenuItems() {

		const selectedTreeNodes = this.masterDataGrid.getSelectedData();

		// タスクマスタ管理の管理者権限を保持しているかどうか
		const hasbizMasterAdminAuthority = this.cacheService.getHasAuthId()?.bizMaster ?? false;

		// メニュー無効化
		this.menuCreateProjectMaster.disabled = true;
		this.menuUpdateProjectMaster.disabled = true;
		this.menuDeleteProjectMaster.disabled = true;

		this.menuCreateProcessMaster.disabled = true;
		this.menuUpdateProcessMaster.disabled = true;
		this.menuDeleteProcessMaster.disabled = true;

		this.menuCreateTaskMaster.disabled = true;
		this.menuUpdateTaskMaster.disabled = true;
		this.menuDeleteTaskMaster.disabled = true;

		this.contextMenuCreateProcessMaster.disabled = true;
		this.contextMenuCreateTaskMaster.disabled = true;

		// メニュー有効化
		this.menuCreateProjectMaster.disabled = false;

		// プロジェクト(マスタ)選択時
		if (selectedTreeNodes.length === 1 &&
				this.selectedNode?.dto?.type?.['definitionName'] === 
				EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER &&
				hasbizMasterAdminAuthority) {

			// プロジェクトマスタの更新、削除を有効化
			this.menuUpdateProjectMaster.disabled = false;

			// プロセスマスタの登録を有効化
			this.menuCreateProcessMaster.disabled = false;
			this.contextMenuCreateProcessMaster.disabled = false;

			// タスクマスタの登録を有効化
			this.menuCreateTaskMaster.disabled = false;
			this.contextMenuCreateTaskMaster.disabled = false;

		}
		// プロセス(マスタ)の場合
		else if (selectedTreeNodes.length === 1 &&
				this.selectedNode?.dto?.type?.['definitionName'] === 
				EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER &&
				hasbizMasterAdminAuthority) {

			// プロセスマスタの登録、更新、削除を有効化
			this.menuCreateProcessMaster.disabled = false;
			this.menuUpdateProcessMaster.disabled = false;
			this.contextMenuCreateProcessMaster.disabled = false;

			// タスクマスタの登録を有効化
			this.menuCreateTaskMaster.disabled = false;
			this.contextMenuCreateTaskMaster.disabled = false;

		} 
		// タスク(マスタ)の場合
		else if (selectedTreeNodes.length === 1 &&
				this.selectedNode?.dto?.type?.['definitionName'] === 
				EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER &&
				hasbizMasterAdminAuthority) {

			// タスクマスタの更新、削除を有効化
			this.menuUpdateTaskMaster.disabled = false;
		}

		// 選択行がすべてプロジェクト(マスタ)
		const isSelectedAllProjectMaster = 
				this.isSameBaseObjectTypeDefinitionName(selectedTreeNodes, EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER);
		// 選択行がすべてプロセス(マスタ)
		const isSelectedAllProcessMaster = 
				this.isSameBaseObjectTypeDefinitionName(selectedTreeNodes, EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER);
		// 選択行がすべてタスク(マスタ)
		const isSelectedAllTaskMaster = 
				this.isSameBaseObjectTypeDefinitionName(selectedTreeNodes, EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER);
		if (selectedTreeNodes.length > 0 && hasbizMasterAdminAuthority) {

			// プロジェクト(マスタ)複数選択
			if (isSelectedAllProjectMaster) {

				this.menuDeleteProjectMaster.disabled = false;
			}
			// プロセス(マスタ)複数選択
			if (isSelectedAllProcessMaster) {
					
				this.menuDeleteProcessMaster.disabled = false;
			}
			// タスク(マスタ)複数選択
			if (isSelectedAllTaskMaster) {

				this.menuDeleteTaskMaster.disabled = false;
			}
		} 
		
		// 親メニューの有効化
		this.masterMenuItems[0].disabled = true;
		this.masterMenuItems[1].disabled = true;
		this.masterMenuItems[2].disabled = true;
		
		// プロジェクトマスタ
		if (!this.menuCreateProjectMaster.disabled || !this.menuUpdateProjectMaster.disabled || !this.menuDeleteProjectMaster.disabled) {
			this.masterMenuItems[0].disabled = false;
		}
	
		// プロセスマスタ
		if (!this.menuCreateProcessMaster.disabled || !this.menuUpdateProcessMaster.disabled || !this.menuDeleteProcessMaster.disabled) {
			this.masterMenuItems[1].disabled = false;
		}

		// タスクマスタ
		if (!this.menuCreateTaskMaster.disabled || !this.menuUpdateTaskMaster.disabled || !this.menuDeleteTaskMaster.disabled) {
			this.masterMenuItems[2].disabled = false;
		}

		// コンテキストメニュー設定
		if (selectedTreeNodes.length === 0) {
			this.contentsTreeMenuItems = [];
		}
		else if (selectedTreeNodes.length > 0) {

			// 左部ツリーメニュー変更
			// プロジェクト選択の場合
			if (isSelectedAllProjectMaster) {
				this.contentsTreeMenuItems = [
					// 詳細
					this.menuUpdateProjectMaster,
					// 削除
					this.menuDeleteProjectMaster,
					this.menuSeparator,
					// プロセス登録
					this.menuCreateProcessMaster,
					// タスク登録
					this.menuCreateTaskMaster,
				];
			}
			// プロセス選択の場合
			else if (isSelectedAllProcessMaster) {
				this.contentsTreeMenuItems = [
					// 詳細
					this.menuUpdateProcessMaster,
					// 削除
					this.menuDeleteProcessMaster,
					this.menuSeparator,
					// プロセス登録
					this.menuCreateProcessMaster,
					// タスク登録
					this.menuCreateTaskMaster,
				];
			}
			// タスクの場合
			else if (isSelectedAllTaskMaster) {
				this.contentsTreeMenuItems = [
					// 詳細
					this.menuUpdateTaskMaster,
					// 削除
					this.menuDeleteTaskMaster
				];
			}
			else {
				this.contentsTreeMenuItems = [];
			}
		}

	}

	private appendChildTreeNodes(parentDTO: EIMSimpleObjectDTO, createdDTO: EIMSimpleObjectDTO) {

		const parentTreeNode = this.masterDataGrid.getTreeNodeByDTO(parentDTO);
		if (parentTreeNode) {

			// 子階層をまだ読み込んでいない場合
			if (parentTreeNode.childTreeNodes === null) {

				// 子を取得して表示
				this.setChildTreeNodes(parentTreeNode);

				const initialized = this.masterDataGrid.initialized.subscribe(() => {
					initialized.unsubscribe();

					// 追加したツリーノードを選択状態にする
					const treeNode = this.masterDataGrid.convertDTOToTreeNode(createdDTO);
					this.masterDataGrid.select([treeNode], true);
					this.updateMenuItems();

				});
			}

			// 子階層を読み込み済みな場合
			else {

				const treeNode = this.masterDataGrid.convertDTOToTreeNode(createdDTO);
				treeNode.childTreeNodes = [];
				this.masterDataGrid.setChildTreeNodesToIndex(parentTreeNode, [treeNode]);

				// 追加したツリーノードを選択状態にする
				this.masterDataGrid.select([treeNode], true);
				this.updateMenuItems();
			}

		}
	}

	/**
	 * 子階層オブジェクト取得用のクライテリアを生成します.
	 * 
	 * @param parentObjectId 親オブジェクトID（選択ツリー展開時に使用）
	 * @return 子階層オブジェクト取得用のクライテリア
	 */
	private createChildRelatedObjectCriteria(parentObjectId: number = null): EIMSimpleSearchRelatedObjectCriteria {

		const destCriteria: EIMSimpleSearchRelatedObjectCriteria = new EIMSimpleSearchRelatedObjectCriteria();
		destCriteria.relationChild = new EIMSimpleSearchRelatedObjectRelationCriteria();

		destCriteria.relationChild.objectCriteria = 
			this.addResultAttributeTypeForColumns(new EIMSimpleSearchObjectCriteriaBuilder())
			// 作業内容
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT).end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(['type', 'definitionName'], EIMSearchOperatorEnum.IN, [
						EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER, EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER])
				]
			})
			.build();

		destCriteria.relationChild.relationCriteria = new EIMSimpleSearchRelationCriteriaBuilder()
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
	 * 一覧表示に必要な属性タイプをクライテリアビルダに追加します.
	 * 
	 * @param builder クライテリアビルダ
	 * @returns クライテリアビルダ
	 */
	private addResultAttributeTypeForColumns(builder: EIMSimpleSearchObjectCriteriaBuilder): EIMSimpleSearchObjectCriteriaBuilder {
		return builder
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().type().definitionName().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().creationUser().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().creationDate().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().modificationUser().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().modificationDate().end())
			// 担当
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType()
				.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE).end());
	}

	/**
	 * データ取得後のツリーノードに付加属性を追加します.
	 * 
	 * @param treeNodes ツリーノードリスト
	 * @param selectedTreeNodeIdPath ツリーノードIDパス
	 */
	private appendTreeNodeAttributes(treeNodes: EIMTreeNodeDTO[], selectedTreeNodeIdPath: string[] = null): void {

		this.treeNodeService.updateTreeNodes(treeNodes, (treeNodeDTO: EIMTreeNodeDTO, level: number) =>{

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
	 * ルートオブジェクトタイプ定義名称の比較結果を返却します。
	 * @return 比較結果
	 */
	private baseObjectTypeNameComparator(valueA: EIMTreeNodeDTO, valueB: EIMTreeNodeDTO) {

		const order = {
			[EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER]: 1,
			[EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER]: 2,
			[EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER]: 3
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
	 * ツリーノードのオブジェクトタイプが指定したオブジェクトタイプ定義名称かチェックします.
	 * 
	 * @param treeNodes ツリーノードリスト
	 * @param accessRoleTypeName オブジェクトタイプ定義名称
	 * @returns 全てのツリーノードのオブジェクトタイプが指定したオブジェクトタイプ定義名称の場合はtrueを返却
	 */
		private isSameBaseObjectTypeDefinitionName(treeNodes: EIMDataGridTreeNode[], baseObjTypeDefName: string): boolean {

			for (const treeNode of treeNodes) {
	
				if (treeNode.dto.exAttributeMap?.['baseObjTypeDefName'] !== baseObjTypeDefName) {
						return false;
				}
			}
	
			return true;
		}
	
	
}
