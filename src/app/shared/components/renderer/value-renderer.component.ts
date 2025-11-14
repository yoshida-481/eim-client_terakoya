import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { getProperty } from 'dot-prop';
import { EIMDataGridComponent } from '../data-grid/data-grid.component';

/**
 * cellRendererParamsに指定する値レンダラーのパラメータ
 */
export class EIMValueRendererComponentParam {
	iconClassFunctions?: ((dto: any) => string)[];
	styleFunctions?: ((dto: any) => string)[];
	linkableFunction?: (dto: any) => boolean;
	editableFunction?: (dto: any) => boolean;
	onClickLinkFunction?: (dto: any) => void;
	enableTreeView?: boolean = false;
	toolTipString?: string;
	isDispMouseOverMenu?: boolean;
}

/**
 * 値レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMValueRendererComponent
 *
 */
@Component({
		selector: 'eim-value-renderer',
		template: `
		<div style="height: 100%; display: flex; align-items: center;" class="{{class}}">
			<div *ngIf="enableTreeView" [eimDataGridTreeToggleButton]="params"></div>
			<i *ngIf="label && visibleIcon" class="eim-label-icon fa {{iconClass}} fa-lg" pTooltip="{{toolTipString}}" style="padding-left:3px; padding-right:3px;"></i>
			<a *ngIf="enableLink" href="#" style="color: #0044CC;" (click)="onClick($event, params.data)">
				<pre style="margin: 0px;">{{label}}</pre>
			</a>
			<span *ngIf="!enableLink" href="#" style="">{{label}}</span>
			<div *ngIf="isDispMouseOverMenu" style="flex: 1; display: flex; justify-content: flex-end; align-items: center;" >
				<div style="display: flex; justify-content: center;"
					[ngClass]="{'hover-background': mouseEnterIcon}" (mouseenter)="onMouseEnterIcon(node)" (mouseleave)="onMouseLeaveIcon()">

					<button pButton type="button" *ngIf="showIcon" style="width: 100%; background: none; background-color: transparent; border: none;"
						class="icon-only-button" icon="fa fa-solid fa-bars" (click)="onClickShowMenu($event)">
					</button>
				</div>
			</div>
		</div>
	`,
	styles: [`

		::ng-deep  .hover-background {
			background-color: #dad8d8;
		}
	`],
	standalone: false,
})
export class EIMValueRendererComponent implements AgRendererComponent, OnInit, OnDestroy {

	public params: any;

	/** 表示ラベル */
	public label: string;
	public iconClass: string;
	public enableLink = false;
	public enableTreeView = false;
	public toolTipString = '';

	/** アイコンを表示するかどうか */
	public visibleIcon = false;
	/** マウスオーバーイベント用のtemplateを表示するかどうか */
	public isDispMouseOverMenu = false;
	/** マウスオーバー状態かどうかの判定用 */
	public showIcon = false;
	public mouseEnterIcon = false;

	public class: string;

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit() {
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy() {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {

		this.params = params;

		// label
		this.label = this.getLabel(params);

		let cellRendererParams: EIMValueRendererComponentParam = this.params.colDef.cellRendererParams;

		if (!cellRendererParams) {
			return;
		}

		// icon
		if (cellRendererParams.iconClassFunctions) {
			this.visibleIcon = true;
		} else {
			this.visibleIcon = false;
		}
		this.iconClass = this.getClass(params.data, cellRendererParams.iconClassFunctions);

		// enableLink
		this.enableLink = this.isEnableLink(params.data, cellRendererParams.linkableFunction);

		// enableTreeView
		this.enableTreeView = cellRendererParams.enableTreeView;

		this.class = this.getClass(params.data, cellRendererParams.styleFunctions);

		if (!params.data.latest) {
			this.toolTipString = cellRendererParams.toolTipString;
		}

		if (cellRendererParams.isDispMouseOverMenu) {
			this.isDispMouseOverMenu = cellRendererParams.isDispMouseOverMenu;
		}
		
		// マウスオーバー時にアイコンを表示する
		params.eGridCell.addEventListener('mouseenter', () => {
			this.showIcon = true;
		});
	
		// マウスがセルを離れたときにアイコンを非表示にする
		params.eGridCell.addEventListener('mouseleave', () => {
			this.showIcon = false;
		});
	}

	/**
	 * ラベルを返却します.
	 *
	 * @param params レンダラのパラメータ
	 * @returns ラベル
	 */
	protected getLabel(params: any): string {

		// valueGetterの返却値あり
		if (params.value !== undefined) {
			return params.value;
		}

		return getProperty(params.data, params.column.colDef.field);
	}

	/**
	 * クラスを返却します.
	 * @param dto DTO
	 * @param classFunctions クラス取得関数リスト
	 * @returns クラス
	 */
	protected getClass(dto: any, classFunctions: ((dto: any) => string)[]): string {

		if (!classFunctions) {
			return '';
		}

		for (let classFunction of classFunctions) {
			let cls = classFunction(dto);
			if (cls) {
				return cls;
			}
		}

		return '';
	}

	/**
	 * リンク表示可能かどうかを返却します.
	 *
	 * @param dto DTO
	 * @param linkableFunction リンク表示可能取得関数
	 * @returns リンク表示が可能かどうか（可能ならtrue）
	 */
	protected isEnableLink(dto: any, linkableFunction: (dto: any) => boolean): boolean {

		if (!linkableFunction) {
			return false;
		}
		return linkableFunction(dto);
	}

	/**
	 * リンククリックイベントハンドラ
	 *
	 * @param event イベント
	 * @param params パラメータ
	 */
	onClick(event, dto: any) {
		// リンククリックイベントのバブリングを止める（選択行クリックでセルが編集状態になるため）
		event.preventDefault();
		event.stopPropagation();

		if (this.params.onClickLinkFunction) {
			this.params.onClickLinkFunction(dto);
		}
    }

	/**
	 * メニュー表示アイコンクリックイベントハンドラ
	 *
	 * @param event イベント
	 */
	onClickShowMenu(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
	
		(this.params.context as EIMDataGridComponent).select(this.params.data);

		// イベントが発生した場所の座標を取得
		const clickX = event.clientX;
		const clickY = event.clientY;

		const target = event.target as Element;
		const cell = target.closest('.ag-cell');
		if (cell) {

			// 右クリックイベントを発火
			const contextMenuEvent = new MouseEvent('contextmenu', {
				bubbles: true,
				cancelable: true,
				view: window,
				clientX: clickX,
				clientY: clickY
			});
			cell.dispatchEvent(contextMenuEvent);
		}
	}
	 
	/**
	 * メニューアイコンのマウスエンター時イベントハンドラ.
	 * @param node ノード
	 */
	onMouseEnterIcon() {
		this.mouseEnterIcon = true;
	}
	
	/**
	 * メニューアイコンのマウスリーブ時イベントハンドラ.
	 */
	onMouseLeaveIcon() {
		this.mouseEnterIcon = false;
	}

}
