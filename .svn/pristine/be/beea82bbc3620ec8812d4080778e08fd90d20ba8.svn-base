import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EIMObjectTypeTreeComponentService } from 'app/object-editors/components/object-type-tree/object-type-tree.component.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMObjectListComponent } from 'app/object-editors/components/object-list/object-list.component';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMObjectCriteriaDTO } from 'app/object-editors/shared/dtos/criteria/object-criteria.dto';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMObjectEditorsObjectTypeService } from 'app/object-editors/shared/services/apis/object-editors-object-type.service';
import { EIMAttributeTypeDTO } from 'app/object-editors/shared/dtos/attribute-type.dto';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMNumberService } from 'app/shared/services/number.service';
import { EIMObjectEditorMainComponent } from 'app/object-editors/components/object-editor-main/object-editor-main.component';
import { EIMObjectNameRendererComponent } from 'app/object-editors/shared/components/renderer/object-name-renderer.component';
import { EIMSecurity } from 'app/object-editors/shared/services/apis/object-editors-security.service';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';


/** 左ペインのセパレートサイズ_30 */
export const SPLIT_LEFT_SIZE = 30;

/** 左ペインのセパレートサイズ_40 */
export const SPLIT_LEFT_TOP_SIZE = 40;

/** エンターキーのキーコード */
export const ENTER_KEY_CODE = 13;


/**
 * オブジェクト検索コンポーネント
 * @example
 *
 *      <eim-object-search>
 *      </eim-object-search>
 */
@Component({
    selector: 'eim-object-search',
    templateUrl: './object-search.component.html',
    styleUrls: ['./object-search.component.css'],
    providers: [],
    standalone: false
})
export class EIMObjectSearchComponent implements AfterViewInit {

	/** オブジェクトリスト表示コンポーネント */
	@ViewChild('objectList', { static: true })
		objectList: EIMObjectListComponent;

	/** オブジェクトタイプツリー表示コンポーネント */
	@ViewChild('objectTypeTree', { static: true })
		objectTypeTree: EIMTreeComponent;

	/** フォーム */
	@ViewChild('searchForm', { static: true }) searchForm: NgForm;

	/** 入力チェック用フォーム */
	@ViewChild('validForm', { static: true }) validForm: NgForm;

	/** 検索条件DIV */
	@ViewChild('scroolDiv', { static: true }) scroolDiv: any;

	/** 検索条件入力値 */
	public condition: any;

	/** オブジェクトタイプに割り当てられた属性タイプリスト */
	public attributeTypeList: EIMAttributeTypeDTO[] = [];

	/** 左ペインのセパレートサイズ(初期値) */
	public splitLeftSize = 0;

	/** 左ペイン内の上ペインのセパレートサイズ(初期値) */
	public splitLeftTopSize = 0;

	/** 選択オブジェクトID */
	public selectedObjTypeId: number;

	/** ステータスリスト */
	public statusList: any[] = [];

	/** 詳細条件表示フラグ */
	public detailsFlg = false;

	/** 詳細条件表示ボタンラベル */
	public detailsButtonLabel = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03032');

	/** セキュリティ */
	public security: EIMSecurity = {};

	/** ステータス非活性フラグ */
	public statusFlg = true;

	/** チェックボックス(サブクラスを含む)の非活性フラグ */
	public disabledIncludeSub = true;

	/** 定数クラス  */
	public Constant: EIMConstantService = EIMConstantService;

	/** テキスト型最大文字数 */
	public textMaxLength = EIMConstantService.TEXT_MAX_LENGTH;

	/** 検索結果グリッド */
	private objectListDataGrid: EIMDataGridComponent;

	/** サブミット時のアクティブエレメント（IE用対応） */
	private activeElementForSubmit: any;

	/** フォーム内でエンターキーが押下されたかどうか（IE用対応） */
	private isEnterKeyDown = false;

