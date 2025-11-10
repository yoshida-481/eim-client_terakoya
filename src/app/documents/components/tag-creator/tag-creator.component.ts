import { EIMConstantService } from 'app/shared/services/constant.service';
import { Component, forwardRef, EventEmitter, Input, Output, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, UntypedFormGroup, NgForm, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { EIMContentsTypeService, EIMDocumentType } from 'app/documents/shared/services/apis/contents-type.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMTagService } from 'app/documents/shared/services/apis/tag.service';
import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { EIMDialogManagerComponentService, dialogName } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMContentsAttributeTypeLayoutDomain } from 'app/documents/shared/domains/contents-attribute-type-layout.domain';
import { EIMContentsDomain } from 'app/documents/shared/domains/contents.domain';
import { EIMContentsLayoutDomain } from 'app/documents/shared/domains//contents-layout.domain';
import { EIMContentsObjectTypeLayoutDomain } from 'app/documents/shared/domains/contents-object-type-layout.domain';
import { EIMContentsTypeDomain } from 'app/documents/shared/domains/contents-type.domain';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMContentsPropertyService, EIMCheckAllPropertyState } from 'app/documents/shared/services/contents-property.service';
import { EIMCheckboxRendererComponentService } from 'app/shared/components/renderer/checkbox-renderer.component.service';


/**
 * タグ登録コンポーネント
 * @example
 *      <eim-tag-creator
 *          [parentObjId]='parentObjId'
 *          [workspaceObjId]='workspaceObjId'
 *          [path]='path'>
 *      </eim-tag-creator>
 */
