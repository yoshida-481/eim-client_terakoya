import { EIMBaseTreeNode } from "../shared.interface";

/**
 * ツリーノード形式の簡易結果DTO
 */
export class EIMTreeNodeDTO implements EIMBaseTreeNode {

	/** dto */
	public dto: any = null;

	/** 件数 */
	public childCount: number = -1;

	/** 子階層のツリーノードリスト */
	public childTreeNodes: EIMTreeNodeDTO[] = null;
}
