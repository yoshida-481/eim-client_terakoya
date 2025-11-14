import { Injectable } from "@angular/core";
import { EIMJsonConverterService } from "./json-converter.service";
import { EIMTreeFormatResultDTO } from "app/shared/dtos/tree-format-result.dto";
import { EIMComparatorService } from "../comparator.service";
import { EIMTreeNodeDTO } from "app/shared/dtos/tree-node.dto";

/**
 * JSONからEIMTreeFormatResultDTOに変換するサービス
 */
@Injectable()
export class EIMJsonToTreeFormatResultDTOConverterService implements EIMJsonConverterService<any, EIMTreeFormatResultDTO> {
	
	/**
	 * コンストラクタです.
	 */
	constructor(
		private comparatorService: EIMComparatorService
	) {
	}

	/**
	 * オブジェクトを変換します.
	 * @param json JSON
	 */
	public convert(json: any, comparators?: ((valueA: EIMTreeNodeDTO, valueB: EIMTreeNodeDTO) => number)[]): EIMTreeFormatResultDTO {

		if (!json) {
			return null;
		}

		// コンパレータ取得
		const comparator = comparators ? this.comparatorService.covertToComparator(comparators): null;

		// ツリーノード情報取得
		let treeNodes: EIMTreeNodeDTO[] = [];
		for (let i = 0; i < json.treeNodes.length; i++) {
			treeNodes.push(this.convertJsonToEIMTreeNodeDTO(json.treeNodes[i], comparator));
		}
		if (comparator) {
			treeNodes = treeNodes.sort(comparator);
		}

		let treeFormatResultDTO: EIMTreeFormatResultDTO = new EIMTreeFormatResultDTO();
		treeFormatResultDTO.treeNodes = treeNodes;
		treeFormatResultDTO.count = json.count;
		treeFormatResultDTO.info = json.info;

		return treeFormatResultDTO;
	}

	/**
	 * JsonからEIMTreeNodeDTOに変換します.
	 * 
	 * @param json JSON
	 * @param comparator コンパレータ
	 * @returns EIMTreeNodeDTO
	 */
	private convertJsonToEIMTreeNodeDTO(json, comparator: (valueA: any, valueB: any) => number): EIMTreeNodeDTO {
	
		let node = new EIMTreeNodeDTO();
		node.dto = json.dto;
		node.childCount = json.childCount;

		let childTreeNodes: EIMTreeNodeDTO[] = null;
		if (json.childTreeNodes === null) {
			return node;
		}

		childTreeNodes = [];
		for (let i = 0; i < json.childTreeNodes.length; i++) {
			childTreeNodes.push(this.convertJsonToEIMTreeNodeDTO(json.childTreeNodes[i], comparator));
		}
		if (comparator) {
			childTreeNodes = childTreeNodes.sort(comparator);
		}
		node.childTreeNodes = childTreeNodes;
	
		return node;
	}
}
