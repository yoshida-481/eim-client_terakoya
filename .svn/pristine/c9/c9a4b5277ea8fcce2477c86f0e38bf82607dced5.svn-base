import { Component, forwardRef, EventEmitter, Input, Output, ViewChild, OnInit, HostListener } from '@angular/core';
import { FormBuilder, UntypedFormGroup, NgForm, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { SelectItem } from 'primeng/api';
import { EIMComponent, EIMCreatable, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridColumn, EIMDataGridComponent, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';
import { EIMDialogManagerComponentService, dialogName} from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMObjectNameRendererComponentService } from 'app/documents/shared/components/renderer/object-name-renderer.component.service';
import { EIMProcessingResultRendererComponent } from 'app/documents/shared/components/renderer/processing-result-renderer.component';
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';
import { EIMExpirationDateRendererComponent } from 'app/documents/shared/components/renderer/expiration-date-renderer.component';
import { EIMTextEditorRendererComponent } from 'app/documents/shared/components/renderer/text-editor-renderer.component';
import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMDocumentService } from 'app/documents/shared/services/apis/document.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/** 画面状態定数 */
export namespace stateConst {
	export const EDITING = 'editing';
	export const CREATING = 'creating';
	export const COMPLETE = 'complete';
}

/**
 * ドキュメント一括登録コンポーネント
 * @example
 *
 *      <eim-lump-document-creator
 *          [parentObjId]="parentObjId"
 *          [workspaceObjId]="workspaceObjId"
 *          [path]="path">
 *      </eim-lump-document-creator>
 */
@Component({
    selector: 'eim-lump-document-creator',
    templateUrl: './lump-document-creator.component.html',
    styleUrls: ['./lump-document-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMLumpDocumentCreatorComponent) },
        SelectModule
    ],
    standalone: false
})

export class EIMLumpDocumentCreatorComponent implements OnInit, EIMCreatable {

	/** フォーム */
	@ViewChild('lumpDocumentForm', { static: true }) lumpDocumentForm: NgForm;

	/** ドキュメントリスト */
	@ViewChild('documentList', { static: true })
		documentList: EIMDataGridComponent;

	/** アップローダ */
	public uploader: FileUploader = new FileUploader({url:""});

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram', { static: true })
		workflowDiagram: EIMDiagramComponent;

	/** ワークスペースオブジェクトID */
	@Input()
		workspaceObjId: number;

	/** 親オブジェクトID */
	@Input()
		parentObjId: number;

	/** パス */
	@Input() path = '';

	/** 登録完了時のイベントエミッタ */
	@Output() created: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** フォームグループ */
	public form: UntypedFormGroup;

	/** タイプ一覧表示データ */
	public typeSelectItems: SelectItem[] = [];

	/** 選択したタイプID */
	public selectedTypeId: number;

	/** 前回選択したタイプID */
	public preSelectedTypeId: number;

	/** 名前 */
	public name: string = null;

	/** 作成者 */
	public createUser: EIMUserDomain;

	/** ZIP拡張子 */
	public ZIP_EX = EIMDocumentsConstantService.ZIP_EXTENSION;

