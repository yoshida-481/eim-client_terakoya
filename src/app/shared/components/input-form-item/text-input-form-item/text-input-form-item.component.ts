import { Component, IterableDiffers, forwardRef, Input, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';

import { EIMInputFormItemComponent } from '../input-form-item.component';
import { TranslateService } from '@ngx-translate/core';

/**
 * テキスト入力フォームアイテムコンポーネント
 * @example
 *      <eim-text-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          inputType="text"
 *          [label]="label"
 *          [required]="true"
 *          maxlength="255"
 *          pattern=""
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *          [pTooltipLabelFlg]="pTooltipLabelFlg"
 *      >
 *      </eim-text-input-form-item>
 */
@Component({
    selector: 'eim-text-input-form-item',
    templateUrl: './text-input-form-item.component.html',
    styleUrls: ['./text-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMTextInputFormItemComponent, multi: true },
    ],
    standalone: false
})
export class EIMTextInputFormItemComponent extends EIMInputFormItemComponent implements OnInit {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected differs: IterableDiffers,
		protected translateService: TranslateService) {
		super(differs);
	}

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

}
