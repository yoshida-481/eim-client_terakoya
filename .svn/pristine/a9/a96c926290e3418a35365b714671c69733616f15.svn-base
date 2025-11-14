import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMUserService } from 'app/admins/shared/services/apis/user.service';
import { EIMAdminDialogManagerComponentService, dialogName } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';

/** 画面状態定数 */
export namespace stateConst {
	export const EDITING = 'editing';
	export const CREATING = 'creating';
	export const COMPLETE = 'complete';
}

/**
 * ユーザインポートコンポーネント
 * @example
 *
 *      <eim-user-import-executor
 *          [adminAppId]="adminAppId">
 *      </eim-user-import-executor>
 */
@Component({
    selector: 'eim-user-import-executor',
    templateUrl: './user-import-executor.component.html',
    styleUrls: ['./user-import-executor.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMUserImportExecutorComponent) }
    ],
    standalone: false
})

export class EIMUserImportExecutorComponent implements OnInit, OnDestroy, EIMExecutable {
	/** ユーザインポートフォーム */
	@ViewChild('userImportExecutorForm', { static: true }) userImportExecutorForm: NgForm;

	/** 親オブジェクトID */
	@Input() parentObjId: number;

	/** 対象のオブジェクト */
	@Input() content: any;

	/** ファイルアップローダ */
	public uploader: FileUploader = new FileUploader({ url: "" });

	/** 状態 */
	public STATE = stateConst;
	public state = stateConst.EDITING;

	/** ファイル */
	@Input() file: string;

	/** 作成完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** インポート対象拡張子リスト */
	private readonly TARGET_EXTENSION = ['.xlsx', '.XLSX'];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected adminEntryService: EIMAdminsEntryService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected messageService: EIMMessageService,
			protected userService: EIMUserService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ユーザをインポートします.
	 */
	public execute(): void {
		// ユーザをインポートします．
		let fileItem: FileItem = this.uploader.queue[0];

		this.state = this.STATE.CREATING;

		// リクエストパラメータを設定
		let additionalParameter: any = {
				parentObjId: this.parentObjId,
				fileName: fileItem.file.name,
		};

		// ファイルアップロード実行
		this.userService.upload(this.uploader, fileItem, ).subscribe(
			(data: any) => {
				let filePath = data.value.result.attr.data;
				// インポート実行
 				this.userService.importUserData(filePath).subscribe(
					 (importData: any) => {
						if (importData.value && importData.value.message !== '') {
							// エラーメッセージの表示
							this.adminDialogManagerComponentService.showUserImportFailed(importData.value.message);
						} else {
							// 完了メッセージの表示
							this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_ADMINS.INFO_00007'));
							// 画面を閉じる
							this.executed.emit(importData);
							this.adminDialogManagerComponentService.close(dialogName.USER_IMPORT_EXECUTOR);
						}
					},
					(err: any) => {
						// エラーメッセージの表示
						this.adminDialogManagerComponentService.showUserImportFailed(this.translateService.instant('EIM_ADMINS.ERROR_00021'));
					}
				);
			},
			(err: any) => {
				// エラーメッセージの表示
				this.adminDialogManagerComponentService.showUserImportFailed(this.translateService.instant('EIM_ADMINS.ERROR_00021'));
			}
		);
	}


	/**
	 * ユーザインポート可否を返却します.
	 * @return ユーザインポート可否
	 */
	public executable(): boolean {
		if (0 < this.uploader.queue.length) {
			return true;
		}
		return false;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
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

	 * ダイアログを閉じます.
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event: any, close: EventEmitter<null>): void {
		event.preventDefault();
		close.emit();
	}

	/**
	 * ファイル追加イベントハンドラ
	 * @param fileItems 追加するファイル配列
	 */
	onAddFiles(fileItems: FileItem[]): void {
		if (fileItems.length === 0) {
			return;
		}

		let fileName = fileItems[0].file.name;

		// ファイル名が5桁未満の場合
		if (fileName.length < 5) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00014'));
			if (this.uploader.queue.length === 2) {
				this.uploader.removeFromQueue(this.uploader.queue[1]);
			} else {
				this.uploader.removeFromQueue(this.uploader.queue[0]);
			}
			return;
		}

		let etension = '';
		etension = fileName.substring(fileName.length - 5, fileName.length)
		if (this.TARGET_EXTENSION.indexOf(etension) === -1) {
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


		this.file = fileItems[0].file.name;
	}
}
