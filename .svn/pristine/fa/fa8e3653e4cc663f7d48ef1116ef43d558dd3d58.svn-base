import { EIMHttpService } from 'app/shared/services/http.service';
import { Component, ViewChild, OnDestroy, HostListener, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ToastMessageOptions, MessageService } from 'primeng/api';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';

import { EIMMessageService, EIMMessage, EIMMessageType } from 'app/shared/services/message.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

/**
 * メッセージ情報インタフェース
 */
interface EIMMessageInfo {
	dialogTitle?: string,
	dialogIcon?: string,
	dialogMessage?: string,
	displayMessage?: boolean,
	dialogAccept?: () => void,
	dialogReject?: () => void,

	toastMessages?: ToastMessageOptions[],

	dialogCheckboxMessage?: string,
	dialogChangeCheck?: (V: boolean) => void,
}

/**
 * メッセージコンポーネント
 */
@Component({
    selector: 'eim-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css'],
	imports: [
		CommonModule,
		ButtonModule,
		TranslateModule,
		DialogModule,
		ToastModule,
		CheckboxModule,
	],
	providers:[
	],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
    standalone: true
})
export class EIMMessageComponent implements OnDestroy {

	/** ダイアログ表示確認のインターバル */
	public static MESSAGE_COMPONENT_DIALOG_SHOW_CHECK_INTERVAL = 100;

	/** フォーカス対象 */
	@ViewChild('closeButtons') closeButtons: ElementRef;

	/** フォーカス対象 */
	@ViewChild('confirmButtons') confirmButtons: ElementRef;

	/** フォーカス対象 */
	@ViewChild('dispConfirmCheckBox') dispConfirmCheckBox: Checkbox;

	/** メッセージ情報 */
	public info: EIMMessageInfo = {
		displayMessage: false,
	};

	/** 確認ダイアログ */
	public isConfirm = false;
	/** 複数行ダイアログ */
	public isMultipleLines = false;
	/** 複数行ダイアログデータ */
	public targetList: string[];
	/** 複数コンテンツダイアログ */
	public isContents = false;
	/** 複数コンテンツデータ */
	public contents: string[];

	/** チェックボックス付きダイアログ */
	public isCheckBox = false;
	public checked = false;

	private addmessage;

	private focusControl = null;

	/** ダイアログ表示中かどうかのフラグ */
	private isShow = false;

	/**
	 * コンストラクタ
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected httpService: EIMHttpService,
		protected messageAPIService: MessageService
	) {
		this.addmessage = messageService.addMessage.subscribe((msg: EIMMessage) => { this.showMessageWithCheck(msg); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	ngOnDestroy(): void {
		if (!this.addmessage.closed) {
			this.addmessage.unsubscribe();
		}
	}

	/**
	 * ダイアログ表示時のイベントハンドラ.
	 */
	onShow(): void {
		this.isShow = true;
	}

	/**
	 * ダイアログ非表示時のイベントハンドラ.
	 */
	 onHide(): void {
		this.isShow = false;
	}
	/**
	 * 確認ダイアログのはい押下時のイベントハンドラ.
	 */
	 public dialogAccept(): void {
		if (this.isCheckBox) {
			this.info.dialogChangeCheck(this.checked);
		}
		this.info.displayMessage = false;
		this.info.dialogAccept();
	}

