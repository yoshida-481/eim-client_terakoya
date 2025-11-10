import { Component, IterableDiffers, forwardRef, Input, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';

import { EIMInputFormItemComponent } from '../input-form-item.component';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';

/**
 * URL入力フォームアイテムコンポーネント
 * @example
 *      <eim-url-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          inputType="text"
 *          [label]="label"
 *          [pTooltipLabelFlg]="pTooltipLabelFlg"
 *      >
 *      </eim-url-input-form-item>
 */
@Component({
	selector: 'eim-url-input-form-item',
	templateUrl: './url-input-form-item.component.html',
	styleUrls: ['./url-input-form-item.component.css'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: EIMUrlInputFormItemComponent, multi: true},
	],
	standalone: false,
})
export class EIMUrlInputFormItemComponent extends EIMInputFormItemComponent implements OnInit {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected differs: IterableDiffers,
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected clipboardService: ClipboardService,
		protected fileService: EIMFileService, ) {
		super(differs);
	}

	/** URL */
	public url: string;

	/** タスク名称 */
	public taskName: string;

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラです.
	 */
	ngOnInit(): void {
		// labelの文言が長い場合、省略表示されるため、pTooltipにて全文言を表示させる
		if (this.pTooltipLabelFlg && this.strBytesLength(this.label) > 25) {
			this.pTooltipLabel = this.label;
		}

	}

	/**
	 * クリップボードへのコピー処理
	 */
   	copyToClipboard() {
		const currentValue = this.value[0];
		if (currentValue) {
			this.clipboardService.copy(currentValue);
			this.messageService.showGrowl(this.translateService.instant('EIM.INFO_00007', {value: 'URL'}));
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
		objNameList.push(this.taskName);
		urlLinkList.push(url);
		this.fileService.downLoadUrlLinkFile(objNameList,  urlLinkList, kind);
	}
}
