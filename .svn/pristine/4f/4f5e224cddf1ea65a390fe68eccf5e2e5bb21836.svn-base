import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType, EIMDataGridColumnGroup } from 'app/shared/components/data-grid/data-grid.component';
import { EIMMenuItem } from 'app/shared/shared.interface';

import { EIMContentsApproveWorkflowDiagramComponent, EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component';
import { EIMNotificationTypeRendererComponent } from 'app/documents/shared/components/renderer/notification-type-renderer.component';

import { EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService } from '../contents-approve-workflow-diagram/contents-approve-for-approver-selectable-workflow-diagram.component.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMPlaceRendererComponent } from 'app/documents/shared/components/renderer/place-renderer.component';

import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMWorkflowEvent, EIMWorkflowService, EIMWorkflow, EIMWorkflowStatusType } from 'app/documents/shared/services/apis/workflow.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

// レンダラー
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMDirectEditingRendererComponent } from 'app/documents/shared/components/renderer/direct-editing-renderer.component';
import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMTransitionDestinationRendererComponent } from 'app/documents/shared/components/renderer/transition-destination-renderer.component';
import { EIMFunctionTypeRendererComponent } from 'app/documents/shared/components/renderer/function-type-renderer.component';
import { EIMApproveDocumentDTO } from 'app/documents/shared/dtos/approve-document.dto';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMTransitionDestinationRendererComponentService } from 'app/documents/shared/components/renderer/transition-destination-renderer.component.service';
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMApproveStatusDTO } from 'app/documents/shared/dtos/approve-status.dto';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';
import { EIMPublicDestinationRendererComponent } from 'app/documents/shared/components/renderer/public-destination-renderer.component';
import { EIMPublicDestinationRendererComponentService } from 'app/documents/shared/components/renderer/public-destination-renderer.component.service';
import { EIMPublicNotificationTypeRendererComponent } from 'app/documents/shared/components/renderer/public-notification-type-renderer.component';
import { finalize } from 'rxjs/internal/operators/finalize';
import { EIMFunctionTypeRendererComponentService } from 'app/documents/shared/components/renderer/function-type-renderer.component.service';
import { EIMApproveInfoManagementService } from 'app/documents/shared/services/approve-info-manegement.service';

import { EIMDateService } from 'app/shared/services/date.service';

/**
 * 承認画面コンポーネント
 * @example
 * 		<eim-contents-approve-executor
 *			[functionType] = 'functionType'
 *			[contentsObjs] = 'contentsObjs'
 *			[workspaceObjId] = 'workspaceObjId'>
 *		</eim-contents-approve-executor>
 */
@Component({
    selector: 'eim-contents-approve-executor',
    templateUrl: './contents-approve-executor.component.html',
    styleUrls: ['./contents-approve-executor.component.css'],
    providers: [
        EIMTransitionDestinationRendererComponentService,
        EIMPublicDestinationRendererComponentService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMContentsApproveExecutorComponent) }
    ],
    standalone: false
})
export class EIMContentsApproveExecutorComponent implements OnInit, EIMExecutable, OnDestroy {

	/** ドキュメント一覧データグリッド */
	@ViewChild('documentList', { static: true }) documentList: EIMDataGridComponent;
	/** ワークフロー図形 */
	@ViewChild('workflowDiagram', { static: true }) workflowDiagram: EIMContentsApproveWorkflowDiagramComponent;

	/** 処理タイプ初期値 */
	@Input() functionType: string;
	/** 承認対象ドキュメントリスト */
	@Input() contentsObjs: any[];
	/** 選択中ワークスペースのオブジェクトId */
	@Input() workspaceObjId: number;

	/** 公開処理完了のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();
	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();
	/** 処理待ち一覧展開時のリクエスト0件時のイベントエミッタ */
	@Output() noRequest: EventEmitter<null> = new EventEmitter<null>();
	/** プロパティボタン押下時のイベントエミッタ */
	@Output() changeProperty: EventEmitter<null> = new EventEmitter<null>();
	/** 場所アクセスイベントエミッタ */
	@Output() contentsAccess: EventEmitter<any> = new EventEmitter<any>();
	/** 名前選択イベントエミッタ */
	@Output() onNodeSelect: EventEmitter<any> = new EventEmitter<any>();
	/** 画面を閉じるイベントエミッタ */
	@Output() closed: EventEmitter<any> = new EventEmitter<any>();

	/** 公開通知先削除完了サブスクリプション */
	private destinationDeleteCompleted: Subscription;
	/** 公開通知先ダブルクリック完了サブスクリプション */
	private destinationDoubleClickCompleted: Subscription;
	/** 処理変更時のサブスクリプション */
	private functionTypeChanged: Subscription;

	/** 実行ボタン押下可否 */
	private executableFlag = false;
	/** コピーした承認依頼情報 */
	private copyItem: any = null;
	/** チェックイン情報 */
	private checkinObjIdArray: any = [];

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	/** メニュー定義 */

