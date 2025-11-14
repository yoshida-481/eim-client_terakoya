import {	Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSearchInputFormItemComponent } from '../search-input-form-item.component';

/**
 * 数値範囲検索条件入力フォームアイテムコンポーネント
 * @example
 *      <eim-long-range-search-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-long-range-search-input-form-item>
 */
@Component({
    selector: 'eim-long-range-search-input-form-item',
    templateUrl: './long-range-search-input-form-item.component.html',
    styleUrls: ['./long-range-search-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMSearchLongRangeInputFormItemComponent, multi: true },
    ],
    standalone: false
})
export class EIMSearchLongRangeInputFormItemComponent extends EIMSearchInputFormItemComponent {

	/** デリミタ「~」 */
	public DELIMITER_TIDE: string = EIMConstantService.DELIMITER_TIDE ;

	/**
	 * コンストラクタです.
	 */
	constructor(	) {
		super();
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onChange(event, index) {
		if (this.formControl == null) {
			return;
		}

		// 指定長さで切り捨て
		this.value[index] = event.currentTarget.value.substr(0, this.maxlength);

		// update the form
		this.formControl.setValue(this.value[index]);
		this.formControl.markAsDirty();
	}
}
