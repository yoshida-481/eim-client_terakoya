import { EIMFormsConstantService } from '../../shared/services/forms-constant.service';
import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';

import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';

import { EIMFormService } from 'app/forms/shared/services/apis/form.service';

import { EIMFormWorkspaceDTO } from 'app/shared/dtos/form-workspace.dto';
import { EIMFormDTO } from 'app/shared/dtos/form.dto';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormTypeFolderDTO } from 'app/shared/dtos/form-type-folder.dto';
import { EIMAttributeDTO } from 'app/shared/dtos/attribute.dto';
import { EIMAttributeTypeDTO } from 'app/shared/dtos/attribute-type.dto';
import { EIMFormSearchService } from 'app/forms/shared/services/apis/form-search.service';

/**
 * 帳票リストグリッド状態インタフェース
 */
export interface EIMFormListComponentGridState {
	// カラム
	columns?: EIMDataGridColumn[];
	// フィルターモデル
	filterModel?: any;
	// ソートモデル
	sortModel?: any;
	// スクロール位置
	scrollTop?: any;
	// 選択行データ
	selectedData?: any[];
	// データ
	data?: any[];
}

/**
 * 帳票リストコンポーネントサービス.
 * 本クラスはデータグリッドコンポーネントサービスを継承しています.
 */
@Injectable()
export class EIMFormListComponentService extends EIMDataGridComponentService {

	/** グリッドデータ更新日時 */
	private updateDateTime: Date;

	/** ワークスペースツリーモードのグリッド状態 */
	public workspaceGridState: EIMFormListComponentGridState = {};

	/** 処理待ちツリーモードのグリッド状態 */
	public processingGridState: EIMFormListComponentGridState = {};

