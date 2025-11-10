import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFormWorkspaceDTO } from 'app/shared/dtos/form-workspace.dto';

import { EIMFormWorkspaceDomain } from 'app/shared/domains/form-workspace.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

@Injectable()
export class EIMFormWorkspaceService {

	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
	) {
	}


	/**
	 * 帳票ワークスペース一覧を取得します.
	 */
	public getList(criteria):Observable<EIMFormWorkspaceDTO[]> {
		return this.httpService.post('/rest/form-workspace/getList.mvc', criteria)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value, (json:any) => {return new EIMFormWorkspaceDTO(json);}));
		}));
	}
	
	/**
	 * 帳票ワークスペース一覧(書き込み権限有り)を取得します.
	 */
	public getListForWriteAuthority(criteria):Observable<EIMFormWorkspaceDTO[]> {
		return this.httpService.post('/rest/form-workspace/getListForWriteAuthority.mvc', criteria)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value, (json:any) => {return new EIMFormWorkspaceDTO(json);}));
		}));
	}
	
	/**
	 * 書き込み権限が有る帳票ワークスペースを取得します.
	 * @param id 帳票ID
	 * @return 帳票
	 */
	public getByIdForWriteAuthority(id:number):Observable<EIMFormWorkspaceDTO> {
		return this.httpService.get('/rest/form-workspace/getByIdForWriteAuthority.mvc', {id: id})
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormWorkspaceDTO(res.value));
			}));
	}
	
	/**
	 * 処理待ち一覧を取得します.
	 */
	public getProcessingList():Observable<EIMFormWorkspaceDTO[]> {
		return this.httpService.post('/rest/form-workspace/getProcessingList.mvc')
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value, (json:any) => {return new EIMFormWorkspaceDTO(json);}));
		}));
	}
	
}
