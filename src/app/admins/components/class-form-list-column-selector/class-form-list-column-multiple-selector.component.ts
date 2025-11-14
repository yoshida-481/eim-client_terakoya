import { Component, forwardRef, OnInit } from '@angular/core';
import { EIMComponent } from 'app/shared/shared.interface';

import { EIMFormListColumnMultipleSelectorComponent } from 'app/forms/components/form-list-column-selector/form-list-column-multiple-selector.component';
import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMMultipleSelectionComponentInfo, EIMMultipleSelectorComponentService } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMClassFormListColumnMultipleSelectorComponentService } from 'app/admins/components/class-form-list-column-selector/class-form-list-column-multiple-selector.component.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';

/**
 * 表示列更新（選択済み一覧用）コンポーネント
 * @example
 *	<eim-form-list-column-multiple-selector
 *		[columns]="columns"
 *		[selectedData]="selectedData">
 *	</eim-form-list-column-multiple-selector>
 */
@Component({
    selector: 'eim-class-form-list-column-multiple-selector',
    templateUrl: './class-form-list-column-multiple-selector.component.html',
    styleUrls: ['./class-form-list-column-multiple-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMClassFormListColumnMultipleSelectorComponent) },
    ],
    standalone: false
})
export class EIMClassFormListColumnMultipleSelectorComponent extends EIMFormListColumnMultipleSelectorComponent implements OnInit {

	/**
	 * コンストラクタです.
	 * @param multipleSelectorComponentService 複数選択コンポーネントサービス
	 * @param classformListColumnMultipleSelectorComponentService 属性タイプ複数選択コンポーネントサービス
	 * @param translateService 翻訳サービス
	 */
	constructor(
		protected translateService: TranslateService,
		protected multipleSelectorComponentService: EIMMultipleSelectorComponentService,
		protected dataGridComponentService: EIMDataGridComponentService,
		protected classformListColumnMultipleSelectorComponentService: EIMClassFormListColumnMultipleSelectorComponentService,
	) {
		super(translateService, multipleSelectorComponentService, dataGridComponentService, classformListColumnMultipleSelectorComponentService);
	}
}
