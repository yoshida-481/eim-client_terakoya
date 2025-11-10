import { Component, IterableDiffers, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, 
	ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';


import { EIMSearchMasterDisplayConfigDomain } from 'app/shared/domains/search-master-display-config.domain';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMDialogSharedManagerComponentService} from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeDTO } from 'app/shared/dtos/attribute.dto';
import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { TranslateService } from '@ngx-translate/core';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMValueTypeEnumeration } from 'app/shared/enumerations/value-type-enumeration';
import { EIMDropdownInputRendererComponent } from 'app/shared/components/renderer/dropdown-input-renderer.component';
import { EIMObjectTypeInputRendererComponent } from '../object-type-input-renderer/object-type-renderer.component';
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMTaskUpdatorComponentService } from '../task-updator/task-updator.component.service';
import { EIMObjectAPIService, EIMObjectAPIServiceDownloadFileListParam, EIMObjectAPIServiceDownloadFileParam, EIMObjectAPIServiceGetListParam } from 'app/shared/services/apis/object-api.service';
import { EIMSimpleSearchObjectCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-object-criteria.builder';
import { EIMSimpleSearchObjectResultAttributeType } from 'app/shared/builders/simple-search/simple-search-result-attribute-type';
import { EIMSimpleSearchConditionCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-condition.criteria';
import { EIMSearchLogicalOperatorEnum } from 'app/shared/domains/search/search-logical-operator-enum';
import { EIMSearchOperatorEnum } from 'app/shared/domains/search/search-operator-enum';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMJsonToListFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-list-format-result-dto-converter.service';
import { EIMContentsMultipleSelectorComponentService } from 'app/documents/components/contents-selector/contents-multiple-selector.component.service';
import { EIMObjectTypeInputRendererComponentService } from '../object-type-input-renderer/object-type-renderer.component.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMSimpleSearchObjectConditionLeftAttributeType } from 'app/shared/builders/simple-search/simple-search-condition-left-attribute-type';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMTemplateFileIconClassFunctionService } from 'app/tasks/services/template-file-icon-class-function.service';

/** ファイルダウンロードタイプ */
export namespace fileDownloadTypeConst {
	export const FILE_TYPE_TEMPLATE = 1;
	export const FILE_TYPE_DELIVERABLES = 2;
}

/**
 * 雛型ファイル入力フォームアイテムコンポーネント
 * @example
 *      <eim-task-template-file-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-task-template-file-input-form-item>
 */
@Component({
	selector: 'eim-task-template-file-input-form-item',
	templateUrl: './task-template-file-input-form-item.component.html',
	styleUrls: ['./task-template-file-input-form-item.component.scss'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: EIMTaskTemplateFileInputFormItemComponent, multi: true}
	],
	standalone: false
})
export class EIMTaskTemplateFileInputFormItemComponent extends EIMInputFormItemComponent {

	/** 雛型ファイル一覧 */
	@ViewChild('templateFiles', { static: true })
	templateFiles: EIMDataGridComponent;

	/** オブジェクトマスタ検索の画面定義情報 */
	@Input() public searchMasterDisplayConfig: EIMSearchMasterDisplayConfigDomain;

	/** ドキュメントオブジェクトタイプ情報リスト */
	@Input() public documentObjectTypes: EIMObjectTypeDomain[];

	/** 雛型ドキュメント情報リスト */
	@Input() public templateDocumentDtos: EIMSimpleObjectDTO[];

	/** 成果物ドキュメント情報リスト */
	@Input() public outputDocumentDtos: EIMSimpleObjectDTO[];

	/** タスク用グリッドのメニュー表示制御フラグ(trueの場合はタスク（マスタ）詳細) */
	@Input() public isTemplateFilesEditable: boolean;
	
	/** タスクID */
	@Input() public taskObjectId: number;

	/** イベントエミッタ */
	@Output() public changed = new EventEmitter<any>();
	
	/** 選択したDTO配列 */
	public selectedData: EIMSimpleObjectDTO[] = [];
	/** 表示するダイアログ名 */
	public viewDialogName = null;
	public taskTemplateDocumentSelectorTitle: string = '';
	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;

	/** 成果物ファイル登録ダイアログの選択テンプレートファイル */
	public selectedTemplateFileObject: EIMSimpleObjectDTO;
	/** ファイル作成ダイアログの作成ファイル名 */
	public createFileName = '';

	/** コンテンツ検索結果のドキュメント情報リスト */
	public selectedSearchResultDtos: any[];

	/** ドキュメントオブジェクトタイプID */
	protected documentObjectTypeId: number = 0;

	// メニュー定義
	/** メニュー 雛型ファイル取込 */
	private menuHinagataTorikomi: EIMMenuItem = 
		{label: this.translateService.instant('EIM_TASKS.LABEL_03022'), icon: 'fa fa-download eim-icon-link-color-gray', disabled: false, command: (event) => { this.onClickHinagataTorikomi(event) }};

	/** メニュー 雛型ファイル最新化 */
	private menuHinagataToLatest: EIMMenuItem = 
		{label: this.translateService.instant('EIM_TASKS.LABEL_03028'), icon: 'fa fa-link fa-flip-vertical eim-icon-link-color-gray', disabled: false, command: (event) => { this.onClickUpdatingTemplate(event) }};

	/** メニュー 改訂履歴 */
	private menuItemRevisionHistory: EIMMenuItem =
		{label: this.translateService.instant('EIM_TASKS.LABEL_03030'), rKey: 'EIM_DOCUMENTS.LABEL_03038', name: 'showRevisionHistory', icon: 'eim-icon-revision-history', command: (event) => { this.onClickDispHistory(event) }};

	// グリッドの右クリックメニュー
	public gridContextMenuItems: EIMMenuItem[] = [
		this.menuHinagataTorikomi,
		this.menuHinagataToLatest,
		this.menuItemRevisionHistory
	];

	public targetObjectType = {
		document: true,
		folder: false,
		link: false
	}
	/**
	 * コンストラクタです.
	 */
	constructor(
			public contentsMultipleSelectorComponentService: EIMContentsMultipleSelectorComponentService,
			protected localStorageService: EIMLocalStorageService,
			protected dialogManagerComponentService: EIMDialogSharedManagerComponentService,
			protected templateFileIconClassFunctionService: EIMTemplateFileIconClassFunctionService,
			protected differs: IterableDiffers,
			protected translateService: TranslateService,
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
			protected historyRendererComponentService: EIMHistoryRendererComponentService,
			protected dataGridComponentService: EIMDataGridComponentService,
			protected messageService: EIMMessageService,
			protected taskUpdatorComponentService: EIMTaskUpdatorComponentService,
			protected objectAPIService: EIMObjectAPIService,
			protected jsonToListFormatResultDTOConverterService: EIMJsonToListFormatResultDTOConverterService,
			protected objectTypeInputRendererComponentService: EIMObjectTypeInputRendererComponentService
			
	) {
		super(differs);
		objectTypeInputRendererComponentService.changed.subscribe(() => { this.onChangedCheck(); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 値をコンポーネントに書き込みます.
	 * ControlValueAccessorの実装です.
	 * @param value 値
	 */
	public writeValue(value: any) {
		if (value === undefined) {
			return;
		}

		if (value != null) {
			if (!Array.isArray(value)) {
				value = [value];
			}

			value.sort(function(a, b) {
				if ( a.code < b.code ) {
					return -1;
				}
				if ( a.code > b.code ) {
					return 1;
				}
				return 0;
			});
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

		// ファイル名
		columns.push({
			field: 'name', headerName: this.translateService.instant('EIM.LABEL_02012'), width: 300,
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				iconClassFunctions: [
					this.templateFileIconClassFunctionService.iconClassFunction.bind(this.templateFileIconClassFunctionService),
				],
				linkableFunction: (dto: EIMSimpleObjectDTO): boolean => { return true; },
				onClickLinkFunction: this.onClickTemplateFile.bind(this),
				toolTipString:"雛型ファイルが更新されています", 
				isDispMouseOverMenu: !this.isTemplateFilesEditable
			},
			suppressFilter: true, suppressSorting: true
		});

		// 履歴
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), 
			width: 50,suppressFilter: true, 
			cellRendererFramework: EIMHistoryRendererComponent, valueGetter: this.historyRendererComponentService.valueGetter , 
			suppressMovable: true});

		// 更新日時
		columns.push(this.dataGridComponentService.createAttributeColumn(
			this.translateService.instant('EIM.LABEL_02033'), 'DATE', ['modificationDate']));

		// 利用方法
		columns.push({
			fieldPath: ['attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_HOW_TO_USE, 'values'], 
			headerName: this.translateService.instant('EIM_ADMINS.LABEL_02371'), width: 70,
			cellRendererFramework: EIMDropdownInputRendererComponent,
			cellRendererParams: {
				options: this.createInputMethodOptions(),
				editableFunction: (dto: EIMSimpleObjectDTO) => {
					return this.isTemplateFilesEditable && !this.disabled;
				}
			},
			suppressFilter: true, suppressSorting: true
		});

		// 成果物文書タイプ
		if (this.isTemplateFilesEditable && !this.disabled) {
			columns.push({
				fieldPath: ['attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE, 'values'],
				headerName: this.translateService.instant('EIM_ADMINS.LABEL_02372'), width: 270,
				cellRendererFramework: EIMObjectTypeInputRendererComponent,
				cellRendererParams: {
					optionsFunction: this.createDocumentTypeOptions.bind(this)
				},
				suppressFilter: true, suppressSorting: true
			});
		}

		// タスク参照版
		columns.push({
			fieldPath: ['attributeMap', 'リンク更新タイミング', 'values'],
			headerName: this.translateService.instant('EIM_ADMINS.LABEL_02373'), width: 100,
			cellRendererFramework: EIMDropdownInputRendererComponent,
			cellRendererParams: {
				options: [{label: '版固定', value: 0}, {label: '最新版', value: 1}],
				editableFunction: (dto: EIMSimpleObjectDTO) => {
					return this.isTemplateFilesEditable && !this.disabled;
				}
			},
			suppressFilter: true, suppressSorting: true
		});

		this.templateFiles.setColumns(columns);
		this.templateFiles.setData(this.value);

		// グリッド右クリックメニュー表示制御
		if (this.isTemplateFilesEditable) {
			this.gridContextMenuItems = [];
		}
		else {

			if (this.disabled) {
				this.gridContextMenuItems = [
					this.menuItemRevisionHistory
				];
			} else {
				this.gridContextMenuItems = [
					this.menuHinagataTorikomi,
					this.menuHinagataToLatest,
					this.menuItemRevisionHistory
				];
						}
		}

		// ドキュメントオブジェクトタイプID初期化
		if (this.documentObjectTypes) {
			for (let objType of this.documentObjectTypes) {
				if (objType.name !== EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT) {
					continue;
				}
				this.documentObjectTypeId = objType.id
			}
		}
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onChange(event, index) {
		// update the form
		this.formControls[index].setValue(this.value);
		this.formControls[index].markAsDirty();
	}

	/**
	 * 成果物文書タイプ変更時イベントハンドラです.
	 */
	onChangedCheck(): void {
		this.formControls?.[0]?.markAsDirty();
	}

	/**
	 * 選択ボタン押下時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickSearch(event): void {

		// コンテンツ選択画面に渡す選択済みのドキュメント情報を設定
		this.selectedSearchResultDtos = [];
		if (this.templateDocumentDtos) {
			for (let i = 0; i < this.templateDocumentDtos.length; i++) {
				this.selectedSearchResultDtos.push(
					this.convertSimpleObjectDTOToSelectedSearchResultDTO(this.templateDocumentDtos[i]));
			}
		}

		// コンテンツ選択画面表示
		this.viewDialogName = 'taskTemplateDocumentMultipleSelector';
	}

	/**
	 * 雛型ドキュメント選択時のイベントハンドラです.
	 * @param selectedSearchResultDtos 雛型ドキュメントのDTO配列
	 */
	public onSelectTemplateDocument(selectedSearchResultDtos: any[]) {

		this.viewDialogName = null;

		let newValue = [];
		for (let selectedSearchResultDto of selectedSearchResultDtos) {
			let tempFileDto: EIMSimpleObjectDTO = this.getTemplateFileByTemplateId(selectedSearchResultDto.objId);
			if (tempFileDto) {
				newValue.push(tempFileDto);
			} else {
				newValue.push(this.createTemplateFileDTO(selectedSearchResultDto));
			}
		}

		this.value.splice(0, this.value.length);
		Array.prototype.push.apply(this.value, newValue);

		// 利用方法表示用に雛型ドキュメントを保持
		// this.templateDocumentDtos = documentDtos;

		this.templateFiles.setData(this.value);

	}

	/**
	 * 雛型ファイルリンク選択時のイベントハンドラです.
	 * @param dto DTO
	 */
	public onClickTemplateFile(dto: EIMSimpleObjectDTO): void {
		// ファイルダウンロード
		const param = new EIMObjectAPIServiceDownloadFileParam();
		const prmDto = new EIMSimpleObjectDTO();
		prmDto.id = dto.id;
		param.dto = prmDto;

		this.objectAPIService.downloadFile(param);	
	}

	/**
	 * 削除ボタン押下時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickDelete(event): void {
		// アンカータグを使用しているため、この記述がないと前画面に遷移してしまう
		event.preventDefault();

		let selectedDataIds = new Set(this.templateFiles.getSelectedData().map(data => data.id));

		for (let i = this.value.length - 1; i >= 0; i--) {
			let master: EIMObjectDomain = this.value[i];
			if (selectedDataIds.has(master.id)) {
				this.value.splice(i, 1);
			}
		}

		this.setValue(0);
		const selectedData = this.templateFiles.info.gridApi!.getSelectedNodes()[0];
		const focusRow = Math.max(0, selectedData.rowIndex - 1);

		this.templateFiles.setData(this.value);
		this.templateFiles.select(this.value[focusRow]);
	}


	public onCloseDialog() {
		this.viewDialogName = null;
	}

	/**
	 * 一括ダウンロードクリック時のイベントハンドラです.
	 * @param event イベント
	 */
	onClickBulkDownload(event) {
		// ファイル一括ダウンロード
		const param = new EIMObjectAPIServiceDownloadFileListParam();

		const ids: number[] = [];
		for (let i = 0; i < this.value.length; i++) {
			ids.push(this.value[i].id);
		}
		param.objectCriteria = new EIMSimpleSearchObjectCriteriaBuilder()
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(new EIMSimpleSearchObjectConditionLeftAttributeType().id().end(), 
						EIMSearchOperatorEnum.IN, ids),
				]
			})
		.build();

		this.objectAPIService.downloadFileList(param);

	}

	/**
	 * メニュー「改訂履歴」クリック時のイベントハンドラです.
	 * @param event イベント
	 */
	onClickDispHistory(event) {

		this.viewDialogName = 'revisionHistory';

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	private setValue(index: number): void {
		// update the form
		this.formControls[index].setValue(this.value);
		this.formControls[index].markAsDirty();
	}

	/**
	 * 必須バリデータ関数を返却します.
	 * リストの件数をチェックします.
	 * @return 必須バリデータ関数
	 */
	protected requiredValidatorFn(): ValidatorFn {
	  return (control: AbstractControl): ValidationErrors | null => {
	    return this.value.length == 0 ? {'required': {value: control.value}} : null;
	  };
	}

	/**
	 * 一覧に表示する値を取得します.
	 * @param object マスタ情報
	 * @return 一覧に表示する値
	 */
	private getDisplayValue(object: EIMObjectDomain): string {
		if (!this.searchMasterDisplayConfig) {
			return '';
		}

		let targetDefinitionName: string = this.searchMasterDisplayConfig.displayFieldAttributeType.definitionName;
		if (targetDefinitionName == 'name') {
			return object.name;
		}

		for (let i = 0; object.attributeList.length; i++) {
			if (object.attributeList[i].attributeType.definitionName == targetDefinitionName) {
				// 選択画面からの戻り値の場合
				let attribute: EIMAttributeDomain | EIMAttributeDTO = object.attributeList[i];
				if (attribute['valueList']) {
					return String(attribute['valueList']);
				}
				// 初期表示の場合
				return String(attribute.getValueList());
			}
		}
		return '';
	}

	/**
	 * 既存のマスタ情報と、指定のマスタ情報に変更があるかどうかを返却します.
	 * @param newValue 選択されたマスタ情報
	 * @return 変更があるかどうか
	 */
	private isChange(newValue: any[]): boolean {
		if (this.value.length != newValue.length) {
			return true;
		}

		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i].id != newValue[i].id) {
				return true;
			}
		}
		return false;

	}

	/**
	 * 利用方法のドロップダウン用オプションを生成します.
	 * @returns
	 */
	private createInputMethodOptions(): any[] {
		return [
			{label: '必須', value: 0},
			{label: '任意', value: 1},
			{label: '参照', value: 2},
		];
	}

	/**
	 * ドキュメントオブジェクトタイプのオプションを生成します.
	 *
	 * @param dto 未使用
	 * @returns ドキュメントオブジェクトタイプのオプション
	 */
	private createDocumentTypeOptions(dto: EIMSimpleObjectDTO): any[] {

		// ドキュメントのオブジェクトタイプオプションを生成
		let options = [];

		// ドキュメントを先頭に追加
		for (let objType of this.documentObjectTypes) {
			if (objType.name !== EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT) {
				continue;
			}
			options.push({
				label: objType.name, value: objType.id
			});
		}
		for (let objType of this.documentObjectTypes) {
			if (objType.name === EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT) {
				continue;
			}
			options.push({
				label: objType.name, value: objType.id
			});
		}

		return options;
	}

	/**
	 * 雛型ファイル情報DTOを生成します.
	 *
	 * @param selectedSearchResultDto 雛型ドキュメント情報DTO
	 * @returns 雛型ファイル情報DTO
	 */
	private createTemplateFileDTO(selectedSearchResultDto: any): EIMSimpleObjectDTO {

		// 雛型ファイル
		let dto: EIMSimpleObjectDTO = new EIMSimpleObjectDTO();

		// ID
		dto.id = selectedSearchResultDto.objId;

		// オブジェクト名
		// dto.name = '雛型ファイル';
		dto.name = selectedSearchResultDto.objName; // TODO:名前を変更されると追従できない

		// 履歴
		dto.revision = selectedSearchResultDto.rev;
		
		// 最新フラグ
		dto.latest = selectedSearchResultDto.isLatest;

		// 更新日時
		dto.modificationDate = selectedSearchResultDto.modifyDateTime;

		dto.attributeMap = {};


		// 利用方法
		dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_HOW_TO_USE] = {
			valueType: EIMValueTypeEnumeration.LONG,
			values: [0]
		};

		// 成果物文書タイプ(デフォルトでドキュメントオブジェクトタイプを選択)
		dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE] = {
			valueType: EIMValueTypeEnumeration.LONG,
			values: [this.documentObjectTypeId]
		};

		// リンク更新タイミング
		dto.attributeMap['リンク更新タイミング'] = {
			valueType: EIMValueTypeEnumeration.LONG,
			values: [0]
		};

		return dto;
	}

	/**
	 * 設定中の雛型ファイル情報DTOを返却します.
	 *
	 * @param id テンプレートファイルのID
	 * @return 設定中の雛型ファイル情報DTO、存在しなければnull
	 */
	private getTemplateFileByTemplateId(id: number): EIMSimpleObjectDTO {

		if (!this.value) {
			return null;
		}

		for (let templateFileDto of this.value) {
			if (templateFileDto.id === id) {
				return templateFileDto;
			}
		}
		return null;
	}

	/**
	 * 雛型ファイルを取込みます.
	 *
	 * @param event
	 */
	private onClickHinagataTorikomi(event: any) {

		let selectedData = this.templateFiles.getSelectedData();

		let selectedFileObj: EIMSimpleObjectDTO = new EIMSimpleObjectDTO();
		selectedFileObj.id = selectedData[0].id;
		selectedFileObj.name = selectedData[0].name;
		selectedFileObj.revision = selectedData[0].revision;
		selectedFileObj.latest = selectedData[0].latest;
		selectedFileObj.attributeMap = {
			// 成果物文書タイプ
			[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE]: 
					selectedData[0].attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE]
		};

		this.selectedTemplateFileObject = selectedFileObj;
		this.createFileName = selectedFileObj.name;

		this.viewDialogName = 'createFileFromTemplate';
	}

	/**
	 * 添付ファイル登録画面の登録クリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickAddOutputFileFromTemplateFile(event): void {
		this.taskUpdatorComponentService.addOutputFileFromTemplateFile(this.createFileName, this.selectedTemplateFileObject, this.outputDocumentDtos, this.taskObjectId)
        .then(resultDto => {
            this.viewDialogName = '';
			this.setValue(0);
            this.changed.emit({ type: '雛型ファイル', data: resultDto });
        })
        .catch(error => {
            
        });
	}

	/**
	 * 雛型ファイルを最新化します.
	 *
	 * @param 
	 * 
	 */
	private onClickUpdatingTemplate(event: any) {
		let selectedData = this.templateFiles.getSelectedData()[0];

		if (selectedData.latest) {
			// 既に最新
			this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_TASKS.INFO_00004'));
			return;
		}

		// 最新の雛型ファイルを取得してグリッドを最新化する（ここでは雛型ファイルのupdateは行わず、更新処理時に行う）
		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();

		apiParam.objectCriteria =
				new EIMSimpleSearchObjectCriteriaBuilder()
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().revision().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().latest().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().modificationDate().end())
					.setConditionGroup({
						op: EIMSearchLogicalOperatorEnum.AND,
						conditions: [
							new EIMSimpleSearchConditionCriteria(['baseType', 'definitionName'], EIMSearchOperatorEnum.EQ, 'ドキュメント'),
							new EIMSimpleSearchConditionCriteria(['revisionGroupId'], EIMSearchOperatorEnum.EQ, selectedData.revisionGroupId),
							new EIMSimpleSearchConditionCriteria(['latest'], EIMSearchOperatorEnum.EQ, 1)
						]
					})
					.build();

		apiParam.relatedObjectCriterias = [];

		// 取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {
			let listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);
			
			// グリッド最新化
			// TODO: 改訂中を想定してIDが小さいオブジェクトを採用していると思われるがIDで判断すべきではない。（クラスタ環境ではシーケンスがまとめてキャッシュされるためID順にならないことがある）REVが小さいほうを採用すべき。
			selectedData.id = listFormatResult.dtos[0].id;
			selectedData.name = listFormatResult.dtos[0].name;
			selectedData.latest = listFormatResult.dtos[0].latest;
			selectedData.revision = listFormatResult.dtos[0].revision;
			selectedData.modificationDate = listFormatResult.dtos[0].modificationDate;

			this.templateFiles.info.gridApi.applyTransaction({ update: [selectedData] });
			this.templateFiles.refreshView();

			this.setValue(0);
		});
	}

	/**
	 * EIMSimpleObjectDTOを雛型ファイル選択画面選択文書のDTOに変換します.
	 * @param simpleObjectDTO 変換対象のDTO
	 * @returns 雛型ファイル選択画面選択文書のDTO
	 */
	private convertSimpleObjectDTOToSelectedSearchResultDTO(simpleObjectDTO: EIMSimpleObjectDTO): any {
		return {
			"objId": simpleObjectDTO.id,
			"objName": simpleObjectDTO.name,
		};
	}
}