	/** 検索モードのグリッド状態 */
	public searchGridState: EIMFormListComponentGridState = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
			private formService: EIMFormService,
			private formSearchService: EIMFormSearchService,
			protected translateService: TranslateService) {
		super(translateService);
	}

	/**
	 * 初期化します.
	 */
	public initialize(info: EIMListComponentInfo<any>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {

		if (!serviceParam || !serviceParam.criteria) {
			// 一覧表示内容変更
			super.setData(info, []);

			super.initialize(info, serviceParam, initialized, selected);

			return;
		}

		let formWorkspaceId = serviceParam.criteria.formWorkspaceId;

		// グリッドデータを更新した日時がイベント実行日時よりも古い場合は
		// グリッドデータを更新する(最新のデータを反映させるため)
		if (!this.isRefresh(serviceParam.eventDateTime)) {
			return;
		}

		if (serviceParam.type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			// ワークスペース

			// アクセス権限=READを設定する
			serviceParam.criteria.accessRoleType = 'READ';

			this.formService.getList(serviceParam.criteria, false)
			.subscribe(data => {

				this.formService.setListToWorkspaceId(data, formWorkspaceId);

				// 一覧表示内容変更
				super.setData(info, data);

				this.setFormData(info, EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE, data);

				// 選択行を設定する
				if (serviceParam.selectedData && serviceParam.selectedData.length > 0) {
					super.select(info, serviceParam.selectedData);
				}

				super.initialize(info, serviceParam, initialized, selected);
			}, (err: any) => {
				(info as EIMDataGridComponentInfo).errored.emit('initialize');
			});

		} else if (serviceParam.type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			// 処理待ち

			this.formService.getProcessingList(serviceParam.criteria, false)
			.subscribe(data => {

				// アクセス権限=NONEを設定する
				serviceParam.criteria.accessRoleType = 'NONE';

				this.formService.setListToWorkspaceId(data, formWorkspaceId);

				// 一覧表示内容変更
				super.setData(info, data);

				this.setFormData(info, EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING, data);

				// 選択行を設定する
				if (serviceParam.selectedData && serviceParam.selectedData.length > 0) {
					super.select(info, serviceParam.selectedData);
				}

				super.initialize(info, serviceParam, initialized, selected);
			}, (err: any) => {
				(info as EIMDataGridComponentInfo).errored.emit('initialize');
			});
		} else if (serviceParam.type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			// 検索

			// アクセス権限=READを設定する
			serviceParam.criteria.accessRoleType = 'READ';

			// this.formService.getList(serviceParam.criteria, true)
			// 	.subscribe(data => {
			// 		// ワークスペース

			// 		this.formService.setListToWorkspaceId(data, formWorkspaceId);

			// 		// 一覧表示内容変更
			// 		super.setData(info, data);

			// 		this.setFormData(info, EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH, data);

			// 		super.initialize(info, serviceParam, initialized, selected);
			// 	}, (err: any) => {
			// 		(info as EIMDataGridComponentInfo).errored.emit('initialize');
			// 	});

			this.formSearchService.search(serviceParam.criteria, true)
				.subscribe(data => {
					// ワークスペース
					this.formService.setListToWorkspaceId(data, formWorkspaceId);

					// 一覧表示内容変更
					super.setData(info, data);

					this.setFormData(info, EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH, data);

					super.initialize(info, serviceParam, initialized, selected);
				}, (err: any) => {
					(info as EIMDataGridComponentInfo).errored.emit('initialize');
				});
		}
	}

	/**
	 * 帳票リストグリッドのデータを空にします.
	 * @param info コンポーネント情報
	 * @param type アコーディオンタブインデックス
	 */
	public clearFormData(info: EIMListComponentInfo<any>, type: number): void {
		this.setFormData(info, type, []);
	}

	/**
	 * 帳票リストグリッドにデータをセットします.
	 * @param info コンポーネント情報
	 * @param type アコーディオンタブインデックス
	 * @param data データ
	 */
	public setFormData(info: EIMListComponentInfo<any>, type: number, data: any[]): void {
		super.setData(info, data);

		if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			this.workspaceGridState.data = data;
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			this.processingGridState.data = data;
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			this.searchGridState.data = data;
		}
	}

	/**
	 * 帳票リストグリッドにデータを保存します.
	 * @param info コンポーネント情報
	 * @param type アコーディオンタブインデックス
	 * @param data データ
	 */
	public saveFormData(type: number, data: any[]): void {
		if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			this.workspaceGridState.data = data;
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			this.processingGridState.data = data;
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			this.searchGridState.data = data;
		}
	}

	/**
	 * 帳票リストグリッドにカラムをセットします.
	 * @param grid グリッドコンポーネント
	 * @param type アコーディオンタブインデックス
	 * @param columns グリッドカラムリスト
	 */
	public setColumns(grid: EIMDataGridComponent, type: number, columns: EIMDataGridColumn[]):void {
		grid.setColumns(columns);
		this.saveColumns(type, columns);
	}

	/**
	 * グリッド状態にグリッドカラムリストを保存します.
	 * @param type アコーディオンタブインデックス
	 * @param columns グリッドカラムリスト
	 */
	public saveColumns(type: number, columns:EIMDataGridColumn[]): void {
		if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			this.workspaceGridState.columns = columns;
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			this.processingGridState.columns = columns;
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			this.searchGridState.columns = columns;
		}
	}

	/*
	public saveColumns(grid: EIMDataGridComponent, type: number): void {
		let columns: any[] = grid.info.gridOptions.columnDefs;
		if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			this.workspaceGridState.columns = columns;
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			this.processingGridState.columns = columns;
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			this.searchGridState.columns = columns;
		}
	}
	*/

	/**
	 * グリッドの状態を保存します.
	 * @param grid グリッド
	 * @param type アコーディオンインデックス
	 */
	public saveGrid(grid: EIMDataGridComponent, type: number): void {
		if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			// フィルターモデル
			this.workspaceGridState.filterModel = grid.getFilterModel();
			// ソートモデル
			this.workspaceGridState.sortModel = grid.getSortModel();
			// スクロール位置
			this.workspaceGridState.scrollTop = grid.getScrollTop();
			// 選択行
			this.workspaceGridState.selectedData = grid.getSelectedData();
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			// フィルターモデル
			this.processingGridState.filterModel = grid.getFilterModel();
			// ソートモデル
			this.processingGridState.sortModel = grid.getSortModel();
			// スクロール位置
			this.processingGridState.scrollTop = grid.getScrollTop();
			// 選択行
			this.processingGridState.selectedData = grid.getSelectedData();
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			// フィルターモデル
			this.searchGridState.filterModel = grid.getFilterModel();
			// ソートモデル
			this.searchGridState.sortModel = grid.getSortModel();
			// スクロール位置
			this.searchGridState.scrollTop = grid.getScrollTop();
			// 選択行
			this.searchGridState.selectedData = grid.getSelectedData();
		}
	}

	/**
	 * 帳票リストグリッドのデータをグリッド状態に保存しているデータに切り替えます.
	 * @param grid グリッド
	 * @param type アコーディオンタブインデックス
	 */
	public switchGrid(grid: EIMDataGridComponent, type: number): void {

		if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			grid.setData(this.workspaceGridState.data);
			if (this.workspaceGridState.columns) {
				grid.setColumns(this.workspaceGridState.columns);
			} else {
				grid.setColumns([]);
			}
			grid.setFilterModel(this.workspaceGridState.filterModel);
			grid.setSortModel(this.workspaceGridState.sortModel);
			grid.setScrollTop(this.workspaceGridState.scrollTop);
			grid.select(this.workspaceGridState.selectedData);
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			grid.setData(this.processingGridState.data);
			if (this.processingGridState.columns) {
				grid.setColumns(this.processingGridState.columns);
			} else {
				grid.setColumns([]);
			}
			grid.setFilterModel(this.processingGridState.filterModel);
			grid.setSortModel(this.processingGridState.sortModel);
			grid.setScrollTop(this.processingGridState.scrollTop);
			grid.select(this.processingGridState.selectedData);
		} else if (type == EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			grid.setData(this.searchGridState.data);
			if (this.searchGridState.columns) {
				grid.setColumns(this.searchGridState.columns);
			} else {
				grid.setColumns([]);
			}
			// 検索グリッド用カラムのソート、フィルタは復元しない
			// grid.setFilterModel(this.searchGridState.filterModel);
			grid.setSortModel(null);
			grid.setScrollTop(this.searchGridState.scrollTop);
			grid.select(this.searchGridState.selectedData);
		}

	}

	/**
	 * グリッドデータを更新するかしないのかを判定します.
	 * @param eventDateTime イベント発生日時
	 * @return 更新する場合true、更新しない場合false
	 */
	public isRefresh(eventDateTime: Date): boolean {

		if (!this.updateDateTime) {
			return true;
		}
		if (!eventDateTime) {
			return true;
		}
		if (this.updateDateTime.getTime() == eventDateTime.getTime()) {
			return true;
		}

		return false;
	}

}
