import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { of, Observable } from 'rxjs';

import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMApplicable } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMSecurityService, EIMSecurity, EIMSecurityCommon, EIMEntry } from 'app/documents/shared/services/apis/security.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMSecuritySelectorComponent } from 'app/documents/components/security-selector/security-selector.component';

/**
 * フォルダ構成管理セキュリティ変更コンポーネント
 * @example
 *
 *      <eim-folder-configuration-security-applicable
 *          [content]="content"
 *          [folderSecurity]="folderSecurity"
 *          [entryNameWidth]="entryNameWidth"
 *      </eim-folder-configuration-security-applicable>
 */
@Component({
    selector: 'eim-folder-configuration-security-applicable',
    templateUrl: './folder-configuration-security-applicable.component.html',
    styleUrls: ['./folder-configuration-security-applicable.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFolderConfigurationSecurityApplicableComponent) }],
    standalone: false
})
export class EIMFolderConfigurationSecurityApplicableComponent implements OnInit, EIMComponent, EIMApplicable {

	/**セキュリティ選択コンポーネント */
	@ViewChild('accessEntry', { static: true }) accessEntry: EIMSecuritySelectorComponent;
	/**
	* セキュリティ適用対象のワークスペース情報、またはフォルダ情報
	*   content.objIdに値ありの場合、フォルダ構成管理セキュリティの変更、
	*	  contentが未設定の場合はフォルダ構成管理セキュリティの新規作成
	*/
	@Input() content: any = {};

	/** セキュリティ適用対象のワークスペース情報、またはフォルダ情報 */
	@Input() folderSecurity: EIMSecurity;

	/** データグリッド名前欄width値（デフォルト：332） */
	@Input() entryNameWidth = 332;

	/** セキュリティ適用処理完了のイベントエミッタ */
	@Output() applied: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** セキュリティ変更可能かどうか */
	public canApplied = false;

	/** フォーム */
	public securityForm: UntypedFormGroup;

	/** セキュリティ初期値 */
	private security: EIMSecurity = {
		secId : null,
		secName : '',
	}

	/** EIMComponent共通プロパティ */
	public disabled = false;

	/** セキュリティ制限 */
	public isLimitSecurity = false;  // 初期値：制限しない

	/** 画面表示時のセキュリティ制限 */
	public isCheckedSecurity = false; // 表示時：制限しない

	/** 選択対象がワークスペースであるか */
	public isWorkSpace = true;  // 初期値はワークスペース

	/** 上位ワークスペース、フォルダのセキュリティ制限 */
	public isParentLimit = false;

	/** 検索ボタン活性／非活性フラグ */
	public isDisabledSearchBtn = true; // 初期値：非活性

	/** 制限ボタン活性／非活性フラグ  */
	public isDisabledLimitBtn = true; // 初期値：非活性

	/** フォルダアクセスエントリー初期表示フラグ */
	public isShowAccessEntry = null;

	/** エラー状態 */
	private isError = false;

	/** セキュリティ新規作成判定 */
	private isNewCreate = this.checkNewCreate();

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected securityService: EIMSecurityService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected messageService: EIMMessageService,
		formBuilder: UntypedFormBuilder
	) {
		// フォーム
		this.securityForm = formBuilder.group({
			'secName': new UntypedFormControl({value: null, disabled: true})
		});
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * アクセスエントリー画面を表示します
	 */
	public show(): void {
		// ボタン活性化切替
		this.isDisabledSearchBtn = this.isDisabledSearchButton();
		this.isDisabledLimitBtn = this.isDisabledLimitButton();

		// secIdに値がある場合、アクセスエントリーを表示する
		if (this.isLimitSecurity && typeof this.security.secId !== 'undefined' && this.security.secId > 0) {
			this.accessEntry.show(this.security.secId)
			.subscribe(
				(data: any) => {
					this.isError = false;
				}, (err: any) => {
					this.isError = true;
			});
		}
	}

	/**
	 * 適用ボタン押下時の処理を実施します.
	 */
	public apply(): void {
		// セキュティの新規作成
		if (this.isNewCreate) {
			// 適用ボタン押下完了イベント
			if (this.isLimitSecurity) {
				// 制限する場合、処理なし
			} else {
				// 制限しない場合、secId、nameを初期値に設定
				this.security.secId = null;
				this.security.secName = '';
			}
			this.applied.emit([this.security]);
		}
	}

	/**
	 * 適用ボタン押下可否を返却します.
	 * @return 適用ボタン押下可否結果
	 */
	public applicable(): boolean {
		// エラー発生、権限なしの場合は押下不可
		if (this.isError || !this.canApplied) {
			return false;
		}

		// フォルダ構成管理制限「する」場合
		if (this.isLimitSecurity) {
			// ワークスペースの場合
			if (this.isWorkSpace) {
				return this.securityForm.dirty;
			} else {
			// フォルダの場合
				return !this.isCheckedSecurity;
			}
		} else {
			// フォルダ構成管理制限「しない」場合
			if (this.isCheckedSecurity) {
				return true;
			}
		}
		// 上記以外の場合、押下不可
		return false;
	}

	/**
	 * セキュリティ情報を設定します.
	 * @param secId セキュリティID
	 * @param secName セキュリティ名
	 */
	 public setSecurity(secId: number, secName: string): void {
		this.security.secId = secId;
		this.security.secName = secName;
		this.securityForm.controls['secName'].setValue(this.security.secName);
	}

	/**
	 * セキュリティを返却します.
	 * @return セキュリティ情報
	 */
	public getSecurity(): EIMSecurity {
		return this.security;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// ダイアログ呼出が新規作成
		if (this.isNewCreate) {
			// 値の初期化
			// securityの設定
			if (typeof this.folderSecurity !== 'undefined' && this.folderSecurity.secId > 0) {
				// secIdに値がある場合、設定する
				this.securityForm.controls['secName'].setValue(this.folderSecurity.secName);
				this.security = this.folderSecurity;
			}
				// 制限ラジオボタンの設定
			if (typeof this.security.secId !== 'undefined' && this.security.secId > 0) {
				// security.secId値ありの場合、制限ラジオボタン「制限する」
				this.isLimitSecurity = true;
				this.isCheckedSecurity = true;
			}
			this.canApplied = true;  // 作成権限に設定
			this.show();
		} else {
				// 既存ワークスペース、フォルダのセキュリティ変更の場合、処理なし
		}
	}

	/**
	 * ラジオボタン押下の処理
	 * @param event イベント
	 */
	onRadioButtonChange(event: any): void {

		const keyCode: number = event.keyCode;
		// Endキー、Homeキー、←↑→↓キーでのラジオボタン間選択移動を禁止する
		if (35 <= keyCode && keyCode <= 40) {
			event.preventDefault();
			event.stopPropagation();
		}
		// 対象がフォルダ、かつ、制限する場合
		if (!this.isWorkSpace && this.isLimitSecurity) {
			if (this.isShowAccessEntry) {
				this.isShowAccessEntry = false;
				this.show();
			}
		}
		// ボタン活性化切替
		this.isDisabledSearchBtn = this.isDisabledSearchButton();
		this.isDisabledLimitBtn = this.isDisabledLimitButton();
	}

	/**
	 * セキュリティ選択ボタンクリック時のイベントハンドラです.
	 * @param event イベント
	 */
	onClickSelectSecurity(event: any): void {
		const selectorId: string = this.dialogManagerComponentService.showSecuritySelector(this.content, true,
		{
			selected: (security: EIMSecurity[]) => {
				this.dialogManagerComponentService.close(selectorId);
				// secIdの変更チェック
				if (this.security.secId === security[0].secId) {
					return;
				}
				// 変更時に値を更新する
				this.securityForm.markAsDirty();
				this.securityForm.controls['secName'].setValue(security[0].secName);
				this.security = security[0];
				// 表示を更新する
				this.show();
			}
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * セキュリティの新規作成、既存セキュリティの変更かを判定
	 * @return セキュリティ新規／既存作成判定結果
	 */
	private checkNewCreate(): boolean {
		if (typeof this.content === 'undefined' || typeof this.content.objId === 'undefined'
			|| typeof this.content.objTypeId === 'undefined') {
			return true; // セキュリティの新規作成
		}
		return false; // セキュリティの変更
	}
	/**
	 * 制限ラジオボタンの非活性判定
	 * @return 非活性判定結果
	 */
	private isDisabledLimitButton(): boolean {
		if (this.isWorkSpace) {
			// 対象がワークスペースの場合
			return !this.canApplied;
		} else {
			// 対象がフォルダの場合
			return (!this.canApplied || !this.isParentLimit);
		}
	}
	/**
	 * 検索ボタンの非活性判定
	 * @return 非活性判定結果
	 */
	private isDisabledSearchButton(): boolean {
		if (this.isWorkSpace) {
			// 対象がワークスペースの場合
			return !(this.isLimitSecurity && this.canApplied);
		} else {
			// 対象がフォルダの場合
			return true;
		}
	}
}
