import { EIMAttributeDomain } from '../../../shared/domains/entity/attribute.domain';
import { EIMFormTypeFolderDTO } from '../../../shared/dtos/form-type-folder.dto';
import { EIMFormTypeDTO } from '../../../shared/dtos/form-type.dto';
import { EIMFormsConstantService } from '../../shared/services/forms-constant.service';
import { EIMFormSearchConditionComponent } from '../form-search-condition/form-search-condition.component';
import { EIMFormSearchConditionComponentService } from '../form-search-condition/form-search-condition.component.service';
import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable ,  Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponentInfo } from 'app/shared/shared.interface';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDialogManagerComponentService } from 'app/forms/shared/components/dialog-manager/dialog-manager.component.service';

import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMFormService } from 'app/forms/shared/services/apis/form.service';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';

import { EIMFormTypeDisplayColumn, EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';

import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMWorkspaceTreeNode, EIMWorkspaceTreeComponentService } from 'app/forms/components/workspace-tree/workspace-tree.component.service';
import { EIMFormCriteria } from 'app/shared/domains/criteria/form.criteria';
import { EIMFormWorkspaceDTO } from 'app/shared/dtos/form-workspace.dto';
import { EIMFormDTO } from 'app/shared/dtos/form.dto';
import { EIMFormListComponentService } from 'app/forms/components/form-list/form-list.component.service';
import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';
import { EIMFormDisplayColumnService } from 'app/forms/shared/services/form-display-column.service';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';

/**
 * 帳票メインコンポーネント情報インタフェース
 */
export interface EIMFormMainComponentInfo extends EIMComponentInfo {

	// ワークスペースツリー
	workspaceTree?: EIMTreeComponent;
	// ワークスペースツリーコンポーネントサービス
	workspaceTreeComponentService?: EIMWorkspaceTreeComponentService;
	// 処理待ちツリー
	processingTree?: EIMTreeComponent;

	// コンテンツ一覧
	contentsList?: EIMDataGridComponent;
	// 検索条件アコーディオン
	searchConditionAccordion?: EIMFormSearchConditionComponent;
	// 帳票一覧コンポーネントサービス
	formListComponentService?: EIMFormListComponentService;

	// アコーディオン選択インデックス
	accordionActiveIndex?: number;
	// 選択ツリーノード
	selectedTreeNode?: EIMWorkspaceTreeNode;
	// 選択帳票タイプ
	selectedFormType?: any;
	// 選択帳票タイプの表示列
	selectedDisplayColumn?: any;

	// データの追加・更新・削除の完了ハンドラ
	onComplete?(info: EIMFormMainComponentInfo, createdData: EIMFormCreatedData[], updatedData: any[], deletedData: any[], refreshData?: any[]): void;
	// 検索条件表示イベント
	searchCondtionShowed?: EventEmitter<any>;
}

/**
 * 追加データ情報インタフェース
 */
export interface EIMFormCreatedData {
	data: any;
	additionalTarget?: any;
}

/**
 * 追加・更新・削除のデータ情報インタフェース
 */
export interface EIMFormCompleteData {
	createdData?: EIMFormCreatedData[];
	updatedData?: any[];
	deletedData?: any[];
}

/**
 * ドキュメントメインコンポーネントサービス.
 */
@Injectable()
export class EIMFormMainComponentService {

