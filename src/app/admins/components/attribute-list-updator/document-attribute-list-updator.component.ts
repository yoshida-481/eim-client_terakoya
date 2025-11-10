import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAttributeDefaultComponent } from 'app/admins/components/attribute-default/attribute-default.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMListValueDTO } from 'app/admins/shared/dtos/list-value.dto';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMListValueDomain } from 'app/shared/domains/list-value.domain';


/**
 * 属性リスト値更新コンポーネント
 * @example
 *
 *      <eim-document-attribute-list-updator
 *        [attribute]="attribute">
 *      </eim-document-attribute-list-updator>
 */
@Component({
  selector: 'eim-document-attribute-list-updator',
  templateUrl: './document-attribute-list-updator.component.html',
  styleUrls: ['./document-attribute-list-updator.component.css'],
  providers: [
    {provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentAttributeListUpdatorComponent)}
  ],
  standalone: false,
})

export class EIMDocumentAttributeListUpdatorComponent implements OnInit, EIMUpdatable {
	/** フォーマットフォーム */
	@ViewChild('listValueUpdatorForm', { static: true }) listValueUpdatorForm: NgForm;

	/** 対象属性タイプ */
	@Input() attribute: EIMAttributeTypeDTO;

	/** 対象属性タイプ */
	@Input() listValue: EIMListValueDTO;

	/** 作成完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

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

	/** 入力初期値 */
	public valueName = '';

	/** 複数値フラグ */
	public multiple = true;

	/** 表示色指定フラグ */
	public checkColor = false;

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

	/**
	 * リスト値を更新します.
	 */
	public update(): void {
		let listValue: EIMListValueDomain = new EIMListValueDomain();
		listValue.attTypeId = this.attribute.attTypeId;
		listValue.isDspColor = this.checkColor;
		listValue.color = this.color.replace(EIMAdminsConstantService.COLOR_HASH, '');
		listValue.beforeValue = this.listValue.value;
		listValue.afterValue = this.listValueName.getDefaultList()[0];
		listValue.valType = this.attribute.valTypeId;
		this.attributeService.updateMaster(listValue).subscribe(
			(data: EIMListValueDTO[]) => {
				this.updated.emit(data);
			}
		);
	}

	/**
	 * リスト値更新可否を返却します.
	 * @return リスト値更新可否
	 */
	public updatable(): boolean {
		return this.listValueUpdatorForm.valid && this.listValueUpdatorForm.dirty;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		// イベント順序の制御のため、同時に子コンポーネントのフィールドに代入する.
		this.listValueName.valTypeId = this.valTypeId = this.attribute.valTypeId;
		this.multiple = this.attribute.isMultipleFlag;
		this.valueName = this.listValue.value;
		this.checkColor = this.listValue.isDspColor;
		if (this.listValue.color !== EIMAdminsConstantService.NO_COLOR) {
			// 色情報がない場合
			this.color = EIMAdminsConstantService.COLOR_HASH + this.listValue.color;
		}
		this.listValueName.setDefault([this.listValue.value]);
	}
}
