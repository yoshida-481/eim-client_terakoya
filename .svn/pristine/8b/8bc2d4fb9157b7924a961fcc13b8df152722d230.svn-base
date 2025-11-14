import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { of, Observable } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMUserSelectorComponentService } from 'app/shared/components/user-selector/user-selector.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';

import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';

import { EIMUserService } from 'app/shared/services/apis/user.service';
import { EIMUserDefaultRendererComponent } from 'app/shared/components/renderer/user-default-renderer.component';
import { EIMNameRendererComponent } from 'app/shared/components/renderer/name-renderer.component';
import { EIMGroupNameRendererComponent } from 'app/shared/components/renderer/group-name-renderer.component';
import { EIMRoleNameRendererComponent } from 'app/shared/components/renderer/role-name-renderer.component';
import { EIMRoleNameKanaRendererComponent } from 'app/shared/components/renderer/role-name-kana-renderer.component';
/**
 * ユーザ単一選択コンポーネント
 */
@Component({
    selector: 'eim-user-selector',
    templateUrl: './user-selector.component.html',
    styleUrls: ['./user-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMUserSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMUserSelectorComponent) }],
    standalone: false
})
export class EIMUserSelectorComponent extends EIMDataGridSingleSelectorComponent implements EIMSelectable, OnInit {

	@Input()
		public multiple = false;

	/** 親オブジェクトID（親フォルダのセキュリティで絞る場合に指定） */
	@Input()
		public parentObjId: number;

	/** 無効ユーザ絞り込み有無 */
	@Input()
		public disableUserFilter = true;

	/** systemユーザ絞り込み有無 */
	@Input()
		public systemUserFilter = true;

	/** ユーザ選択画面用 */
	public condition: any = {
			parentObjId: null,
			disableUserFilter: true,
			systemUserFilter: true,
			keyword: [''],
			userCode: [''],
			userName: ['']
	};

	public columns: any[] = [];

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected messageService: EIMMessageService,
			public userService: EIMUserService,

			public userSingleSelectorComponentService: EIMUserSelectorComponentService
	) {
		super(userSingleSelectorComponentService, messageService);
		this.columns = [];
		this.columns.push({field: 'code', headerName: this.translateService.instant('EIM.LABEL_02001'), width: 100, suppressFilter: true, cellRendererFramework: EIMUserDefaultRendererComponent});
		this.columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 120, suppressFilter: true, cellRendererFramework: EIMNameRendererComponent});
		this.columns.push({field: 'groupNames', headerName: this.translateService.instant('EIM.LABEL_02003'), cellRendererFramework: EIMGroupNameRendererComponent, width: 155, suppressFilter: true});
		this.columns.push({field: 'roleNames', headerName: this.translateService.instant('EIM.LABEL_02004'), cellRendererFramework: EIMRoleNameRendererComponent, width: 155, suppressFilter: true});
		if (this.userService.searchType === EIMUserService.USER_SERVICE_SEARCH_TYPE_KEYWORD) {
			// キーワード検索の場合のみ”かな”列を出力する
			// 検索条件の対象とするため
			this.columns.push({field: 'kana', headerName: this.translateService.instant('EIM.LABEL_02047'), width: 100, suppressFilter: true, cellRendererFramework: EIMRoleNameKanaRendererComponent});
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値を初期化後の処理です.
	 */
	public ngOnInit(): void {
		super.ngOnInit();

		this.condition.parentObjId = this.parentObjId;
		this.condition.disableUserFilter = this.disableUserFilter;
		this.condition.systemUserFilter = this.systemUserFilter;

	}

}