	// 全て承認
	private menuAllApprove: EIMMenuItem =
	{ label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03053'), name: 'allApprove', disabled: false, icon: 'eim-icon-thumb-up', command: (event) => { this.doAllProcessingChange('approve'); } };

	// 全て保留
	private menuAllReserve: EIMMenuItem =
	{ label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03054'), name: 'allReserve', disabled: false, icon: 'fa fa-clock-o', command: (event) => { this.doAllProcessingChange('wait'); } };

	// 全て差戻し
	private menuAllBack: EIMMenuItem =
	{ label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03055'), name: 'allBack', disabled: false, icon: 'fa fa-hand-stop-o', command: (event) => { this.doAllProcessingChange('back'); } };

	// 公開通知者選択
	private menuNotefiedUser: EIMMenuItem =
	{ label: this.translateService.instant( 'EIM_DOCUMENTS.LABEL_03015' ), name: 'selectApprover', disabled: true, icon: 'fa fa-plus', command: ( event ) => {this.onClickSelectDestination(event); } };

	// コピー
	private menuItemCopy: EIMMenuItem =
	{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03034'), name: 'itemCopy', disabled: true, icon: 'eim-icon-copy', command: (event) => {this.onClickCopy(event); }};
	// 貼り付け
	private menuItemPaste: EIMMenuItem =
	{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03036'), name: 'itemPaste', disabled: true, icon: 'eim-icon-paste', command: (event) => {this.onClickPaste(event); }};
	// プロパティ
	private menuProperty: EIMMenuItem =
	{ label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03007'), name: 'property', disabled: true, icon: 'eim-icon-list', command: (event) => { this.onClickProperty(event); } };
	// 回付状況/履歴
	private menuStatus: EIMMenuItem =
	{ label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03048'), name: 'status', disabled: true, icon: 'fa fa-archive', command: (event) => { this.onClickStatus(event); } };
	// PDF出力設定
	private menuPdfOutputSetting: EIMMenuItem =
	{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03094'), icon: 'fa fa-plus', disabled: true, command: (event) => {this.onClickPdfOutputSetting(event); }};
	// チェックイン
	private menuCheckIn: EIMMenuItem =
	{ label: this.translateService.instant( 'EIM_DOCUMENTS.LABEL_03029' ), name: 'checkIn', disabled: true, icon: 'eim-icon-checkin', command: ( event ) => { this.onClickCheckIn( event ); } };

	// セパレータ
	private menuSeparator: EIMMenuItem = { separator: true };

	/** ドキュメント一覧のメニュー */
	public menuItems: MenuItem[] = [
		{
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03050'), disabled: true, icon: 'fa fa-exchange', items: [
				this.menuAllApprove,
				this.menuAllReserve,
				this.menuAllBack,
			]
		},
		this.menuNotefiedUser,
		{
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03026'), disabled: true, icon: 'eim-icon-pencil', items: [
			  this.menuItemCopy,
			  this.menuItemPaste,
			]
		},
		{
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03007'), disabled: true, icon: 'eim-icon-list', items: [
				this.menuProperty,
				this.menuStatus,
			]
		},
		this.menuPdfOutputSetting,
		this.menuCheckIn
	];

	/** ドキュメント一覧のコンテキストメニュー */
	public contextMenuItems: EIMMenuItem[] = [
		this.menuNotefiedUser,
		this.menuSeparator,
		this.menuItemCopy,
		this.menuItemPaste,
		this.menuSeparator,
		this.menuProperty,
		this.menuStatus,
		this.menuSeparator,
		this.menuPdfOutputSetting,
		this.menuCheckIn
	];

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
		protected entryService: EIMDocumentsEntryService,
		protected historyRendererComponentService: EIMHistoryRendererComponentService,
		protected workflowService: EIMWorkflowService,
		protected placeRendererComponentService: EIMPlaceRendererComponentService,
		protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
		protected serverConfigService: EIMServerConfigService,
		protected publicDestinationRendererComponentService: EIMPublicDestinationRendererComponentService,
		protected dateService: EIMDateService,
		protected approveInfoManagementService: EIMApproveInfoManagementService,
		protected functionTypeRendererComponentService: EIMFunctionTypeRendererComponentService,
	) {
		this.destinationDeleteCompleted = publicDestinationRendererComponentService.deleted.subscribe((target: any) => { this.deleteDestination(target.documentId, target.entryId); });
		this.destinationDoubleClickCompleted = publicDestinationRendererComponentService.doubleClicked.subscribe(() => { this.onClickSelectDestination(null); });
		this.functionTypeChanged = functionTypeRendererComponentService.changed.subscribe((target: any) => { this.doProcessingChange(target); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 文書を承認します.
	 */
	public execute(): void {

		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00015'),
			() => {
				// 処理件数
				let completeCount = 0;
				// 対象件数
				let targetCount: number = this.documentList.getData().length;
				// 成功データ
				let successData: any[] = [];
				// 後処理
				let postProc: () => void = () => {
					completeCount++;
					// 実行ボタン押下完了イベントを通知(画面を閉じる / メイン画面に結果を反映 / メッセージを表示)
					if (completeCount === targetCount) {
						this.executed.emit(successData);
					}
				};

				for (let i = 0; i < this.documentList.getData().length; i++) {
					let document: EIMApproveDocumentDTO = this.documentList.getData()[i];

					let objId: number;
					let functionType: string;
					let approverId: string;
					let skipStatusTypeId: string;
					let comment: string;
					let publicComment: string;
					let finalApprove: boolean;
					let statusId: number;
					let timing: string;
					let baseEventTypeId: number;
					let statusMDateLong: number;
					let forcastStatusTypeId: number;
					let immediateMailTypeId: number;
					let accumulateMailTypeId: number;
					let nothingMailTypeId: number;
					let sendNotifyMailTiming: string;

					if (document.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_APPROVE ||
						document.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_BACK) {
						objId = document.objId;
						functionType = document.functionType;
						approverId = this.approveInfoManager.getApproverId(document.objId);
						skipStatusTypeId = this.approveInfoManager.getSkipStatusTypeId(document.objId);
						comment = document.comment;
						publicComment = document.publicComment;
						statusMDateLong = document.statusMDateLong;
						forcastStatusTypeId = document.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_BACK ? document.forcastStatusTypeId : this.approveInfoManager.getForcastStatusTypeId(document.objId);

						for (let j = 0; j < document.statusList.length; j++) {
							if (Number(document.statusList[j].statusTypeId) === Number(forcastStatusTypeId)) {
								finalApprove = document.statusList[j].finalApprove;
								break;
							}
						}
						statusId = document.statusId;
						// メール通知のタイミング
						switch (Number(document.notificationType)) {
						case 0:
							// 即時
							timing = EIMConstantService.MAILNOTICE_METHOD_IMMEDIATE;
							break;
						case 1:
							// 定時
							timing = EIMConstantService.MAILNOTICE_METHOD_ACCUMULATE;
							break;
						default:
							// なし
							timing = EIMConstantService.MAILNOTICE_METHOD_NOTHING;
						break;
						}

						// 公開メール通知のタイミング
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

						if (document.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_APPROVE) {
							// 承認の場合
							baseEventTypeId = EIMConstantService.BASE_EVENT_TYPE_ID_APPROVAL;
						} else if (document.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_BACK) {
							// 差戻しの場合
							baseEventTypeId = EIMConstantService.BASE_EVENT_TYPE_ID_SEND_BACK;
						}

						// メールの送信判定
						// 承認の場合
						if (document.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_APPROVE && document.isPartialApproval === false) {

							// 次のステータスが承認を必要としない（公開処理中、または公開済み）の場合
							if (finalApprove) {
								// 次のステータスが公開済みの場合
								if (document.sendNotifyMailTiming !== undefined
								    && Number(this.getForcastStatusTypeKind(document)) === EIMConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {

								    // 即時の場合
									if (Number(sendNotifyMailTiming) === Number(EIMConstantService.MAILNOTICE_METHOD_IMMEDIATE)) {
												immediateMailTypeId = EIMConstantService.MAIL_TYPE_ID_PUBLIC_NOTIFICATION;
										// 定時の場合
									} else if (Number(sendNotifyMailTiming) === Number(EIMConstantService.MAILNOTICE_METHOD_ACCUMULATE)) {
								        accumulateMailTypeId = EIMConstantService.MAIL_TYPE_ID_PUBLIC_NOTIFICATION;
										// なしの場合
									} else if (Number(sendNotifyMailTiming) === Number(EIMConstantService.MAILNOTICE_METHOD_NOTHING)) {
								        nothingMailTypeId = EIMConstantService.MAIL_TYPE_ID_PUBLIC_NOTIFICATION;
								  }
								}
								// 承認メールを即時で送信する
								// メールID：承認通知
								immediateMailTypeId = EIMConstantService.MAIL_TYPE_ID_APPROVE;

							// 次のステータスが承認を必要とする（一人承認・全員承認）の場合
							} else {
								// メールID：承認依頼通知
								// 即時の場合
								if (Number(timing) === Number(EIMConstantService.MAILNOTICE_METHOD_IMMEDIATE)) {
									immediateMailTypeId = EIMConstantService.MAIL_TYPE_ID_REQ_APPROVE;
								// 定時の場合
								} else if (Number(timing) === Number(EIMConstantService.MAILNOTICE_METHOD_ACCUMULATE)) {
									accumulateMailTypeId = EIMConstantService.MAIL_TYPE_ID_REQ_APPROVE;
								// なしの場合
								} else if (Number(timing) === Number(EIMConstantService.MAILNOTICE_METHOD_NOTHING)) {
									nothingMailTypeId = EIMConstantService.MAIL_TYPE_ID_REQ_APPROVE;
								}
							}

							// 差戻し
						} else if (document.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_BACK) {
							// ワークフロー設定差戻し・取戻しメール通知フラグがONの場合
							if (Number(document.sendingBackAndRegainingMail) === Number(EIMConstantService.MAIL_SENDING_ON)) {
								immediateMailTypeId = EIMConstantService.MAIL_TYPE_ID_SEND_BACK;
							} else {
								nothingMailTypeId = EIMConstantService.MAIL_TYPE_ID_SEND_BACK;
							}
						}

						let event: EIMWorkflowEvent = {
							objId: objId,
							functionType: functionType,
							approverId: approverId,
							skipStatusTypeId: skipStatusTypeId,
							publisherId: this.getPublisherId(document.destination),
							comment: comment,
							publicComment: publicComment,
							finalApprove: String(finalApprove),
							statusId: statusId,
							timing: timing,
							baseEventTypeId: baseEventTypeId,
							statusMDateLong: statusMDateLong,
							forcastStatusTypeId: forcastStatusTypeId,
							immediateMailTypeId: immediateMailTypeId,
							accumulateMailTypeId: accumulateMailTypeId,
							nothingMailTypeId: nothingMailTypeId,
							sendNotifyMailTiming: sendNotifyMailTiming,
						}
						this.workflowService.doEvent(event)
							.subscribe(
							(object: any) => {
								object.objId = event.objId;
								object.finalApprove = finalApprove;
								successData.push(object);
								postProc();
							},
							(err) => {
								postProc();
							});
					} else {
						postProc();
					}
				}
			}
		);
	}


	/**
	 * ステータスリストから遷移先のベースステータスタイプを取得します.
	 * @param ドキュメント
	 * @return 遷移先のベースステータスタイプ
	 */
	public getForcastStatusTypeKind(document: EIMApproveDocumentDTO): number {
		let statusKind = 0;
		for (let i = 0; i < document.statusList.length; i++) {
			if (Number(document.forcastStatusTypeId) === Number(document.statusList[i].statusTypeId)) {
				statusKind = Number(document.statusList[i].statusKind);
			}
		}
		return statusKind;
	}

	/**
	 * 実行ボタン押下可否を返却します.
	 * @return 実行ボタン押下可否
	 */
	public executable(): boolean {
		return this.executableFlag;
	}


	/**
	 * 処理を変更後の設定値を変更します.
	 * @param document ドキュメント
	 */
	public doProcessingChange(document: EIMApproveDocumentDTO): void {
		// 各ボタンの活性非活性の制御
		this.validateExecute();
	}

	/**
	 * 処理を変更します.
	 * @param processing 変更処理内容
	 */
	public doAllProcessingChange(processing: string): void {
		for (let i = 0; i < this.documentList.getData().length; i++) {
			let doc: EIMApproveDocumentDTO = this.documentList.getData()[i];
			doc.functionType = processing;

		}

		// 各ボタンの活性非活性の制御
		this.validateExecute();
	}

	/**
	 * メイン画面への反映なしのプロパティダイアログを表示します.
	 * @param selectedData 選択データ
	 */
	public showProperty(selectedData: EIMApproveDocumentDTO): void {
		let dialogId: string = this.dialogManagerComponentService.showProperty(selectedData, false,
			{
				updated: (data) => {
					this.dialogManagerComponentService.close(dialogId);
					this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00002'));
				},
				errored: () => {
					this.dialogManagerComponentService.close(dialogId);
				}
			});
	}

	/**
	 * ステータス属性ダイアログを表示します.
	 * @param selectedData 選択データ
	 */
	public showStatus(selectedData: EIMApproveDocumentDTO[]): void {
		let dialogId: string = this.dialogManagerComponentService.showContentsStatusProperty(selectedData[0],
			{
				errored: () => {
					this.dialogManagerComponentService.close(dialogId);
				}
			});
	}

	/**
	 * チェックインダイアログを表示します.
	 * @param selectedData 選択データ
	 */
	public showCheckIn( selectedData: any[] ): void {
		let dialogId: string = this.dialogManagerComponentService.showCheckIn( selectedData , this.workspaceObjId ,
			{
				executed: (checkInDetail) => {
					for (let i = 0; i < selectedData.length; i++ ) {
						for (let j = 0; j < checkInDetail.successList.length; j++) {
							if (Number(selectedData[i].objId) === Number(checkInDetail.successList[j].objId)) {
								selectedData[i].objName = checkInDetail.successList[j].objName;
								this.checkinObjIdArray.push({objId: Number(checkInDetail.successList[j].objId)});

							}
						}
					}
					if (selectedData.length === checkInDetail.uploadCount ) {
						this.dialogManagerComponentService.close( dialogId );
						this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00003'));
					}
					this.documentList.refreshView();
				},
				errored: () => {
					this.dialogManagerComponentService.close( dialogId );
				}
			});
	}
	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<any>): void {
		if (this.checkinObjIdArray.length > 0) {
			this.closed.emit(this.checkinObjIdArray);
			this.dialogManagerComponentService.close('APPROVE_EXECUTOR');
		} else {
			this.dialogManagerComponentService.close('APPROVE_EXECUTOR');
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: (EIMDataGridColumn | EIMDataGridColumnGroup)[] = [];
		// 処理
		columns.push({field: 'functionType', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_03050'), width: 80, cellRendererFramework: EIMFunctionTypeRendererComponent, headerClass: 'column-bottom-plus eim-editable-column-header column-bottom-plus', suppressFilter: true, suppressSorting: true, pinned: true, suppressMovable: true});
		// 編集
		if (this.serverConfigService.enableApproverCheckinFlg) {
			columns.push({field: 'edit', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02058'), headerClass: 'column-bottom-plus', width: 70, cellRendererFramework: EIMDirectEditingRendererComponent, suppressSorting: true, suppressFilter: true, pinned: true, suppressMovable: true});
		}
		// 名称
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM.LABEL_02002'), headerClass: 'column-bottom-plus', width: 190, cellRendererFramework: EIMObjectNameRendererComponent, suppressFilter: true , pinned: true, suppressMovable: true});
		// 履歴
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), headerClass: 'column-bottom-plus', width: 50,
			suppressFilter: true, cellRendererFramework: EIMHistoryRendererComponent, valueGetter: this.historyRendererComponentService.valueGetter , suppressMovable: true});
		// 場所
		if (this.serverConfigService.enableApproverCheckinFlg) {
			columns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), headerClass: 'column-bottom-plus', width: 120, cellRendererFramework: EIMPlaceRendererComponent, suppressFilter: true, suppressMovable: true});
		} else {
			columns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), headerClass: 'column-bottom-plus', width: 190, cellRendererFramework: EIMPlaceRendererComponent, suppressFilter: true, suppressMovable: true});
		}
		// 依頼者
		columns.push({field: 'requestUserName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02101'), headerClass: 'column-bottom-plus', width: 100, suppressFilter: true, suppressMovable: true});
		// 依頼日時
		columns.push({field: 'requestDateLong', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02102'), headerClass: 'column-bottom-plus', width: 90, suppressFilter: true,
			cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, suppressMovable: true, comparator: this.dateService.dateComparator});
		// 承認依頼情報
		columns.push({headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02211'), children: [
				// 回付コメント
			{type: EIMDataGridColumnType.largeText, cellEditorParams: {maxLength: EIMDocumentsConstantService.STRING_MAX_LENGTH},
					field: 'comment', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02205'),
				width: 230, headerClass: 'eim-editable-column-header', suppressFilter: true, editable: true, suppressMovable: true},
				// 承認依頼通知タイミング
			{field: 'notificationType', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02078'), width: 120, cellRendererFramework: EIMNotificationTypeRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true, suppressMovable: true,
			cellStyle: function(params) { return { 'border-left': '0px', 'border-bottom': '0px', 'border-top': '0px', padding: 0 }}},
		]});
		// 公開通知情報
		columns.push({headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02212'), children: [
		// 公開通知先
			{field: 'destination', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02076'), width: 160, cellRendererFramework: EIMPublicDestinationRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true, suppressMovable: true},
			// 公開通知コメント
			{type: EIMDataGridColumnType.largeText, cellEditorParams: {maxLength: EIMDocumentsConstantService.STRING_MAX_LENGTH},
				field: 'publicComment', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02208'),
				width: 230, headerClass: 'eim-editable-column-header', suppressFilter: true, editable: true, suppressMovable: true},
			// 通知タイプ
			{field: 'sendNotifyMailTiming', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02078'), width: 120, cellRendererFramework: EIMPublicNotificationTypeRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true, suppressMovable: true},
		]});
		this.documentList.setColumns(columns);
		this.documentList.setRowHeight(EIMConstantService.APPROVE_ROW_HEIGHT);

		// オプション判定
		this.isVisibleOptionMenuItems();
		// 画面表示処理
		this.show();
	}

	/**
	 * グリッド内名前選択イベントハンドラ.
	 * @param event イベント
	 */
	onNodeSelectEmit(event: any) {
		// 名前選択イベントエミッタをエミット
		this.onNodeSelect.emit(event);
		// 承認画面を閉じる
		this.dialogManagerComponentService.close('APPROVE_EXECUTOR');
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		if (!this.destinationDeleteCompleted.closed) { this.destinationDeleteCompleted.unsubscribe(); }
		if (!this.destinationDoubleClickCompleted.closed) { this.destinationDoubleClickCompleted.unsubscribe(); }
		if (!this.functionTypeChanged.closed) { this.functionTypeChanged.unsubscribe(); }
	}

	/**
	 * ドキュメント選択イベントハンドラです.
	 * @param event イベント
	 */
	onSelect(event: any[]): void {
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
	 * データグリッドメニューのコピーボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickCopy(event: any): void {
		let selectedData: EIMApproveDocumentDTO[]  = this.documentList.getSelectedData();
		let currentApprover: any[];

		// コピー対象件数確認
		if (selectedData === null || selectedData.length !== 1) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00039'));
			return;
		}
		// コピーする
		this.copyItem = selectedData[0].makeCopy();
		this.copyItem.workflow = this.workflowDiagram.getWorkflow();
		this.validateReset(false);
	}

	/**
	 * データグリッドメニューの貼り付けボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickPaste(event: any): void {
		let items: EIMApproveDocumentDTO[] = this.documentList.getSelectedData();
		let failItem: any = [];

		// 貼付け先が選択されていない場合、処理を行わない
		if (items == null || items === undefined || items.length <= 0) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00008'));
			return;
		}

		// 貼り付け処理
		for (let i = 0; i < items.length; i++ ) {
			let pasteItem = this.copyItem.makeCopy();
			pasteItem.workflow = this.copyItem.workflow;
			items[i].comment = pasteItem.comment;
			items[i].publicComment = pasteItem.publicComment;
			items[i].sendNotifyMailTiming = pasteItem.sendNotifyMailTiming;
			items[i].notificationType = pasteItem.notificationType;

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
						destStatusList[j].approver = copyStatusList[k].approver;
						destStatusList[j].approverName = copyStatusList[k].approverName;
						destStatusList[j].approverId = copyStatusList[k].approverId;
						destStatusList[j].displayFlag = copyStatusList[k].displayFlag;

						// 「保留」の場合には、finalApproveは無視する
						if (pasteItem.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_WAIT) {
							destStatusList.finalApprove = '';
						}
						// 「差戻す」の場合には、finalApproveは無視する
						if (pasteItem.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_BACK) {
							destStatusList.finalApprove = '';
						// 「承認」の場合
						} else if (pasteItem.functionType === EIMConstantService.EVENT_FUNCTION_TYPE_APPROVE) {
							destStatusList[j].finalApprove = copyStatusList[k].finalApprove;
						}
						// 承認者依頼描写用
						items[i].currentApprover = pasteItem.currentApprover;
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
			this.doProcessingChange(items[i]);

			// 現行ステータスより後のステータスタイプ情報を上書きする
			let workflow: EIMWorkflow = pasteItem.workflow;
			this.approveInfoManager.setOriginalStatusTypes(items[i].objId, workflow.statusTypes);
			this.approveInfoManager.setUpdatedStatusTypes(
				items[i].objId, workflow.statusTypes, true, true);

			// 承認ルートが存在するかどうか上書きする（実行ボタン活性の判定で使用）
			let updatedStatusTypes = this.approveInfoManager.getUpdatedStatusTypes(items[i].objId);
			let routeEventTypes = this.contentsApproveWorkflowDiagramComponentService.getApproveRoute(Number(items[i].step), updatedStatusTypes, workflow.eventTypes);
			this.approveInfoManager.setRouteEventTypes(items[i].objId, routeEventTypes);
		}
		// 貼付け失敗ドキュメントが存在する場合、ダイアログで一覧表示
		if (failItem.length !== 0) {
			let failItemName: string[] = [] ;

			for (let i = 0; failItem.length > i ; i++) {
				failItemName.push(failItem[i].objName);
			}
			this.messageService.showMultipleLines(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00041'), failItemName ,
			() => {});
		}
		this.documentList.refreshView();
		this.showWorkflow();
		// 実行ボタンの活性非活性の制御
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
		// ワークスペースが選択されている場合
		if (this.workspaceObjId != null) {
		    this.changeProperty.emit(params);
		} else {
		    this.showProperty(selectData[0]);
		}
	}

	/**
	 * データグリッドメニューのステータス属性ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickStatus(event: any): void {
		this.showStatus(this.documentList.getSelectedData());
	}

	/**
	 * データグリッドメニューのPDF出力設定ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickPdfOutputSetting(event: any): void {
		let activityFlag = false;
		let parentWin = 'actApprove';
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
		});
	}

	/**
	 * データグリッドメニューのチェックインボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickCheckIn( event: any ): void {
		let items: any[] = this.documentList.getSelectedData();
		let errorFlag = false;
		let signencr = false;

		for (let i = 0; i < items.length; i++ ) {
			// ドキュメント以外が選択された場合
			if (items[i].isDocument === this.FLAG_FALSE || items[i].isDocument === false) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00006'));
				return;
			} else if (items[i].signencr === Number(EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR)) {
				signencr = true;
			}

			// 公開PDFの事前登録がされている場合
			if (items[i].isPdfPreRegistered === this.FLAG_TRUE || items[i].isPdfPreRegistered === true) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00131', {value: items[i].objName}));			
				return;
			}
		}

		// 署名・暗号化済のものがあれば確認
		if (signencr) {
			// 確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00034'),
			() => {
				this.showCheckIn( this.documentList.getSelectedData());
			});
		} else {
			this.showCheckIn( this.documentList.getSelectedData());
		}
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
	 * ダイアグラムのステータス情報更新時のイベントハンドラです.
	 * @param event イベント
	 */
	onStatusTypeChanged(event: EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged): void {

		this.approveInfoManager.setUpdatedStatusTypes(this.documentList.getSelectedData()[0].objId, [event.statusType], event.isSkipChanged, event.isUserListChanged);
		this.approveInfoManager.setRouteEventTypes(this.documentList.getSelectedData()[0].objId, event.routeEventTypes);

		this.validateExecute();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 */
	private show(): void {

		let objects: EIMApproveDocumentDTO[] = [];
		let isError = false;

		// 対象件数
		let targetCount: number = this.contentsObjs.length;
		// 処理件数
		let procCount = 0;
		// エラー件数
		let errorCount = 0;

		// 処理待ちポップアップ用
		if (targetCount === 0) {
			this.approveService.getList()
				.subscribe(
				(list: EIMApproveDocumentDTO[]) => {
					if (list.length === 0) {
						this.noRequest.emit();
					}
					objects = list;
					let targets: any[] = [];
					for (let i = 0; i < objects.length; i++) {
						objects[i].tmpFunctionType = this.functionType;
						objects[i].functionType = this.functionType;
						// WF付フォルダ
						if (objects[i].isDocument === false ) {
							objects[i].isWorkflowFolder = this.FLAG_TRUE;
							objects[i].objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
							objects[i].objName = objects[i].fullPath;
						}
					}
					// メイン画面の並び順(オブジェクト名)でソート
					objects = objects.sort((obj1: any, obj2: any) => {
						if (obj1.isDocument === obj2.isDocument) {
							if (obj1.objName < obj2.objName) {return -1; }
							if (obj1.objName > obj2.objName) {return 1; }
							return 0;
						} else if (obj1.isWorkflowFolder && (obj1.isWorkflowFolder === this.FLAG_TRUE || obj1.isWorkflowFolder === true)) {return -1;
						} else {return 1; }
					});
					this.documentList.setData(objects);
					targets.push(this.documentList.getData()[0]);
					this.documentList.select(targets, false);

					// 承認情報マネージャ初期化
					this.approveInfoManager = this.approveInfoManagementService.getManager(objects);
					this.validateExecute();

				// エラー時は画面を閉じる
				}, (err: any) => {
					window.setTimeout(() => {
						this.errored.emit();
					})
				});
		}

		// 承認対象ドキュメントをループで取得
		for (let i = 0; i < this.contentsObjs.length; i++) {
			// 承認対象ドキュメント取得
			this.approveService.getListByContentsId(this.contentsObjs[i].objId)
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
				(object: EIMApproveDocumentDTO[]) => {
					// 取得結果を保持
					object[0].tmpFunctionType = this.functionType;
					object[0].functionType = this.functionType;
					// WF付きフォルダ
					if (this.contentsObjs[i].isWorkflowFolder === this.FLAG_TRUE || this.contentsObjs[i].isWorkflowFolder === true) {
						object[0].isWorkflowFolder = this.contentsObjs[i].isWorkflowFolder;
						object[0].objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
						object[0].objName = object[0].fullPath;
					}
					objects.push(object[0]);
				},
				(err) => {
					// エラー
					errorCount++;
				});

		}
	}

	/**
	 * 実行ボタン活性を制御します.
	 */
	private validateExecute(): void {
		window.setTimeout(() => {
			// 実行ボタン押下可否取得
			let existsNotWait = false;
			this.executableFlag = true;
			for (let i = 0; i < this.documentList.getData().length; i++) {
				let document: EIMApproveDocumentDTO = this.documentList.getData()[i];

				// 保留以外が存在するかどうかチェック
				if (document.functionType !== EIMConstantService.EVENT_FUNCTION_TYPE_WAIT) {
					existsNotWait = true;
				}
				// 承認以外であれば以降のチェックは無視する
				if (document.functionType !== EIMConstantService.EVENT_FUNCTION_TYPE_APPROVE) {
					continue;
				}
				if (this.approveInfoManager.isLastApproveStatusType(document.objId)) {
					// 最終承認であれば以降のチェックは無視する
					document.noApprover = true;
					continue;
				} else {
					document.noApprover = false;
				}

				// 承認ルートがあるかどうかチェック
				if (!this.approveInfoManager.existsApproveRoute(document.objId)) {
					this.executableFlag = false;
					continue; // noApprover設定のためループ続行
				}
				// 次のステータスタイプの承認者が設定されているかチェック
				let forcastStatusTypeId = this.approveInfoManager.getForcastStatusTypeId(document.objId);
				let approvers = this.approveInfoManager.getApproversByStatusTypeId(document.objId, forcastStatusTypeId);
				if (!approvers || approvers.length === 0) {
					this.executableFlag = false;
					continue; // noApprover設定のためループ続行
				}
			}
			if (!existsNotWait) {
				// 全件保留の場合は実行不可
				this.executableFlag = false;
				return;
			}
		});
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
			if (selectedData[0].functionType === EIMConstantService.EVENT_FUNCTION_TYPE_APPROVE) {
				params['nextStatusTypeId'] = Number(selectedData[0].forcastStatusTypeId);
			} else if (selectedData[0].functionType === EIMConstantService.EVENT_FUNCTION_TYPE_BACK) {
				params['nextStatusTypeId'] = 0;
			}
			params['updatedStatusTypes'] = this.approveInfoManager.getUpdatedStatusTypes(selectedData[0].objId);
			params['approveInfoManager'] = this.approveInfoManager;
		}
		this.workflowDiagram.show(params, () => {
			this.validateExecute();
		});
	}

