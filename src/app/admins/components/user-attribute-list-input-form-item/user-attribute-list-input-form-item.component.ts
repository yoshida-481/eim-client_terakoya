import { EIMUserAttributeDTO } from 'app/admins/shared/dtos/user-attribute.dto';
import { Component, Input, } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 *
 * ユーザ属性リスト入力コンポーネント
 * @example
 *      <eim-user-attribute-list-input-form-item
 *          [(attributeList)]="attributeList"
 *          [form]="form">
 *      </eim-user-attribute-list-input-form-item>
 */
@Component({
    selector: 'eim-user-attribute-list-input-form-item',
    templateUrl: './user-attribute-list-input-form-item.component.html',
    styleUrls: ['./user-attribute-list-input-form-item.component.css'],
    standalone: false
})
export class EIMUserAttributeListInputFormItemComponent {

	/** 属性配列 */
	@Input() public attributeList: EIMUserAttributeDTO[];
	/** フォームグループ */
	@Input() public form: UntypedFormGroup;

	/** pTooltipで表示する非省略ラベル文言が必要かどうか */
	@Input() public pTooltipLabelFlg = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}
}
