import { Injectable } from '@angular/core';

import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';

import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMAttributeTypeLayoutDTO } from 'app/shared/dtos/attribute-type-layout.dto';

/**
 * 帳票管理キャッシュサービス
 */
@Injectable()
export class EIMFormsCacheService {

	/** メイン画面表示列：キー：帳票タイプID、値：帳票タイプドメイン */
	public displayColumnFormTypeMap: Map<number, EIMFormTypeDomain> = new Map<number, EIMFormTypeDomain>();
	
	/** CSVダウンロード画面 帳票タイプマップ キー：帳票タイプ定義名称、値：属性タイプレイアウトリスト */
	public csvDownloadFormTypeMap: Map<string, EIMAttributeTypeLayoutDTO[]> = new Map<string, EIMAttributeTypeLayoutDTO[]>();

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
		this.displayColumnFormTypeMap = new Map<number, EIMFormTypeDomain>();
		this.csvDownloadFormTypeMap = new Map<string, EIMAttributeTypeLayoutDTO[]>();
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
	public setLoginUser(loginUser: EIMUserDomain):void {
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
	public setJSessionId(jSessionId: string):void {
		this.cacheService.setJSessionId(jSessionId);
	}

	/**
	 * パスワード変更が必要か否かを取得する.
	 */
	public getChangePasswordFlg(): boolean{
		return this.cacheService.getChangePasswordFlg();
	}

	/**
	 * パスワード変更が必要か否かを設定する.
	 */
	public setChangePasswordFlg(isChangePasswordFlg: boolean):void {
		this.cacheService.setChangePasswordFlg(isChangePasswordFlg);
	}
	
}
