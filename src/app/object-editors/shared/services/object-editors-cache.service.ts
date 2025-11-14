import { Injectable } from '@angular/core';

import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMHierarchicalObjectTypeDomain } from 'app/admins/shared/domains/hierarchical-object-type.domain';

import { EIMCacheService } from 'app/shared/services/cache.service';

/**
 * ドキュメント管理キャッシュサービス
 */
@Injectable()
export class EIMObjectEditorsCacheService {

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
