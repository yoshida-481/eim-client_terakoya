import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo, EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMFolderService, EIMFolder, EIMFolderType } from 'app/documents/shared/services/apis/folder.service';
import { EIMHierarchicalContentsService, EIMHierarchicalContents } from 'app/documents/shared/services/apis/hierarchical-contents.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * フォルダツリー用ツリーノードインタフェース
 */
export interface EIMFolderTreeNode extends EIMTreeNode {
	objTypeId?: number;
	objTypeName?: string;
	isWorkflowFolder?: boolean;
	isBranch?: boolean;
	isSearch?: boolean;
	tagListKind?: number;
	isTrash?: boolean;
}

/**
 * コンテンツツリーコンポーネントサービス.
 */
@Injectable()
export class EIMContentsTreeComponentService extends EIMTreeComponentService {

	// 初期化処理無効化
	public disabledInitialization: boolean = false;

	// ごみ箱オブジェクトID
	private trashObjectId: number;

	constructor(
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
			protected hierarchicalContentsService: EIMHierarchicalContentsService,
			protected folderService: EIMFolderService) {
		super(hierarchicalDomainService);

		/**
		 * 選択対象の行かどうか判定します.
		 */
		this.defaultEquals = (arg1: any, arg2: any) => {
			return (Number(arg1.objId) === Number(arg2.objId));
		}
	}
	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期化します.
	 * @param info データグリッドコンポーネント情報
	 * @param serviceParam パラメータ
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 */
	 public initialize(info: EIMListComponentInfo<EIMFolderTreeNode>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {

		// 初期化処理が無効化されている場合はリターン (親コンポーネントから明示的に初期化処理を呼び出す)
		if (this.disabledInitialization) {
			return;
		}

		if (info.selectedData && info.selectedData.length > 0) {
			// 対象オブジェクトまでツリー展開してアイテムを選択状態にする
			if (info.selectedData[0]['isFolder'] === 'true') {
				this.contentsAccess(info, info.selectedData[0], false, initialized, selected, true, true);
			} else {
				this.contentsAccess(info, info.selectedData[0], true, initialized, selected, true, true);
			}
		} else {
			this.initRoot(info, initialized, selected);
		}
	}

	/**
	 * 階層データをツリーノードに変換します.
	 * @param contents 階層データ
	 * @return ツリーノード
	 */
	public convertHierarchicalDataToEIMFolderTreeNode(contents: EIMHierarchicalContents): EIMFolderTreeNode {
		let icon: string = 'fa fw fa-lg ' + this.getIcon(contents);
		let parent: EIMFolderTreeNode = {
			label: contents.objName,
			data: contents,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: false,

			objId: Number(contents.objId),
			objTypeId: Number(contents.objTypeId),
			objTypeName: contents.objTypeName,
			isWorkflowFolder: contents.isWorkflowFolder,
			isBranch: true,
			isSearch: false,
			tagListKind: contents.tagListKind,
			isTrash: (contents.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TRASH_CAN
				|| contents.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN ? true : false),
		};

		let children: EIMFolderTreeNode[] = [];
		// ごみ箱,ワークスペース固有ごみ箱ではない場合は、子ノードを設定する
		if (!parent.isTrash) {
			for (let i = 0; i < contents.children.length; i++) {
				children.push(this.convertHierarchicalDataToEIMFolderTreeNode(<EIMHierarchicalContents>contents.children[i]));
			}
			this.hierarchicalDomainService.setChildren(parent, children);
		} else {
			parent.children = children;
			parent.leaf = true;
			// ごみ箱オブジェクトIDをサービスにセットする
			this.trashObjectId = parent.objId;
		}

		if (children.length > 0) {
			parent.expanded = true;
		} else {
			parent.expanded = false;
		}
		return parent
	}

	/**
	 * 行データをツリーノードに変換します.
	 * @param folder 行データ
	 * @return ツリーノード
	 */
	public convertRowDataToEIMFolderTreeNode(folder: EIMFolder): EIMFolderTreeNode {
		let icon: string = 'fa fa-fw fa-lg ' + this.getIcon(folder);
		let tn: EIMFolderTreeNode = {
			label: folder.objName,
			data: folder,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: false,
			children: [],

			objId: Number(folder.objId),
			objTypeId: Number(folder.objTypeId),
			objTypeName: folder.objTypeName,
			isWorkflowFolder: folder.isWorkflowFolder,
			isBranch: true,
			isSearch: false,
			tagListKind: folder.tagListKind
		};

		return tn;
	}

	/**
	 * ノードを追加します.
	 * @param info グリッドコンポーネント情報
	 * @param parentNode 追加対象のツリーノード
	 * @param data 追加するデータ
	 *
	 */
	public addNode(info: EIMListComponentInfo<EIMTreeNode>, parentNode: EIMTreeNode, data: any[]): void {
		// 親ノードを特定する
		let node: EIMTreeNode = this.hierarchicalDomainService.get(info.data, parentNode.data, this.defaultEquals);
		if (!node) { return; }

		let addNodes: EIMTreeNode[] = [];

		// 追加ノードを作成して親ノードに追加する
		for (let i = 0; i < data.length; i++) {
			let addNode: EIMFolderTreeNode = {};
			addNode.data = data[i];
			addNode.objId = data[i].objId;
			addNode.objTypeId = data[i].objTypeId;
			addNode.objTypeName = data[i].objTypeName;
			addNode.icon = 'fa fa-fw fa-lg ' + this.getIcon(data[i]);
			addNode.leaf = false;
			addNode.isSearch = false;
			addNode.children = [];
			addNode.isWorkflowFolder = data[i].isWorkflowFolder;
			addNodes.push(addNode);
		}

		// 親ノードを開く
		parentNode.expanded = true;

		super.addNode(info, parentNode, addNodes);

		// ワークスペース固有ごみ箱は常に最下位に配置する
		if (parentNode.children) {
			parentNode.children.sort((a: EIMTreeNode, b: EIMTreeNode) => {
				if (a.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
					return 1;
				};
				if (b.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
					return -1;
				};
				return 0;
			});
		}
	}

	/**
	 * オブジェクト存在チェック
	 * @param treeData ツリーデータ
	 * @param targetData 対象データ
	 * @return 存在有無
	 */
	public existsObject(treeData, targetData): Observable<boolean> {
		if (this.existsNode(treeData, targetData)) {
			return of(true);
		} else {
			return this.folderService.existsItem(targetData.objId).pipe(mergeMap((res: any) => {
				return of(res);
			}));
		}
	}

	/**
	 * 対象オブジェクトまでツリー展開してアイテムを選択状態にする.
	 * @param info グリッドコンポーネント情報
	 * @param targetData 対象オブジェクト
	 * @param isPlace 親オブジェクト取得有無
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 * @param isClearCaseOfError エラー有無
	 * @param workspaceIds 表示対象のワークスペースID(指定したワークスペースのみ返却する)
	 */
	public contentsAccess(info: EIMListComponentInfo<any>, targetData: any, isPlace, 
			initialized?: EventEmitter<any>, selected?: EventEmitter<any>, isClearCaseOfError?: boolean, isInit = false, workspaceIds?: number[]): void {

		let objId: number = targetData.objId;
		let folderTreeForTargetId: number;

		let contractNode: (node: EIMFolderTreeNode, targetId: number) => void = (node: EIMFolderTreeNode, targetId: number): void => {
			if (Number(node.objId) === targetId) {
				node.expanded = false;
				return;
			}

			for (let i = 0; i < node.children.length; i++) {
				contractNode(node.children[i], targetId);
			}
		};

		if (isPlace === false) {

			folderTreeForTargetId = targetData.objId;
			// 選択階層までを設定する
			this.hierarchicalContentsService.getFolderTreeForTarget(folderTreeForTargetId, workspaceIds)
			.subscribe((workspaces: EIMHierarchicalContents[]) => {

			let original: EIMFolderTreeNode[] = info.data;

			// サーバーから取得したデータからジャンプ対象のフォルダが存在しているワークスペース直下のフォルダを特定する
			let targetFolderNode: EIMFolderTreeNode;
			for (let i = 0; i < workspaces.length; i++) {
				let newWSTreeNode: EIMFolderTreeNode = this.convertHierarchicalDataToEIMFolderTreeNode(workspaces[i]);
				for (let j = 0; j < newWSTreeNode.children.length; j++) {
					if (newWSTreeNode.children[j].children.length > 0) {
						targetFolderNode = newWSTreeNode.children[j];
						// ジャンプ対象フォルダのexpandedをfalseに設定する
						contractNode(targetFolderNode, folderTreeForTargetId);
						break;
					}
				}
			}

			let isSwapped = false;
			// 現在のワークスペースツリーからジャンプ対象のフォルダが存在しているワークスペース直下のフォルダを
			// 特定してサーバーから取得したフォルダノードと入れ替える
			if (targetFolderNode) {
				for (let i = 0; i < original.length; i++) {
					// ワークスペースが一致
					if (Number(original[i].objId) === Number((targetFolderNode.parent as EIMFolderTreeNode).objId)) {
						for (let j = 0; j < original[i].children.length; j++) {
							let folderNode: EIMFolderTreeNode = original[i].children[j];
							// フォルダが一致
							if (Number(folderNode.objId) === Number(targetFolderNode.objId)) {
								// 入れ替える
								original[i].children[j] = targetFolderNode;
								isSwapped = true;
							}
						}
					}
				}
			}

			if (!isSwapped) {
				// 入れ替えていない場合、サーバーから取得したデータをそのままセットする
				info.data = [];
				workspaces.forEach( (workspace: any) => {
					info.data.push(this.convertHierarchicalDataToEIMFolderTreeNode(workspace));
				});
			}

			// 選択処理実行
			this.select(info, [{ objId: targetData.objId }], selected, {selectionTargetRows: [{objId: objId, isDocumentLink: 'false'}], selectionTargetDocumentLink: false}, isInit ? initialized : null);

			}, (err: any) => {
				if (isClearCaseOfError) {
					info.selectedData = [];
					info.data = [];
					this.initRoot(info, initialized, selected);
				}
			});

		} else if (targetData.linkParentObjId && targetData.linkParentObjId !== '-') {
			// 親オブジェクトIDが指定されている場合

			folderTreeForTargetId = targetData.linkParentObjId;

			// 選択階層までを設定する
			this.hierarchicalContentsService.getFolderTreeForTarget(folderTreeForTargetId, workspaceIds)
				.subscribe((workspaces: EIMHierarchicalContents[]) => {

				let original: EIMFolderTreeNode[] = info.data;

				// サーバーから取得したデータからジャンプ対象のフォルダが存在しているワークスペース直下のフォルダを特定する
				let targetFolderNode: EIMFolderTreeNode;
				for (let i = 0; i < workspaces.length; i++) {
					let newWSTreeNode: EIMFolderTreeNode = this.convertHierarchicalDataToEIMFolderTreeNode(workspaces[i]);
					for (let j = 0; j < newWSTreeNode.children.length; j++) {
						if (newWSTreeNode.children[j].children.length > 0) {
							targetFolderNode = newWSTreeNode.children[j];
							// ジャンプ対象フォルダのexpandedをfalseに設定する
							contractNode(targetFolderNode, folderTreeForTargetId);
							break;
						}
					}
				}

				let isSwapped = false;
				// 現在のワークスペースツリーからジャンプ対象のフォルダが存在しているワークスペース直下のフォルダを
				// 特定してサーバーから取得したフォルダノードと入れ替える
				if (targetFolderNode) {
					for (let i = 0; i < original.length; i++) {
						// ワークスペースが一致
						if (Number(original[i].objId) === Number((targetFolderNode.parent as EIMFolderTreeNode).objId)) {
							for (let j = 0; j < original[i].children.length; j++) {
								let folderNode: EIMFolderTreeNode = original[i].children[j];
								// フォルダが一致
								if (Number(folderNode.objId) === Number(targetFolderNode.objId)) {
									// 入れ替える
									original[i].children[j] = targetFolderNode;
									isSwapped = true;
								}
							}
						}
					}
				}

				if (!isSwapped) {
					// 入れ替えていない場合、サーバーから取得したデータをそのままセットする
					info.data = [];
					workspaces.forEach( (workspace: any) => {
						info.data.push(this.convertHierarchicalDataToEIMFolderTreeNode(workspace));
					});
				}

				// 選択処理実行
				this.select(info, [{ objId: folderTreeForTargetId }], selected, {selectionTargetRows: [{objId: objId, isDocumentLink: 'true'}], selectionTargetDocumentLink: true}, isInit ? initialized : null);

			}, (err: any) => {
				if (isClearCaseOfError) {
					info.selectedData = [];
					info.data = [];
					this.initRoot(info, initialized, selected);
				}
			});

		} else {
			// 親を取得する
			// 引数のオブジェクトIDは過去版の場合もあるのでgetParentFolderで最新版のオブジェクトIDと
			// 親フォルダのIDを取得する
			this.folderService.getParentFolder(objId).subscribe((data: any) => {

				objId = data.objId;
				folderTreeForTargetId = data.objId;

				// ごみ箱の場合
				if ((this.trashObjectId && this.trashObjectId === Number(data.parentObjId)) || data.isWsRecycle) {
					folderTreeForTargetId = data.parentObjId;
				}

				// 選択階層までを設定する
				this.hierarchicalContentsService.getFolderTreeForTarget(folderTreeForTargetId, workspaceIds)
					.subscribe((workspaces: EIMHierarchicalContents[]) => {

					let original: EIMFolderTreeNode[] = info.data;

					// サーバーから取得したデータからジャンプ対象のフォルダが存在しているワークスペース直下のフォルダを特定する
					let targetFolderNode: EIMFolderTreeNode;
					for (let i = 0; i < workspaces.length; i++) {
						let newWSTreeNode: EIMFolderTreeNode = this.convertHierarchicalDataToEIMFolderTreeNode(workspaces[i]);
						for (let j = 0; j < newWSTreeNode.children.length; j++) {
							if (newWSTreeNode.children[j].children.length > 0) {
								targetFolderNode = newWSTreeNode.children[j];
								// ジャンプ対象フォルダのexpandedをfalseに設定する
								contractNode(targetFolderNode, folderTreeForTargetId);
								break;
							}
						}
					}

					let isSwapped = false;
					// 現在のワークスペースツリーからジャンプ対象のフォルダが存在しているワークスペース直下のフォルダを
					// 特定してサーバーから取得したフォルダノードと入れ替える
					if (targetFolderNode) {
						for (let i = 0; i < original.length; i++) {
							// ワークスペースが一致
							if (Number(original[i].objId) === Number((targetFolderNode.parent as EIMFolderTreeNode).objId)) {
								for (let j = 0; j < original[i].children.length; j++) {
									let folderNode: EIMFolderTreeNode = original[i].children[j];
									// フォルダが一致
									if (Number(folderNode.objId) === Number(targetFolderNode.objId)) {
										// 入れ替える
										original[i].children[j] = targetFolderNode;
										isSwapped = true;
									}
								}
							}
						}
					}

					if (!isSwapped) {
						// 入れ替えていない場合、サーバーから取得したデータをそのままセットする
						info.data = [];
						workspaces.forEach( (workspace: any) => {
							info.data.push(this.convertHierarchicalDataToEIMFolderTreeNode(workspace));
						});
					}

					// 選択処理実行
					this.select(info, [{ objId: data.parentObjId }], selected, {selectionTargetRows: [{objId: objId, isDocumentLink: 'false'}], selectionTargetDocumentLink: false}, isInit ? initialized : null);

				}, (err: any) => {
					if (isClearCaseOfError) {
						info.selectedData = [];
						info.data = [];
						this.initRoot(info, initialized, selected);
					}
				});

			}, (err: any) => {
				if (isClearCaseOfError) {
					info.selectedData = [];
					info.data = [];
					this.initRoot(info, initialized, selected);
				}
			});
		}
	}

	/**
	 * 最新の情報に更新する.
	 * @param info グリッドコンポーネント情報
	 * @param objId 現在選択しているツリーノードのオブジェクトID
	 * @param selectedObjects グリッド選択状態のオブジェクトID
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 * @param params パラメータ
	 */
	public updateLatest(info: EIMListComponentInfo<EIMFolderTreeNode>, objId: any, selectionTargetRows: number[], initialized?: EventEmitter<any>, selected?: EventEmitter<any>, params?: any): void {

		if (objId) {
			// 選択階層までを設定する
			this.hierarchicalContentsService.getFolderTreeForTarget(objId)
				.subscribe((workspaces: EIMHierarchicalContents[]) => {
					info.data = [];
					for (let i = 0; i < workspaces.length; i++) {
						let folderTreeNode: EIMFolderTreeNode = this.convertHierarchicalDataToEIMFolderTreeNode(workspaces[i]);
						info.data.push(folderTreeNode);
					}
					this.select(info, [{ objId: objId }], selected, {selectionTargetRows: selectionTargetRows});
				}, (err: any) => {
					// エラーの場合、ツリー初期表示を実行する
					info.selectedData = [];
					info.data = [];
					this.initRoot(info, initialized, selected);
				});
		} else {
			// ツリー初期表示を実行する
			info.selectedData = [];
			info.data = [];
			this.initRoot(info, initialized, selected);
		}
	}

	/**
	 * 指定ノードを選択します.
	 * @param info ノード情報
	 * @param selectedData 指定ノード
	 * @param selected 選択完了エミッタ
	 * @param params 選択完了エミッタパラメータ
	 */
	public select(info: EIMListComponentInfo<EIMTreeNode>, selectedData: EIMTreeNode[], selected?: EventEmitter<any>, params?: any, initialized?: EventEmitter<any>): void {

		let data: EIMTreeNode[] = [];
		let targetPath = '';
		if (selectedData[0]['targetpath']) {
			targetPath = selectedData[0]['targetpath'];
		}

		let selectedNode: EIMTreeNode = null;
		for (let i = 0; i < info.data.length; i++) {
			let nodePath = '/';

			if (this.defaultEquals(info.data[i], selectedData[0]) && (targetPath === '' || nodePath === targetPath)) {
				selectedNode = info.data[i];
				break;
			}
			nodePath = nodePath + info.data[i]['label'] + '/';
			selectedNode = this.getTaegetNode(info.data[i].children, selectedData[0], nodePath, targetPath);
			if (selectedNode !== null) {
				break;
			}
		}
		if (selectedNode != null) {
			data.push(selectedNode);
		}
		info.selectedData = data;

		if (initialized) {
			initialized.emit({ selectedData: info.selectedData, params: params });
		}

		if (selected) {
			selected.emit({selectedData: info.selectedData, params: params});
		}
	}


	/**
	 * パスに合致したノードを削除します.
	 * @param info ノード情報
	 * @param data 削除対象ノード
	 */
	public deleteNodeByPath(info: EIMListComponentInfo<EIMTreeNode>, deletedData: any[]): void {

		let targetPath = '';
		if (deletedData[0]['targetpath']) {
			targetPath = deletedData[0]['targetpath'];
		}

		let deletedNode: EIMTreeNode = null;
		for (let i = 0; i < info.data.length; i++) {
			let nodePath = '/';

			if (this.defaultEquals(info.data[i], deletedData[0]) && (targetPath === '' || nodePath === targetPath)) {
				deletedNode = info.data[i];
				break;
			}
			nodePath = nodePath + info.data[i]['label'] + '/';
			deletedNode = this.getTaegetNode(info.data[i].children, deletedData[0], nodePath, targetPath);
			if (deletedNode !== null) {
				break;
			}
		}

		// ごみ箱等、ツリーに存在しない削除データの場合は何もしない
		if (!deletedNode) {
			return;
		}

		let parent = deletedNode.parent;
		for (let i = 0; i < parent.children.length; i++) {
			if (parent.children[i]['objId'] === deletedNode.objId) {
				if (parent.children.length === 1) {
					parent['leaf'] = true;
				}
				parent.children.splice(i, 1);
				break;
			}
		}
	}

	/**
	 * 第1階層のワークスペースを設定します.
	 * @param info データグリッドコンポーネント情報
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 * @param workspaceIds 表示対象のワークスペースID(指定したワークスペースのみ返却する)
	 */
	public initRoot(info: EIMListComponentInfo<EIMFolderTreeNode>, initialized: EventEmitter<any>, selected: EventEmitter<any>, workspaceIds?: number[]): void {
		this.hierarchicalContentsService.getRoot(false, workspaceIds)
			.subscribe((workspaces: EIMHierarchicalContents[]) => {
				let selectedObjectId = null;
				if (workspaceIds && workspaceIds.length > 0) {
					selectedObjectId = workspaceIds[0];
				}
				for (let i = 0; i < workspaces.length; i++) {
					let folderTreeNode: EIMFolderTreeNode = this.convertHierarchicalDataToEIMFolderTreeNode(workspaces[i]);
					info.data.push(folderTreeNode);
				}
				// 初期化処理が終わったのでイベント発行
				if (initialized) {
					initialized.emit({});
				}

				// 選択処理実行
				this.select(info, [{ objId: selectedObjectId }], selected);
			});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * アイコンを取得する
	 * @param node ツリーノード
	 * @return アイコンクラス文字列
	 */
	private getIcon(node): string {
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE) {
			return 'fa fa-lg eim-icon-workspace eim-icon-workspace-color';
		}
		if (node.objTypeName === '属性') {
			return 'fa fa-cubes eim-icon-workspace-color';
		}
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
			if (node.isWorkflowFolder === 'true') {
				// ワークフロー付きフォルダ
				return 'eim-icon-wf-folder eim-icon-wf-folder-color';
			} else {
				return 'eim-icon-folder eim-icon-folder-color';
			}
		}
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			return 'fa fa-lg eim-icon-tag eim-icon-tag-color';
		}

