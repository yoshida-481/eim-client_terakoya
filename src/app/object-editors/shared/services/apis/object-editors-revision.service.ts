import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMObjectEditorsCacheService } from 'app/object-editors/shared/services/object-editors-cache.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * オブジェクトAPIサービス
 */
@Injectable()
export class EIMObjectEditorsRevisionService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
	) {}

	/**
	 * オブジェクトを最新版に設定します.
	 * @param objId オブジェクトID
	 */
	public updateLatest(objId: number): Observable<any> {
		return this.httpService.postForForm('/rest/revision/latest.mvc', {objId: objId}).pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}

	/**
	 * オブジェクトをアンロックします.
	 * @param objId オブジェクトID
	 */
	public unlock(objId: number): Observable<any> {
		return this.httpService.postForForm('/rest/revision/unlock.mvc', {objId: objId}).pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}

	/**
	 * オブジェクトをロックします.
	 * @param lockUserId ロックユーザID
	 * @param objId オブジェクトID
	 * @return 実行結果
	 */
	public lock(lockUserId: number, objId: number): Observable<any> {
		return this.httpService.postForForm('/rest/revision/lock.mvc', {lockUserId: lockUserId, objId: objId})
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}

	/**
	 * オブジェクトをリビジョンアップします.
	 * @param execUserId 実行ユーザID
	 * @param objId オブジェクトID
	 * @return 実行結果
	 */
	public revisionUp(execUserId: number, objId: number): Observable<any> {
		return this.httpService.postForForm('/rest/revision/revisionUp.mvc', {execUserId: execUserId, objId: objId})
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}
}
