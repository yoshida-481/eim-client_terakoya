import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, DoCheck } from '@angular/core';

import { TreeNode } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { EIMHierarchicalComponent, EIMListComponentInfo, EIMComponentTreeNode } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from './tree.component.service';
import { EIMMenuChangeDetectionService, EIMMenuChangeDetectionServiceInfo } from 'app/shared/services/menu-change-detection.service';
import { EIMTreeFormatResultDTO } from 'app/shared/dtos/tree-format-result.dto';
import { EIMTreeFormatResultDTOToTreeNodesConverterService } from 'app/shared/services/converters/tree-format-result-dto-to-tree-nodes-converter.service';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMListFormatResultDTOToTreeNodesConverterService } from 'app/shared/services/converters/list-format-result-dto-to-tree-nodes-converter.service';
import { EIMTreeNodeService } from 'app/shared/services/tree-node.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';

/** ツリーコンポーネント用ツリーノード情報 */
export interface EIMTreeTreeNode extends EIMComponentTreeNode {
	// treeNodeId: string, // リンクも表示する場合は"<オブジェクトID>_<リレーションID>"等、必ず一意にしてください
	// dto: any,
	// leaf?: boolean,
	// expanded?: boolean,
	parentTreeNode?: EIMTreeTreeNode,
	childTreeNodes?: EIMTreeTreeNode[],
	label?: string,
	expandedIcon?: string,
	collapsedIcon?: string,
	type?: string,
	styleClass?: string,
	selectable?: boolean,
	filter?: boolean
}

/**
 * ツリーコンポーネント
 * @import
 *    import { EIMTreeComponent } from 'app/shared/components/tree/tree.module';
 * @example
 *
 *      <eim-tree
 *          [(nodes)]="nodes"
 *          [(selectedNode)]="selectedNode"
 *          (selectTreeNode)="onSelectFolderTreeNode($event)"
 *          [equals]="equals">
 *      </eim-tree>
 */
@Component({
    selector: 'eim-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.css'],
    providers: [],
    standalone: false
})
export class EIMTreeComponent implements OnInit, OnChanges, DoCheck, EIMHierarchicalComponent<EIMTreeNode> {

	/** コンポーネントサービス */
	@Input()
		public componentService: EIMTreeComponentService;

	/** 第1階層のノード情報配列 */
	@Input()
		public data: EIMTreeNode[];

	/** 選択ノード */
	@Input()
		public selectedData: EIMTreeNode[];

	/** 同一行判定関数 */
	@Input()
		public equals: (a: any, b: any) => boolean;

	/** 複数行選択可フラグ */
	@Input()
		public multiple = false;

	/** コンテキストメニュー */
  	public contextMenu;

	/** コンテキストメニューアイテム */
	@Input()
		public contextMenuItems: MenuItem[];

	/** ノード選択時にノードを開くかどうか */
	@Input()
		public enableOpenOnSelect = false;

	/** ツリーノードに対して追加でプロパティ設定する関数 */
	@Input()
		public setAdditionalPropertiesToTreeNodeFunction: (treeNode: EIMTreeTreeNode, dto: any) => EIMTreeTreeNode;

	/** ツリーノードの親子間の関連設定関数 */
	@Input()
		public setAdditionalTreeNodeRelationFunction:
			(parentTreeNode: EIMTreeTreeNode, childTreeNodes: EIMTreeTreeNode[]) => void;

	/** マウスオーバーメニュー表示フラグ */
	@Input()
		public isDispMouseOverMenu = false;
	
	/** マウスオーバーメニュー表示フラグ */
	@Input()
		public visibleMouseOverMenuFunction: (treeNode: EIMTreeTreeNode) => boolean = null;

	/** フィルタ表示フラグ */
	@Input()
		public filter = false;

	/** 初期化イベントエミッタ */
	@Output()
		public initialized: EventEmitter<EIMTreeNode[]> = new EventEmitter<EIMTreeNode[]>();

	/** ノード選択イベントエミッタ */
	@Output()
		public selected: EventEmitter<any> = new EventEmitter<any>();

	/** ノード展開イベントエミッタ */
	@Output()
		public expanded: EventEmitter<EIMTreeNode[] | {expandedData: EIMTreeTreeNode, eventDateTime: Date}> = 
				new EventEmitter<EIMTreeNode[] | {expandedData: EIMTreeTreeNode, eventDateTime: Date}>();

	/** 右クリックイベントエミッタ */
	@Output()
		public contextmenu: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラーイベントエミッタ */
	@Output()
		public errored: EventEmitter<any> = new EventEmitter<any>();

	/** コンポーネント情報 */
	public info: EIMListComponentInfo<EIMTreeNode>;

	// multipleを使用してください。
	// /** 複数入力 */
	// @Input()
	// 	public selectionMode = 'single';

	/** コンテキストメニュー要素のDiffer情報 */
	private menuInfo: EIMMenuChangeDetectionServiceInfo;

	/** マウスエンター時ノード */
	private mouseEnterNode: TreeNode | null = null;

	/** アイコンへのマウスエンターフラグ */
	private mouseEnterNodeIcon: boolean = false;

	/** ツリーコンポーネント用ツリーノードのリスト */
	private treeTreeNodes: EIMTreeTreeNode[] = null;

