import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMTextInputFormItemComponent } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component';

import { EIMAuthenticationService } from 'app/shared/services/apis/authentication.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMWorkflowService } from 'app/documents/shared/services/apis/workflow.service';
import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * 公開取消コンポーネント
 * @example
 * 	<eim-contents-public-cancel-executor>
 *		[content]="selectedContent">
 * 	</eim-contents-public-cancel-executor>
 */
@Component({
    selector: 'eim-contents-public-cancel-executor',
    templateUrl: './contents-public-cancel-executor.component.html',
    styleUrls: ['./contents-public-cancel-executor.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMContentsPublicCancelExecutorComponent) }],
    standalone: false
})
export class EIMContentsPublicCancelExecutorComponent implements OnInit, EIMComponent, EIMExecutable {

	/** 対象ドキュメント */
	@Input() content: any;

	/** 公開取消処理完了のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** プロパティ情報取得完了フラグ*/
	public propertyGot = false;

	/** 入力値 */
	public comment = '';

	/** 遷移前ステータス更新日 */
	statusMDateLong: number;

	/** 遷移前ステータスタイプID*/
	forcastStatusTypeId: number;

	public disabled = false;

	/** 公開取消完了リスト*/
	public successData: any[] = [];

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 */
	constructor(
			protected translateService: TranslateService,
			protected workflowService: EIMWorkflowService,
			protected approveService: EIMApproveService,
			protected documentFormService: EIMDocumentFormService,
			protected messageService: EIMMessageService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 公開取消を実行します.
	 */
	public execute(): void {
		let document: any = this.content[0];
		let isFolder: boolean;

		document.statusMDateLong = this.statusMDateLong;
		document.forcastStatusTypeId = this.forcastStatusTypeId;
		document.comment = this.comment;
		isFolder = document.isDocument === 'true' ? false : true;

		// ドキュメントリンクを保持しているかチェック
		this.documentFormService.actCheckHasDocLinkService(isFolder , Number(document.objId))
		.subscribe((data: any) => {
			if (data.isHasFirstVersionDocLink === this.FLAG_TRUE || data.isHasFirstVersionDocLink === true) {
				// 保持していた場合ドキュメントリンク削除確認ダイアログを表示
				// フォルダの場合
				if (isFolder) {
					this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00030',
					{value: document.objName}), () => {
						this.executor(document);
					}, () => {
						this.dialogManagerComponentService.close('CONTENTS_PUBLIC_CANCEL_EXECUTOR');
					});
				// ドキュメントの場合
				} else {
					this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00029',
					{value: document.objName}), () => {
						this.executor(document);
					}, () => {
						this.dialogManagerComponentService.close('CONTENTS_PUBLIC_CANCEL_EXECUTOR');
					});
				}
			// 保持していない場合
			} else {
				this.executor(document);
			}
		}, (err: any) => {
			// エラーの場合、画面を閉じる
			window.setTimeout(() => {
				this.errored.emit();
			});
		});
	}

	/**
	 * 閉じるボタン押下時の処理を実施します.
	 * @param event イベント
	 * @param close クローズイベント
	 */
	public close(event: any, close: EventEmitter<null>): void {
		close.emit();
	}

	/**
	 * 実行ボタン押下可否を返却します.
	 */
	public executable(): boolean {
		return this.propertyGot;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.approveService.getByContentsId(this.content[0].objId, 'publiccancel')
		.subscribe(
			(object: any) => {
				this.forcastStatusTypeId = object.forcastStatusTypeId;
				this.statusMDateLong = object.statusMDateLong;
				this.propertyGot = true;
			},
			(err) => {
				this.errored.emit();
			}
		);
	}
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 公開取消を行います.
	 * @param document 公開取消対象データ
	 */
	private executor (document: any): void {
		this.workflowService.doPublicCancel(document)
		.subscribe(
			(object: any) => {
				this.successData.push(object);
				this.executed.emit(this.successData);
			},
			(err) => {
				this.errored.emit();
			}
		);
	}
}
