import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';


import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMMultipleSelectorComponent } from 'app/shared/components/multiple-selector/multiple-selector.component';
import { EIMMultipleSelectorComponentService } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';

/**
 * 役割複数選択コンポーネント
 */
@Component({
	selector: 'eim-responsible-object-role-multiple-selector',
	templateUrl: '../../../../app/shared/components/multiple-selector/multiple-selector.component.html',
	styleUrls: [],
	providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMResponsibleObjectRoleMultipleSelectorComponent)},
	            {provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMResponsibleObjectRoleMultipleSelectorComponent)}],
	standalone: false
})
export class EIMResponsibleObjectRoleMultipleSelectorComponent extends EIMMultipleSelectorComponent {


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected multipleSelectorComponentService: EIMMultipleSelectorComponentService,
		protected dataGridComponentService: EIMDataGridComponentService
	) {
		super(translateService, multipleSelectorComponentService, dataGridComponentService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択します.
	 */
	public select(): void {
		this.selected.emit(this.selectedList.getData());
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値を初期化後の処理です.
	 */
	public ngOnInit(): void {
		super.ngOnInit();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

}
