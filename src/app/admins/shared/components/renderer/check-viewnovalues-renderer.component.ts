import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
/**
 * 必須項目レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMCheckViewNoValuesRendererComponent
 */
@Component({
    selector: 'eim-check-viewnovalues-renderer',
    template: `
    <div align="left" style="height: 100%; display: flex; align-items: center;" >
			<span *ngIf="value">{{ 'EIM_ADMINS.LABEL_02307' | translate:lang }}</span>
			<span *ngIf="!value">{{ 'EIM_ADMINS.LABEL_02308' | translate:lang }}</span>
    </div>
    `,
    standalone: false
})

export class EIMCheckViewNoValuesRendererComponent implements AgRendererComponent {

	public params: any;

	/** 必須フラグ */
	public value: boolean;

	/**
	 * コンストラクタです.
	 */
	constructor() {}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.value = this.params.data[this.params.colDef.field];
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}
}
