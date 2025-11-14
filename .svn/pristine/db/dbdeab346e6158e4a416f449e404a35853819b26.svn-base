import { Injectable } from "@angular/core";
import { EIMJsonConverterService } from "./json-converter.service";
import { EIMComparatorService } from "../comparator.service";
import { EIMListFormatResultDTO } from "app/shared/dtos/list-format-result.dto";
import { EIMSimpleObjectDTO } from "app/shared/dtos/simple-object.dto";

/**
 * JSONからEIMListFormatResultDTOに変換するサービス
 */
@Injectable()
export class EIMJsonToListFormatResultDTOConverterService implements EIMJsonConverterService<any, EIMListFormatResultDTO> {
	
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
	public convert(json: any, comparators?: ((valueA: any, valueB: any) => number)[]): EIMListFormatResultDTO {

		if (!json) {
			return null;
		}

		// コンパレータ取得
		const comparator = comparators ? this.comparatorService.covertToComparator(comparators): null;

		// ツリーノード情報取得
		let dtos: EIMSimpleObjectDTO[] = [];
		for (let i = 0; i < json.dtos.length; i++) {
			dtos.push(json.dtos[i]);
		}
		if (comparator) {
			dtos = dtos.sort(comparator);
		}

		let listFormatResultDTO: EIMListFormatResultDTO = new EIMListFormatResultDTO();
		listFormatResultDTO.count = json.count;
		listFormatResultDTO.dtos = dtos;
		listFormatResultDTO.info = json.info;

		return listFormatResultDTO;
	}

}
