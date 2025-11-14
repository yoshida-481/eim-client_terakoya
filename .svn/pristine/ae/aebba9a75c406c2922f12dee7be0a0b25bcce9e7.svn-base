import { Component, forwardRef, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMObjectEditorsObjectService, EIMFile } from 'app/object-editors/shared/services/apis/object-editors-object.service';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';
import { EIMFileNameLinkRendererComponent } from 'app/object-editors/shared/components/renderer/file-name-link-renderer.component';
import { EIMFormatIconRendererComponent } from 'app/object-editors/shared/components/renderer/format-icon-renderer.component';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
/**
 * ファイル一覧コンポーネント
 * @example
 * 		<eim-file-uploader [objData]="objData">
 * 		</eim-file-uploader>
 */
@Component({
    selector: 'eim-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFileUploaderComponent) }],
    standalone: false
})
export class EIMFileUploaderComponent implements OnInit {

	/** オブジェクト情報 */
	@Input() objData: EIMObjectDTO;

	/** ファイル一覧データグリッドコンポーネント */
	@ViewChild('fileUploaderDataGrid', { static: true }) fileUploaderDataGrid: EIMDataGridComponent;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** ファイルセレクター */
	@ViewChild('elementInputFile') elementInputFile: ElementRef;

	/** アップローダ */
	public uploader: FileUploader = null;

	/** アップロードボタン生成フラグ */
	public inputElementCreate = false;

	/** グリッドメニュー */
	// アップロード
	protected menuUpdate: EIMMenuItem =
		{label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03020'), name: 'update', icon: 'fa fa-upload eim-upload-menu-btn-icon', disabled: true , command: (event) => { this.onClickUpdate(); }};

	/** ファイル一覧のメニュー */
	public formatListMenu: EIMMenuItem[] = [
		this.menuUpdate
	];


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected objectEditorsObjectService: EIMObjectEditorsObjectService,
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * データグリッドで使用する比較用メソッドです.
	 * @param data1 データ1
	 * @param data2 データ2
	 */
	public equals(data1: any, data2: any): boolean {
		if (data1.formatId === data2.formatId) {
			return true;
		}
		return false;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// フォーマット
		columns.push({field: 'formatName', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02029'), cellRendererFramework: EIMFormatIconRendererComponent, suppressFilter: true, width: 222});
		// ファイル名
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02030'), cellRendererFramework: EIMFileNameLinkRendererComponent, suppressFilter: true, width: 220});
		// サイズ
		columns.push({field: 'fileSize', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02031'), type: EIMDataGridColumnType.number, suppressFilter: true, width: 120});
		this.fileUploaderDataGrid.setColumns(columns);
		this.getFormatList();
		// ファイル追加イベントハンドラ設定
		this.clearUploader();
	}

	/**
	 * フォーマット選択時のイベントハンドラです.
	 */
	onSelectFormat(): void {
		let selectedData = this.fileUploaderDataGrid.getSelectedData();

		if (selectedData.length === 0) {
			this.menuUpdate.disabled = true;
		} else {
			this.menuUpdate.disabled = false;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * フォーマット一覧を取得する.
	 * @param フォーマットID
	 */
	private getFormatList(formatId?: number): void {
		this.objectEditorsObjectService.getFile(this.objData.id).subscribe((data: EIMFile[]) => {
			let dataList: EIMFile[] = [];
			if (data && data.length > 0 ) {
				for ( let i = 0 ; data.length > i; i++) {
					dataList.push(data[i]);
				}
				this.fileUploaderDataGrid.setData(dataList);
				if (formatId) {
					this.fileUploaderDataGrid.select([{formatId: formatId}]);
					this.fileUploaderDataGrid.ensureIndexVisible(this.fileUploaderDataGrid.getFirstRowIndex());
				}
			} else {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_OBJECT_EDITORS.ERROR_00004'));
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		});
	}

	/**
	 * アップデートメニュー押下時の処理です.
	 */
	private onClickUpdate() {
		this.inputElementCreate = true;
		// ファイルアップローダを紐づけたインプットを押下
		window.setTimeout(() => {
			this.elementInputFile.nativeElement.click();
		});
	}

	/**
	 * ファイルをアップロードする.
	 * @param fileItems 行情報
	 */
	private uploadFile(fileItems: FileItem): void {
		let selectedData = this.fileUploaderDataGrid.getSelectedData()[0];
		// 拡張子がある場合、アップロード処理を続ける

		if (!(-1 < fileItems.file.name.indexOf('.'))) {
			this.clearUploader();
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_OBJECT_EDITORS.ERROR_00005'));
			window.setTimeout (() => {
				return;
			})
		} else {
			// 確認ダイアログを表示し、アップロードする
			let message = ''
			if (selectedData.objName) {
				message = this.translateService.instant('EIM_OBJECT_EDITORS.CONFIRM_00002', {value: fileItems.file.name});
			} else {
				message = this.translateService.instant('EIM_OBJECT_EDITORS.CONFIRM_00001', {value: fileItems.file.name});
			}
			this.messageService.show(EIMMessageType.confirm, message,
				() => {
					let fileDetail = {
						filename: fileItems.file.name,
						registerAllSearch: false,
						objectId: selectedData.objId,
						formatId: selectedData.formatId
					}
					// ファイルアップロード
					this.objectEditorsObjectService.fileUpload(this.uploader, fileItems, fileDetail).subscribe(
						() => {
							this.clearUploader()
							this.getFormatList(selectedData.formatId);
						},
						() => {
							this.clearUploader();
						}
					);
				},
				() => {
					// 確認ダイアログでいいえを選んだ場合、アップローダをクリアする
					this.clearUploader();
					this.fileUploaderDataGrid.refreshView();
				}
			)
		}
	}
	/**
	 * アップローダをクリアします.
	 */
	private clearUploader(): void {
		if (this.uploader) {
			this.uploader.clearQueue();
			this.uploader.cancelAll();

			this.uploader = null;
		}
		this.uploader = new FileUploader({url:""});
		// ファイル追加イベントハンドラ設定
		this.uploader.onAfterAddingAll = (fileItems: FileItem[]) => {
			this.uploadFile(fileItems[0]);
		};

		this.inputElementCreate = false;
	}
}
