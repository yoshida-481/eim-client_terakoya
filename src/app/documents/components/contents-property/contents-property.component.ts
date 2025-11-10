import { Component, forwardRef, EventEmitter, SimpleChanges, Input, Output, ViewChild, OnInit, OnChanges, LOCALE_ID, Injector, OnDestroy } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { ClipboardDirective } from 'ngx-clipboard';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';

import { EIMTextInputFormItemComponent } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component';
import { EIMAttributeListInputFormItemComponent } from 'app/shared/components/attribute-list-input-form-item/attribute-list-input-form-item.component';
import { EIMAttributeListInputFormItemComponentService } from 'app/shared/components/attribute-list-input-form-item/attribute-list-input-form-item.component.service';

import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMTagService } from 'app/documents/shared/services/apis/tag.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMAttachementFileInputFormItemComponentService } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';

import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCheckboxRendererComponent } from 'app/shared/components/renderer/checkbox-renderer.component';
import { EIMCheckboxRendererComponentService } from 'app/shared/components/renderer/checkbox-renderer.component.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMPlaceRendererComponent } from 'app/documents/shared/components/renderer/place-renderer.component';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMTagNameRendererComponent } from 'app/documents/shared/components/renderer/tag-name-renderer.component';
import { EIMTagNameRendererComponentService } from 'app/documents/shared/components/renderer/tag-name-renderer.component.service';
import { EIMContentsNameRenameGeneralPipe } from 'app/documents/shared/pipes/contents-name-rename-general.pipe';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMContentsDomain } from 'app/documents/shared/domains/contents.domain';
import { EIMContentsAttributeTypeLayoutDomain } from 'app/documents/shared/domains/contents-attribute-type-layout.domain';
import { Element } from '@angular/compiler';
import { Many } from 'lodash';
import { EIMContentsPropertyService, EIMCheckAllPropertyState } from 'app/documents/shared/services/contents-property.service';
import { EIMContentsAttributeListInputFormItemComponent } from 'app/documents/components/contents-attribute-list-input-form-item/contents-attribute-list-input-form-item.component';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMContentsPropertyComponentService } from 'app/documents/components/contents-property/contents-property.component.service';
import { EIMContentsSearchComponentService } from 'app/documents/components/contents-search/contents-search.component.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';

/**
 * プロパティコンポーネント
 * @example
 *      <eim-contents-property
 *          [content]="content"
 *          [disabled]="false"
 *          [content]="PROPERTY"
 *      >
 *      </eim-contents-property>
 */