@Component({
    selector: 'eim-tag-creator',
    templateUrl: './tag-creator.component.html',
    styleUrls: ['./tag-creator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMTagCreatorComponent) },],
    standalone: false
})

export class EIMTagCreatorComponent implements OnInit, EIMCreatable {

	/** フォーム */
	@ViewChild('tagForm', { static: true }) tagForm: NgForm;

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

	/** 作成者検索画面の条件値 */
	public userSearchCondition: any = {
		userCode: [''],
		userName: ['']
	};

	/** 属性タイプレイアウト情報リスト */
	public attributeTypeLayoutList: EIMContentsAttributeTypeLayoutDomain[];

	/** 属性情報リスト */
	public attributeList: EIMAttributeDomain[];

	/** 作成中かどうか */
	public creating = false;

	/** プロパティの全選択／解除チェックボックス */
	public propertyAllCheckFlag = true;

	/** コピー貼付け活性フラグ */
	public propertyCopyPeastDisabled = false;


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected attributeService: EIMAttributeService,
		protected contentsService: EIMContentsService,
		protected contentsTypeService: EIMContentsTypeService,
		protected documentTagService: EIMTagService,
		protected objectTypeService: EIMObjectTypeService,
		protected documentsAttributeDomainService: EIMDocumentsAttributeDomainService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected contentsPropertyService: EIMContentsPropertyService,
		protected checkboxRendererComponentService: EIMCheckboxRendererComponentService,
	) {
		this.createUser = this.documentsCacheService.getLoginUser();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * タグ情報を登録します.
	 */
	public create(): void {
		window.setTimeout(() => {
			// 入力値のチェック
			if (this.isIllegalTagName()) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00009'));
				return;
			}
			this.creating = true;
			let tag: EIMContentsDomain = new EIMContentsDomain();
			tag.name = this.name;
			let contentsLayoutDomain: EIMContentsLayoutDomain = new EIMContentsLayoutDomain();
			tag.formLayout = contentsLayoutDomain;
			let contentsObjectTypeLayoutDomain: EIMContentsObjectTypeLayoutDomain = new EIMContentsObjectTypeLayoutDomain();
			tag.formLayout.objectTypeLayout = contentsObjectTypeLayoutDomain;
			tag.formLayout.objectTypeLayout.attributeTypeLayoutList = this.attributeTypeLayoutList;
			tag.attributeList = this.attributeList;
			tag.type = new EIMObjectTypeDomain();
			tag.type.id = this.selectedTypeId;
			tag.creationUser = this.createUser
			this.documentTagService.create(tag, this.parentObjId).subscribe(
				(res: any) => {
					// 完了イベントを通知(画面が閉じる)
					this.dialogManagerComponentService.close(dialogName.TAG_CREATOR);
					this.created.emit([{objId: res.objId}]);
				},
				(err: any) => {
					// エラー発生時
					this.creating = false;
				}
			);
		});
	}

	/**
	 * タグ登録可否を返却します.
	 * @return タグ登録可否
	 */
	public creatable(): boolean {
		return !this.creating && this.tagForm.valid;
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event: any, close: EventEmitter<null>): void {
		event.preventDefault();

		if (this.tagForm.dirty) {
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
	 * 貼付け可否を返却します.
	 * @return 貼付け可否
	 */
	public isAblePasteAttribute(): boolean {
		return !this.contentsPropertyService.isAblePasteAttribute();
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// タグタイプ一覧取得
		this.objectTypeService.getHierarchical(this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_TAG).subscribe(
			(hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
				this.setTypeSelectItems(hierarchicalContentsType, null);
			},
			(err: any) => {
				window.setTimeout(() => {
					this.errored.emit();
				})
				this.dialogManagerComponentService.close(dialogName.TAG_CREATOR);

			}
		);
	}

	/**
	 * タイプ変更イベントハンドラ
	 * @param event イベント
	 */
	onChangeType(event: any): void {
		if (this.isDirtyProperties()) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
				() => {
					this.changeType();
					document.getElementById('select-all').hidden = false;
				},
				() => {
					// 選択を戻す
					this.selectedTypeId = this.preSelectedTypeId;
				}
			);
		} else {
			// タグタイプの詳細情報を取得する
			if (this.selectedTypeId == null) {
				return;
			}
			this.changeType();
			document.getElementById('select-all').hidden = false;
		}
	}

	/**
	 * タイプ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickShowObjectTypeSelector(event: any): void {
		// タグタイプツリーを表示する
		let dialogId: string = this.dialogManagerComponentService.showObjectTypeTreeSelector(null,
			this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_TAG, {
				selected: (documentType: any) => {
					this.dialogManagerComponentService.close(dialogId);
					document.getElementById('select-all').hidden = false;
					if (this.isDirtyProperties()) {
						// 破棄確認ダイアログ
						this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
							() => {
								this.selectedTypeId = documentType.id;
								this.changeType();
								document.getElementById('select-all').hidden = false;
							},
							() => {
								// 何もしない
							}
						);
					} else {
						this.selectedTypeId = documentType.id;
						this.changeType();
						document.getElementById('select-all').hidden = false;
					}
				}
			}
		);
	}

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
	 * 全選択/解除チェックボックスクリックイベントハンドラ
	 *@param event イベント
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
	 *@param event イベント
	 */
	public onClickPropertyCopy(event: any): void {
		this.contentsPropertyService.copyAttribute(this.attributeList);
	}

	/**
	 * プロパティタブの貼り付けボタン押下時のハンドラです.
	 *@param event イベント
	 */
	public onClickPropertyPaste(event: any): void {
		this.contentsPropertyService.pasteAttribute(this.attributeList);
	}

	/**
	 * 属性チェックボックスクリックイベントハンドラです.
	 */
	public onClickAttributeCheckBox(): void {
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

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * タグタイプ変更処理です.
	 * 帳票タイプ情報を取得します.
	 * 帳票タイプ情報の属性タイプレイアウト情報をソートします.
	 */
	private changeType(): void {
		this.contentsTypeService.getByIdAndParent(this.selectedTypeId, this.parentObjId)
		.subscribe((formType: EIMContentsTypeDomain) => {

			// すべて選択解除のチェックを初期化
			this.propertyAllCheckFlag = true;

			// 属性タイプレイアウト情報をソート
			this.attributeTypeLayoutList = this.sortAttributeTypeLayoutList(formType.formLayout.objectTypeLayout.attributeTypeLayoutList);
			this.attributeList = this.documentsAttributeDomainService.getInitializedAttributeList(this.attributeTypeLayoutList);
		});

		this.preSelectedTypeId = this.selectedTypeId;
	}

	/**
	 * レイアウト情報をプロパティ、有効期限、その他の順にソートします.
	 * @param attributeTypeLayoutList 属性タイプレイアウト情報配列
	 * @return ソート結果
	 */
	private sortAttributeTypeLayoutList(attributeTypeLayoutList: EIMContentsAttributeTypeLayoutDomain[]): EIMContentsAttributeTypeLayoutDomain[] {
		let property: EIMContentsAttributeTypeLayoutDomain;
		let expiredate: EIMContentsAttributeTypeLayoutDomain;
		let etc: EIMContentsAttributeTypeLayoutDomain[] = [];
		for (let i = 0; i < attributeTypeLayoutList.length; i++) {
			let attributeTypeLayout: EIMContentsAttributeTypeLayoutDomain = attributeTypeLayoutList[i];

			// タグ登録のみ下位引継ぎ及び属性初期値を表示しない
			if (attributeTypeLayout.successionFlag) {
				attributeTypeLayout.successionFlag = false;
			}
			attributeTypeLayout.setInitialValueList([]);


			if (attributeTypeLayout.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_PROPERTY) {

				property = attributeTypeLayout;
			} else if (attributeTypeLayout.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_EXPIREDATE) {

				expiredate = attributeTypeLayout;
			} else {

				etc.push(attributeTypeLayout);
			}
		}
		return [].concat(property, expiredate, etc);
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

		// 変更通知を出すため、再帰呼び出しではない最初の呼び出しの最後で、this.typeSelectItemsに設定する
		if(typeSelectItems == null){
			this.typeSelectItems = tmp;
		}
	}

	/**
	 * プロパティ属性が編集されたかどうかを返却します.
	 * @return プロパティ属性が編集されたかどうか
	 */
	private isDirtyProperties(): boolean {
		let keys = Object.keys(this.tagForm.form.controls);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key === 'type' || key === 'path' || key === 'tag_name') {
				continue;
			}
			if (this.tagForm.form.controls[key].dirty) {
				return true;
			}
		}
		return false;
	}

	/**
	 * タグ名に禁則文字が含まれているかどうかを返却します.
	 * @return 禁則文字が含まれている場合trueを返却
	 */
	private isIllegalTagName(): boolean {
		let match = this.name.match(EIMConstantService.FORBIDDEN_PATTERN);
		return match != null;
	}
}
