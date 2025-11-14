import { Component, forwardRef, EventEmitter, Input, Output, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, UntypedFormGroup, NgForm, Validators, FormControl, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { SelectItem } from 'primeng/api';

import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { EIMContentsTypeService, EIMDocumentType } from 'app/documents/shared/services/apis/contents-type.service';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMFolderService, EIMFolder, EIMFolderType } from 'app/documents/shared/services/apis/folder.service';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMContentsPropertyService, EIMCheckAllPropertyState } from 'app/documents/shared/services/contents-property.service';

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
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCheckboxRendererComponent } from 'app/shared/components/renderer/checkbox-renderer.component';
import { EIMContentsAttributeListInputFormItemComponent } from 'app/documents/components/contents-attribute-list-input-form-item/contents-attribute-list-input-form-item.component';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';
import { EIMCheckboxRendererComponentService } from 'app/shared/components/renderer/checkbox-renderer.component.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { of, Observable } from 'rxjs';

/**
 * ファイル登録コンポーネント
 * @example
 *
 *      <eim-folder-creator
 *          [parentObjId]="parentObjId"
 *          [workspaceObjId]="workspaceObjId"
 * 					[path]="path">
 *      </eim-folder-creator>
 */
@Component({
    selector: 'eim-folder-creator',
    templateUrl: './folder-creator.component.html',
    styleUrls: ['./folder-creator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFolderCreatorComponent) },],
    standalone: false
})
export class EIMFolderCreatorComponent implements OnInit, OnDestroy, EIMCreatable {

	/** フォーム */
	@ViewChild('folderForm', { static: true }) folderForm: NgForm;

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram', { static: true })
		workflowDiagram: EIMDiagramComponent;

	/** 属性リスト入力フォーム */
	@ViewChild('attributeListInputForm', { static: true })
		attributeListInputForm: EIMContentsAttributeListInputFormItemComponent;

	/** 下位引継ぎ属性データグリッド */
	public lowSuccessionDataGrid: EIMDataGridComponent;
	@ViewChild('successionTargetGrid')
		set successionTargetGrid(successionTargetGrid: EIMDataGridComponent) {
			if (!successionTargetGrid) {
				return;
			}
			this.lowSuccessionDataGrid = successionTargetGrid;
			let columns: EIMDataGridColumn[] = [];
			// 下位引継ぎ
			columns.push({field: '_lowSuccession', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02137'),
					cellStyle: {'padding-left': '50px'} , width: 120, cellRendererFramework: EIMCheckboxRendererComponent, editable: false,
					suppressSorting: true, suppressFilter: true, suppressMovable: true, headerClass: 'eim-editable-column-header'});
			// 名前
			columns.push({field: 'attributeType.name', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'),
					width: 196, editable: true, suppressSorting: true, suppressFilter: true, suppressMovable: true});

			successionTargetGrid.setColumns(columns);
			window.setTimeout(() => {
				successionTargetGrid.showAllSelectButton = false;
			});
		}

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
	public name = '';

	/** 名前割当 */
	public nameAllocationObservable: any;

	/** 属性タイプレイアウト情報リスト */
	public attributeTypeLayoutList: EIMContentsAttributeTypeLayoutDomain[];

	/** 属性情報リスト */
	public attributeList: EIMAttributeDomain[];

	/** 名称割当設定が有効かどうか */
	public disableNameAllocation = false;

	/** 名称割り当てする属性タイプID */
	public nameAllocationAttributeTypeId: number;

	/** 名称割当選択フラグ */
	public nameAllocationSelectFlg = false;

	/** 名称割り当てする対象の属性タイプ名前リスト */
	public nameAllocationSelectItems: SelectItem[] = [];

	/** 下位引継ぎ設定が有効かどうか */
	public disableLowSuccession = false;

	/** チェックボックスレンダラのエミッタ */
	private checked: any;

	/** 下位引継ぎのすべて選択ボタンの値 */
	public lowSuccessionAllCheckFlag = false;

	/** 作成中かどうか */
	public creating = false;

	/** プロパティタブのフッタを表示可否 */
	public selectTypeFlag = false;

	/** プロパティの全選択／解除チェックボックス */
	public propertyAllCheckFlag = true;

	/** コピー貼付け活性フラグ */
	public propertyCopyPeastDisabled = false;

	/** 貼付け対象存在フラグ */
	public propertyPeastTargetExist = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected attributeService: EIMAttributeService,
		protected contentsService: EIMContentsService,
		protected contentsTypeService: EIMContentsTypeService,
		protected folderService: EIMFolderService,
		protected objectTypeService: EIMObjectTypeService,
		protected documentsAttributeDomainService: EIMDocumentsAttributeDomainService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected contentsPropertyService: EIMContentsPropertyService,
		protected checkboxRendererComponentService: EIMCheckboxRendererComponentService,
		protected documentFormService: EIMDocumentFormService,
	) {
		this.checked = checkboxRendererComponentService.changed.subscribe((target: any) => {
			window.setTimeout(() => {
				this.onChangeSuccessionFlag();
			});
		});
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * フォルダ情報を登録します.
	 */
	public create(): void {

		// 入力値のチェック
		if (this.isIllegalFolderName()) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00009'));
			return;
		}

		this.creating = true;

		let folder: EIMContentsDomain = new EIMContentsDomain();
		folder.name = this.name;
		let contentsLayoutDomain: EIMContentsLayoutDomain = new EIMContentsLayoutDomain();
		folder.formLayout = contentsLayoutDomain;
		let contentsObjectTypeLayoutDomain: EIMContentsObjectTypeLayoutDomain = new EIMContentsObjectTypeLayoutDomain();
		folder.formLayout.objectTypeLayout = contentsObjectTypeLayoutDomain;
		folder.formLayout.objectTypeLayout.attributeTypeLayoutList = this.attributeTypeLayoutList;
		folder.attributeList = this.attributeList;
		folder.type = new EIMObjectTypeDomain();
		folder.type.id = this.selectedTypeId;

		// 名称割当を設定
		if (this.nameAllocationAttributeTypeId !== -1) {
			folder._nameAllocationAttributeTypeId = this.nameAllocationAttributeTypeId;
			// 名称変更
			if (folder.attributeList) {
				for (let i = 0; i < folder.attributeList.length; i++) {
					let attribute: EIMAttributeDomain = folder.attributeList[i];
					if (attribute.attributeType.id === this.nameAllocationAttributeTypeId) {
						let names = attribute.getValueList();
						if (names && names.length === 1) {
							if (attribute.attributeType.valueType === 'CODE') {
								folder.name = names[0]['code'];
							} else {
								folder.name = names[0];
							}
							break;
						}
					}
				}
			}
		}

  	this.folderService.create(folder, this.parentObjId).subscribe(
			(res: any) => {
				// 完了イベントを通知(画面が閉じる)
				this.created.emit([{objId: res.objId}]);
			},
			(err: any) => {
				// エラー発生時
				this.creating = false;
			}
		);
	}

	/**
	 * フォルダ登録可否を返却します.
	 * @return フォルダ登録可否
	 */
	public creatable(): boolean {
		return this.name && !this.creating && this.folderForm.valid;
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		event.preventDefault();

		if (this.folderForm.dirty) {
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
	 * タイプ変更イベントハンドラ
	 * @param event イベント
	 */
	public onChangeType(event: any): void {
		if (this.isDirtyProperties()) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
				() => {
					this.dirtyClear();
					this.changeType();
				},
				() => {
					// 選択を戻す
					this.selectedTypeId = this.preSelectedTypeId;
				}
			);
		} else {
			// フォルダタイプの詳細情報を取得する
			if (this.selectedTypeId == null) {
				return;
			}
			this.changeType();
		}
	}

	/**
	 * フォルダ名に禁則文字が含まれているかどうかを返却します.
	 * @return 禁則文字が含まれている場合trueを返却
	 */
	public isIllegalFolderName(): boolean {
		let match = this.name.match(EIMConstantService.FORBIDDEN_PATTERN);
		return match != null;
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
		// フォルダタイプ一覧取得
		this.objectTypeService.getHierarchical(this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_FOLDER).subscribe(
			(hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
				this.setTypeSelectItems(hierarchicalContentsType, null);
			},
			(err: any) => {
				window.setTimeout(() => {
					this.errored.emit();
				})
			}
		);

		this.propertyPeastTargetExist = this.contentsPropertyService.isAblePasteAttribute();
	}

	/**
	 * タイプ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickShowObjectTypeSelector(event: any): void {
		// フォルダタイプツリーを表示する
		let dialogId: string = this.dialogManagerComponentService.showObjectTypeTreeSelector(null,
			this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_FOLDER,
			{
				selected: (documentType: any) => {
					this.dialogManagerComponentService.close(dialogId);
					if (this.isDirtyProperties()) {
						// 破棄確認ダイアログ
						this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
							() => {
								this.dirtyClear();
								this.selectedTypeId = documentType.id;
								this.changeType();
							},
							() => {
								// 何もしない
							}
						);
					} else {
						this.selectedTypeId = documentType.id;
						this.changeType();
					}
				}
			}
		);
	}

	/** 設定タブの全選択/全解除のクリックイベントです.
	 *  @param event イベント
	 */
	settingAllCheck(event: any): void {
		// グリッドのチェックボックスの値を全て変更
		for (let i = 0; i < this.lowSuccessionDataGrid.getRowCount(); i++) {
			let rowData: any = this.lowSuccessionDataGrid.getDataByRowIndex(i);
			if (rowData.disabled === false) {
				rowData._lowSuccession = this.lowSuccessionAllCheckFlag;
			}
		}
		this.lowSuccessionDataGrid.refreshView();
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
		this.contentsPropertyService.copyAttribute(this.attributeList);
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
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		if (!this.checked.closed) {
			this.checked.unsubscribe();
		}
		if (this.nameAllocationObservable && !this.nameAllocationObservable.closed) {
			this.nameAllocationObservable.unsubscribe();
		}
	}

	/**
	 * 名前割当変更時イベントハンドラです.
	 */
	onChangeNameAllocation(): void {
		if (this.nameAllocationAttributeTypeId !== -1) {
			this.nameAllocationSelectFlg = true;

			if (this.nameAllocationObservable && !this.nameAllocationObservable.closed) {
				this.nameAllocationObservable.unsubscribe();
			}

			for (let i = 0; i < this.attributeList.length; i++) {
				if (this.nameAllocationAttributeTypeId === this.attributeList[i].attributeType.id) {
					let attrbute = this.attributeList[i];
					let nameControl = this.folderForm.form.controls['attr_' + this.nameAllocationAttributeTypeId + '_0'];
					this.nameAllocationObservable = nameControl.valueChanges.subscribe(() => {
						if (attrbute.attributeType.valueType === 'CODE') {
							this.name = attrbute.codeList[0].name;
						} else {
							this.name = attrbute.stringList[0];
						}
					});
					if (attrbute.attributeType.valueType === 'CODE') {
						this.name = attrbute.codeList[0].name;
					} else {
						this.name = attrbute.stringList[0];
					}
					break;
				}
			}
		} else {
			this.nameAllocationSelectFlg = false;
		}
	}

	/**
	 * 下位引継ぎフラグ更新時イベントハンドラです.
	 */
	onChangeSuccessionFlag(): void {
		let checkedCount = 0;
		let unCheckedCount = 0;

		this.folderForm.form.controls['SettingAllCheck'].markAsDirty();

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


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * フォルダタイプ変更処理です.
	 * フォルダタイプ情報を取得します.
	 * フォルダタイプ情報の属性タイプレイアウト情報をソート、上位階層からの下位引継ぎの値を反映します.
	 */
	private changeType(): void {

		this.selectTypeFlag = true;

		this.contentsTypeService.getByIdAndParent(this.selectedTypeId, this.parentObjId)
		.subscribe((formType: EIMContentsTypeDomain) => {

			// すべて選択解除のチェックを初期化
			this.propertyAllCheckFlag = true;

			// 下位引継ぎの値を設定
			this.attributeTypeLayoutList = this.sortAttributeTypeLayoutList(formType.formLayout.objectTypeLayout.attributeTypeLayoutList);
			this.attributeList = this.documentsAttributeDomainService.getInitializedAttributeList(this.attributeTypeLayoutList);

			this.documentFormService.getObjectAttribute(this.selectedTypeId, this.parentObjId).subscribe((attributeTypeList: any[]) => {
				// 名称割当の設定
				let nameAllocationSelectItems =
						this.contentsPropertyService.createNameAllocationSelectItemList(attributeTypeList, this.attributeTypeLayoutList);
				if (nameAllocationSelectItems.length > 1) {
					this.disableNameAllocation = false;
				} else {
					this.disableNameAllocation = true;
				}
				this.nameAllocationSelectItems = nameAllocationSelectItems;
				this.nameAllocationAttributeTypeId = -1;

				// 下位引継ぎの設定
				this.lowSuccessionAllCheckFlag = false;
				let lowSuccessAttributeList = this.contentsPropertyService.getAttributeListForLowSuccess(
					this.attributeListInputForm.layoutAndAttributeList);
				this.lowSuccessionDataGrid.setData(lowSuccessAttributeList);
				if (0 < lowSuccessAttributeList.length) {
					this.disableLowSuccession = false;
				} else {
					this.disableLowSuccession = true;
				}
			});
		})

		// ワークフロー表示初期化
		let objTypeId: number = this.selectedTypeId;
		this.workflowDiagram.clear();
		this.workflowDiagram.show({createType: 'folder', objTypeId: objTypeId, workspaceId: this.parentObjId});

		this.preSelectedTypeId = this.selectedTypeId;
	}

	/**
	 * レイアウト情報をプロパティ、有効期限、その他の順にソートします.
	 * @param attributeTypeLayoutList 属性タイプレイアウト情報配列
	 * @return ソート後の属性タイプレイアウト情報配列
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
		let keys = Object.keys(this.folderForm.form.controls);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key === 'type' || key === 'path' || key === 'folderName') {
				continue;
			}
			if (this.folderForm.form.controls[key].dirty) {
				return true;
			}
		}
		return false;
	}

	/**
	 * ダーティをクリアします.
	 * @return プロパティ属性が編集されたかどうか
	 */
	private dirtyClear() {
		this.nameAllocationSelectFlg = false;

		let keys = Object.keys(this.folderForm.form.controls);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key === 'type' || key === 'path' || key === 'folderName') {
				continue;
			}
			if (this.folderForm.form.controls[key].dirty) {
				this.folderForm.form.controls[key].markAsPristine();
			}
		}
	}
}
