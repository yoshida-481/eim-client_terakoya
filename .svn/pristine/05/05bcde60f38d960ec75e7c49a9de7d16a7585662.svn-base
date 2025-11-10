import { Component, OnDestroy, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMPublicDestinationRendererComponentService } from 'app/documents/shared/components/renderer/public-destination-renderer.component.service';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';

/**
 * 公開通知先選択レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMPublicDestinationRendererComponent
 *
 */
@Component({
    selector: 'eim-public-destination-renderer',
    template: `
		<div style="overflow-y: auto; overflow-x: hidden; height: 100%" (dblclick)="onDoubleClick($event)">
			<div *ngFor="let test of params.value; let i = index;">
				<div style="display: flex; align-items: center;">
					<div style="height: 100%; width: 100%; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
						<div style="float:left;">
							<i class="fa {{getIcon(params, i)}}"></i>
							<label>{{test.entryName}}</label>
						</div>
					</div>
					<div align="right">
						<i class="fa fa-times" style="padding-right:5px;"  (click)="onIconClick($event, params, i)"></i>
					</div>
				</div>
			</div>
		</div>
	`,
    standalone: false
})
export class EIMPublicDestinationRendererComponent implements AgRendererComponent {

	// パラメータ
	public params: any;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected rendererComponentService: EIMPublicDestinationRendererComponentService
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
	 * @param event イベント
	 * @param params パラメータ
	 * @param index 対象の公開通知先のインデックス
	 */
	onIconClick(event: any, params: any, index: number) {
		this.rendererComponentService.deleteItem(params.data.objId, params.data.destination[index].entryId);
	}

	/**
	 * レンダラーダブルクリックのイベントハンドラです.
	 * @param event イベント
	 */
	onDoubleClick(event: any) {
		this.rendererComponentService.doubleClickItem();
	}

	/**
	 * アイコンを取得します.
	 * @param params パラメータ
	 * @param index 対象の公開通知先のインデックス
	 */
	getIcon(params: any, index: number): string {

		let rtIcon = '';

		 if ( params.data.destination.length > 0 ) {

				switch (params.data.destination[index].entryTypeId) {
					case EIMDocumentsConstantService.ENTRY_TYPE_USER:
						rtIcon = 'eim-icon-user';
						break;
					case EIMDocumentsConstantService.ENTRY_TYPE_GROUP:
						rtIcon = 'eim-icon-group';
						break;
					case EIMDocumentsConstantService.ENTRY_TYPE_ROLE:
						rtIcon = 'eim-icon-role';
						break;
					case EIMDocumentsConstantService.ENTRY_TYPE_COMPLEX_GROUP:
						rtIcon = 'eim-icon-complex-group';
						break;
				}
		}

		return rtIcon;
	}
}
