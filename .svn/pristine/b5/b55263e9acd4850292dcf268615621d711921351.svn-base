import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { mergeMap } from 'rxjs/operators';
import { EIMObjectRoleDomain } from 'app/shared/domains/entity/object-role.domain';
import { EIMDomainService } from '../domain.service';

/**
 * 業務役割サービスサービスクラスです.
 */
@Injectable()
export class EIMObjectRoleService {

	constructor(
		protected jsonService: EIMJSONService,
		protected httpForRestAPIService: EIMHttpForRestAPIService,
		protected domainService: EIMDomainService
	) {
	}

	/**
	 * 業務役割を新規登録します.
	 *
	 * @param objectRoleGroup
	 * @return 業務役割情報
	 */
	public create(objectRoleGroup: EIMObjectRoleDomain) {

		return this.httpForRestAPIService.postJson('/apis/object_roles', objectRoleGroup, true, true)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 業務役割を更新します。
	 * @param objectRoleGroup
	 */
	public update(objectRoleGroup: EIMObjectRoleDomain): Observable<null> {

		return this.httpForRestAPIService.putJson('/apis/object_roles', objectRoleGroup, true, true)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 業務役割を削除します。
	 * @param objectRoleGroup
	 */
	public delete(objectRoleGroup: EIMObjectRoleDomain): Observable<null> {

		return this.httpForRestAPIService.deleteJson('/apis/object_roles', objectRoleGroup, true, true)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * IDをキーに業務役割を取得します。
	 * @param objectRoleGroupId
	 * @return 業務役割情報
	 */
	public getById(id: number): Observable<EIMObjectRoleDomain> {

		return this.httpForRestAPIService.get('/apis/object_roles/' + id, {}, true, true)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 定義名称をキーに業務役割を取得します。
	 * @param definitionName
	 * @return 業務役割情報
	 */
	public getByDefinitionName(definitionName: string): Observable<EIMObjectRoleDomain> {

		return this.httpForRestAPIService.get('/apis/object_roles', {}, true, true)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 条件に従い業務役割一覧を取得します。
	 * 取得したオブジェクトロール一覧は定義名称昇順でソートされます。
	 * @param membersCriteria
	 * @return 業務役割情報リスト
	 */
	public getList(ids: number[], includingReserved?: Boolean): Observable<EIMObjectRoleDomain[]> {

		return this.httpForRestAPIService.get('/apis/object_roles/bulk',
			{ids: ids, includingReserved: includingReserved == null ? false : includingReserved}, true, true)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return new EIMObjectRoleDomain(_json);
					}));
			}));
	}
}