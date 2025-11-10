import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMTextInputFormItemComponent } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component';

import { EIMAuthenticationService } from 'app/shared/services/apis/authentication.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
/**
 * パスワード変更コンポーネント
 * @example
 *
 * 	<eim-password-change>
 * 	</eim-password-change>
 *
 */
@Component({
    selector: 'eim-password-change',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMPasswordChangeComponent) }],
    standalone: false
})
export class EIMPasswordChangeComponent implements OnInit, EIMComponent, EIMUpdatable {

	/** 認証サービス */
	@Input() authenticationService: EIMAuthenticationService;

	/** パスワード変更処理完了のイベントエミッタ */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 正規表現：パスワード */
	public regexpPassword: string = EIMConstantService.REGULAR_EXPRESSION_PASSWORD

	/** フォームグループ */
	public passwordChangeForm: UntypedFormGroup;

  	public disabled = false;

	/** パスワード変更時の注意書き文言 */
	public notesMessage: string;

	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 * @param messageService メッセージサービス
	 * @param formBuilder フォームビルダー
	 */
	constructor(
			private translateService: TranslateService,
			private messageService: EIMMessageService,
			formBuilder: UntypedFormBuilder
	) {

		// フォーム
		this.passwordChangeForm = formBuilder.group({
			'currentPassword': new UntypedFormControl(),
			'newPassword': new UntypedFormControl(),
			'confirmPassword': new UntypedFormControl()
		});
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * パスワードを更新します.
	 */
	public update(): void {

		// 入力値チェック(現在のパスワードと新しいパスワード)
		if (this.passwordChangeForm.controls['currentPassword'].value == this.passwordChangeForm.controls['newPassword'].value) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00001'));
			return;
		}
		// 入力値チェック(新しいパスワードと新しいパスワード(確認))
		if (this.passwordChangeForm.controls['newPassword'].value != this.passwordChangeForm.controls['confirmPassword'].value) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00002'));
			return;
		}

		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00001'),
			() => {
				// パスワード変更
				this.authenticationService.changePassword(this.passwordChangeForm.controls['currentPassword'].value, this.passwordChangeForm.controls['newPassword'].value)
					.subscribe(
							(object: any) => {
								// メッセージを表示
								this.messageService.showGrowl(this.translateService.instant('EIM.INFO_00001'));
								// 更新ボタン押下完了イベントを通知(画面を閉じる)
								this.updated.emit();
							}
					);
			}
		);
	}

	/**
	 * 閉じるボタン押下時の処理を実施します.
	 * @param event イベント
	 * @param close クローズイベント
	 */
	public close(event: any, close: EventEmitter<null>): void {
		if (this.passwordChangeForm.dirty) {
			// 初期表示状態から入力内容を編集している場合
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						close.emit();
					}
			);
		} else {
			close.emit();
		}
	}

	/**
	 * 更新ボタン押下可否を返却します.
	 */
	public updatable(): boolean {
		return (this.passwordChangeForm.dirty && this.passwordChangeForm.valid);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.authenticationService.getNotesMessage().subscribe(value => {
			this.notesMessage = value;
		})
	}
}
