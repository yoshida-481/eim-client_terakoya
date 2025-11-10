import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { Component, forwardRef, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable, EIMMenuItem } from 'app/shared/shared.interface';

import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';

import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';

/**
 * OCR処理設定コンポーネント
 * @example
 *
 *      <eim-ocr-setting-updator
 *        [content]="content">
 *      </eim-ocr-setting-updator>
 */
@Component({
    selector: 'eim-ocr-setting-updator',
    templateUrl: './ocr-setting-updator.component.html',
    styleUrls: ['./ocr-setting-updator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMOCRSettingUpdatorComponent) }],
    standalone: false
})
export class EIMOCRSettingUpdatorComponent implements OnInit, EIMUpdatable {

	/** フラグON時数値：1 */
	private readonly FLAG_ON = 1;

	/** フラグOFF時数値：0 */
	private readonly FLAG_OFF = 0;

	/** 対象のオブジェクト */
	@Input() content: any[];

	/** 登録完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** OCR処理設定チェックボックス入力値 */
	public ocrSettingValue: number;

	/** 更新ボタン押下可能フラグ */
	private updatableFlg = false;

	/** 更新対象データ一覧(objId) */
	private updateTarget: any[] = [];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected documentFormService: EIMDocumentFormService,
	) { }

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * OCR処理設定を更新します.
	 */
	public update(): void {
		this.documentFormService.ocrSettingUpdator(this.content, this.ocrSettingValue ).subscribe(
			(data: any) => {
			  this.updated.emit(this.updateTarget);
			},
			(err: any) => {
				this.errored.emit();
			});
	}

	/**
	 * 一括登録可否を返却します.
	 * @return フォルダ登録可否
	 */
	public updatable(): boolean {
		return this.updatableFlg;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		if ( !this.content || this.content.length === 0) {
			return;
		}
		let cntDo = 0;
		let cntNo = 0;
		for ( let i = 0; i < this.content.length; i++ ) {

			// 更新対象に追加
			this.updateTarget.push({objId: this.content[i].objId});

			let xml = this.content[i];
			let ocrProcessStatus = xml.ocrProcessStatus;

			if (ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESS_WAIT) {
				// OCR処理する
				cntDo++;
			} else {
				// OCR処理しない
				cntNo++;
			}
		}

		if (cntDo === this.content.length) {
			// するにチェック
			this.ocrSettingValue = this.FLAG_ON;
		} else if (cntNo === this.content.length) {
			// しないにチェック
			this.ocrSettingValue = this.FLAG_OFF;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 */
	onChange(): void {
		this.updatableFlg = true;
	}

}
