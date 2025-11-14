import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMFolderService, EIMFolder } from 'app/documents/shared/services/apis/folder.service';
import { EIMComponent, EIMSelectable, EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';

import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';


import { EIMContentsTreeComponentService, EIMFolderTreeNode } from 'app/documents/components/contents-tree/contents-tree.component.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * フォルダ選択ツリーコンポーネント
 * @example
 *
 *      <eim-folder-tree-selector
 *          [content]="content"
 *          [workspaceObjId]="workspaceObjId"
 *      </eim-folder-tree-selector>
 */
@Component({
    selector: 'eim-folder-tree-selector',
    templateUrl: './folder-tree-selector.component.html',
    styleUrls: ['./folder-tree-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFolderTreeSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMFolderTreeSelectorComponent) },
        EIMContentsTreeComponentService,
    ],
    standalone: false
})
export class EIMFolderTreeSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMSelectable {

	/** ドキュメントツリーコンポーネント */
	@ViewChild('folderTree', { static: true })
	public folderTree: EIMTreeComponent;

	/** 対象のオブジェクト */
	@Input() public content: any;

	/** 対象のワークスペースID（ワークスペースで絞る場合に指定） */
	@Input() public workspaceObjId: number;

	/** セキュリティグリッド行選択イベントエミッタ */
	@Output() public selected: EventEmitter<any> = new EventEmitter<any>();

	/** ツリー選択ノード */
	public selectedTreeNode: EIMTreeNode;

	/** ツリー選択データ */
	public contentsTreeSelectedData: any;


	/** ツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
			{label: this.translateService.instant('EIM.LABEL_03027'), name: '', icon: 'fa fa-fw fa-expand', command: (event) => { this.expandAll(); }},
			{label: this.translateService.instant('EIM.LABEL_03028'), name: '', icon: 'fa fa-fw fa-compress', command: (event) => { this.collapseAll(); }},
	];

	/**
	 * コンストラクタ.
	 */
	constructor(
		protected folderService: EIMFolderService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected translateService: TranslateService,
		public contentsTreeComponentService: EIMContentsTreeComponentService,
		protected serverConfigService: EIMServerConfigService,
	) {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択ボタン押下時の処理を実施します.
	 * selectedイベントエミッタを発火します.
	 */
	public select(): void {
		// 呼び出し元に選択したドキュメントタイプを返却する
		// 選択したドキュメントタイプ情報を呼び出し元に通知
		this.selected.emit(this.selectedTreeNode);
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		return (this.selectedTreeNode != null);
	}

	/**
	 * 画面を表示します.
	 */
	public show(): void {

		if (this.workspaceObjId) {
			this.folderService.getChildFolders(this.workspaceObjId)
				.subscribe((folder: EIMFolder[]) => {
					this.setTreeData(folder);
				});

		} else {
			// ワークスペース一覧取得
			this.folderService.getWorkspaces()
				.subscribe((folder: EIMFolder[]) => {
					this.setTreeData(folder);
				});
		}
	}

	/**
	 * 全展開イベントハンドラ.
	 * ツリーノードを全て展開する
	 */
	public expandAll(): void {
		this.folderTree.expandAll();
	}

	/**
	 * 全縮小イベントハンドラ.
	 * ツリーノードを全て折り畳む
	 */
	public collapseAll(): void {
		this.folderTree.collapseAll();
	}

	/**
	 * 選択情報を取得します.
	 */
	public getSelectedData(): any[] {
		return [this.folderTree.getSelectedData()[0].data];
	}

	/**
	 * フィルタを実行します.
	 * 何もしません.
	 * @param unvisibleData 非表示データ
	 */
	public filter(unvisibleData: any[]): void {
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit(): void {

		this.folderTree.initialized.subscribe(() => {
			let nodes: EIMTreeNode[] = this.folderTree.getData();


			// パス指定がある場合
			if (this.content && this.content.selectPath) {
				window.setTimeout(() => {

					// オブジェクト名に分割
					let pathObjNames: string[] = String(this.content.selectPath).split('/');
					// 先頭と末尾の空要素削除
					pathObjNames.shift();
					pathObjNames.pop();
					// 選択
					this.selectNodeFromPath(nodes, pathObjNames, 0);

				});
			}
		});
	}

	/**
	 * フォルダツリーノード選択ハンドラです.
	 * 子オブジェクトを取得して、フォルダツリー、ドキュメント一覧を更新します.
	 * @param event イベント
	 */
	public onSelectFolderTreeNode(event: any) {
		this.selectedTreeNode = event.selectedData[0];

		let treeNodes: EIMFolderTreeNode[] = event.selectedData as EIMFolderTreeNode[];
		this.expandTree(treeNodes[0]);
	}

	/**
	 * フォルダツリーノードを展開イベントハンドラです.
	 * @param treeNodes 展開対象のフォルダツリーノード
	 */
	public onExpandTreeNode(treeNodes: EIMFolderTreeNode[]): void {
		let treeNode: EIMFolderTreeNode = treeNodes[0];
		this.expandTree(treeNode);
	}

	/*******************************************
	 *非公開メソッド
	 *******************************************/
	private setTreeData(hierarchicalContentsType: EIMFolder[]): void {
		let treeData = this.hierarchicalDomainService.convert(hierarchicalContentsType, (type: EIMHierarchicalObjectTypeDomain): EIMTreeNode => {
			// コンバート
			let selectable = true;
			if (type.children && type.children.length > 0) {
				selectable = false;
			}

			let label: string;
			if (type.name === this.translateService.instant('EIM_DOCUMENTS.DOCUMENT')) {
				label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_DOCUMENT')
			} else if (type.name === this.translateService.instant('EIM_DOCUMENTS.FOLDER')) {
				label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_FOLDER')
			} else {
				label = type.name;
			}

			let treeNode: EIMTreeNode = {
				label: label,
				expandedIcon: 'fa-fw fa-lg eim-icon-document eim-icon-document-color',
				collapsedIcon: 'fa-fw fa-lg eim-icon-document eim-icon-document-color',
				data: type
			};
			return treeNode;
		});
		window.setTimeout(() => {
			// データをセット
			this.folderTree.setData(treeData);

			// ツリーを全展開
			this.folderTree.expandAll();
		});
	}

	/**
	 * ツリーを展開します.
	 * @param treeNode 展開するツリーノード
	 */
	private expandTree(treeNode: any): void {
		if (!treeNode || treeNode['_isRetrievedChildren'] || treeNode['isTrash']) {
			// ツリーノードが存在しない、又は子階層取得済み、又はごみ箱なら何もしない
			return;
		}

		treeNode['_isRetrievedChildren'] = true;

		this.folderService.getChildFolders(treeNode.objId)
		.subscribe(
				(objectList: any) => {

					// ツリー選択ノードにグリッドデータ(子データ)をセットする
					let data: any[] = objectList;
					if (!data || data.length === 0) {
						// 0件の場合
						data = [];
						treeNode.leaf = true;
						treeNode.isBranch = false;
						treeNode.isSearch = true;
					} else if (data.length > 0 && !treeNode.isTrash ) {

						let childFolderItems: EIMFolderTreeNode[] = [];
						let wsRecycleNode: EIMFolderTreeNode;
						for (let i = 0; i < data.length; i++) {
							let folderItem = data[i];
							if ( folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER ) {
								childFolderItems.push(this.contentsTreeComponentService.convertRowDataToEIMFolderTreeNode(folderItem));
							} else if (folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
								wsRecycleNode = this.contentsTreeComponentService.convertRowDataToEIMFolderTreeNode(folderItem);
								wsRecycleNode.isTrash = true;
								wsRecycleNode.isSearch = true;
								wsRecycleNode.isBranch = false;
								wsRecycleNode.leaf = true;

							}
						}
						if (wsRecycleNode) {
							childFolderItems.push(wsRecycleNode);
						}
						this.folderTree.setChildren(treeNode, childFolderItems);
						treeNode.expanded = true;
						// セット済みをtrueにする
						treeNode.isSearch = true;
					}
				}
		);
	}

	/**
	 * パスからノードを選択します.
	 * @param nodes 対象ノード配列
	 * @param objNames オブジェクト名配列
	 * @param index オブジェクト名配列の選択対象のインデックス
	 */
	private selectNodeFromPath(nodes, objNames, index) {
		for (let i = 0; i < nodes.length; i++) {
			if (objNames[index] === nodes[i].data.objName) {
				// パス末尾の場合
				if (objNames.length === index + 1) {
					this.folderTree.select([nodes[i]], false);
					return;
				} else {
					this.folderService.getChildFolders(nodes[i].data.objId).subscribe((objectList: any[]) => {
						// ツリーにセット
						let childFolderItems: EIMFolderTreeNode[] = [];
						let wsRecycleNode: EIMFolderTreeNode;
						for (let j = 0; j < objectList.length; j++) {
							let folderItem = objectList[j];
							if ( folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER ) {
									childFolderItems.push(this.contentsTreeComponentService.convertRowDataToEIMFolderTreeNode(folderItem));
							} else if (folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
								wsRecycleNode = this.contentsTreeComponentService.convertRowDataToEIMFolderTreeNode(folderItem);
								wsRecycleNode.isTrash = true;
								wsRecycleNode.isSearch = true;
								wsRecycleNode.isBranch = false;
								wsRecycleNode.leaf = true;
							}
						}
						if (wsRecycleNode) {
							childFolderItems.push(wsRecycleNode);
						}
						this.folderTree.setChildren(nodes[i], childFolderItems);
						nodes[i].expanded = true;
						nodes[i].isSearch = true;

						// 再帰
						this.selectNodeFromPath(nodes[i].children, objNames, index + 1);
						return;
					});
				}
			}
		}
	}
}
