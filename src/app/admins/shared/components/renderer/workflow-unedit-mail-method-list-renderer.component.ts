import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
/**
 * ステータスレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMFormatStatusRendererComponent
 */
@Component({
    selector: 'eim-workflow-mail-method-list-renderer',
    template: `
		<div class="eim-form-item" style="height: 100%; display: flex; align-items: center; margin: 0px;">
	    <div align="left" style="height: 100%; display: flex; align-items: center;">
					<div class="eim-form-input" style="margin: 0px;">
						<eim-radio-button name="mailMethod{{this.params.data.id}}" label="{{ 'EIM.LABEL_02034' | translate }}" value="immediate" [(ngModel)]="this.params.data.method" class="eim-dir-status-online" disabled="true"></eim-radio-button>
						<eim-radio-button name="mailMethod{{this.params.data.id}}" label="{{ 'EIM_ADMINS.LABEL_02217' | translate }}" value="accumulate" [(ngModel)]="this.params.data.method" class="eim-dir-status-offline" disabled="true"></eim-radio-button>
						<eim-radio-button name="mailMethod{{this.params.data.id}}" label="{{ 'EIM_ADMINS.LABEL_02104' | translate }}" value="selectable" [(ngModel)]="this.params.data.method" class="eim-dir-status-offline" disabled="true"></eim-radio-button>
					</div>
	    </div>
    </div>
    `,
    standalone: false
})

export class EIMWorkflowUneditMailMethodListComponent implements OnInit, AgRendererComponent {

	public params: any;

	/**
	 * コンストラクタです.
	 */
	constructor() {}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
	}
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
