import { Injectable } from '@angular/core';

import { EIMBaseTreeNode, EIMComponentTreeNode } from 'app/shared/shared.interface';
import { EIMSimpleObjectDTO } from '../dtos/simple-object.dto';
import { EIMTreeNode } from '../components/tree/tree.component.service';

/**
 * ツリーノードサービス
 */
@Injectable()
export class EIMTreeNodeService {

	/**
	 * コンストラクタです.
	 */
	constructor() {
	}

	/**
	 * ルートのツリーノードを返却します.
	 * 
	 * @param treeNode 起点となるツリーノード
	 * @returns ルートのツリーノード
	 */
	public getRootTreeNode(treeNode: EIMComponentTreeNode): EIMComponentTreeNode {
		
		if (treeNode.parentTreeNode === null) {
			return treeNode;
		}

		return this.getRootTreeNode(treeNode.parentTreeNode);
	}

	/**
	 * ツリーノードIDからオブジェクトIDに変換します.
	 * @param treeNodeId ツリーノードID
	 * @returns オブジェクトID
	 */
	public convertTreeNodeIdToObjectId(treeNodeId: string): number {
		return Number(treeNodeId);
	}

	/**
	 * オブジェクト情報からツリーノードIDに変換します.
	 * 
	 * @param object オブジェクト情報
	 * @returns ツリーノードID
	 */
	public convertObjectDTOToTreeNodeId(object: EIMSimpleObjectDTO): string {

		return object.id.toString();
	}

	/**
	 * 階層をフラット化して返却します.
	 */
	public getTreeNodes(treeNodes: EIMBaseTreeNode[]): EIMBaseTreeNode[] {

		if (!treeNodes) {
			return;
		}
		
		let retTreeNodes: EIMBaseTreeNode[] = [];

		for (let i = 0; i < treeNodes.length; i++) {
			
			// DTOをリストに追加
			const treeNode: EIMBaseTreeNode = treeNodes[i];
			retTreeNodes.push(treeNode);

			// 子階層のDTOをリストに追加
			let children: EIMBaseTreeNode[] = this.getTreeNodes(treeNode.childTreeNodes);
			Array.prototype.push.apply(retTreeNodes, children);
		}

		return retTreeNodes;
	}

	/**
	 * 階層をフラット化し、DTOの配列にして返却します.
	 */
	public getDtos(treeNodes: EIMBaseTreeNode[]): any[] {

		if (!treeNodes) {
			return;
		}

		let retDtos: any[] = [];

		const flatTreeNodes = this.getTreeNodes(treeNodes);
		for (let i = 0; i < flatTreeNodes.length; i++) {
			
			// DTOをリストに追加
			const treeNode: EIMBaseTreeNode = flatTreeNodes[i];
			retDtos.push(flatTreeNodes[i].dto);
		}

		return retDtos;
	}

	/**
	 * ツリーノードを子孫を含めて更新します.
	 * 
	 * @param treeNodes ツリーノードリスト
	 * @param updateFunction ツリーノード更新関数
	 * @param maxLevel 更新する最大階層数(1,2,3,...)、未指定あるいは-1の場合はルートと子孫全階層が更新対象
	 */
	public updateTreeNodes(treeNodes: EIMBaseTreeNode[], updateFunction: (treeNode: EIMBaseTreeNode, level: number) => void, maxLevel = -1): void {

		if (!treeNodes || treeNodes.length === 0) {
			return;
		}

		this.updateTreeNodesSub(treeNodes, updateFunction, maxLevel, 1);
	}

	/**
	 * ツリーノードリストから指定したツリーノードリストを削除します.
	 * 
	 * @param treeNodes 削除元のツリーノードリスト
	 * @param reeNodesForRemove 削除するツリーノードリスト
	 * @returns 削除後のツリーノードリスト
	 */
	public removeTreeNodes(treeNodes: EIMComponentTreeNode[], treeNodesForRemove: EIMComponentTreeNode[]): EIMComponentTreeNode[] {

		let retTreeNodes: EIMComponentTreeNode[] = [];

		// 削除対象のツリーノードIDセット生成
		let removeTreeNodeIdSet = new Set<string>();
		for (let i = 0; i < treeNodesForRemove.length; i++) {
			removeTreeNodeIdSet.add(treeNodesForRemove[i].treeNodeId);
		}

		// ルート階層のツリーノードをチェック
		for (let i = 0; i < treeNodes.length; i++) {

			if (removeTreeNodeIdSet.has(treeNodes[i].treeNodeId)) {
				continue;
			}

			retTreeNodes.push(treeNodes[i]);
			if (treeNodes[i].childTreeNodes) {
				treeNodes[i].childTreeNodes = this.removeChildTreeNodes(treeNodes[i], removeTreeNodeIdSet);
			}

		}

		return retTreeNodes;
	}


