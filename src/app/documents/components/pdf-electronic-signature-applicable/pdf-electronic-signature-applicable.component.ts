import { EIMMessageService } from 'app/shared/services/message.service';
import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';
import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMDocumentAuthenticationService } from 'app/documents/shared/services/apis/authentication.service';

namespace approverNameInsert {
	export const NONE = '0';
	export const FINAL = '1';
	export const ALL = '2';
}

/**
 * 電子署名設定コンポーネント
 * @example
 *      <eim-pdf-electronic-signature-applicable>
 *          [activityFlag]="activityFlag"
 *      </eim-pdf-electronic-signature-applicable>
 */
@Component({
    selector: 'eim-pdf-electronic-signature-applicable',
    templateUrl: './pdf-electronic-signature-applicable.component.html',
    styleUrls: ['./pdf-electronic-signature-applicable.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMPDFElectronicSignatureApplicableComponent) }
    ],
    standalone: false
})
export class EIMPDFElectronicSignatureApplicableComponent implements OnInit, EIMUpdatable {

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	/** 文字列型フラグオン：1 */
	private readonly FLAG_ON = '1';

	/** 文字列型フラグオン：0 */
	private readonly FLAG_OFF = '0';

	/** 変更対象オブジェクトID */
	@Input() objId: number;

	/** 活性化フラグ */
	@Input() activityFlag: boolean;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** フォーム */
	@ViewChild('electronicSignatureForm', { static: true }) electronicSignatureForm: NgForm;

	/** PDF挿入位置入力最大文字数 */
	public insertionPositionDigit: number = EIMDocumentsConstantService.PDF_INSERTION_POSITION_DIGIT;

	/** 正規表現：PDF挿入位置 */
	public insertionPositionNumber: string = EIMConstantService.REGULAR_EXPRESSION_NUMBER_ONLY;

	/** PDF挿入位置入力最大値 */
	public maximum: number = EIMDocumentsConstantService.PDF_INSERTION_POSITION_MAXIMUM_VALUE;

	/** PDF挿入位置入力最小値 */
	public minimum: number = EIMDocumentsConstantService.PDF_INSERTION_POSITION_MINIMUM_VALUE;

	/** 電子署名設定有無ラジオボタン */
	public doSignPDF = this.FLAG_TRUE;

	/** 承認者名挿入ラジオボタン */
	public insertApproveUser = '';

	/** 挿入ページラジオボタン */
	public insertPage = this.FLAG_ON;

	/** 基準点ラジオボタン */
	public insertPlace = this.FLAG_OFF;

	/** 承認日付チェックボックス入力有無 */
	public approvaldate = false;

	/** 承認者名チェックボックス入力有無 */
	public approver = false;

	/** 基準点X軸入力値 */
	public insertPlaceX = this.FLAG_OFF;

	/** 基準点Y軸入力値 */
	public insertPlaceY = this.FLAG_OFF;

	/** 全て非活性 */
	public allDisabled = false;

	/** 電子署名用選択言語 */
	public selectLang = '';

	/** 電子署名用選択言語リスト */
	public langSelectItems: SelectItem[] = [];

	/** 署名用ジョブ名 */
	public signJobName = '';

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 一時電子署名用選択言語 */
	private tempSelectLang = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected authenticationService: EIMDocumentAuthenticationService,
		protected serverConfigService: EIMServerConfigService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * コンテンツ情報を更新します.
	 */
	public update(): void {
		// 完了イベントを通知(画面が閉じる)
		this.updated.emit();
	}

	/**
	 * コンテンツ情報更新可否を返却します.
	 * @return コンテンツ情報更新可否
	 */
	public updatable(): boolean {
		// 入力値チェック(基準値X軸)
		if (this.doSignPDF === this.FLAG_TRUE
			&& (!this.insertPlaceX.match(this.insertionPositionNumber)
				|| (Number(this.insertPlaceX) > this.maximum || Number(this.insertPlaceX) < this.minimum))) {
			return false;
		}

		// 入力値チェック(基準値Y軸)
		if (this.doSignPDF === this.FLAG_TRUE
			&& (!this.insertPlaceY.match(this.insertionPositionNumber)
				|| (Number(this.insertPlaceY) > this.maximum || Number(this.insertPlaceY) < this.minimum))) {
			return false;
		}

		// 入力値チェック(署名用ジョブ名)
		if (this.doSignPDF === this.FLAG_TRUE && this.serverConfigService.useSignTool === EIMConstantService.SIGN_USE_TOOL_HGPSCAN &&
			!this.signJobName.trim()) {
			return false;
		}

		return true;
	}