	/** 状態 */
	public STATE = stateConst;
	public state = stateConst.EDITING;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected documentFormService: EIMDocumentFormService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected messageService: EIMMessageService,
		protected objectTypeService: EIMObjectTypeService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected dateService: EIMDateService,
		protected serverConfigService: EIMServerConfigService,
	) {
		this.createUser = this.documentsCacheService.getLoginUser();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ドキュメントを一括登録します.
	 */
	public create(): void {
		let targetDocumentList: any[] = this.documentList.getData();
		// キューに格納されているファイルアイテム数分処理を繰り返す
		for (let i = 1; i < this.uploader.queue.length; ) {
			// ファイルアイテム数が2件以上の場合
			if (i < this.uploader.queue.length) {
				this.uploader.removeFromQueue(this.uploader.queue[0]);
			}
		}

		let fileItem: FileItem = this.uploader.queue[0];
		let document: any = targetDocumentList[0];
		fileItem['eimAdditionalParameter'] = {};
		fileItem['eimAdditionalParameter']['objId'] = this.parentObjId;

		// リクエストパラメータを設定
		let additionalParameter: any = {
				objId: this.parentObjId,
				fileName: fileItem.file.name,
				documentTypeId: this.selectedTypeId,
				createUserId: this.createUser.id,

		};

		// 一括登録確認画面へ
		this.documentFormService.uploadZIPFile(this.uploader, fileItem, additionalParameter).subscribe(
			(data: any) => {

				let dataList = this.documentList.getData();
				dataList[0].isSuccess = true;
				let listData = data.object;
				let objId = data.attr.objId;
				let okData = [];
				let property = dataList[0].file.property;
				let expirationDate = '';
				if (dataList[0].date[0] !== '') {
					expirationDate = this.dateService.getDateTimeString(dataList[0].date[0]);
				}
				let createUserId = this.createUser.id;
				let documentTypeId = this.selectedTypeId;
				if (listData) {

					if (listData.length && listData.length > 0) {
						for ( let n = 0; n < listData.length; n++) {
							okData.push(this.conv(listData[n].attr));
						}
					}	else {
						okData.push(this.conv(listData.attr));
					}
				}
				let dialogId: any = this.dialogManagerComponentService.showLumpDocumentCreatorConfirmation(objId, okData, property, expirationDate, createUserId, documentTypeId, {
					created: (createData) => {
						this.created.emit(createData);
						this.dialogManagerComponentService.close(dialogId);
					},
					closed: () => {
						if (dataList[0].isSuccess) {
							dataList[0].isSuccess = false;
						}
						if (dataList[0].isError) {
							dataList[0].isError = false;
						}
					}
				});
			},
			(err: any) => {
				window.setTimeout(() => {
					this.errored.emit();
				})
				// エラー発生時
				this.dialogManagerComponentService.close(dialogName.LUMP_DOCUMENT_CREATOR);
				let dataList = this.documentList.getData();
				dataList[0].isError = true;
			}
		);
	}

	/**
	 * 一括登録可否を返却します.
	 * @return フォルダ登録可否
	 */
	public creatable(): boolean {
		return this.documentList && this.documentList.getData().length > 0 && this.lumpDocumentForm.valid;
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event: any, close: EventEmitter<null>): void {
		event.preventDefault();
		if (this.lumpDocumentForm.dirty) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'), () => {
				close.emit();
			});
		} else {
			close.emit();
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 作成者選択ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	public displayUserSelector(event: any): void {
		let dialogId: string = this.dialogManagerComponentService.showAccessCheckedUserSelector(this.parentObjId, {
			selected: (createUser: any[]) => {
				this.dialogManagerComponentService.close(dialogId);
				this.onSelectCreateUser(createUser);
			}
		});
	}

	/**
	 * 作成者選択イベントハンドラ
	 * @param users 選択されたユーザ情報
	 */
	public onSelectCreateUser(users: any[]): void {
		let createUser: EIMUserDomain = new EIMUserDomain();
		createUser.id = users[0].id;
		createUser.name = users[0].name;
		createUser.code = users[0].code;
		createUser.kana = users[0].kana;
		createUser.mail = users[0].mail;
		this.createUser = createUser;
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// ドキュメントタイプ一覧取得
		this.objectTypeService.getHierarchical(this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT).subscribe(
			(hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
				this.setTypeSelectItems(hierarchicalContentsType, null);
			},
			(err: any) => {
				window.setTimeout(() => {
					this.errored.emit();
				})
				this.dialogManagerComponentService.close(dialogName.LUMP_DOCUMENT_CREATOR);
			}
		);
		window.setTimeout(() => {
			let columns: EIMDataGridColumn[] = [];
			columns.push({field: 'isSuccess', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02013'), width: 60, cellRendererFramework: EIMProcessingResultRendererComponent, suppressFilter: true, suppressSorting: true});
			columns.push({field: 'file.name', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 220, suppressFilter: true, suppressSorting: true});
			columns.push({field: 'file.property', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02028'), width: 210, cellEditorFramework: EIMTextEditorRendererComponent, editable: true, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true});
			columns.push({field: 'date', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02090'), width: 190, cellRendererFramework: EIMExpirationDateRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true, suppressSorting: true});
			this.documentList.setColumns(columns);
			this.documentList.setRowHeight(44);

			// ファイル追加イベントハンドラ設定
			this.uploader.onAfterAddingAll = (fileItems: FileItem[]) => {
				this.checkFileObject(fileItems);
			};
		});
	}

	/**
	 * ファイル追加イベントハンドラ
	 * @param fileItems 追加するファイル配列
	 */
	onAddFiles(fileItems: FileItem[]): void {
		if (!fileItems || fileItems.length === 0) {
			return;
		}
		// ファイル一覧に追加、選択
		this.documentList.setData([]);
		fileItems[0].file['property'] = '';
		fileItems[0]['date'] = [''];
		this.documentList.addRowData(fileItems);
		this.documentList.select([fileItems[0]], false);
	}

	/**
	 * タイプ変更イベントハンドラ
	 * @param event イベント
	 */
	onChangeType(event: any): void {
		this.changeType();
	}

	/**
	 * タイプ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickShowObjectTypeSelector(event: any): void {
		// ドキュメントタイプツリーを表示する
		let dialogId: string = this.dialogManagerComponentService.showObjectTypeTreeSelector(
			null, this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT, {
				selected: (documentType: any) => {
					this.dialogManagerComponentService.close(dialogId);
					this.selectedTypeId = documentType.id;
					this.changeType();
				}
			}
		);
	}

	/**
	 * ワークフローダイアグラムエラー時イベントハンドラ
	 */
	workflowDiagramErroed(): void {
		this.selectedTypeId = null;
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * ドキュメントタイプ変更処理です.
	 * ワークフローを更新します.
	 */
	private changeType(): void {
		// ワークフロー表示初期化
		let objTypeId: number = this.selectedTypeId;
		this.workflowDiagram.clear();
		this.workflowDiagram.show({createType: 'document', objTypeId: objTypeId, workspaceId: this.parentObjId});
		this.preSelectedTypeId = this.selectedTypeId;
	}

	/**
	 * タイプコンボボックス用のデータを生成します.
	 * @param objectTypes オブジェクトタイプ情報
	 * @param typeSelectItems オブジェクトタイプ情報配列
	 */
	private setTypeSelectItems(objectTypes: EIMHierarchicalObjectTypeDomain[], typeSelectItems: SelectItem[]): void {
		// 再帰呼び出しでは、typeSelectItemsにリストを追加していく
		let tmp:SelectItem[] = (typeSelectItems == null) ? [] : typeSelectItems;

		for (let i = 0; i < objectTypes.length; i++) {
			let objectType: EIMHierarchicalObjectTypeDomain = objectTypes[i];
			if (objectType.children && objectType.children.length === 0) {
				// 末端
				tmp.push({label: objectType.name, value: objectType.id});
			} else {
				this.setTypeSelectItems(objectType.children, tmp);
			}
		}

		//変更通知を出すため、再帰呼び出しではない最初の呼び出しの最後で、this.typeSelectItemsに設定する
		if(typeSelectItems == null){
			this.typeSelectItems = tmp;
		}
	}

	/** 型変換を行います。
	 *@param obj 登録対象オブジェクト
	 *@return 型変換結果
	 */
	private conv(obj: any): any {

		let objTypeName = '';
		if (obj.objType === 'folder') {
			objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
		} else if (obj.objType === 'document') {
			objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT;
		}
		return {
			checkinFlag: obj.checkinFlag,
			objName: obj.objName,
			objType: obj.objType,
			path: obj.path,
			reason: obj.reason,
			uploadStatus: Number(obj.uploadStatus),
			objTypeName: objTypeName
		}
	}

	/**
	 * ZIPファイルかどうか、ファイルサイズが2GB超えてないかどうか判定を行います．
	 * @param fileItems 追加するファイル配列
	 */
	private checkFileObject(fileItems: FileItem[]): void {
		// 拡張子が".zip"の場合
		if (fileItems[0].file.name.slice(-4) === this.ZIP_EX) {
			// ファイルサイズが2GBを超える場合
			if (fileItems[0].file.size > this.serverConfigService.uploadFileSizeMax) {
				this.messageService.show(EIMMessageType.error, 
					this.translateService.instant('EIM_DOCUMENTS.ERROR_00051', {value: this.serverConfigService.uploadFileSizeMax}));
				this.uploader.removeFromQueue(fileItems[0]);
			} else {
				this.onAddFiles(fileItems);
			}
		} else {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00050')),
			this.uploader.removeFromQueue(fileItems[0]);
		}
	}
}
