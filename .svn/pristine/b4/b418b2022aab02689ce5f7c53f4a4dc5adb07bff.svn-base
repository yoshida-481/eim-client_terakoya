import { Component, ComponentFactoryResolver, ComponentRef, EventEmitter, forwardRef, Input, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMWorkspaceHomeWidgetComponent } from '../workspace-home/workspace-home.component';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { Subscription } from 'rxjs';

/**
 * ウィジェットラッパーコンポーネント
 * @example
 *
 *      <eim-workspace-home-widget-wrapper>
 *      </eim-workspace-home-widget-wrapper>
 */
@Component({
	selector: 'eim-workspace-home-widget-wrapper',
	templateUrl: './workspace-home-widget-wrapper.component.html',
	styleUrls: ['./workspace-home-widget-wrapper.component.scss'],
	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceHomeWidgetWrapperComponent)}, ],
	standalone: false,
})
export class EIMWorkspaceHomeWidgetWrapperComponent {

	/** ヘッダタイトル */
	@Input()
	public headerTitle: string = null;

	/** ウィジェットのコンポーネント */
	@Input()
	public widgetComponent: Type<EIMWorkspaceHomeWidgetComponent> = null;

	/** ワークスペースID */
	@Input()
	public workspaceId: number = null;

	/** タスク選択時イベントエミッタ */
	@Output() 
	public selectedTask: EventEmitter<{taskId: number, parent: EIMSimpleObjectDTO}> = new EventEmitter();
	
	/** ウィジェット配置用のコンテナ */
	@ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

	/** ウィジェットのコンポーネント参照 */
	private componentRef: ComponentRef<EIMWorkspaceHomeWidgetComponent> = null;

	/** タスク選択イベントのサブスクリプション */
	private selectedTaskSubscription: Subscription = null;
	
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected resolver: ComponentFactoryResolver,
	) {

	}
	
	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ウィジェットを更新します.
	 */
	public update(): void {

		if (this.componentRef) {
			this.componentRef.instance.workspaceId = this.workspaceId;
			this.componentRef.instance.update();
		}		
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		if (this.widgetComponent === null) {
			return;
		}

		const factory = this.resolver.resolveComponentFactory(this.widgetComponent);
		const componentRef = this.container.createComponent(factory);
		Object.assign(componentRef.instance, {workspaceId: this.workspaceId});

		// タスク選択エミッタ定義ありの場合
		if (componentRef.instance.hasOwnProperty('selectedTask')) {

			this.selectedTaskSubscription = componentRef.instance['selectedTask'].subscribe((dto) => {

				this.selectedTask.emit(dto);
			});
		}

		this.componentRef = componentRef;
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		// サブスクリプションを解除
		if (this.selectedTaskSubscription) {
			this.selectedTaskSubscription.unsubscribe();
		}
	}
}
