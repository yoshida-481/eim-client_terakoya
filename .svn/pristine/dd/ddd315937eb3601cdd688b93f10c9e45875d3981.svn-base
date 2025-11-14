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
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * アクセスセキュリティ変更コンポーネント
 * @example
 *
 *      <eim-access-security-applicable
 *          [content]="content"
 *          [accessSecurity]="accessSecurity"
 *          [entryNameWidth]="entryNameWidth"
 *      </eim-access-security-applicable>
 */
@Component({
    selector: 'eim-access-security-applicable',
    templateUrl: './access-security-applicable.component.html',
    styleUrls: ['./access-security-applicable.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMAccessSecurityApplicableComponent) }],
    standalone: false
})
export class EIMAccessSecurityApplicableComponent implements OnInit, EIMComponent, EIMApplicable {

	/** セキュリティ選択コンポーネント */
	@ViewChild('accessEntry', { static: true }) accessEntry: EIMSecuritySelectorComponent;

	/**
	*    セキュリティ適用対象のワークスペース情報、またはフォルダ情報
	*      content.objId,objTypeIdに値ありの場合、アクセスセキュリティの変更、
	*      content.objId,objTypeIdが未設定、nullの場合はアクセスセキュリティの新規作成
	*/
	@Input() content: any = {};

	/** ダイアログに表示するアクセスセキュリティ情報 */
	@Input() accessSecurity: EIMSecurity;

	/** データグリッド名前欄width値（デフォルト：332） */
	@Input() entryNameWidth = 332;

	/** セキュリティ適用処理完了のイベントエミッタ */
	@Output() applied: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** セキュリティ変更可能かどうか */
	public canApplied = false;

	/** EIMComponent共通プロパティ */
	public disabled = false;

	/** フォーム */
	public securityForm: UntypedFormGroup;

	/** ドキュメント管理で管理しているセキュリティかどうか */
	public isDocumentSecurity = false;

	/** セキュリティ初期値 */
	private security: EIMSecurity = {
		secId : null,
		secName : '',
	}

	/** セキュリティ新規作成判定 */
	private isNewCreate = this.checkNewCreate();

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
		formBuilder: UntypedFormBuilder,
		protected serverConfigService: EIMServerConfigService
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
		// security.secIdに値が設定されている場合、アクセスエントリーを表示する
		if (typeof this.security.secId !== 'undefined' && this.security.secId > 0) {
			this.accessEntry.show(this.security.secId)
			.subscribe(
				(data: any) => {
					this.isError = false;
				}, (err: any) => {
					this.isError = true;
				}
			);
		}
	}

	/**
	 * 適用ボタン押下時の処理を実施します.
	 */
	public apply(): void {
		// セキュティの新規作成
		if (this.isNewCreate) {
			this.applied.emit([this.security]);
		}
	}

	/**
	 * 適用ボタン押下可否を返却します.
	 * @return 適用ボタン押下可否結果
	 */
	public applicable(): boolean {

		if (this.isError || !this.canApplied) {
			return false;
		}

		return this.securityForm.dirty;
	}

	/**
	 * セキュリティ情報を設定します.
	 * @param secId セキュリティID
	 * @param secName セキュリティ名
	 * @param secDefName セキュリティ定義名称
	 */
	public setSecurity(secId: number, secName: string, secDefName: string = null): void {
		this.security.secId = secId;
		this.security.secName = secName;
		this.securityForm.controls['secName'].setValue(this.security.secName);

		// ドキュメント管理外のセキュリティかどうかのフラグを初期化
		this.initIsDocumentSecurity(secDefName);
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

		// ドキュメント管理外のセキュリティかどうかのフラグを初期化
		this.initIsDocumentSecurity(this.accessSecurity?.secDefName ?? null);

		// ダイアログ呼出が新規作成
		if (this.isNewCreate) {
			// 値の初期化
			this.canApplied = true;  // 作成権限に設定
			if (typeof this.accessSecurity !== 'undefined' && this.accessSecurity.secId > 0) {
				// inputのaccessSecurityを設定する
				this.securityForm.controls['secName'].setValue(this.accessSecurity.secName);
				this.security = this.accessSecurity;

				this.show();
			}
		} else {
			// 既存ワークスペース、フォルダのセキュリティ変更の場合、処理なし
		}
	}

	/**
	 * セキュリティ選択ボタンクリック時のイベントハンドラです.
	 * @param event イベント
	 */
	onClickSelectSecurity(event: any): void {
		let selectorId: string = this.dialogManagerComponentService.showSecuritySelector(this.content, true, {
			selected: (security: EIMSecurity[]) => {
				this.dialogManagerComponentService.close(selectorId);
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
	 * ドキュメント管理で管理しているセキュリティかどうかのフラグを初期化します.
	 * 
	 * @param secDefName セキュリティの定義名称
	 */
	private initIsDocumentSecurity(secDefName: string): void {

		// 新規の場合は、ドキュメント管理で管理しているセキュリティと判断する
		if (secDefName === null) {
			this.isDocumentSecurity = true;
			return;
		}

		let isDocumentSecurity = true;
		for (const nameSpaceToExclude of this.serverConfigService.nameSpacesToExclude) {

			if (secDefName.indexOf(nameSpaceToExclude) === 0) {

				isDocumentSecurity = false;
				break;
			}
		}
		this.isDocumentSecurity = isDocumentSecurity;
		
	}
}
