import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';

/**
 * ロール名称レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMRoleNameRendererComponent
 */
@Component({
    selector: 'eim-role-name-renderer',
    template: `
		<div *ngIf="this.label" style="height: 100%; display: flex; align-items: center;">
    		<i class="fa fa-lg eim-icon-user" style="padding-left:3px; padding-right:3px;"></i>
    		<span *ngIf="this.params.data.typeName === 'user' && this.params.data.userDisable === 'on'" style="color: silver; padding-left:3px; padding-right:3px; word-break:break-all;">{{this.label}}</span>
    		<span *ngIf="this.params.data.typeName !== 'user' || this.params.data.userDisable !== 'on'" style="color: black; padding-left:3px; padding-right:3px; word-break:break-all;">{{this.label}}</span>
		</div>
    `,
    standalone: false
})

export class EIMRoleNameKanaRendererComponent implements OnInit, AgRendererComponent {

	public params: any;
	public label: string;

	public typeName: string;

	public userDisable: string;

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
		this.label = this.getLabel(params.data, params.colDef.field);
		this.userDisable = params.data.userDisable;
		this.typeName = params.data.typeName;
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
	/**
	 * ラベルを取得します.配列指定は未対応です.
	 * @param data データ
	 * @param field フィールド名
	 * @return ラベル
	 */
	private getLabel(data, field: string): string {
		let targetData = data;

		let fields: string[] = field.split('.');
		for (let i = 0; i < fields.length; i++) {
			targetData = targetData[fields[i]];
			if (targetData === undefined) {
				return '';
			}
		}

		return targetData;
	}
}
