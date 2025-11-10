import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { EIMWorkflowService } from 'app/documents/shared/services/apis/workflow.service';
import { EIMDocumentsHttpService } from '../documents-http.service';

/**
 * 公開PDF作成APIサービス
 */
@Injectable({
  providedIn: 'root'
})
export class EIMPubicDocumentService {

  constructor(
    protected httpService: EIMDocumentsHttpService,
    protected workflowService: EIMWorkflowService,
  ) { }

  /**
	 * 公開PDF作成を実行します.
	 * @param ids 選択データのIDリスト
	 */
	public createPublicPdf(ids: number[]): Observable<null> {
		let params: any = {ids: ids};
		return this.httpService.post('/rest/public-document/create_async.mvc', params)
		.pipe(mergeMap((res: any) => {
			return of(null);
		}));
}
}
