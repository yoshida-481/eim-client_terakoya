import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';

/**
 * グループ名称レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMGroupNameRendererComponent
 */
@Component({
    selector: 'eim-group-name-renderer',
    template: `
		<div *ngIf="this.params.data.typeName === 'user' && this.params.data.groupName" style="height: 100%; display: flex; align-items: center;" pTooltip="{{ this.params.data.groupName }}">
    		<i class="fa fa-lg eim-icon-group" style="padding-left:3px; padding-right:3px;"></i>
    		<span *ngIf="this.params.data.typeName === 'user' && this.params.data.userDisable === 'on'" style="color: silver; padding-left:3px; padding-right:3px; word-break:break-all;" >{{this.params.data.groupName}}</span>
    		<span *ngIf="this.params.data.typeName === 'user' && this.params.data.userDisable === 'off'" style="color: black; padding-left:3px; padding-right:3px; word-break:break-all;" >{{this.params.data.groupName}}</span>
		</div>
    `,
    standalone: false
})

export class EIMGroupNameRendererComponent implements OnInit, AgRendererComponent {

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
