import { Component, forwardRef, ContentChild, ViewChild, Input, OnInit } from '@angular/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMMultipleSelectorComponent } from 'app/shared/components/multiple-selector/multiple-selector.component';

import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMApproverSingleSelectorComponent } from 'app/documents/components/approver-selector/approver-single-selector.component';

import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';

/**
 * 承認依頼先選択画面複数選択コンポーネント
 * @example
 *	<eim-approver-multiple-selector
 *		[columns]='columns'
 *		[selectedData]='selectedData'>
 *	</eim-approver-multiple-selector>
 */
@Component({
    selector: 'eim-approver-multiple-selector',
    templateUrl: './approver-multiple-selector.component.html',
    styleUrls: ['./approver-multiple-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMApproverMultipleSelectorComponent) },
    ],
    standalone: false
})
export class EIMApproverMultipleSelectorComponent extends EIMMultipleSelectorComponent implements OnInit {

	/** 選択ステータスタイプID */
	@Input() public statusTypeId: number;

	/** 通過条件 */
	public through = '';

	/**
	 * コンストラクタです.
	 * @param multipleSelectorComponentService 複数選択コンポーネントサービス
	 * @param translateService 翻訳サービス
	 */
	constructor(
		protected translateService: TranslateService,
		protected multipleSelectorComponentService: EIMMultipleSelectorComponentService,
		protected dataGridComponentService: EIMDataGridComponentService,
		protected approveService: EIMApproveService,
	) {
		super(translateService, multipleSelectorComponentService, dataGridComponentService);
	}


	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit(): void {
		super.ngOnInit();
		this.approveService.getApproverThroughTerm(this.statusTypeId)
		.subscribe(
				(data: any) => {
					if (data.through == EIMConstantService.APPROVE_THROUGH_ALL) {
						// 全員
						this.through = this.translateService.instant( 'EIM_DOCUMENTS.LABEL_02107' );
					} else if (data.through == EIMConstantService.APPROVE_THROUGH_ONE) {
						// 一人
						this.through = this.translateService.instant( 'EIM_DOCUMENTS.LABEL_02108' );
					}
				}
		);
	}

	/**
	 * 追加ボタン選択時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickAdd(event: any): void {
		super.onClickAdd(event);
	}

	/**
	 * 削除ボタン選択時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickDelete(event: any): void {
		super.onClickDelete(event);
	}
}
