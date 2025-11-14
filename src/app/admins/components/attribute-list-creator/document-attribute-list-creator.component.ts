import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAttributeDefaultComponent } from 'app/admins/components/attribute-default/attribute-default.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMListValueDTO } from 'app/admins/shared/dtos/list-value.dto';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { EIMListValueDomain } from 'app/shared/domains/list-value.domain';

/**
 * 属性値リスト値登録コンポーネント
 * @example
 *
 *      <eim-document-attribute-list-creator
 *        [attribute]="attribute">
 *      </eim-document-attribute-list-creator>
 */
@Component({
  selector: 'eim-document-attribute-list-creator',
  templateUrl: './document-attribute-list-creator.component.html',
  styleUrls: ['./document-attribute-list-creator.component.css'],
  providers: [
    {provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentAttributeListCreatorComponent)}
  ],
  standalone: false,
})

export class EIMDocumentAttributeListCreatorComponent implements OnInit, EIMCreatable {
	/** リスト値登録フォーム */
	@ViewChild('listValueCreatorForm', { static: true }) listValueCreatorForm: NgForm;

	/** 対象属性タイプ */
	@Input() attribute: EIMAttributeTypeDTO;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 数値型最大文字数 */
	public numberMaxLength: number = EIMConstantService.NUMBER_MAX_LENGTH;
	/** 文字列型最大文字数 */
	public stringMaxLength: number = EIMConstantService.STRING_MAX_LENGTH;
	/** 数値型パターン */
	public numberPattern: string =  EIMConstantService.NUMBER_PATTERN;
	/** 実数型パターン */
	public realPattern: string =  EIMConstantService.REAL_PATTERN;

	/** リスト値 */
	@ViewChild('listValueName', { static: true }) listValueName: EIMAttributeDefaultComponent;

	/** 対象タイプ */
	public valTypeId = EIMAdminsConstantService.VALUE_TYPE_INTEGER;

	/** 表示色指定フラグ */
	public checkColor = false;

	/** 複数値フラグ */
	public multiple = true;

	/** 色 */
	public color = EIMAdminsConstantService.INIT_COLOR_CODE;

	/** カラーピッカー配置場所（PrimeNGのバグで未指定にしないと配置できない） */
	public colorPickerArea;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected attributeService: EIMAdminAttributeService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リスト値を登録します.
	 */
	public create(): void {
		let listValue: EIMListValueDomain = new EIMListValueDomain();
		listValue.attTypeId = this.attribute.attTypeId;
		listValue.isDspColor = this.checkColor;
		listValue.color = this.color.replace(EIMAdminsConstantService.COLOR_HASH, '');
		listValue.value = this.listValueName.getDefaultList()[0];
		listValue.valType = this.attribute.valTypeId;
		this.attributeService.createMaster(listValue).subscribe(
			(data: EIMListValueDTO[]) => {
				this.created.emit(data);
			}
		);
	}

	/**
	 * リスト値登録可否を返却します.
	 * @return リスト値登録可否
	 */
	public creatable(): boolean {
		return this.listValueCreatorForm.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		this.valTypeId = this.attribute.valTypeId;
		this.multiple = this.attribute.isMultipleFlag;
	}
}

