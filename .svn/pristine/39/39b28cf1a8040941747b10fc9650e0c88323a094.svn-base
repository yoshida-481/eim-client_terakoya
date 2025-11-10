import {Injectable} from '@angular/core';
import { of, Observable } from 'rxjs';
import {EIMHttpService} from 'app/shared/services/http.service';
import {EIMJSONService} from 'app/shared/services/json.service';
import {EIMServerConfigService} from 'app/shared/services/server-config.service';
import {EIMOperationHistoryDTO} from 'app/admins/shared/dtos/operation-history.dto';
import {EIMDomainService} from 'app/shared/services/domain.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * 操作履歴APIサービス
 */
@Injectable()
export class EIMOperationHistoryService {

	/**
	 * 操作履歴サービス.
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
	 * 操作履歴を取得する
	 * @param condition 検索条件
	 * @return 操作履歴のリスト
	 */
	public search(condition: any): Observable<EIMOperationHistoryDTO[]> {
		return this.httpService.postForForm('/admin/opehist/actSearchOperationHistory.jsp', condition)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.operationHistories.operationHistory,
					(_json: any) => {
						return new EIMOperationHistoryDTO(_json);
					}
				));
			}
		));
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 操作履歴を検索して、CSVダウンロードする
	 * @param condition 検索条件
	 */
	public operationHistoryCsvDownload(condition: any): void {
		let form: any = window.document.getElementById('opeHistDownloadForm');
		form.action = this.serverConfigService.getContextPath() + '/servlet/DownLoadSearchOpeHistCSVFile';
		form.elements.listTitle.value = condition.listTitle;
		form.elements.fromTime.value = condition.fromTime;
		form.elements.toTime.value = condition.toTime;
		form.elements.selectUserId.value = condition.selectUserId;
		form.submit();

	}
}
