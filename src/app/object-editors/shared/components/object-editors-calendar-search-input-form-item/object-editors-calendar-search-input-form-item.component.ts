import {	Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSearchCalendarInputFormItemComponent } from 'app/shared/components/search-input-form-item/calendar-search-input-form-item/calendar-search-input-form-item.component';

/**
 * カレンダ検索条件入力フォームアイテムコンポーネント
 * @example
 *      <eim-object-editors-calendar-search-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-object-editors-calendar-search-input-form-item>
 */
@Component({
    selector: 'eim-object-editors-calendar-search-input-form-item',
    templateUrl: './object-editors-calendar-search-input-form-item.component.html',
    styleUrls: ['./object-editors-calendar-search-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMObjectEditorsSearchCalendarInputFormItemComponent, multi: true },
    ],
    standalone: false
})
export class EIMObjectEditorsSearchCalendarInputFormItemComponent extends EIMSearchCalendarInputFormItemComponent {
}
