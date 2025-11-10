import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMExecutable } from '../../../shared/shared.interface';
import { EIMDataGridColumn, EIMDataGridComponent } from '../../../shared/components/data-grid/data-grid.component';

import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMAttributeTypeDomain } from '../../../shared/domains/entity/attribute-type.domain';

import { EIMAttributeTypeLayoutDTO } from '../../../shared/dtos/attribute-type-layout.dto';
import { EIMAttributeTypeDTO } from '../../../shared/dtos/attribute-type.dto';

import { EIMFormCriteria } from '../../../shared/domains/criteria/form.criteria';
import { EIMLocalStorageService } from '../../../shared/services/apis/local-storage.service';
import { EIMFormCsvDownloadService } from '../../shared/services/apis/form-csv-download.service';
import { EIMFormSearchConditionComponentService } from '../form-search-condition/form-search-condition.component.service';
import { EIMFormsConstantService } from 'app/forms/shared/services/forms-constant.service';
import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMConstantService } from 'app/shared/services/constant.service';


/**
 * CSVダウンロード画面コンポーネント
 * @example
 *
 * 		<eim-form-csv-download>
 * 		</eim-form-csv-download>
 */
@Component({
    selector: 'eim-form-csv-download',
    templateUrl: './form-csv-download.component.html',
    styleUrls: ['./form-csv-download.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFormCsvDownloadComponent) }],
    standalone: false
})
export class EIMFormCsvDownloadComponent implements OnInit, AfterViewInit, EIMExecutable {

	/** 属性タイプ一覧データグリッド */
	@ViewChild('attributeTypeListGrid', { static: true }) attributeTypeListGrid: EIMDataGridComponent;
	/** ダウンロード対象一覧データグリッド */
	@ViewChild('downloadAttributeTypeListGrid', { static: true }) downloadAttributeTypeListGrid: EIMDataGridComponent;

	/** 検索条件 */
	@Input() criteria: EIMFormCriteria;

	/** CSVダウンロード実行完了のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();
	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大文字数 */
	public maxlength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 選択可能なすべての属性タイプリスト */
	public attributeTypeListAll: EIMAttributeTypeLayoutDTO[];
	/** フィルタ条件 */
	public filterCondition: any = {filterStr: ['']};
	/** タイトル属性タイプID */
	private attributeTypeIdTitle: number;

	/**
	 * コンストラクタです.
	 * @param formCsvDownloadService CSVダウンロードサービス
	 * @param formSearchConditionComponentService 検索条件コンポーネントサービス
	 * @param localStorageService ローカルストレージサービス
	 * @param translateService 翻訳サービス
	 * @param translateService 帳票キャッシュサービス
	 * @param fileService ファイルサービス
	 */
	constructor(
		protected formCsvDownloadService: EIMFormCsvDownloadService,
		protected formSearchConditionComponentService: EIMFormSearchConditionComponentService,
		protected localStorageService: EIMLocalStorageService,
		protected translateService: TranslateService,
		protected formsCacheService: EIMFormsCacheService,
		protected fileService: EIMFileService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * CSVダウンロードを実行します.
	 * CSVダウンロード実行時の出力対象属性タイプを検索対象ごとにローカルストレージに保持します.
	 */
	public execute(): void {

		// 属性タイプリスト
		let attributeTypeList: EIMAttributeTypeLayoutDomain[] = [];
		// 属性タイプIDリスト
		let attributeTypeIdList: number[] = [];
		for (let i = 0; i < this.downloadAttributeTypeListGrid.getData().length; i++) {
			let attributeType: EIMAttributeTypeLayoutDTO = this.downloadAttributeTypeListGrid.getData()[i];
			attributeTypeList.push(new EIMAttributeTypeLayoutDomain(attributeType));
			attributeTypeIdList.push(attributeType.id);
		}

		// タイトル属性を追加
		let attributeTypeTitle: EIMAttributeTypeLayoutDomain = new EIMAttributeTypeLayoutDomain();
		attributeTypeTitle.definitionName = EIMFormsConstantService.ATTRIBUTE_TYPE_NAME_TITLE;
		attributeTypeTitle.name = this.translateService.instant('EIM_FORMS.LABEL_02042');
		attributeTypeTitle.valueType = 'STRING';
		attributeTypeTitle.id = this.attributeTypeIdTitle;
		attributeTypeList.push(attributeTypeTitle);

		// ローカルストレージに保持
		this.localStorageService.setCsvDownloadItem(this.criteria.objectTypeDefinitionName, attributeTypeIdList);

		// CSVファイル生成処理実行
		this.formCsvDownloadService.createCsvFile(this.criteria, attributeTypeList).subscribe(
			(filePath: string) => {
				// ファイルダウンロード
				this.fileService.downloadByFileName(filePath);
				// CSVダウンロード完了後、ポップアップ画面クローズ
				this.executed.emit();
			}
		);
	}

	/**
	 * 実行ボタンの押下可否を返却します.
	 * @return 実行ボタンの押下可否
	 */
	public executable(): any {
		return true;
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 * 前回出力対象とした属性タイプをプリセットします.
	 */
	protected show(): void {
		// キャッシュから取得
		let list: EIMAttributeTypeLayoutDTO[] = this.formsCacheService.csvDownloadFormTypeMap.get(this.criteria.objectTypeDefinitionName);

		if (list) {
			// キャッシュされている場合はキャッシュしている属性タイプレイアウトリストを使用する
			this.initializeAttributeTypeList(list);
		} else {
			// キャッシュされていない場合はサーバーから取得する
			this.formCsvDownloadService.getAttributeTypeList(this.criteria.objectTypeDefinitionName).subscribe(
				(attrTypeLayoutList: EIMAttributeTypeLayoutDTO[]) => {
					this.initializeAttributeTypeList(attrTypeLayoutList);
					// 取得した属性タイプレイアウトリストをキャッシュする
					this.formsCacheService.csvDownloadFormTypeMap.set(this.criteria.objectTypeDefinitionName, attrTypeLayoutList);
				}
				, (error: any) => {
						// 初期表示時にエラーが発生した場合、ポップアップ画面クローズ
						this.errored.emit();
				}
			);
		}

	}

	/**
	 * 属性タイプレイアウトを初期設定する
	 * @param attrTypeLayoutList 属性タイプレイアウトDTOリスト
	 */
	public initializeAttributeTypeList(attrTypeLayoutList: EIMAttributeTypeLayoutDTO[]): void {
		// 表示対象となるすべての属性タイプを保持
		this.attributeTypeListAll = attrTypeLayoutList;

		// 前回ダウンロード対象とした属性タイプをプリセット
		let preSetAttributeTypeIdList: number[] = this.localStorageService.getCsvDownloadItem(this.criteria.objectTypeDefinitionName);
		let preSetAttributeTypeList: EIMAttributeTypeLayoutDTO[] = [];
		if 	(preSetAttributeTypeIdList !== null) {
			if (preSetAttributeTypeIdList instanceof Array) {
				for (let i = 0 ; i < preSetAttributeTypeIdList.length; i++) {
					let element = this.getElementById(attrTypeLayoutList, preSetAttributeTypeIdList[i]);
					if (element !== undefined && element !== null){
						preSetAttributeTypeList.push(element);
					}
				}
			} else {
				let element = this.getElementById(attrTypeLayoutList, preSetAttributeTypeIdList);
				if (element !== undefined && element !== null){
					preSetAttributeTypeList.push(element);
				}
			}
		}
		this.downloadAttributeTypeListGrid.setData(preSetAttributeTypeList);

		// 属性タイプ一覧表示内容をフィルタ
		this.attributeTypeListGrid.setData(this.filterAttributeType());
	}

	/**
	 * 属性タイプ一覧をフィルタします.
	 * フィルタ文字列とダウンロード対象属性タイプ一覧でフィルタします.
	 * @return 属性タイプリスト
	 */
	public filterAttributeType(): EIMAttributeTypeLayoutDTO[] {

		let rtList: EIMAttributeTypeLayoutDTO[] = [];
		Object.assign(rtList, this.attributeTypeListAll);

		// 比較対象文字列
		let filterStr: string = this.filterCondition.filterStr;

		for (let i = 0; i < rtList.length; i++) {

			let isFilter = false;
			let target: EIMAttributeTypeLayoutDTO = rtList[i];
			let definitionName: string = target.definitionName.slice(target.definitionName.indexOf(':'));

			// タイトル属性はフィルタ
			if (target.definitionName === EIMFormsConstantService.ATTRIBUTE_TYPE_NAME_TITLE) {
				// CSVダウンロード時にセットするので保持
				this.attributeTypeIdTitle = target.id;
				isFilter = true;
			}

			// 入力文字列でフィルタ
			// 定義名列と名前列の両方を対象にフィルタ
			if (!definitionName.includes(filterStr) && !target.name.includes(filterStr)) {
				isFilter = true;
			}

			// ダウンロード対象属性タイプリストでフィルタ
			for (let j = 0; j < this.downloadAttributeTypeListGrid.getData().length; j++) {
				let compareTarget: EIMAttributeTypeLayoutDTO = this.downloadAttributeTypeListGrid.getData()[j];
				if (target.id === compareTarget.id) {
					isFilter = true;
					break;
				}
			}

			if (isFilter) {
				rtList.splice(i, 1);
				// ループ対象のリストから要素を削除するため、カウントをデクリメント
				i--;
			}
		}

		return rtList;
	}

	/**
	 * 属性タイプを選択します.
	 * @param attrTypes 属性タイプリスト
	 */
	private selectedAttrType(attrTypes: any[]): void {

		this.downloadAttributeTypeListGrid.info.gridApi.forEachNode(
			function(node) {
				for (let i = 0; i < attrTypes.length; i++) {
					if (node.data.id === attrTypes[i].id) {
						node.setSelected(true);
					}
				}
			}
		);

		this.attributeTypeListGrid.info.selectedData = attrTypes;
	}

	/**
	 * 属性タイプリストの行番号を取得します.
	 * @param id 属性タイプId
	 * @return 行番号
	 */
	private getAttrTypeRowNum(id: number): number {
		for (let i = 0; i < this.downloadAttributeTypeListGrid.getData().length; i++) {
			if (this.downloadAttributeTypeListGrid.getData()[i].id === id) {
				return i;
			}
		}
	}

	/**
	 * 属性タイプを追加します.
	 * @param attrType 属性タイプ
	 * @param index インデックス
	 */
	private insertAttrType(attrType: any, index: number): void {
		let target: any[] = [];
		target.push(attrType);
		this.downloadAttributeTypeListGrid.addRowDataToIndex(target, index);
	}

	/**
	 * 属性タイプを削除します.
	 * @param id 属性タイプId
	 */
	private deleteAttrType(id: number): void {
		// 属性タイプ一覧から除去
		for (let i = 0; i < this.downloadAttributeTypeListGrid.getData().length; i++) {
			if (this.downloadAttributeTypeListGrid.getData()[i].id === id) {
				let target: any[] = [];
				target.push(this.downloadAttributeTypeListGrid.getData()[i]);
				this.downloadAttributeTypeListGrid.removeRowData(target);
				return;
			}
		}
	}

	/**
	 * 属性タイプを移動します.
	 * @param id 属性タイプId
 	 * @param isUp 上へ移動の場合、true
 	 * @return 属性タイプ
	 */
	private moveAttrType(id: number, isUp: boolean): any {

		for (let i = 0; i < this.downloadAttributeTypeListGrid.getData().length; i++) {
			if (this.downloadAttributeTypeListGrid.getData()[i].id === id) {

				// 移動対象属性タイプ情報を保持
				let rowNum: number = this.getAttrTypeRowNum(id);
				let target: any = Object.assign({}, this.downloadAttributeTypeListGrid.getData()[i]);

				// 削除
				this.deleteAttrType(id);
				// 追加
				if (isUp) {
					this.insertAttrType(target, rowNum - 1);
				} else {
					this.insertAttrType(target, rowNum + 1);
				}
				return target;
			}
		}
		return null;
	}

	/**
	 * Idを指定してリストから要素を取得します.
	 * @param target リスト
	 * @param id Id
	 */
	public getElementById(target: any[], id: number): any {
		for (let i = 0; i < target.length; i++) {
			if (target[i].id === id) {
				return target[i];
			}
		}
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {

		let columns: EIMDataGridColumn[] = null;

		columns = [];
		columns.push({field: 'displayDefinitionName', headerName: this.translateService.instant('EIM.LABEL_02021'), width: 195, suppressFilter: true});
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 180, suppressFilter: true});
		this.attributeTypeListGrid.setColumns(columns);
		// 属性タイプ一覧データグリッドの同一データ判定関数
		this.attributeTypeListGrid.info.equals = (checkTargetData: any, selectData: any): boolean => {
			return checkTargetData.id === selectData.id;
		};

		columns = [];
		columns.push({field: 'displayDefinitionName', headerName: this.translateService.instant('EIM.LABEL_02021'), width: 200, suppressSorting: true, suppressFilter: true});
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 180, suppressSorting: true, suppressFilter: true});
		this.downloadAttributeTypeListGrid.setColumns(columns);
		// ダウンロード対象一覧データグリッドの同一データ判定関数
		this.downloadAttributeTypeListGrid.info.equals = (checkTargetData: any, selectData: any): boolean => {
			return checkTargetData.id === selectData.id;
		};
	}

	/**
	 * 子コンポーネントのビュー生成後の処理です.
	 */
	ngAfterViewInit() {
		setTimeout(() => {
			// 画面表示処理
			this.show();
		});
	}

	/**
	 * フィルタボタン押下時イベントハンドラです.
	 * @param event イベント
	 */
	onClickFilter(event: any) {

		// 属性タイプ一覧表示対象
		let displayAttributeTypeList: EIMAttributeTypeDTO[] = [];
		// 属性タイプ一覧表示内容をフィルタ
		this.attributeTypeListGrid.setData(this.filterAttributeType());
	}

	/**
	 * ダウンロード対象属性タイプ一覧へ追加ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickMoveRight(event: any) {
		let attributeTypeListSelectedData: any[] = this.attributeTypeListGrid.getSelectedData();
		if (attributeTypeListSelectedData.length === 0) {
			return;
		}

		// ダウンロード対象一覧に追加し、選択状態に設定
		this.downloadAttributeTypeListGrid.addRowData(attributeTypeListSelectedData);

		// 属性タイプ一覧表示内容をフィルタ
		let rowIndex: number = this.attributeTypeListGrid.getFirstRowIndex();
		let scrollTop: number = this.attributeTypeListGrid.getScrollTop();
		this.attributeTypeListGrid.setData(this.filterAttributeType());
		this.attributeTypeListGrid.setSelectRow(rowIndex, scrollTop);
	}

	/**
	 * ダウンロード対象属性タイプ一覧から削除ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickMoveLeft(event: any) {
		let downloadAttributeTypeListSelectedData: any[] = this.downloadAttributeTypeListGrid.getSelectedData();
		if (downloadAttributeTypeListSelectedData.length === 0) {
			return;
		}
		// ダウンロード対象一覧から除去
		let rowIndex: number = this.downloadAttributeTypeListGrid.getFirstRowIndex();
		let scrollTop: number = this.downloadAttributeTypeListGrid.getScrollTop();
		this.downloadAttributeTypeListGrid.removeRowData(downloadAttributeTypeListSelectedData);
		this.downloadAttributeTypeListGrid.setSelectRow(rowIndex, scrollTop);

		// 属性タイプ一覧表示内容をフィルタ
		this.attributeTypeListGrid.setData(this.filterAttributeType());
	}

	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickMoveUp(event: any) {

		let moveCnt = 0;
		let moveAttrTypes: any[] = [];

		for (let i = 0; i < this.downloadAttributeTypeListGrid.getData().length; i++) {

			for (let j = 0; j < this.downloadAttributeTypeListGrid.getSelectedData().length; j++) {

				if (this.downloadAttributeTypeListGrid.getData()[i].id === this.downloadAttributeTypeListGrid.getSelectedData()[j].id) {

					// 選択アイテムのインデックス取得
					let rowNum: number = this.getAttrTypeRowNum(this.downloadAttributeTypeListGrid.getSelectedData()[j].id);
					if (rowNum > moveCnt) {
						// 1つ上の行へ移動
						let moveAttrType = this.moveAttrType(this.downloadAttributeTypeListGrid.getData()[i].id, true);
						moveAttrTypes.push(moveAttrType);
					}
					moveCnt++;
				}
			}
		}

		// 移動行を選択
		this.selectedAttrType(moveAttrTypes);
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickMoveDown(event: any) {
		let rowCnt: number = this.downloadAttributeTypeListGrid.getData().length - 1;
		let moveCnt = 0;
		let moveAttrTypes: any[] = [];

		for (let i = this.downloadAttributeTypeListGrid.getData().length - 1; i > -1; i--) {

			for (let j = 0; j < this.downloadAttributeTypeListGrid.getSelectedData().length; j++) {

				if (this.downloadAttributeTypeListGrid.getData()[i].id === this.downloadAttributeTypeListGrid.getSelectedData()[j].id) {

					// 選択アイテムのインデックス取得
					let rowNum: number = this.getAttrTypeRowNum(this.downloadAttributeTypeListGrid.getSelectedData()[j].id);
					if (rowNum < rowCnt - moveCnt) {
						// 1つ下の行へ移動
						let moveAttrType = this.moveAttrType(this.downloadAttributeTypeListGrid.getData()[i].id, false);
						moveAttrTypes.push(moveAttrType);
					}
					moveCnt++;
				}
			}
		}

		// 移動行を選択
		this.selectedAttrType(moveAttrTypes);
	}
}
