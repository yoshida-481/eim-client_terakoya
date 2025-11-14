import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * ファイル名リンクレンダラーコンポーネントサービス
 */
@Injectable()
export class EIMFileNameLinkRendererComponentService {

	constructor(
		protected serverConfigService: EIMServerConfigService,
	) {

	}

	/**
	 * 表示用ラベルを取得する.
	 * @param ラベル名
	 * @return ラベル名
	 */
	public getLabel(value: any): string {
		// let label:string = (value ? value.replace(/ /g, '&nbsp;') : '');
		let label: string = value;
		return label;
	}

	/**
	 * アイコンを取得する.
	 * @param node 行情報
	 * @return アイコンクラス
	 */
	public getIcon(node: any): string {
		if (node.objName) {
			let fileName: string = node.objName;
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
			} else {
				return 'eim-icon-file eim-icon-file-color';
			}
		}
	}
}
