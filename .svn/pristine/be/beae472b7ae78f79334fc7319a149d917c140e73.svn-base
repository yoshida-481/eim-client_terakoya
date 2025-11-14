import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output,ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';

/** 画面状態定数 */
export namespace stateConst {
	export const EDITING = 'editing';
	export const CREATING = 'creating';
	export const COMPLETE = 'complete';
}

/**
 * 公開PDF事前設定コンポーネント
 * @example
 *
 *  <eim-public-file-pre-setter
 *    [content]="content">
 *  </eim-public-file-pre-setter>
 */
@Component({
    selector: 'eim-public-file-pre-setter',
    templateUrl: './public-file-pre-setter.component.html',
    styleUrls: ['./public-file-pre-setter.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMPublicFilePreSetterComponent) }],
    standalone: false
})
export class EIMPublicFilePreSetterComponent implements OnInit, EIMExecutable {

	/** 対象のオブジェクト */
	@Input() content: any;

	/** 名前 */
	@Input() name: string;

	/** ファイル */
	@Input() file: string;

	/** 作成完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** アップローダ */
	public uploader: FileUploader = new FileUploader({url:""});

	@ViewChild("dummyID") 
	myInputVariable: ElementRef;

	/** 状態 */
	public STATE = stateConst;
	public state = stateConst.EDITING;

	/** インポート対象拡張子リスト */
	private readonly TARGET_EXTENSION = ['pdf', 'PDF'];

	private isExecutable: boolean = false;
	/**
	 * コンストラクタです.
	 */
	constructor(
		private translateService: TranslateService,
		private documentFormService: EIMDocumentFormService,
		private messageService: EIMMessageService,
		) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 公開PDFの事前設定を実行します.
	 */
	public execute(): void {
		if (this.uploader.queue.length === 0) {
			if (this.content.isDspPdfIcon === true || this.content.isDspPdfIcon === 'true') {
				this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00041'),
					() => {
						// 事前登録した公開PDFの削除
						this.documentFormService.preRegistPublicFileDelete(this.content.objId).subscribe(
							(data: any) => {
								this.state = this.STATE.COMPLETE;
								this.executed.emit([{objId: this.content.objId}]);
							},
							(err: any) => {
								this.state = this.STATE.EDITING;
								this.errored.emit();
							});
					}
				);
			} else {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00129'));
				return;
			}
		} else {
			let fileItem: FileItem = this.uploader.queue[0];
			// 公開PDFの事前登録
			this.state = this.STATE.CREATING;

			// リクエストパラメータを設定
			let additionalParameter: any = {
					objId: this.content.objId
			};

			// 実行
			if (this.content.isDspPdfIcon === true || this.content.isDspPdfIcon === 'true') {
				this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00040'),
					() => {
						this.documentFormService.publicFilePreRegister(this.uploader, fileItem, additionalParameter).subscribe(
							(data: any) => {
								this.state = this.STATE.COMPLETE;
								this.executed.emit([{objId: this.content.objId}]);
							},
							(err: any) => {
								this.state = this.STATE.EDITING;
								this.errored.emit();
							});
					}
				);
			} else {
				this.documentFormService.publicFilePreRegister(this.uploader, fileItem, additionalParameter).subscribe(
					(data: any) => {
						this.state = this.STATE.COMPLETE;
						this.executed.emit([{objId: this.content.objId}]);
					},
					(err: any) => {
						this.state = this.STATE.EDITING;
						this.errored.emit();
					});
			}
		}
	}

	/**
	 * 差換え実行可否を返却します.
	 * @return 実行可否
	 */
	public executable(): boolean {
		if (this.isExecutable) {
			return true;
		}
		return false;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event: any, close: EventEmitter<null>): void {
		event.preventDefault();

		if (this.executable()) {
			// 破棄確認ダイアログ
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
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// 原本ファイル名
		this.name = this.content.objName;

		if (this.content.isDspPdfIcon === true || this.content.isDspPdfIcon === 'true') {
			// 公開PDF事前登録あり
			this.file = this.content.publicFileName;
		}

		// ファイル追加イベントハンドラ設定
		this.uploader.onAfterAddingAll = (fileItems: FileItem[]) => {
			this.onAddFiles(fileItems);
		};
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		this.uploader.clearQueue();
		this.uploader.cancelAll();
		this.uploader = null;
	}

	/**
	 * ファイル追加イベントハンドラ
	 * @param fileItems 追加するファイル配列
	 */
	onAddFiles(fileItems: FileItem[]): void {
		if (!fileItems || fileItems.length === 0) {
			return;
		}

		let fileName = fileItems[0].file.name;
		let extension = '';
		extension = fileName.split('.').pop();
		if (this.TARGET_EXTENSION.indexOf(extension) === -1) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00014'));
			if (this.uploader.queue.length === 2) {
				this.uploader.removeFromQueue(this.uploader.queue[1]);
			} else {
				this.uploader.removeFromQueue(this.uploader.queue[0]);
			}
			return;
		}

		if (this.uploader.queue.length > 1) {
			this.uploader.removeFromQueue(this.uploader.queue[0]);
		}
		this.file = fileName;
		this.isExecutable = true;
	}

	/**
	 * 選択ファイルのクリア.
	 */
	 public onClickDelete(): void {
		// 選択ファイルクリア
		this.file = '';
		if (this.uploader.queue.length > 0) {
			this.uploader.queue.pop();
			this.myInputVariable.nativeElement.value = "";
		}
		this.isExecutable = true;
	}

}
