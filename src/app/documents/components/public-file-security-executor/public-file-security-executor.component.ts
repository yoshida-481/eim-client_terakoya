import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMMessageType } from './../../../shared/services/message.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMPublicFileSecurityDomain } from 'app/documents/shared/domains/public-file-security.domain';


/**
 * 公開ファイルセキュリティ設定コンポーネント
 * @example
 *      <eim-public-file-security-executor
 *          [objId]="objId"
 *          [activityFlag]="activityFlag"
 *          [publicFileSecurity]="publicFileSecurity">
 *      </eim-public-file-security-executor>
 */
@Component({
    selector: 'eim-public-file-security-executor',
    templateUrl: './public-file-security-executor.component.html',
    styleUrls: ['./public-file-security-executor.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMPublicFileSecurityExecutorComponent) }
    ],
    standalone: false
})
export class EIMPublicFileSecurityExecutorComponent implements OnInit, EIMExecutable {

	/** 変更対象オブジェクト */
	@Input() objId: number;

	/** 変更対象オブジェクトの公開ファイルセキュリティ設定 */
	@Input() publicFileSecurity: EIMPublicFileSecurityDomain;

	/** 活性化フラグ */
	@Input() activityFlag = true;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 更新完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();

	/** フォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: NgForm;

	/** 正規表現：パスワード */
	public regexpPassword: string = EIMConstantService.REGULAR_EXPRESSION_PASSWORD;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** チェックボックス入力有無 */
	public checkBoxCond = {
		browsePassword: false,
		securityPassword: false,
		forbidPrint: false,
		forbidEdit: false,
		forbidAnnotate: false,
		forbidReproduce: false,
	};
	/** 参照用パスワード(入力) */
	public browsePassword1st = '';
	/** 参照用パスワード(再入力) */
	public browsePassword2nd = '';
	/** セキュリティパスワード(入力) */
	public securityPassword1st = '';
	/** セキュリティパスワード(再入力) */
	public securityPassword2nd = '';
	/** 全て非活性 */
	public allDisabled = false;
	/** BlockUI設定フラグ */
	public blockUiFlag = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected messageService: EIMMessageService,
			protected approveService: EIMApproveService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 入力データを取得します.
	 * @return 入力データ
	 */
	public getInputedData(): EIMPublicFileSecurityDomain {
		return {
			doSetSecurity: this.activityFlag,
			doSetReferencePassword: this.activityFlag && this.checkBoxCond.browsePassword,
			doSetSecurityPassword: this.activityFlag && this.checkBoxCond.securityPassword,
			forbidAnnotate: this.activityFlag && this.checkBoxCond.forbidAnnotate,
			forbidEdit: this.activityFlag && this.checkBoxCond.forbidEdit,
			forbidPrint: this.activityFlag && this.checkBoxCond.forbidPrint,
			forbidReproduce: this.activityFlag && this.checkBoxCond.forbidReproduce,
			objId: this.objId,
			referencePassword: (this.activityFlag && this.checkBoxCond.browsePassword) ? this.browsePassword1st : '',
			securityPassword: (this.activityFlag && this.checkBoxCond.securityPassword) ? this.securityPassword1st : '',
		}
	}

	/**
	 * コンテンツ情報を更新します.
	 */
	public execute(): void {
		// 関連項目にチェックがついていない場合は空文字にする
		if (!this.checkBoxCond.securityPassword) {
			this.securityPassword1st = '';
			this.securityPassword2nd = '';
		}
		if (!this.checkBoxCond.browsePassword) {
			this.browsePassword1st = '';
			this.browsePassword2nd = '';
		}

		// 完了イベントを通知(画面が閉じる)
		this.approveService.setPublicFileSecurity(this.getInputedData())
		.subscribe(
			(res: any) => {
				this.executed.emit();
			});
	}

	/**
	 * コンテンツ情報更新可否を返却します.
	 * @return コンテンツ情報更新可否
	 */
	public executable(): boolean {
		return (!this.checkBoxCond.securityPassword || this.securityPassword1st === this.securityPassword2nd)
				&& (!this.checkBoxCond.browsePassword || this.browsePassword1st === this.browsePassword2nd);
	}

	/**
	 * blockUI設定をします.
	 * @param blockUI設定可否
	 */
	public blockUiCheck(blockUi: boolean) {
		this.blockUiFlag = blockUi;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		if (this.publicFileSecurity.doSetSecurity) {
			this.checkBoxCond.securityPassword = this.publicFileSecurity.doSetSecurityPassword;
			this.securityPassword1st = this.securityPassword2nd = this.publicFileSecurity.securityPassword;
			this.checkBoxCond.browsePassword = this.publicFileSecurity.doSetReferencePassword;
			this.browsePassword1st = this.browsePassword2nd = this.publicFileSecurity.referencePassword;
			this.checkBoxCond.forbidPrint = this.publicFileSecurity.forbidPrint;
			this.checkBoxCond.forbidEdit = this.publicFileSecurity.forbidEdit;
			this.checkBoxCond.forbidAnnotate = this.publicFileSecurity.forbidAnnotate;
			this.checkBoxCond.forbidReproduce = this.publicFileSecurity.forbidReproduce;
		}
		window.setTimeout(() => {
			if (!this.activityFlag) {
				this.allDisabled = true;
				return;
			}
			this.allDisabled = false;
		});
	}
}
