/**
 * アイコンクラス返却関数提供サービスクラス
 */
export interface EIMIconClassFunctionService {

	/**
	 * DTOからアイコンクラスを返却します.
	 * @param dto DTO
	 * @returns アイコンクラス
	 */
	iconClassFunction(dto: any): string;
}