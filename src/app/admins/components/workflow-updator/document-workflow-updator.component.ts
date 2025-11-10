import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMPDFElectronicSignatureApplicableComponent } from 'app/documents/components/pdf-electronic-signature-applicable/pdf-electronic-signature-applicable.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMPublicFileSecurityExecutorComponent } from 'app/documents/components/public-file-security-executor/public-file-security-executor.component';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';
import { EIMPublicFileSecurityDomain } from 'app/documents/shared/domains/public-file-security.domain';

export namespace viewNameNamespace {
	// ワークフロー作成部
	export const BASIC = 'BASIC';
	// ステータス構成部
	export const STATUS_TYPE = 'STATUS_TYPE';
	// スキップイベント構成部
	export const SKIP = 'SKIP';
}

/**
 * ドキュメント用ワークフロー更新コンポーネント
 * @example
 *
 *		<eim-document-workflow-updator
 *			[workflow]="workflow">
 *		</eim-document-workflow-updator>
 */
@Component({
    selector: 'eim-document-workflow-updator',
    templateUrl: '../workflow-creator/document-workflow-creator.component.html',
    styleUrls: ['../workflow-creator/workflow-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentWorkflowUpdatorComponent) }
    ],
    standalone: false
})

export class EIMDocumentWorkflowUpdatorComponent implements OnInit, AfterViewInit, EIMUpdatable {
	/** ワークフローフォーム */
	@ViewChild('workflowCreatorForm', { static: true }) workflowCreatorForm: NgForm;

	/** 電子署名設定情報 */
	@ViewChild('pdfElectronicSignatureApplicable')
	pdfElectronicSignatureApplicable: EIMPDFElectronicSignatureApplicableComponent;

	/** 公開通知先エントリーデータグリッド */
	@ViewChild('publishNotifyEntryDataGrid') publishNotifyEntryDataGrid: EIMDataGridComponent;

	/** 公開ファイルセキュリティ設定コンポーネント */
	@ViewChild('publicFileSecurityUpdater') publicFileSecurityUpdater: EIMPublicFileSecurityExecutorComponent;

	/** ワークフロー情報 */
	@Input() public workflow: EIMWorkflowDomain;

	/** 更新完了時のイベントエミッタ */
	@Output() public updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** モード */
	public mode = 'updator';

	/** view 使用設定 */
	public useViewConf = {
		basic: true,
		statusType: false,
		skip: false
	}

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 有効期限設定入力最大数 */
	public inputYuukouMaxLength: number = EIMConstantService.INPUT_YUUKOU_MAX_LENGTH;

	/** 正規表現：有効期限設定 */
	public insertionYuukou: string = EIMConstantService.REGULAR_EXPRESSION_NUMBER_ONLY;

	/** 使用可能言語リスト */
	public languages: any[];

	/** セキュリティ設定要否 */
	public securitySetting = {doSetSecurity: false};