	/**
	 * 承認者情報を取得します.
	 * @param params パラメータ
	 * @return 承認者一覧
	 */
	private setApprover(params: EIMApproveDocumentDTO): EIMEntryUserDTO[] {
		for (let i = 0; i < params.statusList.length; i++) {
			let statusType: EIMApproveStatusDTO = params.statusList[i];
			if (Number(params.forcastStatusTypeId) === Number(statusType.statusTypeId)) {
				params.noApprover = (statusType.finalApprove);
				return statusType.approver;
			}
		}
		params.noApprover = false;
		return [];
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
								break;
							}
						}
					}
				}
			}
		}
		this.validateExecute();
	}

	/**
	 * ボタン及びコンテキストメニューの活性状態を変更します.
	 * @param disabled 活性可否
	 */
	private validateReset(disabled: boolean): void {
		for (let i = 0; i < this.menuItems.length; i++) {
			// 複数選択時の活性状態
			if (this.documentList.getSelectedData().length >= 2 ) {
				// 貼り付けメニュー活性
				if (this.menuItems[i].label === this.translateService.instant('EIM_DOCUMENTS.LABEL_02058')) {
					this.menuItems[i].disabled = false;
					this.menuItemCopy.disabled = disabled;
					this.menuItemPaste.disabled = false;
					// コピー情報が存在しない場合、貼り付けメニューを非活性
					if (this.copyItem === undefined || this.copyItem == null || Object.keys(this.copyItem).length <= 0) {
						this.menuItemPaste.disabled = true;
						this.menuItems[i].disabled = disabled;
					}
				// 処理メニュー活性
				} else if (this.menuItems[i].label === this.translateService.instant('EIM_DOCUMENTS.LABEL_03050')) {
					this.menuItems[i].disabled = false;
				} else {
					// チェックインメニュー活性
					this.menuItems[i].disabled = disabled;
					this.menuCheckIn.disabled = false;
					this.menuProperty.disabled = disabled;
					this.menuStatus.disabled = disabled;
				}
			} else {
				// 処理メニューは常に活性
				if (this.menuItems[i].label === this.translateService.instant('EIM_DOCUMENTS.LABEL_03050')) {
					this.menuItems[i].disabled = false;
				// 編集メニュー
				} else if (this.menuItems[i].label === this.translateService.instant('EIM_DOCUMENTS.LABEL_02058')) {
					this.menuItemPaste.disabled = disabled;
					this.menuItemCopy.disabled = disabled;
					this.menuItems[i].disabled = disabled;
					// コピー情報が存在しない場合、貼り付けメニューを非活性
					if (this.copyItem === undefined || this.copyItem == null || Object.keys(this.copyItem).length <= 0 ) {
						this.menuItemPaste.disabled = true;
					}
				} else {
					this.menuItems[i].disabled = disabled;
					this.menuProperty.disabled = disabled;
					this.menuStatus.disabled = disabled;
				}
			}
		}
	}

	/**
	 * 承認情報の貼り付け時、WF、ステータス、セキュリティのチェックをします.
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
		// WF、ステータス、セキュリティが条件を満たしたため、承認情報を貼り付け
			return true;
		}
	}

	/**
	 * PDF出力設定、チェックインオプションメニューの表示状態を変更します.
	 */
	private isVisibleOptionMenuItems(): void {
		for (let i = 0; i < this.menuItems.length; i++) {
			if (this.menuItems[i].label === this.translateService.instant('EIM_DOCUMENTS.LABEL_03094')) {
				this.menuItems[i].visible = false;
				if (this.serverConfigService.digitalSignatureFlg) {
					this.menuItems[i].visible = true;
				} else {
					this.menuItems[i].visible = false;
				}
			} else if (this.menuItems[i].label === this.translateService.instant('EIM_DOCUMENTS.LABEL_03029')) {
				if (this.serverConfigService.enableApproverCheckinFlg) {
					this.menuItems[i].visible = true;
				} else {
					this.menuItems[i].visible = false;
				}
			}
		}
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
	 * 承認者依頼,公開通知先のデータを貼り付けます.
	 * @param items 貼付け先データ
	 * @param pasteItem 貼付け元データ
	 * @return 貼付け先データ
	 */
	private pastedData(items: any, pasteItem: any): any {
		for (let i = 0; i < pasteItem.currentApprover.length; i++) {
			items.approver[i] = Object.assign({}, pasteItem.approver[i]);
		}
		for (let i = 0; i < pasteItem.destination.length; i++) {
			items.destination[i] = Object.assign({}, pasteItem.destination[i]);
		}
		return items;
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
