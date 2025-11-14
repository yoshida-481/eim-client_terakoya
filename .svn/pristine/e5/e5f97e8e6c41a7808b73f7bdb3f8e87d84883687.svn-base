import { Component, forwardRef, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMUserService } from 'app/admins/shared/services/apis/user.service';
import { EIMAdminDialogManagerComponentService, dialogName } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * ユーザ一覧エクスポートコンポーネント
 * @example
 *
 *      <eim-user-export-executor
 *          [nameList]="nameList"
 *          [revup]="revup"
 *          [mutual]="mutual">
 *      </eim-user-export-executor>
 */
@Component({
    selector: 'eim-user-export-executor',
    templateUrl: './user-export-executor.component.html',
    styleUrls: ['./user-export-executor.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMUserExportExecutorComponent) }
    ],
    standalone: false
})

export class EIMUserExportExecutorComponent implements EIMExecutable {
	/** ユーザ一覧エクスポートフォーム */
	@ViewChild('userExportExecutorForm', { static: true }) userExportExecutorForm: NgForm;

	/** 検索条件「名前」 */
	@Input() userName = '';

	/** 検索条件「ID」 */
	@Input() userCode = '';

	/** 検索条件「Mail」 */
	@Input() userMail = '';

	/** 検索条件「グループ名」 */
	@Input() belongingGroupName = '';

	/** 検索条件「下位のグループを含む」 */
	@Input() includingChildGroup = true;

	/** 検索条件「無効フラグ」 */
	@Input() dispFlag = 2;


	/** 作成完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected adminEntryService: EIMAdminsEntryService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected userService: EIMUserService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,

	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ユーザ一覧をエクスポートします.
	 */
	public execute(): void {
		let isNotDisplayInvalidityUser = 0;
		let isNotDisplayValidityUser = 0;

		if (Number(this.dispFlag) === 0) {
			// 無効フラグ：OFF の場合
			isNotDisplayInvalidityUser = 1;
		} else if (Number(this.dispFlag) === 1) {
			// 無効フラグ：ON の場合
			isNotDisplayValidityUser = 1;
		} else {
			// 無効フラグ：両方 の場合
		}

		// エクスポートの検索条件をチェックします．
		this.userService.checkExportInfo(this.userName, this.userCode, this.userMail, this.belongingGroupName, this.includingChildGroup, isNotDisplayInvalidityUser, isNotDisplayValidityUser, 'TRUE').subscribe(
			(data: any) => {
				// ユーザをエクスポート
				this.userService.exportUserData(this.userName, this.userCode, this.userMail, this.belongingGroupName, this.includingChildGroup, isNotDisplayInvalidityUser, isNotDisplayValidityUser, 'TRUE');

				// 画面を閉じる
				this.adminDialogManagerComponentService.close(dialogName.USER_EXPORT_EXECUTOR);

			},
			(err: any) => {
				this.errored.emit(err);
			}
		);
	}

	/**
	 * ユーザエクスポート可否を返却します.
	 * @return ユーザエクスポート可否
	 */
	public executable(): boolean {
		return true;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
}
