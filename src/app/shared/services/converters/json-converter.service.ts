/**
 * コンバータのインタフェース
 */
export interface EIMJsonConverterService<F, T> {

	/**
	 * オブジェクトを変換します.
	 * @param object オブジェクト
	 * @param comparators コンパレータリスト
	 * @returns 変換後の情報
	 */
	convert(object: F, comparators?: ((valueA: any, valueB: any) => number)[]): T;
}
