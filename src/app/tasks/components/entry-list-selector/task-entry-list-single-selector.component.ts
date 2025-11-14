import { Component, ViewChild, forwardRef, Input, Output, EventEmitter } from '@angular/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from "app/shared/services/constant.service";
import { TranslateService } from '@ngx-translate/core';
import { EIMMessageService } from "app/shared/services/message.service";
import { EIMDataGridSingleSelectorComponent } from "app/shared/components/data-grid-single-selector/data-grid-single-selector.component";
import { EIMSingleSelectorComponent } from "app/shared/components/single-selector/single-selector.component";
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from "app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service";
import { EIMDataGridColumn } from "app/shared/components/data-grid/data-grid.component";

import { EIMFormTypeDisplayColumn, EIMFormTypeDisplayColumnColumn } from 'app/shared/services/apis/local-storage.service';
import { EIMTaskEntryListSingleSelectorComponentService } from "app/tasks/components/entry-list-selector/task-entry-list-single-selector.component.service";
import { EIMUserDTO } from "app/shared/dtos/user.dto";
import { EIMTooltipRendererComponent } from "app/shared/components/renderer/tooltip-renderer.component";
import { EIMServerConfigService } from "app/shared/services/server-config.service";

/**
 * エントリーリスト選択（選択済み一覧用）コンポーネント
 * @example
 *	<eim-taks-entry-list-single-selector
 *		[allColumns]="allColumns"
 *		[multiple]="true" [mailFlag]="true">
 *	</eim-taks-entry-list-single-selector>
 */
@Component({
	selector: 'eim-taks-entry-list-single-selector',
	templateUrl: './task-entry-list-single-selector.component.html',
	styleUrls: ['./task-entry-list-single-selector.component.scss'],

	 providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMTaskEntryListSingleSelectorComponent)},
		            {provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMTaskEntryListSingleSelectorComponent)}],
	standalone: false
})
export class EIMTaskEntryListSingleSelectorComponent extends EIMDataGridSingleSelectorComponent implements EIMSelectable {

	/** 複数選択可否 */
	@Input()
	public multiple: boolean = false;

	/** メール通知先選択画面表示フラグ */
	@Input()
	public mailFlag: boolean = false;

	/** 全表示候補ユーザ一覧 */
	@Input()
	public allColumns: EIMUserDTO[] = [];

	/** 属性タイプ検索条件 */
	public userSearchCondition: any = {
		userName: [""],
	};

	/** 表示カラム */
	public columns: any[] = [
   	{field: 'code', headerName: this.translateService.instant("EIM.LABEL_02001"), width: 200},
		{field: 'name', headerName: this.translateService.instant("EIM.LABEL_02002"), width: 300},
		// {field: 'groupNames', headerName: this.translateService.instant("EIM.LABEL_02003"), cellRendererFramework:EIMTooltipRendererComponent, width: 130},
		// {field: 'roleNames', headerName: this.translateService.instant("EIM.LABEL_02004"), cellRendererFramework:EIMTooltipRendererComponent, width: 130},
	];

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected messageService: EIMMessageService,
			public entryListSingleSelectorComponentService: EIMTaskEntryListSingleSelectorComponentService,
			protected serverConfigService: EIMServerConfigService,
	) {
		super(entryListSingleSelectorComponentService, messageService);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	public ngOnInit() {
		super.ngOnInit();
		this.setData(this.allColumns);
		this.userSearchCondition.showOnlySuperior = !this.mailFlag && this.serverConfigService.showOnlySuperior;
	}

	/**
	 * ビュー初期化イベントハンドラ.
	 */
	public ngAfterViewInit() {
		super.ngAfterViewInit();
		if(!this.mailFlag) {
			window.setTimeout(() => {
				this.entryListSingleSelectorComponentService.initFilter(this.info, this.userSearchCondition);
			});
		}
	}

	/**
	 * 上長のみ表示チェックボックスクリックイベントハンドラ
	 */
	onChangeSuperiorFlag() {
		window.setTimeout(() => {
			this.entryListSingleSelectorComponentService.initFilter(this.info, this.userSearchCondition);
		});
	}
}
