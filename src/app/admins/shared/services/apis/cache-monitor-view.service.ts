import {Injectable} from '@angular/core';
import { of, Observable } from 'rxjs';
import {EIMHttpService} from 'app/shared/services/http.service';
import {EIMJSONService} from 'app/shared/services/json.service';
import {EIMServerConfigService} from 'app/shared/services/server-config.service';
import {EIMDomainService} from 'app/shared/services/domain.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMCacheSpaceDTO } from '../../dtos/cache-space.dto';
import { EIMCacheEntrySearchDTO } from '../../dtos/cache-entry-search.dto';

/**
 * キャッシュAPIサービス
 */
@Injectable()
export class EIMCacheMonitorViewService {

	/**
	 * キャッシュサービス.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected serverConfigService: EIMServerConfigService,
		protected domainService: EIMDomainService
	) {}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * キャッシュノードリストを取得する
	 * @return キャッシュノードのリスト
	 */
	public getNodes(): Observable<any> {
		return this.httpService.get('/rest/cache-monitor-view/nodes.mvc')
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * キャッシュリストを取得する
	 * @param nodeId ノードID
	 * @return キャッシュのリスト
	 */
	public getCaches(nodeId): Observable<EIMCacheSpaceDTO[]> {
		return this.httpService.get('/rest/cache-monitor-view/caches.mvc', {nodeId: nodeId})
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * キャッシュエントリを検索します.
	 * @param nodeId ノードID
	 * @param cacheSpaceKey キャッシュスペースキー
	 * @param cacheEntryIds 絞り込むキャッシュエントリIDのリスト
	 * @return 検索結果
	 */
	public search(nodeId: number, cacheSpaceKey: string, cacheEntryIds: number[]):
			Observable<EIMCacheEntrySearchDTO> {

		let params: any = {
			nodeId: Number(nodeId),
			cacheSpaceKey: cacheSpaceKey,
			idList: cacheEntryIds
		};
		return this.httpService.post('/rest/cache-monitor-view/entries/search.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * リロードします.
	 * @param nodeId ノードID
	 * @param cacheSpaceKey キャッシュスペースキー
	 * @param pks プライマリキーのリスト
	 */
	public reload(cacheSpaceKey: string, pks: string[]): Observable<null> {
		let params: any = {
			cacheSpaceKey: cacheSpaceKey,
			pkList: pks
		};

		return this.httpService.post('/rest/cache-monitor-view/reload.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(null);
			}));
	}
}
