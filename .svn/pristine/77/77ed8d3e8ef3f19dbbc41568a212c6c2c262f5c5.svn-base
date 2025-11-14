import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { EIMComponent, EIMApplicable } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAdminSecuritySelectorComponent } from 'app/admins/components/admin-security-selector/admin-security-selector.component';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMSecurityDTO } from 'app/admins/shared/dtos/security.dto';

/**
 * セキュリティ変更コンポーネント(システム管理側)
 * @example
 *
 *      <eim-admin-security-applicant
 *          [adminAppId]="adminAppId"
 *          [accessSecurity]="accessSecurity"
 *          [entryNameWidth]="entryNameWidth"
 *      </eim-admin-security-applicant>
 */
@Component({
  selector: 'eim-admin-security-applicant',
  templateUrl: './admin-security-applicant.component.html',
  styleUrls: ['./admin-security-applicant.component.css'],
  providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMAdminSecurityApplicantComponent)}],
  standalone: false,
})
export class EIMAdminSecurityApplicantComponent implements OnInit, EIMComponent, EIMApplicable {

	/** 共通セキュリティ選択コンポーネント */
	@ViewChild('accessEntry', { static: true }) public accessEntry: EIMAdminSecuritySelectorComponent;

	/** システム管理区分 */
	@Input() public adminAppId: string;

	/** アクセスセキュリティ情報 */
	@Input() public accessSecurity: any;

	/** データグリッド名前欄width値（デフォルト：340） */
	@Input() public entryNameWidth = 340;

	/** セキュリティ適用処理完了のイベントエミッタ */
	@Output() public applied: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** EIMComponent共通プロパティ */
	public disabled = false;

	/** フォーム */
	public securityForm: FormGroup;

	/** セキュリティ初期値 */
	public security = {
		secId : null,
		secName : '',
	}

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected adminsSecurityService: EIMAdminsSecurityService,
		formBuilder: FormBuilder
	) {
		// フォーム
		this.securityForm = formBuilder.group({
			'secName': new FormControl({value: null, disabled: true})
		});
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * アクセスエントリー画面を表示します
	 */
	public show(): void {
		// security.secIdに値が設定されている場合、アクセスエントリーを表示する
		if (typeof this.security.secId !== 'undefined' && this.security.secId > 0) {
			this.accessEntry.show(this.security.secId, this.adminAppId);
		}
	}


	/**
	 * 適用ボタン押下時の処理を実施します.
	 */
	public apply(): void {
		this.applied.emit([this.security]);
	}


	/**
	 * 適用ボタン押下可否を返却します.
	 * @return 適用ボタン押下可否結果
	 */
	public applicable(): boolean {
		return this.securityForm.dirty && !this.accessEntry.isSelectedError;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
			// 値の初期化
			if (!this.accessSecurity) {
				// 画面を閉じる
				window.setTimeout(() => {
					this.errored.emit();
				});
			} else {
				// アクセス権限を取得
				if (this.accessSecurity.secId > 0) {
					this.securityForm.controls['secName'].setValue(this.accessSecurity.secName);
					this.security = this.accessSecurity;
					this.show();
				}
			}

	}


	/**
	 * セキュリティ選択ボタン押下時のイベントハンドラです.
	 * @param event イベント
	 */
	onShowAdminSecuritySelector(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showAdminSecuritySelector(this.adminAppId, true, {
			selected: (security: EIMSecurityDTO[]) => {
				// 親画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);

				if (this.security.secId === security[0].secId) {
					return;
				}
				this.securityForm.markAsDirty();
				this.securityForm.controls['secName'].setValue(security[0].secName);
				this.security = security[0];

				// 表示を更新する
				this.show();
			}
		});
	}

}
