import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output, OnDestroy, ChangeDetectorRef, } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { SelectItem } from 'primeng/api';
import { FileUploader, FileItem, FileLikeObject } from 'ng2-file-upload';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMContentsTypeService } from 'app/documents/shared/services/apis/contents-type.service';

import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';

import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';

import { EIMMenuItem } from 'app/shared/shared.interface';
import { EIMContentsDomain } from 'app/documents/shared/domains/contents.domain';
import { EIMContentsAttributeDomain } from 'app/documents/shared/domains/contents-attribute.domain';
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';

import { dialogName, EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';

import { EIMDocumentService } from 'app/documents/shared/services/apis/document.service';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';

import { EIMProcessingResultRendererComponent } from 'app/documents/shared/components/renderer/processing-result-renderer.component';

import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMAttachementFileInputFormItemComponentService } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';
import { EIMContentsPropertyService, EIMCheckAllPropertyState } from 'app/documents/shared/services/contents-property.service';

import { EIMBoxContentsListComponent } from "../box-contents-list/box-contents-list.component";
import { EIMBoxContentsListComponentService } from "../box-contents-list/box-contents-list.component.service";
import { EIMBoxFileService } from "app/shared/services/apis/box-file.service";
import { EIMDocumentsCheckinRendererComponent } from "app/documents/shared/components/renderer/documents-checkin-renderer.component";
import { EIMContentsAttributeTypeLayoutDomain } from "app/documents/shared/domains/contents-attribute-type-layout.domain";

/** 画面状態定数 */
export namespace stateConst {
	export const EDITING = 'editing';
	export const CREATING = 'creating';
	export const COMPLETE = 'complete';
}

/**
 * ドキュメント登録コンポーネント
 * @example
 *
 *      <eim-document-creator
 *          [parentObjId]="parentObjId"
 *          [workspaceObjId]="workspaceObjId"
 *          [addFileList]="addFileList"
 *          [path]="path">
 *      </eim-document-creator>
 */
@Component({
    selector: 'eim-document-creator',
    templateUrl: './document-creator.component.html',
    styleUrls: ['./document-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentCreatorComponent) }
    ],
    standalone: false
})
export class EIMDocumentCreatorComponent implements OnInit, EIMCreatable, OnDestroy {

	/** フォーム */
	@ViewChild('documentForm', { static: true }) documentForm: NgForm;

	/** ドキュメントリスト */
	@ViewChild('documentList', { static: true })
		documentList: EIMDataGridComponent;

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram', { static: true })
		workflowDiagram: EIMDiagramComponent;

	/** 親オブジェクトID */
	@Input() parentObjId: number;

	/** ワークスペースオブジェクトID */
	@Input() workspaceObjId: number;

	/** 追加ファイル（一覧画面にてドラッグした場合に指定） */
	@Input() addFileList: any[];

	/** パス */
	@Input() path: string;

	/** ドキュメントタイプID */
	@Input() documentTypeId: number;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** タイプ一覧表示項目 */
	public typeSelectItems: SelectItem[] = [];

	/** 選択したタイプID */
	public selectedTypeId: number;
	/** 前回選択したタイプID */
	public preSelectedTypeId: number;
	/** 作成者 */
	public createUser: EIMUserDomain;

