import { Component, forwardRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMFormWorkflowComponent } from './form-workflow.component';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';
import { SelectModule } from 'primeng/select';

/**
 * ワークフロー（タスク管理）コンポーネント
 * @example
 *
 *      <eim-task-workflow>
 *      </eim-task-workflow>
 */
@Component({
	selector: 'eim-task-workflow',
	templateUrl: './workflow.component.html',
	styleUrls: ['./workflow.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		ButtonDirective,

		AngularSplitModule,
		PanelModule,
		TabsModule,
		InputTextModule,
		SelectModule,
		EIMRadioButtonComponent
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMTaskWorkflowComponent) }
	],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMTaskWorkflowComponent extends EIMFormWorkflowComponent implements AfterViewInit {

	/** ステータス属性タブパネル表示 */
	public override visibleStatusTabPanel = false;

	/** ネームスペース */
	protected readonly namespace = EIMAdminsConstantService.NAMESPACE_TASK_USER;

	/** WorkFlowConfのidのうち表示する最小値のid（マイナス値のためMin/Maxを間違えないように） */
	protected idMin = -29999;
	/** WorkFlowConfのidのうち表示する最大値のid */
	protected idMax = -20000;

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
