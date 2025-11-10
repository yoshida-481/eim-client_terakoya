import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';
import { RowNode } from 'ag-grid-community';

/**
 * 暗号化レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMSignEncryptionRendererComponent
 *
 */
@Component({
    selector: 'eim-signencr-cell-renderer',
    template: `
		<div style="height: 100%; display: flex; align-items: center;">
			<a *ngIf="dspPattern==3" class="fa {{icon}}" style="margin: auto; color: #FF0000;"></a>
			<a *ngIf="dspPattern!=3 && isTag" class="fa {{icon}}" style="margin: auto;"></a>
			<a *ngIf="dspPattern!=3 && isDocument" class="fa {{icon}}" style="margin: auto; cursor: pointer;" (click)="onClick($event, params)"></a>
			<label *ngIf="showLabel" style="padding-right:10px;">{{'EIM_DOCUMENTS.LABEL_02204' | translate}}</label>
		</div>
    `,
    standalone: false
})
export class EIMSignEncryptionRendererComponent implements AgRendererComponent {

	public params: any;
	public icon: string;
	public showLabel = true;
	public dspPattern: number;
	public isDocument = false;
	public isTag = false;

	static comparator = (valueA: any, valueB: any, nodeA: RowNode, nodeB: RowNode): number => {
		let getSignEncrKind = function(data: any): number {
			if (data.signencr === EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR ||
					data.signencr === Number(EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR)) {
				// 署名・暗号化済のタグ
				if (data.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
					return 0;
				// 署名・暗号化済のドキュメント
				} else {
					return 1;
				}
			// 署名・暗号化失敗
			} else if (data.signencr === EIMDocumentsConstantService.SIGNENCR_KIND_FAILED ||
					data.signencr === Number(EIMDocumentsConstantService.SIGNENCR_KIND_FAILED)) {
				return 2;
			// 処理中
			} else if (data.signencr === EIMDocumentsConstantService.SIGNENCR_KIND_PROCESSING_SIGNENCR ||
					data.signencr === Number(EIMDocumentsConstantService.SIGNENCR_KIND_PROCESSING_SIGNENCR)) {
				return 3;
			}
			// 署名・暗号化なし
			return 4;
		}
		return getSignEncrKind(nodeA.data) - getSignEncrKind(nodeB.data);
	}

	/**
	 * コンストラクタです.
	 */
	constructor(
			private fileService: EIMFileService,
			private userService: EIMDocumentsUserService,
	) {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params.data;
		// アイコン取得
		// 暗号化済み
		if (this.params.signencr === EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR ||
			this.params.signencr === Number(EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR)) {
				this.icon = 'fa fa-lock';
		// 暗号化失敗
		} else if (this.params.signencr === EIMDocumentsConstantService.SIGNENCR_KIND_FAILED ||
			this.params.signencr === Number(EIMDocumentsConstantService.SIGNENCR_KIND_FAILED)) {
				this.icon = 'eim-icon-cancel';
				this.dspPattern = Number(EIMDocumentsConstantService.SIGNENCR_KIND_FAILED);
		} else {
			this.icon = '';
		}

		// 処理中ラベル表示可否
		if (String(this.params.signencr) !== EIMDocumentsConstantService.SIGNENCR_KIND_PROCESSING_SIGNENCR) {
				this.showLabel = false;
		}

		// ドキュメントtype判定
		if (this.params.isDocument === 'true' || this.params.isDocument === true) {
			this.isDocument = true;
		} else if (this.params.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			this.isTag = true;
		}
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * アイコンクリックイベントハンドラ
	 * @param event イベント
	 * @param params パラメータ
	 */
	onClick(event, params) {
		// リンククリックイベントのバブリングを止める（選択行クリックでセルが編集状態になるため）
		event.preventDefault();
		event.stopPropagation();

		if (this.icon === '') {
			return;
		}
		// ダウンロード
		this.fileService.downloadSignencrDocument(params.objId);
		this.userService.sendReplyMail(params.objId);
	}
}
