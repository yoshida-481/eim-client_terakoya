import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMGroupRoleUserDTO } from 'app/admins/shared/dtos/group-role-user.dto';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * エントリAPIサービス
 */
@Injectable()
export class EIMAdminsComplexGroupService {

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
	 * 複合グループ所属ユーザリストを取得します.
	 * @param complexGroupId 複合グループId
	 * @param documentId 文書Id
	 * @param isFilter フィルタフラグ
	 */
	public getUserList(complexGroupId: number, documentId: number, isFilter: boolean): Observable<EIMGroupRoleUserDTO[]> {

		let params: any = {};
		params['compId'] = complexGroupId;
		params['objId'] = documentId;
		params['isFilter'] = isFilter;

		return this.httpService.postForForm('/admin/comp/dspCompUser.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.userList.user, this.convertToEIMUserDTO));
			}));
	}

	/**
	 * 複合グループリストを取得します.
	 */
	public getComplexGroupList(): Observable<any> {

		return this.httpService.get('/admin/comp/dspCompTree.jsp')
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 複合グループを作成します.
	 * @param groupId グループId
	 * @param roleId ユーザId
	 */
	public createComp(groupId: number, roleId: number): Observable<any> {

		let params: any = {};
		params['groupId'] = groupId;
		params['roleId'] = roleId;

		return this.httpService.postForForm('/admin/comp/actCreateComp.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 複合グループを削除します.
	 * @param compId 複合グループId
	 */
	public deleteComp(compId: number): Observable<any> {

		let params: any = {};
		params['compId'] = compId;

		return this.httpService.postForForm('/admin/comp/actDeleteComp.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

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
