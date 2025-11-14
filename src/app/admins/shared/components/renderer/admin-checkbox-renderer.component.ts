import { Component, OnDestroy, DoCheck } from '@angular/core';
import { EIMCheckboxRendererComponentService } from 'app/shared/components/renderer/checkbox-renderer.component.service';
import { EIMCheckboxRendererComponent } from 'app/shared/components/renderer/checkbox-renderer.component';
/**
 * チェックボックスレンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMCheckboxRendererComponent
 *
 */
@Component({
    selector: 'eim-checkbox-renderer',
    template: `
		<div style="height: 100%; padding-left: 25px; display: flex; align-items: center;" >
			<eim-checkbox name="check" [(ngModel)]="checked" binary="true" [disabled]="disabled" (onChange)="onChange($event)"></eim-checkbox>
		</div>
    `,
    standalone: false
})

export class EIMAdminsCheckboxRendererComponent extends EIMCheckboxRendererComponent implements DoCheck {
	public params: any;
	public field: string;
	public checked = false;
	public disabled = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected rendererComponentService: EIMCheckboxRendererComponentService,
	) {
		super(rendererComponentService);
	}
	/**
	 * 変更検知後イベントハンドラ.
	 */
	ngDoCheck(): void {
		if (this.params.data[this.field] === true ) {
			this.checked = true;
		}	else {
			this.checked = false;
		}
	}
}
