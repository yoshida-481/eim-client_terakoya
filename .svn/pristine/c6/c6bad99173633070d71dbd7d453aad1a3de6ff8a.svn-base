import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMObjectRoleService } from 'app/shared/services/apis/object-role.service';

/**
 * エントリAPIサービス
 */
@Injectable()
export class EIMObjectEditorsEntryService extends EIMEntryService {

	constructor(
			httpService: EIMHttpService,
			jsonService: EIMJSONService,
			translateService: TranslateService,
			protected objectRoleService: EIMObjectRoleService,
	) {
		super( httpService, jsonService, translateService, objectRoleService);

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ユーザリストを取得します.
	 * @param keyword 検索キーワード
	 * @param isDisable 無効ユーザ絞り込み有無（true/false)
	 * @param parentObjId 親フォルダのID（親フォルダのセキュリティで絞る場合に指定）
	 * @return ユーザリスト
	 */
  public getUserList(keyword: string, disableUserFilter = false, parentObjId?: number): Observable<any> {
		let params: any = {};
		params['objId'] = parentObjId;
		params['keyword'] = keyword;
		params['securityFilter'] = false;
		params['disableUserFilter'] = true;
		params['systemUserFilter'] = false;

		return this.httpService.postForForm('/jsp/common/actSearchUser.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}

	/**
	 * グループリストを取得します.
	 */
	public getGroupList(): Observable<any> {
		return;
	}

	/**
	 * グループリストをパス形式で取得します.
	 * @param serchGroupName グループ名検索文字列
	 */
	public getGroupListPath(serchGroupName: string): Observable<any> {
		return;
	}

	/**
	 * グループを取得します.
	 * @param groupId グループID
	 * @return グループ情報
	 */
	public getGroup(groupId: number): Observable<any> {
		return;
	}

	/**
	 * アクセスロールリストを取得します.
	 * @param id ロールID
	 * @return アクセスロールリスト
	 */
	public getRoleList(id: number): Observable<any[]> {
		return this.httpService.postForForm('/rest/security/dspRole.mvc',{entryId: id})
			.pipe(mergeMap((res: any) => {
				let children: any[] = Array.isArray(res.value.role) ? res.value.role : [res.value.role];
				let objects: any[] = [];
				for (let i = 0; i < children.length; i++) {
					let object: any = children[i].attr;
					object.permit = children[i].stsec.attr.permit;
					objects.push(object);
				}
				return of(objects);
			}));
	}

	/**
	 * アクセスロールリストを取得します.
	 * @param id ロールID
	 * @param stSecId ステータスセキュリティID
	 * @return アクセスロールリスト
	 */
	public getRoleListForStatusSec(id: number, stSecId: number): Observable<any[]> {
		let param = {entryId: id}

		if (stSecId !== 0) {
			param['stSecId'] = stSecId;
		}

		return this.httpService.postForForm('/rest/security/dspRole.mvc',	param)
			.pipe(mergeMap((res: any) => {
				let children: any[] = Array.isArray(res.value.role) ? res.value.role : [res.value.role];
				let objects: any[] = [];
				for (let i = 0; i < children.length; i++) {
					let object: any = children[i].attr;
					if (children[i].stsec instanceof Array) {
						object.overwrite = true;
						object.permit = children[i].stsec[children[i].stsec.length - 1].attr.permit;
					} else {
						object.overwrite = false;
						object.permit = children[i].stsec.attr.permit;
					}
					objects.push(object);
				}
				return of(objects);
			}));
	}

	/**
	 * ロールを取得します.
	 * @param roleId ロールID
	 * @return ロール情報
	 */
	public getRole(roleId: number): Observable<any> {
		return;
	}

	/**
	 * 複合グループリストを取得します.
	 */
	public getComplexGroupList(): Observable<any> {
		return;
	}

	/**
	 * ユーザ定義グループリストを取得します.
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getUserDefGroupList(documentId: number, isFilter: boolean): Observable<any> {
		return;
	}

	/**
	 * システム処理リストを取得します.
	 */
	public getSysFuncEntryList(): Observable<any> {

		return this.httpService.postForForm('/jsp/sysCommon/dspSystemFunc.jsp')
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * グループ所属ユーザリストを取得します.
	 * @param groupId グループId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getGroupUserList(groupId: number, documentId: number, isFilter: boolean): Observable<any> {
		return;
	}

	/**
	 * ロール所属ユーザリストを取得します.
	 * @param roleId ロールId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getRoleUserList(roleId: number, documentId: number, isFilter: boolean): Observable<any> {
		return;
	}

	/**
	 * 複合グループ所属ユーザリストを取得します.
	 * @param complexGroupId 複合グループId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getComplexGroupUserList(complexGroupId: number, documentId: number, isFilter: boolean): Observable<any> {
		return;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
