import {
	Component,
	OnInit,
	Input,
	ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMHostingTemplateDirective } from 'app/shared/directives/hosting-template/hosting-template.directive';

import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';

/**
 *
 * 属性入力コンポーネントです。<br/>
 * @class EIMAttributeInputFormItemComponent
 * @module EIMSharedComponentModule
 * @constructor
 * @example
 *      <eim-attribute-input-form-item
 *          [form]="form"
 *          [(attribute)]="attribute"
 *          [(attributeTypeLayout)]="attributeTypeLayout"
 *          [disable]="false"
 *          [dirty]="false"
 *          [statusTypeId]="statusTypeId">
 *      </eim-attribute-input-form-item>
 */
@Component({
	selector: 'eim-input-form-item-list',
	templateUrl: './input-form-item-list.component.html',
	styleUrls: ['./input-form-item-list.component.scss'],
	standalone: false,
})
export class EIMInputFormItemListComponent implements OnInit {

	/** 属性レイアウト */
	@Input() public inputFormItems: EIMInputFormItemDomain[] = null;

	/** フォームグループ */
	@Input() public form: FormGroup;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
	) { }

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

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}