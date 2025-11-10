import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
/**
 * ステータスレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMFormatStatusRendererComponent
 */
@Component({
    selector: 'eim-workflow-creator-event-skip-renderer',
    template: `
    <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
			<span class="fa fa-fw fa-caret-right fa-2x" style="width:27px; height:25px display: contents;"></span>
    </div>
    `,
    standalone: false
})

export class EIMWorkflowCreatorEventSkipRendererComponent implements OnInit, AgRendererComponent {

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
