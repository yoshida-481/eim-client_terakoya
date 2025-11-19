import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * 複製レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMEntryTypeRendererComponent
 */
@Component({
    selector: 'eim-entry-type-renderer',
    template: `
    <div align="left" style="height: 100%; display: flex; align-items: center;">
			<span *ngIf="value === 'user' && isUserDisabled" style="color: silver;">{{ 'EIM.LABEL_02017' | translate }}</span>
			<span *ngIf="value === 'user' && !isUserDisabled">{{ 'EIM.LABEL_02017' | translate }}</span>
			<span *ngIf="value === 'group'">{{ 'EIM.LABEL_02003' | translate }}</span>
			<span *ngIf="value === 'role'">{{ 'EIM.LABEL_02004' | translate }}</span>
			<span *ngIf="value === 'compGroup'">{{ 'EIM.LABEL_02018' | translate }}</span>
			<span *ngIf="value === 'userDefGroup'">{{ 'EIM.LABEL_02043' | translate }}</span>
			<span *ngIf="value === 'system'">{{ 'EIM.LABEL_02055' | translate }}</span>
			<span *ngIf="value === 'objectRole'">{{ 'EIM.LABEL_02054' | translate }}</span>
    </div>
    `,
    standalone: false
})

export class EIMEntryTypeRendererComponent implements AgRendererComponent {

	public params: any;

	/** 必須フラグ */
	public value: string;

	/** ユーザーが無効かどうか */
	public isUserDisabled: boolean = false;

	/**
	 * コンストラクタです.
	 */
	constructor(	) {}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.value = this.params.data[this.params.colDef.field];
		// ユーザーの場合、無効フラグをチェック
		if (this.value === 'user' || this.value === 'USER' || this.value === '1') {
			this.isUserDisabled = (this.params.data.userDisable === 'on' || this.params.data.userDisable === '1');
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
}
