import {
	Component, IterableDiffers, Input,
	ViewContainerRef, TemplateRef, OnInit,
} from '@angular/core';

import {
	NG_VALUE_ACCESSOR, ControlValueAccessor
} from '@angular/forms';

import { EIMInputFormItemComponent } from '../input-form-item.component';

/**
 * テキストエリア入力フォームアイテムコンポーネント
 * @example
 *      <eim-text-area-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          maxlength="255"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *          [pTooltipLabelFlg]="pTooltipLabelFlg"
 *      >
 *      </eim-text-area-input-form-item>
 */
@Component({
    selector: 'eim-text-area-input-form-item',
    templateUrl: './text-area-input-form-item.component.html',
    styleUrls: ['./text-area-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMTextAreaInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMTextAreaInputFormItemComponent extends EIMInputFormItemComponent implements OnInit {

	/**
	 * コンストラクタです.
	 */
	constructor(protected differs: IterableDiffers) {
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
