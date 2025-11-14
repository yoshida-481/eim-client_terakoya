import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader, FileItem } from 'ng2-file-upload';

import { EIMFileSelectRendererComponentService } from 'app/documents/shared/components/renderer/file-select-renderer.component.service';

/**
 * ファイル選択レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMFileSelectRendererComponent
 *
 */
@Component({
    selector: 'eim-file-select-renderer',
    template: `
			<div style="height: 100%; display: flex; align-items: center;">
				<div style="width: 100%; overflow: hidden; text-overflow: ellipsis; max-width: 100%;"
					pTooltip="{{selectedFileName}}" tooltipPosition="top">
					{{selectedFileName}}
				</div>
				<label for="{{id}}" [ngClass]="isActive() ? 'eim-upload-btn' : 'eim-upload-btn-disabled'" style="padding-left: 5px; padding-right: 5px;" pTooltip="{{ 'EIM_DOCUMENTS.LABEL_03014' | translate }}">
					<i class="fa fa-upload" aria-hidden="true" style="margin-left: 2px"></i>
					<input type="file" id="{{id}}" ng2FileSelect [uploader]="uploader" style="display: none;" [disabled]="!isActive()" />
				</label>
			</div>
		`,
    standalone: false
})
export class EIMFileSelectRendererComponent implements AgRendererComponent, OnDestroy {

	/** パラメータ */
	public params: any;

	/** 選択ファイル名 */
	public selectedFileName: string = this.translateService.instant('EIM.LABEL_02020');

	/** ファイルアップローダー(ファイルアイテムのみ使用) */
	public uploader: FileUploader = new FileUploader({url:""});

	/** フォームアイテムID */
	public id = '';

	/**
	 * コンストラクタ
	 */
	constructor(
			protected translateService: TranslateService,
			private fileSelectRendererComponentService: EIMFileSelectRendererComponentService
	) {

		// ファイル追加イベントハンドラ
		this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
			this.params.data.selectedFile = fileItem;
			this.selectedFileName = fileItem._file.name;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.id = 'id_' + params.data.objId;
		if (this.params.data.selectedFile) {
			this.selectedFileName = this.params.data.selectedFile._file.name;
		}
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * コンポーネント破棄前イベントハンドラ
	 */
	ngOnDestroy(): void {
		this.uploader.clearQueue();
		this.uploader.cancelAll();
		this.uploader = null;
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	public isActive(): boolean {
		return this.fileSelectRendererComponentService.isActive(this.params.data);
	}
}
