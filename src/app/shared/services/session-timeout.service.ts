import { Injectable, Output, Directive } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';

/**
 * セッションタイムアウトサービス
 */
@Directive()
@Injectable()
export class EIMSessionTimeoutService {
	/** セッションタイムアウトイベントエミッタ */
	@Output() sessionTimeout: EventEmitter<any>;

	/** 判定対象のセッションタイムアウトメッセージ */
	private sessionTimeoutMessage: any = {
		'JA': 'セッションがタイムアウトしました。',
		'EN': 'The session did the time-out.'
	};

	constructor(
		private localStorageService: EIMLocalStorageService,
		private translateService: TranslateService
	) {
		this.sessionTimeout = new EventEmitter<any>();
	}

	public doSessionTimeout(message?: string): void {

		if (!message) {
			message = this.translateService.instant('EIM.SESSION_TIMEOUT');
		}
		this.sessionTimeout.emit(message);
	}

	/**
	 * メッセージからセッションタイムアウトエラーかどうかを判定します.
	 * @param message エラーメッセージ
	 * @return セッションタイムアウトエラーの場合true、その他エラーの場合false
	 */
	public checkSessionTimeout(message: string): boolean {
		let isSessionTimeout = false;

		let langIdList: any[] = this.localStorageService.getSelectableLangIdList();
		if (langIdList) {
			langIdList.forEach( (lang: any) => {
				let langId: string = lang.langId;
				// TranslateServiceで言語毎のセッションタイムアウトエラーメッセージを取得できれば
				// sessionTimeoutMessageにべた書きする必要はない
				let langMessage: string = this.sessionTimeoutMessage[langId];
				if (message === langMessage) {
					isSessionTimeout = true;
				}
			});

		} else {
			// ローカルストレージに言語リストが無い場合は、ログイン画面を経由していない。
			// 言語リストの有無に関わらず、セッションタイムアウトエラーとする。
			isSessionTimeout = true;
		}

		return isSessionTimeout;
	}

}