	/** ツリーコンポーネント用ツリーノードのマップ＜ツリーノードID、ツリーノード＞ */
	private treeTreeNodeMap: Map<string, EIMTreeTreeNode> = null;

	/** PrimeNGのツリーコンポーネント用ツリーノードのマップ＜キー、ツリーノード＞ */
	private treeNodeMap: Map<string, TreeNode> = null;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected treeComponentService: EIMTreeComponentService,
			protected listFormatResultDTOToTreeNodesConverterService: EIMListFormatResultDTOToTreeNodesConverterService<EIMTreeTreeNode>,
			protected treeFormatResultDTOToTreeNodesConverterService: EIMTreeFormatResultDTOToTreeNodesConverterService<EIMTreeTreeNode>,
			protected el: ElementRef,
			protected menuChangeDetectionService: EIMMenuChangeDetectionService,
			protected treeNodeService: EIMTreeNodeService,
			protected hierarchicalDomainService: EIMHierarchicalDomainService
	) {
		if (!this.componentService) {
			this.componentService = treeComponentService;
		}

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * データリストを初期化します.
	 */
	public initialize(serviceParam: any = {}, isEmitEvent = true): void {
		this.info = {
				data: (this.data === undefined) ? [] : this.data,
				selectedData: (this.selectedData === undefined) ? [] : this.selectedData
		};

		if (!this.info.errored) {
			this.info.errored = this.errored;
		}

		if (this.equals) {
			this.info.equals = this.equals;
		} else {
			this.info.equals = this.componentService.defaultEquals;
		}

		if (isEmitEvent) {
			this.componentService.initialize(this.info, serviceParam, this.initialized, this.selected);
		} else {
			this.componentService.initialize(this.info, serviceParam);
		}
	}

	/**
	 * ノード情報を設定します.
	 * @param data 第1階層のノード配列
	 */
	public setData(data: EIMTreeNode[] | EIMTreeTreeNode[]): void {
		if (data?.[0]?.['treeNodeId']) {

			// EIMTreeTreeNode指定の場合
			const treeNodes = data as EIMTreeTreeNode[];
			this.componentService.setData(this.info, this.convertToPrimeNGTreeNodes(treeNodes));
			this.treeTreeNodes = treeNodes;
			this.initializeTreeTreeNodeMap();

		} else {

			this.componentService.setData(this.info, data);

		}
	}

	/**
	 * ノード情報を返却します.
	 * @return ノード情報
	 */
	public getData(): EIMTreeNode[] | EIMTreeTreeNode[] {
		if (this.treeTreeNodes) {
			return this.treeTreeNodes;
		}
		return this.info.data;
	}

	/**
	 * リスト形式の簡易結果DTOをツリーのルートに設定します.
	 * @param listFormatResult リスト形式の簡易結果DTO
	 */
	public setListFormatResult(
		listFormatResult: EIMListFormatResultDTO) {

		let nodes: EIMTreeNode[] = this.listFormatResultDTOToTreeNodesConverterService.convert(
				listFormatResult, this.convertDTOToTreeNode.bind(this));

		this.setData(nodes);

		this.initializeTreeTreeNodeMap();
	}

	/**
	 * ツリー形式の簡易結果DTOをツリーのルートに設定します.
	 *
	 * @param treeFormatResult ツリー形式の簡易結果DTO
	 */
	public setTreeFormatResult(
		treeFormatResult: EIMTreeFormatResultDTO) {

		let nodes: EIMTreeNode[] = this.treeFormatResultDTOToTreeNodesConverterService.convert(
			treeFormatResult, this.convertDTOToTreeNode.bind(this), this.setTreeNodeRelation.bind(this));

		this.setData(nodes);

		this.initializeTreeTreeNodeMap();
	}

	/**
	 * 指定した親ノード配下にリスト形式の簡易結果DTOを設定します.
	 *
	 * @param parentTreeNode 親ノード情報
	 * @param listFormatResult リスト形式の簡易結果DTO
	 */
	public setChildListFormatResult(
		_parentTreeNode: EIMTreeTreeNode,
		listFormatResult: EIMListFormatResultDTO) {

		const parentTreeNode = this.treeTreeNodeMap.get(_parentTreeNode.treeNodeId);

		// 親ツリーノードと子ツリーノードを連結
		const childTreeNodes: EIMTreeTreeNode[] = this.listFormatResultDTOToTreeNodesConverterService.convert(
				listFormatResult, this.convertDTOToTreeNode.bind(this));
		parentTreeNode.childTreeNodes = childTreeNodes;
		this.setTreeNodeRelation(parentTreeNode, childTreeNodes);
	
		for (const childTreeNode of childTreeNodes) {
			this.setTreeNodeRelation(childTreeNode, childTreeNode.childTreeNodes);
		}

		// info.dataに反映
		const primeNGParentTreeNode = this.treeNodeMap.get(parentTreeNode.treeNodeId);
		primeNGParentTreeNode.children = this.convertToPrimeNGTreeNodes(parentTreeNode.childTreeNodes);
		primeNGParentTreeNode.leaf = parentTreeNode.leaf;
		primeNGParentTreeNode.expanded = parentTreeNode.expanded;

		this.initializeTreeTreeNodeMap();
	}

	/**
	 * ツリー形式の簡易結果DTOをツリーの階層に設定します.<br>
	 * treeFormatResultの1階層目のノードと同じノードに対して子階層を設定します.
	 * 
	 * @param treeFormatResult ツリー形式の簡易結果DTO
	 */
	public setChildTreeFormatResult(
		treeFormatResult: EIMTreeFormatResultDTO) {

		const _parentTreeNodes: EIMTreeTreeNode[] = this.treeFormatResultDTOToTreeNodesConverterService.convert
				(treeFormatResult, this.convertDTOToTreeNode.bind(this), this.setTreeNodeRelation.bind(this));

		for (let i = 0; i < _parentTreeNodes.length; i++) {

			const parentTreeNode = this.getTreeNodeByTreeNodeId(_parentTreeNodes[i].treeNodeId);
			if (!parentTreeNode) {
				console.log('該当ツリーノードが存在しません。 treeNodeId=' + _parentTreeNodes[i].treeNodeId);
				continue;
			}

			parentTreeNode.childTreeNodes = _parentTreeNodes[i].childTreeNodes;
			this.setTreeNodeRelation(parentTreeNode, parentTreeNode.childTreeNodes);

			for (const childTreeNode of parentTreeNode.childTreeNodes) {
				this.setTreeNodeRelation(childTreeNode, childTreeNode.childTreeNodes);
			}

			// info.dataに反映
			const primeNGParentTreeNode = this.treeNodeMap.get(parentTreeNode.treeNodeId);
			primeNGParentTreeNode.children = this.convertToPrimeNGTreeNodes(parentTreeNode.childTreeNodes);
			primeNGParentTreeNode.leaf = parentTreeNode.leaf;
			primeNGParentTreeNode.expanded = parentTreeNode.expanded;
		}

		this.initializeTreeTreeNodeMap();
	}

	/**
	 * DTOをツリーコンポーネント用のツリーノードに変換します.
	 * 
	 * @param dto DTO
	 * @return ツリーコンポーネント用のツリーノード
	 */
	public convertDTOToTreeNode(dto: any): EIMTreeTreeNode {

		let treeNode: EIMTreeTreeNode = {
			treeNodeId: '' + dto.id,
			label: dto.name,
			dto: dto,
			leaf: false,
			expanded: false,
			parentTreeNode: null,
			childTreeNodes: null
		};

		if (!this.setAdditionalPropertiesToTreeNodeFunction) {
			return treeNode;
		}

		return this.setAdditionalPropertiesToTreeNodeFunction(treeNode, dto);
	}

	/**
	 * 親子の関係を設定します.
	 *
	 * @param parentTreeNode 親のツリーノード
	 * @param childTreeNodes 子のツリーノードリスト
	 */
	public setTreeNodeRelation(parentTreeNode: EIMTreeTreeNode, childTreeNodes: EIMTreeTreeNode[]): void {

		if (parentTreeNode != null) {
			parentTreeNode.childTreeNodes = childTreeNodes;

			// 末端かどうかわからない状態
			if (childTreeNodes === null) {
				parentTreeNode.leaf = false;
				parentTreeNode.expanded = false;

			} else {

				// 末端の場合
				if (childTreeNodes.length === 0) {
					parentTreeNode.leaf = true;
				}
				// 末端ではない場合
				else {
					parentTreeNode.leaf = false;
					parentTreeNode.expanded = true;
				}
			}

		}

		if (childTreeNodes) {
			for (let childTreeNode of childTreeNodes) {
				childTreeNode.parentTreeNode = parentTreeNode;
			}
		}

		if (!this.setAdditionalTreeNodeRelationFunction) {
			return;
		}

		this.setAdditionalTreeNodeRelationFunction(parentTreeNode, childTreeNodes);
	}

	/**
	 * ツリーノードを返却します.
	 *
	 * @param dto DTO
	 * @returns ツリーノード
	 */
	public getTreeNodeByDTO(dto: any): EIMTreeTreeNode {

		const treeNode = this.convertDTOToTreeNode(dto);
		return this.getTreeNodeByTreeNodeId(treeNode.treeNodeId);
	}
	
	/**
	 * ツリーノードを返却します.
	 *
	 * @param treeNodeId ツリーノードID
	 * @returns ツリーノード
	 */
	public getTreeNodeByTreeNodeId(treeNodeId: string): EIMTreeTreeNode {

		return this.treeTreeNodeMap.get(treeNodeId);
	}

	/**
	 * ツリーノードリストを指定位置に追加します.
	 *
	 * @param parentTreeNode 追加先の親ツリーノード(ルートの場合はnullを指定)
	 * @param childTreeNodes 追加するツリーノードリスト
	 * @param indexInParentTreeNodes 親ツリーノードでのインデックス（先頭は0、末尾は未指定）
	 */
	public setChildTreeNodesToIndex(_parentTreeNode: EIMTreeTreeNode, _childTreeNodes: EIMTreeTreeNode[], indexInParentTreeNodes = -1): void {

		if (_childTreeNodes === null) {
			return;
		}

		// 追加するツリーノードリストの子階層を初期化
		for (let i = 0; i < _childTreeNodes.length; i++) {
			this.setTreeNodeRelation(_childTreeNodes[i], _childTreeNodes[i].childTreeNodes);
		}

		let parentTreeNode = null;

		// 親と子をつなげる
		// ルートではない場合
		if (_parentTreeNode !== null) {
			parentTreeNode = this.getTreeNodeByTreeNodeId(_parentTreeNode.treeNodeId);

			// 子階層が存在しない場合
			if (parentTreeNode.childTreeNodes === null || parentTreeNode.childTreeNodes.length === 0) {

				this.setTreeNodeRelation(parentTreeNode, _childTreeNodes);

				// info.dataに反映
				const primeNGParentTreeNode = this.treeNodeMap.get(parentTreeNode.treeNodeId);
				primeNGParentTreeNode.children = this.convertToPrimeNGTreeNodes(_childTreeNodes);
				primeNGParentTreeNode.leaf = parentTreeNode.leaf;
				primeNGParentTreeNode.expanded = parentTreeNode.expanded;
			}
			// 子階層が存在する場合
			else {

				let childTreeNodes: EIMTreeTreeNode[] = [];
				for (let i = 0; i < parentTreeNode.childTreeNodes.length; i++) {
					if (i === indexInParentTreeNodes) {
						break;
					}
					childTreeNodes.push(parentTreeNode.childTreeNodes[i]);
				}
				// 指定箇所にツリーノードを追加する
				childTreeNodes = childTreeNodes.concat(_childTreeNodes);

				if (indexInParentTreeNodes !== -1) {
					for (let i = indexInParentTreeNodes; i < parentTreeNode.childTreeNodes.length; i++) {
						childTreeNodes.push(parentTreeNode.childTreeNodes[i]);
					}
				}

				this.setTreeNodeRelation(parentTreeNode, childTreeNodes);

				// info.dataに反映
				const primeNGParentTreeNode = this.treeNodeMap.get(parentTreeNode.treeNodeId);
				primeNGParentTreeNode.children = this.convertToPrimeNGTreeNodes(childTreeNodes);
				primeNGParentTreeNode.leaf = parentTreeNode.leaf;
				primeNGParentTreeNode.expanded = parentTreeNode.expanded;

			}
		}
		// ルートの場合
		else {

			let rootTreeNodes: EIMTreeTreeNode[] = [];

			for (let i = 0; i < this.treeTreeNodes.length; i++) {
				if (i === indexInParentTreeNodes) {
					break;
				}
				rootTreeNodes.push(this.treeTreeNodes[i]);
			}
			// 指定箇所にツリーノードを追加する
			rootTreeNodes = rootTreeNodes.concat(_childTreeNodes);

			if (indexInParentTreeNodes !== -1) {
				for (let i = indexInParentTreeNodes; i < this.treeTreeNodes.length; i++) {
					rootTreeNodes.push(this.treeTreeNodes[i]);
				}
			}
			this.treeTreeNodes = rootTreeNodes;

			// info.dataに反映
			this.info.data.splice(indexInParentTreeNodes, 0, ...this.convertToPrimeNGTreeNodes(_childTreeNodes));

		}

		this.initializeTreeTreeNodeMap();
	}

	/**
	 * 指定したツリーノードリストを更新します.
	 * @param treeNodes 更新するツリーノードリスト
	 */
	public updateTreeNodes(treeNodes: EIMTreeTreeNode[]): void {
	
		for (let i = 0; i < treeNodes.length; i++) {

			// EIMTreeTreeNode更新
			const treeTreeNode = this.getTreeNodeByTreeNodeId(treeNodes[i].treeNodeId);
			this.copyTreeTreeNode(treeTreeNode, treeNodes[i]);

			// info.data更新
			const primeNgTreeTreeNode = this.treeNodeMap.get(treeNodes[i].treeNodeId);
			this.copyTreeNode(primeNgTreeTreeNode, this.convertToPrimeNGTreeNodes([treeNodes[i]])[0]);
		}

		this.initializeTreeTreeNodeMap();
	}

	/**
	 * 指定したツリーノードリストを削除します.
	 * @param treeNodes 削除するツリーノードリスト
	 */
	public removeTreeNodes(treeNodes: EIMTreeTreeNode[]): void {

		let deleteTreeNodes: EIMTreeTreeNode[] = [];
		for (let i = 0; i < treeNodes.length; i++) {
			const targetTreeNode = this.getTreeNodeByTreeNodeId(treeNodes[i].treeNodeId);
			if (!targetTreeNode) {
				continue;
			}
			deleteTreeNodes.push(targetTreeNode);
		}

		// TreeTreeNodeリストから削除
		this.treeTreeNodes = this.treeNodeService.removeTreeNodes(this.getData() as EIMTreeTreeNode[], deleteTreeNodes) as EIMTreeTreeNode[];
		// 親子関係更新
		for (let i = 0; i < deleteTreeNodes.length; i++) {
			const parentTreeNode = deleteTreeNodes[i].parentTreeNode;
			this.setTreeNodeRelation(parentTreeNode, parentTreeNode.childTreeNodes);
		}

		// info.dataから削除
		for (let i = 0; i < treeNodes.length; i++) {
			const deletePrimeNGTreeNode: TreeNode = this.treeNodeMap.get(treeNodes[i].treeNodeId);
			const parentTreeNode = this.getTreeNodeByTreeNodeId(treeNodes[i].parentTreeNode.treeNodeId);
			const parentPrimeNGTreeNode = deletePrimeNGTreeNode.parent;
			if (parentPrimeNGTreeNode) {

				// ルート以外の場合
				const childTreeNodes = parentPrimeNGTreeNode.children;
				parentPrimeNGTreeNode.children = childTreeNodes.filter(function( treeNode ) {

					return treeNode.key !== deletePrimeNGTreeNode.key;
				
				});
				parentPrimeNGTreeNode.leaf = parentTreeNode.leaf;
				parentPrimeNGTreeNode.expanded = parentTreeNode.expanded;


			} else {

				// ルートの場合
				for (let j = this.info.data.length - 1; j > -1; j--) {

					if (this.info.data[j]['key'] === deletePrimeNGTreeNode.key) {
						this.info.data.splice(j, 1);
					}
				}
			}
		}

		this.initializeTreeTreeNodeMap();

	}
	
	
	/**
	 * ノードを選択します.
	 */
	public select(selectedNode: EIMTreeNode[] | EIMTreeTreeNode[], isEmitEvent = true): void {

		// 選択して該当行までスクロール（EIMTreeTreeNode使用時のみ）
		if (selectedNode && selectedNode.length > 0 && selectedNode[0]['treeNodeId']) {

			// 選択を通知
			const eventDateTime: Date = new Date();

			const selectedTreeNodes: EIMTreeTreeNode[] = selectedNode as EIMTreeTreeNode[];

			let _selectedTreeNodes: EIMTreeTreeNode[] = [];

			if (this.treeTreeNodeMap) {
				
				for (let i = 0; i < selectedTreeNodes.length; i++) {
					const selectedTreeNode = this.treeTreeNodeMap.get(selectedTreeNodes[i].treeNodeId);
					if (!selectedTreeNode) {
						continue;
					}
					_selectedTreeNodes.push(selectedTreeNode);

					// 親階層を開く
					let targetTreeNode = selectedTreeNode.parentTreeNode;
					while (targetTreeNode !== null) {
						targetTreeNode.expanded = true;
						this.updateTreeNodes([targetTreeNode]);

						targetTreeNode = targetTreeNode.parentTreeNode;
					}
				}
			}

			this.info.selectedData = this.convertToPrimeNGTreeNodes(_selectedTreeNodes);
			if (isEmitEvent) {
				this.selected.emit({selectedData: _selectedTreeNodes, eventDateTime: eventDateTime});
			}
			
			if (_selectedTreeNodes.length > 0) {
				this.scrollToTreeNode(_selectedTreeNodes[0]);
			}

		} else {

			if (isEmitEvent) {
				this.componentService.select(this.info, selectedNode, this.selected);
			} else {
				this.componentService.select(this.info, selectedNode);
			}
	
		}
	}

	/**
	 * 選択ノードを返却します.
	 * @return 選択ノード
	 */
	public getSelectedData(): any[] {
		
		if (this.treeTreeNodeMap) {

			const treeNodes = this.info.selectedData as TreeNode[];

			let retTreeNodes = [];
			for (let i = 0; i < treeNodes.length; i++) {
				const selectedTreeTreeNode = this.treeTreeNodeMap.get(treeNodes[i].key);
				if (selectedTreeTreeNode) {
					retTreeNodes.push(selectedTreeTreeNode);
				}
			}
			return retTreeNodes;
		}
		
		return this.info.selectedData;
	}

	/**
	 * 親ノードに子ノードを設定します.
	 * 親ノード、子ノードが空の場合は、何もしません.
	 * 親ノードが空の場合は、ルートに設定します.
	 * 子ノードが空の場合は、親ノードをリーフノードに変更します.
	 * @param parentNode 親ノード
	 * @param childNodes 子ノード配列
	 */
	public setChildren(parentNode: EIMTreeNode, childNodes: EIMTreeNode[]): void {
		this.componentService.setChildren(this.info, parentNode, childNodes)
	}

	/**
	 * ノードを展開します.
	 * @param node 対象ノード
	 * @param isExpand 展開/縮小
	 */
	public expand(node: TreeNode, isExpand: boolean) {
		node.expanded = isExpand;

		// EIMTreeTreeNodeに反映
		if (this.treeTreeNodes) {
			const treeNode: EIMTreeTreeNode = this.getTreeNodeByTreeNodeId(node.key);
			treeNode.expanded = isExpand;
		}
	}

	/**
	 * ノードを全展開します.
	 */
	public expandAll(): void {
		this.info.data.forEach( (node: any) => {
			this.expandRecursive(node, true);
		});
	}

	/**
	 * ノードを全縮小します.
	 */
	public collapseAll(): void {
		this.info.data.forEach( (node: any) => {
			this.expandRecursive(node, false);
		});
	}

	private expandRecursive(node: TreeNode, isExpand: boolean) {
		node.expanded = isExpand;
		if (node.children) {
			node.children.forEach( childNode => {
				this.expandRecursive(childNode, isExpand);
			});
		}
	}

	/**
	 * スクロール位置を設定します.
	 * @param targetNode ツリーノード
	 */
	public ensureIndexVisible(targetNode: EIMTreeNode): void {

		let info: any = {
			count: 0,
			targetIndex: -1,
			targetNode: targetNode
		};

		let countFunc: (node: EIMTreeNode, info: any) => void = (node: EIMTreeNode, _info: any): void => {
			_info.count++;

			if (this.info.equals(node, _info.targetNode)) {
				_info.targetIndex = _info.count;
			}

			if ( node.children && node.children.length > 0 && node.expanded) {
				for (let i = 0; i < node.children.length; i++) {
					countFunc(node.children[i], _info);
				}
			}
		}

		for (let i = 0; i < this.info.data.length; i++) {
			let workspaceTreeNode: EIMTreeNode = this.info.data[i];
			countFunc(workspaceTreeNode, info);
		}

		// スクロール位置を設定する
		window.setTimeout(() => {
			let element = this.getScrollTargetElement();

			// 選択行のインデックス番号/全体件数で割合を求める
			let ratio: number = Math.max((info.targetIndex - 1) / info.count, 0);
			// ツリー表示領域の高さ*割合でスクロール位置を求める
			let scrollPos: number = element.scrollHeight * ratio;

			element.scrollTop = scrollPos;
		});
	}

	/**
	 * ツリーの状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			return;
		}

		// 復元します
		this.setData(state.data);
		if (state.selectedData && state.selectedData.length > 0) {
			this.select(state.selectedData, false);
		} else {
			this.select([], false);
		}

		window.setTimeout(() => {
			this.setScrollTop(state.offsetTop);
		});

	}

	/**
	 * ツリーの状態を返却します.
	 * @return 状態
	 */
	public getState(): any {

		// JSON化する際、循環参照してしまうのでツリーの情報は除去
		const selectedData = Object.assign([], this.getSelectedData());
		for (let i = 0; i < selectedData.length; i++) {
			if (selectedData[i]?.parentTreeNode ?? null) {
				selectedData[i].parentTreeNode = null;
			}

			if (selectedData[i]?.childTreeNodes ?? null) {
				selectedData[i].childTreeNodes = null;
			}

			if (selectedData[i]?.parent ?? null) {
				selectedData[i].parent = null;
			}

			if (selectedData[i]?.children ?? null) {
				selectedData[i].children = null;
			}

			if (selectedData[i]?.data?.children ?? null) {
				selectedData[i].data.children = null;
			}
		}

		return {
			data: this.getData(),
			selectedData: selectedData,
			offsetTop: this.getScrollTop()
		}
	}

	/**
	 * ツリーのスクロール位置を設定します.
	 */
	public getScrollTop(): number {
		let element = this.getScrollTargetElement();
		if (!element) {
			return 0;
		}
		return element.scrollTop;
	}

	/**
	 * ツリーのスクロール位置を設定します.
	 * @param scrollTop スクロール位置
	 */
	public setScrollTop(scrollTop: number) {
		let element = this.getScrollTargetElement();
		if (element) {
			element.scrollTop = scrollTop;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値を初期化後の処理です.
	 */
	public ngOnInit(): void {
		this.initialize();
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (this.contextMenuItems) {
			this.menuInfo = this.menuChangeDetectionService.createDifferInfo(this.contextMenuItems);
		}
	}

	/**
	 * 変更検知後イベントハンドラ.
	 */
	 ngDoCheck(): void {
		if (!this.menuInfo) {
			return;
		}

		// メニューの変更アリなら再描画
		if (this.menuChangeDetectionService.isChanged(this.menuInfo, this.contextMenuItems)) {
			this.contextMenuItems = this.contextMenuItems.filter(item => item);
		}
	}

	/**
	 * ノード選択時の処理です.
	 */
	public onSelect(node: EIMTreeNode | TreeNode, event?: MouseEvent): void {
		
		// シフト押下時、IEのみ不正な選択範囲が生じるので解除処理を行う
		if (event.shiftKey) {
			let selections: Selection = window.getSelection();
			selections.removeAllRanges();
		}

		// イベント発生日時
		let eventDateTime: Date = new Date();

		if (this.enableOpenOnSelect) {
			if (!node.expanded && node.children.length > 0) {
				node.expanded = true;
			} /* else if (node.expanded) {
				node.expanded = false;
			}*/

		}

		if (this.componentService.canSelect(node)) {
			let _node = node;
			if (this.treeTreeNodeMap) {
				_node = this.treeTreeNodeMap.get((_node as TreeNode).key);
			}
			this.selected.emit({selectedData: [_node], eventDateTime: eventDateTime});
		} else {
			// 参照を切らずに配列をクリアする
			this.info.selectedData.splice(0, this.info.selectedData.length);
			this.selected.emit({selectedData: [], eventDateTime: eventDateTime});
		}
	}

	/**
	 * ノード選択解除時の処理です.
	 * @param node ノード
	 * @param event イベント
	 */
	public onUnselect(node: EIMTreeNode, event?: MouseEvent): void {
		if (node.type === "RANGE_DATE"){
			// シフト押下時、IEのみ不正な選択範囲が生じるので解除処理を行う
			if (event.shiftKey) {
				let selections: Selection = window.getSelection();
				selections.removeAllRanges();
			}

			// イベント発生日時
			let eventDateTime: Date = new Date();

			if (this.enableOpenOnSelect) {
				if (!node.expanded && node.children.length > 0) {
					node.expanded = true;
				} /* else if (node.expanded) {
					node.expanded = false;
				}*/

			}

			if (this.componentService.canSelect(node)) {
				this.selected.emit({selectedData: [node], eventDateTime: eventDateTime});
			} else {
				// 参照を切らずに配列をクリアする
				this.info.selectedData.splice(0, this.info.selectedData.length);
				this.selected.emit({selectedData: [], eventDateTime: eventDateTime});
			}
		} else {
			event.preventDefault();

			window.setTimeout(() => {
				// 参照を切らずに配列をクリアする
				this.info.selectedData.splice(0, this.info.selectedData.length);
				this.info.selectedData.push(node);
				// primengNG18以降、シングル選択モード時、選択済みのnodeをクリックすると非選択になる仕様となった
				// EIMでは、選択状態を維持、さらに、選択イベントを発行し、選択イベントに紐づく処理が行われるようにする.
				const isEmitEvent = this.multiple ? false : true;
				this.select([node], isEmitEvent);
			});
		}


	}

	/**
	 * ノード展開時の処理です.
	 */
	public onExpand(node: EIMTreeNode): void {
		if (this.treeTreeNodeMap) {
			const _node = this.treeTreeNodeMap.get((node as TreeNode).key);
			this.expanded.emit({expandedData: _node, eventDateTime: new Date()});
		} else {
			this.expanded.emit([node]);

		}
	}

	/**
	 * 右クリックイベントハンドラ.
	 * @param event マウスイベント
	 */
	public onContextMenu(event: MouseEvent): void {
		if (this.contextMenuItems && this.contextMenuItems.length > 0) {
			event.preventDefault();
			event.stopPropagation();
			this.contextmenu.emit([]);
		}
	}

	/**
	 * ノードのマウスエンター時イベントハンドラ.
	 * @param node ノード
	 */
	public onMouseEnter(node) {
		
		const treeNode = this.getTreeNodeByTreeNodeId(node.key);
		if (this.visibleMouseOverMenuFunction && !this.visibleMouseOverMenuFunction(treeNode)) {

			return;
		}
		this.mouseEnterNode = node;
	}
	
	/**
	 * ノードのマウスリーブ時イベントハンドラ.
	 */
	public onMouseLeave() {
		this.mouseEnterNode = null;
	}
	 
	/**
	 * ノードのメニューアイコンのマウスエンター時イベントハンドラ.
	 * @param node ノード
	 */
	public onMouseEnterIcon() {
		this.mouseEnterNodeIcon = true;
	}
	
	/**
	 * ノードのメニューアイコンのマウスリーブ時イベントハンドラ.
	 */
	public onMouseLeaveIcon() {
		this.mouseEnterNodeIcon = false;
	}

	/**
	 * メニューアイコンクリック時イベントハンドラ.
	 * @param event マウスイベント
	 */
	public onClickShowMenu(event, contextMenu: any) {
		event.preventDefault();
    	event.stopPropagation();

		// アイコン押下時にノードのクリックイベントを実行させる
		this.onSelect(this.mouseEnterNode, event);
		this.info.selectedData[0] = this.mouseEnterNode;

		this.contextmenu.emit([]);	// 右クリック時と同じ挙動としたいため
		contextMenu.show(event);
 	 }

	/**
	 * ノード右クリック選択時の処理です.
	 * ノードを右クリックした場合、onNodeContextMenuSelect()⇒onContextMenu()の順で呼び出される.
	 * 何もない箇所をクリックした場合、onContextMenu()が呼び出される.
	 */
	public onNodeContextMenuSelect(event: any): void {
		// 本イベントハンドラの後、右クリックイベントハンドラが呼び出されるのでキャンセルする
		event.originalEvent.preventDefault();
		event.originalEvent.stopPropagation();

		let node: EIMTreeNode = event.node;
		this.selected.emit({selectedData: [node], eventDateTime: new Date()});
		this.contextmenu.emit([node]);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * スクロールターゲットのエレメントを返却します.
	 * @return スクロールターゲットのエレメント
	 */
	protected getScrollTargetElement(): any {
		return this.el.nativeElement.children[0].children[0].children[0].children[0].children[0];
	}

	/**
	 * EIMTreeTreeNodeをPrimeNGのTreeNodeに変換します.
	 * 
	 * @param treeNodes EIMTreeTreeNodeのリスト
	 * @returns 返還後のPrimeNGのTreeNodeのリスト
	 */
	protected convertToPrimeNGTreeNodes(treeNodes: EIMTreeTreeNode[]): TreeNode[] {

		if (!treeNodes) {
			return null;
		}

		let retTreeNodes: TreeNode[] = [];
		for (let i = 0; i < treeNodes.length; i++) {

			const treeNode = treeNodes[i];

			// dataは設定しません
			// EIMTreeTreeNodeから取得してください。
			let retParentTreeNode: TreeNode = {
				key: treeNode.treeNodeId,
				label: treeNode.label,
				expandedIcon: treeNode.expandedIcon,
				collapsedIcon: treeNode.collapsedIcon,
				leaf: treeNode.leaf,
				expanded: treeNode.expanded,
				type: treeNode.type,
				selectable: treeNode.selectable,
			};

			const childTreeNodes = this.convertToPrimeNGTreeNodes(treeNode.childTreeNodes);
			if (childTreeNodes) {
				for (let j = 0; j < childTreeNodes.length; j++) {
					const childTreeNode = childTreeNodes[j];
					childTreeNode.parent = retParentTreeNode;
				}
			}
			retParentTreeNode.children = childTreeNodes;

			retTreeNodes.push(retParentTreeNode);
		}

		return retTreeNodes;
	}

	/**
	 * ツリーコンポーネント用ツリーノードのマップを初期化します.
	 */
	protected initializeTreeTreeNodeMap(): void {

		const flatTreeTreeNodes: EIMTreeTreeNode[] = this.treeNodeService.getTreeNodes(this.treeTreeNodes) as EIMTreeTreeNode[];

		this.treeTreeNodeMap = new Map();
		for (let i = 0; i < flatTreeTreeNodes.length; i++) {
			this.treeTreeNodeMap.set(flatTreeTreeNodes[i].treeNodeId, flatTreeTreeNodes[i]);
		}

		const flatTreeNodes: TreeNode[] = this.hierarchicalDomainService.getList(this.info.data);
		this.treeNodeMap = new Map();
		for (let i = 0; i < flatTreeNodes.length; i++) {
			this.treeNodeMap.set(flatTreeNodes[i].key, flatTreeNodes[i]);
		}
	}

	/**
	 * EIMTreeTreeNodeをコピーします.parentTreeNode,childTreeNodesはコピーしません.
	 * 
	 * @param toTreeTreeNode コピー先のEIMTreeTreeNode
	 * @param fromTreeTreeNode コピー元のEIMTreeTreeNode
	 * @returns コピー後のEIMTreeTreeNode
	 */
	protected copyTreeTreeNode(toTreeTreeNode: EIMTreeTreeNode, fromTreeTreeNode: EIMTreeTreeNode): EIMTreeTreeNode {

		toTreeTreeNode.dto = fromTreeTreeNode.dto;
		toTreeTreeNode.leaf = fromTreeTreeNode.leaf;
		toTreeTreeNode.expanded = fromTreeTreeNode.expanded;
		toTreeTreeNode.label = fromTreeTreeNode.label;
		toTreeTreeNode.expandedIcon = fromTreeTreeNode.expandedIcon;
		toTreeTreeNode.collapsedIcon = fromTreeTreeNode.collapsedIcon;
		toTreeTreeNode.type = fromTreeTreeNode.type;
		toTreeTreeNode.styleClass = fromTreeTreeNode.styleClass;
		toTreeTreeNode.selectable = fromTreeTreeNode.selectable;
		toTreeTreeNode.options = fromTreeTreeNode.options;

		return toTreeTreeNode;
	}

	/**
	 * TreeNodeをコピーします.parent,childrenはコピーしません.
	 * 
	 * @param toTreeNode コピー先のTreeNode
	 * @param fromTreeNode コピー元のTreeNode
	 * @returns コピー後のTreeNode
	 */
	protected copyTreeNode(toTreeNode: TreeNode, fromTreeNode: TreeNode): TreeNode {

		toTreeNode.label = fromTreeNode.label;
		toTreeNode.expandedIcon = fromTreeNode.expandedIcon;
		toTreeNode.collapsedIcon = fromTreeNode.collapsedIcon;
		toTreeNode.leaf = fromTreeNode.leaf;
		toTreeNode.expanded = fromTreeNode.expanded;
		toTreeNode.type = fromTreeNode.type;
		toTreeNode.styleClass = fromTreeNode.styleClass;
		toTreeNode.selectable = fromTreeNode.selectable;

		return toTreeNode;
	}

	/**
	 * ツリーノードの位置までスクロールします.
	 * 
	 * @param treeNode スクロール対象のツリーノード
	 */
	protected scrollToTreeNode(treeNode: EIMTreeTreeNode): void {

		// スクロール位置の調整
		const displayTreeNodes: EIMTreeTreeNode[] = this.treeNodeService.getDisplayTreeNodes(this.treeTreeNodes) as EIMTreeTreeNode[];
		let index = 0;
		for (; index < displayTreeNodes.length; index++) {

			if (displayTreeNodes[index].treeNodeId === treeNode.treeNodeId) {
				break;
			}
		}

		if (index !== displayTreeNodes.length) {

			// ツリーノード追加時、画面に追加される前にスクロール位置を計算してしまうため
			// スクロールタイミングをずらす
			window.setTimeout(() => {

				// スクロール対象のエレメント（ツリーのボディ）
				const element = this.getScrollTargetElement();

				// 選択行のインデックス番号/全体件数で割合を求める
				let ratio: number = 0;
				if (displayTreeNodes.length > 0) {
					ratio = index / (displayTreeNodes.length - 1);
				}
				// ツリー表示領域の高さ*割合でスクロール位置を求める
				const scrollPos: number = element.scrollHeight * ratio;
		
				// スクロール位置を設定する
				element.scrollTop = scrollPos;

			});
		}

	}

}
