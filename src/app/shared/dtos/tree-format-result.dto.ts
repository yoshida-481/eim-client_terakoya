import { EIMTreeNodeDTO } from "./tree-node.dto";

/**
 * ツリー形式の簡易結果DTO
 */
export class EIMTreeFormatResultDTO {

	/** ツリーノードリスト */
	public treeNodes: EIMTreeNodeDTO[] = null;

	/** 件数 */
	public count: number = -1;

	/** 付加情報 */
	public info: any = null;
}
