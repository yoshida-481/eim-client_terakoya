import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';


/**
 * フォーマットステータスレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMFormatStatusRendererComponent
 */
@Component({
    selector: 'eim-format-status-renderer',
    template: `
    <div style="height: 100%; display: flex; align-items: center;">
			<span *ngIf="this.params.data.status == this.onlineValue" style="color: red;">{{this.onlineLabel}}</span>
			<span *ngIf="this.params.data.status == this.offlineValue" style="color: blue;">{{this.offlineLabel}}</span>
    </div>
    `,
    standalone: false
})

export class EIMFormatStatusRendererComponent implements OnInit, AgRendererComponent {

	public params: any;

	/** ステータ表示文言 */
	public onlineLabel = EIMAdminsConstantService.DIR_STATUS_ONLINE_LABEL;
	public offlineLabel = EIMAdminsConstantService.DIR_STATUS_OFFLINE_LABEL;

	/** ステータ値 */
	public onlineValue = EIMAdminsConstantService.DIR_STATUS_ONLINE_VALUE;
	public offlineValue = EIMAdminsConstantService.DIR_STATUS_OFFLINE_VALUE;

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
