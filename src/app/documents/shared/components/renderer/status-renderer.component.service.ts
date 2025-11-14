import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';
// import { GridOptions, ColDef } from 'ag-grid';
import { TranslateService } from '@ngx-translate/core';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';

/**
 * ステータスレンダラーコンポーネントサービス
 */
@Injectable()
export class EIMStatusRendererComponentService {

	public valueGetter: (params: any) => string;

	public valueFormatter: (params: any) => string;

	constructor(
		protected translateService: TranslateService,
	) {

		let func: (params: any) => string = (params: any): string => {
			let value = '';
			value = this.getLabel(params.data);
			return value;
		};

		this.valueGetter = func;

		this.valueFormatter = func;
	}

	public getLabel(data): string {
		let label = '';

		// 表示文言決定
		if (data.expiration === true || data.expiration === 'true') {
			label = this.translateService.instant('EIM_DOCUMENTS.LABEL_02043');
		} else if (data.lockUserName && data.lockUserName != '') {
			// 改訂中
			label = this.translateService.instant('EIM_DOCUMENTS.LABEL_02035') + '(' + data.lockUserName + ')';
		} else if (data.statusTypeName == '-') {
			let ocrString = '';
			if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESS_WAIT) {
				// OCR処理待
				ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02131');
			} else if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESSING) {
				// OCR処理中
				ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02132');
			} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_FAILURE) {
				// OCR処理失敗
				ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02133');
			} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_SUCCESS) {
				// OCR処理成功
				ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02140');
			}
			label = '-' + ocrString;
		} else {
			let ocrString = '';
			if (data.statusTypeKind !== '') {
				if (data.statusTypeKind == EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
					if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESS_WAIT) {
						// OCR処理待
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02131');
					} else if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESSING) {
						// OCR処理中
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02132');
					} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_FAILURE) {
						// OCR処理失敗
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02133');
					} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_SUCCESS) {
						// OCR処理成功
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02140');
					}
				}
			} else {
				if (data.isNoWFPublic === 'true') {
					if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESS_WAIT) {
						// OCR処理待
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02131');
					} else if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESSING) {
						// OCR処理中
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02132');
					} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_FAILURE) {
						// OCR処理失敗
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02133');
					} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_SUCCESS) {
						// OCR処理成功
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02140');
					}
				}
			}
			if (data.statusTypeName) {
				label = data.statusTypeName + ocrString;
			}
		}

		return label;
	}

}
