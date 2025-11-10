import { Component, OnDestroy, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMSelectorClearRendererComponentService } from 'app/documents/shared/components/renderer/selector-clear-renderer.component.service';

/**
 * 選択クリアレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMSelectorClearRendererComponent
 */
@Component({
    selector: 'eim-selector-clear-renderer',
    template: `
			<div style="display: flex; align-items: center;">
				<div style="height: 100%; width: 100%; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
					<label style="float:left;">{{params.value}}</label>
				</div>
				<div align="right">
					<i class="fa fa-times" style="padding-right:5px;"  (click)="onIconClick($event, params)"></i>
				</div>
			</div>
		`,
    standalone: false
})
export class EIMSelectorClearRendererComponent implements AgRendererComponent {

	/** 削除イベントエミッタ */
	@Output() public deleted: EventEmitter<any> = new EventEmitter<any>();

	/** パラメータ */
	public params: any;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected rendererComponentService: EIMSelectorClearRendererComponentService
	) {
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

	/**
	 * アイコンクリックのイベントハンドラです.
	 */
	onIconClick(event, params) {
		this.rendererComponentService.deleteItem(params.data.attTypeId);
	}
}
