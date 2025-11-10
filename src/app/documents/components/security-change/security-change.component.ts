import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { of, Observable } from 'rxjs';

import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMApplicable } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMSecurityService, EIMSecurity, EIMSecurityCommon, EIMEntry } from 'app/documents/shared/services/apis/security.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';

import { EIMAccessSecurityApplicableComponent } from 'app/documents/components/access-security-applicable/access-security-applicable.component';
import { EIMFolderConfigurationSecurityApplicableComponent } from 'app/documents/components/folder-configuration-security-applicable/folder-configuration-security-applicable.component';

/**
 * ワークスペースフォルダセキュリティ変更コンポーネント
 * @example
 *
 *      <eim-security-change
 *          [content]="content"
 *      </eim-security-change>
 */
@Component({
    selector: 'eim-security-change',
    templateUrl: './security-change.component.html',
    styleUrls: ['./security-change.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMSecurityChangeComponent) }],
    standalone: false
})
export class EIMSecurityChangeComponent implements OnInit, EIMComponent, EIMApplicable {

	/** アクセスセキュリティ変更コンポーネント */
	@ViewChild('accessSecurityApplicable', { static: true }) accessSecurityApplicable: EIMAccessSecurityApplicableComponent;

	/** フォルダ構成管理セキュリティ変更コンポーネント */
	@ViewChild('folderConfigurationSecurityApplicable', { static: true }) folderConfigurationSecurityApplicable:
		EIMFolderConfigurationSecurityApplicableComponent;

	/** セキュリティ適用対象のワークスペース情報、またはフォルダ情報 */
	@Input() content: any = {};

	/** セキュリティ適用処理完了のイベントエミッタ */
	@Output() applied: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** セキュリティ変更可能かどうか */
	public canApplied = false;

	/** 選択対象がワークスペースかフォルダか */
	public selectContentType = '';

	/** 選択対象の名称 */
	public selectContentName = '';

	/** フォーム */
	public securityForm: UntypedFormGroup;

	/** セキュリティ */
	public security: any = {};

	/** EIMComponent共通プロパティ */
	public disabled = false;

	/** データグリッド名前欄width値 */
	public entryNameWidth = 314;

	/** エラー状態 */
	private isError = false;

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
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します
	 */
	public show(): void {
		// tab1 : アクセスセキュリティ変更画面
		this.accessSecurityApplicable.show();
		// tab2 : フォルダ構成管理セキュリティ変更画面
		this.folderConfigurationSecurityApplicable.show();
	}

	/**
	 * 適用ボタン押下時の処理を実施します.
	 * ワークスペース、またはフォルダに選択したセキュリティを適用します.
	 */
	public apply(): void {
		let isNotApplyUnderFolder: boolean = false;
		let massage = this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00037', {value: '[' + this.selectContentName + ']' + this.selectContentType});
		this.messageService.showCheckBox(EIMMessageType.confirm, massage,
			this.translateService.instant('EIM_DOCUMENTS.LABEL_02224'),
			(v: boolean) => {
				if(v) isNotApplyUnderFolder = true
			},
			() => {
				// 更新情報設定
				let objId = this.content.objId; // 変更対象のオブジェクトID
				let secId = this.accessSecurityApplicable.getSecurity().secId; // アクセスセキュリティID
				let checkedThisLowerSuccession = null; // フォルダ構成管理制限
				let lowerSuccessionSecId = null; // フォルダセキュリティID

				// 対象がワークスペース、または、フォルダ、かつ、上位フォルダのフォルダ構成管理制限「する」場合
				if (this.folderConfigurationSecurityApplicable.isWorkSpace
					|| (!this.folderConfigurationSecurityApplicable.isWorkSpace && this.folderConfigurationSecurityApplicable.isParentLimit)) {
					checkedThisLowerSuccession = this.folderConfigurationSecurityApplicable.isLimitSecurity;
					// 変更後のフォルダ構成管理制限「する」場合
					if (this.folderConfigurationSecurityApplicable.isLimitSecurity) {
						lowerSuccessionSecId = this.folderConfigurationSecurityApplicable.getSecurity().secId;
					}
				}
				// セキュリティ更新処理
				this.securityService.applySecurity(objId, secId, checkedThisLowerSuccession, lowerSuccessionSecId, isNotApplyUnderFolder).subscribe(
					(object: any) => {
						// メッセージを表示
						this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00001'));
						// 適用ボタン押下完了イベントを通知(画面が閉じる)
						this.applied.emit([this.content.objId]);
				});
			}
		);
	}

	/**
	 * 適用ボタン押下可否を返却します.
	 * @return 適用ボタン押下可否結果
	 */
	public applicable(): boolean {
		// エラーあり、または、作成権限なしの場合、押下不可
		if (this.isError || !this.canApplied) {
			return false;
		}
		// アクセスセキュリティが未入力の場合、押下不可
		if (this.accessSecurityApplicable.securityForm.value === '') {
			return false;
		}
		// アクセスセキュリティ選択済み、または、フォルダ構成管理セキュリティ適用可能
		if (this.accessSecurityApplicable.applicable() || this.folderConfigurationSecurityApplicable.applicable()) {
			return true;
		}
		// 上記以外の場合、適用ボタン押下不可
		return false;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// 選択対象がフォルダかワークスペースか判定
		if (this.content.objTypeName === 'ワークスペース') {
			this.selectContentType = this.translateService.instant('EIM_DOCUMENTS.LABEL_03061');
		} else {
			this.selectContentType = this.translateService.instant('EIM_DOCUMENTS.LABEL_02027');
		}
		// 選択対象フォルダ名
		if (this.content.data == null ) {
			this.selectContentName = this.content.objName;
		} else {
			this.selectContentName = this.content.data.objName;
		}

		// 表示セキュリティ画面を設定
		this.securityService.getSecurityCommonProperty(this.content.objId)
			.subscribe((securityCommon: EIMSecurityCommon) => {

				// セキュリティを設定する
				this.security = securityCommon;
				this.canApplied = securityCommon.updateRole;

				// アクセスセキュリティの設定
				this.accessSecurityApplicable.setSecurity(securityCommon.secId, securityCommon.secName, securityCommon.secDefName);
				this.accessSecurityApplicable.canApplied = securityCommon.updateRole;

				// フォルダ構成管理セキュリティの設定
				this.folderConfigurationSecurityApplicable.canApplied = securityCommon.updateRole;
				this.folderConfigurationSecurityApplicable.isLimitSecurity = securityCommon.checkedThisLowerSuccession;
				this.folderConfigurationSecurityApplicable.isCheckedSecurity = securityCommon.checkedThisLowerSuccession;
				this.folderConfigurationSecurityApplicable.isParentLimit = securityCommon.checkedParentLowerSuccession;
				this.folderConfigurationSecurityApplicable.isWorkSpace = securityCommon.isWorkSpace;
				// フォルダ構成管理制限「する」場合、または、対象がフォルダの場合
				if (securityCommon.checkedThisLowerSuccession || !securityCommon.isWorkSpace) {
					this.folderConfigurationSecurityApplicable.setSecurity(securityCommon.lowerSuccessionSecId, securityCommon.lowerSuccessionSecName);
				}
				// 対象がフォルダの場合
				if (!securityCommon.isWorkSpace) {
					this.folderConfigurationSecurityApplicable.isShowAccessEntry = !securityCommon.checkedThisLowerSuccession;
				}

				this.show();

			}, (err: any) => {
				// エラーの場合、画面を閉じる
				this.isError = true;
				window.setTimeout( () => {
					this.errored.emit();
			});
		});
	}
}
