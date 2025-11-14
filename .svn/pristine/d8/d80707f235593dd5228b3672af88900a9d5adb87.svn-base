import { Component, IterableDiffers, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * 有効期限レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMExpirationDateRendererComponent
 */
@Component({
    selector: 'eim-expiration-date-renderer',
    template: `
		<div class="eim-form-item" style="width: 100%; margin: 0px; height: 100%; display: flex; align-items: center;">
			<div class="eim-form-input" style="height: 100%; margin: 0px; display: flex; align-items: center;">
					<p-datepicker name="{{name}}"
							[class.ng-dirty]="formControls[0] && formControls[0].dirty" [class.ng-invalid]="formControls[0] && formControls[0].invalid"
							dateFormat="{{ 'EIM.CALENDAR.DATE_FORMAT' | translate }}" appendTo="body" selectOtherMonths="true"
							[showButtonBar]="true" [monthNavigator]="true" [yearNavigator]="true" [yearRange]="CALENDAR_YEAR_RANGE"
							[(ngModel)]="value[0]" [showIcon]="!disabled" [disabled]="disabled"
							(onClearClick)="onClickClear($event, 0)" (onSelect)="onSelect($event, 0)" (onInput)="onInput($event, 0)"></p-datepicker>
    	</div>
  	</div>
    `,
    standalone: false
})

export class EIMExpirationDateRendererComponent extends EIMInputFormItemComponent implements OnInit, AgRendererComponent {


	/** 無効かどうか */
	@Input() public disabled = false;

	/** フォームグループ */
	@Input() public form: UntypedFormGroup;

	/** 編集したかどうか */
	@Input() public dirty  = false;

	/** フォームコントローラの名前 */
	public name: string;
	/** ラベル */
	public label: string;
	/** 必須かどうか */
	public required: boolean;
	/** 最大文字数 */
	public maxLength: number;
	/** パターン */
	public pattern: string;
	/** 複数値属性かどうか */
	public multiple: boolean;
	/** 値 */
	public value: any[] = [];
	/** コード一覧 */
	public options: any[] = [];

	/** カレンダー年範囲 */
	public CALENDAR_YEAR_RANGE: string = EIMConstantService.CALENDAR_YEAR_RANGE;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected differs: IterableDiffers) {
		super(differs);
	}

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
		this.name = '';
		this.label = '';
		this.required = false;
		this.multiple = false;
		this.disabled = false;
	}
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.value = params.data[params.colDef.field];
		this.addFormControl(this.value);
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	onSelect(value, index) {
		if (!this.formControls[index]) {
			return;
		}
		// update the form
		this.value[index] = value;
		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();
	}

	onInput(value: any, index: number) {
		if (!this.formControls[index]) {
			return;
		}
		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();
	}

	/**
	 * クリアボタンクリックイベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onClickClear(value, index) {
		if (!this.formControls[index]) {
			return;
		}
		// update the form
		this.value[index] = '';
		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
