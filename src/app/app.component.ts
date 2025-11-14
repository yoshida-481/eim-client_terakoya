import { Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Component, ViewEncapsulation, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DialogModule } from 'primeng/dialog';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMHttpForRestAPIService } from './shared/services/http-for-rest-api.service';
import { PrimeNG } from 'primeng/config';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'eim-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
	imports:[
		CommonModule,
		RouterModule,
		DialogModule,
		FormsModule,
		TranslateModule
	],
	// 本コンポーネントの子孫に共通のインスタンスになる
	providers:[
	],
    encapsulation: ViewEncapsulation.None,
    schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    standalone: true
})
export class AppComponent implements OnDestroy {
	/** 描画遅延中のモーダル制御用フラグ */
	public progressDialogForBackground: boolean = false;

	/** プログレスバー表示フラグ */
	public displayProgressDialog: boolean = false;

	/** 言語ファイル読込済フラグ */
	public translateLoaded = false;

	/**
	 * プログレスバー表示前のアクティブなエレメント（フォーカスが当たっていたエレメント）
	 */
	private activeElement;

	/** 問い合わせ開始サブスクリプション */
	private startedSubscription: Subscription;

	/** 問い合わせ終了サブスクリプション */
	private endedSubscription: Subscription;

	/** 問い合わせ中フォーカス変更サブスクリプション */
	private focusChangedSubscription: Subscription;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translate: TranslateService,
			protected httpService: EIMHttpService,
			protected httpForRestAPIService: EIMHttpForRestAPIService,
			protected config: PrimeNG,
	) {
		// 暫定処理 ローカルストレージから言語IDを取り出す
		let langId: string = localStorage.getItem('langId');
		langId = (langId == null ? 'JA' : langId);
		// 子コンポーネント表示前に言語ファイルの読込まで完了しておく
		translate.use(langId)
			.pipe(flatMap(_ => translate.get('EIM.LABEL_01003')))
			.subscribe(null, null, () => this.translateLoaded = true);

		// PrimeNGの設定を読み込む
		this.translate.get('EIM.CALENDAR').subscribe(res => this.config.setTranslation(res));

		// httpService用
		this.startedSubscription = httpService.started.subscribe(() => {
			window.setTimeout(() => {
				
				this.activeElement = window.document.activeElement;
				this.progressDialogForBackground = true;
			});
		});
		httpService.startedDialog.subscribe(() => { 
			if(this.progressDialogForBackground){
				
				this.displayProgressDialog = true;
				this.progressDialogForBackground = false;
			}
			else{
				this.displayProgressDialog = false;
			}
		});
		
		this.endedSubscription = httpService.ended.subscribe(() => {
			window.setTimeout(() => {
				this.progressDialogForBackground = false;
				this.displayProgressDialog = false;
				if (this.activeElement) {
					window.setTimeout(() => {
						this.activeElement.focus();
					});
				}
			});
		});

		// httpForRestAPIService用
		this.startedSubscription = httpForRestAPIService.started.subscribe(() => {
			window.setTimeout(() => {
				
				this.activeElement = window.document.activeElement;
				this.progressDialogForBackground = true;
			});
		});
		httpForRestAPIService.startedDialog.subscribe(() => { 
			if(this.progressDialogForBackground){
				
				this.displayProgressDialog = true;
				this.progressDialogForBackground = false;
			}
			else{
				this.displayProgressDialog = false;
			}
		});
		this.endedSubscription = httpForRestAPIService.ended.subscribe(() => {
			window.setTimeout(() => {
				this.progressDialogForBackground = false;
				this.displayProgressDialog = false;
				if (this.activeElement) {
					window.setTimeout(() => {
						this.activeElement.focus();
					});
				}
			});
		});

		this.focusChangedSubscription = httpService.focusChanged.subscribe((elements: HTMLElement[]) => {
			window.setTimeout(() => {
				this.activeElement = elements[0];
			});
		});

		/**
		 * ドロップイベントハンドラ.
		 * ファイルドロップでファイル内容をブラウザに表示されてしまう現象を防ぐ.
		 */
		window.document.body.addEventListener('drop', function(e) {
			e.preventDefault();
		}, false);

		/**
		 * ドラッグイベントハンドラ
		 * ファイルドロップでファイル内容をブラウザに表示されてしまう現象を防ぐ.
		 */
		window.document.body.addEventListener('dragover', function(e) {
			e.preventDefault();
		}, false);

	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.startedSubscription.closed) { this.startedSubscription.unsubscribe(); };
		if (!this.endedSubscription.closed) { this.endedSubscription.unsubscribe(); };
		if (!this.focusChangedSubscription.closed) { this.focusChangedSubscription.unsubscribe(); };
	}

	/**
	 * プログレスバー表示時のハンドラです.
	 * フォーカスをプログレスバーに移動します.
	 * @param event イベント
	 */
	onShowProgressBar(event) {
		if (!this.displayProgressDialog) {
			return;
		}
		const element: HTMLElement = window.document.getElementById('progressBarFocusTarget');
		if (element) {
			element.focus();
		}
	}

	/**
	 * フォーカス喪失時のハンドラです.
	 * フォーカスをプログレスバーに移動します.
	 * @param event イベント
	 */
	onBlurProgressBar(event) {
		if (!this.displayProgressDialog) {
			return;
		}
		const element: HTMLElement = window.document.getElementById('progressBarFocusTarget');
		if (element) {
			element.focus();
		}
	}

}
