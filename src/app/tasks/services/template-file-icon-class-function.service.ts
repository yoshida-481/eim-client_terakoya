import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMIconClassFunctionService } from 'app/shared/services/icon-class-function.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * 雛型ファイルアイコンクラス返却関数提供サービスクラス
 * object.latestがfalseの場合は"_old"アイコンを採用します。
 */
@Injectable()
export class EIMTemplateFileIconClassFunctionService implements EIMIconClassFunctionService {

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
			if (dto.latest) {
				return 'eim-icon-excel';
			} else {
				return 'eim-icon-old-excel';
			}
		}
		if (this.serverConfigService.isWordExt(ext)) {
			if (dto.latest) {
				return 'eim-icon-word';
			} else {
				return 'eim-icon-old-word';
			}		
		}
		if (this.serverConfigService.isPowerPointExt(ext)) {
			if (dto.latest) {
				return 'eim-icon-powerpoint';
			} else {
				return 'eim-icon-old-powerpoint';
			}
		}
		if (this.serverConfigService.isPDFExt(ext)) {
			if (dto.latest) {
				return 'eim-icon-pdf';
			} else {
				return 'eim-icon-old-pdf';
			}
		}
		if (this.serverConfigService.isCSVExt(ext)) {
			if (dto.latest) {
				return 'eim-icon-csv';
			} else {
				return 'eim-icon-old-csv';
			}
		}
		if (this.serverConfigService.isTIFFExt(ext)) {
			if (dto.latest) {
				return 'eim-icon-tiff';
			} else {
				return 'eim-icon-old-tiff';
			}
		}
		if (this.serverConfigService.isCadDxfExt(ext)) {
			if (dto.latest) {
				return 'eim-icon-cad-dxf';
			} else {
				return 'eim-icon-old-cad-dxf';
			}
		}
		if (this.serverConfigService.isCadDwgExt(ext)) {
			if (dto.latest) {
				return 'eim-icon-cad-dwg';
			} else {
				return 'eim-icon-old-cad-dwg';
			}
		}

		if (dto.latest) {
			return 'eim-icon-file eim-icon-file-color';
		} else {
			return 'eim-icon-old-file eim-icon-file-color';
		}

	}
}
