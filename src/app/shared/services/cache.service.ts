import { EventEmitter, Injectable, Output } from '@angular/core';

import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';

/**
 * キャッシュサービス
 */
@Injectable()
export class EIMCacheService {

	/** ログインユーザ初期化時のイベントエミッタ */
	@Output() initializedLoginUser: EventEmitter<EIMUserDomain> = new EventEmitter<EIMUserDomain>();

	/** JSESSIONID初期化時のイベントエミッタ */
	@Output() initializedJSessionId: EventEmitter<string> = new EventEmitter<string>();

	/** アプリケーション区分初期化時のイベントエミッタ */
	@Output() initializedAppId: EventEmitter<string> = new EventEmitter<string>();

	/** 保持管理者権限ID初期化時のイベントエミッタ */
	@Output() initializedHasAuthId: EventEmitter<any> = new EventEmitter<any>();

	/** ログインユーザ */
	private loginUser: EIMUserDomain = null;

	/** JSESSIONID */
	private jSessionId: string = null;

	/** アプリケーション区分 */
	private appId: string = null;

	/** 
	 * 保持管理者権限ID
	 * {
	 *   task: true,
	 *   project: true,
	 *   …
	 * }
	 */
	private hasAuthId = {};

	/** パスワード変更が必要か否か */
	private isChangePasswordFlg:boolean = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		) {
	}

	/**
	 * キャッシュを全てクリアします.
	 */
	public clearAll(): void {
		this.loginUser = null;
		this.jSessionId = null;
	}

	/**
	 * ログインユーザを取得する.
	 */
	public getLoginUser(): EIMUserDomain {
		return this.loginUser;
	}

	/**
	 * ログインユーザを設定する.
	 */
	public setLoginUser(loginUser: EIMUserDomain): void {
		this.loginUser = loginUser;

		this.initializedLoginUser.emit(loginUser);
	}

	/**
	 * JSESSIONIDを取得する.
	 */
	public getJSessionId(): string {
		return this.jSessionId;
	}

	/**
	 * JSESSIONIDを設定する.
	 */
	public setJSessionId(jSessionId: string): void {
		this.jSessionId = jSessionId;

		this.initializedJSessionId.emit(jSessionId);
	}

	/**
	 * アプリケーション区分を取得する.
	 */
	public getAppId(): string {
		return this.appId;
	}

	/**
	 * アプリケーション区分を設定する.
	 */
	public setAppId(appId: string): void {
		this.appId = appId;

		this.initializedAppId.emit(appId);
	}

	/**
	 * パスワード変更が必要か否かを取得する.
	 */
	public getChangePasswordFlg(): boolean {
		return this.isChangePasswordFlg;
	}

	/**
	 * パスワード変更が必要か否かを設定する.
	 */
	public setChangePasswordFlg(isChangePasswordFlg: boolean): void {
		this.isChangePasswordFlg = isChangePasswordFlg;
	}

	/**
	 * 保持管理者権限IDを取得する.
	 * @returns 保持管理者権限ID
	 */
	public getHasAuthId(): any {
		return this.hasAuthId;
	}

	/**
	 * 保持管理者権限IDを設定する.
	 * @param hasAuthId 保持管理者権限ID
	 */
	public setHasAuthId(hasAuthId: any): void {
		this.hasAuthId = hasAuthId;

		this.initializedHasAuthId.emit(hasAuthId);
	}
}
