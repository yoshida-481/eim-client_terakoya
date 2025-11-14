import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';

/**
 * 公開ファイル比較結果ファイル名称レンダラーコンポーネントサービス
 */
@Injectable()
export class EIMCompareFileNameRendererComponentService {

	public valueGetter: (params: any) => string;

	constructor(
		protected serverConfigService: EIMServerConfigService,
	) {

	}

	/**
	 * 表示用ラベルを取得する.
	 */
	public getLabel(value: any): string {
		// let label:string = (value ? value.replace(/ /g, '&nbsp;') : '');
		let label: string = value;
		return label;
	}

	/**
	 * アイコンを取得する.
	 * @param node オブジェクト名称
	 * @param isVisibleLink リンク表示するかどうか
	 * @return アイコンクラス
	 */
	public getIcon(node, isVisibleLink = true, isOldRevLink?: boolean): string {

		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE) {
			return 'eim-doc-icon-workspace eim-doc-icon-workspace-color';
		}
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			return 'eim-icon-tag eim-icon-tag-color';
		}
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
			if (node.isWorkflowFolder === 'true' || node.isWorkflowFolder === true || node.isWFFolder === 'true' || node.isWFFolder === true) {
				return 'eim-icon-wf-folder eim-icon-wf-folder-color';
			} else {
				return 'eim-icon-folder eim-icon-folder-color';
			}
		}
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE) {
			return 'fa-fw fa-lg fa-cubes eim-icon-workspace-color';
		}
		// 以降ドキュメントアイコン
		if (isVisibleLink && node.isDocumentLink === 'true') {
			// ドキュメントリンク
			if (Number(node.documentLinkUpdateTiming) === 0) {
				return 'eim-icon-link-manual';
			} else {
				return 'eim-icon-link-auto';
			}
		}
		let fileName: string = node.objName;
		let expiration = node.expiration;
		let ext: string = fileName.substring(fileName.lastIndexOf('.'));
		if (this.serverConfigService.isExcelExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-excel';
			} else {
				return 'eim-icon-excel';
			}
		}
		if (this.serverConfigService.isWordExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-word';
			} else {
				return 'eim-icon-word';
			}
		}
		if (this.serverConfigService.isPowerPointExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-powerpoint';
			} else {
				return 'eim-icon-powerpoint';
			}
		}
		if (this.serverConfigService.isPDFExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-pdf';
			} else {
				return 'eim-icon-pdf';
			}
		}
		if (this.serverConfigService.isCSVExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-csv';
			} else {
				return 'eim-icon-csv';
			}
		}
		if (this.serverConfigService.isTIFFExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-tiff';
			} else {
				return 'eim-icon-tiff';
			}
		}
		if (isOldRevLink === true) {
			return 'eim-icon-old-file eim-icon-file-color';
		} else {
			return 'eim-icon-file eim-icon-file-color';
		}

	}

}
