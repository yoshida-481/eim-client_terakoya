import { Injectable, Output } from '@angular/core';

/**
 * 数値、実数サービス
 */
@Injectable()
export class EIMNumberService {

	constructor(
	) {
	}

	/**
	 * 数値をソートして返却します。
	 * @return ソート結果
	 */
	public numberComparator(number1: any, number2: any) {

		if ( !number1 && !number2 ) {
		  return 0;
		}
		if ( !number1) {
		  return -1;
		}
		if ( !number2) {
		  return 1;
		}

		// 複数値の場合(123|456|789 → 123へ変換しソート)
		if (number1.indexOf('|') !== -1 && number2.indexOf('|') !== -1) {
			const count = number1.split('|').length > number2.split('|').length ? number1.split('|').length : number2.split('|').length;
			for (let i = 0 ; i < count ; i++) {
				let number11 = number1.substring(0, number1.indexOf('|'));
				let number22 = number2.substring(0, number2.indexOf('|'));
				if (i === count - 1) {
					number11 = number1;
					number22 = number2;
				}
				if (Number(number11) === Number(number22)) {
					// 次の値で比較
					number1 = number1.substring(number1.indexOf('|') + 1);
					number2 = number2.substring(number2.indexOf('|') + 1);
				} else {
					return Number(number11) < Number(number22) ? -1 : 1;
				}
			}
		} else if (number1.indexOf('|') !== -1 ) {
			number1 = number1.substring(0, number1.indexOf('|'));
			if (Number(number1) !== Number(number2)) {
				return Number(number1) < Number(number2) ? -1 : 1;
			} else {
				return 1;
			}
		} else if (number2.indexOf('|') !== -1) {
			number2 = number2.substring(0, number2.indexOf('|'));
			if (Number(number1) !== Number(number2)) {
				return Number(number1) < Number(number2) ? -1 : 1;
			} else {
				return -1;
			}
		// 単数値の場合
		} else {
			return Number(number1) < Number(number2) ? -1 : 1;
		}
	}

}
