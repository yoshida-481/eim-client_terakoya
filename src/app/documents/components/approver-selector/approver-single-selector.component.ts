import { Component, ViewChild, forwardRef, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';

import { EIMFormTypeDisplayColumn, EIMFormTypeDisplayColumnColumn } from 'app/shared/services/apis/local-storage.service';
import { EIMApproverSingleSelectorComponentService } from 'app/documents/components/approver-selector/approver-single-selector.component.service';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';

/**
 * 承認依頼先選択画面単数選択コンポーネント
 * @example
 *	<eim-approver-list-single-selector
 *		[allColumns]='allColumns'
 *		[multiple]='true'
 *		[onlyBoss]='true'>
 *	</eim-approver-list-single-selector>
 */
@Component({
    selector: 'eim-approver-single-selector',
    templateUrl: './approver-single-selector.component.html',
    styleUrls: ['./approver-single-selector.component.css'],
    providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMApproverSingleSelectorComponent)},
                {provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMApproverSingleSelectorComponent)}],
    standalone: false
})
export class EIMApproverSingleSelectorComponent extends EIMDataGridSingleSelectorComponent implements EIMSelectable, OnInit, AfterViewInit {

	/** 複数選択可否 */
	@Input()
	public multiple = false;

	/** 全表示候補ユーザ一覧 */
	@Input()
	public allColumns: EIMUserDTO[] = [];

	@Input()
	public onlyBoss = false;

	/** 属性タイプ検索条件 */
	public userSearchCondition: any = {
		userName: [''],
		showOnlySuperior: false,
	};

	/** 表示カラム */
	public columns: any[] = [
		{field: 'code', headerName: this.translateService.instant('EIM.LABEL_02001'), width: 90},
		{field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 100},
		{field: 'groupNames', headerName: this.translateService.instant('EIM.LABEL_02003'), cellRendererFramework: EIMTooltipRendererComponent, width: 105},
		{field: 'roleNames', headerName: this.translateService.instant('EIM.LABEL_02004'), cellRendererFramework: EIMTooltipRendererComponent, width: 105},
		{field: 'kana', headerName: this.translateService.instant('EIM.LABEL_02047'), width: 90},
	];

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected messageService: EIMMessageService,
			public approverSingleSelectorComponentService: EIMApproverSingleSelectorComponentService,
	) {
		super(approverSingleSelectorComponentService, messageService);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit(): void {
		super.ngOnInit();
		this.setData(this.allColumns);
		this.userSearchCondition.showOnlySuperior = this.onlyBoss;
	}

	/**
	 * ビュー初期化イベントハンドラ.
	 */
	ngAfterViewInit() {
		super.ngAfterViewInit();
		window.setTimeout(() => {
			this.approverSingleSelectorComponentService.initFilter(this.info, this.userSearchCondition);
		});
	}

	/**
	 * 上長のみ表示チェックボックスクリックイベントハンドラ
	 */
	onChangeSuperiorFlag() {
		window.setTimeout(() => {
			this.approverSingleSelectorComponentService.initFilter(this.info, this.userSearchCondition);
		});
	}

}
