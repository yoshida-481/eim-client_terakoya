
import { Component, forwardRef, ViewChild, OnInit, OnDestroy, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { MenuItem } from 'primeng/api';

import { FileSelectDirective, FileDropDirective, FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMFileSelectRendererComponent } from 'app/documents/shared/components/renderer/file-select-renderer.component';
import { EIMFileSelectRendererComponentService } from 'app/documents/shared/components/renderer/file-select-renderer.component.service';
import { EIMDocumentTypeChangeRendererComponent } from 'app/documents/shared/components/renderer/document-type-change-renderer.component';
import { EIMDocumentTypeChangeRendererComponentService } from 'app/documents/shared/components/renderer/document-type-change-renderer.component.service';
import { EIMProcessingResultRendererComponent } from 'app/documents/shared/components/renderer/processing-result-renderer.component';
import { EIMTextEditorRendererComponent } from 'app/documents/shared/components/renderer/text-editor-renderer.component';

import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';

/**
 * チェックインコンポーネント
 * @example
 *
 *      <eim-document-checkin
 *          [content]="content"
 *          [workspaceObjId]="workspaceObjId"
 *      </eim-document-checkin>
 */
@Component({
    selector: 'eim-document-checkin',
    templateUrl: './document-checkin.component.html',
    styleUrls: ['./document-checkin.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentCheckinComponent) }],
    standalone: false
})
export class EIMDocumentCheckinComponent implements OnInit, EIMComponent, EIMExecutable, OnDestroy {

	/** チェックインドキュメントグリッドコンポーネント */
	@ViewChild('documentListGrid', { static: true })
	public documentListGrid: EIMDataGridComponent;

	/** チェックイン完了イベントエミッタ */
	@Output() checkin: EventEmitter<string> = new EventEmitter<string>();

	/** 対象のオブジェクト */
	@Input()
	public contents: any[];

	/** ワークスペースオブジェクトID */
	@Input()
	public workspaceObjId: number;

	/** チェックイン完了イベントエミッタ */
	@Output()
	public executed: EventEmitter<any> = new EventEmitter<any>();

	/** ファイルアップローダー */
	public uploader: FileUploader = new FileUploader({url:""});

	/** 成功件数 */
	public successCount = 0;

	/** 判定関数 */
	private activeTarget: (data: any) => boolean;

	/** チェックインドキュメント対象件数 */
	private targetDocumentCount = 0;
	/** チェックインドキュメント取得件数 */
	private acquiredDocumentCount = 0;

	/** 処理済み件数 */
	private processedCount = 0;

	/** １処理当たりのチェックイン成功データリスト */
	private checkinSuccessList = [];

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

  public disabled = false;

	/** メニュー */
	public menuItems: MenuItem[] = [
 			{
 					label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03001'), disabled: true, command: (event) => {this.onClickDocumentTypeMassUpdate(); }
 			}
	];

	/** コンテキストメニュー */
	public contextMenuItems: MenuItem[] = [
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03001'), disabled: true, command: (event) => {this.onClickDocumentTypeMassUpdate(); }},
	];

	/** グリッドの行の高さ */
	private GRID_ROW_HEIGHT = 35;

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	/**
	 * コンストラクタ.
	 */
  constructor(
  		protected translateService: TranslateService,
  		protected documentFormService: EIMDocumentFormService,
  		protected fileService: EIMFileService,
  		protected dialogManagerComponentService: EIMDialogManagerComponentService,
  		protected fileSelectRendererComponentService: EIMFileSelectRendererComponentService,
  		protected documentTypeChangeRendererComponentService: EIMDocumentTypeChangeRendererComponentService,
  		protected httpService: EIMHttpService,
  		protected jsonService: EIMJSONService,
  		protected messageService: EIMMessageService,
  		protected localStorageService: EIMLocalStorageService,
  		) {

  	/**
  	 * コンポーネント活性条件関数
  	 */
  	this.activeTarget = (data) => {
  		if (data.hasOwnProperty('isSuccess') && data.isSuccess == true) {
  			return false;
  		}
  		return true;
  	}
  	// ファイル選択コンポーネント
  	this.fileSelectRendererComponentService.setActiveTarget(this.activeTarget);
  	// ドキュメントタイプ選択コンポーネント
  	this.documentTypeChangeRendererComponentService.setActiveTarget(this.activeTarget);

  }

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 実行ボタン押下時の処理を実施します.
	 * ドキュメントリスト分のチェックインを実行します.
	 */
  public execute(): void {
  	if (this.localStorageService.getDispConfirmUpdateFile() === "true") {
			this.executeProcess();
		} else {
			// 確認メッセージ
			this.messageService.showCheckBox(EIMMessageType.confirm,
				this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00036'),
				this.translateService.instant('EIM_DOCUMENTS.LABEL_03121'),
				(V:boolean) => {
					if (V) {
						this.localStorageService.setDispConfirmUpdateFile("true");
					} else {
						this.localStorageService.setDispConfirmUpdateFile("false");
					}
				},
				() => {
					this.executeProcess();
				}
			);
		}
	}

	/**
	 * 実行実処理
	 */
	private executeProcess() {
  	// チェックインファイルに同名ファイルが存在しているのかを確認します
  	// (物理パスが異なっていても同一ファイルであればエラーとする)
  	if (this.existsSameFileName()) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00010'));
			return;
  	}

		// ファイルアップロードキューをクリア
		this.uploader.clearQueue();

		let targetDocumentList: any[] = [];

		// キューに格納する
		this.documentListGrid.info.gridApi.forEachNode( (node) => {
			let document: any = node.data;
			let fileItem: FileItem = document.selectedFile;

			// 成功済みのファイルアイテムはキューに格納せずチェックイン対象外とする
			if (document.isSuccess) {
				return;
			}
			// 対象に追加
			targetDocumentList.push(document);
			// ファイルアップローダーのキューに追加
			this.uploader.addToQueue([fileItem._file]);
		});

		// 処理済み件数を0にする
		this.processedCount = 0;
		// １処理当たりのチェックイン成功データリストをクリアする
		this.checkinSuccessList = [];

		// キューに格納しているファイルアイテムで１件ずつチェックインする
		for (let i = 0; i < this.uploader.queue.length; i++) {
			let fileItem: FileItem = this.uploader.queue[i];
			let document: any = targetDocumentList[i];
			fileItem['eimAdditionalParameter'] = {};
			fileItem['eimAdditionalParameter']['objId'] = document.objId;

			// リクエストパラメータを設定
			let additionalParameter: any = {
					objId: document.objId,
					fileName: fileItem.file.name,
					destObjTypeId: document.objTypeId,
					isReturnObjectId: true,
			};
			if (document.updateComment != null) {
				additionalParameter.updateComment = document.updateComment;
			}


			// チェックイン
			this.fileService.checkin(this.uploader, fileItem, additionalParameter).subscribe(
				(data: any) => {
					this.uploadHandler(data);
				},
				(err: any) => {
					this.uploadHandler({objId: err.fileItem['eimAdditionalParameter'].objId}, err.message);
				});

		}

	}

  /**
   * 実行ボタン押下可否を返却します.
   */
	public executable(): boolean {

		// 全て成功している場合は非活性
		if (this.successCount == this.documentListGrid.getData().length) {
			return false;
		}

		// アップロード中の場合は非活性
		if (this.uploader.isUploading) {
			return false;
		}

		// １つでもチェックインファイルが選択されていない場合は非活性
		for (let i = 0; i < this.documentListGrid.getData().length; i++) {
			let rowData: any = this.documentListGrid.getData()[i];
			if (!rowData.selectedFile) {
				return false;
			}
		}

		return true;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 */
	private show(): void {
		if (!this.contents) {
			return;
		}
		let cnt = 0;
		let checkinDocumentList: any[] = [];

		// １件ずつサーバからデータを取得する
		for (let i = 0; i < this.contents.length; i++) {
			this.documentFormService.getCheckinDocument(this.contents[i].objId)
			.subscribe((object: any) => {
				object.isDocument = this.FLAG_TRUE;
				// 取得したデータにワークスペースオブジェクトIDを付加する(レンダラーに渡すため)
				object.workspaceObjId = this.workspaceObjId;
				checkinDocumentList.push(object);
				this.documentListGrid.setData(checkinDocumentList);
				this.acquiredDocumentCount++;
				this.getCheckinDocumentHandler();
			},
			(err: any) => {
				this.getCheckinDocumentHandler();
			});
		}

	}

	/**
	 * チェックインドキュメント取得完了
	 */
	private getCheckinDocumentHandler(): void {
		this.targetDocumentCount++;
		// (失敗を含む)全て取得した場合
		if (this.targetDocumentCount == this.contents.length) {
			// １件でも取得できなかった場合はエラーとして画面を閉じる
			if (this.acquiredDocumentCount < this.contents.length) {
				// 画面を閉じる
				this.dialogManagerComponentService.close('CHECK_IN');
				/*
				window.setTimeout(() => {
					this.errored.emit();
				});
				*/
			}
		}
	}

	/**
	 * ファイルアップロード完了
	 * @param data objId:チェックイン対象オブジェクトID,previousObjId:チェックイン対象オブジェクトの１つ前のオブジェクトID,
	 * 	previousObjId:チェックイン対象オブジェクトの１つ前のオブジェクトにWFが設定さているのかいないのか
	 * @param errorMessage エラーメッセージ
	 */
	private uploadHandler(data: any, errorMessage?: string): void {

		// 処理済み件数をインクリメント
		this.processedCount++;

		// データ特定
		let document: any = null;
		for (let i = 0; i < this.documentListGrid.getData().length; i++) {
			document = this.documentListGrid.getData()[i];
			if (document.objId == data.objId) {
				break;
			}
			document = null;
		}

		// 結果判定
		if (errorMessage) {
			document.isSuccess = false;
			document.isError = true;
			document.errorMessage = errorMessage;
		} else {
			document.isSuccess = true;
			document.isError = false;
			// ファイル名を変更している場合があるので名前をファイル名に変更する
			document.objName = data.objName;
			this.documentListGrid.updateRowData([document]);
			// 成功件数をインクリメント
			this.successCount++;
			// 成功データリストに追加
			this.checkinSuccessList.push({
				objId: data.objId,
				objName: data.objName,
				objHasWF: data.objHasWF,
				previousObjId: data.previousObjId,
				previousObjHasWF: data.previousObjHasWF,
				unlock: data.unlock,
				pastObjId: data.pastObjId,
			});
		}

		// キュー内の全てのデータが処理された場合
		if (this.uploader.queue.length == this.processedCount) {
			if (this.checkinSuccessList.length > 0) {
				// 呼び出し元画面にチェックイン対象IDと1つ前のリビジョンのIDを返却する(画面リフレッシュのため)
				this.executed.emit({successList: this.checkinSuccessList, uploadCount: this.successCount} );
				// メニュー活性非活性制御
				this.activateMenu();
			}
		}

	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit(): void {
		// カラム定義
		let columns: EIMDataGridColumn[] = [];
		// 結果
		columns.push({field: 'result', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02013'), width: 80, suppressSorting: true, suppressFilter: true,
			cellRendererFramework: EIMProcessingResultRendererComponent
		});
		// 名前
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 200, suppressFilter: true,
			cellRendererFramework: EIMObjectNameRendererComponent
		});
		// ファイル
		columns.push({field: 'file', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02014'), width: 280, suppressSorting: true, suppressFilter: true,
			cellRendererFramework: EIMFileSelectRendererComponent
		});
		// 改訂内容
		columns.push({field: 'updateComment', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02015'), width: 200, suppressFilter: true,
			headerClass: 'eim-editable-column-header',
			cellEditorFramework: EIMTextEditorRendererComponent,
			editable: (params: any) => {
				if (params.node.data.isSuccess) {
					return false;
				}
				return true;
			},
		});

		// ドキュメントタイプ
		columns.push({field: '', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02001'), width: 200, suppressSorting: true, suppressFilter: true,
			cellRendererFramework: EIMDocumentTypeChangeRendererComponent
		});

		this.documentListGrid.setColumns(columns);

		// グリッド定義
		this.documentListGrid.setRowHeight(this.GRID_ROW_HEIGHT);

		// 表示処理
		this.show();
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
	 * 行選択イベントハンドラ
	 * @param event イベント
	 */
	public onSelect(event: any) {
		this.activateMenu();
	}

	/**
	 * ドキュメントタイプ一括更新ボタンクリックイベントハンドラ
	 */
	public onClickDocumentTypeMassUpdate(): void {
		 // ドキュメントタイプツリーを表示する
		let selectorId: string = this.dialogManagerComponentService.showObjectTypeTreeSelector(null,
				this.documentListGrid.getData()[0].workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT,
				{
					selected: (documentType: any) => {
						this.dialogManagerComponentService.close(selectorId);

						// 選択されているデータかつ、成功していないデータかつ、activatedFlagがtrueのデータのドキュメントタイプを変更する
						this.documentListGrid.getSelectedData().forEach( (rowData: any) => {
							if ((!rowData.hasOwnProperty('isSuccess') || !rowData.isSuccess) && rowData.activatedFlag == this.FLAG_TRUE) {
								rowData.objTypeId = documentType.id;
								rowData.objTypeName = documentType.name;
								// レンダラーでは加工した値を表示しているので、再表示のためにリフレッシュする
								this.documentListGrid.refreshView();
							}
						});

					}
				});
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * メニューアイテムの活性非活性制御を行う
	 */
	private onContextMenuItem(event: MouseEvent): void {
		this.activateMenu();
	}

	/**
	 * メニューを活性状態を制御する
	 */
	private activateMenu(): void {
		// タイプ一括変更ボタン活性非活性判定
		let selectedData: any[] = this.documentListGrid.getSelectedData();
		if (selectedData.length > 0) {
			let count = 0;
			selectedData.forEach((data, index) => {
				if (data.activatedFlag == this.FLAG_FALSE || data.isSuccess) {
					count++;
				}
			});
			if (count > 0) {
				// 1つでも該当しない場合は非活性状態にする
				this.menuItems[0].disabled = true;
				this.contextMenuItems[0].disabled = true;
			} else {
				this.menuItems[0].disabled = false;
				this.contextMenuItems[0].disabled = false;
			}

		}
	}

	/**
	 * チェックインファイルに同名ファイルが存在しているのかを確認します.
	 * 物理パスが異なっていても同一ファイルであればエラーとする
	 */
	private existsSameFileName(): boolean {
  	let exists = false;
		let fileNameSet: Set<string> = new Set<string>();

		this.documentListGrid.info.gridApi.forEachNode( (node) => {
			let document: any = node.data;
			let fileItem: FileItem = document.selectedFile;
			let fileName: string = fileItem._file.name;
			if (fileNameSet.has(fileName)) {
				exists = true;
			} else {
				fileNameSet.add(fileName)
			}

		});

		return exists;
	}

}
