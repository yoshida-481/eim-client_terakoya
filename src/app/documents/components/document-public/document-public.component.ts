import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMMenuItem } from 'app/shared/shared.interface';

import { EIMPublicDestinationRendererComponent } from 'app/documents/shared/components/renderer/public-destination-renderer.component';
import { EIMPublicNotificationTypeRendererComponent } from 'app/documents/shared/components/renderer/public-notification-type-renderer.component';

import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMPublicDestinationRendererComponentService } from 'app/documents/shared/components/renderer/public-destination-renderer.component.service';

import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

// レンダラー
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMEntry } from 'app/documents/components/document-public-destination-selector/document-public-destination-selector-tree.component.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';
import { EIMCheckboxRendererComponent } from 'app/shared/components/renderer/checkbox-renderer.component';
import { finalize } from 'rxjs/internal/operators/finalize';

/**
 * 公開画面コンポーネント
 * @example
 * 		<eim-document-public
 * 			[documentObjs] = "documentObjs"
 * 			[workspaceObjId] = "workspaceObjId">
 *		</eim-document-public>
 */
@Component({
    selector: 'eim-document-public',
    templateUrl: './document-public.component.html',
    styleUrls: ['./document-public.component.css'],
    providers: [EIMPublicDestinationRendererComponentService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentPublicComponent) }],
    standalone: false
})
export class EIMDocumentPublicComponent implements OnInit, EIMExecutable , OnDestroy {

	/** ドキュメント一覧データグリッド */
	@ViewChild('documentList', { static: true }) documentList: EIMDataGridComponent;
	/** ワークフロー図形 */
	@ViewChild('workflowDiagram', { static: true }) workflowDiagram: EIMDiagramComponent;

	/** 公開対象ドキュメントリスト */
	@Input() documentObjs: any[];
	/** 選択中ワークスペースのオブジェクトId */
	@Input() workspaceObjId: number;

	/** 公開処理完了のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();
	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();
	/** 名前選択イベントエミッタ */
	@Output() onNodeSelect: EventEmitter<any> = new EventEmitter<any>();

	/** 公開通知先削除完了サブスクリプション */
	private destinationDeleteCompleted: Subscription;
	/** 公開通知先ダブルクリック完了サブスクリプション */
	private destinationDoubleClickCompleted: Subscription;
	/** コピーした公開情報 */
	private copyItem = null;

