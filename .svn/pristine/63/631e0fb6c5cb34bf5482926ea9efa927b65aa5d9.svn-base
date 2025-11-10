import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMBoxFileService } from 'app/shared/services/apis/box-file.service';
import { EIMBoxObjectDomain } from 'app/shared/domains/box-object.domain';
import { EIMBoxFolderDomain } from 'app/shared/domains/box-folder.domain';

/**
 * Box名前レンダラーコンポーネントサービス
 */
@Injectable()
export class EIMBoxNameRendererComponentService {
	/** 名前クリックイベント */
	private clicked = new Subject<EIMBoxObjectDomain>();
	clicked$ = this.clicked.asObservable();

	constructor(
		protected serverConfigService: EIMServerConfigService,
		protected fileService: EIMBoxFileService,
	) { }

	/**
	 * ラベルを取得します.
	 * @param value Boxオブジェクト情報
	 */
	getLabel(value: EIMBoxObjectDomain): string {
		return value.name;
	}

	/**
	 * アイコンクラス名を取得します.
	 * @param value Boxオブジェクト情報
	 */
	getIcon(value: EIMBoxObjectDomain): string {
		const type = value.type;
		if (type === 'folder') {
			if ((value as EIMBoxFolderDomain).hasCollaborations) {
				return 'eim-icon-folder eim-icon-collaboration-folder-color';
			} else {
				return 'eim-icon-folder eim-icon-folder-color';
			}
		}

		const name = value.name;
		if (name) {
			const lastIndex = name.lastIndexOf('.');
			if (lastIndex !== -1) {
				const ext = name.substring(lastIndex);

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
			}
		}

		return 'eim-icon-file eim-icon-file-color';
	}

	/**
	 * 名前クリック時のイベントハンドラです.
	 * @param value Boxオブジェクト情報
	 */
	onClick(object: EIMBoxObjectDomain) {
		// ファイルの場合はダウンロードする
		if (object.type === 'file') {
			this.fileService.download(object.id);
			return;
		}

		this.clicked.next(object);
	}
}