	/**
	 * データを取得します.
	 * @param コンテンツ情報更新可否
	 */
	public setData(pdfOutput: EIMPDFOutputDomain): void {
		// 電子署名設定有無
		if (pdfOutput.doSignPDF) {
			this.doSignPDF = this.FLAG_TRUE
		} else {
			this.doSignPDF = this.FLAG_FALSE;
		}
		// 承認日付挿入
		this.approvaldate = pdfOutput.insertApproveDate;
		// 承認者名挿入
		if (pdfOutput.insertApproveUser === approverNameInsert.NONE) {
			this.approver = false;
			this.insertApproveUser = '';
		} else if (pdfOutput.insertApproveUser === approverNameInsert.FINAL || pdfOutput.insertApproveUser === approverNameInsert.ALL) {
			this.approver = true;
			this.insertApproveUser = pdfOutput.insertApproveUser;
		} else {
			this.approver = false;
			this.insertApproveUser = '';
		}
		// 挿入ページ
		this.insertPage = pdfOutput.insertPage;

		// 基準点
		this.insertPlace = pdfOutput.insertPlace;

		// 基準点X軸入力値
		this.insertPlaceX = pdfOutput.insertPlaceX.toString();

		// 基準点Y軸入力値
		this.insertPlaceY = pdfOutput.insertPlaceY.toString();

		// 承認者名用言語
		if (pdfOutput.approveNamelang !== '') {
			// ngOnInitの実行タイミングにより値が反映されない問題があるため一時変数に設定
			this.tempSelectLang = pdfOutput.approveNamelang;
			if (this.selectLang !== '') {
				this.selectLang = this.tempSelectLang;
			}
		}

		// 署名用ジョブ名
		this.signJobName = pdfOutput.signJobName;
	}

	/**
	 * 入力データを取得します.
	 * @return 入力データ
	*/
	public getInputedData(): EIMPDFOutputDomain {

		let domain: EIMPDFOutputDomain = new EIMPDFOutputDomain();

		if (this.doSignPDF === this.FLAG_FALSE) {
			// 「しない」を選択した場合、他の値は固定値
			domain.doSignPDF = false;
			domain.insertApproveDate = false;
			domain.insertApproveUser = approverNameInsert.NONE;
			domain.insertPage = this.FLAG_ON;
			domain.insertPlace = this.FLAG_OFF;
			domain.insertPlaceX = 0;
			domain.insertPlaceY = 0;
			domain.approveNamelang = '';
			domain.signJobName = '';
		} else {
			domain.doSignPDF = true;
			domain.insertPage = this.insertPage;
			domain.insertPlace = this.insertPlace;
			domain.insertPlaceX = Number(this.insertPlaceX);
			domain.insertPlaceY = Number(this.insertPlaceY);
			domain.approveNamelang = this.selectLang;
			domain.signJobName = this.signJobName;

			// 承認日付挿入
			if (this.approvaldate) {
				domain.insertApproveDate = true;
			} else {
				domain.insertApproveDate = false;
			}
			// 承認者名挿入
			if (this.approver === false) {
				domain.insertApproveUser = approverNameInsert.NONE;
			} else {
				domain.insertApproveUser = this.insertApproveUser;
			}
		}

		return domain;
	}

	/**
	 * 電子署名有無判定をします.
	 */
	public blocked(): boolean {
		return this.doSignPDF !== this.FLAG_TRUE
	}

	/**
	 * 電子署名使用ツールを判定をします.
	 */
	public checkSignUseTool(): number {
		let signUseTool = this.serverConfigService.useSignTool;
		if (signUseTool === EIMConstantService.SIGN_USE_TOOL_IOWEB ||
			signUseTool === EIMConstantService.SIGN_USE_TOOL_NORMAL) {
			return 1;
		} else if (signUseTool === EIMConstantService.SIGN_USE_TOOL_HGPSCAN) {
			return 2;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		if (!this.activityFlag) {
			this.allDisabled = true;
		} else if (this.serverConfigService.useSignTool === EIMConstantService.SIGN_USE_TOOL_HGPSCAN) {
			// 電子署名設定の承認者名言語プルダウンメニューの選択肢を取得
			this.authenticationService.getLanguageList().subscribe(
				(data: EIMLanguageDTO[]) => {
					let langList = data;

					if (Array.isArray(langList)) {
						for (let i = 0; i < langList.length; i++) {
							this.langSelectItems.push({
								label: langList[i].name,
								value: langList[i].langId,
							});
							if (i === 0) {
								if (this.tempSelectLang === '') {
									this.selectLang = langList[i].langId.toString();
								} else {
									this.selectLang = this.tempSelectLang;
								}
							}
						}
					}
				}, (err: any) => {
					this.errored.emit(err);
				}
			);
		}

		return;
	}

	/**
	 * 承認者名挿入チェックボックス変更のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangeApprover(event): void {
		if (this.approver) {
			// チェックON
			this.insertApproveUser = this.FLAG_ON;
		} else {
			// チェックOFF
			this.insertApproveUser = this.FLAG_OFF;
		}
	}

}
