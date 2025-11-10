import {
	Component,
	ComponentRef,
	ComponentFactory,
	EventEmitter,
	NgModule,
	OnInit,
	OnDestroy,
	ViewContainerRef,
	SimpleChange,
	OnChanges,
	Input,
	ViewChild,
	AfterViewInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMSearchMasterDisplayConfigDomain } from 'app/shared/domains/search-master-display-config.domain';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAttributeInputFormItemComponent } from '../../../shared/components/attribute-input-form-item/attribute-input-form-item.component';

/**
 *
 * 属性入力コンポーネントです。<br/>
 * @class EIMAttributeInputFormItemComponent
 * @module EIMSharedComponentModule
 * @constructor
 * @example
 *      <eim-documents-attribute-input-form-item
 *          [form]="form"
 *          [(attribute)]="attribute"
 *          [(attributeTypeLayout)]="attributeTypeLayout"
 *          [disable]="false"
 *          [dirty]="false"
 *          [statusTypeId]="statusTypeId">
 *      </eim-documents-attribute-input-form-item>
 */
@Component({
    selector: 'eim-documents-attribute-input-form-item',
    templateUrl: './documents-attribute-input-form-item.component.html',
    styleUrls: ['./documents-attribute-input-form-item.component.css'],
    standalone: false
})
export class EIMDocumentsAttributeInputFormItemComponent extends EIMAttributeInputFormItemComponent implements OnInit {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
	) {
		super(translateService);
	}

}
