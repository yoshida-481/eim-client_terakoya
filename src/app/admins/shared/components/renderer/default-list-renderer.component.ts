import { TranslateService } from '@ngx-translate/core';
import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, Input, Output, OnInit } from '@angular/core';

import { AgRendererComponent } from 'ag-grid-angular';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
/**
 * 初期値リストレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMDefaultListRendererComponent
 */
@Component({
    selector: 'eim-default-list-renderer',
    template: `
		<div pTooltip="{{title}}" tooltipPosition="bottom" align="left" style="height:100%; display: flex; align-items: center;" >
			<label style="display: block; width: 100%;">{{value}}</label>
    </div>
    `,
    standalone: false
})

export class EIMDefaultListRendererComponent implements AgRendererComponent {

	public params: any;

	public value = '';

	public title = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
	) {}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		let list = [];
		if (Array.isArray(this.params.data.initValueList) && this.params.data.initValueList.length !== 0 && this.params.data.initValueList[0] !== '') {
			list = this.params.data.initValueList;
		} else if (Array.isArray(this.params.data.defValueList)) {
			list = this.params.data.defValueList;
		}
		for ( let i = 0; i < list.length; i++ ) {
			if (params.data.valTypeId === EIMAdminsConstantService.VALUE_TYPE_USER && list[i] === EIMConstantService.ATTRIBUTE_DEFAULT_VALUE_LOGIN_USER) {
				list[i] = this.translateService.instant('EIM_ADMINS.LABEL_02100');
			}
		  if ( i === 0 ) {
				this.value += list[i];
				this.title += list[i];
			} else {
				this.value += EIMAdminsConstantService.DELIMITER_PIPE + list[i];
				this.title += EIMAdminsConstantService.NEW_LINE_SEPARATER + list[i];
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

}
