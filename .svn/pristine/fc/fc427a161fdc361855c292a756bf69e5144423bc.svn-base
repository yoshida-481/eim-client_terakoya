import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

// primeng
import { SelectItem } from 'primeng/api';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMContentsTypeService, EIMDocumentType } from 'app/documents/shared/services/apis/contents-type.service';

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

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';

import { EIMDocumentService } from 'app/documents/shared/services/apis/document.service';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';

import { EIMProcessingResultRendererComponent } from 'app/documents/shared/components/renderer/processing-result-renderer.component';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';

import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMAttachementFileInputFormItemComponentService } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';
import { EIMContentsPropertyService, EIMCheckAllPropertyState } from 'app/documents/shared/services/contents-property.service';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';


/**
 * スキャン用表紙登録コンポーネント
 * @example
 *
 *      <eim-cover-creator
 *          [parentObjId]="parentObjId"
 *          [path]="path"
 *          [workspaceObjId]="workspaceObjId">
 *      </eim-cover-creator>
 */
@Component({
    selector: 'eim-cover-creator',
    templateUrl: './cover-creator.component.html',
    styleUrls: ['./cover-creator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMCoverCreatorComponent) }],
    standalone: false
})

export class EIMCoverCreatorComponent implements OnInit , EIMCreatable {

	/** フォーム */
	@ViewChild('documentForm', { static: true }) documentForm: NgForm;

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram', { static: true }) workflowDiagram: EIMDiagramComponent;

	/** 親オブジェクトID */
	@Input() parentObjId: number;

	/** ワークスペースオブジェクトID */
	@Input() workspaceObjId: number;

	/** パス */
	@Input() path: string;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** タイプ一覧表示項目 */
	public typeSelectItems: SelectItem[] = [];

	/** PDF拡張子 */
	public PDF_EX = EIMDocumentsConstantService.PDF_EXTENSION;
	/** 選択したタイプID */
	public selectedTypeId: number;
	/** 前回選択したタイプID */
	public preSelectedTypeId: number;
	/** 選択したタイプドメイン */
	public formType: EIMFormTypeDomain;
	/** 作成者 */
	public createUser: EIMUserDomain;
	/** 属性タイプレイアウトリスト */
	public attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[];
	/** 属性リスト */
	public attributeList: EIMAttributeDomain[];
	/** ファイルとフォームコントロール情報のMap */
	public formMap: any = {};

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 作成中かどうか */
	public creating = false;

	/** プロパティパネルの内容を表示するかどうか */
	public displayProperty = false;

	/** 名前 */
	public name: string = null;

	/** 作成済みのデータ */
	private createdData: any[] = [];

	/** プロパティの全選択チェックボックスの値 */
	public propertyAllCheckFlag = true;

	/** コピー貼付け活性フラグ */
	public propertyCopyPeastDisabled = false;

	/** プロパティ貼付け非活性フラグ */
	public disablePasteFlag = true;


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
			protected jsonService: EIMJSONService,
			protected messageService: EIMMessageService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			protected objectTypeService: EIMObjectTypeService,
			protected contentsPropertyService: EIMContentsPropertyService,
		) {
				this.createUser = this.documentsCacheService.getLoginUser();
				this.disablePasteFlag = !this.contentsPropertyService.isAblePasteAttribute();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

		/**
	 * スキャン用表紙を登録します.
	 */
	public create(): void {
		// 入力値のチェック
		if (this.isIllegalCoverName()) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00009'));
			return;
		}

		this.creating = true;
		// 作成者情報の取得
		let createUserAttribute: EIMAttributeDomain = new EIMAttributeDomain();
		for (let i = 0; i < this.formType.attributeTypeList.length; i++) {
			if (this.formType.attributeTypeList[i].definitionName === '作成者') {
				createUserAttribute.attributeType = this.formType.attributeTypeList[i];
				break;
			}
		}
		createUserAttribute.longList.push(this.createUser.id);
		this.attributeList.push(createUserAttribute);

		// ドキュメント作成
		let document: EIMFormDomain = new EIMFormDomain();
		document.id = 0;
		document.name = this.name + this.PDF_EX;
		document.type = this.formType;
		document.attributeList = this.attributeService.excludeNullAttributeList(this.attributeList);

		// 帳票タイプフォルダID属性を追加
		let formTypeFolderIdAttributeType: EIMAttributeTypeDomain = new EIMAttributeTypeDomain();
		formTypeFolderIdAttributeType.definitionName = EIMConstantService.ATTRIBUTE_TYPE_NAME_FORM_TYPE_FOLDER_ID;
		let formTypeFolderIdAttribute: EIMContentsAttributeDomain = new EIMContentsAttributeDomain();
		formTypeFolderIdAttribute.attributeType = formTypeFolderIdAttributeType;
		formTypeFolderIdAttribute.longList = [this.parentObjId];
		document.attributeList.push(formTypeFolderIdAttribute);

		this.documentFormService.createCover(document)
			.subscribe(
				(resForm: EIMContentsDomain) => {
					this.createdData.push({objId: resForm.id});

					this.created.emit(this.createdData);
				},
				(err: any) => {
					this.creating = false;
					this.messageService.show(EIMMessageType.error, err.error.message);
				});
	}

	/**
	 * スキャン用表紙登録可否を返却します.
	 * @return ドキュメント登録可否
	 */
	public creatable(): boolean {
		return this.documentForm.valid ;
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

		if (this.documentForm.dirty) {
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
	 * スキャン用表紙ドキュメント名に禁則文字が含まれているかどうかを返却します.
	 * @return 禁則文字が含まれている場合trueを返却
	 */
	public isIllegalCoverName(): boolean {
		let match = this.name.match(EIMConstantService.FORBIDDEN_PATTERN);
		return match != null;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		window.setTimeout(() => {
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
		});
	}

	/**
	 * タイプ変更イベントハンドラ
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
	 * 作成者選択ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	public onClickSelectCreator(event: any): void {
		let dialogId: string = this.dialogManagerComponentService.showAccessCheckedUserSelector(this.parentObjId, {
			selected: (createUser: any[]) => {
				this.dialogManagerComponentService.close(dialogId);
				this.onSelectCreateUser(createUser);
			}
		});
	}

	/**
	 * タイプ選択画面表示ボタンクリックイベントハンドラ
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
									});
						} else {
							this.documentForm.form.controls['objType'].setValue(documentType.id);
							this.documentForm.form.controls['objType'].markAsDirty();
							this.changeType();
						}
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
	 * 全選択/解除チェックボックスクリックイベントハンドラ
	 * @param event イベント
	 */
	public onChangePropertyAllCheckFlag(event: any): void {
		this.contentsPropertyService.checkAllProperty(this.attributeList, this.propertyAllCheckFlag);
		if (this.propertyAllCheckFlag) {
			this.propertyCopyPeastDisabled = false;
		} else {
			this.propertyCopyPeastDisabled = true;
		}
	}

	/**
	 * プロパティタブのコピーボタン押下時のハンドラです.
	 * @param event イベント
	 */
	public onClickPropertyCopy(event: any): void {
		this.contentsPropertyService.copyAttribute(this.attributeList);
		this.disablePasteFlag = !this.contentsPropertyService.isAblePasteAttribute();
	}

	/**
	 * プロパティタブの貼り付けボタン押下時のハンドラです.
	 * @param event イベント
	 */
	public onClickPropertyPaste(event: any): void {
		this.contentsPropertyService.pasteAttribute(this.attributeList);
	}

	/**
	 * 属性チェックボックスクリックイベントハンドラです.
	 */
	onClickAttributeCheckBox(): void {
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
					this.formType = formType;
					// すべて選択解除のチェックを初期化
					this.propertyAllCheckFlag = true;

					// 下位引継ぎの値を設定
					this.attributeTypeLayoutList = formType.formLayout.objectTypeLayout.attributeTypeLayoutList;

					this.initProperty();
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
	 * タイプコンボボックス用のデータを生成します.
	 * @param objectTypes オブジェクトタイプ情報配列
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
	 * プロパティ属性が編集されたかどうかを返却します.
	 * @return プロパティ属性が編集されたかどうか
	 */
	protected isDirtyProperties(): boolean {
		let keys = Object.keys(this.documentForm.form.controls);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key === 'objType' || key === 'path' || key === 'creator' || key === 'coverName') {
				continue;
			}
			if (this.documentForm.form.controls[key].dirty) {
				return true;
			}
		}

		return false;
	}


	/**
	 * プロパティ画面初期化処理です.
	 * ファイル選択変更時の共通処理です.
	 * @param selectFileItems 選択されたファイルアイテム配列
	 */
	protected initProperty(): void {
		this.displayProperty = false;

		if (!this.selectedTypeId) {
			// 属性情報非表示
			this.attributeList = [];
			return;
		}

		let attributeList = this.documentsAttributeDomainService.getInitializedAttributeList(this.attributeTypeLayoutList);
		// フォームのキャッシュ情報からdirtyを反映
		for (let i = 0; i < attributeList.length; i++) {
			let attribute: EIMAttributeDomain = attributeList[i];
			for (let j = 0; j < attribute.getValueList().length; j++) {
				let key = 'attr_' + attribute.attributeType.id + '_' + j;
					attribute['_dirty'] = false ;
			}
		}
		this.attributeList = attributeList;

		window.setTimeout(() => {
			// setTimeoutで次回の描画タイミングに表示しないと
			// 入力値の表示が変更がされない
			this.displayProperty = true;
		});
	}
}
