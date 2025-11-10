import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';

/**
 *
 * 属性リスト入力コンポーネントです。<br/>
 * @example
 *      <eim-attribute-list
 *          [form]="form"
 *          [(attributes)]="attributes"
 *          [disable]="false">
 *      </eim-attribute-list>
 */
@Component({
    selector: 'eim-attribute-list',
    templateUrl: './attribute-list.component.html',
    styleUrls: ['./attribute-list.component.css'],
    standalone: false
})
export class EIMAttributeListComponent implements OnInit {

	/** 属性 */
	@Input() public attributes: EIMAttributeDomain[] = [];

	/** フォームグループ */
	@Input() public form: UntypedFormGroup;

	/** 定数クラス */
	public Const: EIMConstantService = EIMConstantService;

	/** コード型用の選択対象のリスト */
	public optionsList: any[];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
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

		// コード型用の選択対象を設定
		this.optionsList = [];
		for (let i = 0; i < this.attributes.length; i++) {
			let options: any[] = [];
			if (this.attributes[i].attributeType.codeType) {
				// 未選択用の選択対象を追加
				options.push({label: '　', value: null});

				// コードの選択対象を追加
				let codeList: EIMCodeDomain[] = this.attributes[i].attributeType.codeType.codeList;
				for (let j = 0; j < codeList.length; j++) {
					options.push({label: codeList[j].name, value: codeList[j]});
				}
			}
			this.optionsList.push(options);
		}

	}
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
