import { Injectable } from "@angular/core";
import { EIMTreeFormatResultDTO } from "app/shared/dtos/tree-format-result.dto";
import { EIMTreeNodeDTO } from "app/shared/dtos/tree-node.dto";

/**
 * ツリー形式の簡易結果DTOからのコンバータ
 */
@Injectable()
export class EIMTreeFormatResultDTOToTreeNodesConverterService<T> {

	/**
	 * ツリー形式の簡易結果DTOを変換します.
	 * @param treeFormatResult ツリー形式の簡易結果DTO
	 * @param convertFunction ツリーノード形式へのコンバータ関数
	 * @param setRelationFunction ツリーノードの親子間の関連設定関数
	 * @returns 変換後の情報リスト
	 */
	public convert(treeFormatResult: EIMTreeFormatResultDTO,
			convertFunction: (dto: any) => T, setRelationFunction: (parentTreeNode: T, childTreeNodes: T[]) => void): T[] {

		const treeNodeDtos: EIMTreeNodeDTO[] = treeFormatResult.treeNodes;
		if (treeNodeDtos === null) {
			return null;
		}

		let treeNodes: T[] = [];

		for (let treeNodeDto of treeNodeDtos) {
			let treeNode: T = convertFunction(treeNodeDto.dto);

			// node.collapsedIcon += ' fa fw fa-lg ';
			// node.expandedIcon += ' fa fw fa-lg ';

			treeNodes.push(treeNode);

			// 子階層を設定
			if (treeNodeDto.childTreeNodes != null) {
				let childTreeNodes: T[] = this.getChildNodes(
					treeNodeDto.childTreeNodes, convertFunction, setRelationFunction);

				setRelationFunction(treeNode, childTreeNodes);
			} else {
				setRelationFunction(treeNode, null);
			}

			// // 末端かどうか判定
			// if (treeNode.leaf === true) {
			// 	if (treeNode.children === null) {
			// 		treeNode.leaf = false;
			// 	}
			// }
		}
		setRelationFunction(null, treeNodes);

		return treeNodes;
	}

	/**
	 * 子階層のツリーノードを返却します.
	 *
	 * @param childTreeNodes 子ノード情報リスト
	 * @param dtoConverter
	 * @returns
	 */
	protected getChildNodes(treeNodes: EIMTreeNodeDTO[],
		convertFunction: (dto: any) => T, setRelationFunction: (parentTreeNode: T, childTreeNodes: T[]) => void): T[] {

		let childNodes: T[] = [];

		for (let treeNodeDto of treeNodes) {
			let treeNode: T = convertFunction(treeNodeDto.dto);
			childNodes.push(treeNode);

			// 子階層を設定
			if (treeNodeDto.childTreeNodes != null) {
				let childTreeNodes: T[] = this.getChildNodes(
						treeNodeDto.childTreeNodes, convertFunction, setRelationFunction);

				setRelationFunction(treeNode, childTreeNodes);
			}
			else {
				setRelationFunction(treeNode, null);
			}

			// // 末端かどうか判定
			// if (node.children === null) {
			// 	node.leaf = false;
			// } else {
			// 	node.leaf = true;
			// }
		}

		return childNodes;
	}


}