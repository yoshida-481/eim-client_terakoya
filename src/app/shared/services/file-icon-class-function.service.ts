import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMSimpleObjectDTO } from '../dtos/simple-object.dto';
import { EIMIconClassFunctionService } from './icon-class-function.service';
import { EIMServerConfigService } from './server-config.service';

/**
 * ファイルアイコンクラス返却関数提供サービスクラス
 */
@Injectable()
export class EIMFileIconClassFunctionService implements EIMIconClassFunctionService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected serverConfigService: EIMServerConfigService
	) {}

	/**
	 * 簡易オブジェクトDTOからファイルアイコンクラスを返却します.
	 * @param dto DTO
	 * @returns ファイルアイコンクラス
	 */
	public iconClassFunction(dto: EIMSimpleObjectDTO): string {

		if (dto === null || dto === undefined) {
			return '';
		}
		
		let fileName: string = dto.name;
		let ext: string = fileName.substring(fileName.lastIndexOf('.'));

		if (this.serverConfigService.isExcelExt(ext)) {
			return 'eim-icon-excel';
		}
		if (this.serverConfigService.isWordExt(ext)) {
			return 'eim-icon-word';
		}
		if (this.serverConfigService.isPowerPointExt(ext)) {
			return 'eim-icon-powerpoint';
		}
		if (this.serverConfigService.isPDFExt(ext)) {
			return 'eim-icon-pdf';
		}
		if (this.serverConfigService.isCSVExt(ext)) {
			return 'eim-icon-csv';
		}
		if (this.serverConfigService.isTIFFExt(ext)) {
			return 'eim-icon-tiff';
		}
		if (this.serverConfigService.isCadDxfExt(ext)) {
			return 'eim-icon-cad-dxf';
		}
		if (this.serverConfigService.isCadDwgExt(ext)) {
			return 'eim-icon-cad-dwg';
		}

		return 'eim-icon-file eim-icon-file-color';
	}
}
