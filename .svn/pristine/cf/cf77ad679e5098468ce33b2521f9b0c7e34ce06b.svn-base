import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMDialogManagerComponentService } from 'app/forms/shared/components/dialog-manager/dialog-manager.component.service';

import { EIMIdRendererComponentService } from 'app/forms/shared/components/renderer/id-renderer.component.service';

/**
 * IDレンダラーコンポーネント
 * @example
 *      
 *      cellRendererFramework: EIMIdRendererComponent
 *      
 */
@Component({
    selector: 'eim-id-renderer',
    template: `
    <i class="fa fa-lg eim-icon-file eim-icon-file-color" style="padding-left:3px; padding-right:3px;"></i>
    <a href="#" style="padding-left:3px; padding-right:3px;" (click)="onClick($event, params)">{{label}}</a>
		`,
    styles: [`
			::ng-deep eim-id-renderer a:visited {
				color: #0000ff;
			}
		`],
    standalone: false
})
export class EIMIdRendererComponent implements AgRendererComponent {
	public params: any;
	public label: string;

	constructor(
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			protected idRendererComponentService: EIMIdRendererComponentService,
	) {
		
	}
	
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = params.data.name;
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
	 * クリックイベントハンドラ
	 * @param event イベント
	 * @param params パラメータ
	 */
	onClick(event, params) {
		// リンククリックイベントのバブリングを止める（選択行クリックでセルが編集状態になるため）
		event.preventDefault();
		
		this.idRendererComponentService.clicked(params.data);
		
	}
	
}
