import { Component, IterableDiffers, OnInit, Input, ViewChild, ViewContainerRef, TemplateRef, forwardRef } from '@angular/core';
import { FormGroup, FormControl, NgForm, NG_VALUE_ACCESSOR, ControlValueAccessor,
	Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { SelectItem } from 'primeng/api'

import { FileUploader, FileItem } from 'ng2-file-upload';

import { EIMFileService } from 'app/shared/services/apis/file.service';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMFileObjectCreatorDomain } from 'app/shared/domains/file-object-creator.domain';
import { EIMTempFileObjectDomain } from 'app/shared/domains/temp-file-object.domain';
import { EIMTemplateFileDTO } from 'app/shared/dtos/template-file.dto';

import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMPublicFileRendererComponent } from 'app/documents/shared/components/renderer/public-file-renderer.component';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMFormObjectDomain } from 'app/shared/domains/form-object.domain';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMContentsSearchComponentService } from 'app/documents/components/contents-search/contents-search.component.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';

/**
 * 関連ドキュメント入力フォームアイテムコンポーネント
 * @example
 *      <eim-relation-file-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-relation-file-input-form-item>
 */
@Component({
    selector: 'eim-relation-file-input-form-item',
    templateUrl: './relation-file-input-form-item.component.html',
    styleUrls: ['./relation-file-input-form-item.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMRelationFileInputFormItemComponent) },
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMRelationFileInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMRelationFileInputFormItemComponent extends EIMInputFormItemComponent implements OnInit {

	/** ステータス属性データグリッド */
	@ViewChild('relationDocumentsList', { static: true })
		relationDocumentsList: EIMDataGridComponent;

	/** 表示データ */
	public data: SelectItem[] = [];
	/** 選択データ */
	public selectedData: string[] = [];

	/** ファイル作成ダイアログ表示フラグ */
	public displayFileCreator = false;
	/** ファイル作成ダイアログのテンプレートファイルの配列 */
	public templateFileSelectItems: SelectItem[] = null;
	/** ファイル作成ダイアログの選択テンプレートファイル */
	public selectedTemplateFilePath: string;
	/** ファイル作成ダイアログの作成ファイル名 */
	public createFileName = '';

	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;

	/** オブジェクトに紐づいているファイルオブジェクトのファイル名のSet */
	private savedFileNameAndObjectMap: any = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected translateService: TranslateService,
		protected fileService: EIMFileService,
		protected messageService: EIMMessageService,
		protected serverConfigService: EIMServerConfigService,
		protected differs: IterableDiffers,
	) {
		super(differs);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 値をコンポーネントに書き込みます.
	 * ControlValueAccessorの実装です.
	 * @param value 値
	 */
	public writeValue(value: any): void {
		if (value === undefined) {
			return;
		}

		if (value != null && value !== '') {
			if (!Array.isArray(value)) {
				value = [value];
			}

			value.sort(function(a: any, b: any) {
				if ( a.name < b.name ) {
					return -1;
				}

				if ( a.name > b.name ) {
					return 1;
				}
				return 0;
			});

			for (let i = 0; i < value.length; i++) {
				// 有効期限内か判定
				let expiration = false;
				for (let j = 0; j < value[i].attributeList.length; j++) {
					let attribute = value[i].attributeList[j];
					// 有効期限の場合
					if (attribute.attributeType.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_EXPIREDATE) {
						if (attribute.dateList[0]) {
							let expirationDate = new Date(attribute.dateList[0]);
							let date = new Date();
							let now = new Date(date.getFullYear(), date.getMonth(), date.getDate())
							if (expirationDate < now) {
								expiration = true;
							}
							break;
						}
					}
				}

				let isPublished = value[i].publicFileName ? true : false;
				let isDspPdfIcon = false;
				if (isPublished) {
					let publicFileName = value[i].publicFileName;
					let ext: string = publicFileName.substring(publicFileName.lastIndexOf('.'));
					if (this.serverConfigService.isPDFExt(ext)) {
						isDspPdfIcon = true;
					}
				}

				// PDF変換ステータス
				let pdfConversionStatus = EIMDocumentsConstantService.PDF_CONVERSION_STATUS_NONE;
				if (isDspPdfIcon) {
					if (value[i].pdfConversionExecutedDate != null &&
							value[i].pdfConversionExecutedDate.getTime() != new Date(null).getTime() &&
							value[i].pdfConversionExecutedDate.getTime() <= value[i].modificationDate.getTime()) {
						pdfConversionStatus = EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL;
					} else {
						pdfConversionStatus = EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_SAME_ORIGINAL;
					}
					// 公開PDF事前登録日時が存在する場合はその判定を優先する
					if (value[i].pdfPreRegistDate != null &&
							value[i].pdfPreRegistDate.getTime() != new Date(null).getTime() &&
							value[i].pdfPreRegistDate.getTime() <= value[i].modificationDate.getTime()) {
						pdfConversionStatus = EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL;
					} else if (value[i].pdfPreRegistDate != null && value[i].pdfPreRegistDate.getTime() > value[i].modificationDate.getTime()) {
						pdfConversionStatus = EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_SAME_ORIGINAL;
					}
				}
				let data = this.relationDocumentsList.getData();
				data.push({
					objId: value[i].id,
					objName: value[i].name,
					isDocument: true,
					isPublished: isPublished,
					isDspPdfIcon: isDspPdfIcon,
					expiration: expiration,
					pdfConversionStatus: pdfConversionStatus,
					isPdfPreRegistered: value[i].pdfPreRegistDate != null ? true : false
				});
				this.relationDocumentsList.setData(data);
				this.value = value;
			}
		}
		super.writeValue(value);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラです.
	 */
	ngOnInit(): void {

		let columns: EIMDataGridColumn[] = [];
		// 公開
		columns.push({field: 'a', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02036'), width: 50, cellRendererFramework: EIMPublicFileRendererComponent, suppressFilter: true, suppressSorting: true});
		// 名前
		if ( this.multiple ) {
				columns.push({field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 270, cellRendererFramework: EIMObjectNameRendererComponent, suppressFilter: true, suppressSorting: true});
		}	else {
				columns.push({field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 288, cellRendererFramework: EIMObjectNameRendererComponent, suppressFilter: true, suppressSorting: true});
		}

		this.relationDocumentsList.setColumns(columns);

		if ( this.multiple ) {
			this.label = this.label;
		}	else {
			this.label = this.label;
			this.relationDocumentsList.multiple = false;
		}

		if (this.value === undefined) {
			return;
		}

		this.value.sort(function(a, b) {
			if ( a.name < b.name ) {
				return -1;
			}
			if ( a.name > b.name ) {
				return 1;
			}
			return 0;
		});

		for (let i = 0; i < this.value.length; i++) {
			this.savedFileNameAndObjectMap[this.value[i].name] = this.value[i];
		}
	}

	/**
	 * タイプ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickContentsSingleSelector(event: any): void {
		let targetObj: any = {
			document: true,
			folder: false,
			tag: false,
		}

		// 複数判断
		if ( this.multiple ) {
			// 複数の場合
			let dialogId: string = this.dialogManagerComponentService.showContentsMultipleSelector(
				Number(this.pearentObjId),
				null,
				targetObj,
				false,
				this.relationDocumentsList.getData(),
				{
					selected: (data: any[]) => {
						// 親オブジェクトが選択されていないか確認する
						for (let i = 0; i < data.length; i++) {
							if (data[i].objId === this.pearentObjId) {
								this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00115'));
								return;
							}
						}
						this.dialogManagerComponentService.close(dialogId);
						this.relationDocumentsList.setData(data);
						this.setValue(this.relationDocumentsList.getData());
					}
				}
			);
		} else {
			// 単数の場合
			let dialogId: string = this.dialogManagerComponentService.showContentsSingleSelector(
				Number(this.pearentObjId),
				null,
				targetObj,
				false,
				{
					selected: (data: any[]) => {
						// 親オブジェクトが選択されていないか確認する
						for (let i = 0; i < data.length; i++) {
							if (data[i].objId === this.pearentObjId) {
								this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00115'));
								return;
							}
						}
						this.dialogManagerComponentService.close(dialogId);
						this.relationDocumentsList.setData(data);
						this.setValue(this.relationDocumentsList.getData());
					}
				}
			);
		}
	}

	/**
	 * ファイル削除クリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickDelete(event: any): void {
		let selectedData = this.relationDocumentsList.getSelectedData();

		for (let i = 0; i < selectedData.length; i++) {
			for (let j = 0; j < this.value.length; j++) {
				if (selectedData[i].objId === this.value[j].id) {
					this.value.splice(j, 1);
					break;
				}
			}
		}

		this.relationDocumentsList.removeRowData(selectedData);
		this.onChange();
	}

	/**
	 * 属性ボタンイベントハンドラです.
	 * @param event イベント
	 */
	onClickShowAttribute(event: any): void {
		let selectedData: any[] = this.relationDocumentsList.getSelectedData();
		if (selectedData.length !== 1) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00002'));
			return;
		}
		let dialogId: string = this.dialogManagerComponentService.showRelationFileProperty(selectedData[0], true,
			{
				errored: (data: any) => {
					// 画面を閉じる
					this.dialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * 入力内容変更イベントハンドラです.
	 */
	onChange(): void {
		this.formControls[0].setValue(this.value);
		this.formControls[0].markAsDirty();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 必須バリデータ関数を返却します.
	 * リストの件数をチェックします.
	 * @return 必須バリデータ関数
	 */
	protected requiredValidatorFn(): ValidatorFn {
	  return (control: AbstractControl): ValidationErrors | null => {
	    return this.value.length === 0 ? {'required': {value: control.value}} : null;
	  };
	}

	/**
	 * 値を設定します.
	 * @param data 設定する値
	 */
	private setValue(data: any[]): void {
		this.value.splice(0, this.value.length);

		for (let i = 0; i < data.length; i++) {
			let formObjectDomain = new EIMFormObjectDomain();

			formObjectDomain.id = data[i].objId;
			formObjectDomain.name = data[i].objName;

			let type = new EIMObjectTypeDomain();
			type.definitionName = EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT;

			formObjectDomain.type = type;
			this.value.push(formObjectDomain);
		}
		this.onChange();
	}
}
