import { Injectable } from "@angular/core";
import { EIMListFormatResultDTO } from "app/shared/dtos/list-format-result.dto";

/**
 * リスト形式の簡易結果DTOからのコンバータ
 */
@Injectable()
export class EIMListFormatResultDTOToTreeNodesConverterService<T> {

	/**
	 * ツリー形式の簡易結果DTOを変換します.
	 * @param listFormatResult リスト形式の簡易結果DTO
	 * @param convertFunction コンバータ関数
	 * @returns 変換後の情報リスト
	 */
	public convert(listFormatResult: EIMListFormatResultDTO, convertFunction: (dto: any) => T): T[] {

		const dtos: any[] = listFormatResult.dtos;
		if (dtos === null) {
			return null;
		}

		let domains: T[] = [];

		for (let dto of dtos) {
			let domain: T = convertFunction(dto);

			// node.collapsedIcon += ' fa fw fa-lg ';
			// node.expandedIcon += ' fa fw fa-lg ';

			domains.push(domain);
		}

		return domains;
	}

}