	/**
	 * 表示対象のツリーノードを上から順にリスト形式で返却します.
	 *
	 * @param treeNodes ルートのツリーノードリスト（未指定の場合は当データグリッドが保持しているルートのツリーノードを使用する）
	 * @returns 表示対象のツリーノードリスト
	 */
	public getDisplayTreeNodes(treeNodes: EIMComponentTreeNode[]): EIMComponentTreeNode[] {
	
		return this.getDisplayTreeNodesSub(treeNodes, []);
	}

	/**
	 * ルートのツリーノードから指定したツリーノードまでの各階層のツリーノードIDを配列にして返却します.
	 * 
	 * @param treeNode ツリーノード
	 * @return ツリーノードパスの配列（[ルートのツリーノードID,..., 指定したツリーノードID]）
	 */
	public getTreeNodeIdPath(treeNode: EIMComponentTreeNode): string[] {

		// ルートの場合
		if (treeNode.parentTreeNode === null) {
			return [treeNode.treeNodeId];
		}

		const treeNodeIdPath = this.getTreeNodeIdPath(treeNode.parentTreeNode as EIMComponentTreeNode);
		treeNodeIdPath.push(treeNode.treeNodeId);

		return treeNodeIdPath;
	}

	/**
	 * 親ツリーノードの子ツリーノードリストから指定したツリーノードIDのツリーノードを削除します.
	 * 
	 * @param parentTreeNode 親ツリーノード
	 * @param removeTreeNodeIdSet 削除対象のツリーノードIDセット
	 * @returns 削除後のツリーノードリスト
	 */
	private removeChildTreeNodes(parentTreeNode: EIMComponentTreeNode, removeTreeNodeIdSet: Set<string>): EIMComponentTreeNode[] {

		let retChildTreeNodes: EIMComponentTreeNode[] = [];

		const childTreeNodes: EIMComponentTreeNode[] = parentTreeNode.childTreeNodes;
		for (let i = 0; i < childTreeNodes.length; i++) {

			// 削除対象なら何もしない
			if (removeTreeNodeIdSet.has(childTreeNodes[i].treeNodeId)) {
				continue;
			}

			retChildTreeNodes.push(childTreeNodes[i]);
			if (childTreeNodes[i].childTreeNodes) {
				childTreeNodes[i].childTreeNodes = this.removeChildTreeNodes(childTreeNodes[i], removeTreeNodeIdSet);
			}
		}
		return retChildTreeNodes;
	}

	/**
	 * 画面表示中のツリーノードリストを返却します.
	 * @param treeNodes ツリーノードリスト
	 * @param retTreeNodes 返却ツリーノードリスト保持用
	 * @returns 返却ツリーノードリスト
	 */
	private getDisplayTreeNodesSub(treeNodes: EIMComponentTreeNode[], retTreeNodes: EIMComponentTreeNode[]): EIMComponentTreeNode[] {

		if (treeNodes === null) {
			return null;
		}

		for (let i = 0; i < treeNodes.length; i++) {

			const treeNode = treeNodes[i];
			retTreeNodes.push(treeNode);

			// 子階層追加
			if (typeof treeNode?.childTreeNodes === 'undefined' || treeNode?.childTreeNodes === null || treeNode.childTreeNodes?.length === 0) {
				continue;
			}
			if (treeNode.expanded === false) {
				continue;
			}
			this.getDisplayTreeNodesSub(treeNode.childTreeNodes, retTreeNodes);
		}

		return retTreeNodes;
	}

	/**
	 * ツリーノードを子孫を含めて更新します.
	 * 
	 * @param treeNodes ツリーノードリスト
	 * @param updateFunction ツリーノード更新関数
	 * @param maxLevel 更新する最大階層数(1,2,...)、未指定あるいは-1の場合はルートと子孫全階層が更新対象
	 * @param level 現在の階層
	 */
	private updateTreeNodesSub(treeNodes: EIMBaseTreeNode[], updateFunction: (treeNode: EIMBaseTreeNode, level: number) => void, maxLevel: number, level: number): void {
	
		if (maxLevel !== -1 && maxLevel < level) {
			return;
		}

		for (let i = 0; i < treeNodes.length; i++) {

			// 更新処理実施
			updateFunction(treeNodes[i], level);

			if (!treeNodes[i].childTreeNodes || (treeNodes[i].childTreeNodes?.length ?? 0) === 0) {
				continue;
			}

			this.updateTreeNodesSub(treeNodes[i].childTreeNodes, updateFunction, maxLevel, level + 1);
		}
	}
}
