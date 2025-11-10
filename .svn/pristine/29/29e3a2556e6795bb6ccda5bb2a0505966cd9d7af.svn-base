import { Component, IterableDiffers, OnInit, Input, OnDestroy, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, NgForm, NG_VALUE_ACCESSOR, ControlValueAccessor,
	Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { SelectItem } from 'primeng/api'

import { FileUploader, FileItem } from 'ng2-file-upload';

import { EIMFileService } from 'app/shared/services/apis/file.service';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMWebDAVService } from 'app/shared/services/webdav.service';

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMFileObjectCreatorDomain } from 'app/shared/domains/file-object-creator.domain';
import { EIMTempFileObjectDomain } from 'app/shared/domains/temp-file-object.domain';
import { EIMTemplateFileDTO } from 'app/shared/dtos/template-file.dto';

import { EIMInputFormItemComponent } from '../input-form-item.component';
import { EIMAttachementFileInputFormItemComponentService } from './attachement-file-input-form-item.component.service';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * 添付ファイル入力フォームアイテムコンポーネント
 * @example
 *      <eim-attachement-file-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-attachement-file-input-form-item>
 */
@Component({
    selector: 'eim-attachement-file-input-form-item',
    templateUrl: './attachement-file-input-form-item.component.html',
    styleUrls: ['./attachement-file-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMAttachementFileInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMAttachementFileInputFormItemComponent extends EIMInputFormItemComponent implements OnInit, OnDestroy {

	/** フォーム */
	@ViewChild('fileCreateForm') fileCreateForm: NgForm;

	/** ファイルアップローダ */
	public uploader: FileUploader = new FileUploader({ url: "" });
	/** 表示データ */
	public data: SelectItem[] = [];
	/** 選択データ */
	public selectedData: string[] = [];
	/** WebDAVが有効かどうか */
	public enabledWebDAV = false;
	/** WebDAV編集可能かどうか */
	public editableWebDAV = false;

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
			protected translateService: TranslateService,
			protected fileService: EIMFileService,
			protected messageService: EIMMessageService,
			protected serverConfigService: EIMServerConfigService,
			protected webDAVService: EIMWebDAVService,
			protected attachementFileInputFormItemComponentService: EIMAttachementFileInputFormItemComponentService,
			protected differs: IterableDiffers) {
		super(differs);

		// ファイル選択完了時のハンドラ登録
		this.uploader.onAfterAddingAll = (fileItems: FileItem[]) => {
			this.onAddFiles(fileItems);
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

		this.setAttachementFileSelectItems(value);

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
		this.setAttachementFileSelectItems(this.value);

		for (let i = 0; i < this.value.length; i++) {
			this.savedFileNameAndObjectMap[this.value[i].name] = this.value[i];
		}
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		this.uploader.clearQueue();
		this.uploader.cancelAll();
		this.uploader = null;

	}

	/**
	 * ファイルリンククリック時イベントハンドラです.
	 * @param event イベント
	 * @param fileName ファイル名
	 */
	onClickFileLink(event, fileName: string): void {
		event.preventDefault();

		let object: EIMObjectDomain = this.getValueByFileName(fileName);
		this.fileService.download(object.id);
	}

	/**
	 * ファイル選択時イベントハンドラです.
	 * 編集ボタンの有効無効を切り替えます.
	 * @param event イベント
	 */
	onSelectFiles(event): void {
		this.editableWebDAV = false;

		if (this.selectedData.length == 1 && this.webDAVService.editable(this.selectedData[0])) {
			this.editableWebDAV = true;
		}
	}

	/**
	 * ファイル追加時イベントハンドラです.
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
			// 差替えありの場合
			this.replaceFileItems(replaceFiles, addFiles);

		} else {
			// 差替えなしの場合
			this.addFileItems(addFiles);
		}

	}

	/**
	 * ファイル削除クリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickDelete(event): void {
		let removeFileNames: string[] = [];

		for (let i = 0; i < this.selectedData.length; i++) {
			removeFileNames.push(this.selectedData[i]);
		}
		this.uploader.clearQueue();
		this.removeFilesByName(removeFileNames);

		this.setValue(0);
	}

	/**
	 * ファイル新規クリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickShowFileCreator(event): void {
		this.selectedTemplateFilePath = null;
		this.createFileName = '';

		if (this.templateFileSelectItems) {
			this.selectedTemplateFilePath = this.templateFileSelectItems[0].value;
			this.displayFileCreator = true;
			return;
		}

		this.templateFileSelectItems = [];
		this.attachementFileInputFormItemComponentService.getTemplateFileList()
		.subscribe((templateFiles: EIMTemplateFileDTO[]) => {

			for (let i = 0; i < templateFiles.length; i++) {
				this.templateFileSelectItems.push({label: templateFiles[i].displayName, value: templateFiles[i].filePath});
			}
			if (this.templateFileSelectItems.length > 0) {
				this.selectedTemplateFilePath = this.templateFileSelectItems[0].value;
			}
			this.displayFileCreator = true;
		});
	}

	/**
	 * 添付ファイル登録画面の登録クリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickCreate(event): void {
		let foc: EIMFileObjectCreatorDomain = new EIMFileObjectCreatorDomain();
		let ext: string = this.selectedTemplateFilePath.substring(this.fileCreateForm.controls['selectedTemplateFilePath'].value.lastIndexOf('.'));
		foc.name = this.fileCreateForm.controls['createFileName'].value + ext;

		// ファイル名チェック
		for (let i = 0; i < EIMConstantService.INVALID_NAME_CHAR.length; i++) {
			let checkChar: string = EIMConstantService.INVALID_NAME_CHAR[i];
			if (foc.name.includes(checkChar)) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00009'));
				return;
			}
		}

		//  重複チェック
		for (let i = 0; i < this.value.length; i++) {
			if (foc.name == this.value[i].name) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00004'));

				return;
			}
		}

		this.attachementFileInputFormItemComponentService.createFromTemplate(foc)
			.subscribe(
				(object: EIMFileObjectCreatorDomain) => {
					// 一時ファイル作成完了
					this.displayFileCreator = false;
					this.value.push(object);
					this.addAttachementFileSelectItem(object);

					this.webDAVService.edit(object.id, object.name);

					this.setValue(0);
				});
	}

	/**
	 * ファイル編集クリック時イベントハンドラです.
	 * @param event イベント
	 */
	onClickEdit(event): void {
		let selectedFileName: string = this.selectedData[0];

		let savedObject: EIMObjectDomain = this.savedFileNameAndObjectMap[selectedFileName];
		if (!savedObject) {
			// 一時ファイルの場合
			let selectedObject: EIMObjectDomain = this.getValueByFileName(selectedFileName);
			this.webDAVService.edit(selectedObject.id, selectedObject.name);
		} else {
			// 一時ファイルでない場合
			let foc: EIMFileObjectCreatorDomain = new EIMFileObjectCreatorDomain(savedObject);
			this.attachementFileInputFormItemComponentService.copy(foc)
			.subscribe((data: EIMFileObjectCreatorDomain[]) => {

				// 更新対象のファイルオブジェクトを更新
				let fileName: string = data[1].name;
				let value: EIMObjectDomain = this.getValueByFileName(fileName);
				value.id = data[1].id;
				value.type = data[1].type;

				this.savedFileNameAndObjectMap[fileName] = null;

				this.webDAVService.edit(data[1].id, data[1].name);
			});
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
	 * ファイルアイテムを差し替えます.
	 * @param replaceFiles 差し替えるファイルアイテム
	 * @param addFiles 追加するファイルアイテム
	 */
	private replaceFileItems(replaceFiles: FileItem[], addFiles: FileItem[]): void {
		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00002'),
				() => {
					// 差替え対象ファイルを削除する
					let removeFileNames: string[] = [];
					for (let i = 0; i < replaceFiles.length; i++) {
						removeFileNames.push(replaceFiles[i].file.name);
					}
					this.removeFilesByName(removeFileNames);
					// 全追加対象ファイルを追加する
					this.addFileItems(addFiles);

					this.setValue(0);
				},
				() => {
					// 確認画面でいいえを選択された場合、追加対象をクリアする
					this.uploader.clearQueue();
				}
		);
	}

	/**
	 * ファイルを追加します.
	 * @param addFiles 追加するファイルの配列
	 */
	protected addFileItems(addFiles: FileItem[]): void {
		for (let i = 0; i < addFiles.length; i++) {
			let fileItem: FileItem = addFiles[i];

			this.attachementFileInputFormItemComponentService.uploadFile(this.uploader, fileItem)
				.subscribe((data: any) => {
					this.attachementFileInputFormItemComponentService.create(data.data, fileItem.file.name)
						.subscribe((object: any) => {
							this.value.push(object);
							this.addAttachementFileSelectItem(object);

							// キューから削除
							let removeFileItem: FileItem = this.getFileItemByName(object.name);
							this.uploader.removeFromQueue(removeFileItem);

							this.setValue(0);
						}, (err: any) => {
							// キューから削除
							this.uploader.removeFromQueue(fileItem);
						});
				}, (err: any) => {
					// キューから削除
					this.uploader.removeFromQueue(fileItem);
				});
		}
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
				this.attachementFileInputFormItemComponentService.delete(this.getValueByFileName(removeObjectName).id);
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
	private setAttachementFileSelectItems(objects: EIMObjectDomain[]): void {
		if (objects == null) {
			return null;
		}
		this.data = [];
		for (let i = 0; i < objects.length; i++) {
			this.addAttachementFileSelectItem(objects[i]);
		}
	}

	/**
	 * 画面表示アイテムにオブジェクトを追加します.
	 * @param object オブジェクト
	 */
	private addAttachementFileSelectItem(object: EIMObjectDomain): void {
		let selectItem: SelectItem = {label: object.name, value: object.name};
		selectItem['icon'] = this.getIcon(object.name);
		this.data.push(selectItem);
		this.data = this.data.filter(item => item);
	}

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

		let ext: string = fileName.substring(fileName.lastIndexOf('.'));
		if (this.serverConfigService.isExcelExt(ext)) {
			return 'eim-icon-excel';
		}
		if (this.serverConfigService.isWordExt(ext)) {
			return 'eim-icon-word';
		}
		if (this.serverConfigService.isPowerPointExt(ext)) {
			return 'eim-icon-powerpoint';
		}
		if (this.serverConfigService.isPDFExt(ext)) {
			return 'eim-icon-pdf';
		}
		return 'eim-icon-file';

	}

}
