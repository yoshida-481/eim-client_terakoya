import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMAuthenticationService, EIMUser } from 'app/shared/services/apis/authentication.service';

import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';
import { EIMObjectEditorsCacheService } from 'app/object-editors/shared/services/object-editors-cache.service';

import { EIMObjectEditorsObjectTypeService } from 'app/object-editors/shared/services/apis/object-editors-object-type.service';
import { EIMObjectEditorsRelationService } from 'app/object-editors/shared/services/apis/object-editors-relation.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * オブジェクトエディタ認証APIサービス
 */
@Injectable()
export class EIMObjectEditorsAuthenticationService extends EIMAuthenticationService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected objectEditorsCacheService: EIMObjectEditorsCacheService,
		protected objectTypeService: EIMObjectEditorsObjectTypeService,
		protected relationService: EIMObjectEditorsRelationService,
		private router: Router,
	) {
		super(httpService, jsonService);
	}

	/**
	 * 言語リストを取得します.
	 * @return 言語リスト
	 */
	public getLanguageList(): Observable<EIMLanguageDTO[]> {
		return this.httpService.postForForm('/jsp/conf/dspLanguageXML.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.langlist.language, this.convertToEIMLanguage.bind(this)));
			}));
	}

	/**
	 * ログインします.
	 * @param userCode ユーザコード
	 * @param userPass パスワード
	 * @param langId 言語ID
	 * @return ユーザー情報
	 */
	public login(userCode: string, userPass: string, langId: string): Observable<EIMUser> {

		let params: any = {};
		params['userCode'] = userCode;
		params['userPass'] = userPass;
		params['langId'] = langId;

		return this.httpService.postForForm('/rest/session/login.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.attr);
			}));
	}

	/**
	 * ログアウトします.
	 */
	public logout(): Observable<any> {
		// キャッシュをクリアする
		this.objectEditorsCacheService.clearAll();
		// オブジェクトタイプのクリア
		this.objectTypeService.clearTree();
		// リレーションタイプのクリア
		this.relationService.clearTree();
		return this.httpService.postForForm('/rest/session/logout.mvc')
		.pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}

	/**
	 * ログイン後メイン画面URLを取得します.
	 * @return メイン画面URL
	 */
	public getMainUrl(): string {
		return '/object-editors/main';
	}

	/**
	 * ログインURLを取得します.
	 * @return ログイン画面URL
	 */
	public getLoginUrl(): string {
		return '/object-editors/login';
	}

	/**
	 * ログイン画面に遷移します.
	 */
	public goToLogin(): void {
		this.router.navigate([this.getLoginUrl()]);
	}

	/**
	 * ログイン言語DTOを変換します.
	 * @param json 変換対象
	 * @return 変換結果
	 */
	private convertToEIMLanguage(json: any): EIMLanguageDTO {
		return {
			name: json.label._text,
			langId: json.data._text,
			nameList: this.jsonService.getJsonChildren(
				json.namelist.item,
				item => ({ lang: item.lang._text, value: item.name._text })),
		};
	}

	/**
	 * 表示言語を変更します.
	 * @param langId 言語ID
	 */
	public changeLanguage(langId: string): Observable<EIMUser> {
		const params: any = {
			langId,
		};
		return this.httpService.postForForm('/rest/session/changeLanguage.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.attr);
			}));
	}
}
