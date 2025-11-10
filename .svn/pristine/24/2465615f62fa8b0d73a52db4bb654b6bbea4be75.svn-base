import { Injectable } from '@angular/core';
import { EIMFormDomain } from 'app/shared/domains/form.domain';

import { TranslateService } from '@ngx-translate/core';

import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';

import { EIMStatusTypeLayoutDomain } from 'app/shared/domains/status-type-layout.domain';
import { EIMConstantService } from 'app/shared/services/constant.service';

/** 表示情報 */
export interface AttributeTypeLayoutOption {
	// 業務タイプ定義名称
	businessTypeDefinitionName: string,
	// 帳票タイプ定義名称
	formTypeDefinitionName: string,
	// 属性タイプ定義名称と上メッセージのMap
	attributeTypeDefinitionNameAndTopMessageMap: Map<string, string>,
	// 属性タイプ定義名称と下メッセージのMap
	attributeTypeDefinitionNameAndBottomMessageMap: Map<string, string>,
	// 属性タイプ定義名称と左メッセージのMap
	attributeTypeDefinitionNameAndLeftMessageMap: Map<string, string>,
	// 属性タイプ定義名称と下メッセージのMap
	attributeTypeDefinitionNameAndRightMessageMap: Map<string, string>,
	// 属性タイプ定義名称と入力部品のオプションパラメータのMap
	attributeTypeDefinitionNameAndOptionParamsMap: Map<string, any>,
	// 非表示属性タイプ定義名称Set
	unvisibleAttributeTypeDefinitionNameSet: Set<string>,
	// ラベル非表示属性タイプ定義名称Set
	unvisibleLabelAttributeTypeDefinitionNameSet: Set<string>,
	// 非活性属性タイプ定義名称Set
	disabledAttributeTypeDefinitionNameSet: Set<string>
}

/**
 * 属性タイプレイアウト表示情報ビルダのサービス
 */
@Injectable()
export class EIMFormAttributeTypeLayoutOptionBuilderService {

	/** 表示情報 */
	public attributeTypeLayoutOption: AttributeTypeLayoutOption = {
		// 業務タイプ定義名称
		businessTypeDefinitionName: '',
		// 帳票タイプ定義名称
		formTypeDefinitionName: '',
		// 属性タイプ定義名称毎の上メッセージのマップ
		attributeTypeDefinitionNameAndTopMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称毎の下メッセージのマップ
		attributeTypeDefinitionNameAndBottomMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称毎の左メッセージのマップ
		attributeTypeDefinitionNameAndLeftMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称毎の下メッセージのマップ
		attributeTypeDefinitionNameAndRightMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称毎の入力部品のオプションのマップ
		attributeTypeDefinitionNameAndOptionParamsMap: new Map<string, any>(),
		// 非表示属性タイプ定義名称セット
		unvisibleAttributeTypeDefinitionNameSet: new Set<string>(),
		// ラベル非表示属性タイプ定義名称セット
		unvisibleLabelAttributeTypeDefinitionNameSet: new Set<string>(),
		// 非活性属性タイプ定義名称Set
		disabledAttributeTypeDefinitionNameSet: new Set<string>(),
	};

