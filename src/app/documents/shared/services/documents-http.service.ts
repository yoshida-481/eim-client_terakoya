import { Output, EventEmitter, Injectable, Directive } from '@angular/core';
import { EIMHttpService } from 'app/shared/services/http.service';

/**
 *
 * HTTPサービスです。<br/>
 * @class EIMHttpService
 * @module EIMSharedModule
 */
@Injectable()
export class EIMDocumentsHttpService extends EIMHttpService {

	/** コンテクストルート */
	public contextRoot = null; //'http://localhost:8080/eimForTask';
}
