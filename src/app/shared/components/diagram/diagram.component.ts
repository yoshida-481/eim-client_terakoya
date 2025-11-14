import { Component, ViewChild, ElementRef, EventEmitter, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, SimpleChanges, DoCheck } from '@angular/core';

import { MenuItem } from 'primeng/api';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramOptions, EIMDiagramComponentInfo } from './diagram.component.service';
import { EIMMenuChangeDetectionService, EIMMenuChangeDetectionServiceInfo } from 'app/shared/services/menu-change-detection.service';

/**
 * ダイアグラムコンポーネント
 * @import
 *    import { EIMDiagramModule } from 'app/shared/components/diagram/diagram.module';
 * @example
 *
 *      <eim-diagram
 *          [componentService]="componentService"
 *          [contextMenuItems]="contextMenuItems"
 *          [multiple]="false"
 *          [zoomFromViewCenter]="true"
 *          [(selectedNode)]="selectedNode"
 *          (initialized)="onInitialized($event)"
 *          (changed)="onChanged($event)"
 *          (contextmenu)="onContextmenu($event)"
 *          >
 *      </eim-diagram>
 */
@Component({
    selector: 'eim-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.css'],
    providers: [],
    standalone: false
})
export class EIMDiagramComponent implements OnInit, OnChanges, DoCheck, OnDestroy, AfterViewInit {
	@ViewChild('cy', { static: true }) cy: ElementRef;

	/** コンポーネントサービス */
	@Input()
	public componentService: EIMDiagramComponentService;

	/** コンテキストメニューアイテム */
	@Input()
	public contextMenuItems: MenuItem[];

	/** 描画領域中心からズームするかどうか（falseの場合は座標軸の原点を中心にズームする） */
	@Input()
	public zoomFromViewCenter = false;

	/** 複数行選択可フラグ */
	@Input()
	public multiple = true;

	/** 初期化イベントエミッタ */
	@Output()
	public initialized: EventEmitter<any> = new EventEmitter<any>();

	/** エレメント選択イベントエミッタ */
	@Output()
	public selected: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エレメント選択変更イベントエミッタ */
	@Output()
	public changed: EventEmitter<any> = new EventEmitter<any>();

	/** 右クリックイベントエミッタ */
	@Output()
	public contextmenu: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 右クリックメニュー表示フラグ */
	public showContextMenu = true;

	/** アニメーション中かどうか */
	private animationPlaying = false;

	/** ダイアグラム情報 */
	public info: EIMDiagramComponentInfo;

	/** 描画領域全体 */
	public element: Element;

	/** 画面サイズ変更監視用タイマ */
	private timer;

	/** 表示系調節ボタン活性制御用フラグ */
	public disableButtons = false;

