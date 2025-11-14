import { Component, Input, AfterViewInit, forwardRef } from '@angular/core';
import { of, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMFormatSelectorComponentService } from 'app/admins/components/format-selector/format-selector.component.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMFormatNameRendererComponent } from 'app/admins/shared/components/renderer/format-name-renderer.component';

/**
 * フォーマット選択コンポーネント
 * @example
 * 		<eim-format-selector
 * 			[multiple]="false"
 * 			[selectedData]="selectedData"
 * 		</eim-format-selector>
 */
@Component({
    selector: 'eim-format-selector',
    templateUrl: './format-selector.component.html',
    styleUrls: ['./format-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFormatSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMFormatSelectorComponent) }],
    standalone: false
})
export class EIMFormatSelectorComponent extends EIMDataGridSingleSelectorComponent implements AfterViewInit, EIMSelectable {

	/** 複数選択可否 */
	@Input() public multiple = false;

	/** フォーマット検索条件 */
	public formatSearchCondition: any = { formatName: [''] };

	/** 表示カラム */
	public columns: any[] = [
		{ field: 'formatName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 160, cellRendererFramework: EIMFormatNameRendererComponent, suppressFilter: true },
		{ field: 'path', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02260'), width: 190 },
	];

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		public formatSelectorComponentService: EIMFormatSelectorComponentService
	) {
		super(formatSelectorComponentService, messageService);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngAfterViewInit() {
		super.ngAfterViewInit();
	}

}
