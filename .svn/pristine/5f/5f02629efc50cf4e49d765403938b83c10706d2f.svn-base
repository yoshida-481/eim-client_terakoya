import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';

/**
 * システム管理名称レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMAdminNameRendererComponent
 */
@Component({
    selector: 'eim-admin-name-renderer',
    template: `
		<div *ngIf="this.params.data.typeName == 'format'" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-format" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.typeLabel}}</span>
		</div>
		<div *ngIf="this.params.data.typeName == 'directory'" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-folder eim-icon-folder-color" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.typeLabel}}</span>
		</div>
		<div *ngIf="this.params.data.typeName == 'workspace'" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-workspace eim-icon-workspace-color" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.typeLabel}}</span>
		</div>
		<div *ngIf="this.params.data.typeName == 'attributeType'" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-attribute" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.typeLabel}}</span>
		</div>
		<div *ngIf="this.params.data.typeName == 'workspaceForm'" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-form-workspace" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.typeLabel}}</span>
		</div>
		<div *ngIf="this.params.data.typeName == 'security'" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa-fw fa-lg eim-icon-security" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.typeLabel}}</span>
		</div>
		<div *ngIf="this.params.data.typeName == 'relation'" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-relation" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.typeLabel}}</span>
		</div>
		<div *ngIf="this.params.data.typeName == 'user' && this.params.data.typeLabel" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-user" style="padding-left:3px; padding-right:3px;"></i>
    		<span *ngIf="this.params.data.typeName === 'user' && this.params.data.userDisable === 'on'" style="color: silver; padding-left:3px; padding-right:3px; word-break:break-all;">{{this.params.data.typeLabel}}</span>
    		<span *ngIf="this.params.data.typeName === 'user' && this.params.data.userDisable === 'off'" style="color: black; padding-left:3px; padding-right:3px; word-break:break-all;">{{this.params.data.typeLabel}}</span>
		</div>
    `,
    standalone: false
})

export class EIMAdminNameRendererComponent implements OnInit, AgRendererComponent {

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
