import { Injector } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMCodeTypeDomain } from './entity/code-type.domain';

import { EIMSearchMasterDisplayConfigDomain } from './search-master-display-config.domain';
import { ValidatorFn } from '@angular/forms';

/**
 * 入力フォームアイテムドメイン
 * @class EIMInputFormItemDomain
 * @module EIMSharedModule
 * @constructor
 */
export class EIMInputFormItemDomain {

	/** フォームコントローラの名前 */
	public name: string;

	/** ラベル */
	public label: string;

	/** 値 */
	public values: any[];

	/** 属性タイプID */
	public id = 0;

	/** 属性タイプ定義名称 */
	public definitionName: string = null;

	/** データ型 */
	public valueType: string = null;

	/** 多重度 */
	public multiple = false;

	/** コードタイプ */
	public codeType: EIMCodeTypeDomain = null;

	/** 可視性(true:可視性あり) */
	public visible = false;

	/** 必須区分(true:必須) */
	public required = false;

	/** 無効かどうか */
	public disabled: boolean;

	/** UIコントロールタイプ */
	public uiControlType: string;

	/** UIコントロールID */
	public uiControlId: string;

	/** 最大入力可能バイト数 */
	public maxlength = 524288;

	/** 入力フォーマット */
	public pattern: string;

	/** 参照タイプマスタの画面定義 */
 	public searchMasterDisplayConfig: EIMSearchMasterDisplayConfigDomain;

	/** 表示順設定フラグ(true:設定済み) */
	public orderSetFlag: boolean;

	/** 複製フラグ(true:複製対象) */
	public newCopyFlag = true;

	/** 表示列ID */
	public formListColumnId: string;

	/** 初期値一覧 数値型 */
	public initialLongValueList: number[] = [];

	/** 初期値一覧 文字列型 */
	public initialStringValueList: string[] = [];

	/** 初期値一覧 実数型 **/
	public initialDoubleValueList: number[] = [];

	/** 初期値一覧 コード型 */
	public initialCodeValueList: number[] = [];

	/** 初期値一覧 ユーザ型 */
	public initialUserValueList: string[] = [];

	/** 編集したかどうか */
	public dirty = false;

	public options = [];

	public restriction = '';

	public enableSeparate: boolean;

	public pearentObjId: number;

	/** 上メッセージ */
	public topMessage = '';

	/** 右メッセージ */
	public rightMessage = '';

	/** 下メッセージ */
	public bottomMessage = '';

	/** 左メッセージ */
	public leftMessage = '';

	/** スタイルクラス（スペース区切りでクラス名を指定） */
	public styleClass: string = null;

	/** 最小値 */
	public minValue: any = null;

	/** 最大値 */
	public maxValue: any = null;

	/** バリデータ */
	public validators: ValidatorFn[] = [];

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (!json) {
			return;
		}

		// const injector = ReflectiveInjector.resolveAndCreate([EIMDomainService]);
		const injector = Injector.create({providers: [{provide: EIMDomainService, deps: []}]});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.visible = json.visible;
		this.required = json.required;
		this.uiControlType = json.uiControlType;
		this.uiControlId = json.uiControlId;
		if (json.searchMasterDisplayConfig) {
			this.searchMasterDisplayConfig = domainService.createObject(json.searchMasterDisplayConfig,
					(_json: any) => {
						return new EIMSearchMasterDisplayConfigDomain(_json);
					});
		}
		this.orderSetFlag = json.orderSetFlag;
		this.newCopyFlag = json.newCopyFlag;
		this.formListColumnId = json.formListColumnId;
		this.initialLongValueList = json.initialLongValueList;
		this.initialStringValueList = json.initialStringValueList;
		this.initialDoubleValueList = json.initialDoubleValueList;
		this.initialCodeValueList = json.initialCodeValueList;
		this.initialUserValueList = json.initialUserValueList;
	}
}
