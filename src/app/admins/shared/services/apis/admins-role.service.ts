import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMGroupRoleUserDTO } from 'app/admins/shared/dtos/group-role-user.dto';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * ロールAPIサービス
 */
@Injectable()
export class EIMAdminsRoleService {

	constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected translateService: TranslateService,
			protected dateService: EIMDateService,
			protected domainService: EIMDomainService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * ロール所属ユーザリストを取得します.
	 * @param roleId ロールId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getUserList(roleId: number, documentId: number, isFilter: boolean): Observable<EIMGroupRoleUserDTO[]> {

		let params: any = {};
		params['roleId'] = roleId;
		params['objId'] = documentId;
		params['isFilter'] = isFilter;

		return this.httpService.postForForm('/admin/role/dspRoleUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.users.user, this.convertToEIMUserDTO));
			}));
	}

	/**
	 * ロールリストを取得します.
	 */
	public getRoleList(displayProgressDialog?: boolean): Observable<any> {

		return this.httpService.get('/admin/role/dspRoleTree.jsp', null, displayProgressDialog)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ロールを取得します.
	 * @param roleId ロールID
	 * @return ロール情報
	 */
	public getRole(roleId: number): Observable<any> {
		return this.httpService.postForForm('/admin/role/dspRole.jsp', {roleId: roleId})
			.pipe(mergeMap((res: any) => {
				return of(res.value.role);
			}));
	}

	/**
	 * ロールを新規作成します.
	 * @param nameList 言語リスト
	 * @param attributes 属性一覧
	 * @param parentRoleId 親グループId
	 */
	public createRole(nameList: any, attributes: any, parentRoleId?: number): Observable<any> {

		let params: any = this.nameListToParam(nameList)
		for (let i = 0; i < attributes.length; i++) {
			for (let j = 0; j < attributes[i].attMultipleList.length; j++) {
				if (attributes[i].valTypeId === 3) {
					params['attType_' + attributes[i].attTypeId + '_' + j] = this.dateService.getDateString(attributes[i].attMultipleList[j]);
				} else {
					params['attType_' + attributes[i].attTypeId + '_' + j] = attributes[i].attMultipleList[j];
				}
			}
		}
		if (parentRoleId) {
			params['parentRoleId'] = parentRoleId;
		} else {
			params['parentRoleId'] = 0;
		}

		return this.httpService.postForForm('/admin/role/actCreateRole.jsp', params, false)
		.pipe(mergeMap((res: any) => {
			return of(res.value.role.attr);
		}));
}

	/**
	 * ロールを変更します.
	 * @param roleId 対象ロールID
	 * @param nameList 言語リスト
	 * @param attributes 属性一覧
	 * @param roleParentId 親ロールID
	 */
	public updateRole(roleId: number, nameList: any, attributes: any, roleParentId?: number): Observable<any> {
		let params: any = this.nameListToParam(nameList)
		params['roleId'] = roleId;
		if (roleParentId) {
			params['roleParentId'] = roleParentId;
		}
		for (let i = 0; i < attributes.length; i++) {
			for (let j = 0; j < attributes[i].attMultipleList.length; j++) {
				if (attributes[i].valTypeId === 3) {
					params['attType_' + attributes[i].attTypeId + '_' + j] = this.dateService.getDateString(attributes[i].attMultipleList[j]);
				} else {
					params['attType_' + attributes[i].attTypeId + '_' + j] = attributes[i].attMultipleList[j];
				}
			}
		}
		return this.httpService.postForForm('/admin/role/actUpdateRole.jsp', params, false)
			.pipe(mergeMap((res: any) => {
			return of(res.value.role.attr);
		}));
}

	/**
	 * ロールを削除します.
	 * @param roleId ロールId
	 */
	public deleteRole(roleId: number): Observable<any> {

		let params: any = {};
		params['roleId'] = roleId;

		return this.httpService.postForForm('/admin/role/actDeleteRole.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ユーザをロールに登録します.
	 * @param groupId ロールId
	 * @param userId ユーザId
	 */
	public createRoleUser(roleId: number, userId: number): Observable<any> {

		let params: any = {};
		params['roleId'] = roleId;
		params['userId'] = userId;

		return this.httpService.postForForm('/admin/role/actAssignUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ユーザをロールから削除します.
	 * @param groupId ロールId
	 * @param userId ユーザId
	 */
	public deleteRoleUser(roleId: number, userId: number): Observable<any> {

		let params: any = {};
		params['roleId'] = roleId;
		params['userId'] = userId;

		return this.httpService.postForForm('/admin/role/actReleaseUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * データ変換
	 * @param nameList 言語リスト
	 * @return フォーマット
	 */
	private nameListToParam(nameList: any): {} {
		let params: any = {};
		let languageId = 'otherLId';
		let languageName = 'otherName';
		let languageIdTmp: string;
		let languageNameTmp: string;
		let keys = Object.keys(nameList);
		let languageCnt = keys.length;

		params['otherCnt'] = languageCnt;

		for (let idx = 0; idx < languageCnt; idx++) {
			languageIdTmp = languageId + idx;
			languageNameTmp = languageName + idx;
			params[languageIdTmp] = keys[idx];
			params[languageNameTmp] = nameList[keys[idx]];

		}
		return params;
	}

	/**
	 * JSONをEIMGroupRoleUserDTOに変換して返却します.
	 * @param json JSON
	 * @return EIMGroupRoleUserDTO
	 */
	private convertToEIMUserDTO(json: any): EIMGroupRoleUserDTO {
		let dto: EIMGroupRoleUserDTO = new EIMGroupRoleUserDTO();

		dto.id = Number(json.attr.userId);
		dto.code = json.attr.userCode;
		dto.name = json.attr.userName;
		dto.kana = json.attr.userKana;
		dto.mail = json.attr.userMail;
		dto.groupNames = json.attr.groupName;
		dto.roleNames = json.attr.roleName;
		dto.userDisable = json.attr.userDisable;
		dto.typeLabel = dto.name;
		dto.groupName = dto.groupNames;
		dto.roleName = dto.roleNames;
		return dto;
	}

}
