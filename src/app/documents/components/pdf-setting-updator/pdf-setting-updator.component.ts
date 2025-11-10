import { EIMMessageType } from './../../../shared/services/message.service';
import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';

import { EIMPDFElectronicSignatureApplicableComponent} from 'app/documents/components/pdf-electronic-signature-applicable/pdf-electronic-signature-applicable.component';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMPublicFileSecurityExecutorComponent } from 'app/documents/components/public-file-security-executor/public-file-security-executor.component';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';

/**
 * PDF出力設定コンポーネント
 * @example
 *      <eim-pdf-setting-updator>
 *          [activityFlag]="activityFlag"
 * 					[objId]="objId"
 *  				[pdfOutput]="pdfOutput"
 *      </eim-pdf-setting-updator>
 */
@Component({
    selector: 'eim-pdf-setting-updator',
    templateUrl: './pdf-setting-updator.component.html',
    styleUrls: ['./pdf-setting-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMPDFSettingUpdatorComponent) }
    ],
    standalone: false
})
export class EIMPDFSettingUpdatorComponent implements OnInit , EIMUpdatable {

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	/** 電子署名・セキュリティの活性フラグ */
	@Input() activityFlag: boolean;

	/** 変更対象オブジェクトID */
	@Input() objId: number;

	/** PDF出力情報 */
	@Input() pdfOutput: EIMPDFOutputDomain;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** 電子署名タブ用 子コンポーネント */
	@ViewChild('pdfElectronicSignatureApplicable', { static: true }) pdfElectronicSignatureApplicable: EIMPDFElectronicSignatureApplicableComponent;

	/** セキュリティタブ用 子コンポーネント */
	@ViewChild('publicFileSecurityUpdater', { static: true }) publicFileSecurityUpdater: EIMPublicFileSecurityExecutorComponent;

	/** フォーム */
	@ViewChild('pdfSettingForm', { static: true }) pdfSettingForm: NgForm;

	/** セキュリティ設定有無ラジオボタン */
	public doSetSecurity = this.FLAG_FALSE;

	/** セキュリティ設定非活性 */
	public securityDisabled = false;

	/** 更新ボタン表示可否 */
	public visibleUpdate = true;

	/** 編集フラグ */
	public edited = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected documentFormService: EIMDocumentFormService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 入力データを取得します.
	*/
	public getInputedData(): EIMPDFOutputDomain {

		// 電子署名設定
		let inputedData: EIMPDFOutputDomain = this.pdfElectronicSignatureApplicable.getInputedData();
		// セキュリティ設定分を反映
		Object.assign(inputedData, this.publicFileSecurityUpdater.getInputedData());
		inputedData.doSetSecurity = this.doSetSecurity === this.FLAG_TRUE ? true : false;

		// 電子署名設定・セキュリティ設定有無
		let doSignPDFAndSetSecurity: string;
		if (this.pdfElectronicSignatureApplicable.doSignPDF === this.FLAG_TRUE || this.doSetSecurity === this.FLAG_TRUE) {
			inputedData.doSignPDFAndSetSecurity = true;
		} else {
			inputedData.doSignPDFAndSetSecurity = false;
		}

		// セキュリティタブの「する・しない」設定の値を「しない」とした場合
		if (this.doSetSecurity === this.FLAG_FALSE) {
			inputedData.doSetReferencePassword = false;
			inputedData.doSetSecurityPassword = false;
			inputedData.forbidAnnotate = false;
			inputedData.forbidEdit = false;
			inputedData.forbidPrint = false;
			inputedData.forbidReproduce = false;
			inputedData.referencePassword = '';
			inputedData.securityPassword = '';
		}

		return inputedData;
	}

	/**
	 * コンテンツ情報を更新します.
	 */
	public update(): void {
		// 完了イベントを通知(画面が閉じる)
		this.updated.emit(this.getInputedData());
	}

	/**
	 * コンテンツ情報更新可否を返却します.
	 * @return コンテンツ情報更新可否
	 */
	public updatable(): boolean {
		return (this.edited || this.pdfSettingForm.dirty || this.pdfElectronicSignatureApplicable.electronicSignatureForm.dirty || this.publicFileSecurityUpdater.propertyForm.dirty)
			// 電子署名タブの更新可否条件を満たすかどうか
			&& (this.pdfElectronicSignatureApplicable.doSignPDF === this.FLAG_FALSE || this.pdfElectronicSignatureApplicable.updatable())
			// セキュリティタブの実行可否条件を満たすかどうか
			&& (this.doSetSecurity === this.FLAG_FALSE || this.publicFileSecurityUpdater.executable());
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		window.setTimeout(() => {
			if (!this.activityFlag) {
				this.visibleUpdate = false;
				this.securityDisabled = true;
			}

			// セキュリティ設定有無
			if (!this.pdfOutput.doSetSecurity) {
				this.doSetSecurity = this.FLAG_FALSE;
				this.publicFileSecurityUpdater.blockUiCheck(true);
			} else {
				this.doSetSecurity = this.FLAG_TRUE;
				this.publicFileSecurityUpdater.blockUiCheck(false);
			}
			this.show();
			// 一度編集した後に再度本ダイアログを開いた場合は最初から編集済みとする
			if (this.pdfOutput['edited'] !== undefined && this.pdfOutput['edited'] === true) {
				this.edited = true;
			}
		});

		return;
	}

	/**
	 * セキュリティ設定有無ラジオボタンクリックイベントハンドラです.
	 */
	onClickBlockOn($event) {
		if ( this.doSetSecurity === this.FLAG_FALSE ) {
			this.publicFileSecurityUpdater.blockUiCheck(true);
		} else {
			this.publicFileSecurityUpdater.blockUiCheck(false);
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します
	 */
	private show(): void {
		this.pdfElectronicSignatureApplicable.setData(this.pdfOutput);
	}

}
