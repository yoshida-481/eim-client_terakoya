import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMThumbnailService } from '../../services/apis/document-thumbnail.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';

/**
 * オブジェクト名称レンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMAccordionSearchRendererComponentService {

	public valueGetter: (params: any) => string;

	/** ページクリックイベントエミッタ */
	@Output() pageClicked: EventEmitter<any> = new EventEmitter<any>();

	constructor(
		protected serverConfigService: EIMServerConfigService,
		protected domainService: EIMDomainService,
		private thumbnailService: EIMThumbnailService,
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		private fileService: EIMFileService,
	) {

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
			return 'fa fa-cubes eim-icon-workspace-color';
		}

		// 以降ドキュメントアイコン
		if (isVisibleLink && (node.isDocumentLink === 'true' || node.isDocumentLink === true)) {
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
		if (this.serverConfigService.isCadDxfExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-cad-dxf';
			} else {
				return 'eim-icon-cad-dxf';
			}
		}
		if (this.serverConfigService.isCadDwgExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-cad-dwg';
			} else {
				return 'eim-icon-cad-dwg';
			}
		}
		if (isOldRevLink === true) {
			return 'eim-icon-old-file eim-icon-file-color';
		} else {
			return 'eim-icon-file eim-icon-file-color';
		}

	}

		/**
	 * アイコンを取得する.
	 * @param node オブジェクト名称
	 * @param isVisibleLink リンク表示するかどうか
	 * @return アイコンクラス
	 */
	public getPathIcon(node, isVisibleLink = true, isOldRevLink?: boolean): string {
		// アイコンはフォルダ固定
		return 'eim-icon-folder eim-icon-folder-color';
	}

	/**
	 * ページ押下時処理.
	 * @param params 
	 */
	public onClickPage(params: any, page:any): void {

		params.data["page"] = page;
		this.pageClicked.emit(params.data);
	}

	/**
	 * 公開済みかどうかを返却します.
	 * @param data 該当行データ
	 * @return 公開済みかどうか
	 */
	private isPublic(data): boolean {

		if (this.domainService.isTrue(data, 'isDspPdfIcon')) {
			return true;
		}

		if (this.domainService.isTrue(data, 'isDspPubIconForNoWF')) {
			return true;
		}

		if (this.domainService.isTrue(data, 'isPublished')) {
			return true;
		}

		if (data.hasOwnProperty('statusTypeKind')) {
			if (data.statusTypeKind === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 別ウィンドウでプレビューを表示します.
	 * @param data 該当行データ
	 */
	public openPreviewWindowByPublicIcon(data: any){
	
		let mode = '';
		if (this.domainService.isTrue(data, 'isDspPdfIcon') ||  // 公開後（PDF変換あり）
			this.domainService.isTrue(data, 'isPdfPreRegistered') // 公開前（PDF事前変換・設定 あり）
		) {
			mode = 'public';
		}else if(this.isPublic(data))
		{
			///公開済（PDF変換なし）or WFなし
			mode = 'preview';
		}

		if(mode !== ''){
			this.thumbnailService.checkExistsPdf(data.objId)
				.subscribe((result: any) => {
					if (result) {
						const url = window.location.origin + window.location.pathname + '#/documents/pdfViewer?objId=' + data.objId + '&mode=' + mode;
						window.open(url, '_blank');
					} else {
						this.fileService.downloadPublicDocument(data.objId);
					}
				});
		}
	}

	/**
	 * 別ウィンドウでプレビューを表示します.
	 * @param data 該当行データ
	 */
	public openPreviewWindowByFileName(data: any){
		this.thumbnailService.checkExistsPdf(data.objId)
			.subscribe((result: any) => {
				if (result) {
					const url = window.location.origin + window.location.pathname + '#/documents/pdfViewer?objId=' + data.objId + '&mode=preview';
					window.open(url, '_blank');
				} else {
					this.fileService.downloadPrivateDocument(data.objId);
				}
			});
	}
}
