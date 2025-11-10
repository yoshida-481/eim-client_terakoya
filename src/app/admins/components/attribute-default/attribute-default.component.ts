import { EIMDateService } from 'app/shared/services/date.service';
import { SelectItem } from 'primeng/api';
import { Component, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { FormGroup, NgForm } from '@angular/forms';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

/**
 * 属性デフォルト値設定コンポーネントです。<br/>
 * @example
 *      <eim-attribute-default
 *          [form]="form"
 *          [valTypeId]="valTypeId"
 *          [multiple]="false"
 *          [uiControlType]="uiControlType"
 *          [label]="label"
 *          [codeItems]="codeItems"
 *          [required]="required">
 *      </eim-attribute-default>
 */
@Component({
	selector: 'eim-attribute-default',
	templateUrl: './attribute-default.component.html',
	styleUrls: ['./attribute-default.component.css'],
	standalone: false,
})
export class EIMAttributeDefaultComponent {

	/** フォーム */
	@Input() public form: FormGroup;

	/** データ型 */
	@Input() public valTypeId = EIMAdminsConstantService.VALUE_TYPE_INTEGER;

	/** 複数値属性かどうか */
	@Input() public multiple = false;

	/** UIコントロールタイプ */
	@Input() public uiControlType: string;

	/** ラベル */
	@Input() public label: string;

	/** リスト定義(ドキュメントのみ) */
	@Input() public inputRule = false;

	/** コードリスト */
	@Input() public codeItems: SelectItem[] = [];

	/** 必須フラグ */
	@Input() public required = false;

	/** フォームコントローラの名前 */
	public name: string;

	/** 数値型最大文字数 */
	public numberMaxLength: number = EIMConstantService.NUMBER_MAX_LENGTH;
	/** 数値型最大文字数 */
	public realMaxLength: number = EIMConstantService.REAL_NUMBER_MAX_LENGTH
	/** 文字列型最大文字数 */
	public stringMaxLength: number = EIMConstantService.STRING_MAX_LENGTH;
	/** 数値型パターン */
	public numberPattern: string =  EIMConstantService.NUMBER_PATTERN;
	/** 実数型パターン */
	public realPattern: string =  EIMConstantService.REAL_PATTERN;

	/** 非活性項目表示用ダミー入力値 */
	public dummy: any[] = [];
	/** 単数デフォルト属性項目入力値：数値型 */
	public longValue: any[] = [];
	/** 単数デフォルト属性項目入力値：文字列型(1行テキスト) */
	public stringInputValue: any[] = [];
	/** 単数デフォルト属性項目入力値：文字列型(複数テキスト) */
	public stringAreaValue: any[] = [];
	/** 単数デフォルト属性項目入力値：日付型 */
	public dateValue: any[] = [];
	/** 単数デフォルト属性項目入力値：テキスト型 */
	public textValue: any[] = [];
	/** 単数デフォルト属性項目入力値：実数型 */
	public realValue: any[] = [];
	/** 単数デフォルト属性項目入力値：コード型 */
	public codeValue: any[] = [];

	/** 複数デフォルト属性項目入力値：数値型 */
	public multiLongValue: any[] = [];
	/** 複数デフォルト属性項目入力値：文字列型(1行テキスト) */
	public multiStringInputValue: any[] = [];
	/** 複数デフォルト属性項目入力値：文字列型(複数テキスト) */
	public multiStringAreaValue: any[] = [];
	/** 複数デフォルト属性項目入力値：日付型 */
	public multiDateValue: any[] = [];
	/** 複数デフォルト属性項目入力値：テキスト型 */
	public multiTextValue: any[] = [];
	/** 複数デフォルト属性項目入力値：実数型 */
	public multiRealValue: any[] = [];
	/** 複数デフォルト属性項目入力値：コード型 */
	public multiCodeValue: any[] = [];

	/** デフォルト属性項目入力値：ユーザ型(単数/複数共用) */
	public userValue: any[] = [null];

	/** 選択コード */
	public selectedCode: any;
	/** ユーザリスト */
	public userItems: SelectItem[] = [
		{label: '　', value: null},
		{label: this.translateService.instant('EIM_ADMINS.LABEL_02100'), value: EIMConstantService.ATTRIBUTE_DEFAULT_VALUE_LOGIN_USER},
	];
	/** 選択ユーザ */
	public selectedUser: any;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected dateService: EIMDateService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * デフォルト値の入力情報を返却します.
	 * @return デフォルト値入力情報
	 */
	public getDefaultList(): any[] {
		if (this.inputRule) {
			return [];
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_INTEGER && !this.multiple) {
			return this.longValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_STRING && !this.multiple && (this.uiControlType === 'uIControlTextInput' || !this.uiControlType)) {
			return this.stringInputValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_STRING && !this.multiple && (this.uiControlType === 'uIControlTextArea')) {
			return this.stringAreaValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_DATE && !this.multiple) {
			return this.convertDateToString(this.dateValue);
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_TEXT && !this.multiple) {
			return this.textValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_DOUBLE && !this.multiple) {
			return this.realValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_CODE && !this.multiple) {
			return this.codeValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_INTEGER && this.multiple) {
			return this.multiLongValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_STRING && this.multiple && (this.uiControlType === 'uIControlTextInput' || !this.uiControlType)) {
			return this.multiStringInputValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_STRING && this.multiple && (this.uiControlType === 'uIControlTextArea')) {
			return this.multiStringAreaValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_DATE && this.multiple) {
			return this.convertDateToString(this.multiDateValue);
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_TEXT && this.multiple) {
			return this.multiTextValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_DOUBLE && this.multiple) {
			return this.multiRealValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_CODE && this.multiple) {
			return this.multiCodeValue;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_USER) {
			return this.userValue;
		}
		return [];
	}

		/**
	 * デフォルト値の入力情報を設定します.
	 * @param デフォルト値情報
	 */
	public setDefault(defaultValue: any[]): void {
		if (this.inputRule) {
			return;
		}
		if (!defaultValue || !defaultValue[0] || defaultValue[0] === '') {
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_INTEGER && !this.multiple) {
			this.longValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_STRING && !this.multiple && (this.uiControlType === 'uIControlTextInput' || !this.uiControlType)) {
			this.stringInputValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_STRING && !this.multiple && (this.uiControlType === 'uIControlTextArea')) {
			this.stringAreaValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_DATE && !this.multiple) {
			this.dateValue = this.convertStringToDate(defaultValue);
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_TEXT && !this.multiple) {
			this.textValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_DOUBLE && !this.multiple) {
			this.realValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_CODE && !this.multiple) {
			this.codeValue = this.convertStringToNumber(defaultValue);
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_INTEGER && this.multiple) {
			this.multiLongValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_STRING && this.multiple && (this.uiControlType === 'uIControlTextInput' || !this.uiControlType)) {
			this.multiStringInputValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_STRING && this.multiple && (this.uiControlType === 'uIControlTextArea')) {
			this.multiStringAreaValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_DATE && this.multiple) {
			this.multiDateValue = this.convertStringToDate(defaultValue);
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_TEXT && this.multiple) {
			this.multiTextValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_DOUBLE && this.multiple) {
			this.multiRealValue = defaultValue;
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_CODE && this.multiple) {
			this.multiCodeValue = this.convertStringToNumber(defaultValue);
			return;
		}
		if (this.valTypeId === EIMAdminsConstantService.VALUE_TYPE_USER) {
			this.userValue = defaultValue;
			return;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * ユーザ変更後のイベントハンドラです.
	 * @param event イベント
	 */
	onUserChange(event?: any): void {
		this.form.markAsDirty();
		this.userValue = [event.value];
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 日付型一覧を文字列型一覧に変換して返却します.
	 * @param dateList 日付型リスト
	 * @return 文字列型リスト
	 */
	private convertDateToString(dateList: Date[]): string[] {
		let returnList: string[] = [];
		for (let i = 0; i < dateList.length; i++) {
			returnList.push(this.dateService.getDateString((dateList[i])));
		}
		return returnList;
	}

	/**
	 * 文字列型一覧を日付列型一覧に変換して返却します.
	 * @param stringList 文字列型リスト
	 * @return 日付型リスト
	 */
	private convertStringToDate(stringList: string[]): Date[] {
		let returnList: Date[] = [];
		for (let i = 0; i < stringList.length; i++) {
			returnList.push(new Date(stringList[i]));
		}
		return returnList;
	}

	/**
	 * 文字列型一覧を数値型一覧に変換して返却します.
	 * @param stringList 文字列型リスト
	 * @return 数値型リスト
	 */
	 private convertStringToNumber(stringList: string[]): Number[] {
		let returnList: Number[] = [];
		for (let i = 0; i < stringList.length; i++) {
			returnList.push(Number(stringList[i]));
		}
		return returnList;
	}
}