	/** 作成者検索画面の条件値 */
	public userSearchCondition: any = {
			userCode: [''],
			userName: ['']
	};
	/** アップローダ */
	public uploader: FileUploader = new FileUploader({url:""});
	/** ドラッグ位置がファイルドロップ可能範囲かどうか */
	public hasBaseDropZoneOver = false;
	/** ファイル一覧のメニュー */
	public fileMenuItems: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: (event) => {this.onClickDelete(event); }}
	];
	/** 状態 */
	public STATE = stateConst;
	public state = stateConst.EDITING;
	/** 属性タイプレイアウトリスト */
	public attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[];

	/**Boxからチェックインする場合の属性タイプレイアウトリスト */
	public boxCheckinDocAttributeTypeLayoutList: EIMAttributeTypeLayoutDomain[];

	/**Boxから新規登録する場合の属性タイプレイアウトリスト */
	public boxNewDocAttributeTypeLayoutList: EIMAttributeTypeLayoutDomain[];

	/**Boxから新規登録とチェックインを同時に行う場合のフラグ */
	public containsNewAndCheckedInFlag = false;

	/** 属性リスト */
	public attributeList: EIMAttributeDomain[];
	/** ファイルと属性値リストのMap */
	public attributeListMap: any = {};
	/** ファイルとフォームコントロール情報のMap */
	public formMap: any = {};

	/** プロパティパネルの内容を表示するかどうか */
	public displayProperty = false;
	/** 作成者選択画面を表示するかどうか */
	public displayUserSelector = false;

	/** 前回選択したファイル項目 */
	private preSelectedFileItem: FileItem = null;

	/** 作成済みのデータ */
	private createdData: any[] = [];

	/** プロパティの全選択チェックボックスの値 */
	public propertyAllCheckFlag = true;

	/** コピー貼付け活性フラグ */
	public propertyCopyPeastDisabled = false;

	/** プロパティ貼付け非活性フラグ */
	public disablePasteFlag = true;

	/** Boxからドキュメント登録するファイル */
	public uploadBoxDoc: any[] = [];

	/** Boxからドキュメント登録するファイルパス */
	private boxPath: String = "";

	/** 属性リスト */
	public documentAttributesList: any = [];

	/** チェックインフラグ無効化 */
	public isDisabled: boolean = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected attributeService: EIMAttributeService,
			protected documentsCacheService: EIMDocumentsCacheService,
			protected documentFormService: EIMDocumentFormService,
			protected documentService: EIMDocumentService,
			protected contentsTypeService: EIMContentsTypeService,
			protected documentsAttributeDomainService: EIMDocumentsAttributeDomainService,
			protected attachementFileInputFormItemComponentService: EIMAttachementFileInputFormItemComponentService,
			protected messageService: EIMMessageService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			protected objectTypeService: EIMObjectTypeService,
			protected contentsPropertyService: EIMContentsPropertyService,
			public boxContentsListComponentService: EIMBoxContentsListComponentService,
			protected eimBoxFileService: EIMBoxFileService,
			protected changeDetectorRef: ChangeDetectorRef,
		) {
		this.createUser = this.documentsCacheService.getLoginUser();
		this.disablePasteFlag = !this.contentsPropertyService.isAblePasteAttribute();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ドキュメント情報を登録します.
	 */
	public create(): void {

		let selectedData: FileItem[] = this.documentList.getSelectedData();

		// 選択前のフォームをキャッシュ化
		this.cacheDirtyForm(this.preSelectedFileItem);
		// 削除対象の内、入力エラーがないかチェック
		let invalidFileItem: FileItem;
		for (let i = 0; i < this.uploader.queue.length; i++) {
			let fileItem: FileItem = this.uploader.queue[i];
			if (!this.formMap[fileItem.file.name]) {
				continue;
			}

			let keys = Object.keys(this.formMap[fileItem.file.name]);
			for (let j = 0; j < keys.length; j++) {
				if (this.formMap[fileItem.file.name][keys[j]].invalid) {
					invalidFileItem = this.formMap[fileItem.file.name][keys[j]].fileItem;
					break;
				}
			}
		}
		if (invalidFileItem) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00003'));
			this.documentList.select([invalidFileItem], false);

			return;
		}

		// 登録開始
		this.state = stateConst.CREATING;
		// 削除ボタン無効化
		this.fileMenuItems[0].disabled = true;

		let successFileItems = 0;
		let errorFileItems = 0;
		let dataList = this.documentList.getData();

		//Boxからドキュメントを登録する場合
		if (this.boxContentsListComponentService.copyToEIMFlag) {
			let fileItem: FileItem = null;

			//Boxパス作成
			for (let i = 0;i < +this.boxContentsListComponentService.breadcrumbItems.length;i++) {
				this.boxPath = this.boxPath + "/" + this.boxContentsListComponentService.breadcrumbItems[i].label;
			}
			//Boxのデータグリッドをリセット
			this.boxContentsListComponentService.boxDataGridRefresh();
			//EIMANAGERに公開フラグのリセット
			this.boxContentsListComponentService.documentPublicFlag();

			for (let i = 0; i < dataList.length; i++) {
				fileItem = this.uploader.queue[i];
				// ドキュメント作成
				let document: EIMContentsDomain = new EIMContentsDomain();
				document.name = fileItem.file.name;

				document.attributeList = this.attributeService.excludeNullAttributeList(
					this.attributeListMap[fileItem.file.name]
				);

				this.documentAttributesList.push(document);
			}

			this.documentService
				.uploadFromBox(
					this.eimBoxFileService.tmpObjId,
					this.documentList.getData(),
					this.parentObjId,
					this.selectedTypeId,
					this.createUser.id,
					this.documentTypeId,
					this.path,
					this.boxPath,
					this.documentAttributesList,
					true,
					false
				).subscribe((data: any) => {
					for (let i = 0; i < data.value.length; i++) {
						//登録エラーが起こった場合、該当ファイルをデータグリットから抽出
						const targetDoc = this.uploadBoxDoc.find(
							(doc) => doc.file.name === data.value[i].objName
						);

						if (data.value[i].message != "") {
							//ファイル登録エラーが起こった場合
							errorFileItems++;

							targetDoc.isSuccess = false;
							targetDoc.isError = true;

							//エラーメッセージをセット
							if (targetDoc) {
								targetDoc.errorMessage = data.value[i].message;
								fileItem["errorMessage"] = data.value[i].message;
							}
						} else {
							targetDoc.isSuccess = true;
							targetDoc.isError = false;
							successFileItems++;
							this.createdData.push({
								objId: data.value[i].objId,
							});
							if (this.documentList.getData()[i].sameNameObj != null) {
								this.createdData.push({
									objId: this.documentList.getData()[i].sameNameObj
								});
							}
						}
						this.complete(successFileItems, errorFileItems);
					}

					if (errorFileItems <= 0) {
						//ドキュメント登録が完了したらダイアログを閉じる
						this.dialogManagerComponentService.close(
							dialogName.DOCUMENT_CREATOR
						);
						this.dialogManagerComponentService.close(
							dialogName.DOCUMENT_CREATOR_CONFIRMATION
						);
					}
				},
				(err: any) => {
					this.complete(successFileItems, errorFileItems);
				}
			);
		}
		//ドキュメント登録から登録する場合
		else {
			for (let i = 0; i < this.uploader.queue.length; i++) {
				let fileItem: FileItem = this.uploader.queue[i];
				this.documentService
					.upload(
						this.uploader,
						fileItem,
						this.parentObjId,
						this.selectedTypeId,
						this.createUser.id,
						true,
						false
					)
					.subscribe(
						(data: any) => {
							// ドキュメント作成
							let document: EIMContentsDomain = new EIMContentsDomain();
							document.id = data.objId;
							document.name = data.objName;

							document.attributeList =
								this.attributeService.excludeNullAttributeList(
									this.attributeListMap[fileItem.file.name]
								);

							// 帳票タイプフォルダID属性を追加
							let formTypeFolderIdAttributeType: EIMAttributeTypeDomain =
								new EIMAttributeTypeDomain();
							formTypeFolderIdAttributeType.definitionName =
								EIMConstantService.ATTRIBUTE_TYPE_NAME_FORM_TYPE_FOLDER_ID;
							let formTypeFolderIdAttribute: EIMContentsAttributeDomain =
								new EIMContentsAttributeDomain();
							formTypeFolderIdAttribute.attributeType =
								formTypeFolderIdAttributeType;
							formTypeFolderIdAttribute.longList = [this.parentObjId];
							document.attributeList.push(formTypeFolderIdAttribute);
							this.documentFormService.create(document).subscribe(
								(resForm: EIMContentsDomain) => {
									fileItem.isSuccess = true;
									fileItem.isError = false;
									successFileItems++;

									this.createdData.push({ objId: resForm.id });
									this.documentList.refreshView();

									this.complete(successFileItems, errorFileItems);
								},
								(err: any) => {
									fileItem.isSuccess = false;
									fileItem.isError = true;
									errorFileItems++;

									fileItem["errorMessage"] = err.message;

									this.complete(successFileItems, errorFileItems);
								}
							);
						},
						(err: any) => {
							fileItem.isSuccess = false;
							fileItem.isError = true;
							errorFileItems++;
							fileItem["errorMessage"] = err.message;
							this.complete(successFileItems, errorFileItems);
						}
					);
			}
		}
		this.attachementFileInputFormItemComponentService.clear();
	}

	/**
	 * ドキュメント登録可否を返却します.
	 * @return ドキュメント登録可否
	 */
	public creatable(): boolean {
		return (this.state === stateConst.EDITING && this.documentForm.valid && this.uploader.queue.length > 0);
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		event.preventDefault();

		if (this.createdData && this.createdData.length > 0) {
			// 登録時に、登録エラーのファイルが存在していた場合
			// （全て登録できた場合は、登録完了時点でクローズされている）
			this.created.emit(this.createdData);
		}

		if (this.state === stateConst.EDITING && this.documentForm.dirty) {
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

	/**
	 * ファイル一覧の行比較関数です.
	 * @param obj1 オブジェクト1
	 * @param obj2 オブジェクト2
	 * @return オブジェクト1とオブジェクト2のファイル名が等しいかどうか
	 */
	public equalsFileList(obj1: any, obj2: any): boolean {
		return obj1.file.name == obj2.file.name;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラ.
	 */
	ngOnInit(): void {
		window.setTimeout(() => {
			let columns: EIMDataGridColumn[] = [];
			columns.push({field: 'isSuccess', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02013'), width: 70, cellRendererFramework: EIMProcessingResultRendererComponent, suppressFilter: true});
			if (this.boxContentsListComponentService.copyToEIMFlag) {
				columns.push({field: "uploadStatus", headerName: this.translateService.instant("EIM_DOCUMENTS.LABEL_02190"),width: 115,cellRendererFramework: EIMDocumentsCheckinRendererComponent,});
			}
			columns.push({field: 'file.name', headerName: this.translateService.instant('EIM.LABEL_02012'), width: 250});
			columns.push({field: 'file.size', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02054'), width: 130, type: EIMDataGridColumnType.number});
			this.documentList.setColumns(columns);

			// ドキュメントタイプ一覧取得
			this.objectTypeService.getHierarchical(this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT)
				.subscribe(
						(hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
							this.setTypeSelectItems(hierarchicalContentsType, null);
						},
						(err: any) => {
							window.setTimeout(() => {
								this.errored.emit();
							})
						});

			// ファイル追加イベントハンドラ設定
			this.uploader.onAfterAddingAll = (fileItems: FileItem[]) => {
				this.onAddFiles(fileItems);
			};
			if (this.boxContentsListComponentService.copyToEIMFlag) {
				this.boxDocumentCreate();
			}else {
				this.uploader.addToQueue(this.addFileList);
				this.documentList.setData(this.uploader.queue);
			}
		});
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		this.uploader.clearQueue();
		this.uploader.cancelAll();
		this.uploader = null;

		this.attachementFileInputFormItemComponentService.deleteTemplate();
	}

	/**
	 * ファイル追加イベントハンドラ.
	 * @param fileItems 追加するファイル配列
	 */
	onAddFiles(fileItems: FileItem[]): void {
		if (!fileItems || fileItems.length === 0) {
			return;
		}

		// 重複チェック
		if (this.existsDuplicateFileName(fileItems)) {
			// 重複した場合は、追加分すべてを削除
			for (let i = 0; i < fileItems.length; i++) {
				this.uploader.removeFromQueue(fileItems[i]);
			}
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00014'));

			return;
		}

		// BoxからEIMにドキュメントを登録する際は、ドラッグ&ドロップによるドキュメントの反映を不可とする
		let isDragAndDropDisabled = false;
		if (this.boxContentsListComponentService.copyToEIMFlag) {
			// ローカルからファイルをドラッグ&ドロップした場合は、追加分をすべて削除
			for (let i = 0; i < fileItems.length; i++) {
				if (fileItems[i].file.rawFile["uploadStatus"] === undefined) {
					this.uploader.removeFromQueue(fileItems[i]);
					isDragAndDropDisabled = true;
				}
			}
			if (isDragAndDropDisabled) {
				this.messageService.show(
					EIMMessageType.error,
					this.translateService.instant("EIM_DOCUMENTS.ERROR_00136")
				);
			}
			return;
		}

		// ファイル一覧に追加、選択
		this.documentList.addRowData(fileItems);
		this.documentList.select([fileItems[0]], false);

		// 属性値を初期化
		for (let i = 0; i < fileItems.length; i++) {
			this.attributeListMap[fileItems[i].file.name] = this.documentsAttributeDomainService.getInitializedAttributeList(this.attributeTypeLayoutList);
		}

	}

	/**
	 * ファイル選択イベントハンドラ.
	 * 選択前のファイルのフォームコントローラの状態をキャッシュします.
	 * また、選択したファイルの属性値情報をキャッシュから取得し画面に反映します.
	 * @param event イベント
	 */
	onSelectFile(event): void {
		let selectedFiles = this.documentList.getSelectedData();
		this.changeEnableMenuItem(selectedFiles);
		this.initProperty(selectedFiles);
		this.propertyAllCheckFlag = true;
		this.propertyCopyPeastDisabled = false;
	}

	/**
	 * ファイル一覧の削除ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	onClickDelete(event): void {
		let selectedItems: any[] = this.documentList.getSelectedData();
		if (selectedItems.length === 1) {
			// 選択中のフォームをキャッシュ化
			this.cacheDirtyForm(selectedItems[0]);
		}

		// 削除対象の内、プロパティを編集したものがないかチェック
		let existsDirty = false;
		for (let i = 0; i < selectedItems.length; i++) {
			let fileItem: FileItem = selectedItems[i];
			if (!this.formMap[fileItem.file.name]) {
				continue;
			}

			let keys = Object.keys(this.formMap[fileItem.file.name]);
			if (keys.length > 0) {
				existsDirty = true;
				break;
			}
		}
		if (existsDirty) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						this.deleteFileItems(selectedItems);
						let fileItems = this.documentList.getData();
						this.documentList.select([fileItems[0]], false);
						// ファイル一覧内のファイルが全て削除された場合、ドキュメント登録画面を閉じる
						if (fileItems.length === 0) {
							this.dialogManagerComponentService.close(
							dialogName.DOCUMENT_CREATOR
						);
					}
					},
					() => {
						// なにもしない
					}
			);
		} else {
			this.deleteFileItems(selectedItems);
			let fileItems = this.documentList.getData();
			this.documentList.select([fileItems[0]], false);
			// ファイル一覧内のファイルが全て削除された場合、ドキュメント登録画面を閉じる
			if (fileItems.length === 0) {
				this.dialogManagerComponentService.close(dialogName.DOCUMENT_CREATOR);
			}
		}
	}

	/**
	 * タイプ変更イベントハンドラ.
	 * @param event イベント
	 */
	onChangeType(event): void {
		if (this.isDirtyProperties()) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						this.changeType();
					},
					() => {
						// 選択を戻す
						this.selectedTypeId = this.preSelectedTypeId;
					}
			);
		} else {
			// ドキュメントタイプの詳細情報を取得する
			if (this.selectedTypeId == null) {
				return;
			}

			this.changeType();
		}
	}

	/**
	 * タイプ選択画面表示ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onClickShowObjectTypeSelector(event: any): void {
		// ドキュメントタイプツリーを表示する
		let dialogId: string = this.dialogManagerComponentService.showObjectTypeTreeSelector(null,
				this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT,
				{
					selected: (documentType: any) => {
						this.dialogManagerComponentService.close(dialogId);
						if (this.isDirtyProperties()) {
							// 破棄確認ダイアログ
							this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
									() => {
										this.documentForm.form.controls['objType'].setValue(documentType.id);
										this.documentForm.form.controls['objType'].markAsDirty();
										this.changeType();
									},
									() => {
										// 何もしない
									}
								);
						} else {
							this.documentForm.form.controls['objType'].setValue(documentType.id);
							this.documentForm.form.controls['objType'].markAsDirty();
							this.changeType();
						}
					}
				});
	}

	/**
	 * 作成者選択イベントハンドラ.
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
	 * 全選択/解除チェックボックスクリックイベントハンドラ.
	 * @param event イベント
	 */
	onChangePropertyAllCheckFlag(event: any) {
		this.contentsPropertyService.checkAllProperty(this.attributeList, this.propertyAllCheckFlag);
		if (this.propertyAllCheckFlag) {
			this.propertyCopyPeastDisabled = false;
		} else {
			this.propertyCopyPeastDisabled = true;
		}
	}

	/**
	 * プロパティタブのコピーボタン押下時のハンドラ.
	 * @param event イベント
	 */
	public onClickPropertyCopy(event: any) {
		this.contentsPropertyService.copyAttribute(this.attributeList);
		if (this.disablePasteFlag) {
			this.disablePasteFlag = !this.contentsPropertyService.isAblePasteAttribute();
		}
	}

	/**
	 * プロパティタブの貼り付けボタン押下時のハンドラ.
	 * @param event イベント
	 */
	public onClickPropertyPaste(event: any) {
		this.contentsPropertyService.pasteAttribute(this.attributeList);
	}

	/**
	 * 属性チェックボックスクリックイベントハンドラ.
	 */
	onClickAttributeCheckBox() {
		let result = this.contentsPropertyService.getAllcheckFlg(this.attributeList);

		if (result === EIMCheckAllPropertyState.all) {
			this.propertyAllCheckFlag = true;
			this.propertyCopyPeastDisabled = false;
		} else if (result === EIMCheckAllPropertyState.nothing) {
			this.propertyAllCheckFlag = false;
			this.propertyCopyPeastDisabled = true;
		} else {
			this.propertyAllCheckFlag = false;
			this.propertyCopyPeastDisabled = false;
		}
	}

	/**
	 * 作成者選択ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	public onDisplayUserSelector(event: any): void {
		let dialogId: string = this.dialogManagerComponentService.showAccessCheckedUserSelector(this.parentObjId, {
			selected: (createUser: any[]) => {
				this.dialogManagerComponentService.close(dialogId);
				this.onSelectCreateUser(createUser);
			}
		});
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
	 * タイプを変更します.
	 * ワークフロー、プロパティを初期化します.
	 */
	protected changeType(): void {
		this.contentsTypeService.getByIdAndParent(this.selectedTypeId, this.parentObjId)
		.subscribe(
				(formType: EIMFormTypeDomain) => {

					// すべて選択解除のチェックを初期化
					this.propertyAllCheckFlag = true;

					// 下位引継ぎの値を設定
					this.attributeTypeLayoutList = formType.formLayout.objectTypeLayout.attributeTypeLayoutList;

					// ファイルの属性値を初期化
					this.attributeListMap = {};
					for (let i = 0; i < this.uploader.queue.length; i++) {
						this.attributeListMap[this.uploader.queue[i].file.name] = this.documentsAttributeDomainService.getInitializedAttributeList(this.attributeTypeLayoutList);
					}

					this.initProperty(this.documentList.getSelectedData());

					this.preSelectedTypeId = this.selectedTypeId;
				},
				(err: any) => {
					// 選択を戻す
					this.selectedTypeId = this.preSelectedTypeId;
				});


		// ワークフロー表示初期化
		let objTypeId: number = this.selectedTypeId;
		this.workflowDiagram.clear();
		this.workflowDiagram.show({createType: 'document', objTypeId: objTypeId, workspaceId: this.parentObjId});
	}

	/**
	 * ファイルを削除します.
	 * @param fileItems 削除するファイル情報の配列
	 */
	private deleteFileItems(fileItems: FileItem[]): void {
		if (fileItems == null || fileItems.length === 0) {
			return;
		}
		for (let i = 0; i < fileItems.length; i++) {
			let item: any = fileItems[i];
			if (<FileItem>item.fileItem) {
				//Boxからドキュメント登録時
				this.uploader.removeFromQueue(<FileItem>item.fileItem);
				if (this.boxContentsListComponentService.copyToEIMFlag) {
					this.uploadBoxDoc = this.uploadBoxDoc.filter(
						(fileItem) => fileItem.file.name !== item.fileItem.file.name
					);
				}
			} else {
				this.uploader.removeFromQueue(<FileItem>item);
			}
		}

		if (this.boxContentsListComponentService.copyToEIMFlag) {
			this.documentList.setData(this.uploadBoxDoc);
		} else {
			this.documentList.setData(this.uploader.queue);
		}

		let selectedFiles = this.documentList.getSelectedData();
		this.changeEnableMenuItem(selectedFiles);
		this.initProperty(selectedFiles);
	}

	/**
	 * タイプコンボボックス用のデータを生成します.
	 * @param objectTypes オブジェクトタイプ情報配列
	 * @param typeSelectItems オブジェクトタイプ情報配列
	 */
	protected setTypeSelectItems(objectTypes: EIMHierarchicalObjectTypeDomain[], typeSelectItems: SelectItem[]): void {

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
		
		// 変更通知を出すため、再帰呼び出しではない最初の呼び出しの最後で、this.typeSelectItemsに設定する
		if(typeSelectItems == null){
			this.typeSelectItems = tmp;
		}
	}

	/**
	 * 登録完了処理です.
	 * エラーがあった場合はエラーダイアログを表示します.
	 * createdエミットを発火します.
	 * @param successFileItems 登録成功したファイル数
	 * @param errorFileItems 登録失敗したファイル数
	 */
	private complete(successFileItems: number, errorFileItems: number): void {
		if (this.uploader.queue.length !== (successFileItems + errorFileItems)) {
			// 全ファイルの処理が終わっていない場合
			return;
		}

		if (errorFileItems > 0) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00001', {value: errorFileItems}));
		} else {
			this.boxContentsListComponentService.copyToEIMFlag = false;
			this.created.emit(this.createdData);
		}

		this.state = stateConst.COMPLETE;
	}

	/**
	 * プロパティ属性が編集されたかどうかを返却します.
	 * @return プロパティ属性が編集されたかどうか
	 */
	protected isDirtyProperties(): boolean {
		let keys = Object.keys(this.documentForm.form.controls);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key === 'objType' || key === 'path' || key === 'creator') {
				continue;
			}
			if (this.documentForm.form.controls[key].dirty) {
				return true;
			}
		}

		return false;
	}

	/**
	 * dirty状態のフォームコントロールの内容をキャッシュします.
	 * @param fileItem ファイルアイテム
	 */
	protected cacheDirtyForm(fileItem: FileItem): void {
		if (!fileItem) {
			return;
		}

		let keys = Object.keys(this.documentForm.form.controls);

		// キャッシュから削除された入力項目を削除
		if (this.formMap[fileItem.file.name]) {
			let cacheKeys = Object.keys(this.formMap[fileItem.file.name]);
			for (let i = 0; i < cacheKeys.length; i++) {
				let cacheKey = cacheKeys[i];
				for (let j = 0; j < keys.length; j++) {
					if (!this.documentForm.form.controls[cacheKey]) {
						delete this.formMap[fileItem.file.name][cacheKey];
						break;
					}
				}
			}
		}

		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key === 'objType' || key === 'path' || key === 'creator') {
				continue;
			}

			if (!this.documentForm.form.controls[key].dirty) {
				continue;
			}

			if (!this.formMap[fileItem.file.name]) {
				this.formMap[fileItem.file.name] = {}
			}

			if (!this.formMap[fileItem.file.name][key]) {
				this.formMap[fileItem.file.name][key] = {};
			}
			this.formMap[fileItem.file.name][key].fileItem = fileItem;
			this.formMap[fileItem.file.name][key].invalid = this.documentForm.form.controls[key].invalid;
			this.formMap[fileItem.file.name][key].errors = this.documentForm.form.controls[key].errors;
			this.formMap[fileItem.file.name][key].attributeList = this.attributeList;
		}
	}

	/**
	 * プロパティ画面初期化処理です.
	 * ファイル選択変更時の共通処理です.
	 * @param selectFileItems 選択されたファイルアイテム配列
	 */
	protected initProperty(selectFileItems: FileItem[]): void {
		this.displayProperty = false;

		if (!this.selectedTypeId) {
			// 属性情報非表示
			this.attributeList = [];
			return;
		}

		if (selectFileItems.length === 1) {
			// 単数選択時
			let selectFileItem: FileItem = selectFileItems[0];
			let selectFileData: any = selectFileItems[0];

			// 前回の選択時と同じファイルが指定されていない場合
			if (this.preSelectedFileItem !== null && selectFileItem.file.name !== this.preSelectedFileItem.file.name) {
				// 選択前のフォームをキャッシュ化
				this.cacheDirtyForm(this.preSelectedFileItem);
			}

			// 属性情報表示
			if (!this.attributeListMap[selectFileItem.file.name]) {
				this.attributeListMap[selectFileItem.file.name] = this.documentsAttributeDomainService.getInitializedAttributeList(this.attributeTypeLayoutList);
			}
			

			if (this.boxContentsListComponentService.copyToEIMFlag) {
				if (selectFileData.sameNameObj != null) {
					//チェックインの場合、改訂内容を含む属性値を表示
					this.attributeTypeLayoutList =
						this.boxCheckinDocAttributeTypeLayoutList;
				} else if (this.containsNewAndCheckedInFlag) {
					// Boxから既存のチェックインドキュメントと新規ドキュメントを同時に登録する場合、
					// 新規ドキュメントについては、チェックインによる改訂内容を含まない属性値を表示
					this.attributeTypeLayoutList = this.boxNewDocAttributeTypeLayoutList;
				}
			}
			let attributeList = this.attributeListMap[selectFileItem.file.name];
			// フォームのキャッシュ情報からdirtyを反映
			for (let i = 0; i < attributeList.length; i++) {
				let attribute: EIMAttributeDomain = attributeList[i];
				for (let j = 0; j < attribute.getValueList().length; j++) {
					if (!this.formMap[selectFileItem.file.name]) {
						continue;
					}
					let key = 'attr_' + attribute.attributeType.id + '_' + j;
					if (this.formMap[selectFileItem.file.name][key]) {
						attribute['_dirty'] = true;
					} else {
						attribute['_dirty'] = false;
					}
				}
			}

			this.attributeList = attributeList;

			// 選択状態を保持
			this.preSelectedFileItem = selectFileItem;

			window.setTimeout(() => {
				// setTimeoutで次回の描画タイミングに表示しないと
				// 入力値の表示が変更がされない
				this.displayProperty = true;
				this.changeDetectorRef.detectChanges();
			});

		} else {
			// 複数選択時

			// 選択前のフォームをキャッシュ化
			this.cacheDirtyForm(this.preSelectedFileItem);

			// 属性情報非表示
			this.attributeList = [];

			// 選択状態を保持
			this.preSelectedFileItem = null;
		}
	}

	/**
	 * 選択状況に応じてメニューの有効/無効を切り替えます.
	 * @param selectFileItems 選択されたファイルアイテム配列
	 */
	private changeEnableMenuItem(selectFileItems: FileItem[]): void {
		// 削除ボタンの押下可否を切り替える
		if (this.state !== stateConst.COMPLETE && selectFileItems.length > 0) {
			this.fileMenuItems[0].disabled = false;
		} else {
			this.fileMenuItems[0].disabled = true;
		}
	}

	/**
	 * 追加したファイルが重複していないかチェックします.
	 * @param addFileItems 追加したファイルアイテム
	 * @return 重複している場合true
	 */
	private existsDuplicateFileName(addFileItems: FileItem[]): boolean {
		let files: FileItem[] = this.documentList.getData();
		for (let i = 0; i < files.length; i++) {
			for (let j = 0; j < addFileItems.length; j++) {
				if (files[i].file.name === addFileItems[j].file.name) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Box連携時使用
	 * ドキュメント登録確認ダイアログで設定したタイプを設定します.
	 */
	private setType(): void {
		if (this.isDirtyProperties()) {
			// 破棄確認ダイアログ
			this.messageService.show(
				EIMMessageType.confirm,
				this.translateService.instant("EIM.CONFIRM_00003"),
				() => {
					this.changeType();
				},
				() => {
					// 選択を戻す
					this.selectedTypeId = this.preSelectedTypeId;
				}
			);
		} else {
			// ドキュメントタイプの詳細情報を取得する
			if (this.selectedTypeId == null) {
				return;
			}

			this.changeType();
		}
	}

	/**
	 * Boxからドキュメントを登録する場合の処理を行います。
	 */
	private async boxDocumentCreate() {
		// タイプ設定
		this.selectedTypeId = this.documentTypeId ?? null;
		this.setType();
		this.uploader.addToQueue(this.addFileList);

		// アップロード対象ドキュメントのデータにチェックインステータスと既存ドキュメントIDを付与
		this.uploader.queue.forEach((fileItem, index) => {
			const addFileData = this.addFileList[index];
			this.uploadBoxDoc.push({
				file: fileItem.file,
				fileItem,
				isSuccess: fileItem.isSuccess,
				isError: fileItem.isError,
				errorMessage: fileItem["errorMessage"],
				uploadStatus:
					addFileData.uploadStatus === 5 ? 3 : addFileData.uploadStatus,
				sameNameObj: addFileData.sameNameObj,
			});
		});

		this.documentList.setData(this.uploadBoxDoc);

		// 同期処理を順番に実行
		const promises = this.uploadBoxDoc
			.filter((doc) => doc.sameNameObj) // チェックイン時だけ既存属性を取得
			.map(async (doc) => {
				try {
					const form = await this.documentFormService
						.getDocumentById(doc.sameNameObj)
						.toPromise();

					let attributeTypeLayoutList: EIMContentsAttributeTypeLayoutDomain[] =
						form.formLayout.objectTypeLayout.attributeTypeLayoutList;

					//属性タイプレイアウトリスト取得
					if (!this.containsNewAndCheckedInFlag) {
						this.boxNewDocAttributeTypeLayoutList =
							this.attributeTypeLayoutList;
						this.boxCheckinDocAttributeTypeLayoutList = attributeTypeLayoutList;
						this.containsNewAndCheckedInFlag = true;
					}

					this.attributeListMap[doc.file.name] = form.attributeList;

					return form;
				} catch (err) {
					window.setTimeout(() => {
						this.errored.emit();
					});
					return null;
				}
			});

		// すべてのリクエストが完了するまで待機
		const results = await Promise.all(promises);

		//初期表示ファイル選択
		this.documentList.select([this.uploadBoxDoc[0]], false);
	}
}