	/**
	 * 確認ダイアログのいいえ押下時のイベントハンドラ.
	 */
	 public dialogReject(): void {
		this.info.dialogReject();
		this.info.displayMessage = false;
	}
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	private showMessageWithCheck(msg: EIMMessage): void {
		let intervalId = setInterval(() => {
			if (this.isShow) {
				return;
			}
			clearInterval(intervalId);
			this.showMessage(msg);
		}, EIMMessageComponent.MESSAGE_COMPONENT_DIALOG_SHOW_CHECK_INTERVAL);
	}
	private showMessage(msg: EIMMessage) {
		// 初期化
		this.info.dialogAccept = null;
		this.info.dialogReject = null;
		this.isMultipleLines = false;
		this.targetList = [];
		this.isContents = false;
		this.contents = [];

		this.info.dialogAccept = msg.accept;
		if (!msg.accept) {
			this.info.dialogAccept = () => { };
		}

		this.isMultipleLines = msg.isMultipleLines;

		if (msg.contents) {
			this.isMultipleLines = false;
			this.isContents = true;
			this.contents = msg.contents;
		}

		if (msg.targetList && msg.targetList.length > 0) {
			this.targetList = msg.targetList;
		}

		if (msg.msgType === EIMMessageType.confirm) {
			this.info.dialogTitle = 'Confirm';
			this.info.dialogIcon = 'eim-icon-confirm-dialog';
			this.info.dialogReject = msg.reject;
			if (!msg.reject) {
				this.info.dialogReject = () => { };
			}
			this.isConfirm = true;
		} else if (msg.msgType === EIMMessageType.info) {
			this.info.dialogTitle = 'Info';
			this.info.dialogIcon = 'eim-icon-info-dialog';
			this.isConfirm = false;
		} else if (msg.msgType === EIMMessageType.warn) {
			this.info.dialogTitle = 'Warn';
			this.info.dialogIcon = 'eim-icon-warn-dialog';
			this.isConfirm = false;
		} else if (msg.msgType === EIMMessageType.error) {
			this.info.dialogTitle = 'Error';
			this.info.dialogIcon = 'eim-icon-error-dialog';
			this.isConfirm = false;
		}

		if (msg.isGrowl) {
			this.info.toastMessages = [{ severity: 'info', summary: 'Information', detail: msg.msg, life: 3000 }];
			this.messageAPIService.addAll(this.info.toastMessages);
		} else {
			this.info.dialogMessage = msg.msg;
			this.info.displayMessage = true;
		}

		this.isCheckBox = false;
		this.info.dialogCheckboxMessage = msg.chkmsg;
		if (msg.chkmsg) {
			this.isCheckBox = true;
			this.checked = false;
			this.info.dialogChangeCheck = msg.changeCheck;
		}

		window.setTimeout(() => {
			if (msg.msgType === EIMMessageType.confirm) {
				this.focusControl = document.getElementById('confirmAccept');
			} else {
				this.focusControl = document.getElementById('close');
			}
			if (this.focusControl) {
				this.httpService.setFocusElement(this.focusControl);
				this.focusControl.focus();
			}
		});
	}

	/**
	 * キーダウンイベントハンドラ.
	 * @param event イベント
	 */
	@HostListener('document:keydown', ['$event'])
	public handleKeyboardEvent(event: KeyboardEvent): void {
		if (event.key === 'Tab') {
			// 現在のフォーカスが存在しない場合、確認ダイアログ(閉じるボタンしか存在しない)の場合、メッセージにフォーカスを当てる
			if (!this.isConfirm && ((<HTMLElement>event.target).id === 'close' || (<HTMLElement>event.target).id === 'eim-body'
				|| (<HTMLElement>event.target).id === 'firstFocusMenu' && (<HTMLElement>window.document.getElementsByClassName('p-dialog')[0]).style.display !== 'none')) {
				window.setTimeout(() => {
					let focusElement = <HTMLElement>this.closeButtons.nativeElement.firstElementChild;
					focusElement.focus();
					this.httpService.setFocusElement(focusElement);
				});
				event.preventDefault();
			} else if ((<HTMLElement>event.target).id === 'confirmAccept') {
				window.setTimeout(() => {
					let focusElement = <HTMLElement>this.confirmButtons.nativeElement.lastElementChild;
					focusElement.focus();
					this.httpService.setFocusElement(focusElement);
				});
				event.preventDefault();
			} else if ((<HTMLElement>event.target).id === 'confirmClose' || (<HTMLElement>event.target).id === 'eim-body'
				|| (<HTMLElement>event.target).id === 'firstFocusMenu' && (<HTMLElement>window.document.getElementsByClassName('p-dialog')[0]).style.display !== 'none') {
				window.setTimeout(() => {
					let focusElement = <HTMLElement>this.confirmButtons.nativeElement.firstElementChild;
					focusElement.focus();
					this.httpService.setFocusElement(focusElement);
				});
				event.preventDefault();
			}
		}
	}

}