	/** コンテキストメニュー要素のDiffer情報 */
	private menuInfo: EIMMenuChangeDetectionServiceInfo;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected el: ElementRef,
			protected dataGridComponentService: EIMDiagramComponentService,
			protected menuChangeDetectionService: EIMMenuChangeDetectionService,
	) {
		if (!this.componentService) {
			this.componentService = dataGridComponentService;

		}

		this.info = {
			component: this,
			data: [],
			selectedData: [],
			options: {},
			cy: null,
			zoomLevel: 1,
			diagramName: '',
			preSelectedData: [],
			canEmitChangeEvent: true,
			onContextMenu: this.onContextMenu,
		};
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期化します.
	 * @param serviceParam パラメータ
	 * @param isEmitEvent イベントを発火するかどうか
	 */
	public initialize(serviceParam: any = {}, isEmitEvent = true): void {
		this.componentService.initialize(this.info, serviceParam, this.initialized, this.changed, this.selected);
	}

	/**
	 * 選択情報を取得します.
	 * @return 選択情報
	 */
	public getSelectedData(): EIMDiagramElement[] {
			return this.componentService.getSelectedData(this.info);
	}

	/**
	 * 画面を描画します.
	 * @param param パラメータ
	 */
	public show(param: any): void {
		this.componentService.show(this.info, param);
	}

	/**
	 * 画面を消去します.
	 */
	public clear() {
		this.componentService.clear(this.info);
	}

	/**
	 * エレメントを選択します.
	 * @param selectedData 選択するエレメント
	 * @param isEmitEvent 選択イベントを発火するかどうか
	 */
	public select(selectedData: EIMDiagramElement[], isEmitEvent = true): void {
		if (isEmitEvent) {
			this.componentService.select(this.info, selectedData, this.selected);
		} else {
			this.componentService.select(this.info, selectedData);
		}
	}

	/**
	 * ダイアグラムのタイトルを設定します.
	 * @param name タイトル
	 */
	public setDiagramName(name: string): void {
		this.info.diagramName = name;
	}

	/**
	 * ドメインから描画するエレメントを生成します.
	 * @param domain ドメイン
	 */
	public createDiagramElement(domain: any): EIMDiagramElement[] {
		return this.componentService.createDiagramElement(this.info, domain);
	}

	/**
	 * エレメント情報を設定します.
	 * @param data エレメント
	 */
	public setData(data: EIMDiagramElement[]): void {
		this.componentService.setData(this.info, data, this.changed);
	}

	/**
	 * エレメント情報を取得します.
	 * @return エレメント情報
	 */
	public getData(): any[] {
		let rowData: any[] = this.componentService.getData(this.info);
		if (rowData) {
			return rowData;
		}
		return [];
	}

	/**
	 * ダイアグラムの状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			return;
		}

		// 復元します
		this.info.diagramName = state.diagramName;
		this.setData(state.data);
		window.setTimeout(() => {
			// Cytoscapeインスタンスが初期化されているか確認
			if (this.info.cy && typeof this.info.cy.pan === 'function' && typeof this.info.cy.zoom === 'function') {
				this.select(state.selectedData, false);
				this.info.cy.pan(state.pan);
				this.info.cy.zoom(state.zoom);
			}
		});
	}

	/**
	 * ダイアグラムの状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		// Cytoscapeインスタンスが初期化されているか確認
		if (this.info.cy && typeof this.info.cy.pan === 'function' && typeof this.info.cy.zoom === 'function') {
			return {
				diagramName: this.info.diagramName,
				data: this.getData(),
				selectedData: this.getSelectedData(),
				pan: this.info.cy.pan(),
				zoom: this.info.cy.zoom()
			}
		} else {
			return {
				diagramName: this.info.diagramName,
				data: this.getData(),
				selectedData: this.getSelectedData(),
				pan: { x: 0, y: 0 },
				zoom: 1
			}
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	public ngOnInit(): void {
		this.info.multiple = this.multiple;

		// コンテキストメニュー表示可能かどうかを判定をする
		if (this.contextMenuItems && this.contextMenuItems.length > 0) {
			this.showContextMenu = true;
		} else {
			this.showContextMenu = false;
		}
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	 ngOnChanges(changes: SimpleChanges): void {
		if (this.contextMenuItems) {
			this.menuInfo = this.menuChangeDetectionService.createDifferInfo(this.contextMenuItems);
		}
	}

	/**
	 * 変更検知後イベントハンドラ.
	 */
	 ngDoCheck(): void {
		if (!this.menuInfo) {
			return;
		}

		// メニューの変更アリなら再描画
		if (this.menuChangeDetectionService.isChanged(this.menuInfo, this.contextMenuItems)) {
			this.contextMenuItems = this.contextMenuItems.filter(item => item);
		}
	}

	public ngAfterViewInit() {
		// DOM要素が確実に存在することを確認してから初期化
		if (this.cy && this.cy.nativeElement) {
			// 次のチェックサイクルで初期化を実行
			setTimeout(() => {
				this.initializeDiagram();
			}, 0);
		}
	}

	/**
	 * ダイアグラムを初期化します.
	 */
	private initializeDiagram(): void {
		// DOM要素の存在を再確認
		if (!this.cy || !this.cy.nativeElement) {
			console.warn('Diagram container element not found, skipping initialization');
			return;
		}

		this.info.cy = this.cy.nativeElement;
		this.info.contextMenuItems = this.contextMenuItems;

		this.initialize({});

		this.element = this.el.nativeElement.children.item(0);

		this.timer = setInterval(() => {

			// ダイアグラムの表示サイズ変更、表示位置変更を検知
			if (!this.element || !this.info.cy) {
				return;
			}

			let rect: any = this.element.getBoundingClientRect();
			let newWidth: number = rect.right - rect.left;
			let newHeight: number = rect.bottom - rect.top;
			let newX: number = rect.left;
			let newY: number = rect.top;
			if (this.info.cy['_preWidth'] == newWidth &&
					this.info.cy['_preHeight'] == newHeight &&
					this.info.cy['_preX'] == newX &&
					this.info.cy['_preY'] == newY
					) {
				return;
			}

			this.info.cy.resize();
			this.info.cy['_preWidth'] = newWidth;
			this.info.cy['_preHeight'] = newHeight;
			this.info.cy['_preX'] = newX;
			this.info.cy['_preY'] = newY;
		}, 300);

	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		if (this.timer) {
			clearInterval(this.timer);
		}
		if (this.info && this.info.cy) {
			this.info.cy.destroy();
			this.info.cy = null;
		}
	}

	/**
	 * 右クリックイベントハンドラ
	 * @param info ダイアグラム情報
	 * @param target 右クリックしたターゲットエレメント
	 */
	public onContextMenu(info: EIMDiagramComponentInfo, target: any): void {
		info.cy.$('*').unselect();
		if (target.data) {
			info.cy.$('#' + target.data.id).select();
		}

		if (info.contextMenuItems) {

			if (!target.group || target.group !== 'nodes') {
				for (let i = 0; i < info.contextMenuItems.length; i++) {
					info.contextMenuItems[i].disabled = true;
				}
			} else {
				for (let i = 0; i < info.contextMenuItems.length; i++) {
					info.contextMenuItems[i].disabled = false;
				}
			}
		}

		info.component.contextmenu.emit(target.data);
	}

	/**
	 * フィットボタン押下時のハンドラ
	 */
	public onClickFit(): void {
		if (this.animationPlaying) {
			return;
		}

		this.animationPlaying = true;

		this.info.cy.animate({
		  fit: {
		    padding: 20
		  }
		}, {
		  duration: 200,
			complete: () => {
				this.animationPlaying = false;
		  }
		});
	}

	/**
	 * ズームボタン押下時のハンドラ
	 */
	public onClickZoom(level: number): void {
		if (this.animationPlaying) {
			return;
		}

		this.animationPlaying = true;

		// Cytoscapeインスタンスが初期化されているか確認
		if (!this.info.cy || typeof this.info.cy.zoom !== 'function') {
			this.animationPlaying = false;
			return;
		}

		// ズームレベル算出
		this.info.zoomLevel = this.info.cy.zoom();
		this.info.zoomLevel += level;
		if (this.info.zoomLevel < this.info.cy.minZoom()) {
			this.info.zoomLevel = this.info.cy.minZoom();
		}
		if (this.info.zoomLevel > this.info.cy.maxZoom()) {
			this.info.zoomLevel = this.info.cy.maxZoom();
		}

		if (this.info.zoomLevel === this.info.cy.zoom()) {
			// ズームの変更がなければ処理なし
			this.animationPlaying = false;
			return;
		}

		// 中心位置算出
		let eles;
		let selectedData: EIMDiagramElement[] = this.getSelectedData();
		if (selectedData.length === 1) {
			// 選択アイテムを中心にする
			eles = this.info.cy.$('#' + selectedData[0].id);
			let ani = this.info.cy.animate({
			  zoom: this.info.zoomLevel
			}, {
				duration: 200,
				center: {
					eles: eles,
				},
				complete: () => {
					this.animationPlaying = false;
			  }
			});
		} else {
			this.element = this.el.nativeElement.children.item(0);

			if (this.zoomFromViewCenter) {
				let ani = this.info.cy.animate({
					zoom: {
						level: this.info.zoomLevel,
						renderedPosition: {x: this.element.clientWidth / 2, y: this.element.clientHeight / 2},
					}
				}, {
					duration: 200,
					complete: () => {
						this.animationPlaying = false;
					}
				});
			} else {
				let ani = this.info.cy.animate({
					zoom: this.info.zoomLevel,
				}, {
					duration: 200,
					complete: () => {
						this.animationPlaying = false;
					}
				});
			}
		}
	}

	/**
	 * マウスアウトのイベントハンドラです.
	 * @param event イベント
	 */
	public onMouseOut(event: any): void {
	}

}
