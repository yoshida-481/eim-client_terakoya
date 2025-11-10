import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMCompareFileNameRendererComponentService } from 'app/documents/shared/components/renderer/compare-file-name-renderer.component.service';


/**
 * 公開ファイル比較結果ファイル名称レンダラーコンポーネント
 * @example
 *      cellRendererFramework: EIMCompareFileNameRendererComponent
 */
@Component({
    selector: 'eim-compare-file-name-renderer',
    template: `
	<div style="height: 100%; display: flex; align-items: center;">
		<i class="fa {{getIcon(params.data)}} fa-lg" style="padding-left:3px; padding-right:3px;"></i>
		<a href="#" style="padding-left:3px; padding-right:3px; color: #0044CC;" (click)="onClick($event, params)"><pre>{{label}}</pre></a>
	</div>
	`,
    standalone: false
})
export class EIMCompareFileNameRendererComponent implements AgRendererComponent {
public params: any;
public label: string;

/**
 * コンストラクタです.
 */
constructor(
		private compareFileNameRendererComponentService: EIMCompareFileNameRendererComponentService,
		private serverConfigService: EIMServerConfigService,
		private fileService: EIMFileService,
) {
}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = this.compareFileNameRendererComponentService.getLabel(this.params.value);
		for (let i = 0; i < this.params.context.columns.length; i++) {
			let column: any = this.params.context.columns[i];
			if (params.column.colDef.field !== column.field
					|| params.column.colDef.headerName !== column.headerName) {
				continue;
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
	 * リンククリックイベントハンドラ
	 * @param event イベント
	 * @param params パラメータ
	 */
	onClick(event, params) {
		// リンククリックイベントのバブリングを止める（選択行クリックでセルが編集状態になるため）
		event.preventDefault();
		event.stopPropagation();
		// ダウンロード
		this.fileService.downloadMyDocument(params.data.objId);
	}

	/**
	 * アイコンを取得する.
	 * @param value オブジェクト名称
	 * @return アイコンクラス
	 */
	public getIcon(value: any): string {
		return this.compareFileNameRendererComponentService.getIcon(value);
	}

}
