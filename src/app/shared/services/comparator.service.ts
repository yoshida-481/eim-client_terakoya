import { Injectable } from "@angular/core";
import { RowNode } from "ag-grid-community";

/**
 * コンパレータサービス
 */
@Injectable()
export class EIMComparatorService {
	
	/**
	 * 複数コンパレータを単一コンパレータに変換します.
	 * @param comparators コンパレータリスト
	 * @returns 単一コンパレータ
	 */
	public covertToComparator(
		comparators: ((
			valueA: any, valueB: any, 
			nodeA?: RowNode, nodeB?: RowNode, 
			isInverted?: boolean) => number)[]) {

		return (valueA: any, valueB: any, nodeA?: RowNode, nodeB?: RowNode, isInverted?: boolean): number =>  {
			for (let comparator of comparators) {
				let result = comparator(valueA, valueB, nodeA, nodeB, isInverted);
				if (result !== 0) {
					return result;
				}
			}

			return 0;
		}
	}
}
