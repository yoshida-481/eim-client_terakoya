import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMObjectNameRendererComponentService } from 'app/documents/shared/components/renderer/object-name-renderer.component.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMThumbnailService } from '../../services/apis/document-thumbnail.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';

/**
 * 公開ファイルレンダラーコンポーネントサービス
 */
@Injectable()
export class EIMPublicFileRendererComponentService {

	/** バリューゲッタ */
	public valueGetter: (params: any) => string;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectNameRendererComponentService: EIMObjectNameRendererComponentService,
		protected domainService: EIMDomainService,
		private thumbnailService: EIMThumbnailService,
		protected messageService: EIMMessageService,
		private fileService: EIMFileService,
	) {
		this.valueGetter = (params: any) => {
			let value = '';
			if (this.isPublic(params.data)) {
				// 公開
				let tmpValue = this.translateService.instant('EIM_DOCUMENTS.LABEL_02036');
				if (Number(params.data.pdfConversionStatus) === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL) {
					// 原本ファイルと乖離あり
					tmpValue += this.translateService.instant('EIM_DOCUMENTS.LABEL_02192');
				} else if (params.data.hasOwnProperty('isOldVer') &&
						(params.data.isOldVer === 'true' || params.data.isOldVer === true)) {
					// 版固定リンクで最新版が別に存在する場合
					tmpValue += this.translateService.instant('EIM_DOCUMENTS.LABEL_02191');
				} else if (params.data.hasOwnProperty('isDocumentLink') && params.data.hasOwnProperty('isDspLatestLink')) {
					if (params.data.isDocumentLink === 'true' || params.data.isDocumentLink === true) {
						if (params.data.isDspLatestLink === 'true' || params.data.isDspLatestLink === true) {
							// 版固定リンクで最新版が別に存在する場合
							tmpValue += this.translateService.instant('EIM_DOCUMENTS.LABEL_02191');
						}
					}
				}
				value = tmpValue;
			} else {
				if (params.data.statusTypeName === '-') {
					// WFなしの場合はブランク
					value = '';
				} else {
					// WFありの場合は非公開
					// 非公開
					value = this.translateService.instant('EIM_DOCUMENTS.LABEL_02046');
				}
			}
			return value;
		}
	}

	/**
	 * アイコン名を取得します.
	 * @param data 該当行データ
	 * @param isOldRevLink 旧リビジョンリンクかどうか
	 * @return アイコン名
	 */
	public getIcon(data: any, isOldRevLink: boolean): string {
		let icon = '';

		if (this.domainService.isFalse(data, 'isDocument')) {
			return '';
		}

		// PDF変換時用PDFアイコンを表示
		if (this.domainService.isTrue(data, 'isDspPdfIcon')) {
			if (isOldRevLink === true) {
				if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_SUCCESS) {
					// OCR処理成功
					return 'eim-icon-old-ocr-success';
				} else if (data.isPdfPreRegistered === true || data.isPdfPreRegistered === 'true'){
					return 'eim-icon-pre-regist-old-pdf';
				} else {
					return 'eim-icon-old-pdf';
				}
			} else {
				if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_SUCCESS) {
					// OCR処理成功
					return 'eim-icon-ocr-success';
				} else if (data.isPdfPreRegistered === true || data.isPdfPreRegistered === 'true'){
					return 'eim-icon-pre-regist-pdf';
				} else {
					return 'eim-icon-pdf';
				}
			}
		}

		if (this.isPublic(data)) {
			return this.getFileIcon(data, isOldRevLink);
		}

		return icon;
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

		/* メイン画面と検索画面で戻ってくる値が異なるので判定には利用できない
		if (data.hasOwnProperty('isNoWFPublic') && data.isNoWFPublic == 'true') {
			return true;
		}
		*/

		if (data.hasOwnProperty('statusTypeKind')) {
			if (String(data.statusTypeKind) === String(EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) || 
					String(data.statusTypeKind) === String(EIMTaskConstantService.STATUS_TYPE_KIND_ID_DONE)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * ファイルアイコンを取得します.
	 * @param data 該当行データ
	 * @param isOldRevLink 旧リビジョンリンクかどうか
	 * @return アイコン名
	 */
	private getFileIcon(data: any, isOldRevLink: boolean): string {
		return this.objectNameRendererComponentService.getIcon(data, false, isOldRevLink);
	}

	/**
	 * 別ウィンドウでプレビューを表示します.
	 * @param data 該当行データ
	 */
	public openPreviewWindow(data: any) {

		let mode = '';
		if (this.domainService.isTrue(data, 'isDspPdfIcon') ||  // 公開後（PDF変換あり）
			this.domainService.isTrue(data, 'isPdfPreRegistered') // 公開前（PDF事前変換・設定 あり）
		) {
			const url = window.location.origin + window.location.pathname + '#/documents/pdfViewer?objId=' + data.objId + '&mode=public';
			window.open(url, '_blank');
		} else if (this.isPublic(data)) {
			///公開済（PDF変換なし）or WFなし
			this.thumbnailService.checkExistsPdf(data.objId)
				.subscribe((result: any) => {
					if (result) {
						const url = window.location.origin + window.location.pathname + '#/documents/pdfViewer?objId=' + data.objId + '&mode=preview';
						window.open(url, '_blank');
					} else {
						this.fileService.downloadPublicDocument(data.objId);
					}
				});
		}
	}

}
