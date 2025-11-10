import { Injectable } from '@angular/core';
import { Component, ViewChild, OnInit, Input, Output, HostListener, EventEmitter, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMFolderService, EIMFolder, EIMFolderType } from 'app/documents/shared/services/apis/folder.service';
import { EIMCirculationService, EIMCirculationList } from 'app/documents/shared/services/apis/circulation.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMAttributeTreeService } from 'app/documents/shared/services/apis/attribute-tree.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMTagService } from 'app/documents/shared/services/apis/tag.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { takeUntil } from 'rxjs/operators';

namespace accordionIndex {
	export const WORKSPACE = 0;
	export const SEARCH = 1;
	export const CIRCULATION_SITUATION = 2;
	export const ATTRIBUTE_TREE = 3;
}

	

/**
 * コンテンツリストコンポーネントサービス.
 * 本クラスはデータグリッドコンポーネントサービスを継承しています.
 */
@Injectable()
export class EIMContentsListComponentService extends EIMDataGridComponentService {

	/** グリッドデータ更新日時 */
	private updateDateTime: Date;

	/** 検索結果保持リスト */
	public textExcerptModeList: any[];
	public listModeList: any[];
	public thumbnailModeList: any[];

	/**
	 * コンストラクタです.
	 */
	constructor(
			private folderService: EIMFolderService,
			private attributeTreeService: EIMAttributeTreeService,
			protected translateService: TranslateService,
			protected circulationService: EIMCirculationService,
			protected documentFormService: EIMDocumentFormService,
			protected documentTagService: EIMTagService,
			protected messageService: EIMMessageService,
			protected dateService: EIMDateService,
			protected localStorageService: EIMLocalStorageService,
		) {
		super(translateService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期化します.
	 * @param info データグリッドコンポーネント情報
	 * @param serviceParam パラメータ
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 */
	public initialize(info: EIMListComponentInfo<any>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {

		if (serviceParam.accordionActiveIndex === accordionIndex.WORKSPACE) {
			if (!serviceParam || !serviceParam.selectedTreeNode) {
				// 一覧表示内容変更
				super.setData(info, []);

				super.initialize(info, serviceParam, initialized, selected);

				return;
			}

			// グリッドデータ更新日時を更新
			this.updateDateTime = serviceParam.eventDateTime;

			// タグ配下か確認する
			let tagObjectIds = [];
			let treeNode = serviceParam.selectedTreeNode;
			let checkParent: (parentData: any) => boolean = (parent: any) => {
				if (parent.objTypeName) {
					tagObjectIds.push(parent.objId);
						// objNameがタグの場合
					if (parent.objTypeName  === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
						return true;
					}
				}
				// parent内に上位のparentDataがある場合、上位のparentをチェックする
				if (parent.parent) {
					return checkParent(parent.parent);
				} else {
					return false;
				}
			}
			if (!checkParent(treeNode)) {
				tagObjectIds = [];
			} else {
				tagObjectIds = tagObjectIds.reverse();
			}

			this.folderService.getChildObjects(Number(serviceParam.selectedTreeNode.objId), tagObjectIds, false)
			.pipe(
				takeUntil(serviceParam.destroy$)
			)
			.subscribe(data => {
				// グリッド表示
				this.editGrid(data, info, serviceParam, initialized, selected);
			}, (err: any) => {
				// 一覧をクリア
				super.setData(info, []);
				(info as EIMDataGridComponentInfo).errored.emit('initialize');
			});
		} else if (serviceParam.accordionActiveIndex === accordionIndex.SEARCH) {
			// 検索
			let result: any;
			this.documentFormService.search(serviceParam.params).
			subscribe( (resultList: any) => {
				// resultList[0]・・・グリッド表示用データリスト
				// resultList[1]・・・ファセット表示用データリスト
				// resultList[2]・・・ヒット件数（numFounds）
				// データが取得できなかった場合エラー
				if (resultList[0].length === 0) {
					
					if (serviceParam.accordionSearch.facetUpdateFlg === true) {
						// 通常検索時のみファセット表示制御を行い、ファセット検索時は制御しない
						serviceParam.accordionSearch.facetDispFlg = false;
					}
					// 検索結果が0件となるため、CSVダウンロードボタンは非活性とする
					serviceParam.accordionSearch.disabledCsvDownloadFlg = true;

					// メッセージ表示
					this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.ERROR_00046'));
					
					// 保持しているデータをクリア
					this.clearDataList()

					// 検索ヒット数
					info.hitCount = resultList[2];

					// 検索結果をクリア
					super.setData(info, []);
					return;
				} else if (resultList[0].length !== resultList[2]){
					// 結果データの件数とヒット件数に差異があった場合にメッセージを表示
					this.messageService.showGrowl
					(this.translateService.instant('EIM_DOCUMENTS.INFO_00045', {value: resultList[0].length,value2: resultList[2]}));
				}
				for (let i=0; i<resultList[0].length; i++) {
					for (let prop in resultList[0][i].attr){
						if (prop.indexOf('multivalue') > -1) {
							let item = serviceParam.accordionSearch.customAttributeItems.find(el => el.attType === prop);
							if (item.dataType === 2) {
								for (let j=0; j<resultList[0][i].attr[prop].length; j++ ) {
									// Date型の複数値について、ミリ秒から日付フォーマットに変換する
									resultList[0][i].attr[prop][j] = this.dateService.getDateTimeString(resultList[0][i].attr[prop][j]).replace(" 00:00:00","");
								}
							}
						}
					}

					if (resultList[0][i].attr !== null) {
						// 返却値attr（拡張属性）をsetData用に連想配列に設定する
						Object.keys(resultList[0][i].attr).forEach( function(value) {
							resultList[0][i][value] = this[value];
						}, resultList[0][i].attr)
					}
				}

				/** データクリアフラグがtrueの場合データリストをクリア */
				if(serviceParam.accordionSearch.dataClearFlg === true){
					this.clearDataList();
				}

				// 検索ヒット数
				info.hitCount = resultList[2];

				// 表示モードに応じてデータを保持
				if (serviceParam.params.displayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT){
					this.textExcerptModeList = resultList[0];
				}else if(serviceParam.params.displayTypeId === EIMConstantService.DISPLAY_LIST){
					this.listModeList = resultList[0];
				}else{
					this.thumbnailModeList = resultList[0];
				}
				super.setData(info, resultList[0]);	

				// ファセット選択以外による検索時
				if (serviceParam.accordionSearch.facetUpdateFlg) {
					// 通常ファセットの設定
					serviceParam.accordionSearch.tree.initialize();
					serviceParam.accordionSearch.tree.setData(this.getNormalFacet(serviceParam, resultList));

					// 日付ファセットの設定
					serviceParam.accordionSearch.checkTree.initialize();
					serviceParam.accordionSearch.checkTree.setData(this.getDateFacet(resultList));
				// ファセット選択による検索時
				} else {
					if (serviceParam.accordionSearch.selectedTree === EIMConstantService.FACET_TYPE_RANGE_DATE){
						// 日付ファセット選択時の処理の場合、日付以外のファセットの選択状態を初期化する
						let data = serviceParam.accordionSearch.tree.info.data;
						serviceParam.accordionSearch.tree.initialize();
						serviceParam.accordionSearch.tree.setData(data);

					} else {
						// 日付以外のファセット選択時の処理の場合、日付ファセットの選択状態を初期化する
						let data = serviceParam.accordionSearch.checkTree.info.data;
						serviceParam.accordionSearch.checkTree.initialize();
						serviceParam.accordionSearch.checkTree.setData(data);
					}
				}

				// 活性・表示制御
				serviceParam.accordionSearch.disabledCsvDownloadFlg = false;
				serviceParam.accordionSearch.facetDispFlg = true;
			}, (err: any) => {
				result = {resultList: [], message: err.message};
				// 一覧をクリア
				super.setData(info, []);
				(info as EIMDataGridComponentInfo).errored.emit('initialize');
			});


		} else if (serviceParam.accordionActiveIndex === accordionIndex.CIRCULATION_SITUATION) {
			// 検索実行
			this.circulationService.getCirculationList(serviceParam.params).subscribe(
				(res: EIMCirculationList[]) => {
					// データが取得できなかった場合エラー
					if (res.length === 0) {
						serviceParam.circulation.disabledCsvDownloadFlg = true;
						this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00046'));
						super.setData(info, []);
						return;
					}
					super.setData(info, res);
					serviceParam.circulation.disabledCsvDownloadFlg = false;
				}, (err: any) => {
					// 一覧をクリア
					super.setData(info, []);
					(info as EIMDataGridComponentInfo).errored.emit('initialize');
				}
			);
		} else if (serviceParam.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
			// 属性ツリービュー選択時
			if (serviceParam.selectedTreeNode.isLeaf === true || serviceParam.selectedTreeNode.isLeaf === 'true') {

				this.attributeTreeService.getAttrChildObjects(serviceParam.selectedTreeNode.attrTreeId, serviceParam.selectedTreeNode.attrTreePath, serviceParam.selectedTreeNode.attrTreeSettings, serviceParam.selectedTreeNode.attrTreeValues)
				.subscribe(data => {
					this.editAttrGrid(serviceParam, data, info, initialized, selected, false);
				}, (err: any) => {
					// 一覧をクリア
					super.setData(info, []);
					(info as EIMDataGridComponentInfo).errored.emit('initialize');
				});

			} else {
				// 属性値の場合
				if (serviceParam.selectedTreeNode.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE) {

					this.attributeTreeService.getAttrTreeChild(serviceParam.selectedTreeNode.attrTreeId, serviceParam.selectedTreeNode.attrTreePath, serviceParam.selectedTreeNode.attrTreeSettings, serviceParam.selectedTreeNode.attrTreeValues)
					.subscribe(data => {

						this.editAttrGrid(serviceParam, data, info, initialized, selected, false);

					}, (err: any) => {
						// 一覧をクリア
						super.setData(info, []);

						(info as EIMDataGridComponentInfo).errored.emit('initialize');
					});
				} else if (serviceParam.selectedTreeNode.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
					// フォルダの場合
					this.attributeTreeService.getAttrChildFolders(serviceParam.selectedTreeNode.attrTreeId, serviceParam.selectedTreeNode.attrTreePath, serviceParam.selectedTreeNode.attrTreeSettings, serviceParam.selectedTreeNode.attrTreeValues, serviceParam.selectedTreeNode.data.objId)
					.subscribe(data => {

						this.editAttrGrid(serviceParam, data, info, initialized, selected, true);
					});
				}
			}

		}
	}

	/** 保持しているデータリストのクリア */
	public clearDataList(){
		this.textExcerptModeList = [];
		this.listModeList = [];
		this.thumbnailModeList = [];
	}

	/**
	 * 不足情報を親から補完します.
	 * @param parentNode
	 * @param childNode
	 */
	public complementChildAttrFolderData(parentNode: any, childNode: any[]): void {

		for (let i = 0; i < childNode.length; i++) {
			childNode[i].attrTreeId = parentNode.attrTreeId;
			childNode[i].attrTreeSettings = parentNode.attrTreeSettings;
			childNode[i].attrTreePath = parentNode.attrTreePath + childNode[i].label + '/';
			if (parentNode.attrTreeValues && parentNode.attrTreeValues.length > 0) {
				childNode[i].attrTreeValues = [].concat(parentNode.attrTreeValues);
			} else {
				childNode[i].attrTreeValues = [];
			}
			if (childNode[i].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE) {
				childNode[i].attrTreeValues.push(childNode[i].value);
			} else {
				childNode[i].attrTreeValues.push(String(childNode[i].objId));
				childNode[i].value = String(childNode[i].objId);
			}
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 属性ツリービュー選択時のグリッド表示処理です
	 * @param serviceParam パラメータ
	 * @param data 対象データ
	 * @param info データグリッドコンポーネント情報
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 * @param needAccessAuthority アクセス権限取得有無
	 */
	private editAttrGrid (serviceParam: any, data: any, info: EIMListComponentInfo<any>, initialized: EventEmitter<any>, selected: EventEmitter<any>, needAccessAuthority: boolean): void {
		if (!serviceParam.hasOwnProperty('noUpdate') || !serviceParam.noUpdate) {

			if (serviceParam.selectedTreeNode.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {

				this.attributeTreeService.getAttrChildObjects(serviceParam.selectedTreeNode.attrTreeId, serviceParam.selectedTreeNode.attrTreePath, serviceParam.selectedTreeNode.attrTreeSettings, serviceParam.selectedTreeNode.attrTreeValues, serviceParam.selectedTreeNode.data.objId)
				.subscribe(objectList => {
					// データ変換
					this.transformData(objectList, serviceParam.selectedTreeNode.isTrash);
					// 不足情報を親から補完する
					this.complementChildAttrFolderData(serviceParam.selectedTreeNode, objectList);
					// 一覧表示内容変更
					super.setData(info, objectList);
				}, (err: any) => {
					// 一覧をクリア
					super.setData(info, []);
					(info as EIMDataGridComponentInfo).errored.emit('initialize');
				});

			} else {
				// データ変換
				this.transformData(data, serviceParam.selectedTreeNode.isTrash);
				// 不足情報を親から補完する
					this.complementChildAttrFolderData(serviceParam.selectedTreeNode, data);
				// 一覧表示内容変更
				super.setData(info, data);
			}
		}

		serviceParam.contentsList = data;

		// 選択行を設定する
		if (serviceParam.selectionTargetRows && serviceParam.selectionTargetRows.length > 0) {

			let targetRows: any[] = [];
			for (let i = 0; i < serviceParam.selectionTargetRows.length; i++) {
				let row: any = serviceParam.selectionTargetRows[i];
				targetRows.push(row);
			}
			// 選択行を設定する
			super.select(info, targetRows);
			// 選択行の行番号を取得する
			let rowIndex: number = (info as EIMDataGridComponentInfo).gridOptions.context.getRowIndex();
			// 選択行までスクロールする
			if (rowIndex >= 0) {
				(info as EIMDataGridComponentInfo).gridOptions.context.ensureIndexVisible(rowIndex);
			}
		}
		if (needAccessAuthority) {
			this.folderService.getAccessAuthority(Number(serviceParam.selectedTreeNode.data.objId), false)
			.subscribe(accessAuthority => {
				serviceParam.selectedTreeNode.auth = accessAuthority;
			// リスト取得結果をイベントで通知
			super.initialize(info, serviceParam, initialized, selected);
			});
		} else {
			// リスト取得結果をイベントで通知
			super.initialize(info, serviceParam, initialized, selected);
		}
	}

	/**
	 * グリッド表示処理です.
	 * @param paramData 対象データ
	 * @param info データグリッドコンポーネント情報
	 * @param serviceParam パラメータ
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 */
	private editGrid(paramData: any, info: EIMListComponentInfo<any>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {
		// グリッドデータを更新した日時がイベント実行日時よりも古い場合は
		// グリッドデータを更新する(最新のデータを反映させるため)
		if (this.isRefresh(serviceParam.eventDateTime)) {

			if (!serviceParam.hasOwnProperty('noUpdate') || !serviceParam.noUpdate) {
				if(serviceParam.selectedTreeNode.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
					serviceParam.selectedTreeNode.isTrash = true;
				}
				// データ変換
				this.transformData(paramData, serviceParam.selectedTreeNode.isTrash);
				// 一覧表示内容変更
				// ワークスペース固有ごみ箱はグリッドに表示しない
				let gridDatas: any[] = [];
				for (let i = 0; i < paramData.length; i++) {
					let gridItem = paramData[i];
					if (gridItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
						break;
					}
					gridDatas.push(gridItem);
				}
				super.setData(info, gridDatas);
			}
			serviceParam.contentsList = paramData;

			let targetDocumentLink = false;
			if (serviceParam.hasOwnProperty('targetDocumentLink')) {
				targetDocumentLink = serviceParam.targetDocumentLink;
			}

			// 選択行を設定する
			if (serviceParam.selectionTargetRows && serviceParam.selectionTargetRows.length > 0) {

				// 選択行を設定する
				super.select(info, serviceParam.selectionTargetRows, null, targetDocumentLink);
				// 選択行の行番号を取得する
				let rowIndex: number = (info as EIMDataGridComponentInfo).gridOptions.context.getRowIndex();
				// 選択行までスクロールする
				if (rowIndex >= 0) {
					(info as EIMDataGridComponentInfo).gridOptions.context.ensureIndexVisible(rowIndex);
				}
			}

			if (serviceParam.selectedTreeNode.objTypeName !== EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE) {
				// フォルダに対する権限を取得する
				this.folderService.getAccessAuthority(Number(serviceParam.selectedTreeNode.objId), false)
				.subscribe(data => {
					serviceParam.selectedTreeNode.auth = data;
					// リスト取得結果をイベントで通知
					super.initialize(info, serviceParam, initialized, selected);
				});
			}
		}
	}

	/**
	 * グリッドデータを更新するかしないのかを判定します.
	 * @param eventDateTime イベント発生日時
	 * @return 更新する場合true、更新しない場合false
	 */
	private isRefresh(eventDateTime: Date): boolean {

		if (!this.updateDateTime) {
			return true;
		}
		if (!eventDateTime) {
			return true;
		}
		if (this.updateDateTime.getTime() === eventDateTime.getTime()) {
			return true;
		}
		return false;
	}

	/**
	 * データ変換を行います.
	 * @param data 対象データ
	 * @param isTrash ごみ箱内データであるか
	 * @return 変換後データ
	 */
	private transformData(data: any[], isTrash: boolean): any[] {
		for (let i = 0; i < data.length; i++) {
			// ごみ箱内データの場合、フォルダに対してisNoLink=trueを設定する
			if (isTrash && data[i].isDocument === 'false' || data[i].isDocument === false) {
				data[i].isNoLink = true;
			}
			// 履歴の場合、'-'を''に置換する。数値型にキャストする。
			if (data[i].rev === '-') {
				data[i].rev = null;
			} else {
				data[i].rev = Number(data[i].rev);
			}
		}
		return data;
	}

	/**
	 * 通常ファセットを取得します
	 * @param data 対象データ
	 * @param isTrash ごみ箱内データであるか
	 * @return 変換後データ
	 */
	private getNormalFacet(serviceParam, resultList): any {
		// ファセットツリー初期化
		serviceParam.accordionSearch.tree.setData([]);
		let prevFieldDisplayName = resultList[1][0].fieldDisplayName;
		let parentNode: EIMTreeNode[] = [];
		let childNodes: EIMTreeNode[] = [];
		let parentIndex = 0;
		let fieldDisplayName = "";
		for (let i=0; i < resultList[1].length; i++) {
			if (resultList[1][i].facetType !== EIMConstantService.FACET_TYPE_RANGE_DATE ){
				let facetListLength = resultList[1][i].facetList.length;
				fieldDisplayName = resultList[1][i].fieldDisplayName;
				if (prevFieldDisplayName !== fieldDisplayName){
					if (childNodes.length !== 0) {
						// 属性タイトル設定
						parentNode.push({
							label: prevFieldDisplayName,
							selectable: false,
							expanded: true,
							type:"title",
						});

						serviceParam.accordionSearch.tree.setChildren(parentNode[parentIndex], childNodes);
						parentIndex++;
					}

					// 子ノード初期化
					childNodes = [];
					prevFieldDisplayName = fieldDisplayName;
				}

				for (let j=0; j < facetListLength; j++){
					if (resultList[1][i].facetType === EIMConstantService.FACET_TYPE_VALUE
						&& resultList[1][i].facetList[j].count !== 0){
						// バリューファセット
						// ツリーの子要素を生成
						childNodes.push({
							label: resultList[1][i].facetList[j].name + " (" + resultList[1][i].facetList[j].count + ")",
							leaf: true,
							selectable: true,
							status: 0,
							targetDocType: 0,
							type: resultList[1][i].facetType,
							data: resultList[1][i].fieldName + "," + resultList[1][i].facetList[j].name,
						});
					} else if(resultList[1][i].facetType === EIMConstantService.FACET_TYPE_RANGE_NUMERIC) {
						// 数値レンジファセット
						if (j === 0 && resultList[1][i]['before'] && resultList[1][i].before !== 0){
							// 数値レンジファセットのbeforeの設定
							childNodes.push({
								label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02143', {value: resultList[1][i].facetList[0].from})
										+ "(" + resultList[1][i].before + ")",
								leaf: true,
								selectable: true,
								status: 0,
								targetDocType: 0,
								type: resultList[1][i].facetType,
								data: resultList[1][i].fieldName + "," + "," + resultList[1][i].facetList[0].from,
							});
						}

						// ツリーの子要素を生成
						if (resultList[1][i].facetList[j].count !== 0) {
							childNodes.push({
								label: resultList[1][i].facetList[j].from + "-" + resultList[1][i].facetList[j].to + " (" + resultList[1][i].facetList[j].count + ")",
								leaf: true,
								selectable: true,
								status: 0,
								targetDocType: 0,
								type: resultList[1][i].facetType,
								data: resultList[1][i].fieldName + "," + resultList[1][i].facetList[j].from + "," + resultList[1][i].facetList[j].to,
							});
						}
					}
				}
				// レンジファセットのafterの設定
				if (resultList[1][i].facetType === EIMConstantService.FACET_TYPE_RANGE_NUMERIC
						&& resultList[1][i]['after'] && resultList[1][i].after !== 0){
					// ツリーの子要素を生成
					childNodes.push({
						label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02142', {value: resultList[1][i].facetList[facetListLength-1].to})
								+ "(" + resultList[1][i].after + ")",
						leaf: true,
						selectable: true,
						status: 0,
						targetDocType: 0,
						type: resultList[1][i].facetType,
						data: resultList[1][i].fieldName + "," + resultList[1][i].facetList[facetListLength-1].to + ",",
					});

				}
			}

		}
		if (childNodes.length !== 0) {
			// 最終ノード用処理
			parentNode.push({
				label: fieldDisplayName,
				selectable: false,
				expanded: true,
				type:"title",
			});

			serviceParam.accordionSearch.tree.setChildren(parentNode[parentIndex], childNodes);
		}

		return parentNode;
	}

	/**
	 * 日付ファセットを取得します
	 * @param data 対象データ
	 * @param isTrash ごみ箱内データであるか
	 * @return 変換後データ
	 */
	 private getDateFacet(resultList): any {
		// 日付ファセットの設定
		let prevFieldDisplayName = "";
		let prevYear = "";
		let prevMonth = "";

		let titleIndex = -1;
		let yearIndex = -1;
		let monthIndex = -1;

		let titleNode: EIMTreeNode[] = [];
		let yearNode: EIMTreeNode[] = [];
		let monthNode: EIMTreeNode[] = [];
		let dayNode: EIMTreeNode[] = [];

		let yearCount = 0;
		let monthCount = 0;

		for (let i = 0; i < resultList[1].length; i++) {
			if (resultList[1][i].facetType === EIMConstantService.FACET_TYPE_RANGE_DATE) {
				let facetListLength = resultList[1][i].facetList.length;
				for (let j = 0; j < resultList[1][i].facetList.length; j++){
					if (resultList[1][i].facetList[j].count !== 0){
						// 日付型valueを YYYY, MM, DDに分解する
						let strDate = this.dateService.getFixedDateTimeString(resultList[1][i].facetList[j].from);

						let year = strDate.substr(0,4);
						let month = strDate.substr(4,2);
						let day = strDate.substr(6,2);

						if (resultList[1][i].fieldDisplayName !== prevFieldDisplayName) {
							titleIndex++;

							// フィールドが変わったタイミングでタイトル追加
							titleNode.push({
								label: resultList[1][i].fieldDisplayName,
								selectable: false,
								expanded: true,
								leaf: false,
								type:"title",
								styleClass:"treeTitleClass",
							});

							prevFieldDisplayName = resultList[1][i].fieldDisplayName;
							// 初期化
							prevYear = "";
							prevMonth = "";
							yearIndex = -1;
							monthIndex = -1;
							yearNode = [];
							monthNode = [];
							dayNode = [];
						}

						if (j === 0 && resultList[1][i]['before'] && resultList[1][i].before !== 0){
							// 日付レンジファセットのbeforeの設定
							let dt = new Date(resultList[1][i].facetList[0].from);
							let month = dt.getMonth()+1;
							yearNode.push({
								label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02145', {
															value: this.getDateLabel(dt.getFullYear().toString(), 
																					this.toDoubleDigits(month.toString()), 
																					this.toDoubleDigits(dt.getDate().toString())
															)}) + " (" + resultList[1][i].before + ")",
								leaf: true,
								selectable: true,
								status: 0,
								targetDocType: 0,
								type: resultList[1][i].facetType,
								data: resultList[1][i].fieldName + "," + "," + resultList[1][i].facetList[0].from,
							});
							yearIndex++;
						}

						if (prevYear !== year){
							// 年が変わるタイミングで行う処理
							yearNode.push({
								selectable: true,
								expanded: true,
								type: resultList[1][i].facetType,
								data: resultList[1][i].fieldName + "," + resultList[1][i].facetList[j].from + "," + resultList[1][i].facetList[j].to,
							});

							// 月ノードをリセット
							monthNode = [];
							monthIndex = -1;
							// 件数カウント変数をリセット
							yearCount = 0;
							// 年ノード書き換え用のインデックス更新
							yearIndex++;

							prevYear = year;
						}

						if (prevMonth !== month){
							// 月が変わるタイミングで行う処理
							monthNode.push({
								selectable: true,
								expanded: true,
								type: resultList[1][i].facetType,
								data: resultList[1][i].fieldName + "," + resultList[1][i].facetList[j].from + "," + resultList[1][i].facetList[j].to,
							});
							// 年ノードの子要素に反映
							yearNode[yearIndex].children = monthNode;
							yearNode[yearIndex].label = this.getYearLabel(year ,yearCount);

							// 日付ノードをリセット
							dayNode = [];
							// 件数カウント変数をリセット
							monthCount = 0;
							// 月ノード書き換え用のインデックス更新
							monthIndex++;

							prevMonth = month;
						}


						dayNode.push({
							label: this.getDayLabel(day, resultList[1][i].facetList[j].count),
								selectable: true,
								expanded: true,
								type: resultList[1][i].facetType,
								data: resultList[1][i].fieldName + "," + resultList[1][i].facetList[j].from + "," + resultList[1][i].facetList[j].to,
							});
						// 日をプッシュする度に月ノードと年ノードの子要素に反映
						monthCount = monthCount + resultList[1][i].facetList[j].count;
						monthNode[monthIndex].label = this.getMonthLabel(month, monthCount);
						monthNode[monthIndex].children = dayNode;

						yearCount = yearCount + resultList[1][i].facetList[j].count;
						yearNode[yearIndex].label = this.getYearLabel(year, yearCount);
						titleNode[titleIndex].children = yearNode;
				}
				}
				// レンジファセットのafterの設定
				if (resultList[1][i].facetType === EIMConstantService.FACET_TYPE_RANGE_DATE 
						&& resultList[1][i]['after'] && resultList[1][i].after !== 0){
					let dt = new Date(resultList[1][i].facetList[facetListLength-1].to);
					let month = dt.getMonth()+1;
					yearNode.push({
						label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02146', {
							value: this.getDateLabel(dt.getFullYear().toString(), 
													this.toDoubleDigits(month.toString()), 
													this.toDoubleDigits(dt.getDate().toString())
							)}) + " (" + resultList[1][i].after + ")",
						leaf: true,
						selectable: true,
						status: 0,
						targetDocType: 0,
						type: resultList[1][i].facetType,
						data: resultList[1][i].fieldName + "," + resultList[1][i].facetList[facetListLength-1].to + ",",
					});
					titleNode[titleIndex].children = yearNode;
				}
			}
		}
		return titleNode;
	}

	private toDoubleDigits(num: string) {
		num += "";
		if (num.length === 1) {
		  num = "0" + num;
		}
	   return num;     
	  };

	private getDateLabel(year: string, month: string, day: string) :string {
		let labelString = '';
		switch (this.localStorageService.getLangId()) {
			case 'JA':
				labelString = year + "年" + month + "月" + day + "日";
				break;
			case 'EN':
				labelString = month + "-" + day + "-" + year;
				break;
			default:	
				break;
		}
		return labelString;
	}

	private getYearLabel(year: string, yearCount: number) :string {
		let labelString = '';
		switch (this.localStorageService.getLangId()) {
			case 'JA':
				labelString = year + "年 (" + yearCount + ") ";
				break;
			case 'EN':
				labelString = year + " (" + yearCount + ") ";
				break;
			default:
				break;
		}
		return labelString;
	}

	private getMonthLabel(month: string, monthCount: number) :string {
		let labelString = '';
		switch (this.localStorageService.getLangId()) {
			case 'JA':
				labelString = month + "月" + " (" + monthCount + ")";
				break;
			case 'EN':
				switch (month) {
					case '01':
						labelString = "January" + " (" + monthCount + ")";
						break;
					case '02':
						labelString = "February" + " (" + monthCount + ")";
						break;
					case '03':
						labelString = "March" + " (" + monthCount + ")";
						break;
					case '04':
						labelString = "April" + " (" + monthCount + ")";
						break;
					case '05':
						labelString = "May" + " (" + monthCount + ")";
						break;
					case '06':
						labelString = "June" + " (" + monthCount + ")";
						break;
					case '07':
						labelString = "July" + " (" + monthCount + ")";
						break;
					case '08':
						labelString = "August" + " (" + monthCount + ")";
						break;
					case '09':
						labelString = "September" + " (" + monthCount + ")";
						break;
					case '10':
						labelString = "October" + " (" + monthCount + ")";
						break;
					case '11':
						labelString = "November" + " (" + monthCount + ")";
						break;
					case '12':
						labelString = "December" + " (" + monthCount + ")";
						break;
				}
				break;
			default:
				break;
		}
		return labelString;
	}

	private getDayLabel(date: string, dateCount: number) :string {
		let labelString = '';
		switch (this.localStorageService.getLangId()) {
			case 'JA':
				labelString = date + "日 (" + dateCount + ") ";
				break;
			case 'EN':
				labelString = date + " (" + dateCount + ") ";
				break;
			default:
				break;
		}
		return labelString;
	}

}
