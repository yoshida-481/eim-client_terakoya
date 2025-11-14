import { EventEmitter, Output } from '@angular/core';
import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';

/**
 * 場所レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMPlaceRendererComponent
 *
 */
@Component({
    selector: 'eim-place-renderer',
    template: `
		<div pTooltip="{{params.value}}" style="height: 100%; display: flex; align-items: center;">
    <i class="fa fa-lg eim-icon-folder eim-icon-folder-color" style="padding-left:3px; padding-right:3px;"></i>
    <a *ngIf="isLink" href="#" style="padding-left:3px; padding-right:3px;" (click)="onClick($event, params)">{{params.data.path}}</a>
    <div *ngIf="!isLink" style="padding-left:3px; padding-right:3px;">{{params.data.path}}</div>
		</div>
    `,
    standalone: false
})
export class EIMPlaceRendererComponent implements AgRendererComponent {
	/** パラメータ */
	public params: any;

	/** リンクにするかどうか */
	public isLink = true;

	/**
	 * コンストラクタです.
	 */
	constructor(private placeRendererComponentService: EIMPlaceRendererComponentService) {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * EIMDataGridColumnにparam:{isLink: false}とすることで非リンク表示が可能です.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;

		// 拡張パラメータを取得
		let targetColumn: any;
		for (let i = 0; i < this.params.context.columns.length; i++) {
			let column: any = this.params.context.columns[i];
			if (params.column.colDef.field !== column.field
					|| params.column.colDef.headerName !== column.headerName) {
				continue;
			}

			if (column.param && !column.param.isLink) {
				this.isLink = false;
			}
		}
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * クリックイベントのハンドラです.
	 * @param event イベント
	 * @param params 行データ
	 */
	onClick(event, params) {
		event.preventDefault();
		this.placeRendererComponentService.clicked(this.params.data);
	}

}