@Component({
    selector: 'eim-contents-property',
    templateUrl: './contents-property.component.html',
    styleUrls: ['./contents-property.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMContentsPropertyComponent) }],
    standalone: false
})

export class EIMContentsPropertyComponent implements OnInit, OnChanges, OnDestroy, EIMUpdatable {

	/** フォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: NgForm;

	/** タグデータグリッド */
	@ViewChild('tagGrid')
		tagGrid: EIMDataGridComponent;

	/** 属性リスト入力フォーム */
	@ViewChild('attributeListInputForm', { static: true })
		attributeListInputForm: EIMContentsAttributeListInputFormItemComponent;

		/** 下位引継ぎ対象データグリッド */
	@ViewChild('lowSuccessionDataGrid')
		lowSuccessionDataGrid: EIMDataGridComponent;

	/** 表示対象のオブジェクト */
	@Input() content: any;

	/** 無効 */
	@Input() disabled = true;

	/** 無効 */
	@Input() dialogName = '';

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 画面呼び出し時の無効フラグ退避 */
	public initialDisabled = true;

	/** オブジェクトタイプ毎に表示する項目の設定 */
	public visibleAttributeComponentMap: any = {
		workspace: {
			valueUrl: true,
			valueUrlForOriginal: false,
			valueUrlForPublic: false,
			valueLinkUrl: false,
			valuePath: true,
			valueLinkPath: false,
			valueName: true,
			valueTypeName: false,
			valueRev: true,
			valueCreateUserName: true,
			valueCreateDate: true,
			valueModifyUserName: true,
			valueModifyDate: true,
			valueStatusTypeName: true,
			valueSecurityName: true,
			valueFileSize: false
		},
		folder: {
			valueUrl: true,
			valueUrlForOriginal: false,
			valueUrlForPublic: false,
			valueLinkUrl: false,
			valuePath: true,
			valueLinkPath: false,
			valueName: true,
			valueTypeName: true,
			valueRev: true,
			valueCreateUserName: true,
			valueCreateDate: true,
			valueModifyUserName: true,
			valueModifyDate: true,
			valueStatusTypeName: true,
			valueSecurityName: true,
			valueFileSize: false
		},
		document: {
			valueUrl: true,
			valueUrlForOriginal: true,
			valueUrlForPublic: true,
			valueLinkUrl: false,
			valuePath: true,
			valueLinkPath: false,
			valueName: true,
			valueTypeName: true,
			valueRev: true,
			valueCreateUserName: true,
			valueCreateDate: true,
			valueModifyUserName: true,
			valueModifyDate: true,
			valueStatusTypeName: true,
			valueSecurityName: true,
			valueFileSize: true
		},
		tag: {
			valueUrl: true,
			valueUrlForOriginal: false,
			valueUrlForPublic: false,
			valueLinkUrl: false,
			valuePath: true,
			valueLinkPath: false,
			valueName: true,
			valueTypeName: true,
			valueRev: true,
			valueCreateUserName: true,
			valueCreateDate: true,
			valueModifyUserName: true,
			valueModifyDate: true,
			valueStatusTypeName: true,
			valueSecurityName: true,
			valueFileSize: false
		},
		documentLink: {
			valueUrl: true,
			valueUrlForOriginal: true,
			valueUrlForPublic: true,
			valueLinkUrl: true,
			valuePath: true,
			valueLinkPath: true,
			valueName: true,
			valueTypeName: true,
			valueRev: true,
			valueCreateUserName: true,
			valueCreateDate: true,
			valueModifyUserName: true,
			valueModifyDate: true,
			valueStatusTypeName: true,
			valueSecurityName: true,
			valueFileSize: true
		},
	};

	/** 名称割当設定が有効かどうか */
	public disableNameAllocation = false;

	/** 名称割り当てする属性タイプID */
	public nameAllocationAttributeTypeId: number;

	/** 名称割り当てする対象の属性タイプ名前リスト */
	public nameAllocationSelectItems: SelectItem[] = [];

	/** プロパティタブの全選択チェックボックスの値 */
	public propertyAllCheckFlag = true;

	/** 下位引継ぎ設定が有効かどうか */
	public disableLowSuccession = false;

	/** 下位引継ぎのすべて選択ボタンの値 */
	public lowSuccessionAllCheckFlag = false;

	/** 表示対象のオブジェクトタイプにて表示する項目の設定 */
	public visibleAttributeComponentSet: any;

	/** 下位引継チェックを表示するかどうか */
	public enableSuccessionSetting = false;

	/** 詳細基本情報 */
	public contentDetail: any = {};

	/** URL */
	public valueUrl: string;

	/** 原本ファイルURL */
	public valueUrlForOriginal: string;

	/** 公開ファイルURL */
	public valueUrlForPublic: string;

	/** リンクURL */
	public valueLinkUrl: string;

	/** リンクパス */
	public valueLinkPath: string;

	/** 作成日時 */
	public valueCreateDate: string;

	/** 更新日時 */
	public valueModifyDate: string;

	/** ステータス */
	public valueStatus: string;

	/** スプリットエリア上部サイズ(%) */
	public splitAreaFirstSize: number;

	/** タグタブ表示フラグ */
	public tagTabDisplayFlg = false;

	/** 設定タブ表示フラグ */
	public settingTabDisplayFlg = false;

	/** プロパティタブコピー貼付け活性フラグ */
	public propertyCopyPeastDisabled = false;

	/** 貼付け対象存在フラグ */
	public propertyPeastTargetExist = false;

	/** 詳細情報 */
	private form: EIMContentsDomain = null;

	/** 属性リスト */
	public attributeList: any[];

	/** 属性タイプレイアウトリスト */
	public attributeTypeLayoutList: any[];

	/** 更新中かどうか */
	private updating = false;

	/** 場所クリック時のサブスクリプション */
	private placeRendererComponentServicePlaceClicked?: Subscription;

	/** タグ名クリック時のサブスクリプション */
	private tagNameRendererComponentServiceTagNameClicked?: Subscription;

	/** チェックボックスレンダラのエミッタ */
	private checked: any;

	/** タグタブ表示フラグ（ワーク）  */
	private privateTagTabFlg = false;

	/** 設定タブ表示フラグ（ワーク） */
	private privateSettingTabFlg = false;

	/** ロケール */
	private locale: string;

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** クリップボードコピー用URL */
	public docAccessUrl: string;

	/** クリップボードコピー用原本ファイルURL */
	public orgDocAccessUrl: string;

	/** クリップボードコピー用公開ファイルURL */
	public publicDocAccessUrl: string;


	/**
	 * コンストラクタです.
	 */
	constructor(
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			protected translateService: TranslateService,
			protected attributeListInputFormItemComponentService: EIMAttributeListInputFormItemComponentService,
			protected attributeService: EIMAttributeService,
			protected contentsService: EIMContentsService,
			protected documentFormService: EIMDocumentFormService,
			protected documentTagService: EIMTagService,
			protected dateService: EIMDateService,
			protected domainService: EIMDomainService,
			protected messageService: EIMMessageService,
			protected serverConfigService: EIMServerConfigService,
			protected attachementFileInputFormItemComponentService: EIMAttachementFileInputFormItemComponentService,
			protected contentsNameRenameGeneralPipe: EIMContentsNameRenameGeneralPipe,
			protected checkboxRendererComponentService: EIMCheckboxRendererComponentService,
			protected placeRendererComponentService: EIMPlaceRendererComponentService,
			protected tagNameRendererComponentService: EIMTagNameRendererComponentService,
			protected injector: Injector,
			protected contentsPropertyService: EIMContentsPropertyService,
			protected fileService: EIMFileService,
			protected contentsPropertyComponentService: EIMContentsPropertyComponentService,
			protected documentCacheService: EIMDocumentsCacheService,
		) {
				this.locale = this.injector.get(LOCALE_ID);
				this.checked = checkboxRendererComponentService.changed.subscribe((target: any) => {
					window.setTimeout(() => {
						this.onChangeSuccessionFlag(true);
					});
				});
			}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コンテンツ情報を更新します.
	 */
	public update(): void {
		this.updating = true;

		if (this.content.isDocument && (this.content.isDocument === true || this.content.isDocument === this.FLAG_TRUE)) {
	  	// ドキュメントの場合

			// 複数値属性の設定値から未入力分を削除。
			let formClone = Object.assign({}, this.form);
			formClone.attributeList = this.attributeService.excludeNullAttributeList(this.form.attributeList);

			this.documentFormService.update(formClone).subscribe(
				(resForm: EIMContentsDomain) => {
					// 検索キャッシュクリア
					this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
					// 完了イベントを通知(画面が閉じる)
					let data = [{objId: resForm.id, isDocumentLink: this.content.isDocumentLink, attributeList: this.form.attributeList}];
					this.updated.emit(data);
					this.contentsPropertyComponentService.updatedEmit(data);
					this.dialogManagerComponentService.close(this.dialogName);
				},
				(err: any) => {
					// エラー発生時
					this.updating = false;
				}
			);
	  } else {
	  	// ドキュメント以外の場合

			// 名称割当を設定
			if (this.nameAllocationAttributeTypeId !== -1) {
				this.form._nameAllocationAttributeTypeId = this.nameAllocationAttributeTypeId;
				// 名称変更
				for (let i = 0; i < this.form.attributeList.length; i++) {
					let attribute: EIMAttributeDomain = this.form.attributeList[i];
					if (attribute.attributeType.id === this.nameAllocationAttributeTypeId) {
						let names = attribute.getValueList();
						if (names && names.length === 1) {
							if (attribute.attributeType.valueType === 'CODE') {
								if (names[0] !== null && names[0] !== "") {
									this.form.name = names[0]['code'];
								} else {
									this.form.name = '';
								}
							} else {
								this.form.name = names[0];
							}

							// 名称割当する属性の値が空の場合エラーとする
							if (this.form.name === '') {
								this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00063'));
								this.updating = false;
								return;
							}
							break;
						}
					}
				}
			}

			if (this.form.name === '') {
				// 一度名称割当する属性の値が空によるエラーを発生させると、form.nameの値が空となるため、元の名称をセットする
				this.form.name = this.contentDetail.objName;
			}
			this.contentsService.update(this.form).subscribe(
				(res: any) => {
					// 検索キャッシュクリア
					this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
					// 完了イベントを通知(画面が閉じる)
					let data = [{objId: this.form.id, attributeList: this.form.attributeList, objName: this.form.name}];
					this.updated.emit(data);
					this.contentsPropertyComponentService.updatedEmit(data);
					this.dialogManagerComponentService.close(this.dialogName);
				},
				(err: any) => {
					// エラー発生時
					this.updating = false;
				}
			);
	  }

		this.attachementFileInputFormItemComponentService.clear();
	}

	/**
	 * コンテンツ情報更新可否を返却します.
	 * @return コンテンツ情報更新可否
	 */
	public updatable(): boolean {
		return this.propertyForm.dirty && this.propertyForm.valid && !this.updating;
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event: any, close: EventEmitter<null>): void {
		event.preventDefault();

		if (this.propertyForm.dirty) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
						close.emit();
					}
			);
		} else {
			this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
			close.emit();
		}
	}

	/**
	 * URLリンクダウンロードを実行します.
	 * @param url URL
	 * @param kind リンク種別
	 */
	public downLoadUrlLinkFile(url: string, kind: number): void {
		// ダウンロード実行
		let objNameList = [];
		let urlLinkList = [];
		if( kind === EIMDocumentsConstantService.URLLINK_DOWNLOAD_KIND_PUBLIC){
			objNameList.push(this.contentDetail.publicFileName);
		}else{
			objNameList.push(this.contentDetail.objName);
		}
		urlLinkList.push(url);
		this.fileService.downLoadUrlLinkFile(objNameList,  urlLinkList, kind);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		if (this.content.isDocumentLink && (this.content.isDocumentLink === true || this.content.isDocumentLink === this.FLAG_TRUE)) {
			// ドキュメントリンクの場合
			this.visibleAttributeComponentSet = this.visibleAttributeComponentMap.documentLink;
			this.enableSuccessionSetting = true;
		} else if (this.content.isDocument && (this.content.isDocument === true || this.content.isDocument === this.FLAG_TRUE)) {
			// ドキュメントの場合
			this.visibleAttributeComponentSet = this.visibleAttributeComponentMap.document;
			this.enableSuccessionSetting = false;
		} else if (this.content.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE) {
			// ワークスペースの場合
			this.visibleAttributeComponentSet = this.visibleAttributeComponentMap.workspace;
			this.enableSuccessionSetting = true;
		} else if (this.content.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
			// フォルダの場合
			this.visibleAttributeComponentSet = this.visibleAttributeComponentMap.folder;
			this.enableSuccessionSetting = true;
		} else if (this.content.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			// タグの場合
			this.visibleAttributeComponentSet = this.visibleAttributeComponentMap.tag;
			this.enableSuccessionSetting = true;
		}

		// 場所クリックイベントハンドラ
		if (!this.placeRendererComponentServicePlaceClicked) {
			this.placeRendererComponentServicePlaceClicked = this.placeRendererComponentService.placeClicked.subscribe((data: any) => {
				// プロパティ画面を閉じる
				if (data.dialogName === this.dialogName) {
					this.dialogManagerComponentService.close(this.dialogName);
				}
			});
		}

		// タグ名称クリックイベントハンドラ
		if (!this.tagNameRendererComponentServiceTagNameClicked) {
			this.tagNameRendererComponentServiceTagNameClicked = this.tagNameRendererComponentService.nameClicked.subscribe((data: any) => {
				if (data.dialogName === this.dialogName) {
					data.isFolder = true;
					// コンテンツアクセスイベントをエミット
					this.contentsPropertyComponentService.jumpTargetClickedEmit(data);
					// プロパティ画面を閉じる
					this.dialogManagerComponentService.close(this.dialogName);
				}
			});
		}

		this.propertyPeastTargetExist = this.contentsPropertyService.isAblePasteAttribute();
	}

	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges): void {
		// 初期表示時は更新ボタンを非表示にする
		// 更新権限がある場合のみ更新ボタンを表示する
		this.initialDisabled = this.disabled;
		this.disabled = true;

		window.setTimeout(() => {
			this.splitAreaFirstSize = 50;
		});

		this.show();
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		this.attachementFileInputFormItemComponentService.deleteTemplate();
		if (!this.checked.closed) {
			this.checked.unsubscribe();
		}

		// 場所クリックサブスクリプションがクローズされていなければクローズ
		if (!this.placeRendererComponentServicePlaceClicked.closed) {
			this.placeRendererComponentServicePlaceClicked.unsubscribe();
		}

		// タグ名クリックサブスクリプションがクローズされていなければクローズ
		if (!this.tagNameRendererComponentServiceTagNameClicked.closed) {
			this.tagNameRendererComponentServiceTagNameClicked.unsubscribe();
		}
	}

	/**
	 * 下位引継ぎフラグ更新時イベントハンドラです.
	 * @param dirty ダーティフラグ
	 */
	onChangeSuccessionFlag(dirty: boolean): void {
		if (dirty) {
			this.propertyForm.form.controls['successionFlag_1'].markAsDirty();
		}

		let checkedCount = 0;
		let unCheckedCount = 0;

		for (let i = 0; i < this.lowSuccessionDataGrid.getRowCount(); i++) {
			let rowData: any = this.lowSuccessionDataGrid.getDataByRowIndex(i);
			if (rowData._lowSuccession) {
				checkedCount++;
			} else {
				unCheckedCount++;
			}
		}

		// すべてチェック済の場合
		if (checkedCount === this.lowSuccessionDataGrid.getRowCount()) {
			this.lowSuccessionAllCheckFlag = true;
		} else {
			this.lowSuccessionAllCheckFlag = false;
		}
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
	 * 全選択/解除チェックボックスクリックイベントハンドラ
	 *@param event イベント
	 */
	onChangePropertyAllCheckFlag(event: any): void {
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
	onClickPropertyCopy(event: any): void {
		this.contentsPropertyService.copyAttribute(this.attributeList, this.attributeTypeLayoutList);
		this.propertyPeastTargetExist = this.contentsPropertyService.isAblePasteAttribute();
	}

	/**
	 * プロパティタブの貼り付けボタン押下時のハンドラです.
	 * @param event イベント
	 */
	onClickPropertyPaste(event: any): void {
		this.contentsPropertyService.pasteAttribute(this.attributeList);
	}

	/**
	 * 設定タブの全選択/全解除のクリックイベントです.
	 * @param event イベント
	 */
	settingAllCheck(event: any): void {
		// グリッドのチェックボックスの値を全て変更
		for (let i = 0; i < this.lowSuccessionDataGrid.getRowCount(); i++) {
			let rowData: any = this.lowSuccessionDataGrid.getDataByRowIndex(i);
			if (this.disabled === false && rowData.disabled === false) {
				rowData._lowSuccession = this.lowSuccessionAllCheckFlag;
			}
		}
		this.lowSuccessionDataGrid.refreshView();
	}


	/**
	 * 対象にジャンプクリックイベントです.
	 */
	pathClick(): void {
		let data: any = { objId: this.content.objId };
		// 対象にジャンプイベントをエミット
		this.contentsPropertyComponentService.jumpTargetClickedEmit(data);
		// プロパティ画面を閉じる
		this.dialogManagerComponentService.close(this.dialogName);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 入力コンポーネントを表示します.
	 * ドキュメント(帳票)サービスを使用し、詳細情報を取得します.
	 */
	protected show(): void {

		let objTypeId: number;

		if (!this.content.objId) {
			return;
		}
		let addUrl = '';
		if (this.content.isDocumentLink && (this.content.isDocumentLink === true || this.content.isDocumentLink === this.FLAG_TRUE)) {
			// ドキュメントリンクの場合
			this.privateTagTabFlg = true;
		} else if (this.content.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE) {
			addUrl = 'isFolder=true'
		} else if (this.content.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
			// フォルダの場合
			this.privateTagTabFlg = true;
			this.privateSettingTabFlg = true;
			addUrl = 'isFolder=true'
		} else if (this.content.isDocument && (this.content.isDocument === true || this.content.isDocument === this.FLAG_TRUE)) {
			// ドキュメントの場合
			this.privateTagTabFlg = true;
		} else if (this.content.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			// タグの場合
			this.privateTagTabFlg = true;
			addUrl = 'isFolder=true'
		}

		// 基本情報取得
		this.documentFormService.getObjectProperty(this.content.objId).subscribe(
			(object: any) => {
				objTypeId = object.objTypeId;

				const documentURL = this.documentCacheService.getDocumentURLCache();

				// URL設定
				// 原本選択URL設定
				let paramsForSelectObject = ['objId=' + object.objId, addUrl];
				if (documentURL.paramsForSelectObject) {
					paramsForSelectObject = paramsForSelectObject.concat(documentURL.paramsForSelectObject);
				}
				this.valueUrl = documentURL.contextRootForSelectObject + '/client' + '/#' + documentURL.routePathForSelectObject + '?' + paramsForSelectObject.join('&');

				// リンク選択URL設定
				let paramsForSelectObjectLink = ['objId=' + object.objId, 'linkParentObjId=' + this.content.linkParentObjId];
				if (documentURL.paramsForSelectObject) {
					paramsForSelectObjectLink = paramsForSelectObjectLink.concat(documentURL.paramsForSelectObject);
				}
				this.valueLinkUrl = documentURL.contextRootForSelectObject + '/client' + '/#' + documentURL.routePathForSelectObject + '?' + paramsForSelectObjectLink.join('&');

				// 原本ダウンロードURL設定
				const paramForDownloadPrivate = ['objId=' + object.objId];
				this.valueUrlForOriginal = documentURL.contextRootForDownloadDocument +
						EIMDocumentsConstantService.PATH_FOR_DOWNLOAD_PRIVATE_DOCUMENT + '?' + paramForDownloadPrivate.join('&');

				// 公開ダウンロードURL設定
				const paramForDownloadPublic = ['objId=' + object.objId];
				this.valueUrlForPublic = documentURL.contextRootForDownloadDocument +
						EIMDocumentsConstantService.PATH_FOR_DOWNLOAD_PUBLIC_DOCUMENT + '?' + paramForDownloadPublic.join('&');

				this.valueLinkPath = this.content.path;
				this.valueCreateDate = this.dateService.getDateTimeString(object.createDateTime * 1000);
				this.valueModifyDate = this.dateService.getDateTimeString(object.modifyDateTime * 1000);
				this.contentDetail = object;
				this.contentDetail._commaSeparatedfileSize = DecimalPipe.prototype.transform(this.contentDetail.fileSize, '1.0-3', this.locale);

				// ステータスタイプ
				if (object.expiration === this.FLAG_TRUE) {
					this.valueStatus = this.translateService.instant('EIM_DOCUMENTS.LABEL_02043');
				} else if (object.lockUserName !== undefined && object.lockUserName !== '') {
					this.valueStatus = this.translateService.instant('EIM_DOCUMENTS.LABEL_02035') + '(' + object.lockUserName + ')';
				} else {
					this.valueStatus = object.statusTypeName;
				}

				// ドキュメントアクセスURLクリップボード出力設定が'出力する'の場合
				if (this.serverConfigService.docAccessUrlPathFlg === true) {
					this.docAccessUrl = this.contentDetail.path + this.contentDetail.objName + '\r\n' + this.valueUrl;
				} else {
					this.docAccessUrl = this.valueUrl;
				}
				// 原本ドキュメントアクセスURLクリップボード出力設定が'出力する'の場合
				if (this.serverConfigService.orgDocAccessUrlPathFlg === true) {
					this.orgDocAccessUrl = this.contentDetail.path + this.contentDetail.objName + '\r\n' + this.valueUrlForOriginal;
				} else {
					this.orgDocAccessUrl = this.valueUrlForOriginal;
				}
				// 公開ドキュメントアクセスURLクリップボード出力設定が'出力する'の場合
				if (this.serverConfigService.publicDocAccessUrlPathFlg === true) {
					this.publicDocAccessUrl = this.contentDetail.path + this.contentDetail.objName + '\r\n' + this.valueUrlForPublic;
				} else {
					this.publicDocAccessUrl = this.valueUrlForPublic;
				}
			},
			(err: any) => {
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);

		// タグ一覧情報取得
		if (this.privateTagTabFlg === true) {
			this.documentTagService.getObjectAddedTagList(this.content.objId)
			.subscribe(
				(object: any) => {
					if (object.length === 0) {
						this.privateTagTabFlg = false;
					}	else {
						this.tagTabDisplayFlg = this.privateTagTabFlg;
						// カラムを設定
						let tagColumns: EIMDataGridColumn[] = [];
						// 名前
						tagColumns.push({field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'),
						width: 300, cellRendererFramework: EIMTagNameRendererComponent, editable: false});
						// 場所
						tagColumns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'),
						width: 448, cellRendererFramework: EIMPlaceRendererComponent});

						window.setTimeout(() => {
							this.tagGrid.setColumns(tagColumns);
							this.tagGrid.showAllSelectButton = false;
							// データを設定
							for (let i = 0; i < object.length; i++) {
								object[i].dialogName = this.dialogName;
							}
							this.tagGrid.setData(object);
						});
					}
				},
				(err: any) => {
					window.setTimeout(() => {
						this.errored.emit();
					});
				}
			);
		}

		// 属性情報取得
		this.settingTabDisplayFlg = this.privateSettingTabFlg;
		this.documentFormService.getDocumentById(this.content.objId).subscribe(
			(form: EIMContentsDomain) => {
				let attributeTypeLayoutList: EIMContentsAttributeTypeLayoutDomain[] = form.formLayout.objectTypeLayout.attributeTypeLayoutList;
				let attributeList = form.attributeList;

				// 更新権限チェック
				for (let i = 0; i < form.accessRoleTypeList.length; i++) {
					if (form.accessRoleTypeList[i].definitionName === 'UPDATE') {
						if (!this.initialDisabled) {
							// 更新権限がある場合のみボタンを更新表示する。
							this.disabled = false;
						}
					}
				}

				if (this.content.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
					// フォルダの場合、プロパティ、有効期限を最上位に移動する
					attributeTypeLayoutList = this.sortAttributeTypeLayoutList(attributeTypeLayoutList);

					// カラムを設定
					if (this.privateSettingTabFlg === true) {
						let successionTargetColumns: EIMDataGridColumn[] = [];
						// 下位引継ぎ
						successionTargetColumns.push({field: '_lowSuccession', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02137'),
							cellStyle: {'padding-left': '50px'} , width: 120, cellRendererFramework: EIMCheckboxRendererComponent, editable: false,
							suppressFilter: true , headerClass: 'eim-editable-column-header'});
						// 名前
						successionTargetColumns.push({field: 'attributeType.name', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 444, editable: false, suppressFilter: true});
						window.setTimeout(() => {
							this.lowSuccessionDataGrid.setColumns(successionTargetColumns);
							this.lowSuccessionDataGrid.showAllSelectButton = false;
						});
					}

					this.documentFormService.getObjectAttribute(objTypeId, null, this.content.objId).subscribe((attributeTypeList: any[]) => {
						// 名称割当の設定
						let nameAllocationSelectItems =
								this.contentsPropertyService.createNameAllocationSelectItemList(attributeTypeList, this.attributeTypeLayoutList);
						if (1 < nameAllocationSelectItems.length) {
							this.disableNameAllocation = false;
						} else {
							this.disableNameAllocation = true;
						}
						this.nameAllocationSelectItems = nameAllocationSelectItems;
						this.nameAllocationAttributeTypeId = this.contentsPropertyService.getSelectedNameAllocationAttributeTypeId(this.attributeList);

						// 下位引継ぎの設定
						this.lowSuccessionAllCheckFlag = false;
						let lowSuccessAttributeList = this.contentsPropertyService.getAttributeListForLowSuccess(
							this.attributeListInputForm.layoutAndAttributeList, this.disabled);
						this.lowSuccessionDataGrid.setData(lowSuccessAttributeList.concat());
						if (0 < lowSuccessAttributeList.length) {
							this.disableLowSuccession = false;
						} else {
							this.disableLowSuccession = true;
						}
						this.onChangeSuccessionFlag(false);
					});
				} else if (this.content.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
					for (let i = 0; i < attributeTypeLayoutList.length; i++) {
						if (attributeTypeLayoutList[i].successionFlag) {
							attributeTypeLayoutList[i].successionFlag = false;
						}
					}
				}
				for (let i = 0; i < attributeTypeLayoutList.length; i++) {
					if (attributeTypeLayoutList[i].valueType === 'OBJECT') {
						attributeTypeLayoutList[i]['pearentObjId'] = this.content.objId;
					}
				}

				this.form = form;
				this.attributeList = attributeList;
				this.attributeTypeLayoutList = attributeTypeLayoutList;
			},
			(err: any) => {
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);
	}

	/**
	 * レイアウト情報をプロパティ、有効期限、その他の順にソートします.
	 * @param attributeTypeLayoutList 属性タイプレイアウト情報リスト
	 * @return 属性タイプレイアウト情報リスト
	 */
	private sortAttributeTypeLayoutList(attributeTypeLayoutList: EIMContentsAttributeTypeLayoutDomain[]): EIMContentsAttributeTypeLayoutDomain[] {
		let property: EIMContentsAttributeTypeLayoutDomain;
		let expiredate: EIMContentsAttributeTypeLayoutDomain;
		let etc: EIMContentsAttributeTypeLayoutDomain[] = [];
		for (let i = 0; i < attributeTypeLayoutList.length; i++) {
			let attributeTypeLayout: EIMContentsAttributeTypeLayoutDomain = attributeTypeLayoutList[i];
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
}
