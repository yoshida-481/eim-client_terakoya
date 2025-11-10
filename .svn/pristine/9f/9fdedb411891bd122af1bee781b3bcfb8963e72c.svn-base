import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

/**
 * 結果レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMProcessingResultRendererComponent
 *
 */
@Component({
    selector: 'eim-processing-result-renderer',
    template: `
    <div *ngIf="showIcon()" style="height: 100%; position: relative;">
    <i class="{{iconClass()}}" pTooltip="{{getErrorMessage()}}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></i>
    </div>
    `,
    styles: [`
      .fa-color-ok:before {
        color: #008000;
      }
      .fa-color-ng:before {
        color: #ff0000;
      }
    `],
    standalone: false
})
export class EIMProcessingResultRendererComponent implements AgRendererComponent {

	/** パラメータ */
	public params: any;

	/**
	 * コンストラクタ.
	 */
	constructor() {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * アイコン表示を判定します.
	 * @return 表示する場合はtrue
	 */
	public showIcon(): boolean {
		if (this.params.data.hasOwnProperty('isSuccess') || this.params.data.hasOwnProperty('isError')) {
			return true;
		}
		return false;
	}

	/**
	 * アイコンクラスを取得します.
	 * @return アイコンクラスの文字列
	 */
	public iconClass(): string {
		if (this.params.data.isSuccess) {
			return 'fa fa-circle-o fa-2x fa-color-ok';
		} else if (this.params.data.isError) {
			return 'fa fa-close fa-2x fa-color-ng';
		}
		return '';
	}

	/**
	 * エラーメッセージを取得します.
	 * @return エラーメッセージ
	 */
	public getErrorMessage(): string {
		if (this.params.data.hasOwnProperty('errorMessage')) {
			return this.params.data.errorMessage;
		}
		return '';
	}
}
