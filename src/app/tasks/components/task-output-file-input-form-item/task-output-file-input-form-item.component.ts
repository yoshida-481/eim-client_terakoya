import { Component, IterableDiffers, OnInit, OnDestroy, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { NgForm, NG_VALUE_ACCESSOR, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { SelectItem } from 'primeng/api';

import { FileUploader, FileItem } from 'ng2-file-upload';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMWebDAVService } from 'app/shared/services/webdav.service';

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMFileObjectCreatorDomain } from 'app/shared/domains/file-object-creator.domain';

import { EIMTaskOutputFileInputFormItemComponentService } from './task-output-file-input-form-item.component.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { EIMFileIconClassFunctionService } from 'app/shared/services/file-icon-class-function.service';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMObjectAPIService, EIMObjectAPIServiceCreateListParam, EIMObjectAPIServiceCreateParam, EIMObjectAPIServiceDownloadFileListParam, EIMObjectAPIServiceDownloadFileParam } from 'app/shared/services/apis/object-api.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMTextEditorRendererComponent } from 'app/documents/shared/components/renderer/text-editor-renderer.component';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMTaskUpdatorComponentService } from '../task-updator/task-updator.component.service';
import { EIMJsonToListFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-list-format-result-dto-converter.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMSimpleSearchObjectCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-object-criteria.builder';
import { EIMSearchLogicalOperatorEnum } from 'app/shared/domains/search/search-logical-operator-enum';
import { EIMSimpleSearchConditionCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-condition.criteria';
import { EIMSimpleSearchObjectConditionLeftAttributeType } from 'app/shared/builders/simple-search/simple-search-condition-left-attribute-type';
import { EIMSearchOperatorEnum } from 'app/shared/domains/search/search-operator-enum';
import { EIMTaskFileObjectCreatorService } from 'app/tasks/services/apis/task-file-object-creator.service';
import { EIMTemplateFileIconClassFunctionService } from 'app/tasks/services/template-file-icon-class-function.service';


/** ファイルダウンロードタイプ */
export namespace fileDownloadTypeConst {
	export const FILE_TYPE_TEMPLATE = 1;
	export const FILE_TYPE_DELIVERABLES = 2;
}

/**
 * タスク成果物ファイル入力フォームアイテムコンポーネント
 * @example
 *      <eim-task-output-file-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-task-output-file-input-form-item>
 */
@Component({
	selector: 'eim-task-output-file-input-form-item',
	templateUrl: './task-output-file-input-form-item.component.html',
	styleUrls: ['./task-output-file-input-form-item.component.scss'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: EIMTaskOutputFileInputFormItemComponent, multi: true}
	],
	standalone: false
})
export class EIMTaskOutputFileInputFormItemComponent extends EIMInputFormItemComponent implements OnInit, OnDestroy {

	/** フォーム */
	@ViewChild('fileCreateForm') fileCreateForm: NgForm;

	/** フォーム */
	@ViewChild('outputUpdateForm') outputUpdateForm: NgForm;

	/** データグリッド */
	@ViewChild('taskOutputFileDataGrid', { static: true }) taskOutputFileDataGrid: EIMDataGridComponent;
		
	/** イベントエミッタ */
	@Output() public changed = new EventEmitter<any>();
	
	/** 画面表示時のデータグリッド */
	public defaultTaskOutputFileDataGrid: any[];

	/** 表示中のダイアログ名 */
	public viewDialogName = null;

	/** 雛型ファイルリスト */
	public templateFileAttributeValues: EIMObjectDomain[] = [];

	/** 親オブジェクトID */
	public parentObjectId: number;

	/** ファイルアップローダ */
	public uploader: FileUploader = new FileUploader({ url: "" });

	/** ファイルアップローダ */
	public uploaderForUpdate: FileUploader = new FileUploader({ url: "" });

	/** 表示データ */
	public data: SelectItem[] = [];
	/** 選択データ */
	public selectedData: EIMSimpleObjectDTO[] = [];
	/** WebDAVが有効かどうか */
	public enabledWebDAV = false;
	/** WebDAV編集可能かどうか */
	public editableWebDAV = false;

	/** ファイル作成ダイアログ表示フラグ */
	public displayFileCreator = false;
	/** 成果物ファイル登録ダイアログのテンプレートファイルの配列 */
	public templateFileSelectItems: SelectItem[] = null;
	/** 成果物ファイル登録ダイアログの選択テンプレートファイル */
	public selectedTemplateFileObject: EIMSimpleObjectDTO;
	/** ファイル作成ダイアログの作成ファイル名 */
	public createFileName = '';

	/** 成果物更新ダイアログの更新後の成果物ファイル名 */
	public afterOutputFileName = '';

	/** 成果物更新ダイアログの対象成果物ファイル名 */
	public beforeOutputFileName = '';

	/** 改名前の成果物ファイル名 */
	public preOutputFileName = '';

	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;

	/** オブジェクトに紐づいているファイルオブジェクトのファイル名のSet */
	private savedFileNameAndObjectMap: any = {};

	/** メニュー 編集 */
	private menuItemEdit: EIMMenuItem =
		{
			label: this.translateService.instant('EIM.LABEL_03048'), 
			icon: 'fa fa-pencil-square-o fa-lg eim-document-main-single-clickable', 
			command: (event) => { this.onClickEdit(event) }
		};

	/** メニュー チェックイン */
	private menuItemCheckin: EIMMenuItem =
		{
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03029'), 
			icon: 'eim-icon-checkin', command: (event) => { this.onClickCheckin(event) }
		};

	/** メニュー 改訂履歴 */
	private menuItemRevisionHistory: EIMMenuItem =
		{
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03038'), name: 'showRevisionHistory', 
			icon: 'eim-icon-revision-history', command: (event) => { this.onClickDispHistory(event) }
		};

	// グリッドの右クリックメニュー
	public gridContextMenuItems: EIMMenuItem[] = [
		this.menuItemEdit,
		this.menuItemCheckin,
		this.menuItemRevisionHistory
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected messageService: EIMMessageService,
			protected objectAPIService: EIMObjectAPIService,
			protected webDAVService: EIMWebDAVService,
			protected taskOutputFileInputFormItemComponentService: EIMTaskOutputFileInputFormItemComponentService,
			protected fileIconClassFunctionService: EIMFileIconClassFunctionService,
			protected templateFileIconClassFunctionService: EIMTemplateFileIconClassFunctionService,
			protected historyRendererComponentService: EIMHistoryRendererComponentService,
			protected fileObjectCreatorService: EIMTaskFileObjectCreatorService,
			protected dataGridComponentService: EIMDataGridComponentService,
			protected cacheService: EIMCacheService,
			protected taskUpdatorComponentService: EIMTaskUpdatorComponentService,
			protected differs: IterableDiffers,
			protected jsonToListFormatResultDTOConverterService: EIMJsonToListFormatResultDTOConverterService
		) {
		super(differs);

		// ファイル選択完了時のハンドラ登録
		this.uploader.onAfterAddingAll = (fileItems: FileItem[]) => {
			this.onAddFiles(fileItems);
		};

		// チェックインファイルイベントハンドラ設定
		this.uploaderForUpdate.onAfterAddingAll = (fileItems: FileItem[]) => {
			this.onAddOutputFiles(fileItems);
		};

		this.enabledWebDAV = this.webDAVService.enable();

	}

	/**
	 * 値をコンポーネントに書き込みます.
	 * ControlValueAccessorの実装です.
	 * @param value 値
	 */
	public writeValue(value: any) {
		if (value === undefined) {
			return;
		}
		if (value != null && value != '') {
			if (!Array.isArray(value)) {
				value = [value];
			}
			value.sort(function(a, b) {
				if ( a.name < b.name ) {
					return -1;
				}
				if ( a.name > b.name ) {
					return 1;
				}
				return 0;
			});
		}

		super.writeValue(value);

		//this.setAttachementFileSelectItems(value);

		for (let i = 0; i < this.value.length; i++) {
			this.savedFileNameAndObjectMap[this.value[i].name] = this.value[i];
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラです.
	 */
	ngOnInit(): void {
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
		// this.setAttachementFileSelectItems(this.value);

		for (let i = 0; i < this.value.length; i++) {
			this.savedFileNameAndObjectMap[this.value[i].name] = this.value[i];
		}

		this.setTaskOutputFileDataGridColumns();
		this.taskOutputFileDataGrid.setData(this.value);
		this.defaultTaskOutputFileDataGrid = JSON.parse(JSON.stringify(Object.values(this.value)));

		this.initTemplateFileSelectItems();
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngAfterViewInit() {

		this.changed.emit({ type: '成果物', data: this.taskOutputFileDataGrid });
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		this.uploader.clearQueue();
		this.uploader.cancelAll();
		this.uploader = null;
		this.uploaderForUpdate.clearQueue();
		this.uploaderForUpdate.cancelAll();
		this.uploaderForUpdate = null;
	}

	/**
	 * ファイルリンククリック時イベントハンドラです.
	 * @param dto DTO
	 */
	onClickFileLink(dto: EIMSimpleObjectDTO): void {
		// ファイルダウンロード
		const param = new EIMObjectAPIServiceDownloadFileParam();
		const prmDto = new EIMSimpleObjectDTO();
		prmDto.id = dto.id;
		param.dto = prmDto;

		this.objectAPIService.downloadFile(param);
	}

	/**
	 * ファイル選択時イベントハンドラです.
	 * 編集ボタンの有効無効を切り替えます.
	 * @param event イベント
	 */
	onChangedTaskOutputFile(event): void {

		this.editableWebDAV = false;
		this.menuItemEdit.disabled = true;
		this.menuItemCheckin.disabled = true;

		this.selectedData = this.taskOutputFileDataGrid.getSelectedData();
		if (!this.disabled && this.selectedData.length == 1) {

			// チェックインは押下可
			this.menuItemCheckin.disabled = false;

			if (this.webDAVService.editable(this.selectedData[0].name)) {
				this.editableWebDAV = true;
				this.menuItemEdit.disabled = false;
			}
		}
	}

	/**
	 * ローカルファイル追加時イベントハンドラです.
	 * @param fileItems ファイルアイテムの配列
	 */
	onAddFiles(fileItems: FileItem[]): void {
		if (fileItems.length == 0) {
			return;
		}

		let addFiles: FileItem[] = this.uploader.queue;

		// 既に選択済みのファイル名をチェック
		let replaceFiles: FileItem[] = [];
		for (let i = 0; i < addFiles.length; i++) {
			if (this.getValueByFileName(addFiles[i].file.name)) {
				replaceFiles.push(addFiles[i]);
			}
		}

		if (replaceFiles.length > 0) {
			// ファイル名重複の場合は処理中止
			this.uploader.clearQueue();
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00004'));
			return;
			// this.replaceFileItems(replaceFiles, addFiles);
		} else {
			// ファイル名重複なしの場合
			this.createTemporaryFiles(addFiles, false);
		}

	}

	/**
	 * ファイル削除クリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickDelete(event): void {
		let removeFileNames: string[] = [];

		for (let i = 0; i < this.selectedData.length; i++) {
			removeFileNames.push(this.selectedData[i].name);
		}
		this.uploader.clearQueue();
		this.removeFilesByName(removeFileNames);

		this.setValue(0);
		const selectedData = this.taskOutputFileDataGrid.info.gridApi!.getSelectedNodes()[0];
		const focusRow = Math.max(0, selectedData.rowIndex - 1);
		this.taskOutputFileDataGrid.select(this.value[focusRow]);
		
		this.taskOutputFileDataGrid.removeRowData(this.selectedData);
	}

	/**
	 * チェックインクリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickCheckin(event): void {

		this.beforeOutputFileName = this.taskOutputFileDataGrid.getSelectedData()[0].name;
		this.uploaderForUpdate.clearQueue();
		this.uploaderForUpdate.cancelAll();
		this.afterOutputFileName = '';
		this.viewDialogName = 'checkinOutputFile';
		
	}

	/**
	 * 成果物更新ファイル追加時イベントハンドラです.
	 * @param fileItems ファイルアイテムの配列
	 */
	onAddOutputFiles(fileItems: FileItem[]): void {
		if (!fileItems || fileItems.length === 0) {
			return;
		}

		let fileName = fileItems[0].file.name;
		let extension = '';
		extension = fileName.split('.').pop();

		if (this.uploaderForUpdate.queue.length > 1) {
			this.uploaderForUpdate.removeFromQueue(this.uploaderForUpdate.queue[0]);
		}
		this.afterOutputFileName = fileName;
		
	}

	/**
	 * チェックインダイアログの登録クリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickUpdateOutputFile(event): void {
		if (this.uploaderForUpdate.queue.length == 0) {
			return;
		}

		let addFile: FileItem = this.uploaderForUpdate.queue[0];

		// 既に選択済みのファイル名をチェック
		let replaceFiles: FileItem[] = [];
		if (this.getValueByFileName(addFile.file.name)) {
			replaceFiles.push(addFile);
		}
		
		// 変更前成果物ファイルの名称は重複OKなのでfilterで除外する
		replaceFiles = replaceFiles.filter(replaceFile => replaceFile.file.name !== this.beforeOutputFileName);

		if (replaceFiles.length > 0) {
			// ファイル名重複の場合は処理中止
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00004'));
			return;
		} else {
			// ファイル名重複なしの場合、差替え実行
			let beforeFileObject: any;
			for (let i = 0; i < this.value.length; i++) {
				if (this.value[i].name == this.beforeOutputFileName) {
					beforeFileObject = this.value[i];	
				}
			}

			this.replaceFileItems(beforeFileObject, addFile);

		}
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

	/**
	 * 雛型ファイル取込ボタンクリック時のイベントハンドラです.
	 * @param event イベント
	 */
	onClickSelectFromTemplateFile(event): void {

		this.selectedTemplateFileObject = null;
		this.createFileName = '';

		this.viewDialogName = 'createFileFromTemplate';
	}

	/**
	 * 添付ファイル登録画面の登録クリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickAddOutputFileFromTemplateFile(event): void {
	
		this.taskUpdatorComponentService.addOutputFileFromTemplateFile(this.createFileName, this.selectedTemplateFileObject, this.value, this.parentObjectId)
        .then(resultDto => {
            this.viewDialogName = '';
			this.value.push(resultDto)
			this.taskOutputFileDataGrid.setData(this.value);
			this.taskOutputFileDataGrid.select(this.value[this.value.length - 1]);
			this.setValue(0);
        })
        .catch(error => {
            
        });
	}

	/**
	 * ファイル編集クリック時イベントハンドラです.操作対象は単数のみです.
	 * @param event イベント
	 */
	onClickEdit(event): void {
		let selectedFileName: string = this.selectedData[0].name;

		let savedObject: EIMObjectDomain = this.savedFileNameAndObjectMap[selectedFileName];
		if (!savedObject) {
			// TODO:以下の条件に変更する
			// this.selectedData[0].type.definitionName === EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPORARY_ATTACHMENT_FILE

			// 一時ファイルの場合
			let selectedObject: EIMObjectDomain = this.getValueByFileName(selectedFileName);
			this.webDAVService.edit(selectedObject.id, selectedObject.name);
		} else {
			// 一時ファイルでない場合

			// メッセージダイアログ後処理
			const afterMessageProc = (isRevisionUp: boolean) => {
				let foc: EIMFileObjectCreatorDomain = new EIMFileObjectCreatorDomain(savedObject);
				this.fileObjectCreatorService.copy(foc)
				.subscribe((data: EIMFileObjectCreatorDomain[]) => {
	
					// 更新対象のファイルオブジェクトを更新
					let fileName: string = data[1].name;
	
					let value: EIMObjectDomain & {isRevisionUp?: boolean;} = this.getValueByFileName(fileName);
					value.id = data[1].id;
					value.type = data[1].type;
	
					value.isRevisionUp = isRevisionUp;
	
					this.savedFileNameAndObjectMap[fileName] = null;
	
					this.webDAVService.edit(data[1].id, data[1].name);
				});
			};

			// リビジョンアップするかどうかを選択させる
			this.messageService.show(EIMMessageType.confirm,
				this.translateService.instant('EIM_TASKS.CONFIRM_00002') ,
				() => {
					// // グリッド背景色の変更
					// this.taskOutputFileDataGrid.info.gridOptions.getRowStyle = (params) => {
					// 	if (params.node.isSelected() || params.node.isRevisionUp) {
					// 		params.node.isRevisionUp = true;
					// 		return { background: 'gold' };
					// 	}
					// };
					// this.taskOutputFileDataGrid.refreshView();
					afterMessageProc(true);

					this.changeGridDataForRevisionUp(this.taskOutputFileDataGrid.getSelectedData()[0]);
				},
				() => {
					afterMessageProc(false);
				}
			);
		}
		this.setValue(0);
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onChange(event, index) {

		let prevValue = this.value[index];

		this.setValue(index);

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));
	}

	/**
	 * 成果物ファイル登録ダイアログにて雛型ファイルを変更した場合のイベントハンドラです.
	 *
	 * @param event イベント
	 */
	onChangeTemplateFile(event): void {

		this.createFileName = event.value.name;
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
	 * 成果物一覧のデータグリッドカラムを初期化します.
	 */
	private setTaskOutputFileDataGridColumns(): void {
		let columns: EIMDataGridColumn[] = [];

		// ファイル名
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02012'), width: 200,
			cellRendererFramework: EIMValueRendererComponent, cellEditorFramework: EIMTextEditorRendererComponent,editable: true,
			cellRendererParams: {
				iconClassFunctions: [
					this.fileIconClassFunctionService.iconClassFunction.bind(this.fileIconClassFunctionService)
				],
				linkableFunction: (dto: EIMSimpleObjectDTO): boolean => { return true; },
				onClickLinkFunction: this.onClickFileLink.bind(this),
				isDispMouseOverMenu: true
			}
		});

		// 履歴（成果物ファイル）
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), 
			width: 50,suppressFilter: true, 
			cellRendererFramework: EIMHistoryRendererComponent, valueGetter: this.historyRendererComponentService.valueGetter , 
			suppressMovable: true});

		// 更新者
		columns.push({fieldPath: ['modificationUser', 'name'], headerName: this.translateService.instant('EIM.LABEL_02032'), width: 120});

		// 更新日時
		columns.push(this.dataGridComponentService.createAttributeColumn(
			this.translateService.instant('EIM.LABEL_02033'), 'DATE', ['modificationDate']));

		// 雛型ファイル
		columns.push({fieldPath: ['attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE, 'values[0]', 'name'], 
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02037'), width: 200,
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				iconClassFunctions: [
					(dto: EIMSimpleObjectDTO): string => {
						return this.templateFileIconClassFunctionService.iconClassFunction(
							dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE]?.values?.[0]);
					}
				],
			}
		});

		// 履歴（雛型ファイル）
		columns.push({fieldPath: ['attributeMap', EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE, 'values[0]', 'revision'], headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), 
			width: 50,suppressFilter: true, 
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				styleFunctions:  [
					(dto: any): string => {
						return 'eim-output-file-hinagata-revision-item';
					}
				]
			},
			suppressMovable: true
		});

		this.taskOutputFileDataGrid.setColumns(columns);

	}

	/**
	 * グリッドセル編集開始イベントハンドラ.
	 * @param event イベント
	 */
	public onCellEditingStarted(event: any): void {
		// 改名前オブジェクト名を保持
		let selectedData: any[] = this.taskOutputFileDataGrid.getSelectedData();
		if (selectedData && selectedData.length !== 0) {
			this.preOutputFileName = selectedData[0].name;
		}
	}


	/**
	 * グリッドセル編集終了イベントハンドラ
	 * @param event イベント
	 */
	public onCellEditingStopped(event: any): void {
		// 後処理
		let postProc: () => void = () => {
			// グリッド再描画
			this.taskOutputFileDataGrid.info.gridApi.redrawRows();
			// 改名前の名称をクリア
			this.preOutputFileName = '';
		};

		// 名称が空の場合、エラー
		if (!event.data.name || event.data.name == '') {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00012'));
			// 改名前に戻す
			this.revertBeforeRename(event.data);
			postProc();
			return;
		}
		// 名称に禁則文字が含まれる場合、エラー
		let match = event.data.name.match(EIMConstantService.FORBIDDEN_PATTERN);
		if (match) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00009'));
			// 改名前に戻す
			this.revertBeforeRename(event.data);
			postProc();
			return;
		}

		if (this.preOutputFileName != event.data.name) {

			let savedObject: EIMObjectDomain = this.savedFileNameAndObjectMap[this.preOutputFileName];
			let foc: EIMFileObjectCreatorDomain = new EIMFileObjectCreatorDomain(savedObject);
			foc.name = this.selectedData[0].name;
			this.fileObjectCreatorService.copy(foc)
			.subscribe((data: EIMFileObjectCreatorDomain[]) => {

				// 更新対象のファイルオブジェクトを更新
				let fileName: string = data[1].name;

				let value: EIMObjectDomain & {isRevisionUp?: boolean;} = this.getValueByFileName(fileName);
				value.id = data[1].id;
				value.type = data[1].type;

				this.savedFileNameAndObjectMap[fileName] = null;

				this.setValue(0);
			});

			this.taskOutputFileDataGrid.getSelectedData()[0].name = event.data.name;
			this.taskOutputFileDataGrid.info.gridApi.redrawRows();
		}
	}

	/**
	 * キーダウンイベントハンドラ.
	 * @param event イベント
	 */
	@HostListener('document:keydown', ['$event'])
	public handleKeyboardEvent(event: KeyboardEvent): void {
		if (event.key == 'F2' && this.taskOutputFileDataGrid.getSelectedData().length === 1) {
			this.rename();
		}
	}

	/**
	 * 名前を変更します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public rename(): void {
		let rowIndex: number = this.taskOutputFileDataGrid.getRowIndex();

		window.setTimeout(() => {
			this.taskOutputFileDataGrid.info.gridApi.setFocusedCell(0, 'name');
			this.taskOutputFileDataGrid.info.gridApi.startEditingCell({rowIndex: rowIndex, colKey: 'name'});
		});
	}

	/**
	 * 改名前に名前を戻します.
	 * @param data オブジェクト
	 */
	private revertBeforeRename(data: any): void {
		let tempPreObjName = this.preOutputFileName;

		this.taskOutputFileDataGrid.info.gridApi.forEachNode( function (node) {
			if (node.data.id === data.id) {
				node.data.name = tempPreObjName;
			}
		});
	}

	/**
	 * ファイルアイテムを差し替えます.
	 * @param beforeFileObject 差し替えるファイルオブジェクト
	 * @param addFiles 追加するファイルアイテム
	 */
	private replaceFileItems(beforeFileObject: any, addFile: FileItem): void {
		// 確認ダイアログ
	
		// メッセージダイアログ後処理
		const afterMessageProc = (isRevisionUp: boolean) => {

			// 対象ファイルを更新する
			this.updateOutputFile(beforeFileObject, addFile, isRevisionUp);

			this.setValue(0);
		};

		let selectedData = this.taskOutputFileDataGrid.getSelectedData()[0];
		let savedObject: EIMObjectDomain = this.savedFileNameAndObjectMap[selectedData.name];

		if (!savedObject) {

			const existingIndex = this.value.findIndex(val => val.name === beforeFileObject.name);
			const existingDto = this.value[existingIndex];
			afterMessageProc(existingDto.isRevisionUp);
		} else {
			// リビジョンアップするかどうかを選択させる
			this.messageService.show(EIMMessageType.confirm,
				this.translateService.instant('EIM_TASKS.CONFIRM_00002') ,
				() => {
					afterMessageProc(true);
					this.changeGridDataForRevisionUp(selectedData);
				},
				() => {
					afterMessageProc(false);
					this.resetGridDataForRevisionUp(selectedData);
				}
			);

			this.savedFileNameAndObjectMap[selectedData.name] = null;
		}

	}


	/**
	 * ファイルを追加します.
	 * @param fileItems 追加するファイルの配列
	 */
	protected createTemporaryFiles(fileItems: FileItem[], isRevisionUp: boolean): void {

		let objectDTOs: EIMSimpleObjectDTO[] = [];
		let files:File[] = [];
		for (let i = 0; i < fileItems.length; i++) {
			let fileItem: FileItem = fileItems[i];
			let file: File = fileItem._file;

			let objectDTO = new EIMSimpleObjectDTO();
			// ID
			objectDTO.id = 0;
			// NAME
			objectDTO.name = fileItem._file.name;
			// TYPE
			objectDTO.type = {definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPORARY_ATTACHMENT_FILE};

			objectDTOs.push(objectDTO);
			files.push(file);
		}

		let params: EIMObjectAPIServiceCreateListParam = {
			dtos: objectDTOs,
			files: files,
			parentObjectId: this.parentObjectId
		}
		
		this.objectAPIService.createList(params)
			.subscribe(
				(res: any) => {

					let listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);
					
					listFormatResult.dtos.forEach(dto => {
						this.value.push(dto);
						this.taskOutputFileDataGrid.addRowData([dto]);
					});

					// キューから削除
					for (let objectDTO of listFormatResult.dtos) {
						let removeFileItem: FileItem = this.getFileItemByName(objectDTO.name);
						this.uploader.removeFromQueue(removeFileItem);

					}

					this.taskOutputFileDataGrid.setData(this.value);

					this.taskOutputFileDataGrid.select(this.value[this.value.length - 1]);

					this.setValue(0);
				},
				(err: any) => {
					
					this.uploader.clearQueue();
				}
			);
	}

	/**
	 * 成果物ファイルを更新します.
	 * 
	 * @param beforeFileObject 更新前ファイル情報
	 * @param fileItem 追加するファイル
 	 * @param isRevisionUp リビジョンアップ対象かどうか
	 */
	protected updateOutputFile(beforeFileObject: any, fileItem: FileItem, isRevisionUp: boolean): void {

		let file: File = fileItem._file;

		let objectDTO = new EIMSimpleObjectDTO();
		// ID
		objectDTO.id = 0;
		// NAME
		objectDTO.name = fileItem._file.name;
		// TYPE
		objectDTO.type = {definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPORARY_ATTACHMENT_FILE};

		let param: EIMObjectAPIServiceCreateParam = {
			dto: objectDTO,
			file: file,
			parentObjectId: this.parentObjectId
		};

		this.objectAPIService.create(param)
			.subscribe((res: any) => {

				let formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);
				let dto = formFormatResult.dto;

				const existingIndex = this.value.findIndex(val => val.name === beforeFileObject.name);
				// 一部項目を更新
				const existingDto = this.value[existingIndex];
				existingDto.id = dto.id;
				existingDto.name = dto.name;
				existingDto.type = dto.type;
				existingDto.modificationUser = dto.modificationUser;
				existingDto.modificationDate = dto.modificationDate;
				existingDto.isRevisionUp = isRevisionUp;
				
				this.taskOutputFileDataGrid.setData(this.value);

				// this.taskOutputFileDataGrid.refreshView();

				this.viewDialogName = '';
				this.afterOutputFileName = '';
			});
	}

	/**
	 * ファイルを削除します.
	 * @param removeFileNames 削除するファイルの配列
	 */
	private removeFilesByName(removeFileNames: string[]): void {
		for (let i = 0; i < removeFileNames.length; i++) {

			let removeObjectName: string = removeFileNames[i];

			let savedObject: EIMObjectDomain = this.savedFileNameAndObjectMap[removeObjectName];
			if (!savedObject) {
				// 一時ファイルの場合は削除する。
				this.taskOutputFileInputFormItemComponentService.delete(this.getValueByFileName(removeObjectName).id);
			}
			this.removeValueByName(removeObjectName);
			this.removeAttachementFileSelectItemByName(removeObjectName);
			this.savedFileNameAndObjectMap[removeObjectName] = null;
		}
	}

	/**
	 * 画面表示アイテムを設定します.
	 * @param objects オブジェクト配列
	 */
	// private setAttachementFileSelectItems(objects: EIMObjectDomain[]): void {
	// 	if (objects == null) {
	// 		return null;
	// 	}
	// 	this.data = [];
	// 	for (let i = 0; i < objects.length; i++) {
	// 		this.addAttachementFileSelectItem(objects[i]);
	// 	}
	// }

	/**
	 * 画面表示アイテムにオブジェクトを追加します.
	 * @param object オブジェクト
	 */
	// private addAttachementFileSelectItem(object: EIMObjectDomain): void {
	// 	let selectItem: SelectItem = {label: object.name, value: object.name};
	// 	selectItem['icon'] = this.getIcon(object.name);
	// 	this.data.push(selectItem);
	// 	this.data = this.data.filter(item => item);
	// }

	/**
	 * キューから指定ファイル名のファイルアイテムを取得します.
	 * @param name ファイル名
	 * @return ファイルアイテム
	 */
	private getFileItemByName(name: string): FileItem {
		for (let i = 0; i < this.uploader.queue.length; i++) {
			if (this.uploader.queue[i].file.name == name) {
				return this.uploader.queue[i];
			}
		}
		return null;
	}

	/**
	 * 画面表示アイテムから指定ファイル名のアイテムを削除します.
	 * @param name ファイル名
	 */
	private removeAttachementFileSelectItemByName(name: string): void {
		for (let i = 0; i < this.data.length; i++) {
			if (this.data[i].value == name) {
				this.data.splice(i, 1);
			}
		}
		this.data = this.data.filter(item => item);
	}

	/**
	 * 入力値から指定ファイル名を削除します.
	 * @param name ファイル名
	 */
	private removeValueByName(name: string): void {
		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i].name == name) {
				this.value.splice(i, 1);
			}
		}
	}


	/**
	 * 入力値から指定ファイル名のオブジェクトを取得します.
	 * @param fileName ファイル名
	 * @return オブジェクト
	 */
	protected getValueByFileName(fileName: string): EIMObjectDomain {
		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i].name == fileName) {
				return this.value[i]
			}
		}
		return null;
	}

	/**
	 * 画面表示アイテムから指定ファイル名のアイテムを取得します.
	 * @param fileName ファイル名
	 * @return アイテム
	 */
	private getAttachementFileSelectItemByName(fileName: string): SelectItem {
		for (let i = 0; i < this.data.length; i++) {
			if (this.data[i].value == name) {
				return this.data[i];
			}
		}
		return null;
	}

	/**
	 * アイコンを取得します.
	 * @param fileName ファイル名
	 * @return アイコン名
	 */
	private getIcon(fileName: string): string {
		if (!fileName) {
			return '';
		}

		// let ext: string = fileName.substring(fileName.lastIndexOf('.'));
		// if (this.serverConfigService.isExcelExt(ext)) {
		// 	return 'eim-icon-excel';
		// }
		// if (this.serverConfigService.isWordExt(ext)) {
		// 	return 'eim-icon-word';
		// }
		// if (this.serverConfigService.isPowerPointExt(ext)) {
		// 	return 'eim-icon-powerpoint';
		// }
		// if (this.serverConfigService.isPDFExt(ext)) {
		// 	return 'eim-icon-pdf';
		// }
		return 'eim-icon-file';

	}

	/**
	 * 雛型ファイルドロップダウンのオプションを初期化します.
	 *
	 */
	protected initTemplateFileSelectItems(): void {

		this.templateFileSelectItems = [];

		if (!this.templateFileAttributeValues) {
			return;
		}

		for (let templateFileAttributeValue of this.templateFileAttributeValues) {

			this.templateFileSelectItems.push({
				label: templateFileAttributeValue.name, value: templateFileAttributeValue
			});

		}
	}

	/**
	 * 対象行のリビジョンアップ列表示を変更します.
	 * @param targetRow 対象行
	 */
	private changeGridDataForRevisionUp(targetRow: any): void {
		
		for (let row of this.defaultTaskOutputFileDataGrid) {
			if (targetRow.name === row.name && targetRow.revision !== row.revision) {
				// リビジョンアップ用表示変更済み
				return;
			}
		}
		// リビジョン変更
		let afterRevision = targetRow.revision + 1;
		targetRow.revision = afterRevision;
		// 更新者、更新日時の変更
		targetRow.modificationUser.name = this.cacheService.getLoginUser().name;
		targetRow.modificationDate = Date.now();
		if (this.afterOutputFileName !== '') {
			targetRow.name = this.afterOutputFileName;
		}

		this.taskOutputFileDataGrid.info.gridApi.applyTransaction({ update: [targetRow] });
		this.taskOutputFileDataGrid.refreshView();
	}

	/**
	 * 対象行のリビジョンアップ列表示を元に戻します.
	 * @param targetRow 対象行
	 */
	private resetGridDataForRevisionUp(targetRow: any): void {

		for (let row of this.defaultTaskOutputFileDataGrid) {
			if (targetRow.name === row.name && targetRow.revision === row.revision) {
				// 変更不要
				return;
			}

			if (targetRow.name === row.name && targetRow.revision !== row.revision) {
				// リビジョンアップ用に変更した表示を元に戻す
				targetRow.revision = row.revision;
			}
		}

		this.taskOutputFileDataGrid.info.gridApi.applyTransaction({ update: [targetRow] });
		this.taskOutputFileDataGrid.refreshView();
	}

	// protected getAttributeByDefinitionName(object: EIMObjectDomain, definitionName: string): EIMAttributeDomain {

	// 	for (let attribute of object.attributeList) {
	// 		if (attribute.attributeType.definitionName !== definitionName) {
	// 			continue;
	// 		}
	// 		return attribute;
	// 	}

	// 	return null;
	// }

}
