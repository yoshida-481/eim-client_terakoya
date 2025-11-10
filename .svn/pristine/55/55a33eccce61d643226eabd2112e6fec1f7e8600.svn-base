import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent } from 'app/shared/shared.interface';

/**
 * バージョン表示コンポーネント
 * @example
 *
 * 	<eim-version-display>
 * 	</eim-version-display>
 *
 */
@Component({
    selector: 'eim-version-display',
    templateUrl: './version-display.component.html',
    styleUrls: ['./version-display.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMVersionDisplayComponent) }],
    standalone: false
})
export class EIMVersionDisplayComponent implements OnInit, EIMComponent {

	/** バージョン */
	@Input() public version: string;

	/** バージョンラベル */
	@Input() public versionLabel = '';

	/** ロゴ画像のパス */
	public logoSrc: string = environment.baseURL + 'src/assets/EIM_logo.svg';

  public disabled = false;

	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 */
	constructor(
			private translateService: TranslateService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		if (this.version && this.version != 'null') {
			this.versionLabel = this.version;
		}
	}
}