		return 'eim-icon-trash eim-icon-trash-color';
	}

	/**
	 * 指定したノードがツリーデータに存在するかチェックする
	 * @param treeNodes ツリーデータ
	 * @param targetNode 対象ノード
	 * @return true: 存在する false: 存在しない
	 */
	private existsNode(treeNodes, targetNode): boolean {
		let exist = false;
		for (let i = 0; i < treeNodes.length; i++) {
			if (exist === true) {
				break;
			}
			let treeNode: EIMFolderTreeNode = treeNodes[i];
			let children: EIMFolderTreeNode[] = treeNode.children;
			let selectNode;
			if (treeNode.objId === Number(targetNode.objId)) {
				exist = true;
				break;
			}
			if (children.length > 0) {
				exist = this.existsNode(children, targetNode);
			}
		}
		return exist;
	}

	/**
	 * 選択するノードを返却します.
	 * @param nodes 検索対象ノードリスト
	 * @param selectNode 選択対象ノード
	 * @param nodePath 検索中ノードパス
	 * @param targetPath 対象対象ノードパス
	 * @return 選択するノード
	 */
	private getTaegetNode(nodes: EIMHierarchicalDomain[], selectNode: any, nodePath: string, targetPath: string) {
		if (nodes == null) {
			return null;
		}

		for (let i = 0; i < nodes.length; i++) {
			let node: EIMHierarchicalDomain = nodes[i];
			if (this.defaultEquals(node, selectNode)  && (targetPath === '' || nodePath === targetPath)) {
				return node;
			} else {
				let children: EIMHierarchicalDomain[] = node.children;
				if (children != null && children.length > 0) {
					 let result = this.getTaegetNode(children, selectNode, nodePath + node['label'] + '/', targetPath);
					 if (result !== null) {
						 return result;
					 }
				}
			}
		}
		return null;
	}
}
