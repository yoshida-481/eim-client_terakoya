import { EIMFormsConstantService } from '../../shared/services/forms-constant.service';
import { Component, ViewChild, OnInit, Input, HostListener, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { EIMFormSearchConditionComponentService, EIMFormSearchConditionComponentInfo } from 'app/forms/components/form-search-condition/form-search-condition.component.service';

/**
 * 帳票検索条件コンポーネント
 * @example
 *
 *      <eim-form-search-condition
 *
 *      >
 *      </eim-form-search-condition>
 */
@Component({
    selector: 'eim-form-search-condition',
    templateUrl: './form-search-condition.component.html',
    styleUrls: ['./form-search-condition.component.css'],
    providers: [],
    standalone: false
})
export class EIMFormSearchConditionComponent implements OnInit {

	/** フォーム */
	@ViewChild('searchForm', { static: true }) searchForm: NgForm;

	/** 検索コンポーネント情報 */
	public info: EIMFormSearchConditionComponentInfo = {};

	/** 言語変更サブスクリプション */
	private translateServiceOnLangChange: Subscription;

	/** 検索対象オブジェクトタイプリスト */
	public searchTarget: SelectItem[] = [];

	/** 検索対象文字列条件リスト */
	public selectString: SelectItem[] = [];

	/** 検索対象数値条件リスト */
	public selectLong: SelectItem[] = [];

	/** 定数クラス */
	private Const: EIMFormsConstantService = EIMFormsConstantService;

	/**
	 * コンストラクタ.
	 */
	constructor(
		protected translateService: TranslateService,
		protected formSearchConditionComponentService: EIMFormSearchConditionComponentService,
	){
		// 検索条件
		this.info.condition = {
				/** キーワード */
				keyword: [],
				/** 全文を含む */
				contents: false
		};

		this.info.selectConfig = {};
		this.info.selectConfig.basicCondition = [];
		this.info.selectConfig.detailCondition = [];
		this.info.useDetailFlg = false;

		/**
		 * 言語変更イベントハンドラ.
		 * @param event イベント
		 */
		this.translateServiceOnLangChange = this.translateService.onLangChange.subscribe( (event: LangChangeEvent) => {
			this.refreshSelectItemLabel();
		});
	}

	/**
	 * 入力値初期化後イベントハンドラです.
	 */
	ngOnInit() {
		this.formSearchConditionComponentService.getSeachForm(this.info, this.searchTarget);
		this.refreshSelectItemLabel();
	}

	/**
	 * 検索ボタン押下時の処理を実施します.
	 * 検索を実行します.
	 * @param event イベント
	 */
	public onSearch(event: any): void {
		event.preventDefault();
		this.formSearchConditionComponentService.search(this.info);
	}

	/**
	 * クリアボタン押下時の処理を実施します.
	 * 検索項目の入力内容を削除します.
	 * @param event イベント
	 */
	public onClear(event: any): void {
		event.preventDefault();
		this.formSearchConditionComponentService.clearSearchCondition(this.info);
	}

	/**
	 * 検索対象プルダウン変更時の処理を実施します.
	 * 検索項目再描画をします.
	 */
	public onChangeSearchTarget(): void {
		this.formSearchConditionComponentService.onChangeSearchTarget(this.info);
	}

	/**
	 * セレクトアイテムラベルをリフレッシュします.
	 */
	public refreshSelectItemLabel(): void {
		// テキスト検索用セレクトアイテムを入れ替える
		this.selectString.splice(0, this.selectString.length);
		let stringLabel: any = this.translateService.instant('EIM.CONDITION.STRING');
		for (let key in stringLabel) {
			let label: any = stringLabel[key];
			this.selectString.push(label);
		}

		// 数値検索用セレクトアイテムを入れ替える
		this.selectLong.splice(0, this.selectLong.length);
		let longLabel: any = this.translateService.instant('EIM.CONDITION.LONG');
		for (let key in longLabel) {
			let label: any = longLabel[key];
			this.selectLong.push(label);
		}
	}
}
