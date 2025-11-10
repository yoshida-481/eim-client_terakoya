import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { getProperty } from 'dot-prop';

/**
 * cellRendererParamsに指定する値レンダラーのパラメータ
 */
export class EIMProgressBarRendererComponentParam {
}

/**
 * バーレンダラーコンポーネント
 * @example
 *
 *      <eim-progress-bar-renderer>
 *      </eim-progress-bar-renderer>
 */
@Component({
	selector: 'eim-progress-bar-renderer',
	template: `
		<div class="eim-progress-bar-cell">
			<div class="eim-progress-bar-container">
				<div class="eim-progress-bar-progress" [style.width.%]="label"></div>
				<div class="eim-progress-bar-value">{{ label }}％</div> 
			</div>
		</div>
	`,
	styles: [`
		.eim-progress-bar-cell {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;

			.eim-progress-bar-container {
				width: 100%;
				height: 100%;
				box-sizing: border-box; 
				position: relative;

				.eim-progress-bar-progress {
					height: 100%;
				}

				.eim-progress-bar-value {
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	`],
	standalone: false,
  })
export class EIMProgressBarRendererComponent implements AgRendererComponent {

	public params: any;

	/** 表示ラベル */
	public label: string;

	constructor(
	) {
	}

	agInit(params: any): void {

		let tmpValue: any = getProperty(params.data, params.column.colDef.field);
		this.label = (Array.isArray(tmpValue) ? tmpValue[0] : tmpValue) || "0";

	}

	refresh(params: any): boolean {
		return true;
	}
	
}
