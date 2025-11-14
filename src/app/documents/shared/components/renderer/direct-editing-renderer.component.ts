import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMWebDAVService } from 'app/shared/services/webdav.service';

/**
 * 直接編集レンダラーコンポーネント
 * @example
 *
 *      <eim-direct-editing-renderer>
 *      </eim-direct-editing-renderer>
 */
@Component({
    selector: 'eim-direct-editing-renderer',
    template: `
    <div *ngIf="showIcon" style="height: 100%; display: flex; align-items: center; justify-content: center; text-align: center;">
    	<i class="fa fa-pencil-square-o fa-lg eim-document-main-single-clickable" [style.color]="getColor()" [style.cursor]="disabled(params.data) ? 'default' : 'pointer'" (click)="onClick($event, params)"></i>
    </div>
    `,
    styles: [],
    standalone: false
})
export class EIMDirectEditingRendererComponent implements AgRendererComponent {
	public params: any;
	public showIcon = false;

	constructor(
			protected sanitizer: DomSanitizer,
			protected webDAVService: EIMWebDAVService,
			protected serverConfigService: EIMServerConfigService,
		) {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
  agInit(params: any): void {
		this.params = params;

		if (this.editable(params.data)) {
			this.showIcon = true;
		}

	}

  refresh(params: any): boolean {
  	return true;
  }

	onClick(event, params) {
		event.preventDefault();
		if (!this.disabled(this.params.data)) {
			this.webDAVService.checkStatus(params.data.objId).subscribe(
				(editable: boolean) => {
					this.webDAVService.edit(params.data.objId, params.data.objName);
			});
		}
	}

	private getColor(): string {
		let color = '';
		if (!this.disabled(this.params.data)) {
			color = '#007700';
		}
		return color;
	}

	private editable(obj: any): boolean {
		if (obj.isDocument === 'false' || obj.isDocument === false) {
			return false;
		}
		if (!this.webDAVService.editable(obj.objName)) {
			return false;
		}
		return true;
	}

	private disabled(obj: any): boolean {
		if (obj.hasOwnProperty('readOnly') && (obj.readOnly == 'true' || obj.readOnly == true)) {
			return true;
		}

		if (this.isLocked(obj)) {
			return true;
		}

		// 承認中チェックイン可能オプションが設定されていない場合
		if (!this.serverConfigService.enableApproverCheckinFlg) {
			// WFあり、かつ、ステータスが編集中以外の場合非活性
			if (obj.statusTypeKind && obj.statusTypeName !== '-' &&
				Number(obj.statusTypeKind) !== (EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING)) {
				return true;
			}
		}

		if (!obj.statusTypeKind && obj.statusTypeName == '-') {
			return false;
		} else if (obj.statusTypeKind && (Number(obj.statusTypeKind) != EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING &&
				Number(obj.statusTypeKind) != EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_APPROVAL_REQUEST)) {
			return true;
		}

		return false;
	}

	/**
	 * WebDAVロック状態を判定します.
	 *
	 * @param obj オブジェクト
	 * @return WebDAVロック状態
	 */
	private isLocked(obj: any): boolean {
		// 引数チェック
		if (!obj) {
			// ロック状態とみなす
			return true;
		}

		if (obj.lockDate && (obj.isWebDAVLock == 'false' || obj.isWebDAVLock == false)) {
			return true;
		}

		if ((obj.isWebDAVLock == 'true' || obj.isWebDAVLock == true) && (obj.isLockedMyself == 'false' || obj.isLockedMyself == false)) {
			return true;
		}

		return false;
	}

}
