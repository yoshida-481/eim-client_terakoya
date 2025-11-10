import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';

/**
 * 数値レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMNumberRendererComponent
 */
@Component({
    selector: 'eim-number-renderer',
    template: `
		<table style="width: 100%"><tr><td style="vertical-align: middle; align: right">
			{{this.label}}
		</td></tr></table>
    `,
    standalone: false
})

export class EIMNumberRendererComponent implements OnInit, AgRendererComponent {

	private params: any;
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