	/** 公開通知先エントリーデータグリッドのメニュー */
	public publishNotifyEntryDataGridMenuItems: EIMMenuItem[] = [
		{
			label: this.translateService.instant('EIM.LABEL_03006'), name: 'showEntrySelector', icon: 'fa fa-check', disabled: false, command: ($event) => { this.showEntrySelector() }
		},
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteSelectedEntry', icon: 'eim-icon-trash', disabled: true, command: ($event) => { this.deleteSelectedEntry() }
		},
	];

	/** エントリーのコンテキストメニュー */
	public publishNotifyEntryContentsMenuItems: EIMMenuItem[] = [
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteSelectedEntry', icon: 'eim-icon-trash', disabled: true, command: (event) => { this.deleteSelectedEntry(); }
		},
	];

	/** ビュー名称定義 */
	public viewName = viewNameNamespace;

	/** 選択中のビュー名称 */
	public selectedViewName = this.viewName.BASIC;

	/** ステータスタイプデータグリッドのメニュー */
	public statusTypeDataGridMenuItems: EIMMenuItem[] = [
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_02042'), icon: 'eim-icon-plus',
			command: ($event) => { }
		},
		{
			label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil',
			command: ($event) => { }
		},
		{
			label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash',
			command: ($event) => { }
		},
	];

	/** スキップイベントデータグリッドのメニュー */
	public skipEventDataGridMenuItems: EIMMenuItem[] = [
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_02042'), icon: 'eim-icon-plus',
			command: ($event) => { }
		},
		{
			label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash',
			command: ($event) => { }
		},
	];


	/** 行背景色 */
	public disableRowStyle = {background: '#ddd'};

	/** 承認通過選択リスト */
	public approveThroughTerm: SelectItem[] = [
		{ label: this.translateService.instant('EIM_ADMINS.LABEL_02116'), value: EIMConstantService.APPROVE_THROUGH_ONE },
		{ label: this.translateService.instant('EIM_ADMINS.LABEL_02117'), value: EIMConstantService.APPROVE_THROUGH_ALL }
	];

	/** 通過条件 */
	public inputApproveThroughTerm = '0';

	/** 遷移元一覧 */
	public fromStatusTypes: SelectItem[]= [];

	/** 遷移先一覧 */
	public toStatusTypes: SelectItem[]= [];

	/** 遷移元 */
	public inputFromStatusTypes = '';

	/** 遷移先 */
	public inputToStatusTypes = '';

	/** 有効期限単位の一覧 */
	public termUnitList: SelectItem[] =
		[
			{ label: this.translateService.instant('EIM_ADMINS.LABEL_02249'), value: 'days' },
			{ label: this.translateService.instant('EIM_ADMINS.LABEL_02250'), value: 'months' },
			{ label: this.translateService.instant('EIM_ADMINS.LABEL_02251'), value: 'years' },
		];

	/** 編集フラグ */
	public editFlg = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected workflowService: EIMAdminsWorkflowService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected messageService: EIMMessageService,
		protected serverConfigService: EIMServerConfigService,
		protected entryService: EIMDocumentsEntryService,
	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ワークフローを更新します.
	 */
	public update(): void {

		// 電子署名設定情報取得
		let pdfOutputDomain: EIMPDFOutputDomain;

		let digitalSignatureFlg = this.serverConfigService.digitalSignatureFlg;
		if (digitalSignatureFlg) {
			pdfOutputDomain = this.pdfElectronicSignatureApplicable.getInputedData();
			this.workflow.publishSettingInfo.doSignPDFAndSetSecurity = pdfOutputDomain.doSignPDF;
		}
		// セキュリティ設定情報取得
		let pdfOutputConf = this.serverConfigService.pdfOutputConf;
		let publicFileSecurityDomain: EIMPublicFileSecurityDomain;
		if (pdfOutputConf) {
			publicFileSecurityDomain = this.publicFileSecurityUpdater.getInputedData();
			this.workflow.publishSettingInfo.doSignPDFAndSetSecurity = this.workflow.publishSettingInfo.doSignPDFAndSetSecurity || this.workflow.publishSettingInfo.doSetSecurity;
		}
		// 電子署名設定
		if ( pdfOutputDomain ) {
			this.workflow.publishSettingInfo.doSignPDF = pdfOutputDomain.doSignPDF; // 電子署名設定　する／しない
			this.workflow.publishSettingInfo.insertApproveDate = pdfOutputDomain.insertApproveDate; // 承認日付挿入
			this.workflow.publishSettingInfo.insertApproveUser = pdfOutputDomain.insertApproveUser; // 承認者名挿入
			this.workflow.publishSettingInfo.insertPage =  pdfOutputDomain.insertPage; // 挿入ページ
			this.workflow.publishSettingInfo.insertPlace =  pdfOutputDomain.insertPlace; // 挿入位置
			this.workflow.publishSettingInfo.insertPlaceX =  pdfOutputDomain.insertPlaceX; // 座標X
			this.workflow.publishSettingInfo.insertPlaceY =  pdfOutputDomain.insertPlaceY; // 座標Y
			this.workflow.publishSettingInfo.approveNamelang = pdfOutputDomain.approveNamelang; // 電子署名用言語
			this.workflow.publishSettingInfo.signJobName = pdfOutputDomain.signJobName; // 署名用ジョブ名
		}

		// セキュリティ設定
		if ( publicFileSecurityDomain ) {
			this.workflow.publishSettingInfo.doSetSecurityPassword = publicFileSecurityDomain.doSetSecurityPassword; // セキュリティパスワード　ON/OFF
			this.workflow.publishSettingInfo.securityPassword = publicFileSecurityDomain.securityPassword; // セキュリティパスワード
			this.workflow.publishSettingInfo.doSetReferencePassword = publicFileSecurityDomain.doSetReferencePassword; // 参照用パスワード　ON/OFF
			this.workflow.publishSettingInfo.referencePassword = publicFileSecurityDomain.referencePassword; // 参照用パスワード
			this.workflow.publishSettingInfo.forbidPrint = publicFileSecurityDomain.forbidPrint; // 印刷を許可しない
			this.workflow.publishSettingInfo.forbidEdit = publicFileSecurityDomain.forbidEdit; // 編集を許可しない
			this.workflow.publishSettingInfo.forbidAnnotate = publicFileSecurityDomain.forbidAnnotate; // 注釈追加を許可しない
			this.workflow.publishSettingInfo.forbidReproduce = publicFileSecurityDomain.forbidReproduce; // 転載を許可しない
		}

		this.workflow.publishNotifyList = this.publishNotifyEntryDataGrid.getData();
		// 更新
		this.workflowService.updateForDocument(this.workflow).subscribe(
			(data: any) => {
				this.updated.emit(data);
			}
		);
	}

	/**
	 * ワークフロー更新可否を返却します.
	 * @return ワークフロー更新可否
	 */
	public updatable(): boolean {
		let updateFlg = true;

		if (this.publicFileSecurityUpdater && !this.publicFileSecurityUpdater.executable() ) {
			updateFlg = false;
		}
		if (this.pdfElectronicSignatureApplicable && !this.pdfElectronicSignatureApplicable.updatable() ) {
			updateFlg = false;
		}
		return ( updateFlg && this.workflowCreatorForm.valid && (this.editFlg || this.workflowCreatorForm.dirty || (this.pdfElectronicSignatureApplicable && this.pdfElectronicSignatureApplicable.electronicSignatureForm.dirty) || (this.publicFileSecurityUpdater && this.publicFileSecurityUpdater.propertyForm.dirty)));
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		if (this.workflowCreatorForm.dirty || this.editFlg ||
			(this.publicFileSecurityUpdater && this.publicFileSecurityUpdater.propertyForm.dirty) ||
			(this.pdfElectronicSignatureApplicable && this.pdfElectronicSignatureApplicable.electronicSignatureForm.dirty)) {
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

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 名前変更イベント
	 * @param event イベント
	 */
	onWorkFlowNameChange(event: any) {
		this.editFlg = true;
		let test = this.workflow.nameList;
	}


	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		let lang: any;
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
		}
	}

	/**
	 * 上長承認ラジオボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickDefBossApproval(event: any): void {
		this.editFlg = true;
	}

	/**
	 * 公開通知先のデフォルト設定チェックボックス変更イベントハンドラ
	 * @param event イベント
	 */
	onChangePublishNotifyMail(event: any): void {
		this.editFlg = true;
		if (!this.workflow.publishNotifyMail && this.publishNotifyEntryDataGrid.info.rowCount > 0) {
			// 公開通知先初期化
			this.messageService.show(
				EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00027')
				, () => { this.publishNotifyEntryDataGrid.setData([]); }
			)
		}
	}

	/**
	 * ビュー初期化イベントハンドラ.
	 */
	ngAfterViewInit() {
		window.setTimeout(() => {
			if ( this.workflow.nameList && this.workflow.nameList.name && this.workflow.nameList.name.length > 0 ) {
				for ( let i = 0; i < this.workflow.nameList.name.length; i++ ) {
					this.workflow.nameList[ this.workflow.nameList.name[i]['attr'].lang ] = this.workflow.nameList.name[i]['attr'].value;
				}
			}

			if (this.serverConfigService.digitalSignatureFlg) {
				this.pdfElectronicSignatureApplicable.setData(this.workflow.publishSettingInfo);
			}
			if (this.serverConfigService.pdfOutputConf) {
				this.publicFileSecurityUpdater.blockUiCheck(!this.workflow.publishSettingInfo.doSetSecurity);
			}

			let columns: EIMDataGridColumn[] = [];
			// タイプ
			columns.push({field: 'entryTypeName', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 100, suppressFilter: true});
			// 名前
			columns.push({field: 'entryName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 375, suppressFilter: true});

			this.publishNotifyEntryDataGrid.setColumns(columns);
			let entryList = this.workflow.publishNotifyList;
			let entryTypeId: number;
			for (let i = 0; i < entryList.length; i++) {
				entryList[i]['entryTypeId'] = EIMAdminsConstantService.ENTRY_TYPE_ID_EN[entryList[i].entryType];
				entryList[i]['entryTypeName'] = this.entryService.getEntryTypeName(entryList[i].entryTypeId);
			}
			this.publishNotifyEntryDataGrid.setData(entryList);
		});
	}

	/**
	 * 有効期限設定チェックボックス変更イベントハンドラ
	 * @param event イベント
	 */
	onExpirationDateChange(event: any): void {
		this.workflowCreatorForm.controls['yuukou'].markAsDirty();
		this.workflowCreatorForm.controls['saki'].markAsDirty();
	}

	/**
	 * エントリ削除ボタン押下時のイベントハンドラ
	 */
	public deleteSelectedEntry(): void {
		if ( !this.publishNotifyEntryDataGrid.getSelectedData() || this.publishNotifyEntryDataGrid.getSelectedData().length === 0 ) {
			return;
		}

		let base: any[] = [];
		for (let i = 0; i < this.publishNotifyEntryDataGrid.getSelectedData().length; i++ ) {
			base.push(this.publishNotifyEntryDataGrid.getSelectedData()[i]);
		}
		this.publishNotifyEntryDataGrid.removeRowData(base);
		this.publishNotifyEntryDataGrid.refreshView();
		this.setEnablePublishNotifyEntryMenuButton();
		this.editFlg = true;
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * フォーマットコンテンツメニューアイテムの活性非活性制御を行う
	 */
	onPublishNotifyEntryContextMenuWorkflow(event: any): void {
		// 選択した公開通知先エントリー取得
		let selectedFormatList = this.publishNotifyEntryDataGrid.getSelectedData();
		if (selectedFormatList && selectedFormatList.length > 0 ) {
			// 公開通知先エントリー削除ボタン活性にします。
			this.getMenuItem (this.publishNotifyEntryContentsMenuItems, 'deleteSelectedEntry' ).disabled = false;
		} else {
			// 公開通知先エントリー削除ボタン非活性にします。
			this.getMenuItem (this.publishNotifyEntryContentsMenuItems, 'deleteSelectedEntry' ).disabled = true;
		}
	}

	/**
	 * エントリー選択イベントハンドラです.
	 * @param event イベント
	 */
	public onSelectedPublishNotifyEntry(event: any): void {
		this.setEnablePublishNotifyEntryMenuButton();
	}

	/**
	 * 承認依頼選択イベントハンドラです.
	 * @param event イベント
	 */
	public onSelectedStatusTypeApprove(event: any): void {
	}

	/**
	 * タブ変更イベントハンドラ.
	 * @param event イベント
	 */
	public onChangeTab(event: any): void {
	}

	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	public onClickStatusTypeUp(event: any): void {

	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	public onClickStatusTypeDown(event: any): void {
	}

	/**
	 * 遷移元変更イベントハンドラです.
	 * @param event イベント
	 */
	public onChangeFromStatusTypes(event: any): void {
	}

	/**
	 * 遷移先変更イベントハンドラです.
	 * @param event イベント
	 */
	public onChangeToStatusTypes(event: any): void {
	}

	/**
	 * セキュリティ設定のする/しない押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickSecurityDoNo(event: any): void {
		this.editFlg = true;
		this.publicFileSecurityUpdater.blockUiCheck(!this.workflow.publishSettingInfo.doSetSecurity);
	}

	/**
	 * 入力変更イベントハンドラ
	 * @param event イベント
	 */
	onInputChange(event: any): void {
		this.editFlg = true;
	}

	/**
	 * エントリ選択ボタン押下時のイベントハンドラ
	 */
	public showEntrySelector(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showpublishNotifySelector(
			null,
			this.publishNotifyEntryDataGrid.getData(),
			{
				selected: (data) => {
					this.editFlg = true;
					// 公開通知先選択画面をクローズ
					this.adminDialogManagerComponentService.close(dialogId);

					// ステータス別セキュリティを登録します．
					if ( data && data.length > 0 ) {
						this.publishNotifyEntryDataGrid.setData(data);
					}
				}
			}
		);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * エントリ削除ボタンの活性/非活性を設定します.
	 */
	private setEnablePublishNotifyEntryMenuButton(): void {
		let selectedData = this.publishNotifyEntryDataGrid.getSelectedData();
		if ( selectedData && selectedData.length > 0 ) {
			this.getMenuItem (this.publishNotifyEntryDataGridMenuItems, 'deleteSelectedEntry' ).disabled = false;
			this.getMenuItem (this.publishNotifyEntryContentsMenuItems, 'deleteSelectedEntry' ).disabled = false;
		} else {
			this.getMenuItem (this.publishNotifyEntryDataGridMenuItems, 'deleteSelectedEntry' ).disabled = true;
			this.getMenuItem (this.publishNotifyEntryContentsMenuItems, 'deleteSelectedEntry' ).disabled = true;
		}
	}

	/**
	 * メニューアイテムリストから名前を元に対象アイテムを取得します.
	 * @param menuItems 対象メニューアイテムリスト
	 * @param name 選択対象メニュー名称
	 * @return 選択対象メニューアイテム
	 */
	protected getMenuItem(menuItems: EIMMenuItem[], name: string): EIMMenuItem {
		for (let i = 0; i < menuItems.length; i++) {
			if (menuItems[i].name === name) {
				return menuItems[i];
			}
		}
		return null;
	}

}
