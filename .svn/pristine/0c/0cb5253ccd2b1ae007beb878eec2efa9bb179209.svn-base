import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * ユーザ名称レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMUserNameRendererComponent
 */
@Component({
    selector: 'eim-user-name-renderer',
    template: `
		<div *ngIf="this.params.colDef.field === 'name' && this.params.data.name" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-user" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.name}}</span>
		</div>
		<div *ngIf="this.params.colDef.field === 'groupNames' && this.params.data.groupNames" style="height: 100%;
			display: flex; align-items: center;" pTooltip="{{params.value}}" tooltipPosition="bottom">
			<i class="fa fa-lg eim-icon-group" style="padding-left:3px; padding-right:3px;"></i>
			<span style="padding-left:3px; padding-right:3px;">{{this.params.data.groupNames}}</span>
		</div>
		<div *ngIf="this.params.colDef.field === 'roleNames' && this.params.data.roleNames" style="height: 100%;
			display: flex; align-items: center;" pTooltip="{{params.value}}" tooltipPosition="bottom">
			<i class="fa fa-lg eim-icon-role" style="padding-left:3px; padding-right:3px;"></i>
			<span style="padding-left:3px; padding-right:3px;">{{this.params.data.roleNames}}</span>
		</div>
    `,
    standalone: false
})

export class EIMUserNameRendererComponent implements AgRendererComponent {

	public params: any;

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
