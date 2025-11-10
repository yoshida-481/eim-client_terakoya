import { Injectable } from '@angular/core';

import { EIMTableService, EIMTable, EIMHierarchicalTable, EIMTableItem } from 'app/documents/shared/services/apis/table.service';

import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';

import { EIMCacheService } from 'app/shared/services/cache.service';

/** 検索画面キャッシュ情報 */
export interface EIMSearchCache {
	searchSelectedTable: any;
	searchMenuItems: any[],
	searchColumns: any[],
	searchCondition: any,
	searchResult: any,
	PageSearchResult: any,
	searchOnceDisplayedContentsSearch,
	searchGridFilterModel: any,
	searchGridSortModel: any,
	searchGridScrollTop: any,
	searchGridSelectedData: any[],
	searchShowDetailCondition,
	parentObjIdList?: number[],
}

export interface EIMDocumentURLCache {
	contextRootForSelectObject?: string,
	routePathForSelectObject?: string, 
	paramsForSelectObject?: string[],
	contextRootForDownloadDocument?: string, 
}

/**
 * ドキュメント管理キャッシュサービス
 */
@Injectable()
export class EIMDocumentsCacheService {

	/** 検索キャッシュ */
	public searchCache: EIMSearchCache[] = [];

	/** コンテンツタイプ階層情報(キー：ワークスペース、タイプの名前) */
	private hierarchicalObjectTypesMap: EIMHierarchicalObjectTypeDomain[][][] = [];

	/** ダイレクトアクセス用のURL */
	private documentURLCache: EIMDocumentURLCache = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected cacheService: EIMCacheService,
	) {
			this.searchCache.push(this.createInitializedSearchCache());
			this.searchCache.push(this.createInitializedSearchCache());
			this.searchCache.push(this.createInitializedSearchCache());
	}

	/**
	 * コンテンツ選択の検索キャッシュをクリアします.
	 * @param mode モード（0:検索、1:コンテンツ検索、2:アコーディオン検索）
	 */
	public clearSearchCacheByMode(mode: number): void {
		this.searchCache[mode] = this.createInitializedSearchCache();
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
	 * ダイレクトアクセス用のURLを取得する.
	 */
	public getDocumentURLCache(): EIMDocumentURLCache {
		return this.documentURLCache
	}

	/**
	 * ダイレクトアクセス用のURLを設定する.
	 */
	public setDocumentURLCache(documentURLCache: EIMDocumentURLCache): void {
		this.documentURLCache = documentURLCache;
	}

	/**
	 * キャッシュを全てクリアします.
	 */
	public clearAll(): void {
		this.cacheService.clearAll();

		this.clearSearchCache();
		this.hierarchicalObjectTypesMap = [];
	}

	/**
	 * 画面更新時キャッシュをクリアします.
	 */
	public clearForReload(): void {
		this.clearSearchCache();
		this.hierarchicalObjectTypesMap = [];
	}

	/**
	 * 検索キャッシュを全てクリアします.
	 */
	private clearSearchCache(): void {
		for (let i = 0; i < this.searchCache.length; i++) {
			this.searchCache[i] = this.createInitializedSearchCache();
		}
	}

	/**
	 * 検索キャッシュ情報を生成します.
	 * @return 初期化した検索キャッシュ情報
	 */
	private createInitializedSearchCache(): EIMSearchCache {
		return {
			searchSelectedTable: null,
			searchMenuItems: null,
			searchColumns: null,
			searchCondition: null,
			searchResult: null,
			PageSearchResult: null,
			searchOnceDisplayedContentsSearch: false,
			searchGridFilterModel: null,
			searchGridSortModel: null,
			searchGridScrollTop: null,
			searchGridSelectedData: null,
			searchShowDetailCondition: false,
		};
	}
}