	/** バリデータマップ */
	public validatorMap: any = {
		// 帳票登録
		doFormCreate: [
			this.checkFunctionIsWorkspaceTree,
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
		],
		// 帳票更新
		doFormUpdate: [
		],
		// 流用作成
		doFormDivertCreate: [
			this.checkFunctionIsWorkspaceTree,
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkSelected,
			this.checkSelectedNumberIsOne,
		],
		// 帳票削除
		doFormDelete: [
			this.checkFunctionIsWorkspaceTree,
			this.checkParentSelected,
			this.checkSelected,
		],
		// 元に戻す
		doFormRestore: [
			this.checkFunctionIsWorkspaceTree,
			this.checkParentSelected,
			this.checkSelected,
			this.checkIsGarbageBox,
		],
		// 帳票移動
		doFormMove: [
			this.checkFunctionIsWorkspaceTree,
			this.checkParentSelected,
			this.checkSelected,
			this.checkIsNotGarbageBox,
		],
		// 検索
		doSearch: [

		],
		// アクセス履歴
		doFormAccessHistory: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
		],
		// CSVダウンロード
		doFormCSVDownload: [
			this.checkFunctionIsSearch,
		],
		// 表示列編集
		doDisplayColumnEdit: [
			this.checkFunctionIsNotSearch,
			this.checkParentSelected,
			this.checkIsNotWorkspace,
			this.checkIsNotGarbageBox,
		],
	};


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected formService: EIMFormService,
		protected serverConfigService: EIMServerConfigService,
		protected messageService: EIMMessageService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected formSearchConditionComponentService: EIMFormSearchConditionComponentService,
		protected formCacheService: EIMFormsCacheService,
		protected localStorageService: EIMLocalStorageService,
		protected formDisplayColumnService: EIMFormDisplayColumnService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * メニューに対応したメソッドを実行します.
	 * @param name 実行メソッド名
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 * @param mode モード(1:ワークスペース、2:処理待ち、3:検索)
	 */
	public invokeMethod(name: string, info: EIMFormMainComponentInfo, parentData: any, selectedData: any[], mode: number): void {
		if (!this.validation(name, info, parentData, selectedData, true)) {
			return;
		}
		this[name](info, parentData, selectedData);
	}

	/**
	 * バリデーションを行います.
	 * @param name バリデーション名
	 * @param info コンポーネント情報
	 * @param selectedData 選択データ
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデーション結果
	 */
	public validation(name: string, info: EIMFormMainComponentInfo, parentData: any, selectedData: any[], displayErrorDialog: boolean = false): boolean {
		let validatorList: any[] = this.validatorMap[name];
		if (!validatorList) {
			return false;
		}
		for (let i = 0; i < validatorList.length; i++) {
			if (!validatorList[i](info, parentData, selectedData, this.messageService, this.translateService, displayErrorDialog)) {
				return false;
			}
		}
		return true;
	}


	/**
	 * 新規登録用帳票詳細ウィンドウを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doFormCreate(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showFormCreator(
				info.selectedTreeNode.formWorkspaceId, info.selectedTreeNode.formTypeId, info.selectedTreeNode.formTypeFolderId, info.selectedTreeNode.securityId, {
					created: (data: any[]) => {
						// メイン画面に該当データを追加する
						let createdData: EIMFormCreatedData[] = [];
						for (let i = 0; i < data.length; i++) {
							createdData.push({data: data[i]});
						}
						this.complete(info, {createdData: createdData}, this.translateService.instant('EIM_FORMS.INFO_00005'));

						if (data[0].close) {
							// 帳票詳細画面を閉じる
							this.dialogManagerComponentService.close(dialogId);
						}
					},
					updated: (data: any[]) => {
						// メイン画面の該当データを更新する
						let updatedData: EIMFormCreatedData[] = [];
						for (let i = 0; i < data.length; i++) {
							updatedData.push(data[i]);
						}
						this.complete(info, {updatedData: updatedData}, this.translateService.instant('EIM_FORMS.INFO_00006'));
					},
					statusChanged: (data: any[]) => {
						// 帳票詳細画面を閉じる
						this.dialogManagerComponentService.close(dialogId);

						// メイン画面の該当データを更新する
						let updatedData: EIMFormCreatedData[] = [];
						for (let i = 0; i < data.length; i++) {
							updatedData.push(data[i]);
						}
						this.complete(info, {updatedData: updatedData}, this.translateService.instant('EIM_FORMS.INFO_00007'));

					},
					errored: () => {
						// 帳票詳細画面を閉じる
						this.dialogManagerComponentService.close(dialogId);
					}
				});
	}

	/**
	 * 更新用帳票詳細ウィンドウを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doFormUpdate(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {
		// ワークフローの有無で表示するダイアログを判定
		let status =selectedData[0].statusTypeName;
        let existsWF = status !== null;
	
		let dialogId: string = this.dialogManagerComponentService.showFormDetail(
				selectedData[0].id, info.selectedTreeNode.formWorkspaceId,existsWF, {
					updated: (data: any[]) => {
						// メイン画面の該当データを更新する
						let updatedData: EIMFormCreatedData[] = [];
						for (let i = 0; i < data.length; i++) {
							updatedData.push(data[i]);
						}
						this.complete(info, {updatedData: updatedData}, this.translateService.instant('EIM_FORMS.INFO_00006'));

						if (data[0].close) {
							// 帳票詳細画面を閉じる
							this.dialogManagerComponentService.close(dialogId);
						}
					},
					statusChanged: (data: any[]) => {
						// 帳票詳細画面を閉じる
						this.dialogManagerComponentService.close(dialogId);

						// メイン画面の該当データを更新する
						let updatedData: EIMFormCreatedData[] = [];
						for (let i = 0; i < data.length; i++) {
							updatedData.push(data[i]);
						}
						this.complete(info, {updatedData: updatedData}, this.translateService.instant('EIM_FORMS.INFO_00007'));

					},
					errored: () => {
						// 帳票詳細画面を閉じる
						this.dialogManagerComponentService.close(dialogId);
					}
				});
	}

	/**
	 * 帳票を流用作成します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doFormDivertCreate(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showFormDiversionSelector(parentData.formWorkspaceId, parentData.formTypeId, parentData.formTypeFolderId,
				{
					selected: (data: any[]) => {
						this.dialogManagerComponentService.close(dialogId);
						if (!data || data.length === 0) {
							return;
						}
						let node: EIMWorkspaceTreeNode = data[0];

						dialogId = this.dialogManagerComponentService.showFormNewCopy(node.formWorkspaceId, node.formTypeId, node.formTypeFolderId, node.securityId, selectedData[0].id, {
							created: (data: any[]) => {
								let message: string = this.translateService.instant('EIM_FORMS.INFO_00005');
								if (parentData.formWorkspaceId === node.formWorkspaceId && parentData.formTypeId === node.formTypeId && parentData.formTypeFolderId === node.formTypeFolderId) {
									// 同じ場所に作成する場合、通常の処理でメイン画面に該当データを追加する

									let createdData: EIMFormCreatedData[] = [];
									for (let i = 0; i < data.length; i++) {
										createdData.push({data: data[i]});
									}
									this.complete(info, {createdData: createdData}, message);
								} else {
									// 異なる場所に作成する場合、
									// 選択ツリーアイテムを流用先の帳票タイプ、または帳票タイプフォルダに変更して作成した帳票を選択状態にする

									data[0].type = {};
									data[0].type.id = node.formTypeId;
									info.workspaceTreeComponentService.selectByForm(info.workspaceTree.info, data[0], info.workspaceTree.selected);
									this.messageService.showGrowl(message);
								}

								if (data[0].close) {
									// 帳票詳細画面を閉じる
									this.dialogManagerComponentService.close(dialogId);
								}
							},
							updated: (data: any[]) => {
								// メイン画面の該当データを更新する
								let updatedData: EIMFormCreatedData[] = [];
								for (let i = 0; i < data.length; i++) {
									updatedData.push({data: data[i]});
								}
								this.complete(info, {updatedData: updatedData}, this.translateService.instant('EIM_FORMS.INFO_00006'));
							},
							statusChanged: (data: any[]) => {
								// 帳票詳細画面を閉じる
								this.dialogManagerComponentService.close(dialogId);

								// メイン画面の該当データを更新する
								let updatedData: EIMFormCreatedData[] = [];
								for (let i = 0; i < data.length; i++) {
									updatedData.push(data[i]);
								}
								this.complete(info, {updatedData: updatedData}, this.translateService.instant('EIM_FORMS.INFO_00007'));

							},
							errored: () => {
								// 帳票詳細画面を閉じる
								this.dialogManagerComponentService.close(dialogId);
							}

						});
					},
					/*
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					}
					*/
				});
	}

	/**
	 * CSV出力項目設定ウィンドウを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doFormCSVDownload(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {

		// 検索アコーディオンの検索条件生成
		let critria: EIMFormCriteria = this.formSearchConditionComponentService.createCriteria(info.searchConditionAccordion.info);

		// CSVダウンロード画面をポップアップ表示
		let dialogId: string = this.dialogManagerComponentService.showDisplayCsvDownload(
			critria,
			{
				executed: (data: any[]) => {this.dialogManagerComponentService.close(dialogId); },
				errored: () => {this.dialogManagerComponentService.close(dialogId); }
			}
		);
	}

	/**
	 * 表示列編集ウィンドウを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doDisplayColumnEdit(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showDisplayColumnEditor(
				info.selectedFormType, info.selectedDisplayColumn, {
					applied: (data: any[]) => {
						this.dialogManagerComponentService.close(dialogId);
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					}
				});
	}

	/**
	 * 帳票移動ウィンドウを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doFormMove(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showFormMoveSelector(parentData.formWorkspaceId, parentData.formTypeId, parentData.formTypeFolderId,
				{
					selected: (data: any[]) => {
						this.dialogManagerComponentService.close(dialogId);

						// 帳票移動処理
						let sourceFormList: EIMFormDomain[];
						let targetFormTypeFolderId: number;
						let node: EIMWorkspaceTreeNode = data[0];

						let formWorkspaceId: number = parentData.formWorkspaceId;
						let formTypeId: number = parentData.formTypeId;
						let formTypeFolderId: number = parentData.formTypeFolderId;

						if (node.data instanceof EIMFormTypeFolderDTO) {
							targetFormTypeFolderId = node.data.id;
						} else {
							// 帳票タイプの場合
							targetFormTypeFolderId = 0;
						}

						// 帳票移動リクエストパラメータを作成する
						sourceFormList = [];
						selectedData.forEach( ( formDTO: EIMFormDTO ) => {
							let formDomain: EIMFormDomain = new EIMFormDomain();
							let formTypeDomain: EIMFormTypeDomain = new EIMFormTypeDomain();
							formTypeDomain.id = formTypeId;
							formDomain.type = formTypeDomain;
							formDomain.attributeList = [];
							formDomain.id = formDTO.id;
							formDomain.modificationDate = formDTO.modificationDate;

							let attributeDomain: EIMAttributeDomain;
							let attributeTypeDomain: EIMAttributeTypeDomain;

							attributeDomain = new EIMAttributeDomain();
							attributeTypeDomain = new EIMAttributeTypeDomain();
							attributeTypeDomain.definitionName = EIMFormsConstantService.ATTRIBUTE_TYPE_NAME_FORM_WORKSPACE_ID;
							attributeDomain.attributeType = attributeTypeDomain;
							attributeDomain.longList = [formWorkspaceId];
							formDomain.attributeList.push(attributeDomain);

							attributeDomain = new EIMAttributeDomain();
							attributeTypeDomain = new EIMAttributeTypeDomain();
							attributeTypeDomain.definitionName = EIMFormsConstantService.ATTRIBUTE_TYPE_NAME_FORM_TYPE_FOLDER_ID;
							attributeDomain.attributeType = attributeTypeDomain;
							attributeDomain.longList = [formTypeFolderId];
							formDomain.attributeList.push(attributeDomain);

							sourceFormList.push(formDomain);
						} );

						// 帳票移動
						this.formService.moveFormList(sourceFormList, targetFormTypeFolderId).subscribe( () => {
							this.complete(info, {deletedData: sourceFormList}, this.translateService.instant('EIM_FORMS.INFO_00004'));
						});


					},

				});
	}

	/**
	 * アクセス履歴ウィンドウを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doFormAccessHistory(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showFormAccessHistory(selectedData[0].id,
				{
					errored: (data: any) => {
						// 画面を閉じる
						this.dialogManagerComponentService.close(dialogId);
					}
				}
		);

	}

	/**
	 * 帳票を削除します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doFormDelete(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {

		let formList: EIMFormDomain[] = [];
		let objNames: number[] = new Array();
		let message: string;
		let targetList: string[] = [];

		for (let i = 0; i < selectedData.length; i++) {
			let form: EIMFormDomain = new EIMFormDomain();
			form.id = selectedData[i].id;
			formList.push(form);
			targetList.push(selectedData[i].name);
		}

		// 確認ダイアログ
		this.messageService.showMultipleLines(EIMMessageType.confirm, this.translateService.instant('EIM_FORMS.CONFIRM_00001'), targetList,
				() => {

					if (parentData.isTrash) {
						// 物理削除呼び出し
						this.formService.delete(formList)
						.subscribe(
								(object: any) => {
									this.complete(info, {deletedData: formList}, this.translateService.instant('EIM_FORMS.INFO_00002'));
								}
						);
					} else {
						// 論理削除呼び出し
						this.formService.setInvalidate(formList)
						.subscribe(
								(object: any) => {
									this.complete(info, {deletedData: formList}, this.translateService.instant('EIM_FORMS.INFO_00001'));
								}
						);

					}

				}
		);

	}

	/**
	 * ごみ箱の帳票を元の場所に戻します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doFormRestore(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {

		let formList: EIMFormDomain[] = [];
		let objNames: number[] = new Array();
		let message: string;
		let targetList: string[] = [];

		for (let i = 0; i < selectedData.length; i++) {
			let form: EIMFormDomain = new EIMFormDomain();
			form.id = selectedData[i].id;
			formList.push(form);
			targetList.push(selectedData[i].name);
		}

		// 確認ダイアログ
		this.messageService.showMultipleLines(EIMMessageType.confirm, this.translateService.instant('EIM_FORMS.CONFIRM_00002'), targetList,
				() => {

					// ごみ箱から元に戻す(無効フラグを落とす)
					this.formService.setValidate(formList)
					.subscribe(
							(object: any) => {
								this.complete(info, {deletedData: formList}, this.translateService.instant('EIM_FORMS.INFO_00003'));
							}
					);


				}
		);

	}

	/**
	 * 検索条件を表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doSearch(info: EIMFormMainComponentInfo, parentData: any, selectedData: any[]): void {
		info.searchCondtionShowed.emit();
	}

	/**
	 * 初期表示時に開くアコーディオンインデックスを取得します.
	 * @return アコーディオンインデックス
	 */
	public getInitAccordionIndex(): number {
		// ローカルストレージに保存されているアコーディオンを開く

		// 読み込みのタイミングによってはキャッシュからユーザを取得できないので
		// 取得できない場合はログイン時に格納したローカルストレージからユーザIDを取得する
		let loginUser: EIMUserDomain = this.formCacheService.getLoginUser();
		let loginUserId: number = loginUser ? loginUser.id : this.localStorageService.getUserId();
		return this.localStorageService.getFormInitOpenAccorditonIndex(loginUserId);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	private getCompletedList(info: EIMFormMainComponentInfo, criteria: any): Observable<any> {
		if (info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			criteria.accessRoleType = 'READ';
			return this.formService.getList(criteria, false);
		} else if (info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			return this.formService.getProcessingList(criteria, false);
		} else if (info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			return this.formService.getList(criteria, false);
		}

		return of(null);
	}

	/**
	 * 追加・更新・削除の完了イベントハンドラ
	 * @param info コンポーネント情報
	 * @param completeData 追加・更新・削除のデータ情報
	 * @param completeMessage 完了メッセージ
	 */
	public complete(info: EIMFormMainComponentInfo, completeData: EIMFormCompleteData, completeMessage?: string): void {

		let criteria: EIMFormCriteria = this.makeCompleteDataCriteria(info, completeData);

		// 検索条件が無い場合は取得処理を行わず、
		// 完了メッセージを表示して処理を終了する.
		if (!criteria) {
			// 完了メッセージ表示
			if (completeMessage) {
				this.messageService.showGrowl(completeMessage);
			}
			return;
		}

		if (!completeData.createdData && !completeData.updatedData && !completeData.deletedData) {
			this.getCompletedList(info, criteria).subscribe( (refreshData: any[]) => {
				info.onComplete(info, null, null, null, refreshData);
			});
			return;
		}

		// データ操作したコンテンツを取得する
		let objIdSet: any = Object.assign({},
				this.createObjIdSet(completeData.createdData),
				this.createObjIdSet(completeData.updatedData),
				)	;

		criteria.ids = Object.keys(objIdSet).map(Number);

		this.getCompletedList(info, criteria)
		.subscribe(
				(data: EIMFormDTO[]) => {
					let createdData: any[] = this.getContentsList(data, completeData.createdData);
					let updatedData: any[] = this.getContentsList(data, completeData.updatedData);

					if (completeData.updatedData) {
						// 更新対象データを取得できなかった場合、そのデータは存在しないので削除データとする
						this.doProcessingOnUpdatedData(info, completeData, createdData, updatedData);
					}

					// 削除対象データをグリッドから取得し直す
					if (completeData.deletedData) {
						for (let i = 0; i < completeData.deletedData.length; i++) {
							let targetData: any = completeData.deletedData[i];
							info.contentsList.info.gridApi.forEachNode( (node) => {
								if (targetData.id === node.data.id) {
									completeData.deletedData[i] = node.data;
								}
							});
						}
					}

					info.onComplete(info, createdData, updatedData, completeData.deletedData);

					// 完了メッセージ表示
					if (completeMessage) {
						this.messageService.showGrowl(completeMessage);
					}

				}
		);

	}

	/**
	 * 追加・更新・削除の帳票を取得するための検索条件を作成します.
	 * @param info コンポーネント情報
	 * @param completeData 追加・更新・削除のデータ
	 */
	public makeCompleteDataCriteria(info: EIMFormMainComponentInfo, completeData: EIMFormCompleteData): EIMFormCriteria {
		let criteria: EIMFormCriteria = new EIMFormCriteria();
		criteria.formWorkspaceId = info.selectedTreeNode.formWorkspaceId;
		criteria.formTypeId = info.selectedTreeNode.formTypeId;
		criteria.formTypeFolderId = info.selectedTreeNode.formTypeFolderId;

		let columnIds: string[] = [];
		if (info.selectedDisplayColumn) {
			info.selectedDisplayColumn.columns.forEach( (column: any) => {
				columnIds.push(column.columnId);
			});
		}
		criteria.targetColumnIds = columnIds;
		return criteria;
	}

	/**
	 * 更新対象データを処理します。
	 * @param info コンポーネント情報
	 * @param completeData 追加・更新・削除のデータ情報
	 * @param createdData 追加データ情報
	 * @param updatedData 更新データ情報
	 */
	protected doProcessingOnUpdatedData(info: EIMFormMainComponentInfo, completeData: EIMFormCompleteData, createdData: any[], updatedData: any[]): void {
		// 更新対象データを取得できなかった場合、そのデータは存在しないので削除データとする
		for (let i = 0; i < completeData.updatedData.length; i++) {
			let isFind = false;
			for (let j = 0; j < updatedData.length; j++) {
				if (completeData.updatedData[i].id === updatedData[j].id) {
					isFind = true;
					break;
				}
			}
			if (!isFind) {
				if (!completeData.deletedData) {
					completeData.deletedData = [];
				}
				completeData.deletedData.push(completeData.updatedData[i]);
			}
		}
	}

	/**
	 * IDをセットに格納して返却します.
	 * @param data データ
	 * @return IDセット
	 */
	protected createObjIdSet(data: any): any {
		let objIdSet: any = {};
		if (data) {
			for (let i = 0; i < data.length; i++) {
				let id: number;
				if (data[i].hasOwnProperty('data')) {
					id = Number(data[i].data.id);
				} else {
					id = Number(data[i].id);
				}
				objIdSet[id] = true;
			}
		}
		return objIdSet;
	}

	/**
	 * IDが一致しているオブジェクトをリストで返却します.
	 * @param data オブジェクトリスト
	 * @param idData オブジェクトリスト
	 * @return 一致しているデータ
	 */
	protected getContentsList(data: any[], idData: any[]): any[] {
		let contentsList: any[] = [];
		if (idData) {
			for (let i = 0; i < idData.length; i++) {
				for (let j = 0; j < data.length; j++) {

					if (idData[i].hasOwnProperty('data')) {
						if (idData[i].data.id === data[j].id) {
							contentsList.push({data: data[j], additionalTarget: idData[i].additionalTarget});
						}
					} else {
						if (idData[i].id === data[j].id) {
							contentsList.push(data[j]);
						}
					}

				}
			}
		}
		return contentsList;
	}

	// ----------------------------------------
	// 選択データのバリデータ
	// ----------------------------------------
	/**
	 * 複数選択データをバリデートします.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	public checkArray(check: (info: EIMFormMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean) => boolean): (info: any, parentData: any, domains: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean) => boolean {
		return (info: any, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean => {
			for (let i = 0; i < domains.length; i++) {
				if (!check(info, parentData, domains[i], messageService, translateService, displayErrorDialog)) {
					return false;
				}
			}
			return true;
		};
	}

	/**
	 * ワークスペースアコーディオンを開いているかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果(ワークスペースアコーディオンを開いている場合true、ワークスペースアコーディオンを開いていない場合false)
	 */
	public checkFunctionIsWorkspaceTree(info: EIMFormMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE ? true : false);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_FORMS.ERROR_00001'));
		}
		return check;
	}

	/**
	 * 検索アコーディオンを開いているかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果(検索アコーディオンを開いている場合true、検索アコーディオンを開いていない場合false)
	 */
	public checkFunctionIsSearch(info: EIMFormMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH ? true : false);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_FORMS.ERROR_00001'));
		}
		return check;
	}

	/**
	 * 検索アコーディオンを開いていないかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果(検索アコーディオンを開いていない場合true、検索アコーディオンを開いている場合false)
	 */
	public checkFunctionIsNotSearch(info: EIMFormMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH ? false : true);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_FORMS.ERROR_00001'));
		}
		return check;
	}

	/**
	 * 親データ(ツリーノード)が選択されているかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	public checkParentSelected(info: EIMFormMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (parentData ? true : false);

		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_FORMS.ERROR_00002'));
		}
		return check;
	}

	/**
	 * データが選択されているかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	public checkSelected(info: EIMFormMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domains && domains.length > 0);

		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_FORMS.ERROR_00003'));
		}

		return check;
	}

	/**
	 * ごみ箱かどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果(ごみ箱でない場合true、ごみ箱の場合false)
	 */
	public checkIsGarbageBox(info: EIMFormMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (parentData.isTrash ? true : false);

		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_FORMS.ERROR_00005'));
		}
		return check;
	}

	/**
	 * ごみ箱でないかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果(ごみ箱でない場合true、ごみ箱の場合false)
	 */
	public checkIsNotGarbageBox(info: EIMFormMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (parentData.isTrash ? false : true);

		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_FORMS.ERROR_00004'));
		}
		return check;
	}

	/**
	 * ワークスペースでないかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果(ごみ箱でない場合true、ごみ箱の場合false)
	 */
	public checkIsNotWorkspace(info: EIMFormMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = !(parentData.data instanceof EIMFormWorkspaceDTO);

		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_FORMS.ERROR_00002'));
		}
		return check;
	}

	/**
	 * 選択しているデータが１件かどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果(ごみ箱でない場合true、ごみ箱の場合false)
	 */
	public checkSelectedNumberIsOne(info: EIMFormMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domains && domains.length === 1);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_FORMS.ERROR_00008'));
		}
		return check;
	}

	/**
	 * 選択帳票タイプの表示列(selectedDisplayColumn)と選択帳票タイプ(selectedFormType)を更新します。
	 * @param info コンポーネント情報
	 * @param loginUserId ログインユーザID
	 * @param formTypeId 差し替える帳票タイプのID
	 */
	public updateDisplayColumnAndFormType(info: EIMFormMainComponentInfo, loginUserId: number, formTypeId: number) {
		// 選択帳票タイプ(selectedFormType)を更新
		const eimFormType: EIMFormTypeDomain = this.formCacheService.displayColumnFormTypeMap.get(formTypeId);
		if (eimFormType) {
			info.selectedFormType = eimFormType;
		}

		// 保持している場合はローカルストレースから取得し、保持していない(デフォルトの表示列/システム管理で設定された表示列)場合は、
		// systemSettingFormListColumnsを使用し設定を行う。
		info.selectedDisplayColumn.formTypeId = formTypeId;
		info.selectedDisplayColumn.columns = [];
		const displayColumn: EIMFormTypeDisplayColumn = this.localStorageService.getFormTypeDisplayColumn(loginUserId, info.selectedDisplayColumn.formTypeId);
		if (displayColumn) {
			info.selectedDisplayColumn.columns = displayColumn.columns;
		} else {
			for (let layout of eimFormType.formListColumn.systemSettingFormListColumns) {
				const columnId: string = layout.formListColumnId;
				if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_NAME) {
					info.selectedDisplayColumn.columns.push({columnId: columnId, name: this.translateService.instant('EIM.LABEL_02027'), definitionName: this.translateService.instant('EIM.LABEL_02027')})
				} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_TITLE) {
					info.selectedDisplayColumn.columns.push({columnId: columnId, name: this.translateService.instant('EIM.LABEL_02028'), definitionName: this.translateService.instant('EIM.LABEL_02028')})
				} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_STATUS_TYPE_NAME) {
					info.selectedDisplayColumn.columns.push({columnId: columnId, name: this.translateService.instant('EIM.LABEL_02028'), definitionName: this.translateService.instant('EIM.LABEL_02029')})
				} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_USER_NAME) {
					info.selectedDisplayColumn.columns.push({columnId: columnId, name: this.translateService.instant('EIM.LABEL_02028'), definitionName: this.translateService.instant('EIM.LABEL_02030')})
				} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_DATE) {
					info.selectedDisplayColumn.columns.push({columnId: columnId, name: this.translateService.instant('EIM.LABEL_02028'), definitionName: this.translateService.instant('EIM.LABEL_02031')})
				} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_USER_NAME) {
					info.selectedDisplayColumn.columns.push({columnId: columnId, name: this.translateService.instant('EIM.LABEL_02028'), definitionName: this.translateService.instant('EIM.LABEL_02032')})
				} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_DATE) {
					info.selectedDisplayColumn.columns.push({columnId: columnId, name: this.translateService.instant('EIM.LABEL_02028'), definitionName: this.translateService.instant('EIM.LABEL_02033')})
				} else {
					info.selectedDisplayColumn.columns.push({columnId: columnId, name: layout.name, definitionName: layout.definitionName})
				}
			}
		}
	}

}
