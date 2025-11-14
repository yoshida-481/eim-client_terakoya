import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * グループ名、または、ロール名をアイコン付きで表示するレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMGroupOrRoleNameRendererComponent
 */
@Component({
    selector: 'eim-group-or-role-name-renderer',
    template: `
		<div *ngIf="this.params.data.groupName" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-group" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.entryName}}</span>
		</div>
		<div *ngIf="this.params.data.roleName" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-role" style="padding-left:3px; padding-right:3px;"></i>
    		<span style="padding-left:3px; padding-right:3px;">{{this.params.data.entryName}}</span>
		</div>
    `,
    standalone: false
})

export class EIMGroupOrRoleNameRendererComponent implements OnInit, AgRendererComponent {

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
		if (Number(params.data.entryTypeId) === EIMConstantService.ENTRY_TYPE_GROUP) {
			params.data['groupName'] = params.data.entryName;
		} else if (Number(params.data.entryTypeId) === EIMConstantService.ENTRY_TYPE_ROLE) {
			params.data['roleName'] = params.data.entryName;
		}
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
