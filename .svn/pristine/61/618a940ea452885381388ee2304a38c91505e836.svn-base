import { Component, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit, DoCheck, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AgRendererComponent } from 'ag-grid-angular';
import { EIMLumpDocumentsCheckinRendererComponentService } from 'app/documents/shared/components/renderer/lump-documents-checkin-renderer.component.service';

namespace uploadStatusNumber {
	export const CAN_UPLOAD = 0;
	export const CANNOT_UPLOAD = 1;
	export const NOT_CHECKED = 2;
	export const DISABLED_CHECKED = 3;
	export const CHECKED = 5;
}

/**
 * チェックインレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMLumpDocumentsCheckinRendererComponent
 */
@Component({
    selector: 'eim-lump-documents-checkin-renderer',
    template: `
			<div class="eim-form-item" style="width: 100%;">
				<div class="eim-form-input" >
			    <div style="padding-left: 43px; display: flex; align-items: center;" >
						<eim-checkbox *ngIf="this.params.data.uploadStatus == 5 || this.params.data.uploadStatus == 2"  [(ngModel)]="checked" binary="true" (onChange)="onChange($event, 0)"></eim-checkbox>
						<eim-checkbox *ngIf="this.params.data.uploadStatus == 3" name="checkin3" [(ngModel)]="checked" binary="true" disabled="false" (onChange)="clickedCheck()"></eim-checkbox>
						<span *ngIf="this.params.data.uploadStatus == 1" class="eim-icon-cancel" style="color: #FF0000;" pTooltip="{{toolTipString}}"></span>
						<span *ngIf="this.params.data.uploadStatus == 0" class="eim-icon-checkin" style="color: #0d98ed;" ></span>
			    </div>
    	</div>
		</div>
    `,
    standalone: false
})
export class EIMLumpDocumentsCheckinRendererComponent implements OnInit, DoCheck, AgRendererComponent {


	public params: any;

	/** フォームグループ */
	@Input() public checkin: boolean;

	/** 編集したかどうか */
	@Input() public dirty = false;

	/** 無効かどうか */
	public checked = true;

	/** 登録不可メッセージ */
	public toolTipString = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected lumpDocumentsCheckinRendererComponentService: EIMLumpDocumentsCheckinRendererComponentService,
	) {}

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
		if (this.params.data.uploadStatus === uploadStatusNumber.CHECKED ) {
			this.checked = true;
		}
		if (this.params.data.uploadStatus === uploadStatusNumber.NOT_CHECKED ) {
			this.checked = false;
		}

		this.toolTipString = this.getErrorMessage();
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onChange(event, index) {
		if ( event.checked ) {
			this.params.data.uploadStatus = uploadStatusNumber.CHECKED;
		}	else {
			this.params.data.uploadStatus = uploadStatusNumber.NOT_CHECKED;
		}
		this.clickedCheck();
	}

	/**
	 * 変更検知後イベントハンドラ.
	 */
	ngDoCheck() {
		if (this.params.data.uploadStatus === uploadStatusNumber.CHECKED ) {
			this.checked = true;
		}
		if (this.params.data.uploadStatus === uploadStatusNumber.NOT_CHECKED ) {
			this.checked = false;
		}
	}

	/**
	 * チェンジエミッタをエミットします.
	 */
	clickedCheck() {
		this.lumpDocumentsCheckinRendererComponentService.checkChanged(this.params.data);
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
	 * エラーメッセージを取得します.
	 * @return エラーメッセージ
	 */
	public getErrorMessage(): string {
		if (this.params.data.reason) {
			return this.params.data.reason;
		}
		return '';
	}

}
