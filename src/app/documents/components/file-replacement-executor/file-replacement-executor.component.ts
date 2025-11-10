import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

// primeng
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMContentsTypeService, EIMDocumentType } from 'app/documents/shared/services/apis/contents-type.service';

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
import { EIMFolderService, EIMFolder, EIMFolderType } from 'app/documents/shared/services/apis/folder.service';

import { EIMProcessingResultRendererComponent } from 'app/documents/shared/components/renderer/processing-result-renderer.component';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';

import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMAttachementFileInputFormItemComponentService } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';

/** 画面状態定数 */
export namespace stateConst {
	export const EDITING = 'editing';
	export const CREATING = 'creating';
	export const COMPLETE = 'complete';
}

/**
 * 差換えコンポーネント
 * @example
 *
 *  <eim-file-replacement-executor
 *    [parentObjId]="objId"
 *    [content]="content"
 *    [addFileList]="addFileList"
 *    [name]="name"
 *    [file]="file">
 *  </eim-file-replacement-executor>
 */
@Component({
    selector: 'eim-file-replacement-executor',
    templateUrl: './file-replacement-executor.component.html',
    styleUrls: ['./file-replacement-executor.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFileReplacementExecutorComponent) }],
    standalone: false
})
export class EIMFileReplacementExecutorComponent implements OnInit, OnDestroy, EIMExecutable {

	/** 親オブジェクトID */
	@Input() parentObjId: number;

	/** 対象のオブジェクト */
	@Input() content: any;

	/** 追加ファイル（一覧画面にてドラッグした場合に指定） */
	@Input() addFileList: any[];

	/** 名前 */
	@Input() name: string;

	/** ファイル */
	@Input() file: string;

	/** 作成完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** アップローダ */
	public uploader: FileUploader = new FileUploader({url:""});

	/** 状態 */
	public STATE = stateConst;
	public state = stateConst.EDITING;

	/**
	 * コンストラクタです.
	 */
	constructor(
		private translateService: TranslateService,
		private documentFormService: EIMDocumentFormService,
		private messageService: EIMMessageService,
		) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 差換えを実行します.
	 */
	public execute(): void {

		let fileItem: FileItem = this.uploader.queue[0];

		this.state = this.STATE.CREATING;

		// リクエストパラメータを設定
		let additionalParameter: any = {
				parentObjId: this.parentObjId,
				objId: this.content.objId,
				fileName: fileItem.file.name,
		};

		// 差換え実行
		this.documentFormService.fileReplacementExecutor(this.uploader, fileItem, additionalParameter).subscribe(
			(data: any) => {
				this.state = this.STATE.COMPLETE;
				this.executed.emit([{objId: this.content.objId}]);
			},
			(err: any) => {
				this.state = this.STATE.EDITING;
			});
	}

	/**
	 * 差換え実行可否を返却します.
	 * @return 実行可否
	 */
	public executable(): boolean {
		if (0 < this.uploader.queue.length) {
			return true;
		}
		return false;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event: any, close: EventEmitter<null>): void {
		event.preventDefault();

		if (this.executable()) {
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
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.name = this.content.objName;
		// ファイル追加イベントハンドラ設定
		this.uploader.onAfterAddingAll = (fileItems: FileItem[]) => {
			this.onAddFiles(fileItems);
		};
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		this.uploader.clearQueue();
		this.uploader.cancelAll();
		this.uploader = null;
	}

	/**
	 * ファイル追加イベントハンドラ
	 * @param fileItems 追加するファイル配列
	 */
	onAddFiles(fileItems: FileItem[]): void {
		if (!fileItems || fileItems.length === 0) {
			return;
		}

		if (this.uploader.queue.length > 1) {
			this.uploader.removeFromQueue(this.uploader.queue[0]);
		}
		this.file = fileItems[0].file.name;
	}
}
