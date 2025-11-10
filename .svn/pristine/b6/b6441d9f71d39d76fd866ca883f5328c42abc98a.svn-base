import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMObjectEditorsUserService } from 'app/object-editors/shared/services/apis/object-editors-user.service';
import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { EIMFileNameLinkRendererComponentService } from 'app/object-editors/shared/components/renderer/file-name-link-renderer.component.service';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';

/**
 * ファイル名リンクレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMFileNameLinkRendererComponent
 */
@Component({
    selector: 'eim-file-name-link-renderer',
    template: `
	<div *ngIf="params.data.objName" style="height: 100%; display: flex; align-items: center;">
	<i class="fa {{getIcon(params.data)}} fa fa-lg" style="padding-left:3px; padding-right:3px;"></i>
	<a *ngIf="showLink" href="#" style="padding-left:3px; padding-right:3px; color: #0044CC;" (click)="onClick($event, params)"><pre>{{label}}</pre></a>
	<span *ngIf="!showLink" href="#" style="padding-left:3px; padding-right:3px;">{{params.value}}</span>
</div>
	`,
    standalone: false
})
export class EIMFileNameLinkRendererComponent implements AgRendererComponent {

	/** パラメータ */
	public params: any;
	public showLink = true;
	public label: string;
	/**
	 * コンストラクタです.
	 */
	constructor(
		private fileNameLinkRendererComponentService: EIMFileNameLinkRendererComponentService,
		private objectEditorsObjectService: EIMObjectEditorsObjectService,
	) {}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = this.fileNameLinkRendererComponentService.getLabel(this.params.value);
		// フィールド情報がファイルの時だけリンクにする
		for (let i = 0; i < this.params.context.columns.length; i++) {
			let column: any = this.params.context.columns[i];
			if (params.column.colDef.field !== column.field
					|| params.column.colDef.headerName !== column.headerName) {
				continue;
			}

			if (column.param && !column.param.isLink) {
				this.showLink = false;
			}
		}
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
		this.objectEditorsObjectService.filedownload(params.data.formatId, params.data.objId);
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
	 * アイコンを取得する.
	 * @param value オブジェクト名称
	 * @return アイコンクラス
	 */
	public getIcon(value: string): string {
		return this.fileNameLinkRendererComponentService.getIcon(value);
	}
}
