import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { EIMBoxAuthorizationService } from 'app/shared/services/apis/box-authorization.service';
import { EIMBoxUserDomain } from 'app/shared/domains/box-user.domain';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';

/**
 * Boxメインコンポーネント
 * @example
 *      <eim-box-main>
 * 	    </eim-box-main>
 */
@Component({
    selector: 'eim-box-main',
    templateUrl: './box-main.component.html',
    styleUrls: ['./box-main.component.css'],
    standalone: false
})
export class EIMBoxMainComponent implements OnInit {
	/** 選択コンテンツリスト（初期表示用） */
	@Input('selectedData')
	selectedData: any[];

	/** Box非表示を親コンポーネントへ通知 */
	@Output() closeBoxParent = new EventEmitter<void>();

	/** BoxからEIM上へドキュメント公開ボタン押下を親コンポーネントへ通知 */
	@Output() clickCopyToEIM = new EventEmitter();


	/** 初期化済の場合true */
	initialized = false;
	/** アカウント選択済の場合true */
	accountSelected = false;

	/** ログインユーザ */
	loginUser: EIMBoxUserDomain;

		/**
	 * コンストラクタです.
	 */
	constructor(
		protected authorizationService: EIMBoxAuthorizationService,
		protected documentSessionStorageService: EIMDocumentSessionStorageService,
	) {
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		// ログインユーザ情報を読み込む
		// セッションストレージに設定されている場合（Box領域を非表示→Box領域を表示した場合）は再取得しない
		const boxAreaState = this.documentSessionStorageService.getBoxAreaState();
		if (boxAreaState.loginUser) {
			this.loginUser = boxAreaState.loginUser;
			this.accountSelected = true;
			this.initialized = true;
		} else {
			this.authorizationService.getLoginUser(true, false).subscribe(
				(user) => {
					this.loginUser = user;
					this.documentSessionStorageService.updateBoxAreaState({loginUser: user});
					this.accountSelected = true;
					this.initialized = true;
				},
				(_) => {
					this.accountSelected = false;
					this.initialized = true;
				});
		}
	}

	/**
	 * アカウント情報再読み込み時のイベントハンドラです.
	 */
	onReload() {
		this.authorizationService.getLoginUser(true, false).subscribe(
			(user) => {
				this.loginUser = user;
				this.accountSelected = true;
			},
			(_) => {
				this.loginUser = undefined;
				this.accountSelected = false;
			}
		);
	}

	/**
	 *
	 * 子コンポーネントから受け取ったBox非表示通知をさらに親コンポーネントへ伝達する
	 */
	closeBox() {
		this.closeBoxParent.emit();
	}

	/**
	 *
	 * 子コンポーネントから受け取ったBoxからEIMへのドキュメント公開通知をさらに親コンポーネントへ伝達する
	 */
	onClickCopyToEIM(selectedDataForEIM?: any[]) {
		this.clickCopyToEIM.emit(selectedDataForEIM);
	}
}
