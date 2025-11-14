import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { EIMMenuChangeDetectionService, EIMMenuChangeDetectionServiceInfo } from 'app/shared/services/menu-change-detection.service';
import { EIMMenuItem } from 'app/shared/shared.interface';
import { Menubar, MenubarModule } from 'primeng/menubar';

/**
 * メニューバーコンポーネント
 * @example
 *
 *	<eim-menubar
 *		[model] = "model"
 *		[style] = "style">
 *	</eim-menubar>
 */
@Component({
    selector: 'eim-menubar',
    templateUrl: './menubar.component.html',
    styleUrls: ['./menubar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush, // この行を指定するとinnerModelの参照を変更してもp-menubarの更新が行われない
    providers: [MenubarModule],
    standalone: false
})
export class EIMMenubarComponent implements OnChanges, DoCheck, OnDestroy {

	/** メインメニュー */
	@Input() public model: EIMMenuItem[];

	/** メニュースタイル */
	@Input() public style: {};

	/** メニューバーコンポーネント */
	@ViewChild('menubar', { static: true }) menubar: Menubar;

	/** メニュー要素のDiffer情報 */
	protected menuInfo: EIMMenuChangeDetectionServiceInfo;

	/** コマンド未設定のメニューアイテムをクリックしたかどうか */
	protected isClickedNoCommandMenuItem = false;

	/** bind this するイベントリスナ */
	protected onMouseLeaveMenuItemBindThis = null;
	protected onMouseOverMenuItemBindThis = null;
	protected onClickMenuItemBindThis = null;

	static readonly MENUBAR_ROOT_LIST_CLASS_NAME: string = 'p-menubar-root-list'
	static readonly MENUBAR_ITEM_CLASS_NAME: string = 'p-menubar-item';
	static readonly MENUBAR_ITEM_ACTIVE_CLASS_NAME: string = "p-menubar-item-active";


	/**
	 * コンストラクタ
	 */
	constructor(
			protected menuChangeDetectionService: EIMMenuChangeDetectionService,
			protected cdr: ChangeDetectorRef) {

		this.onMouseLeaveMenuItemBindThis = this.onMouseLeaveMenuItem.bind(this);
		this.onMouseOverMenuItemBindThis = this.onMouseOverMenuItem.bind(this);
		this.onClickMenuItemBindThis = this.onClickMenuItem.bind(this);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値変更後のイベントハンドラ.
	 */
	ngOnChanges(): void {
		if (this.model) {
			for (let i = 0; i < this.model.length; i++) {
				// 呼び出し元の各メニューにcommandが設定されているかチェックし、なかった場合はコマンドを追加する
				if (!this.model[i].command) {
					this.model[i] = Object.assign(this.model[i], {command: (event) => {this.onClickNoCommandMenuItem(event, i); }});
				}
			}
			this.menuInfo = this.menuChangeDetectionService.createDifferInfo(this.model);
		}
		window.setTimeout(() => {
			this.setActivateEvent();
		});
	}

	/**
	 * 変更検知後イベントハンドラ.
	 */
	ngDoCheck(): void {
		if (!this.model) {
			return;
		}

		// メニューの変更アリなら再描画
		if (this.menuChangeDetectionService.isChanged(this.menuInfo, this.model)) {
			this.model = this.model.filter(item => item);

			// HTMLのエレメントの作り直しが行われる可能性があるので、エベントリスナを削除してから再度追加する
			this.removeActivateEvent();
			window.setTimeout(() => {
				this.setActivateEvent();
			});
			this.cdr.detectChanges();
		}
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		this.removeActivateEvent();
	}

	/**
	 * コマンド未設定メニュークリックイベントハンドラ.
	 * @param event イベント
	 * @param index メインメニュー番号
	 */
	 onClickNoCommandMenuItem(event: any, index: number): void {
		// コマンド未指定のメニューアイテムがクリックされたフラグをONにする
		// この後onClickMenuItemが処理されるのでフラグのON/OFFにて、コマンドあり/なしのメニューがクリックされたかを識別する
		this.isClickedNoCommandMenuItem = true;
	}

	/**
	 * マウスリーヴイベントハンドラ.
	 * @param event イベント
	 */
	onMouseLeaveMenuItem(event): void {
		let targetElement = event.currentTarget;
		this.switchExpandMenu(targetElement, false);

		let childElements = targetElement.getElementsByClassName(EIMMenubarComponent.MENUBAR_ITEM_CLASS_NAME);
		for (let i = 0; i < childElements.length; i++) {
			this.switchExpandMenu(childElements[i], false);
		}
	}

	/**
	 * マウスオーバーイベントハンドラ.
	 * @param event イベント
	 */
	onMouseOverMenuItem(event): void {
		let targetElement = event.currentTarget;

		// 無効の場合はサブメニューを表示しないようにする
		if (targetElement.className.indexOf('p-disabled') !== -1) {
			return;
		}

		const composedPaths = event.composedPath();

		// 展開状態を一度すべて非展開にする
		let childElements = targetElement.getElementsByClassName(EIMMenubarComponent.MENUBAR_ITEM_CLASS_NAME);
		for (let i = 0; i < childElements.length; i++) {
			this.switchExpandMenu(childElements[i], false);
		}

		// イベント発生元から、ルートメニュー（新規や改訂など）までのルート上にあるメニューアイテムを展開状態にする
		const menubarItems = composedPaths.filter((element) =>
			element.classList &&
			element.classList.contains(EIMMenubarComponent.MENUBAR_ITEM_CLASS_NAME));

		for (let i = 0; i < menubarItems.length; i++) {
			this.switchExpandMenu(menubarItems[i], true);
		}	

	}

	/**
	 * メニューアイテムクリックイベントハンドラ.
	 * @param event イベント
	 */
	onClickMenuItem(event): void {
		try {
			if (this.isClickedNoCommandMenuItem) {
				// コマンド未設定のメニュークリック時は無視する。ただし展開状態を維持するため、展開処理を実行
				let targetElement = event.currentTarget;
				this.switchExpandMenu(targetElement, true);
				return;
			}
			// コマンド実行時はメニューを消去する
			let targetElement = event.currentTarget;
			this.switchExpandMenu(targetElement, false);

			let childElements = targetElement.getElementsByClassName('p-menubar-item');
			for (let i = 0; i < childElements.length; i++) {
				this.switchExpandMenu(targetElement, false);
			}

		} finally {
			this.isClickedNoCommandMenuItem = false;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * マウスリスナーイベント追加.
	 */
	private setActivateEvent(): void {
		const rootList = this.menubar.el.nativeElement.querySelector('.' + EIMMenubarComponent.MENUBAR_ROOT_LIST_CLASS_NAME);
		const directChildren = rootList ? Array.from(rootList.children) : [];

		const menuItems = directChildren.filter((child: Element) =>
			child.classList.contains(EIMMenubarComponent.MENUBAR_ITEM_CLASS_NAME)
		);
		menuItems.forEach((item: Element) => {
			item.addEventListener('mouseleave', this.onMouseLeaveMenuItemBindThis, false);
			item.addEventListener('mouseover', this.onMouseOverMenuItemBindThis, false);
			item.addEventListener('click', this.onClickMenuItemBindThis, false);
		});
	}

	/**
	 * マウスリスナーイベント削除.
	 */
	private removeActivateEvent(): void {
		const rootList = this.menubar.el.nativeElement.querySelector('.' + EIMMenubarComponent.MENUBAR_ROOT_LIST_CLASS_NAME);
		const directChildren = rootList ? Array.from(rootList.children) : [];

		const menuItems = directChildren.filter((child: Element) =>
			child.classList.contains(EIMMenubarComponent.MENUBAR_ITEM_CLASS_NAME)
		);
		menuItems.forEach((item: Element) => {
			item.removeEventListener('mouseleave', this.onMouseLeaveMenuItemBindThis, false);
			item.removeEventListener('mouseover', this.onMouseOverMenuItemBindThis, false);
			item.removeEventListener('click', this.onClickMenuItemBindThis, false);
		});
	}

	/**
	 * エレメントのクラス一覧にアクティブクラスを追加.
	 * @param element エレメント
	 */
	protected addActiveClass(targetElement: any) {
		if (targetElement.className.indexOf(EIMMenubarComponent.MENUBAR_ITEM_ACTIVE_CLASS_NAME) === -1) {
			targetElement.className += (' ' + EIMMenubarComponent.MENUBAR_ITEM_ACTIVE_CLASS_NAME);
		}
	}

	/**
	 * エレメントのクラス一覧からアクティブクラスを除去.
	 * @param element エレメント
	 */
	protected removeActiveClass(element): void {
		let newClassNames = [];
		let classNames = element.className.split(' ');
		for (let i = 0; i < classNames.length; i++) {
			if (classNames[i] === EIMMenubarComponent.MENUBAR_ITEM_ACTIVE_CLASS_NAME) {
				continue;
			}
			newClassNames.push(classNames[i]);
		}

		element.className = newClassNames.join(' ');
	}
	

	// /**
	//  * メニューの展開/非展開
	//  * @param targetElement p-menubar-itemスタイルを持つ<li>エレメント
	//  */
	private switchExpandMenu(targetElement: any, isExpand: boolean = true): void {
		// <li class="p-menubar-item">
		// 		<div class="p-menubar-item-content"> <-マウスオーバーの背景色の設定はココ
		// 			<a>アイコンとかテキスト</a>
		// 		<div>
		// 		<p-menusub>
		// 			<ul />　<- これを表示/非表示して展開状態をあらわす
		// 		</p-menusub>
		// <li>
		if (targetElement.children[1]) {
			const display = isExpand ? 'flex' : 'none';
			targetElement.children[1].children[0].style.display = display;
		}
		
		// サブメニューがあるかどうかに関わらず、文字色、背景色を変えるために、スタイルを設定する
		if (isExpand) {
			this.addActiveClass(targetElement);
		} else {
			this.removeActiveClass(targetElement);
		}
	}

}
