import {
	Component,
	OnInit,
	Input,
	ViewChild,
	ComponentFactoryResolver,
	ComponentRef,
	Output,
	EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMHostingTemplateDirective } from 'app/shared/directives/hosting-template/hosting-template.directive';

import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMInputFormItemComponent, EIMInputFormItemComponentChangedEmitValueDomain } from '../input-form-item/input-form-item.component';
import { EIMInputFormItemComponentService } from '../input-form-item/input-form-item.component.service';
import { Subscription } from 'rxjs';

/**
 * 属性入力コンポーネントのリゾルバです。<br/>
 * @class EIMAttributeInputFormItemComponent
 * @module EIMSharedComponentModule
 * @constructor
 * @example
 *      <eim-input-form-item-resolver
 *          [form]="form"
 *          [inputFormItem]="inputFormItem"
 *          [inputFormItemComponentServices]="inputFormItemComponentServices"
 *          (changed)="onChanged($event)">
 *      </eim-input-form-item-resolver>
 */
@Component({
	selector: 'eim-input-form-item-resolver',
	templateUrl: './input-form-item-resolver.component.html',
	styleUrls: ['./input-form-item-resolver.component.scss'],
	standalone: false,
	
})
export class EIMInputFormItemResolverComponent implements OnInit {

	@ViewChild(EIMHostingTemplateDirective, {static: true}) template!: EIMHostingTemplateDirective;

	/** 属性レイアウト */
	@Input() public inputFormItem: EIMInputFormItemDomain = null;

	/** フォームグループ */
	@Input() public form: FormGroup;

	/** 入力コンポーネントサービスリスト */
	@Input() public inputFormItemComponentServices: EIMInputFormItemComponentService[] = null;

	/** 選択値変更イベントエミッタ */
	@Output() public changed: EventEmitter<EIMInputFormItemComponentChangedEmitValueDomain> =
			new EventEmitter<EIMInputFormItemComponentChangedEmitValueDomain>();

	/** 変更イベントのサブスクリプション */
	protected inputFormItemChangedSubscription: Subscription;


	public componentRef: ComponentRef<EIMInputFormItemComponent> | null = null;
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected resolver: ComponentFactoryResolver
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
		const viewContainerRef = this.template.viewContainerRef;
		viewContainerRef.clear();

		for (let inputFormItemComponentService of this.inputFormItemComponentServices) {

			// 表示対象外は無視
			if (!inputFormItemComponentService.visibleFunction(this.inputFormItem)) {
				continue;
			}

			// 入力フォームコンポーネント初期化
			let factory = this.resolver.resolveComponentFactory(inputFormItemComponentService.getComponent());
			this.componentRef = viewContainerRef.createComponent<EIMInputFormItemComponent>(factory);
			this.componentRef.instance.form = this.form;
			inputFormItemComponentService.initializeComponent(this.componentRef.instance, this.inputFormItem);

			break;
		}

		// if (this.componentRef == null) {
		// 	console.log('表示対象外');
		// 	console.log(this.inputFormItem);
		// }

		if (this.componentRef) {
			// 入力フォームの値変更イベントエミッタを親コンポーネントに伝搬
			this.inputFormItemChangedSubscription = this.componentRef.instance.changed.subscribe(
				(event: EIMInputFormItemComponentChangedEmitValueDomain) => {
					this.changed.emit(event);
				}
			);
		}
	}
	getDynamicComponentInstance(): EIMInputFormItemComponent | null {
		return this.componentRef ? this.componentRef.instance : null;
	  }
	  
	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (this.inputFormItemChangedSubscription) {
			if (!this.inputFormItemChangedSubscription.closed) { this.inputFormItemChangedSubscription.unsubscribe(); }
		}
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}