	/** プログレスバーが消えているかどうか（IE用対応） */
	private isHideProgressBar = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected dateService: EIMDateService,
		protected numberService: EIMNumberService,
		protected dialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		protected objectEditorsObjectTypeService: EIMObjectEditorsObjectTypeService,
		protected objectEditorsObjectService: EIMObjectEditorsObjectService,
		public objectTypeTreeComponentService: EIMObjectTypeTreeComponentService,
		public objectEditorMainComponent: EIMObjectEditorMainComponent,

	) {
		this.initCondition();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * スクロールバーの位置を返却します.
	 */
	public getScrollPosition(): {} {
		let result = {
			objectTypeTree: this.objectTypeTree.getScrollTop(),
			objectList: this.objectList.objectList.getScrollTop(),
			scroolDiv: this.scroolDiv.nativeElement.scrollTop,
		};
		return result;
	}

	/**
	 * スクロールバーの位置を設定します.
	 */
	public setScrollPosition(positions: {}): void {
		this.objectTypeTree.setScrollTop(positions['objectTypeTree']);
		this.objectList.objectList.setScrollTop(positions['objectList']);
		this.scroolDiv.nativeElement.scrollTop = positions['scroolDiv'];
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngAfterViewInit(): void {
		// オブジェクトリストのカラムを設定
		this.objectListDataGrid = (this.objectList.getComponent() as EIMDataGridComponent);
		this.objectListDataGrid.setColumns(this.getColumns());

		window.setTimeout(() => {
			// タブ内のセパレータは初期表示時にサイズを変更しないと
			// サイズが反映されないため初期値 0から変更している。
			this.splitLeftSize = SPLIT_LEFT_SIZE;
			this.splitLeftTopSize = SPLIT_LEFT_TOP_SIZE;
		});
	}

	/**
	 * オブジェクトタイプツリーのノード選択時のイベントハンドラです.
	 */
	public onSelectObjectType(): void {

		this.selectedObjTypeId = this.objectTypeTree.getSelectedData()[0].data.id;

		this.disabledIncludeSub = true;
		// 子がある場合、チェックボックス(サブクラスを含む)を活性化
		if (0 < this.objectTypeTree.getSelectedData()[0].data.children.length) {
			this.disabledIncludeSub = false;
		}

			// 属性タイプリスト取得
			this.objectEditorsObjectTypeService.getAttributeTypeList(this.selectedObjTypeId).subscribe(
				(_attributeTypeList: EIMAttributeTypeDTO[]) => {
					this.attributeTypeList = _attributeTypeList;

				// 属性値
				this.condition.attributes = [];
				for (let i = 0; i < this.attributeTypeList.length; i++) {
					let attributeType = this.attributeTypeList[i];
					let attribute: any = {
						typeId: attributeType.id,
						typeName: attributeType.name,
						valueTypeId: attributeType.valueTypeId,
						value: [''],
					};

					// コードの場合、オプションを生成
					if (attributeType.valueTypeId === EIMConstantService.VALUE_TYPE_CODE) {
						let options = [];
						options.push({label: '　', value: null});
						// コードリスト分ループ
						for (let j = 0; j < attributeType.codeList.length; j++) {
							options.push({label: attributeType.codeList[j].name, value: attributeType.codeList[j]});
						}
						attribute.options = options;
					}
					this.condition.attributes.push(attribute);
					this.condition.statusId = [];
				}
			}
		);

		// ステータスタイプリスト取得
		this.objectEditorsObjectTypeService.getStatusTypeList(this.selectedObjTypeId).subscribe(
			(statusTypeList: any) => {
				this.statusList = [];
				if (statusTypeList.statusType) {

					let statusType = statusTypeList.statusType;
					for (let i = 0; i < statusType.length; i++) {
						this.statusList.push({
								label: statusType[i].attr.statusTypeName === '' ? '　' : statusType[i].attr.statusTypeName,
								value: statusType[i].attr.statusTypeId});
					}
				}
			}
		);
	}

	/**
	 * 検索ボタン押下時のイベントハンドラです.
	 */
	public onClickSearch(): void {
		if (this.isIE() && this.isEnterKeyDown && !this.activeElementForSubmit) {
			// IEの場合、ラベルにフォーカスが当たっていてもサブミットしてしまうため
			this.clearSubmitFlag();

			return;
		}

		let criteria: EIMObjectCriteriaDTO = new EIMObjectCriteriaDTO();
		// 結果一覧をクリア
		this.objectListDataGrid.setData([]);
		this.objectList.refreshMenu();

		// オブジェクトタイプ
		let selectedTypes: any[] = this.objectTypeTree.getSelectedData();
		if (selectedTypes.length > 0) {
			criteria.typeId = selectedTypes[0].data.id;
		} else {
			criteria.typeId = undefined;
		}

		// 名前
		criteria.objName = this.condition.objName[0];
		// ステータス
		criteria.statusId = this.condition.statusId[0];
		// 作成者
		if (this.condition.creator.length === 1) {
			criteria.creatorId = this.condition.creator[0].id;
		}
		// 作成日
		criteria.createDateFrom = this.getDateString(this.condition.createDate[0]);
		criteria.createDateTo = this.getDateString(this.condition.createDate[1]);

		// 詳細条件
		// オブジェクトID
		criteria.objId = this.condition.objId[0];

		// リビジョン
		// 最新リビジョンのみにチェックがある場合、空に置き換える
		if (!this.condition.rev_onlyLatest) {
			criteria.rev = this.condition.rev[0];
		}　else {
			criteria.rev = '';
		}

		// 最新リビジョンのみ
		criteria.rev_onlyLatest = this.condition.rev_onlyLatest;
		// 更新者
		if (this.condition.updater.length === 1) {
			criteria.updaterId = this.condition.updater[0].id;
		}
		// 更新日
		criteria.updateDateFrom = this.getDateString(this.condition.updateDate[0]);
		criteria.updateDateTo = this.getDateString(this.condition.updateDate[1]);
		// ロック者
		if (this.condition.lockUser.length === 1) {
			criteria.lockUserId = this.condition.lockUser[0].id;
		}
		// ロック日
		criteria.lockDateFrom = this.getDateString(this.condition.lockDate[0]);
		criteria.lockDateTo = this.getDateString(this.condition.lockDate[1]);
		// セキュリティ
		if (this.security.secId) {
			criteria.securityId = String(this.security.secId);
		}
		// 全文検索
		criteria.allSearch = this.condition.allSearch[0];
		// サブクラスを含む
		criteria.includeSub = this.condition.includeSub;
		// 属性値
		for (let i = 0; i < this.condition.attributes.length; i++) {
			let attribute: any = this.condition.attributes[i];

			// 属性タイプID
			criteria.attTypeId.push(attribute.typeId);

			// 属性値
			let value;
			if (attribute.value[0]) {
				// オブジェクト型の場合
				if (attribute.valueTypeId === EIMConstantService.VALUE_TYPE_OBJECT) {
					value = attribute.value[0].id;
					// コード型の場合
				} else if (attribute.valueTypeId === EIMConstantService.VALUE_TYPE_CODE) {
						value = attribute.value[0].code;
					// ユーザ型の場合
				} else if (attribute.valueTypeId === EIMConstantService.VALUE_TYPE_USER) {
					value = attribute.value[0].id;
					// 日付型の場合
				} else if (attribute.valueTypeId === EIMConstantService.VALUE_TYPE_DATE) {
					value = this.getDateString(attribute.value[0]);
				} else {
					value = attribute.value[0];
				}
			}
			// undefindの場合、空に置き換える
			if (!value) {
				value = '';
			}
			criteria.attValue.push(value);
		}
		// 属性を表示する
		criteria.dspAllAttr = this.condition.dspAllAttr;

		if (criteria.dspAllAttr) {
			this.objectListDataGrid.setColumns(this.getColumns(this.condition.attributes));
		} else {
			this.objectListDataGrid.setColumns(this.getColumns());
		}
		// 検索実行
		this.objectEditorsObjectService.search(criteria, this.attributeTypeList).subscribe(
			(objectList: EIMObjectDTO[]) => {
				this.objectListDataGrid.setData(objectList);

				this.isHideProgressBar = true;
			}
		);
	}

	/**
	 * フォームのフォーカスアウト時のイベントハンドラです.
	 * @param event イベント
	 */
	public onFocusOutForm(event): void {
		if (!event.relatedTarget) {
			return;
		}

		if (event.relatedTarget.type !== 'submit') {
			// フォーカス遷移先がサブミットボタンでない場合
			return;
		}

		if (event.target.tagName !== 'INPUT') {
			// フォーカス遷移元が入力欄でない場合
			return;
		}

		// サブミット時のアクティブエレメントを保持
		// IEのみ検索ボタンにフォーカスが移ってしまう現象を防ぐため
		this.activeElementForSubmit = event.target;
	}

	/**
	 * フォームのキー押下時のイベントハンドラです.
	 * @param event イベント
	 */
	public onKeyDownForm(event: any): void {
		if (event.keyCode === ENTER_KEY_CODE) {
			this.clearSubmitFlag();
			this.isEnterKeyDown = true;
		}
	}

	/**
	 * 検索ボタンのフォーカスイン時のイベントハンドラです.
	 * IE以外はエンターキー押下でサブミット時、入力エレメントにフォーカスが戻りますが、
	 * IEのみ検索ボタンにフォーカスが移動します.
	 * 以下のフラグを使用してIEも検索ボタンから入力エレメントにフォーカスが移動するよう制御しています.
	 * ・isEnterKeyDown：エンターキーが押下されたかどうか
	 * ・isHideProgressBar：プログレスバーが消えているかどうか（プログレスバーからフォーカスが戻されるため消えていることが条件となる）
	 * ・activeElementForSubmit：エンターキー押下時の入力エレメント
	 * @param event イベント
	 */
	public onFocusSearch(event: any): void {
		// 入力欄にフォーカスを戻す
		if (this.isIE() && this.isEnterKeyDown && this.isHideProgressBar && this.activeElementForSubmit) {
			this.activeElementForSubmit.focus();

			this.clearSubmitFlag();
		}
	}

	/**
	 * クリアボタン押下時のイベントハンドラです.
	 */
	public onClickClear(): void {
		this.initCondition();

		// 選択オブジェクトタイプ
		this.objectTypeTree.select([], false);
	}

	/**
	 * 詳細条件ボタン押下時のイベントハンドラです.
	 */
	public onClickDetails(): void {
		if (!this.detailsFlg) {
			this.detailsFlg = true;
			this.detailsButtonLabel = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03033');
		} else {
			this.detailsFlg = false;
			this.detailsButtonLabel = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03032');
		}
	}

	/**
	 * セキュリティ削除ボタンクリックイベントハンドラです.
	 */
	onClickDeleteSecurity(): void {
		this.security = {};
	}

	/**
	 * セキュリティ選択ボタンクリックイベントハンドラです.
	 */
	onClickSelectSecurity(): void {
		let dialogId = this.dialogManagerComponentService.showObjectEditorsSecuritySelector(this.security.secId, {
			selected: (security: EIMSecurity[]) => {
				this.dialogManagerComponentService.close(dialogId);
				this.security = security[0];
			}
		});
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 *カラムを設定します.
	 */
	protected getColumns(attributes?: any[]): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		// 名前
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 247, cellRendererFramework: EIMObjectNameRendererComponent});
		// オブジェクトタイプ
		columns.push({field: 'typeName', headerName: this.translateService.instant('EIM.LABEL_02060'), width: 170});
		// リビジョン
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02064'), width: 93, type: EIMDataGridColumnType.number});
		// ステータス
		columns.push({field: 'statusTypeName', headerName: this.translateService.instant('EIM.LABEL_02029'), width: 110});
		// 作成者
		columns.push({field: 'createUserName', headerName: this.translateService.instant('EIM.LABEL_02030'), width: 120});
		// 作成日時
		columns.push({field: 'createDate', headerName: this.translateService.instant('EIM.LABEL_02031'), width: 180, comparator: this.dateService.dateComparator});

		if (attributes) {
			let fieldInitial = 'attributeInfo.attType_';
			for (let i = 0; i < attributes.length; i++) {
				if (attributes[i].valueTypeId === EIMConstantService.VALUE_TYPE_DATE) {
					columns.push({field: fieldInitial + attributes[i].typeId, headerName: attributes[i].typeName, width: 130, comparator: this.dateService.dateComparator});
				} else if (attributes[i].valueTypeId === EIMConstantService.VALUE_TYPE_INTEGER || attributes[i].valueTypeId === EIMConstantService.VALUE_TYPE_DOUBLE) {
					columns.push({field: fieldInitial + attributes[i].typeId, headerName: attributes[i].typeName, width: 130, comparator: this.numberService.numberComparator});
				} else {
					columns.push({field: fieldInitial + attributes[i].typeId, headerName: attributes[i].typeName, width: 130});
				}
			}
		}

		return columns;
	}

	/**
	 * 検索条件を初期化します.
	 */
	protected initCondition(): void {

		this.condition = {};
		// 名前
		this.condition.objName = [];
		// ステータス
		this.condition.statusId = [];
		// 作成者
		this.condition.creator = [];
		// 作成日
		this.condition.createDate = [undefined, undefined];
		// オブジェクトID
		this.condition.objId = [undefined];
		// リビジョン
		this.condition.rev = [];
		// 最新リビジョンのみ
		this.condition.rev_onlyLatest = false;
		// 更新者
		this.condition.updater = [];
		// 更新日
		this.condition.updateDate = [undefined, undefined];
		// ロック者
		this.condition.lockUser = [];
		// ロック日
		this.condition.lockDate = [undefined, undefined];
		// セキュリティ
		this.security = {};
		// 全文検索
		this.condition.allSearch = [''];
		// サブクラスを含む
		this.condition.includeSub = false;
		// 属性値
		this.condition.attributes = [];
		// 属性を表示する
		this.condition.dspAllAttr = false;
		// ステータスリスト
		this.statusList = [];

	}

	/**
	 * 日付の文字列（YYYY-MM-DD）を返却します.
	 * @param date 日付
	 * @return 日付文字列
	 */
	protected getDateString(date): string {
		return date !== null ?
		this.dateService.getDateString(date) : null;
	}

	/**
	 * サブミット制御用のフラグをクリアします.
	 */
	protected clearSubmitFlag(): void {
		this.activeElementForSubmit = null;
		this.isEnterKeyDown = false;
		this.isHideProgressBar = false;
	}

	/**
	 * IEかどうかを返却します.
	 * @return IEかどうか
	 */
	protected isIE(): boolean {
		let ua: string = window.navigator.userAgent.toLowerCase();
		return (ua.indexOf('msie') >= 0 || ua.indexOf('trident') >= 0);
	}
}
