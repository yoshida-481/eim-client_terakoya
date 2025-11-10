import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType, EIMDataGridColumnGroup } from 'app/shared/components/data-grid/data-grid.component';
import { EIMMenuItem } from 'app/shared/shared.interface';

import { EIMPublicDestinationRendererComponent } from 'app/documents/shared/components/renderer/public-destination-renderer.component';
import { EIMNotificationTypeRendererComponent } from 'app/documents/shared/components/renderer/notification-type-renderer.component';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMPublicDestinationRendererComponentService } from 'app/documents/shared/components/renderer/public-destination-renderer.component.service';

import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMWorkflowEvent, EIMWorkflowService, EIMWorkflowStatusType, EIMWorkflow} from 'app/documents/shared/services/apis/workflow.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

// レンダラー
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMTransitionDestinationRendererComponent } from 'app/documents/shared/components/renderer/transition-destination-renderer.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMTransitionDestinationRendererComponentService } from 'app/documents/shared/components/renderer/transition-destination-renderer.component.service';
import { EIMApproverRendererComponentService } from 'app/documents/shared/components/renderer/approver-renderer.component.service';
import { EIMApproverRendererComponent } from 'app/documents/shared/components/renderer/approver-renderer.component';
import { EIMContentsApproveWorkflowDiagramComponent, EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component';
import { EIMApproveDocumentDTO } from 'app/documents/shared/dtos/approve-document.dto';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';
import { EIMCheckboxRendererComponent } from 'app/shared/components/renderer/checkbox-renderer.component';
import { EIMEntry } from 'app/documents/components/document-public-destination-selector/document-public-destination-selector-tree.component.service';
import { EIMPublicNotificationTypeRendererComponent } from 'app/documents/shared/components/renderer/public-notification-type-renderer.component';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { finalize } from 'rxjs/internal/operators/finalize';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService } from '../contents-approve-workflow-diagram/contents-approve-for-approver-selectable-workflow-diagram.component.service';
import { EIMApproveStatusDTO } from 'app/documents/shared/dtos/approve-status.dto';
import { EIMApproveInfoManagementService } from 'app/documents/shared/services/approve-info-manegement.service';

/**
 * 承認依頼画面コンポーネント
 * @example
 * 		<eim-contents-approve-request-executor
 * 			[contentsObjs] = 'contentsObjs'
 * 			[workspaceObjId] = 'workspaceObjId'>
 *		</eim-contents-approve-request-executor>
 */
@Component({
    selector: 'eim-contents-approve-request-executor',
    templateUrl: './contents-approve-request-executor.component.html',
    styleUrls: ['./contents-approve-request-executor.component.css'],
    providers: [EIMPublicDestinationRendererComponentService,
        EIMApproverRendererComponentService,
        EIMTransitionDestinationRendererComponentService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMContentsApproveRequestExecutorComponent) }],
    standalone: false
})
export class EIMContentsApproveRequestExecutorComponent implements OnInit, EIMExecutable , OnDestroy {

	/** ドキュメント一覧データグリッド */
	@ViewChild('documentList', { static: true }) documentList: EIMDataGridComponent;
	/** ワークフロー図形 */
	@ViewChild('workflowDiagram', { static: true }) workflowDiagram: EIMContentsApproveWorkflowDiagramComponent;

	/** 承認依頼対象ドキュメントリスト */
	@Input() contentsObjs: any[];
	/** 選択中ワークスペースのオブジェクトId */
	@Input() workspaceObjId: number;

	/** 承認依頼処理完了のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();
	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();
	/** プロパティボタン押下時のイベントエミッタ */
	@Output() changeProperty: EventEmitter<null> = new EventEmitter<null>();
	/** 名前選択イベントエミッタ */
	@Output() onNodeSelect: EventEmitter<any> = new EventEmitter<any>();

	/** 公開通知先削除完了サブスクリプション */
	private destinationDeleteCompleted: Subscription;
	/** 公開通知先ダブルクリック完了サブスクリプション */
	private destinationDoubleClickCompleted: Subscription;

	/** 実行ボタン押下可否 */
	private executableFlag = false;
	/** コピーした承認依頼情報 */
	private copyItem = null;

	/** コピーした承認依頼情報 */
	private copyCurrentApprover: any;

	/** メニュー定義 */
	// 公開通知先選択
	private menuSelectDestination: EIMMenuItem =
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03015'), disabled: true, icon: 'fa fa-plus', command: (event) => {this.onClickSelectDestination(event); }};
	// PDF出力設定
	private menuPdfOutputSetting: EIMMenuItem =
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03094'), disabled: true, icon: 'fa fa-plus', command: (event) => {this.onClickPdfOutputSetting(event); }};

	// コピー
	private menuItemCopy: EIMMenuItem =
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03034'), disabled: true, icon: 'eim-icon-copy', command: (event) => {this.onClickCopy(event); }};
	// 貼り付け
	private menuItemPaste: EIMMenuItem =
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03036'), disabled: true, icon: 'eim-icon-paste', command: (event) => {this.onClickPaste(event); }};
	// プロパティ
	private menuProperty: EIMMenuItem =
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03007'), disabled: true, icon: 'eim-icon-list', command: (event) => {this.onClickProperty(event); }};
	// セパレータ
	private menuSeparator: EIMMenuItem = {separator: true};

