import { Component, OnDestroy, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * 通知タイプレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMPublicNotificationTypeRendererComponent
 */
@Component({
    selector: 'eim-public-notification-type-renderer',
    template: `
			<div class="p-grid eim-notification-type-renderer eim-form-item" style="display: grid;">
				<div class="p-col-12" style="padding: 0em; display: contents;">
					<eim-radio-button name="{{params.data.id}}" label="{{ 'EIM.LABEL_02034' | translate }}" value="0" [(ngModel)]="selectedValue" (ngModelChange)="onSelectChange()"></eim-radio-button>
				</div>
				<div class="p-col-12" style="padding: 0em; display: contents;">
					<eim-radio-button name="{{params.data.id}}" label="{{ 'EIM.LABEL_02035' | translate }}" value="1" [(ngModel)]="selectedValue" (ngModelChange)="onSelectChange()"></eim-radio-button>
				</div>
				<div class="p-col-12" style="padding: 0em; display: contents;">
					<eim-radio-button name="{{params.data.id}}" label="{{ 'EIM.LABEL_02036' | translate }}" value="2" [(ngModel)]="selectedValue" (ngModelChange)="onSelectChange()"></eim-radio-button>
				</div>
			</div>
		`,
    styles: [`
			::ng-deep .eim-notification-type-renderer {
				display: flex;
				align-items: center;
				height: 100%;
				margin: 0px;
			}
			::ng-deep .eim-notification-type-renderer .p-radiobutton-box {
				opacity: 1;
				background-color: #ffffcc;
			}
			::ng-deep .eim-notification-type-renderer div.p-radiobutton.p-disabled .p-radiobutton-box {
				opacity: 1;
				background-color: #eeeeee;
			}
			::ng-deep .eim-notification-type-renderer .p-radiobutton-icon {
				font-size: 7px;
			}
		`],
    standalone: false
})
export class EIMPublicNotificationTypeRendererComponent implements AgRendererComponent {

	/** パラメータ */
	public params: any;
	/** 選択値 */
	public selectedValue = '2';

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		if (!params.data.sendNotifyMailTiming && params.data.sendNotifyMailTiming !== 0) {
			// 初期表示時
			this.params.data.sendNotifyMailTiming = this.selectedValue;
		} else {
			// 画面リフレッシュ時
			this.selectedValue = params.data.sendNotifyMailTiming;
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
	 * 選択変更時の処理です.
	 */
	onSelectChange(): void {
		this.params.data.sendNotifyMailTiming = this.selectedValue;
	}
}