	/** メニュー定義 */
	// 公開通知先選択
	private menuSelectDestination: EIMMenuItem =
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03015'), disabled: true, icon: 'fa fa-plus', command: (event) => {this.onClickSelectDestination(event); }};
	// コピー
	private menuItemCopy: EIMMenuItem =
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03034'), disabled: true, icon: 'eim-icon-copy', command: (event) => {this.onClickCopy(event); }};
	// 貼り付け
	private menuItemPaste: EIMMenuItem =
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03036'), disabled: true, icon: 'eim-icon-paste', command: (event) => {this.onClickPaste(event); }};
	// PDF出力設定
	private menuPdfOutputSetting: EIMMenuItem =
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03094'), disabled: true, icon: 'fa fa-plus', command: (event) => {this.onClickPdfOutputSetting(event); }};

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
		this.menuPdfOutputSetting,
	];

	/** ドキュメント一覧のコンテキストメニュー */
	public contextMenuItems: EIMMenuItem[] = [
		this.menuSelectDestination,
		this.menuSeparator,
		this.menuItemCopy,
		this.menuItemPaste,
		this.menuSeparator,
		this.menuPdfOutputSetting,
	];

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 * @param dialogManagerComponentService ダイアログマネージャーコンポーネントサービス
	 * @param messageService メッセージサービス
	 * @param documentFormService ドキュメント帳票サービス
	 * @param workflowDiagramComponentService ワークフローダイアグラムコンポーネントサービス
	 * @param publicDestinationRendererComponentService 公開通知先レンダラーコンポーネントサービス
	 */
	constructor(
			private translateService: TranslateService,
			private dialogManagerComponentService: EIMDialogManagerComponentService,
			private messageService: EIMMessageService,
			private documentFormService: EIMDocumentFormService,
			private entryService: EIMDocumentsEntryService,
			private publicDestinationRendererComponentService: EIMPublicDestinationRendererComponentService,
			private historyRendererComponentService: EIMHistoryRendererComponentService,
			protected approveService: EIMApproveService,
			protected serverConfigService: EIMServerConfigService
	) {
		this.destinationDeleteCompleted = publicDestinationRendererComponentService.deleted.subscribe((target: any) => {this.deleteDestination(target.documentId, target.entryId); });
		this.destinationDoubleClickCompleted = publicDestinationRendererComponentService.doubleClicked.subscribe(() => {this.onClickSelectDestination(null); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 */
	public show(): void {

		let objects: any[] = [];
		let isError = false;

		// 対象件数
		let targetCount: number = this.documentObjs.length;
		// 処理件数
		let procCount = 0;
		// エラー件数
		let errorCount = 0;

		// 公開対象ドキュメントをループで取得
		for (let i = 0; i < this.documentObjs.length; i++) {

			// 公開対象ドキュメント取得
			this.documentFormService.getImmediatePublicDocument(this.documentObjs[i].objId)
				.pipe(finalize( () => {
					procCount++;
					if (errorCount === targetCount) {
						// 全てエラーの場合、画面を閉じる
						window.setTimeout(() => {
							this.errored.emit();
							isError = true;
						});
					} else if (procCount === targetCount) {
						// メイン画面の並び順(オブジェクト名)でソート
						objects = objects.sort( (obj1: any, obj2: any) => {
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
					}

				}))
				.subscribe(
					(object: any) => {
						// WF付きフォルダ
						if (this.documentObjs[i].isWorkflowFolder === this.FLAG_TRUE || this.documentObjs[i].isWorkflowFolder === true) {
							object.isWorkflowFolder = this.documentObjs[i].isWorkflowFolder;
							object.objName = object.fullPath;
							object.objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
						}
						// 受信確認
						if ((object.reply) === 1) {
							object['receptionconfirmation'] = true;
						} else {
							object['receptionconfirmation'] = false;
						}
						// 取得結果を保持
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
	 * 文書を公開します.
	 */
	public execute(): void {

		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00009'),
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
						if (successData.length === 0) {
							this.errored.emit();
						} else {
							this.executed.emit(successData);
						}
					}
				};

				for (let i = 0; i < this.documentList.getData().length; i++) {
					let document: any = this.documentList.getData()[i];
					if (document.receptionconfirmation) {
						document.reply = 1;
					} else {
						document.reply = 0;
					}
					this.documentFormService.doPublic(document)
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
			}
		);
	}

	/**
	 * 実行ボタン押下可否を返却します.
	 * @return 実行ボタン押下可否
	 */
	public executable(): boolean {
		return true;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 240, cellRendererFramework: EIMObjectNameRendererComponent, suppressFilter: true});
		// 履歴
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), width: 60,
				suppressFilter: true,
				cellRendererFramework: EIMHistoryRendererComponent,
				valueGetter: this.historyRendererComponentService.valueGetter
		});
		// 公開通知先
		columns.push({field: 'destination', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02076'), width: 160, cellRendererFramework: EIMPublicDestinationRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true});
		// 公開通知コメント
		columns.push({type: EIMDataGridColumnType.largeText, cellEditorParams: {maxLength: EIMDocumentsConstantService.STRING_MAX_LENGTH},
				field: 'publicComment', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02208'),
				width: 230, headerClass: 'eim-editable-column-header', suppressFilter: true, editable: true});
		// 公開通知タイミング
		columns.push({field: 'sendNotifyMailTiming', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02078'), width: 130, cellRendererFramework: EIMPublicNotificationTypeRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true});
		// 受信確認
		let visibleFunction = (data: any) => {
			if (data.isDocument === true || data.isDocument === 'true') {
				return true;
			}	else {
				return false;
			}
		}
		columns.push({field: 'receptionconfirmation', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02089'), width: 90, cellRendererFramework: EIMCheckboxRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true, param: {visibleFunction : visibleFunction, displayCenter: true}});
		this.documentList.setColumns(columns);
		this.documentList.setRowHeight(EIMConstantService.APPROVE_ROW_HEIGHT);

		// PDF出力設定オプション判定
		this.isVisibleOptionMenuItems();
		// 画面表示処理
		this.show();
  }

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		if (!this.destinationDeleteCompleted.closed) {this.destinationDeleteCompleted.unsubscribe(); }
		if (!this.destinationDoubleClickCompleted.closed) {this.destinationDoubleClickCompleted.unsubscribe(); }
	}

	/**
	 * グリッド内名前選択イベントハンドラ.
	 * @param event イベント
	 */
	onNodeSelectEmit(event: any) {
		// 名前選択イベントエミッタをエミット
		this.onNodeSelect.emit(event);
		// 承認画面を閉じる
		this.dialogManagerComponentService.close('PUBLIC');
	}

	/**
	 * ドキュメント選択イベントハンドラです.
	 * @param event イベント
	 */
	onSelect(event: any[]) {
		if (!this.documentList.getSelectedData() || this.documentList.getSelectedData().length !== 1) {
			this.validateReset(true);
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
	 * データグリッドメニューのコピーボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickCopy(event: any): void {
		let selectedData: any[] = this.documentList.getSelectedData();
		let currentApprover: any[];

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
			let pasteItem = this.makeCopy(this.copyItem);
			// コメント、通知タイプは無条件で貼り付け
			items[i].publicComment = pasteItem.publicComment;
			items[i].sendNotifyMailTiming = pasteItem.sendNotifyMailTiming;

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
			// 公開通知先
			items[i].destination = pasteItem.destination;
		}
		this.documentList.refreshView();
		// 貼付け失敗ドキュメントが存在する場合、ダイアログで一覧表示
		if (failItem.length !== 0) {
			let failItemName: string[] = [] ;

			for (let i = 0; failItem.length > i ; i++) {
				failItemName.push(failItem[i].objName);
			}
			this.messageService.showMultipleLines(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00041'), failItemName ,
			() => {});
		}
	}

	/**
	 * データグリッドメニューのPDF設定ボタン押下イベントハンドラです.
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

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ワークフロー情報を表示します.
	 */
	private showWorkflow(): void {

		let params: any = {};
		params['objId'] = this.documentList.getSelectedData()[0].objId;
		this.workflowDiagram.show(params);
	}

	/**
	 * 公開通知先を削除します.
	 * @param documentId 文書Id
 	 * @param entryId エントリId
	 */
	private deleteDestination(documentId: number, entryId: number): void {

		// ドキュメントでループ
		for ( let i = 0; i < this.documentList.getData().length; i++) {
			if ( Number(documentId) === Number(this.documentList.getData()[i].objId)) {

				// ドキュメントの公開通知先でループ
				for (let j = 0; j < this.documentList.getData()[i].destination.length; j++) {
					if (Number(entryId) === Number(this.documentList.getData()[i].destination[j].entryId)) {
						// 公開通知先を削除
						this.documentList.getData()[i].destination.splice(j, 1);
						break;
					}
				}
			}
		}
	}

	/**
	 * ボタン及びコンテキストメニューの活性状態を変更します.
	 * @param disabled 活性可否
	 */
	private validateReset(disabled: boolean): void {
		// メニュー活性状態変更
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
	 * 公開情報の貼り付け時、WF、ステータス、セキュリティのチェックをします.
	 * @param checkItem 貼り付け対象リスト
	 * @return 貼り付け可否
	*/
	private checkPasteStatus(checkItem: any): boolean {
		// ステータスタイプのIDが一致しない場合、貼り付け対象外
		if (Number(checkItem.statusTypeId) !== Number(this.copyItem.statusTypeId)) {
			return false;
		}
		// セキュリティのIDが一致しない場合、貼り付け対象外
		if (Number(checkItem.securityId) !== Number(this.copyItem.securityId)) {
			return false;
		} else {
		// WF、ステータス、セキュリティが条件を満たしたため、承認情報を貼り付け
			return true;
		}
	}

	/**
	 * PDF出力設定オプションメニューの表示状態を変更します.
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
				break;
			}
		}
	}
	/**
	 * コピー用データを作成します.
	 * @param selectedData 選択データ
	 * @return コピーデータ
	 */
	private makeCopy(selectedData): any {
		let copyData: any = {
			publicComment: selectedData.publicComment,
			expiration: selectedData.expiration,
			fullPath: selectedData.fullPath,
			isDocument: selectedData.isDocument,
			sendNotifyMailTiming: selectedData.sendNotifyMailTiming,
			objId: selectedData.objId,
			objName: selectedData.objName,
			publisherId: selectedData.publisherId,
			publisherName: selectedData.publisherName,
			reply: selectedData.reply,
			revision: selectedData.revision,
			receptionconfirmation: selectedData.receptionconfirmation,
			securityId: selectedData.securityId,
			statusId: selectedData.statusId,
			statusMDateLong: selectedData.statusMDateLong,
			statusTypeId: selectedData.statusTypeId,
			typeId: selectedData.typeId
		}
		let dest: EIMEntry[] = []
		for (let i = 0; i < selectedData.destination.length; i++) {
			dest.push(selectedData.destination[i]);
		}
		copyData.destination = dest;

		return copyData;
	}
}
