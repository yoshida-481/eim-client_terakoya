import { EventEmitter, Output } from '@angular/core';
import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMTagNameRendererComponentService } from 'app/documents/shared/components/renderer/tag-name-renderer.component.service';

/**
 * タグ名称レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMTagNameRendererComponent
 *
 */
@Component({
    selector: 'eim-tag-name-renderer',
    template: `
		<div style="height: 100%; display: flex; align-items: center;">
			<i class="fa eim-icon-tag eim-icon-tag-color fa-lg" style="padding-left:3px; padding-right:3px;"></i>
			<a href="#" style="padding-left:3px; padding-right:3px;" (click)="onClick($event, params)"><pre>{{label}}</pre></a>
		</div>
    `,
    standalone: false
})
export class EIMTagNameRendererComponent implements AgRendererComponent {
	public params: any;
	public label: string;

	constructor(private tagNameRendererComponentService: EIMTagNameRendererComponentService, ) {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = params.data[params.colDef.field];
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
	 * タグ名クリック時のイベントハンドラ.
	 * @param event イベント
	 * @param params パラメータ
	 */
	onClick(event, params) {
		event.preventDefault();
		this.tagNameRendererComponentService.clicked(this.params.data);
	}

}
