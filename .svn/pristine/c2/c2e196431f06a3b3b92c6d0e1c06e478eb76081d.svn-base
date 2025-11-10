import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { EIMPortalsModule } from 'app/portals/portals.module';
import { EIMSimpleSearchObjectCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-object-criteria.builder';
import { EIMSimpleSearchObjectResultAttributeType } from 'app/shared/builders/simple-search/simple-search-result-attribute-type';
import { EIMTreeComponent, EIMTreeTreeNode } from 'app/shared/components/tree/tree.component';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMSimpleSearchConditionCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-condition.criteria';
import { EIMSimpleSearchRelatedObjectObjectAttributeCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-related-object-object-attribute.criteria';
import { EIMSimpleSearchRelatedObjectCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-related-object.criteria';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMSearchLogicalOperatorEnum } from 'app/shared/domains/search/search-logical-operator-enum';
import { EIMSearchOperatorEnum } from 'app/shared/domains/search/search-operator-enum';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMObjectAPIService, EIMObjectAPIServiceCreateParam, EIMObjectAPIServiceDeleteParam, EIMObjectAPIServiceGetListParam, EIMObjectAPIServiceUpdateParam } from 'app/shared/services/apis/object-api.service';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMJsonToListFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-list-format-result-dto-converter.service';
import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMTreeNodeService } from 'app/shared/services/tree-node.service';
import { EIMComponentTreeNode, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMTasksModule } from 'app/tasks/tasks.module';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { Observable } from 'rxjs';

export interface EIMWorkspaceService {
	isTarget(workspaceDTO: any): boolean;
  getProjectId(orkspaceDTO: any): Observable<number>;
  getDocumentWorkspaceId(orkspaceDTO: any): Observable<number>;
}

export enum EIMWorkspacesSelectedMenuEnum {
	HOME = 'home',
	MEMBERS = 'members',
	SEARCH = 'search',
	DOCUMENTS = 'documents',
	TASKS = 'tasks',
};

@Component({
	selector: 'eim-workspaces',
	templateUrl: './workspaces.component.html',
	styleUrls: ['./workspaces.component.scss'],
	imports: [
		CommonModule,
		FormsModule,
		TranslatePipe, 
		RouterModule,
		EIMPortalsModule,
		EIMTasksModule,
		EIMSharedModule,
		PanelModule,
		AngularSplitModule,
		TabsModule,
		ButtonModule,
		InputText,
	],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})

/**
 * ワークスペースコンポーネント
 * @example
 *
 *		<eim-workspaces
 *		</eim-workspaces>
 */
export class EIMWorkspacesComponent {

	/** ピン留め済みワークスペースのツリーノードID */
	static readonly PIN_TREE_NODE_ID = '-10';

	/** 参照可能ワークスペースのツリーノードID */
	static readonly WORKSPACE_TREE_NODE_ID = '-20';

	static readonly PIN_PREFIX_TREE_NODE_ID = 'pin_';
	
	/** ワークスペースツリー */
	@ViewChild('workspaceTree', { static: true }) workspaceTree: EIMTreeComponent;

	/** 画面識別ID */
	public viewId = 'Workspaces';

	/** 選択中のワークスペース */
	public selectedWorkspaceNode: EIMTreeTreeNode = null;

	/** 選択中のメニュー */
	public selectedMainMenuItem = signal("");// EIMMenuItem = null;

	/** 原本ワークスペース名 */
	public originalWorkspaceName: string = null;

	/** 流用後のワークスペース名 */
	public createWorkspaceName: string = null;

	protected mainMenuItemMap: Map<string, EIMMenuItem> = null;

	/** 表示中のダイアログ名 */
	public viewDialogName = null;

	/** ツリーで選択したオブジェクトIDと各種IDのMap */
	protected objectIdMap = new Map();

	/** 子コンポーネント */
	protected childComponentRef: any;

	/** 子コンポーネントの状態 */
	protected childComponentState: {
		home?: any,
		members?: any,
		search?: any,
		documents?: any,
		tasks?: any
	} = {};

	/** 状態に保存した選択対象ツリーノード（状態にdataを保持しないためデータ読み込み後に手動で選択する必要がある） */
	protected selectedTreeNodesState: EIMTreeTreeNode[] = null;

	/** 初期化済みのワークスペースツリー数（ピン留め済みワークスペースツリー/参照可能ワークスペースツリー） */
	private initializedWorkspaceTreeCnt = 0;

	/* ==========================================================================
		メニューの定義
	   ========================================================================== */

	/** ホームメニュー */
	public homeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03035'), name: EIMWorkspacesSelectedMenuEnum.HOME, icon: 'eim-icon-home', visible: true, disabled: true,
		command: (event) => {this.onClickHomeMenu();}
	};
	/** メンバーメニュー */
	public membersMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03036'), name: EIMWorkspacesSelectedMenuEnum.MEMBERS, icon: 'fa-lg eim-icon-group', visible: true, disabled: true,
		command: (event) => {this.onClickMemberMenu();}
	};
	/** 検索メニュー */
	public searchItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03007'), name: EIMWorkspacesSelectedMenuEnum.SEARCH, icon: 'eim-icon-search', visible: true, disabled: true,
		command: (event) => {this.onClickObjectsMenu();}
	};
	/** ドキュメントメニュー */
	public documentsMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03033'), name: EIMWorkspacesSelectedMenuEnum.DOCUMENTS, icon: 'eim-icon-file', visible: true, disabled: true,
		command: (event) => {this.onClickDocumentsMenu();}
	};
	/** タスクメニュー */
	public tasksMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03009'), name: EIMWorkspacesSelectedMenuEnum.TASKS, icon: 'eim-icon-task', visible: true, disabled: true,
		command: (event) => {this.onClickTaskMenu();}
	};
	/** メインメニュー */
	public mainMenuItems: EIMMenuItem[] = [
		this.homeMenuItem,
//		this.searchItem,
		this.documentsMenuItem,
		this.tasksMenuItem,
		this.membersMenuItem
	];

	/** ピン留めメニュー */
	public pinMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03037'), icon: 'fa fa-thumb-tack', visible: true,
		command: (event) => {this.onClickPinMenu();}
	};

	/** ピン留め解除メニュー */
	public unpinMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03038'), icon: 'fa fa-thumb-tack', visible: true,
		command: (event) => {this.onClickUnpinMenu();}
	};

	/** ワークスペース登録 */
	public createWorkspaceMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03001'), name: 'createWorkspace', icon: 'eim-icon-plus', visible: true, disabled: true,
		command: (event) => {this.viewDialogName = 'workspaceCreator';}
	};

	/** ワークスペース流用 */
	public duplicateWorkspaceMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03010'), name: 'duplicateWorkspace', icon: 'fa fa-copy', visible: true, disabled: true,
		command: (event) => {
			const selectedNodes: EIMTreeTreeNode[] = this.workspaceTree.getSelectedData();
			if (selectedNodes.length !== 1) {
				return;
			}
			this.originalWorkspaceName = selectedNodes[0].dto.name;	
			this.createWorkspaceName = selectedNodes[0].dto.name;	

			this.viewDialogName = 'workspaceDuplicator';
		}
	};

	/** ワークスペース削除メニュー */
	public deleteWorkspaceMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', visible: true, disabled: true,
		command: (event) => {this.onClickDeleteWorkspaceMenu();}
	};

	/** ワークスペースメニュー */
	public workspaceMenuItem: EIMMenuItem = {
		label: '', name: 'workspace', icon: 'fa eim-icon-workspace', visible: true, disabled: false,
		items: [
			this.createWorkspaceMenuItem,
			this.duplicateWorkspaceMenuItem,
			this.deleteWorkspaceMenuItem
		]
	};

	/** パネルメニュー */
	public panelMenuItems: EIMMenuItem[] = [
		this.workspaceMenuItem
	];

	/** ワークスペースツリーコンテキストメニュー */
	public workspaceContextMenuItems: EIMMenuItem[] = [
		this.pinMenuItem
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		public treeComponentService: EIMTreeComponentService,
		protected changeDetectorRef: ChangeDetectorRef,
		protected router: Router,
		protected route: ActivatedRoute,
		protected translateService: TranslateService,
		protected objectAPIService: EIMObjectAPIService,
		protected httpForRestAPIService: EIMHttpForRestAPIService,
		protected messageService: EIMMessageService,
		protected cacheService: EIMCacheService,

		protected jsonToListFormatResultDTOConverterService: EIMJsonToListFormatResultDTOConverterService,
		protected treeNodeService: EIMTreeNodeService,
		protected sessionTimeoutService: EIMSessionTimeoutService

	) {
		this.mainMenuItemMap = new Map();
		this.mainMenuItemMap.set(EIMWorkspacesSelectedMenuEnum.HOME, this.homeMenuItem);
		this.mainMenuItemMap.set(EIMWorkspacesSelectedMenuEnum.MEMBERS, this.membersMenuItem);
		this.mainMenuItemMap.set(EIMWorkspacesSelectedMenuEnum.SEARCH, this.searchItem);
		this.mainMenuItemMap.set(EIMWorkspacesSelectedMenuEnum.DOCUMENTS, this.documentsMenuItem);
		this.mainMenuItemMap.set(EIMWorkspacesSelectedMenuEnum.TASKS, this.tasksMenuItem);

		this.selectedMainMenuItem.set(this.mainMenuItems[0].name);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {

		// 当関数で選択状態を復帰するため不要となる
		this.selectedTreeNodesState = null;

		this.workspaceTree.setData([
			{
				treeNodeId: EIMWorkspacesComponent.PIN_TREE_NODE_ID,
				// ピン留めしたワークスペース
				label: this.translateService.instant('EIM_TASKS.LABEL_02060'),
				parentTreeNode: null,
				childTreeNodes: null,
				leaf: false,
				expanded: false,
				selectable: false
			},
			{
				treeNodeId: EIMWorkspacesComponent.WORKSPACE_TREE_NODE_ID,
				// 参照可能ワークスペース
				label: this.translateService.instant('EIM_TASKS.LABEL_02061'),
				parentTreeNode: null,
				childTreeNodes: null,
				leaf: false,
				expanded: false,
				selectable: false
			}
		]);

		// プロジェクトツリーの画面状態を復元
		if (state) {

			// 子コンポーネントの状態
			if (state.childComponentState) {
				this.childComponentState = state.childComponentState;
			}

			// メインメニューの選択状態
			this.selectedMainMenuItem.set(this.mainMenuItemMap.get(state.selectedMenu).name);

			// 選択状態はデータ読み込み後に反映するため退避
			this.selectedTreeNodesState = state.workspaceTree?.selectedData ?? null;

			this.initializedWorkspaceTreeCnt = 0;

			// ピン留め済みワークスペース読み込み
			this.initializePinedWorkspaceTree();
			
			// 参照可能ワークスペースツリー読み込み
			this.initializeWorkspaceTree();

			// ワークスペースツリー読み込み完了
			const treeInitialized = this.workspaceTree.initialized.subscribe(() => {

				// ピン留め済みワークスペース/参照可能ワークスペースツリー読み込みが完了したか判定
				this.initializedWorkspaceTreeCnt++;
				if (this.initializedWorkspaceTreeCnt < 2) {
					return;
				}

				treeInitialized.unsubscribe();

				// ノード選択
				if (this.selectedTreeNodesState && this.selectedTreeNodesState.length > 0) {
					this.workspaceTree.select(this.selectedTreeNodesState, false);

					// 子コンポーネント表示
					this.navigateChildComponent(this.selectedMainMenuItem(), this.selectedTreeNodesState[0]);

					// 子コンポーネントの状態を復元
					if (this.childComponentRef && this.childComponentRef.setState) {
						
						// 子コンポーネントに選択中のワークスペースIDを設定
						const workspaceId = this.selectedWorkspaceNode.dto.id;
						this.childComponentRef.initialize(workspaceId);

						const childComponentState = this.childComponentState[this.selectedMainMenuItem()];
						this.childComponentRef.setState(childComponentState);
					}

					this.selectedTreeNodesState = null;
				}

				// スクロール
				const offsetTop = state.workspaceTree?.offsetTop ?? 0;
				window.setTimeout(() => {
					this.workspaceTree.setScrollTop(offsetTop);
				});

				if (this.workspaceTree.getSelectedData().length > 0) {
					// メインメニュー選択後の処理
					if (state.selectedMenu) {
						this.mainMenuItemMap.get(state.selectedMenu).command({});
					}
				}

				// メインメニュー有効/無効切り替え
				window.setTimeout(() => {
					this.updateMenuItems();
				});
			});

		// 初回表示時あるいは画面更新（F5押下）時
		} else {

			// 子コンポーネントの状態を保持
			this.childComponentState = {};

			this.initializedWorkspaceTreeCnt = 0;
			
			// ピン留めワークスペース読み込み
			this.initializePinedWorkspaceTree();
			
			// ワークスペースツリー読み込み
			this.initializeWorkspaceTree();

			// ワークスペースツリー読み込み完了
			const treeInitialized = this.workspaceTree.initialized.subscribe(() => {

				// ピン留め済みワークスペース/参照可能ワークスペースツリー読み込みが完了したか判定
				this.initializedWorkspaceTreeCnt++;
				if (this.initializedWorkspaceTreeCnt < 2) {
					return;
				}

				treeInitialized.unsubscribe();

				// URLのパスから選択するワークスペースを決定
				this.route.params.subscribe((params: Params) => {

					const workspaceId = this.convertPinTreeNodeIdToObjectId(params['workspaceTreeNodeId']);
					this.selectedWorkspaceNode = {
						treeNodeId: params['workspaceTreeNodeId'],
						dto: {id: workspaceId}
					};

					if (workspaceId != -1) {
						this.workspaceTree.select([this.selectedWorkspaceNode], false);

						// 該当ワークスペースが存在しなかった場合
						if (this.workspaceTree.getSelectedData().length === 0) {
							this.selectedMainMenuItem.set("");
							this.router.navigate(['portals', 'main', 'workspaces', '-1']);
						}
					}
					// メインメニュー有効/無効切り替え
					this.updateMenuItems();
				});
			});
		}
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {

		// コンポーネントの状態を保持
		this.saveChildComponentStatus();

		const workspaceTreeState = this.workspaceTree.getState();
		workspaceTreeState.data = null; // データは保持しない
		if (this.selectedTreeNodesState && this.selectedTreeNodesState.length > 0) {
			// setState()にてデータ読み込み完了時に選択状態を設定する。
			// 上記の選択処理前にgetState()が呼ばれた場合、状態に設定された選択状態を設定する。
			workspaceTreeState.selectedData = this.selectedTreeNodesState;
		}

		return {
			workspaceTree: workspaceTreeState,
			selectedMenu: this.selectedMainMenuItem(),

			childComponentState: this.childComponentState
		};
	}

	/**
	 * ワークスペースツリーのマウスオーバーメニューを表示するかどうかを返却します.
	 * 
	 * @param treeNode 判定対象のツリーノード
	 * @returns マウスオーバーメニューを表示する場合はtrue
	 */
	public isVisibleMouseOverMenu(treeNode: EIMTreeTreeNode) {

		if (treeNode.treeNodeId === EIMWorkspacesComponent.PIN_TREE_NODE_ID) {
			return false;
		}

		if (treeNode.treeNodeId === EIMWorkspacesComponent.WORKSPACE_TREE_NODE_ID) {
			return false;
		}

		return true;
	}

	/**
	 * TreeTreeNodeへの追加設定
	 */
	public setAdditionalPropertiesToTreeNodeFunction(treeNode: EIMTreeTreeNode, dto: EIMSimpleObjectDTO): EIMTreeTreeNode {

		if (dto.exAttributeMap.baseObjTypeDefName === 'ワークスペース') {
			treeNode.expandedIcon = 'fa fa-lg eim-icon-workspace';
			treeNode.collapsedIcon = 'fa fa-lg eim-icon-workspace';
		}

		return treeNode;
	};

	/**
	 * ツリーノードの親子関係を追加設定します.
	 * 
	 * @param treeNode 
	 * @param dto 
	 */
	public setAdditionalTreeNodeRelationFunction(treeNode: EIMTreeTreeNode, dto: any): EIMTreeTreeNode {

		if (treeNode.treeNodeId === EIMWorkspacesComponent.PIN_TREE_NODE_ID || treeNode.treeNodeId === EIMWorkspacesComponent.WORKSPACE_TREE_NODE_ID) {
			return treeNode;
		}
		
		treeNode.childTreeNodes = [];
		treeNode.leaf = true;

		return treeNode;
	}

	/**
	 * タスク表示内容を更新します.
	 * 
	 * @param parentDTO 更新されたタスクオブジェクトの親オブジェクト
	 * @param updatedDTO 更新されたタスクオブジェクト
	 */
	public updateTask(parentDTO: EIMSimpleObjectDTO, updatedDTO: EIMSimpleObjectDTO): void {

		if (this.childComponentRef.updateTask) {

			this.childComponentRef.updateTask(parentDTO, updatedDTO);
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
	}

	/**
	 * 右クリック時のイベントハンドラです.
	 * コンテキストメニューを入れ替えます。
	 * @param event イベント
	 */
	public onContextMenu(event): void {

		const selectedTreeNodes = this.workspaceTree.getSelectedData();
		if (selectedTreeNodes.length === 0) {
			return;
		}

		const selectedTreeNode = selectedTreeNodes[0];
		if (selectedTreeNode.parentTreeNode === null) {
			this.workspaceContextMenuItems = [];
			return;
		}

		// ピン留め済みツリー配下の場合
		if (selectedTreeNode.parentTreeNode.treeNodeId === EIMWorkspacesComponent.PIN_TREE_NODE_ID) {
		
			this.workspaceContextMenuItems = [this.unpinMenuItem, this.duplicateWorkspaceMenuItem, this.deleteWorkspaceMenuItem];
		
		// 参照可能なワークスペースツリーは以下の場合
		} else {

			this.workspaceContextMenuItems = [this.pinMenuItem, this.duplicateWorkspaceMenuItem, this.deleteWorkspaceMenuItem];

		}

	}
	/**
	 * ワークスペース選択時のイベントハンドラです.
	 * @param event イベント
	 */
	public onSelectedWorkspace(event): void {

		// 状態をクリアする
		this.childComponentState = {};

		this.navigateChildComponent(EIMWorkspacesSelectedMenuEnum.HOME, event.selectedData[0]);
		this.selectedMainMenuItem.set(this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.HOME).name);

		// メインメニュー有効/無効切り替え
		this.updateMenuItems();
	}

	/**
	 * プロジェクト流用メニュー押下時のイベントハンドラです.
	 * @param event イベント
	 */
	public onClickDuplicateWorkspace(event) {

		const selectedNodes: EIMTreeTreeNode[] = this.workspaceTree.getSelectedData();
		if (selectedNodes.length !== 1) {
			this.viewDialogName = '';
			return;
		}
	
		let apiParam: EIMObjectAPIServiceCreateParam = new EIMObjectAPIServiceCreateParam();
		apiParam = {
			dto: {
				id: selectedNodes[0].dto.id,
				type: selectedNodes[0].dto.type,
				name: this.createWorkspaceName
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

			const treeNode = this.workspaceTree.convertDTOToTreeNode(resultDto);
			this.workspaceTree.setChildTreeNodesToIndex({treeNodeId: EIMWorkspacesComponent.WORKSPACE_TREE_NODE_ID}, [treeNode]);
			this.workspaceTree.select([treeNode], true);

			// 完了メッセージ表示
			this.messageService.showGrowl(this.translateService.instant(
				'EIM_TASKS.INFO_00006', {value: this.translateService.instant('EIM_TASKS.LABEL_03032')}));

			// ダイアログクローズ
			this.viewDialogName = null;

		});
	}

	/**
	 * ホームボタンクリック時のイベントハンドラです.
	 */
	public onClickHomeMenu(): void {

		// 選択前の子コンポーネントの状態を保持
		this.saveChildComponentStatus();

		const treeNodes = this.workspaceTree.getSelectedData();
		const workspaceTreeNode = treeNodes && treeNodes.length > 0 ? treeNodes[0] : null;

		this.navigateChildComponent(EIMWorkspacesSelectedMenuEnum.HOME, workspaceTreeNode);
		this.selectedMainMenuItem.set(this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.HOME).name);
	}

	/**
	 * メンバーボタンクリック時のイベントハンドラです.
	 */
	public onClickMemberMenu(): void {

		// 選択前の子コンポーネントの状態を保持
		this.saveChildComponentStatus();

		const treeNodes = this.workspaceTree.getSelectedData();
		const workspaceTreeNode = treeNodes && treeNodes.length > 0 ? treeNodes[0] : null;

		this.navigateChildComponent(EIMWorkspacesSelectedMenuEnum.MEMBERS, workspaceTreeNode);
		this.selectedMainMenuItem.set(this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.MEMBERS).name);
	}

	/**
	 * 検索ボタンクリック時のイベントハンドラです.
	 */
	public onClickObjectsMenu(): void {

		// 選択前の子コンポーネントの状態を保持
		this.saveChildComponentStatus();

		const treeNodes = this.workspaceTree.getSelectedData();
		const workspaceTreeNode = treeNodes && treeNodes.length > 0 ? treeNodes[0] : null;

		this.navigateChildComponent(EIMWorkspacesSelectedMenuEnum.SEARCH, workspaceTreeNode);
		this.selectedMainMenuItem.set(this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.SEARCH).name);
	}

	/**
	 * ドキュメントボタンクリック時のイベントハンドラです.
	 */
	public onClickDocumentsMenu(): void {

		// 選択前の子コンポーネントの状態を保持
		this.saveChildComponentStatus();

		const treeNodes = this.workspaceTree.getSelectedData();
		const workspaceTreeNode = treeNodes && treeNodes.length > 0 ? treeNodes[0] : null;

		this.navigateChildComponent(EIMWorkspacesSelectedMenuEnum.DOCUMENTS, workspaceTreeNode);
		this.selectedMainMenuItem.set(this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.DOCUMENTS).name);
	}

	/**
	 * タスクボタンクリック時のイベントハンドラです.
	 */
	public onClickTaskMenu(): void {

		// 選択前の子コンポーネントの状態を保持
		this.saveChildComponentStatus();

		const treeNodes = this.workspaceTree.getSelectedData();
		const workspaceTreeNode = treeNodes && treeNodes.length > 0 ? treeNodes[0] : null;

		this.navigateChildComponent(EIMWorkspacesSelectedMenuEnum.TASKS, workspaceTreeNode);
		this.selectedMainMenuItem.set(this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.TASKS).name);
	}

	/**
	 * ピン留めメニュー押下時のイベントハンドラです.
	 */
	public onClickPinMenu(): void {
		const treeNodes = this.workspaceTree.getSelectedData();
		if (!treeNodes || treeNodes.length === 0) {
			return;
		}

		const selectedPinTreeNodeId = this.convertToPinTreeNodeId(treeNodes[0].treeNodeId);
		const pinTreeNode = this.workspaceTree.getTreeNodeByTreeNodeId(selectedPinTreeNodeId);
		if (pinTreeNode) {
			//this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00011'));
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_TASKS.ERROR_00004'));
			return;
		}

		const user: EIMUserDomain = this.cacheService.getLoginUser();
		if (!user || !user.id || typeof user.id === 'undefined') {
			// ユーザIDが取得できなければタイムアウト扱い
			this.sessionTimeoutService.doSessionTimeout();
			return;
		}

		// ユーザのピン情報を取得
		const apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.objectCriteria =
			new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().type().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PIN).id().end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(['type', 'definitionName'], EIMSearchOperatorEnum.EQ, 'ユーザ'),
					new EIMSimpleSearchConditionCriteria(['name'], EIMSearchOperatorEnum.EQ, user.id.toString())
				]
			})
			.build();
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);

			// ユーザのピン情報に選択オブジェクトを追加

			if (!(listFormatResult?.dtos?.[0] ?? null)) {

				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_TASKS.ERROR_00005'));
				return;
			}

			const dto = listFormatResult.dtos[0];
			const selectedObjectId = this.convertPinTreeNodeIdToObjectId(selectedPinTreeNodeId);

			// ピンオブジェクト属性新規登録時
			if ((dto?.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PIN]?.values?.length ?? 0) === 0) {
				
				dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PIN] = {
					'valueType': 'OBJECT',
					'values': [{id: selectedObjectId}]
				}
			}
			// ピンオブジェクト属性更新時
			else {
				const pinnedObjects = dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PIN].values.filter(object => object.id === selectedObjectId);
				if (pinnedObjects.length === 0) {
					dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PIN].values.push({id: selectedObjectId});
				} else {
					this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_TASKS.ERROR_00004'));

				}
			}

			const apiParam: EIMObjectAPIServiceUpdateParam = {
				dto: dto
			}; 
			this.objectAPIService.update(apiParam).subscribe((res: any) => {

				const pinnedTreeNode = this.workspaceTree.convertDTOToTreeNode(treeNodes[0].dto);
				pinnedTreeNode.treeNodeId = this.convertToPinTreeNodeId(pinnedTreeNode.treeNodeId);
				this.workspaceTree.setChildTreeNodesToIndex({treeNodeId: EIMWorkspacesComponent.PIN_TREE_NODE_ID}, [pinnedTreeNode]);
			});
		});
	}

	/**
	 * ピン留め解除メニュー押下時のイベントハンドラです.
	 */
	public onClickUnpinMenu(): void {

		const treeNodes = this.workspaceTree.getSelectedData();
		if (!treeNodes || treeNodes.length === 0) {
			return;
		}

		const user: EIMUserDomain = this.cacheService.getLoginUser();
		if (!user || !user.id || typeof user.id === 'undefined') {
			// ユーザIDが取得できなければタイムアウト扱い
			this.sessionTimeoutService.doSessionTimeout();
			return;
		}

		// ユーザのピン情報を取得
		const apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.objectCriteria =
			new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().type().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PIN).id().end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(['type', 'definitionName'], EIMSearchOperatorEnum.EQ, 'ユーザ'),
					new EIMSimpleSearchConditionCriteria(['name'], EIMSearchOperatorEnum.EQ, user.id.toString())
				]
			})
			.build();
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);

			// ユーザのピン情報から選択オブジェクトを削除

			if (!(listFormatResult?.dtos?.[0] ?? null)) {

				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_TASKS.ERROR_00005'));
				return;
			}

			const dto = listFormatResult.dtos[0];
			const selectedObjectId = this.convertPinTreeNodeIdToObjectId(treeNodes[0].treeNodeId);
			
			// ピンの設定
			let oldPinedWorkspaces = dto.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PIN]?.values ?? null;
			if (!oldPinedWorkspaces) {
				// TODO: errormessage
				return;
			}
			dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PIN].values = 
					oldPinedWorkspaces.filter((object) => object.id !== selectedObjectId);

			const apiParam: EIMObjectAPIServiceUpdateParam = {
				dto: dto
			}; 
			this.objectAPIService.update(apiParam).subscribe((res: any) => {

				// ピン留め済みツリーから該当ワークスペースを消去
				this.workspaceTree.removeTreeNodes(treeNodes);
			});
		});
	}

	/**
	 * ワークスペース削除時のイベントハンドラです.
	 */
	public onClickDeleteWorkspaceMenu() {
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00048' , {value: this.translateService.instant('EIM_DOCUMENTS.LABEL_03061')}) ,
			() => {

				this.messageService.show(EIMMessageType.confirm,
					this.translateService.instant('EIM_TASKS.CONFIRM_00003' , {value: this.translateService.instant('EIM_DOCUMENTS.LABEL_03061')}) ,
					() => {
						let param: EIMObjectAPIServiceDeleteParam = {
							dto: this.workspaceTree.getSelectedData()[0].dto
						}

						this.objectAPIService.delete(param).subscribe((res: any) => {
							
							// プロジェクトツリーから該当ツリーノード削除
							this.removeNodeById('' + param.dto.id);
							this.removeNodeById('pin_' + param.dto.id);

							this.updateSideMenuItems(true);

							// 状態をクリアする
							this.childComponentState = {};

							this.router.navigate(['portals', 'main', 'workspaces', '-1']);

							this.selectedMainMenuItem.set(this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.HOME).name);

							// メインメニュー有効/無効切り替え
							this.updateMenuItems();

							// 完了メッセージ表示
							this.messageService.showGrowl(this.translateService.instant(
								'EIM_TASKS.INFO_00003', {value: this.translateService.instant('EIM_DOCUMENTS.LABEL_03061')}));
						});
					}
				);
			}
		);
	}
	
	/**
	 * ツリーノードを削除します.
	 * @param treeNodeId ツリーノードID
	 */
	private removeNodeById(treeNodeId: string): void {
		let selectedTreeNode = this.workspaceTree.getTreeNodeByTreeNodeId(treeNodeId);
		if (selectedTreeNode) {
			this.workspaceTree.removeTreeNodes([selectedTreeNode]);
		}
	}

	/**
	 * アクティブハンドラ
	 * @param componentRef 遷移先の画面構成情報
	 */
	public onActivateChildComponent(childComponentRef: any): void {
		window.setTimeout(() => {
			// URLのパスから選択するワークスペースを決定
			this.route.params.subscribe((params: Params) => {

				const workspaceId = this.convertPinTreeNodeIdToObjectId(params['workspaceTreeNodeId']);
				this.selectedWorkspaceNode = {
					treeNodeId: params['workspaceTreeNodeId'],
					dto: {id: workspaceId}
				};

				// 子コンポーネントに選択中のワークスペースIDを設定
				childComponentRef.initialize(workspaceId);
				this.selectedMainMenuItem.set(this.getMainMenuItemFromURL().name);
			});

			// 子コンポーネントの状態を復元
			if (childComponentRef.setState) {
				const childComponentState = this.childComponentState[this.selectedMainMenuItem()];
				childComponentRef.setState(childComponentState);
			}

			this.childComponentRef = childComponentRef;
		});
	}


	/**
	 * ワークスペース登録完了時のイベントハンドラです.
	 *
	 * @param event ワークスペース登録結果情報
	 */
	public onCreatedWorkspace(event: {parentDTO: EIMSimpleObjectDTO, createdDTO: EIMSimpleObjectDTO}): void {
		
		// ダイアログクローズ
		this.viewDialogName = null;

		const treeNode = this.workspaceTree.convertDTOToTreeNode(event.createdDTO);

		this.workspaceTree.setChildTreeNodesToIndex({treeNodeId: EIMWorkspacesComponent.WORKSPACE_TREE_NODE_ID}, [treeNode]);
		this.workspaceTree.select([treeNode], true);

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00001', {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}));
	}

	/**
	 * ダイアログクローズ時のイベントハンドラです.
	 */
	public onCloseDialog() {
		this.viewDialogName = null;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 参照可能ワークスペースツリーを初期化します.
	 */
	private initializeWorkspaceTree(): void {

		// ワークスペース一覧取得条件設定
		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		// apiParam.comparatorIds = ['baseObjectTypeComparator'];
		apiParam.objectCriteria =
			new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().type().definitionName().end())
//			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().attribute('app.task.dev:ワークスペース').end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.OR,
				conditions: [
					new EIMSimpleSearchConditionCriteria(['baseType', 'definitionName'], EIMSearchOperatorEnum.EQ, 'ワークスペース'),
					// new EIMSimpleSearchConditionCriteria(
					// 	new EIMSimpleSearchConditionGroupCriteria(EIMSearchLogicalOperatorEnum.AND, [
					// 		new EIMSimpleSearchConditionCriteria(['type', 'definitionName'], EIMSearchOperatorEnum.EQ, 'ワークスペース'),
					// 		new EIMSimpleSearchConditionCriteria(
					// 			new EIMSimpleSearchObjectConditionLeftAttributeType().attribute('app.task.dev:ワークスペース').end(), EIMSearchOperatorEnum.IS_NULL)
					// 	])
					// )
				]
			})
			.build();

		// プロジェクト一覧取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			let listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);

			this.workspaceTree.setChildListFormatResult({treeNodeId: EIMWorkspacesComponent.WORKSPACE_TREE_NODE_ID}, listFormatResult);

			// 初期化完了イベント発行
			this.workspaceTree.initialized.emit();
		});
	}

	/**
	 * ピン留め済みワークスペースツリーを初期化します.
	 */
	private initializePinedWorkspaceTree(): void {

		const user: EIMUserDomain = this.cacheService.getLoginUser();
		if (!user || !user.id || typeof user.id === 'undefined') {
			// ユーザIDが取得できなければタイムアウト扱い
			this.sessionTimeoutService.doSessionTimeout();
			return;
		}

		// ユーザのピン情報の取得条件
		const apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		apiParam.objectCriteria =
			new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(['type', 'definitionName'], EIMSearchOperatorEnum.EQ, 'ユーザ'),
					new EIMSimpleSearchConditionCriteria(['name'], EIMSearchOperatorEnum.EQ, user.id.toString())
				]
			})
			.build();

		// ピン止めされたワークスペースの取得条件
		const destCriteria: EIMSimpleSearchRelatedObjectCriteria = new EIMSimpleSearchRelatedObjectCriteria();
		destCriteria.objectAttributeDestination = new EIMSimpleSearchRelatedObjectObjectAttributeCriteria();

		destCriteria.objectAttributeDestination.objectAttributeTypeDefinitionName = EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PIN;
		destCriteria.objectAttributeDestination.objectCriteria = new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().type().definitionName().end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(['baseType', 'definitionName'], EIMSearchOperatorEnum.IN, ['ワークスペース'])
				]
			})
			.build();
		apiParam.relatedObjectCriterias = [destCriteria];
		
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);

			// ピン用のノードツリーIDを設定
			const pinedTreeNodes: EIMTreeTreeNode[] = [];
			for (let i = 0; i < listFormatResult.dtos.length; i++) {
				const dto = listFormatResult.dtos[i];
				const treeNode = this.workspaceTree.convertDTOToTreeNode(dto);
				treeNode.treeNodeId = this.convertToPinTreeNodeId(treeNode.treeNodeId);

				pinedTreeNodes.push(treeNode);
			}
			this.workspaceTree.setChildTreeNodesToIndex({treeNodeId: EIMWorkspacesComponent.PIN_TREE_NODE_ID}, pinedTreeNodes);

			// 初期化完了イベント発行
			this.workspaceTree.initialized.emit();

		});
	}

	/**
	 * 子コンポーネントへナビゲートします.
	 * @param selectedMainMenuItemName 選択中のメニューアイテム名
	 * @param workspaceTreeNode ワークスペースツリーノード情報
	 */
	protected navigateChildComponent(selectedMainMenuItemName: string, workspaceTreeNode: EIMComponentTreeNode): void {
		
		switch(selectedMainMenuItemName) {

			case EIMWorkspacesSelectedMenuEnum.HOME:
				this.router.navigate(
					['portals', 'main', 'workspaces', workspaceTreeNode.treeNodeId, 'home']);
				break;
			case EIMWorkspacesSelectedMenuEnum.MEMBERS:
				this.router.navigate(
					['portals', 'main', 'workspaces', workspaceTreeNode.treeNodeId, 'members']);
				break;
			case EIMWorkspacesSelectedMenuEnum.SEARCH:
				this.router.navigate(
					['portals', 'main', 'workspaces', workspaceTreeNode.treeNodeId, 'objects']);
				break;
			case EIMWorkspacesSelectedMenuEnum.DOCUMENTS:
				this.router.navigate(
					['portals', 'main', 'workspaces', workspaceTreeNode.treeNodeId, 'documents']);
				break;
			case EIMWorkspacesSelectedMenuEnum.TASKS:
				this.router.navigate(
					['portals', 'main', 'workspaces', workspaceTreeNode.treeNodeId, 'tasks']);
				break;
		}
	}

	/**
	 * 子コンポーネントの状態を保存します.
	 */
	protected saveChildComponentStatus(): void {
		// 画面の状態を復元
		if (this.childComponentRef && this.childComponentRef.getState) {
			const childComponentState = this.childComponentRef.getState();
			if (childComponentState) {
				this.childComponentState[this.selectedMainMenuItem()] = childComponentState;
			}
		}
	}

	/**
	 * URLから選択されているメニューアイテムを取得します.
	 */
	protected getMainMenuItemFromURL(): EIMMenuItem {

		// URLから選択中のメニューを決定
		const path = '/portals/main/workspaces/';
		const url = this.router.url?.split('?')?.[0];
		const childPathIndex = url.indexOf(path);
		// <workspaceId>/xxx/yyyのxxxを取得
		const childPathName = url.substring(childPathIndex + path.length)?.split('/')?.[1] ?? '';

		let selectedMainMenuItem = this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.HOME);
		switch (childPathName) {
			case 'home':
				selectedMainMenuItem = this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.HOME);
				break;
			case 'members':
				selectedMainMenuItem = this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.MEMBERS);
				break;
			case 'objects':
				selectedMainMenuItem = this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.SEARCH);
				break;
			case 'documents':
				selectedMainMenuItem = this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.DOCUMENTS);
				break;
			case 'tasks':
				selectedMainMenuItem = this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.TASKS);
				break;
			default:
				selectedMainMenuItem = this.mainMenuItemMap.get(EIMWorkspacesSelectedMenuEnum.HOME);
				break;
		}

		return selectedMainMenuItem;
	}

	/**
	 * メインメニューアイテムの有効/無効を切り替えます.
	 */
	private updateMenuItems(): void {

		const selectedData = this.workspaceTree.getSelectedData();
		const disabled = selectedData.length === 0;
		this.updateSideMenuItems(disabled);

		// プロジェクト管理の管理者権限を保持しているかどうか
		const hasProjectAdminAuthority = this.cacheService.getHasAuthId()?.project ?? false;

		this.createWorkspaceMenuItem.disabled = true;
		this.duplicateWorkspaceMenuItem.disabled = true;
		this.deleteWorkspaceMenuItem.disabled = true;

		if (hasProjectAdminAuthority) {

			this.createWorkspaceMenuItem.disabled = false;
			if (selectedData.length > 0) {
				this.duplicateWorkspaceMenuItem.disabled = false;
				this.deleteWorkspaceMenuItem.disabled = false;
			}
			this.panelMenuItems = [this.workspaceMenuItem];
		}
	}

	/**
	 * 横軸のメインメニューアイテム（ホーム、メンバー、検索、ドキュメント、タスク）の有効/無効を切り替えます.
	 */
	private updateSideMenuItems(disabled : boolean): void {


		this.homeMenuItem.disabled = disabled;
		this.membersMenuItem.disabled = disabled;
		this.searchItem.disabled = disabled;
		this.documentsMenuItem.disabled = disabled;
		this.tasksMenuItem.disabled = disabled;

		// 入れなおさないと画面に反映されない
		this.mainMenuItems = [
			this.homeMenuItem,
			// this.searchItem,
			this.documentsMenuItem,
			this.tasksMenuItem,
			this.membersMenuItem
		];
	}

	/**
	 * ツリーノードIDをピン留め済みのツリーノードIDに変換します.
	 * @param treeNodeId ツリーノードID
	 * @returns ピン留め済みのツリーノードID
	 */
	private convertToPinTreeNodeId(treeNodeId: string): string {
		return EIMWorkspacesComponent.PIN_PREFIX_TREE_NODE_ID + treeNodeId;
	}

	/**
	 * ピン留め済みのツリーノードIDをオブジェクトIDに変換します.
	 * 
	 * @param pinTreeNodeId ピン留め済みのツリーノードID
	 * @returns オブジェクトID
	 */
	private convertPinTreeNodeIdToObjectId(pinTreeNodeId: string): number {
		if (pinTreeNodeId.indexOf(EIMWorkspacesComponent.PIN_PREFIX_TREE_NODE_ID, 0) === -1) {
			return this.treeNodeService.convertTreeNodeIdToObjectId(pinTreeNodeId);
		}
		return this.treeNodeService.convertTreeNodeIdToObjectId(
			pinTreeNodeId.slice(EIMWorkspacesComponent.PIN_PREFIX_TREE_NODE_ID.length));
	}

	/**
	 * 各タブ選択イベントハンドラ
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		const command = this.mainMenuItems.find(item => item.name === event);
		if(command && command.command){
			command.command(null);
		}
	}
}
