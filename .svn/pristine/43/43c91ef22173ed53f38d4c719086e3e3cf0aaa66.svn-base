import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMHierarchicalComponentService, EIMListComponentInfo, EIMHierarchicalDomain } from 'app/shared/shared.interface';

// EIMTreeComponentで使用する
// TreeNodeの不足分を追加
export interface EIMTreeNode extends EIMHierarchicalDomain{
	length?: any;
	objId?: number;
	objTypeId?: number;
	objTypeName?: string;
	label?: string;
	data?: any;
	icon?: any;
	expandedIcon?: any;
	collapsedIcon?: any;
	leaf?: boolean;
	expanded?: boolean;
	type?: string;
	partialSelected?: boolean;
	styleClass?: string;
	draggable?: boolean;
	droppable?: boolean;
	selectable?: boolean;
	status?: number;
	targetDocType?: number;
	key?: string; // PTreeでのTreeNodeの一意なキーになるため設定した方が良い
}

/**
 * ツリーコンポーネントサービス.
 */
@Injectable()
export class EIMTreeComponentService implements EIMHierarchicalComponentService<EIMTreeNode> {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected hierarchicalDomainService: EIMHierarchicalDomainService
	) {}

	/**
	 * 初期化します.
	 * @param info 一覧コンポーネント情報
	 * @param serviceParam サービスパラメータ
	 * @param initialized 初期化完了時のエミッタ
	 * @param selected 選択完了時のエミッタ
	 */
	public initialize(info: EIMListComponentInfo<EIMTreeNode>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {
	}

	/**
	 * ノード情報リストを設定します.
	 * @param info 一覧コンポーネント情報
	 * @param data ノード情報リスト
	 */
	public setData(info: EIMListComponentInfo<EIMTreeNode>, data: EIMTreeNode[]): void {
		info.data = data;
	}

	/**
	 * ノードを選択します.
	 * @param info 一覧コンポーネント情報
	 * @param selectData 選択するノード情報リスト
	 * @param selected 選択完了時のエミッタ
	 */
	public select(info: EIMListComponentInfo<EIMTreeNode>, selectData: EIMTreeNode[], selected?: EventEmitter<any>, params?: any): void {

		let pearentExpand = (childData: EIMTreeNode) => {
			if (childData.parent) {
				childData.parent['expanded'] = true;
				if (childData.parent.parent) {
					pearentExpand(childData.parent);
				}
			}
		}

		let data: EIMTreeNode[] = [];
		if (!selectData || selectData.length === 0) {
			info.selectedData = [];
		} else {
			let selectedNode: EIMTreeNode = this.hierarchicalDomainService.get(info.data, selectData[0], info.equals);
			if (selectedNode != null) {
				if (selectedNode.parent) {
					pearentExpand(selectedNode);
				}
				data.push(selectedNode);
			}
			info.selectedData = data;
		}

		if (selected) {
			selected.emit({selectedData: info.selectedData, params: params});
		}
	}

	/**
	 * 子ノードを入れ替えます.
	 * @param info 一覧コンポーネント情報
	 * @param parentNode 親ノード情報
	 * @param childNodes 入れ替える子ノード情報リスト
	 */
	public setChildren(info: EIMListComponentInfo<EIMTreeNode>, parentNode: EIMTreeNode, childNodes: EIMTreeNode[]): void {
		if (!parentNode && !childNodes) {
				return;
		}

		if (!parentNode) {
			info.data = (!info.data) ? [] : info.data;
			info.data = childNodes;
			return;
		}

		if (!childNodes || childNodes.length === 0) {
			parentNode.children = [];
			parentNode.leaf = true;
			return;
		}

		// 退避
		let original: EIMTreeNode[] = parentNode.children;
		parentNode.children = childNodes;

		// 設定前のchildrenの参照を新しいparentに設定する
		for (let i = 0; i < parentNode.children.length; i++) {
			let newChild: EIMTreeNode = parentNode.children[i];
			newChild.parent = parentNode;
			if (!original) {
				continue;
			}
			for (let j = 0; j < original.length; j++) {
				let oldChild: EIMTreeNode = original[j];
				if (info.equals(newChild, oldChild)) {
					newChild.children = oldChild.children;
					newChild.expanded = oldChild.expanded;
					newChild.leaf = oldChild.leaf;
					break;
				}
			}
		}
	}

	/**
	 * ノードを追加します.
	 * @param info 一覧コンポーネント情報
	 * @param parentNode 親ノード情報
	 * @param addNodes 追加する子ノード情報リスト
	 */
	public addNode(info: EIMListComponentInfo<EIMTreeNode>, parentNode: EIMTreeNode, addNodes: EIMTreeNode[]): void {

		// 親ノードに追加する
		for (let i = 0; i < addNodes.length; i++) {
			addNodes[i].parent = parentNode;
			addNodes[i].label = this.getPropertyValueUsedForLabel(addNodes[i].data)
			if (!parentNode.children) {
				parentNode.children = [];
			}
			parentNode.children.push(addNodes[i]);
		}

	}

	/**
	 * ノードを返却します.
	 * @param info 一覧コンポーネント情報
	 * @param data 取得対象のノード情報
	 */
	public getNode(info: EIMListComponentInfo<EIMTreeNode>, data): EIMTreeNode {
		// 該当ノードを特定する
		return this.hierarchicalDomainService.get(info.data, data, info.equals);
	}

	/**
	 * ノードを削除します.
	 * @param info 一覧コンポーネント情報
	 * @param data 削除対象のノード情報リスト
	 */
	public deleteNode(info: EIMListComponentInfo<EIMTreeNode>, data: any[]): void {

		for (let i = 0; i < data.length; i++) {
			// 該当ノードを特定する
			let targetNode: EIMTreeNode = this.hierarchicalDomainService.get(info.data, data[i], info.equals);
			if (!targetNode || !targetNode.parent) {
				continue;
			}
			// 該当ノードの親ノードを特定する
			let parentNode: EIMTreeNode = this.hierarchicalDomainService.get(info.data, (targetNode.parent as EIMTreeNode).data, info.equals);
			if (!parentNode) {
				continue;
			}
			// 親ノードから該当ノードを削除する
			let deleteIndex = -1;
			for (let j = 0; j < parentNode.children.length; j++) {
				let node: EIMTreeNode = (parentNode.children[j] as EIMTreeNode);
				if (info.equals(node.data, targetNode.data)) {
					deleteIndex = j;
					break;
				}
			}
			if (deleteIndex > -1) {
				parentNode.children.splice(deleteIndex, 1);
			}
		}

	}

	/**
	 * ノードを更新します.
	 * @param info 一覧コンポーネント情報
	 * @param data 更新対象情報
	 */
	public updateNode(info: EIMListComponentInfo<EIMTreeNode>, data: any): void {
		let nodes = this.hierarchicalDomainService.getList(info.data);
		let newLabel = this.getPropertyValueUsedForLabel(data);
		// 該当ノードを特定(オブジェクトIDが同一のノードを全て処理する)
		for (let i = 0; i < nodes.length; i++) {
			if (info.equals(nodes[i], data)) {
				nodes[i]['label'] = newLabel;
			}
		}
	}

	/**
	 * デフォルトのノード情報比較メソッドです.<br>
	 * 2つのノード情報のIDが等しければ同一と判定します.
	 * @param arg1 ノード情報１
	 * @param arg2 ノード情報２
	 * @returns 2つのノードが等しければtrue
	 */
	public defaultEquals(arg1: any, arg2: any): boolean {
		if (arg1.key && arg2.key) {
			return arg1.key === arg2.key;
		}
		return arg1.data.id == arg2.data.id;
	};

	/**
	 * ノードが選択できるかどうか返却します.
	 * @param node 判定対象のノード
	 * @return ノードが選択できるかどうか
	 */
	public canSelect(node: EIMTreeNode): boolean {
		return true;
	}

	/**
	 * ラベルに使用する値を取得します.
	 * @param data ノード情報
	 */
	protected getPropertyValueUsedForLabel(data: any): string {
		return data.objName;
	}
}
