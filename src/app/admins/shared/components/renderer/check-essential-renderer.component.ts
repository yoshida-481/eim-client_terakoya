import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
/**
 * 必須項目レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMCheckEssentialRendererComponent
 */
@Component({
    selector: 'eim-check-essential-renderer',
    template: `
    <div align="center" style="height: 100%; display: flex; align-items: center;" >
			<span>{{this.value}}</span>
    </div>
    `,
    standalone: false
})

export class EIMCheckEssentialRendererComponent implements AgRendererComponent {

	/** 必須項目表示 */
	public value: string;

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
		this.value = params.value === true ? '〇' : '×';
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