	/** ドキュメント一覧のメニュー */
	public menuItems: MenuItem[] = [
	  this.menuSelectDestination,
		{
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03026'), disabled: true, icon: 'eim-icon-pencil', items: [
			  this.menuItemCopy,
			  this.menuItemPaste,
			]
		},
		this.menuProperty,
		this.menuPdfOutputSetting
	];

	/** ドキュメント一覧のコンテキストメニュー */
	public contextMenuItems: EIMMenuItem[] = [
	  this.menuSeparator,
	  this.menuSelectDestination,
	  this.menuSeparator,
	  this.menuItemCopy,
	  this.menuItemPaste,
	  this.menuSeparator,
		this.menuProperty,
		this.menuSeparator,
	  this.menuPdfOutputSetting,

	];

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 承認情報マネージャ */
	private approveInfoManager: EIMApproveInfoManagementService.EIMApproveInfoManager;

	/**
	 * コンストラクタです.
	 */
	constructor(
			public contentsApproveWorkflowDiagramComponentService: EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService,
			protected translateService: TranslateService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			protected messageService: EIMMessageService,
			protected documentFormService: EIMDocumentFormService,
			protected approveService: EIMApproveService,
			protected workflowService: EIMWorkflowService,
			protected entryService: EIMDocumentsEntryService,
			protected publicDestinationRendererComponentService: EIMPublicDestinationRendererComponentService,
			protected approverRendererComponentService: EIMApproverRendererComponentService,
			protected transitionDestinationRendererComponentService: EIMTransitionDestinationRendererComponentService,
			protected historyRendererComponentService: EIMHistoryRendererComponentService,
			protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
			protected serverConfigService: EIMServerConfigService,
			protected dateServce: EIMDateService,
			protected approveInfoManagementService: EIMApproveInfoManagementService
	) {
		this.destinationDeleteCompleted = publicDestinationRendererComponentService.deleted.subscribe((target: any) => {this.deleteDestination(target.documentId, target.entryId); });
		this.destinationDoubleClickCompleted = publicDestinationRendererComponentService.doubleClicked.subscribe(() => {this.onClickSelectDestination(null); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 承認依頼をします.
	 */
	public execute(): void {

		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00017'),
			() => {
				// 処理件数
				let completeCount = 0;
				// 対象件数
				let targetCount: number = this.documentList.getData().length;
				// 成功データ
				let successData: any[] = [];

				for (let i = 0; i < this.documentList.getData().length; i++) {
					let document: EIMApproveDocumentDTO = this.documentList.getData()[i];

					// 承認依頼通知
					let timing: string;
					let immediateMailTypeId: number;
					let accumulateMailTypeId: number;
					let nothingMailTypeId: number;
					let sendNotifyMailTiming: string;

					if (this.documentList.getData()[i].receptionconfirmation) {
						document.reply = 1;
					} else {
						document.reply = 0;
					}
					switch (Number(document.notificationType)) {
						case 0:
							timing = EIMConstantService.MAILNOTICE_METHOD_IMMEDIATE;
							immediateMailTypeId = EIMConstantService.MAIL_TYPE_ID_REQ_APPROVE;
							break;
						case 1:
							timing = EIMConstantService.MAILNOTICE_METHOD_ACCUMULATE;
							accumulateMailTypeId = EIMConstantService.MAIL_TYPE_ID_REQ_APPROVE;
							break;
						case 2:
							timing = EIMConstantService.MAILNOTICE_METHOD_NOTHING;
							nothingMailTypeId = EIMConstantService.MAIL_TYPE_ID_REQ_APPROVE;
							break;
						default:
							break;
					}

					switch (Number(document.sendNotifyMailTiming)) {
						case 0:
						sendNotifyMailTiming = EIMConstantService.MAILNOTICE_METHOD_IMMEDIATE;
							break;
						case 1:
						sendNotifyMailTiming = EIMConstantService.MAILNOTICE_METHOD_ACCUMULATE;
							break;
						case 2:
						sendNotifyMailTiming = EIMConstantService.MAILNOTICE_METHOD_NOTHING;
							break;
						default:
							break;
					}

					let event: EIMWorkflowEvent;
					if (document.localPDFOutputSet) {
						// PDF変換オプションを設定した場合
						event = {
							objId: document.objId,
							approverId: this.approveInfoManager.getApproverId(document.objId),
							skipStatusTypeId: this.approveInfoManager.getSkipStatusTypeId(document.objId),
							publisherId: this.getPublisherId(document.destination),
							comment: document.comment,
							reply: document.reply,
							baseEventTypeId: EIMConstantService.BASE_EVENT_TYPE_ID_REQ_APPROVE,
							statusMDateLong: document.statusMDateLong,
							forcastStatusTypeId: this.approveInfoManager.getForcastStatusTypeId(document.objId),
							timing: timing,
							immediateMailTypeId: immediateMailTypeId,
							accumulateMailTypeId: accumulateMailTypeId,
							nothingMailTypeId: nothingMailTypeId,
							localPDFOutputSet: document.localPDFOutputSet,
							doSignPDF: document.doSignPDF,
							doSetSecurity: document.doSetSecurity,
							doSignPDFAndSetSecurity: document.doSignPDFAndSetSecurity,
							insertApproveDate: document.insertApproveDate,
							insertApproveUser: document.insertApproveUser,
							insertPage: document.insertPage,
							insertPlace: document.insertPlace,
							insertPlaceX: document.insertPlaceX,
							insertPlaceY: document.insertPlaceY,
							doSetSecurityPassword: document.doSetSecurityPassword,
							securityPassword: document.securityPassword,
							doSetReferencePassword: document.doSetReferencePassword,
							referencePassword: document.referencePassword,
							forbidPrint: document.forbidPrint,
							forbidEdit: document.forbidEdit,
							forbidAnnotate: document.forbidAnnotate,
							forbidReproduce: document.forbidReproduce,
							publicComment: document.publicComment,
							sendNotifyMailTiming: sendNotifyMailTiming,
							lastEventFlag: document.lastEventFlag
						}
					} else {
						event = {
								localPDFOutputSet: document.localPDFOutputSet,
								objId: document.objId,
								approverId: this.approveInfoManager.getApproverId(document.objId),
								skipStatusTypeId: this.approveInfoManager.getSkipStatusTypeId(document.objId),
								publisherId: this.getPublisherId(document.destination),
								comment: document.comment,
								reply: document.reply,
								baseEventTypeId: EIMConstantService.BASE_EVENT_TYPE_ID_REQ_APPROVE,
								statusMDateLong: document.statusMDateLong,
								forcastStatusTypeId: this.approveInfoManager.getForcastStatusTypeId(document.objId),
								timing: timing,
								immediateMailTypeId: immediateMailTypeId,
								accumulateMailTypeId: accumulateMailTypeId,
								nothingMailTypeId: nothingMailTypeId,
								publicComment: document.publicComment,
								sendNotifyMailTiming: sendNotifyMailTiming,
								lastEventFlag: document.lastEventFlag
						}
					}
				// 後処理
				let postProc: () => void = () => {
					completeCount++;
					// 実行ボタン押下完了イベントを通知(画面を閉じる / メイン画面に結果を反映 / メッセージを表示)
					if (completeCount === targetCount) {
						this.executed.emit(successData);
					}
				};
				this.workflowService.doEvent(event)
					.subscribe(
						(object: any) => {
							successData.push(object);
							postProc();
						},
						(err) => {
							postProc();
						}
					);
				}
		});
	}

	/**
	 * 実行ボタン押下可否を返却します.
	 * @return 実行ボタン押下可否
	 */
	public executable(): boolean {
		return this.executableFlag;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: (EIMDataGridColumn | EIMDataGridColumnGroup)[] = [];
		// 名称
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 275, headerClass: 'column-bottom-plus', cellRendererFramework: EIMObjectNameRendererComponent, suppressFilter: true , pinned: true, suppressMovable: true});
		// 履歴
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), headerClass: 'column-bottom-plus', width: 40,
			suppressFilter: true, cellRendererFramework: EIMHistoryRendererComponent, valueGetter: this.historyRendererComponentService.valueGetter, suppressMovable: true});
		// 作成者
		columns.push({field: 'createUserName', headerName: this.translateService.instant('EIM.LABEL_02030'), headerClass: 'column-bottom-plus', width: 90, suppressFilter: true, suppressMovable: true});
		// 更新日時
		columns.push({field: 'modifyDateTime', headerName: this.translateService.instant('EIM.LABEL_02033'), headerClass: 'column-bottom-plus', width: 155, suppressFilter: true,
			cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, suppressMovable: true, comparator: this.dateServce.dateComparator
		});
		// 遷移先ステータス
		// columns.push({headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02100'), width: 150, cellRendererFramework: EIMTransitionDestinationRendererComponent, headerClass: 'eim-editable-column-header column-bottom-plus', suppressFilter: true, suppressSorting: true, suppressMovable: true});
		// 承認依頼情報
		columns.push({headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02211'), children: [
			// 回付コメント
			{type: EIMDataGridColumnType.largeText, cellEditorParams: {maxLength: EIMDocumentsConstantService.STRING_MAX_LENGTH},
				field: 'comment', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02205'),
				width: 220, headerClass: 'eim-editable-column-header', suppressFilter: true, editable: true, suppressMovable: true},
			// 承認依頼通知タイミング
			{field: 'notificationType', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02078'), width: 120, cellRendererFramework: EIMNotificationTypeRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true, suppressMovable: true}
		]});
		// 公開通知情報
		columns.push({headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02212'), children: [
			// 公開通知先
			{field: 'destination', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02076'), width: 120, cellRendererFramework: EIMPublicDestinationRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true, suppressMovable: true},
			// 公開通知コメント
			{type: EIMDataGridColumnType.largeText, cellEditorParams: {maxLength: EIMDocumentsConstantService.STRING_MAX_LENGTH},
				field: 'publicComment', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02208'),
				width: 160, headerClass: 'eim-editable-column-header', suppressFilter: true, editable: true, suppressMovable: true},
			// 公開通知タイミング
			{field: 'sendNotifyMailTiming', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02078'), width: 120, cellRendererFramework: EIMPublicNotificationTypeRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true, suppressMovable: true}
		]});
		// 受信確認
		let visibleFunction = (data: any) => {
			if (data.isDocument === true || data.isDocument === 'true') {
				return true;
			}	else {
				return false;
			}
		}
		columns.push({field: 'receptionconfirmation', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02089'), width: 90, cellRendererFramework: EIMCheckboxRendererComponent, headerClass: 'eim-editable-column-header column-bottom-plus', suppressFilter: true, suppressSorting: true, suppressMovable: true, param: {visibleFunction : visibleFunction, displayCenter: true}});
		this.documentList.setColumns(columns);
		this.documentList.setRowHeight(EIMConstantService.APPROVE_ROW_HEIGHT);

		// PDF出力設定オプション判定
		this.isVisibleOptionMenuItems();
		// 画面表示処理
		this.show();

	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 * @param event イベント
	 */
	ngOnDestroy(): void {
		if (!this.destinationDeleteCompleted.closed) {this.destinationDeleteCompleted.unsubscribe(); }
		if (!this.destinationDoubleClickCompleted.closed) {this.destinationDoubleClickCompleted.unsubscribe(); }
	}

	/**
	 * グリッド内名前選択イベントハンドラ.
	 * @param treeNode 選択ツリーノード
	 */
	onNodeSelectEmit(event: any) {
		// 名前選択イベントエミッタをエミット
		this.onNodeSelect.emit(event);
		// 承認画面を閉じる
		this.dialogManagerComponentService.close('APPROVE_REQUEST_EXECUTOR');
	}

	/**
	 * ドキュメント選択イベントハンドラです.
	 * @param event イベント
	 */
	onSelect(event: any[]) {
		if (!this.documentList.getSelectedData() || this.documentList.getSelectedData().length !== 1) {
			this.validateReset(true);
			this.showWorkflow();
			return;
		}
		this.validateReset(false);
		// ワークフロー情報表示
		this.showWorkflow();
	}

	/**
	 * データグリッドメニューの公開通知先選択ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickSelectDestination(event: any): void {
		if (!(this.documentList.getSelectedData() && this.documentList.getSelectedData().length === 1)) {
			return;
		}
		let dialogId: string = this.dialogManagerComponentService.showDocumentPublicDestinationSelector(
			this.documentList.getSelectedData()[0].objId,
			this.documentList.getSelectedData()[0].destination,
			{
				selected: (data) => {
					// 公開通知先選択画面をクローズ
					this.dialogManagerComponentService.close(dialogId);
					// 公開通知先に設定
					this.documentList.getSelectedData()[0].destination = data;
					this.documentList.refreshView();
				}
			}
		);
	}

	/**
	 * データグリッドメニューのPDF出力設定ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickPdfOutputSetting(event: any): void {
		let activityFlag = true;
		let parentWin = 'requestApprove';
		let selectedData = this.documentList.getSelectedData()[0];
		let objId: number = Number(selectedData.objId);

		this.approveService.getPdfOutput(objId, parentWin, selectedData)
		.subscribe((pdfOutput: EIMPDFOutputDomain) => {
			let dialogId: string = this.dialogManagerComponentService.showPDFSettingUpdater(
				activityFlag , objId , pdfOutput,
				{
					updated: (data: EIMPDFOutputDomain) => {
						// PDF出力設定変更フラグ
						selectedData.localPDFOutputSet = true;
						// 電子署名設定有無
						selectedData.doSignPDF = data.doSignPDF.toString();
						// セキュリティ設定有無
						selectedData.doSetSecurity = data.doSetSecurity.toString();
						// 電子署名設定・セキュリティ設定有無
						selectedData.doSignPDFAndSetSecurity = data.doSignPDFAndSetSecurity.toString();
						// 承認日付挿入
						selectedData.insertApproveDate = data.insertApproveDate.toString();
						// 承認者名挿入
						selectedData.insertApproveUser = data.insertApproveUser.toString();
						// 挿入ページ
						selectedData.insertPage = data.insertPage.toString();
						// 基準点
						selectedData.insertPlace = data.insertPlace.toString();
						// 基準点X軸入力値
						selectedData.insertPlaceX = data.insertPlaceX.toString();
						// 基準点Y軸入力値
						selectedData.insertPlaceY = data.insertPlaceY.toString();
						// セキュリティパスワード入力有無
						selectedData.doSetSecurityPassword = data.doSetSecurityPassword.toString();
						// セキュリティパスワード
						selectedData.securityPassword = data.securityPassword.toString();
						// 参照用パスワード入力有無
						selectedData.doSetReferencePassword = data.doSetReferencePassword.toString();
						// 参照用パスワード
						selectedData.referencePassword = data.referencePassword.toString();
						// 印刷を許可しない
						selectedData.forbidPrint = data.forbidPrint.toString();
						// 編集を許可しない
						selectedData.forbidEdit = data.forbidEdit.toString();
						// 注釈追加を許可しない
						selectedData.forbidAnnotate = data.forbidAnnotate.toString();
						// 転載を許可しない
						selectedData.forbidReproduce = data.forbidReproduce.toString();
						this.documentList.refreshView();
						// PDF出力設定画面をクローズ
						this.dialogManagerComponentService.close(dialogId);
					}
				})
		}, (err: any) => {
			// エラーの場合、画面を閉じる
			window.setTimeout(() => {
			});
		 });
	}


	/**
	 * データグリッドメニューのコピーボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickCopy(event: any): void {
		let selectedData: any[] = this.documentList.getSelectedData();

		// コピー対象件数確認
		if (selectedData === null || selectedData.length !== 1) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00039'));
			return;
		}
		// コピーする
		this.copyItem = this.makeCopy(selectedData[0]);
		this.validateReset(false);
	}

	/**
	 * データグリッドメニューの貼り付けボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickPaste(event: any): void {
		let items: any[] = this.documentList.getSelectedData();
		let failItem: any = [];

		// 貼付け先が選択されていない場合、処理を行わない
		if (items == null || items === undefined || items.length <= 0) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00008'));
			return;
		}

		// 貼り付け処理
		for (let i = 0; i < items.length; i++ ) {
			let pasteItem = this.copyItem
			// コメント、通知タイプは無条件で貼り付け
			items[i].comment = pasteItem.comment;
			items[i].publicComment = pasteItem.publicComment;
			items[i].sendNotifyMailTiming = pasteItem.sendNotifyMailTiming;
			items[i].notificationType = pasteItem.notificationType;

			// 受信確認（WFフォルダには受信確認が無いため、コピー元とコピー先が両方ドキュメントの場合のみ貼り付ける）
			if ((items[i].isDocument === true || items[i].isDocument === this.FLAG_TRUE) && (pasteItem.isDocument === true || pasteItem.isDocument === this.FLAG_TRUE)) {
				items[i].reply = pasteItem.reply;
				items[i].receptionconfirmation = pasteItem.receptionconfirmation;
			}

			// 貼り付け可能かチェック
			let checkResult = false;
			checkResult = this.checkPasteStatus(items[i]);

			if (!checkResult) {
				failItem.push(items[i])
				continue;
			}

			// コピー元ドキュメント（単数）
			let copyStatusList: any = pasteItem.statusList;
			// コピー先ドキュメント（複数可）
			let destStatusList: any = items[i].statusList;

			// statusタグの貼り付け
			for (let j = 0; j < destStatusList.length; j++ ) {
				for (let k = 0; k < copyStatusList.length; k++ ) {
					if (destStatusList[j].statusTypeId === copyStatusList[k].statusTypeId ) {
						// 承認情報
						destStatusList[j].approver.length = 0;
						for (let l = 0; l < copyStatusList[k].approver.length; l++) {
							destStatusList[j].approver.push(Object.assign({}, copyStatusList[k].approver[l]));
						}
						destStatusList[j].approverName = copyStatusList[k].approverName;
						destStatusList[j].approverId = copyStatusList[k].approverId;
						destStatusList[j].displayFlag = copyStatusList[k].displayFlag;
						// 遷移先ステータス変更
						items[i].forcastStatusTypeId = pasteItem.forcastStatusTypeId;
						// レンダラーリフレッシュ用
						items[i].tmpStatusTypeId = null;
						break;
					}
				}
			}

			// 承認者依頼描写用,公開通知先
			items[i].currentApprover.length = 0;
			items[i].destination.length = 0;
			items[i] = this.pastedData(items[i], pasteItem);
			// 処理プルダウン情報を貼付け
			items[i].functionType = pasteItem.functionType;

			// 現行ステータスより後のステータスタイプ情報を上書きする
			let workflow: EIMWorkflow = pasteItem.workflow;
			this.approveInfoManager.setOriginalStatusTypes(items[i].objId, workflow.statusTypes);
			this.approveInfoManager.setUpdatedStatusTypes(
					// items[i].objId, this.getPasteTargetStatusTypes(workflow.statusTypes, 1), true, true);
					items[i].objId, workflow.statusTypes, true, true);

			// 承認ルートが存在するかどうか上書きする（実行ボタン活性の判定で使用）
			let updatedStatusTypes = this.approveInfoManager.getUpdatedStatusTypes(items[i].objId);
			let routeEventTypes = this.contentsApproveWorkflowDiagramComponentService.getApproveRoute(Number(items[i].step), updatedStatusTypes, workflow.eventTypes);
			this.approveInfoManager.setRouteEventTypes(items[i].objId, routeEventTypes);
		}
		this.documentList.refreshView();
		this.showWorkflow();

		// 貼付け失敗ドキュメントが存在する場合、ダイアログで一覧表示
		if (failItem.length !== 0) {
			let failItemName: string[] = [] ;

			for (let i = 0; failItem.length > i ; i++) {
				failItemName.push(failItem[i].objName);
			}
			this.messageService.showMultipleLines(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00041'), failItemName ,
			() => {});
		}
		this.validateExecute();
	}

	/**
	 * データグリッドメニューのプロパティボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickProperty(event: any): void {
		let selectData: any[] = this.documentList.getSelectedData();
		if (!(selectData && selectData.length === 1)) {
			return;
		}
		if (selectData[0].isWorkflowFolder === true || selectData[0].isWorkflowFolder === this.FLAG_TRUE) {
			selectData[0].objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
		}
		let params: any = {selectedData: selectData};
		this.changeProperty.emit(params);
	}

	/**
	 * データグリッドメニューのステータス属性ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickStatus( event: any ): void {
		this.showStatus( this.documentList.getSelectedData() );
	}

	/**
	 * ダイアグラムのステータス情報更新時のイベントハンドラです.
	 * @param event イベント
	 */
	onStatusTypeChanged(event: EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged): void {

		this.approveInfoManager.setUpdatedStatusTypes(event.objId, [event.statusType], event.isSkipChanged, event.isUserListChanged);
		this.approveInfoManager.setRouteEventTypes(event.objId, event.routeEventTypes);

		this.validateExecute();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 */
	private show(): void {

		let objects: any[] = [];
		let isError = false;

		// 対象件数
		let targetCount: number = this.contentsObjs.length;
		// 処理件数
		let procCount = 0;
		// エラー件数
		let errorCount = 0;

		// 承認依頼対象ドキュメントをループで取得
		for (let i = 0; i < this.contentsObjs.length; i++) {

			// 承認依頼対象ドキュメント取得
			this.approveService.getByContentsId(this.contentsObjs[i].objId, EIMConstantService.EVENT_FUNCTION_TYPE_APPROVE)
				.pipe(finalize(() => {
					procCount++;
					if (errorCount === targetCount) {
						// 全てエラーの場合、画面を閉じる
						window.setTimeout(() => {
							this.errored.emit();
							isError = true;
						});
					} else if (procCount === targetCount) {
						// メイン画面の並び順(オブジェクト名)でソート
						objects = objects.sort((obj1: any, obj2: any) => {
							if (obj1.isDocument === obj2.isDocument) {
								if (obj1.objName < obj2.objName) {return -1; }
								if (obj1.objName > obj2.objName) {return 1; }
								return 0;
							} else if (obj1.isWorkflowFolder && (obj1.isWorkflowFolder === this.FLAG_TRUE || obj1.isWorkflowFolder === true)) {return -1;
							} else {return 1; }
						});
						// 取得対象のドキュメントをすべて取得後、ドキュメントリストに設定
						this.documentList.setData(objects);
						// 先頭行を選択
						let targets: any[] = [];
						targets.push(this.documentList.getData()[0]);
						this.documentList.select(targets, false);

						// 承認情報マネージャ初期化
						this.approveInfoManager = this.approveInfoManagementService.getManager(objects);
						this.validateExecute();
					}

				}))
				.subscribe(
					(object: EIMApproveDocumentDTO) => {
						// 取得結果を保持
						object.functionType = EIMConstantService.EVENT_FUNCTION_TYPE_APPROVE;
						// WF付きフォルダ
						if (this.contentsObjs[i].isWorkflowFolder === this.FLAG_TRUE || this.contentsObjs[i].isWorkflowFolder === true) {
							object.isWorkflowFolder = this.contentsObjs[i].isWorkflowFolder;
							object.objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
							object.objName = object.fullPath;
						}
						// 受信確認
						if (object.reply === 1) {
							object['receptionconfirmation'] = true;
						} else {
							object['receptionconfirmation'] = false;
						}
						objects.push(object);
					},
					(err) => {
						// エラー
						errorCount++;
					}
				);
		}
	}
	/**
	 * ステータス属性ダイアログを表示します.
	 * @param selectedData 選択データ
	 */
	public showStatus( selectedData: any[] ): void {
		let dialogId: string = this.dialogManagerComponentService.showContentsStatusProperty( selectedData[0],
			{
				errored: () => {
					this.dialogManagerComponentService.close( dialogId );
				}
			} );
	}

	/**
	 * ワークフロー情報を表示します.
	 */
	private showWorkflow(): void {

		let params: any = {};
		let selectedData: EIMApproveDocumentDTO[] = this.documentList.getSelectedData();
		if (selectedData && selectedData.length === 1) {
			params['objId'] = selectedData[0].objId;
			params['statusList'] = selectedData[0].statusList;
			params['nextStatusTypeId'] = Number(selectedData[0].forcastStatusTypeId);
			params['updatedStatusTypes'] = this.approveInfoManager.getUpdatedStatusTypes(selectedData[0].objId);
			params['approveInfoManager'] = this.approveInfoManager;
		}
		this.workflowDiagram.show(params, this.callbackShowWorkflow.bind(this));
	}

	/**
	 * ワークフロー表示後のコールバック関数です.
	 * 承認依頼画面では承認ステータスに設定された承認者/スキップ有無を全てサーバに送信できるよう、
	 * 承認の全ステータスタイプを更新されたステータスタイプリストに登録します.
	 * 承認依頼ユーザが前回設定したアサインプランをサーバに登録しなおすためです.
	 * @param workflow ワークフロー情報
	 * @param params ワークフロー表示時に渡したパラメータ
	 */
	private callbackShowWorkflow(workflow, params): void {

		params['approveInfoManager'].setUpdatedStatusTypes(
			params['objId'], this.getUpdateTargetStatusTypes(workflow.statusTypes, 1), true, true);

	}

	/**
	 * 与えられたステータスタイプ配列から更新対象になりうるステータスタイプの配列を返却します.
	 * 更新対象外のステータスタイプは、現在のステータスタイプ以前のステータスタイプ、あるいは公開処理中/公開済みステータスタイプです.
	 * @param statusTypes ステータスタイプ配列
	 * @param currentStep 現在のステータスタイプ
	 * @returns 更新対象のステータスタイプ配列
	 */
	private getUpdateTargetStatusTypes(statusTypes: EIMWorkflowStatusType[], currentStep: number): EIMWorkflowStatusType[] {
		let targetStatusTypes: EIMWorkflowStatusType[] = [];
		for (let i = 0; i < statusTypes.length; i++) {
			if (statusTypes[i].step <= currentStep) {
				// 現在ステータスタイプまではペースト対象外
				continue;
			}
			if (statusTypes[i].statusTypeKindId === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PROCESSING_PUBLIC ||
					statusTypes[i].statusTypeKindId === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
				// 公開処理中、公開済みは対象外
				continue;
			}
			targetStatusTypes.push(statusTypes[i]);
		}
		return targetStatusTypes;
	}

	/**
	 * 公開通知先を削除します.
	 * @param documentId 文書Id
 	 * @param entryId エントリId
	 */
	private deleteDestination(documentId: number, entryId: number): void {
		// ドキュメントでループ
		for (let i = 0; i < this.documentList.getData().length; i++) {
			if (Number(documentId) === Number(this.documentList.getData()[i].objId)) {

				// ドキュメントの公開通知先でループ
				for (let j = 0; j < this.documentList.getData()[i].destination.length; j++) {
					if (Number(entryId) === Number(this.documentList.getData()[i].destination[j].entryId)) {
						// 公開通知先を削除
						this.documentList.getData()[i].destination.splice(j, 1);
					}
				}
			}
		}
	}

	/**
	 * 承認依頼先を削除します.
	 * @param documentId 文書Id
 	 * @param entryId エントリId
	 */
	private deleteApprover(documentId: number, entryId: number): void {
		// 選択済みドキュメントのステータス内でループ
		let document: EIMApproveDocumentDTO;
		for (let i = 0; i < this.documentList.getSelectedData().length; i++) {
			if (documentId === Number(this.documentList.getSelectedData()[i].objId)) {
				document = this.documentList.getSelectedData()[i];
				for (let k = 0; k < document.statusList.length; k++) {
					if (Number(document.statusList[k].statusTypeId) === Number(document.forcastStatusTypeId)) {
						// ドキュメントの承認依頼先でループ
						for (let j = 0; j < document.statusList[k].approver.length; j++) {
							if (Number(entryId) === Number(document.statusList[k].approver[j].id)) {
								// 承認依頼先を削除
								document.statusList[k].approver.splice(j, 1);
							}
						}
					}
				}
			}
		}
		this.validateExecute();
	}

	/**
	 * 選択ボタン活性を制御します.
	 */
	private validateExecute(): void {
		window.setTimeout(() => {
			// 実行ボタン押下可否取得
			for (let i = 0; i < this.documentList.getData().length; i++) {
				let document: EIMApproveDocumentDTO = this.documentList.getData()[i];

				// 承認ルートがあるかどうかチェック
				if (!this.approveInfoManager.existsApproveRoute(document.objId)) {
					this.executableFlag = false;
					return;
				}
				// 次のステータスタイプの承認者が設定されているかチェック
				let forcastStatusTypeId = this.approveInfoManager.getForcastStatusTypeId(document.objId);
				let approvers = this.approveInfoManager.getApproversByStatusTypeId(document.objId, forcastStatusTypeId);
				if (!approvers || approvers.length === 0) {
					this.executableFlag = false;
					return;
				}
			}
			this.executableFlag = true;
		});
	}

	/**
	 * 公開通知先を取得します.
	 * @param destinations 公開通知先リスト
	 * @return 公開通知先
	 */
	private getPublisherId(destinations: any[]): string {

		let publisherId = '';

		for (let j = 0; j < destinations.length; j++) {
			let element: string = destinations[j].entryTypeId + ':' + destinations[j].entryId;
			if (publisherId !== '') {publisherId += ','; }
			publisherId += element;
		}

		return publisherId;
	}

	/**
	 * ボタン及びコンテキストメニューの活性状態を変更します.
	 * @param disabled 活性可否
	 */
	private validateReset(disabled: boolean): void {
		for (let i = 0; i < this.menuItems.length; i++) {
			if (this.menuItems[i].label === this.translateService.instant('EIM_DOCUMENTS.LABEL_02058')) {
				this.menuItemCopy.disabled = disabled;
				// 2件以上選択された場合貼り付けメニューを活性
				if (this.documentList.getSelectedData().length >= 2) {
					this.menuItems[i].disabled = false;
					this.menuItemPaste.disabled = false;
				} else {
					this.menuItems[i].disabled = disabled;
					this.menuItemPaste.disabled = disabled;
				}
				// コピー情報が存在しない場合、貼り付けメニューを非活性
				if (this.copyItem === undefined || this.copyItem == null || Object.keys(this.copyItem).length <= 0 ) {
					this.menuItemPaste.disabled = true;
					if (this.menuItemCopy.disabled) {
						this.menuItems[i].disabled = true;
					}
				}
			} else {
				this.menuItems[i].disabled = disabled;
			}
		}
	}

	/**
	 * 承認情報の貼り付け時、WF、セキュリティのチェックをします.
	 * @param checkItem 貼り付け対象リスト
	 * @return 貼り付け可否
	 */
	private checkPasteStatus(checkItem: any): boolean {
		// ステータスタイプのIDが一致しない場合、貼り付け対象外
		if (checkItem.statusTypeId !== this.copyItem.statusTypeId) {
			return false;
		}
		// セキュリティのIDが一致しない場合、貼り付け対象外
		if (checkItem.securityId !== this.copyItem.securityId) {
			return false;
		} else {
		// WF、セキュリティが条件を満たしたため、承認情報を貼り付け
			return true;
		}
	}

	/**
	 * PDF出力設定オプションメニューの表示状態を変更します.
	 */
	private isVisibleOptionMenuItems(): void {
		for (let i = 0; i < this.menuItems.length; i++) {
			if (this.menuItems[i].label === this.translateService.instant('EIM_DOCUMENTS.LABEL_03094')) {
				if (this.serverConfigService.digitalSignatureFlg) {
					this.menuItems[i].visible = true;
					break
				} else {
					this.menuItems[i].visible = false;
					break
				}
			}
		}
	}

	/**
	 * 承認者依頼,公開通知先のデータを貼り付けます.
	 * @param items 貼付け先データ
	 * @param pasteItem 貼付け元データ
	 * @return 貼付け先データ
	 */
	private pastedData(items: any, pasteItem: any): any {
		for (let i = 0; i < pasteItem.currentApprover.length; i++) {
			items.currentApprover[i] = pasteItem.currentApprover[i].makeEntryUserClone();
		}
		for (let i = 0; i < pasteItem.destination.length; i++) {
			items.destination[i] = Object.assign({}, pasteItem.destination[i]);
		}
		return items;
	}

	/**
	 * コピー用データを作成します.
	 * @param selectedData 選択データ
	 * @return コピーデータ
	 */
	private makeCopy(selectedData: any): any {
		let copyData: any = {
			approver: selectedData.approver,
			approverName: selectedData.approverName,
			approverId: selectedData.approverId,
			comment: selectedData.comment,
			displayFlag: selectedData.displayFlag,
			expiration: selectedData.expiration,
			forcastStatusTypeId: selectedData.forcastStatusTypeId,
			fullPath: selectedData.fullPath,
			functionType: selectedData.functionType,
			isDocument: selectedData.isDocument,
			notificationType: selectedData.notificationType,
			objId: selectedData.objId,
			objName: selectedData.objName,
			publisherId: selectedData.publisherId,
			publisherName: selectedData.publisherName,
			reply: selectedData.reply,
			revision: selectedData.revision,
			receptionconfirmation: selectedData.receptionconfirmation,
			securityId: selectedData.securityId,
			sendNotifyMailTiming: selectedData.sendNotifyMailTiming,
			statusId: selectedData.statusId,
			statusList: selectedData.statusList,
			statusMDateLong: selectedData.statusMDateLong,
			statusTypeId: selectedData.statusTypeId,
			typeId: selectedData.typeId,
			publicComment: selectedData.publicComment,
			workflow: this.workflowDiagram.getWorkflow()
		}
		let approver: EIMEntry[] = [];
		for (let i = 0; i < selectedData.currentApprover.length; i++) {
			approver.push(selectedData.currentApprover[i].makeEntryUserClone());
		}
		copyData.currentApprover = approver;

		let dest: EIMEntry[] = [];
		for (let i = 0; i < selectedData.destination.length; i++) {
			dest.push(Object.assign({}, selectedData.destination[i]));
		}
		copyData.destination = dest;

		return copyData;
	}

	/**
	 * 貼り付け対象のステータスタイプのリストを返却します.
	 * @param statusTypes ワークフロー内の全ステータスタイプリスト
	 * @param currentStep ワークフロー内の現在のステータスタイプのステップ数
	 * @return 貼り付け対象のステータスタイプのリスト
	 */
	private getPasteTargetStatusTypes(statusTypes: EIMWorkflowStatusType[], currentStep: number): EIMWorkflowStatusType[] {
		if (!statusTypes) {
			return [];
		}

		let targetStatusTypes: EIMWorkflowStatusType[] = [];
		for (let i = 0; i < statusTypes.length; i++) {
			if (statusTypes[i].step <= currentStep) {
				// 現在ステータスタイプまではペースト対象外
				continue;
			}
			if (statusTypes[i].statusTypeKindId === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PROCESSING_PUBLIC ||
					statusTypes[i].statusTypeKindId === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
				// 公開処理中、公開済みは対象外
				continue;
			}
			targetStatusTypes.push(statusTypes[i]);
		}

		return targetStatusTypes;
	}

}
