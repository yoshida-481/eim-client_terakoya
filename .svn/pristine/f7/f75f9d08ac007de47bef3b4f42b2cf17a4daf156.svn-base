import { Injectable } from '@angular/core';

import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMHierarchicalObjectTypeDomain } from 'app/admins/shared/domains/hierarchical-object-type.domain';

import { EIMCacheService } from 'app/shared/services/cache.service';

/**
 * ドキュメント管理キャッシュサービス
 */
@Injectable()
export class EIMAdminsCacheService {

	/** 検索画面：選択テーブル */
	public searchSelectedTable: any = null;

	/** 検索画面：メニュー */
	public searchMenuItems: any[] = null;

	/** 検索画面：カラム */
	public searchColumns: any[] = null;

	/** 検索画面：検索条件 */
	public searchCondition: any = null;

	/** 検索画面：検索結果 */
	public searchResult: any = null;

	/** 検索画面：グリッドフィルターモデル */
	public searchGridFilterModel: any = null;

	/** 検索画面：グリッドソートモデル */
	public searchGridSortModel: any = null;

	/** 検索画面：グリッドスクロール位置 */
	public searchGridScrollTop: any = null;

	/** 検索画面：グリッド選択行データ */
	public searchGridSelectedData: any[] = null;

	/** 検索画面：詳細条件開閉状態 */
	public searchShowDetailCondition = true;

	/** コンテンツタイプ階層情報(キー：ワークスペース、タイプの名前) */
	private hierarchicalObjectTypesMap: EIMHierarchicalObjectTypeDomain[][][] = [];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected cacheService: EIMCacheService,
		) {
	}

	/**
	 * キャッシュを全てクリアします.
	 */
	public clearAll(): void {
		this.cacheService.clearAll();

		this.searchSelectedTable = null;
		this.searchMenuItems = null;
		this.searchColumns = null;
		this.searchCondition = null;
		this.searchResult = null;
		this.searchGridFilterModel = null;
		this.searchGridSortModel = null;
		this.searchGridScrollTop = null;
		this.searchGridSelectedData = null;
		this.searchShowDetailCondition = true;
		this.hierarchicalObjectTypesMap = [];
	}

	/**
	 * コンテンツタイプ階層情報を取得する.
	 */
	public getHierarchicalObjectTypes(workspaceId: number, name: string): EIMHierarchicalObjectTypeDomain[] {
		if (!this.hierarchicalObjectTypesMap[workspaceId]) {
			return [];
		}
		if (!this.hierarchicalObjectTypesMap[workspaceId][name]) {
			return [];
		}
		return this.hierarchicalObjectTypesMap[workspaceId][name];
	}

	/**
	 * コンテンツタイプ階層情報を設定する.
	 */
	public setHierarchicalObjectTypes(workspaceId: number, name: string, hierarchicalContentsTypes: EIMHierarchicalObjectTypeDomain[]): void {
		if (!this.hierarchicalObjectTypesMap[workspaceId]) {
			// ワークスペース変更のタイミングで初期化する
			this.hierarchicalObjectTypesMap = [];
			this.hierarchicalObjectTypesMap[workspaceId] = [];
		}
		this.hierarchicalObjectTypesMap[workspaceId][name] = hierarchicalContentsTypes;
	}

		/**
	 * タイプ情報変更時キャッシュをクリアします.
	 */
	public clearHierarchicalObjectTypes(): void {
		this.hierarchicalObjectTypesMap = [];
	}

	/**
	 * ログインユーザを取得する.
	 */
	public getLoginUser(): EIMUserDomain {
		return this.cacheService.getLoginUser();
	}

	/**
	 * ログインユーザを設定する.
	 */
	public setLoginUser(loginUser: EIMUserDomain): void {
		this.cacheService.setLoginUser(loginUser);
	}


	/**
	 * JSESSIONIDを取得する.
	 */
	public getJSessionId(): string {
		return this.cacheService.getJSessionId();
	}

	/**
	 * JSESSIONIDを設定する.
	 */
	public setJSessionId(jSessionId: string): void {
		this.cacheService.setJSessionId(jSessionId);
	}

	/**
	 * アプリケーション区分を取得する.
	 */
	public getAppId(): string {
		return this.cacheService.getAppId();
	}

	/**
	 * アプリケーション区分を設定する.
	 */
	public setAppId(jSessionId: string): void {
		this.cacheService.setAppId(jSessionId);
	}

}
