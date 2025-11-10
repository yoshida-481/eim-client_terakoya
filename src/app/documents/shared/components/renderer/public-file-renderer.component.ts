import { EIMDocumentsUserService } from './../../services/apis/documents-user.service';
import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';
import { TranslateService } from '@ngx-translate/core';

import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMDocumentsConstantService } from '../../services/documents-constant.service';

/**
 * 公開ファイルレンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMPublicFileRendererComponent
 *
 */
@Component({
    selector: 'eim-public-file-renderer',
    template: `
		<div style="height: 100%; display: flex; align-items: center; justify-content: center;">
			<i class="fa {{icon}} fa-lg eim-document-main-single-clickable" pTooltip="{{toolTipString}}" (click)="onClick($event, params)"></i>
		</div>
    `,
    styles: ['i {cursor: pointer;}'],
    standalone: false
})
export class EIMPublicFileRendererComponent implements AgRendererComponent {
	public params: any;
	public icon: string;
	public isOldRevLink: boolean;
	public toolTipString = '';

	constructor(
			private publicFileRendererComponentService: EIMPublicFileRendererComponentService,
			private fileService: EIMFileService,
			private serverConfigService: EIMServerConfigService,
			protected translateService: TranslateService,
			private userService: EIMDocumentsUserService,
	) {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;

		this.isOldRevLink = false;
		if (params.data.hasOwnProperty('isDocumentLink') && params.data.hasOwnProperty('isDspLatestLink')) {
			if (params.data.isDocumentLink === 'true' || params.data.isDocumentLink === true) {
				if (params.data.isDspLatestLink === 'true' || params.data.isDspLatestLink === true) {
					this.isOldRevLink = true;
					this.toolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02188');
				}
			}
		}
		if (params.data.hasOwnProperty('isOldVer')) {
			if (params.data.isOldVer === 'true' || params.data.isOldVer === true) {
				this.isOldRevLink = true;
				this.toolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02188');
			}
		}

		// 事前登録された公開ファイルかどうか
		if (!this.isOldRevLink
			&& (params.data.isPdfPreRegistered === true || params.data.isPdfPreRegistered === 'true')){
			this.toolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02222');
		}

		// PDF変換完了(原本更新有)かどうか判定
		if (params.data.hasOwnProperty('pdfConversionStatus')) {
			if (Number(params.data.pdfConversionStatus) === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL) {
				this.isOldRevLink = true;
				if (params.data.isPdfPreRegistered === true || params.data.isPdfPreRegistered === 'true'){
					this.toolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02221');
				} else {
					this.toolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02209');
				}
			}
		}

		this.icon = this.publicFileRendererComponentService.getIcon(params.data, this.isOldRevLink);
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	onClick(event, params) {
		event.preventDefault();

		if (this.icon != null) {
			if(this.serverConfigService.checkPreviewFileExt(params.data.objName)){
				this.publicFileRendererComponentService.openPreviewWindow(params.data);
			}else{
				this.fileService.downloadPublicDocument(params.data.objId);
			}
			this.userService.sendReplyMail(params.data.objId);
		}

	}
}
