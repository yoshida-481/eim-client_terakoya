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
 * グループAPIサービス
 */
@Injectable()
export class EIMAdminsGroupService {

	constructor(
			protected　httpService: EIMHttpService,
			protected　jsonService: EIMJSONService,
			protected　translateService: TranslateService,
			protected dateService: EIMDateService,
			protected domainService: EIMDomainService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * グループ所属ユーザリストを取得します.
	 * @param groupId グループId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getUserList(groupId: number, documentId: number, isFilter: boolean): Observable<EIMGroupRoleUserDTO[]>  {

		let params: any = {};
		params['groupId'] = groupId;
		params['objId'] = documentId;
		params['isFilter'] = isFilter;

		return this.httpService.postForForm('/admin/group/dspGroupUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.users.user, this.convertToEIMUserDTO));
			}));
	}

	/**
	 * グループリストを取得します.
	 */
	public getGroupList(): Observable<any> {

		return this.httpService.get('/admin/group/dspGroupTree.jsp')
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * グループリストをパス形式で取得します.
	 * @param serchGroupName グループ名検索文字列
	 */
	public getGroupListPath(serchGroupName: string): Observable<any> {

		let params: any = {};
		// ※jspに渡すパラメータ名自体がスペルミスのため
		params['serchGroupName'] = serchGroupName ? serchGroupName : '';

		return this.httpService.postForForm('/admin/group/actSearchGroup.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * グループを取得します.
	 * @param groupId グループID
	 * @return グループ情報
	 */
	public getGroup(groupId: number): Observable<any> {
		return this.httpService.postForForm('/admin/group/dspGroup.jsp', {groupId: groupId})
			.pipe(mergeMap((res: any) => {
				return of(res.value.group);
			}));
	}

	/**
	 * グループを新規作成します.
	 * @param nameList 言語リスト
	 * @param attributes 属性一覧
	 * @param parentGroupId 親グループId
	 */
	public createGroup(nameList: any, attributes: any, definitionName: string, parentGroupId?: number): Observable<any> {
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
		params['definitionName'] = definitionName;
		if (parentGroupId) {
			params['parentGroupId'] = parentGroupId;
		}

		return this.httpService.postForForm('/admin/group/actCreateGroup.jsp', params, false)
		.pipe(mergeMap((res: any) => {
			return of(res.value.group.attr);
		}));
}

	/**
	 * グループを更新します.
	 * @param groupId 対象グループId
	 * @param nameList 言語リスト
	 * @param attributes 属性一覧
	 * @param parentGroupId 親グループId
	 */
	public updateGroup(groupId: number, nameList: any, attributes: any, definitionName: string, parentGroupId?: number): Observable<any> {
		let params: any = this.nameListToParam(nameList)
		params['groupId'] = groupId;
		for (let i = 0; i < attributes.length; i++) {
			for (let j = 0; j < attributes[i].attMultipleList.length; j++) {
				if (attributes[i].valTypeId === 3) {
					params['attType_' + attributes[i].attTypeId + '_' + j] = this.dateService.getDateString(attributes[i].attMultipleList[j]);
				} else {
					params['attType_' + attributes[i].attTypeId + '_' + j] = attributes[i].attMultipleList[j];
				}
			}
		}
		params['definitionName'] = definitionName;
		if (parentGroupId) {
			params['parentGroupId'] = parentGroupId;
		}

		return this.httpService.postForForm('/admin/group/actUpdateGroup.jsp', params, false)
		.pipe(mergeMap((res: any) => {
				return of(res.value.group.attr);
		}));
}

		/**
	 * グループを削除します.
	 * @param groupId グループId
	 */
	public deleteGroup(groupId: number): Observable<any> {

		let params: any = {};
		params['groupId'] = groupId;

		return this.httpService.postForForm('/admin/group/actDeleteGroup.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
		 * ユーザをグループに登録します.
		 * @param groupId グループId
		 * @param userId ユーザId
		 */
	public createGroupUser(groupId: number, userId: number): Observable<any> {

		let params: any = {};
		params['groupId'] = groupId;
		params['userId'] = userId;

		return this.httpService.postForForm('/admin/group/actAssignUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ユーザをグループから削除します.
	 * @param groupId グループId
	 * @param userId ユーザId
	 */
	public deleteGroupUser(groupId: number, userId: number): Observable<any> {

		let params: any = {};
		params['groupId'] = groupId;
		params['userId'] = userId;

		return this.httpService.postForForm('/admin/group/actReleaseUser.jsp', params, false)
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