	/**
	 * コンストラクタです
	 */
	constructor(
		protected translateService: TranslateService,
	) {
	    (translateService);
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 表示情報を構築します.
	 * @param form 帳票情報
	 * @returns 表示情報
	 */
	public build(form: EIMFormDomain): AttributeTypeLayoutOption {
		this.initAttributeTypeDefinitionNameAndMessageMap(this.attributeTypeLayoutOption, form);
		this.initAttributeTypeDefinitionNameAndOptionParamsMap(this.attributeTypeLayoutOption, form);
		this.initUnvisibleAttributeTypeDefinitionNameSet(this.attributeTypeLayoutOption, form);
		this.initUnvisibleLabelAttributeTypeDefinitionNameSet(this.attributeTypeLayoutOption, form);
		this.initDisabledAttributeTypeDefinitionNameSet(this.attributeTypeLayoutOption, form);

		return this.attributeTypeLayoutOption;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 属性タイプ定義名称毎の上下左右メッセージのマップを返却します.
	 * @param form 帳票情報
	 * @return 属性タイプ定義名称毎の上下左右メッセージのマップ
	 */
	protected getAttributeTypeDefinitionNameAndMessageMap(form: EIMFormDomain) {

		let attributeTypeDefinitionNameAndMessageMap = new Map<string, any>();

		// 設定方法 サンプル
		// attributeTypeDefinitionNameAndMessageMap.set('app.form.user:タイトル', {
		// 	'TOP': '上のメッセージ',
		// 	'RIGHT': '右のメッセージ',
		// 	'BOTTOM': '下のメッセージ',
		// 	'LEFT': '左のメッセージ'
		// });

		return attributeTypeDefinitionNameAndMessageMap;
	}

	/**
	 * 属性タイプ定義名称毎の入力部品のオプションのマップを返却します.
	 * @param form 帳票情報
	 * @return ラベル非表示の属性タイプ定義名称セット
	 */
	protected getAttributeTypeDefinitionNameAndOptionParamsMap(form: EIMFormDomain): Map<string, any> {

		let attributeTypeDefinitionNameAndOptionParamsMap = new Map<string, any>();

		// 設定方法 サンプル
		// attributeTypeDefinitionNameAndOptionParamsMap.set('app.form.user:ID', {enableSeparate: false});

		return attributeTypeDefinitionNameAndOptionParamsMap;
	}

	/**
	 * ラベル非表示の属性タイプ定義名称セットを返却します.
	 * @param form 帳票情報
	 * @return ラベル非表示の属性タイプ定義名称セット
	 */
	protected getUnvisibleLabelAttributeTypeDefinitionNameSet(form: EIMFormDomain): Set<string> {

		let attributeTypeDefinitionNameSet = new Set<string>();

		// 設定方法 サンプル
		// attributeTypeDefinitionNameSet.add('app.form.user:タイトル');

		return attributeTypeDefinitionNameSet;
	}

	/**
	 * 非表示の属性タイプ定義名称セットを返却します.
	 * @param form 帳票情報
	 * @return 非表示の属性タイプ定義名称セット
	 */
	protected getUnvisibleAttributeTypeDefinitionNameSet(form: EIMFormDomain): Set<string> {
		let attributeTypeDefinitionNameSet = new Set<string>();

		// 設定方法 サンプル
		// attributeTypeDefinitionNameSet.add('app.form.user:タイトル');

		return attributeTypeDefinitionNameSet;
	}

	/**
	 * 非活性表示の属性タイプ定義名称セットを返却します.
	 * @param form 帳票情報
	 * @return  非活性表示の属性タイプ定義名称セット
	 */
	protected getDisabledAttributeTypeDefinitionNameSet(form: EIMFormDomain): Set<string> {
		let attributeTypeDefinitionNameSet = new Set<string>();

		// 設定方法 サンプル
		// attributeTypeDefinitionNameSet.add('app.form.user:タイトル');

		return attributeTypeDefinitionNameSet;
	}



	/**
	 * 属性タイプ定義名称毎の上下左右メッセージのマップを初期化します.
	 * @param option 表示情報
	 * @param form 帳票情報
	 */
	protected initAttributeTypeDefinitionNameAndMessageMap(option: AttributeTypeLayoutOption, form: EIMFormDomain) {

		let customMap = this.getAttributeTypeDefinitionNameAndMessageMap(form);

		// 属性タイプレイアウトリストをセットメソッドに渡す
		let attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[] = form.formLayout.objectTypeLayout.attributeTypeLayoutList;
		this.setAttributeTypeDefinitionNameAndMessageMap(attributeTypeLayoutList, option, form, customMap);

		// ステータスタイプレイアウトリストをセットメソッドに渡す
		if ( form.formLayout.currentStatusTypeLayout ) {
			let currentStatusTypeLayoutformattributeTypeLayoutList = form.formLayout.currentStatusTypeLayout.attributeTypeLayoutList

			if ( currentStatusTypeLayoutformattributeTypeLayoutList != undefined || currentStatusTypeLayoutformattributeTypeLayoutList != null ) {
				let statusAttributeTypeLayoutList: EIMAttributeTypeLayoutDomain[] =  form.formLayout.currentStatusTypeLayout.attributeTypeLayoutList;
				this.setAttributeTypeDefinitionNameAndMessageMap(statusAttributeTypeLayoutList, option, form, customMap);
			}
		}

		// 過去のステータスタイプレイアウトリストをセットメソッドに渡す
		let pastStatusTypeLayoutList: EIMStatusTypeLayoutDomain[] = form.formLayout.pastStatusTypeLayout;
		for(let i=0;  i<pastStatusTypeLayoutList.length; i++ ){
			let pastStatusTypeLayout = pastStatusTypeLayoutList[i];
			let attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[] = pastStatusTypeLayout.attributeTypeLayoutList;
			this.setAttributeTypeDefinitionNameAndMessageMap(attributeTypeLayoutList, option, form, customMap);
		}
	}

	/**
	 * 属性タイプ定義名称毎の入力部品のオプションのマップを初期化します.
	 * @param option 表示情報
	 * @param form 帳票情報
	 */
	protected initAttributeTypeDefinitionNameAndOptionParamsMap (option: AttributeTypeLayoutOption, form:any) {

		let customMap = this.getAttributeTypeDefinitionNameAndOptionParamsMap(form);

		// 属性タイプ定義名称のリストと入力部品のオプションパラメータを引数に設定
		let attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[] = form.formLayout.objectTypeLayout.attributeTypeLayoutList;
		this.setOptionParams(attributeTypeLayoutList, option, customMap);

		// ステータスタイプ属性の定義名称のリストと入力部品のオプションパラメータを引数に設定
		if ( form.formLayout.currentStatusTypeLayout ) {
			let statusAttributeTypeLayoutList: EIMAttributeTypeLayoutDomain[] =  form.formLayout.currentStatusTypeLayout.attributeTypeLayoutList;
			this.setOptionParams(statusAttributeTypeLayoutList, option, customMap);
		}

		// 過去のステータスタイプ属性の定義名称のリストと入力部品のオプションパラメータを引数に設定し
		let pastStatusTypeLayoutList: EIMStatusTypeLayoutDomain[] = form.formLayout.pastStatusTypeLayout;
		for (let i=0;  i<pastStatusTypeLayoutList.length; i++ ){
			let pastStatusTypeLayout = pastStatusTypeLayoutList[i];
			let attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[] = pastStatusTypeLayout.attributeTypeLayoutList;
			this.setOptionParams(attributeTypeLayoutList, option, customMap)
		}
	}

	/**
	 * 属性タイプレイアウト毎に入力部品のオプション情報を設定します.
	 * @param attributeTypeLayoutList 属性タイプレイアウトリスト
	 * @param option 表示情報
	 * @param customMap 属性タイプ定義名称とカスタムオプションのマップ
	 */
	protected setOptionParams(attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[], option:AttributeTypeLayoutOption, customMap: Map<string, any>) {
		for (let i = 0; i < attributeTypeLayoutList.length; i++) {
			let attributeTypeLayout = attributeTypeLayoutList[i];
			this.setOptionParam(attributeTypeLayout, option, customMap);
		}
	}

	/**
	 * 入力部品のオプション情報を設定します.
	 * @param attributeTypeLayout 属性タイプレイアウト
	 * @param option 表示情報
	 * @param customMap 属性タイプ定義名称とカスタムオプションのマップ
	 */
	protected setOptionParam(attributeTypeLayout: EIMAttributeTypeLayoutDomain, option:AttributeTypeLayoutOption, customMap: Map<string, any>) {
		let attributeTypeDefName = attributeTypeLayout.definitionName;

		// 実数型
		if (attributeTypeLayout.valueType === 'DOUBLE') {
			// 数値入力部品の各種設定
			let optionParams = {
				// 最大文字数
				maxlength: EIMConstantService.REAL_NUMBER_MAX_LENGTH,
				// 入力制限
				restriction:'\\-0-9.',
				// カンマ区切り表示するかどうか
				enableSeparate: true
			};

			// カスタムオプションが設定されている場合
			if (customMap.has(attributeTypeDefName)) {

				// カスタムオプションで上書きする
				optionParams = Object.assign(optionParams, customMap.get(attributeTypeDefName));

			}

			//　表示情報に属性タイプ定義名称と各種設定をセット
			option.attributeTypeDefinitionNameAndOptionParamsMap.set(attributeTypeDefName,optionParams);

		// 数値型
		} else if (attributeTypeLayout.valueType === 'LONG') {
			// 数値入力部品の各種設定
			let optionParams = {
				// 最大文字数
				maxlength: EIMConstantService.LONG_MAX_LENGTH,
				// 入力制限
				restriction:'\\-0-9',
				// カンマ区切り表示するかどうか
				enableSeparate: true
			};

			// カスタムオプションが設定されている場合
			if (customMap.has(attributeTypeDefName)) {

				// カスタムオプションで上書きする
				optionParams = Object.assign(optionParams, customMap.get(attributeTypeDefName));

			}

			//　表示情報に属性タイプ定義名称と各種設定をセット
			option.attributeTypeDefinitionNameAndOptionParamsMap.set(attributeTypeDefName,optionParams);
		}
	}

	/**
	 * ラベル非表示の属性タイプ定義名称セットを初期化します.
	 * @param option 表示情報
	 * @param form 帳票情報
	 */
	protected initUnvisibleLabelAttributeTypeDefinitionNameSet (option: AttributeTypeLayoutOption, form: EIMFormDomain) {

		option.unvisibleLabelAttributeTypeDefinitionNameSet = this.getUnvisibleLabelAttributeTypeDefinitionNameSet(form);

	}

	/**
	 * 非表示の属性タイプ定義名称セットを初期化します.
	 * @param option 表示情報
	 * @param form 帳票情報
	 */
	protected initUnvisibleAttributeTypeDefinitionNameSet (option: AttributeTypeLayoutOption, form: EIMFormDomain) {

		option.unvisibleAttributeTypeDefinitionNameSet = this.getUnvisibleAttributeTypeDefinitionNameSet(form);

	}

	/**
	 * 非活性表示の属性タイプ定義名称セットを初期化します.
	 * @param option 表示情報
	 * @param form 帳票情報
	 */
	protected initDisabledAttributeTypeDefinitionNameSet (option: AttributeTypeLayoutOption, form: EIMFormDomain) {

		option.disabledAttributeTypeDefinitionNameSet = this.getDisabledAttributeTypeDefinitionNameSet(form);

	}

	/**
	 * 上下左右メッセージそれぞれのマップに属性タイプ定義名称とメッセージを設定します.
	 * @param attributeTypeLayoutList 属性タイプレイアウトリスト
	 * @param option 表示情報
	 * @param form 帳票情報
	 * @param customMap 属性タイプ定義名称とカスタムメッセージのマップ
	 */
	protected setAttributeTypeDefinitionNameAndMessageMap (attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[],
			option: AttributeTypeLayoutOption, form: EIMFormDomain, customMap: Map<string, any>) {

		for (let i=0; i<attributeTypeLayoutList.length; i++) {

			let attributeTypeLayout = attributeTypeLayoutList[i];

			// 帳票タイプ定義名称を取得
			let formTypeDefName = this.attributeTypeLayoutOption.formTypeDefinitionName = form.type.definitionName;
			// 属性タイプ定義名称を取得
			let attributeTypeDefName = attributeTypeLayout.definitionName;

			// メッセージ（上）を取得
			let topMessage = this.getMessage(formTypeDefName, attributeTypeDefName, 'TOP', customMap);
			// 表示情報のattributeTypeDefinitionNameAndTopMessageMapにセット
			option.attributeTypeDefinitionNameAndTopMessageMap.set(attributeTypeDefName, topMessage);

			// メッセージ（下）を取得
			let bottomMessage = this.getMessage(formTypeDefName, attributeTypeDefName, 'BOTTOM', customMap);
			// 表示情報のattributeTypeDefinitionNameAndBottomMessageMapにセット
			option.attributeTypeDefinitionNameAndBottomMessageMap.set(attributeTypeDefName, bottomMessage);

			// メッセージ（左）を取得
			let leftMessage = this.getMessage(formTypeDefName, attributeTypeDefName, 'LEFT', customMap);
			// 表示情報のattributeTypeDefinitionNameAndLeftMessageMapにセット
			option.attributeTypeDefinitionNameAndLeftMessageMap.set(attributeTypeDefName, leftMessage);

			// メッセージ（右）を取得
			let rightMessage = this.getMessage(formTypeDefName, attributeTypeDefName,  'RIGHT', customMap);
			// 表示情報のattributeTypeDefinitionNameAndRightMessageMapにセット
			option.attributeTypeDefinitionNameAndRightMessageMap.set(attributeTypeDefName, rightMessage);
		}
	}

	/**
	 * リソースファイルからメッセージを取得します.
	 * @param formTypeDefName 帳票定義名称
	 * @param attributeTypeDefName 属性タイプ定義名称
	 * @param msgPosition メッセージの表示場所情報
	 * @param customMap 属性タイプ定義名称とカスタムメッセージのマップ
	 * @returns メッセージ
	*/
	protected getMessage(formTypeDefName: string, attributeTypeDefName: string, msgPosition: string, customMap: Map<string, any>): string {

		// プログラムで設定したメッセージを取得
		let customMsgObj = customMap.get(attributeTypeDefName);
		if (customMsgObj) {
			let customMsg = customMsgObj[msgPosition];
			if (customMsg) {
				return customMsg;
			}
		}

		// リソースファイルにて帳票タイプごとに設定されたメッセージを取得
		let msgKeyByType = 'EIM_FORMS.FORM_TYPE_MESSAGES_MAP.' + formTypeDefName + '.' + attributeTypeDefName + '.' + msgPosition;
		let msgByType = this.translateService.instant(msgKeyByType);
		if (msgByType !== msgKeyByType) {
			return msgByType;
		}

		// リソースファイルにて共通に設定されたメッセージを取得
		let msgKey = 'EIM_FORMS.FORM_TYPE_MESSAGES_MAP.' + 'COMMON.' + attributeTypeDefName + '.' + msgPosition;
		let msg = this.translateService.instant(msgKey);
		if (msg !== msgKey) {
			return msg;
		}

		// メッセージがない場合空文字を返す
		return '';
	}
}
