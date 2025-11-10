import { Component, forwardRef } from '@angular/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMFormListColumnSingleSelectorComponent } from 'app/forms/components/form-list-column-selector/form-list-column-single-selector.component';

/**
 * 表示列編集（対象一覧用）コンポーネント
 * @example
 * 		<eim-form-list-column-single-selector
 * 			[data]="data"
 * 			[multiple]="false">
 * 		</eim-form-list-column-single-selector>
 */
@Component({
    selector: 'eim-class-form-list-column-single-selector',
    templateUrl: './class-form-list-column-single-selector.component.html',
    styleUrls: ['./class-form-list-column-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMClassFormListColumnSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMClassFormListColumnSingleSelectorComponent) }],
    standalone: false
})
export class EIMClassFormListColumnSingleSelectorComponent extends EIMFormListColumnSingleSelectorComponent implements EIMSelectable {
	/**
	 * 表示列データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsColumn(obj1: any, obj2: any): boolean {
		return (obj1.columnId === obj2.columnId);
	}
}
