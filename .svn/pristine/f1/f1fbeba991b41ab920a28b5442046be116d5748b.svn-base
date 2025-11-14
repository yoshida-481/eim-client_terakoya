import { ChangeDetectorRef, Component, DoCheck, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { EIMComponent, EIMListComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDocumentMainComponentService } from '../document-main/document-main.component.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { ContextMenu } from 'primeng/contextmenu';
import { EIMMenuChangeDetectionService, EIMMenuChangeDetectionServiceInfo } from 'app/shared/services/menu-change-detection.service';
import { MenuItem } from 'primeng/api';


/**
 * サムネイル作成コンポーネント
 * @example
 *
 *      <eim-thumbnail-viewer
 *          [objectId]="objectId">
 *      </eim-thumbnail-viewer>
 */
@Component({
    selector: 'eim-thumbnail-viewer',
    templateUrl: './thumbnail-viewer.component.html',
    styleUrls: ['./thumbnail-viewer.component.css'],
    providers: [
        EIMDocumentMainComponentService,
        EIMDocumentsConstantService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMThumbnailViewerComponent) }
    ],
    standalone: false
})
export class EIMThumbnailViewerComponent implements OnInit, OnChanges, DoCheck, EIMListComponent<any> {

	/** 属性ツリーコンポーネント */
	@ViewChild('contextMenu')
	private contextMenu: ContextMenu;
		
	//#region input
	/** preview thumbnailList */
	@Input()
	public thumbnailList = [];

	/** 検索ヒット数 */
	@Input()
	public hitCount: number;

	/** 選択アイテムリスト */
	@Input()
	public selectedList: any[] = [];

	/** サムネイル右クリックメニュー */
	@Input()
	public contextMenuItems: EIMMenuItem[] = [];
	
	/** isSmall */
	@Input()
	public isSmall = true;

	/** すべて選択・すべて解除ボタン表示フラグ */
	@Input()
	public showAllSelectButton = true;

	@Input()
	public equals?: (a: any, b: any) => boolean;
	
	/** サムネイル上のボタンメニューアイテム */
	@Input() directMenuButtonItems: MenuItem[] = [];

	/** ダウンロードボタンメニューアイテム */
	@Input() downloadButtonMenuItems: MenuItem[] = [];
	//#endregion

	@Input() accordionActiveIndex: number;
	
	/** 複数選択可能かどうか（未使用） */
	@Input() multiple: boolean = true;

	//#region input
	/** 初期化イベントエミッタ */
	@Output()
	public initialized: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 選択変更イベントエミッタ */
	@Output()
	public changed: EventEmitter<any[]> = new EventEmitter<any[]>();
	
	/** 右クリックイベントエミッタ */
	@Output()
	public contextmenu: EventEmitter<any[]> = new EventEmitter<any[]>();
	
	/** サムネイルのダウンロードボタンクリックイベントエミッタ */
	@Output()
	public thumbnailDownloadButtonClick: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** オブジェクト名のクリックイベントエミッタ */
	@Output() 
	public objNameClick: EventEmitter<number> = new EventEmitter<number>();

	/** オブジェクト名のクリックイベントエミッタ */
	@Output() 
	public initializeThumbnail: EventEmitter<any> = new EventEmitter<any>();
	//#endregion

	/** 選択イベントエミッタ（未使用） */
	@Output() 
	public selected: EventEmitter<any[]> = new EventEmitter<any[]>();

	
	/** 右クリックメニュー表示フラグ */
	public canShowContextMenu: boolean;
	
	/** コンテキストメニュー要素のDiffer情報 */
	private menuInfo: EIMMenuChangeDetectionServiceInfo;

	public displayThumbnailList = [];

	/** ページング　表示する最初のオブジェクトインデックス */
	public first = 0;

	/** ページング　表示するオブジェクトの選択肢 */
	public rowsPerPageOptions = [20,40,60,80];

	/** ページング　表示するオブジェクトの最大個数 */
	public rows = this.rowsPerPageOptions[0];

	/**
	 * コンストラクタです.
	 */
	constructor(
		public changeDetectorRef: ChangeDetectorRef,
		public documentMainComponentService: EIMDocumentMainComponentService,
		public documentsConstantService: EIMDocumentsConstantService,
		protected domainService: EIMDomainService,
		protected menuChangeDetectionService: EIMMenuChangeDetectionService,
		private renderer:Renderer2
	) {
	}


	public initialize(serviceParam?: any, isEmitEvent?: boolean): void 

	public initialize(serviceParam?: any, isEmitEvent?: boolean): void {
		if (isEmitEvent) {
			this.initialized.emit([{sender:this}]);
		} 
	}

	public setData(data: any[]): void {
		throw new Error('Method not implemented.');
	}

	public select(selectedData: any[], isEmitEvent: boolean): void {
		this.selectedList = Array.from(selectedData);
		if(isEmitEvent){
			this.changed.emit(this.selectedList);
		}
	}

	public getSelectedData(): any[] {
		return this.selectedList;
	}
	disabled?: boolean;

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// コンテキストメニュー表示可能かどうかを判定をする
		if (this.contextMenuItems && this.contextMenuItems.length > 0) {
			this.canShowContextMenu = true;
		} else {
			this.canShowContextMenu = false;
		}

		this.renderer.listen('document', 'mousedown', (event:MouseEvent) =>{
			if(this.contextMenu && this.contextMenu.visible() && this.contextMenu.isOutsideClicked(event)){
				this.contextMenu.hide();
			}
		});

		this.initialize(null, true);
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (this.contextMenuItems) {
			this.menuInfo = this.menuChangeDetectionService.createDifferInfo(this.contextMenuItems);
		}
		if (changes["thumbnailList"]) {
			if(this.thumbnailList) {
				this.first = 0;
				this.pageChange();
			}
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

	/**
	 * preview onClick
	 */
	objNameClickEvent(eventData: any): void {
		this.objNameClick.emit(eventData);
	}

	/**
	 * select Thumnail
	 */	
	selectThumnail(data): void {
		if(data.select){
			if(!this.selectedList.some((item) => this.equals(item, data.obj))){
				const tmp = this.selectedList.concat([data.obj]);
				this.select(tmp, true);
			}
		}else{
			const tmp = this.selectedList.filter(item => this.equals(item, data.obj) === false );
			this.select(tmp, true);
		}
	}

	/**
	 * 「すべて選択」時の処理です.
	 * @param なし
	 */
	public allSelect(): void {
		// ページングで見えているページを全選択、見えていないページにあるオブジェクトの選択状態は維持
		const selectList = [...this.selectedList];
		for(const displayItem of this.displayThumbnailList){
			if(!selectList.some(selectItem => this.equals(selectItem, displayItem))){
				selectList.push(displayItem);
			}
		}
		this.select(selectList, true);
	}
	/**
	 * 「すべて解除」時の処理です.
	 * @param なし
	 */
	public allNotSelect(): void {
		// ページングで見えているページの選択状態のみ解除、見えていないページにあるオブジェクトの選択状態は維持
		const selectList = this.selectedList.filter(selectedItem => !this.displayThumbnailList.some(displayItem => this.equals(selectedItem, displayItem)));
		this.select(selectList, true);
	}

	public isSelected(data) {
		return this.selectedList.some((item) => this.equals(item, data) )
	}	

	/**
	 * 右クリックイベントハンドラ.
	 * @param event イベント
	 */
	public onAreaContextMenu(event: any): void {
		event.preventDefault();
		event.stopPropagation();
		this.showContextMenu(event);
	}

	/**
	 * サムネイル上のダウンロードメニューボタンが押された時の処理.
	 * @param event イベント
	*/
	public onInitializeThumbnail(event: any): void {
		this.initializeThumbnail.emit(event);
	}

	/**
	 * サムネイル上のpublishボタンが押された時の処理.
	 * @param event イベント
	*/
	public onPublishBtnClick(event: any): void {
		// サムネイル上のpublishボタンが押された場合
		// 選択状態は、そのファイルのみ選択とする
		this.select([event.obj], true);
	}

	/**
	 * サムネイル上のWebDevボタンが押された時の処理.
	 * @param event イベント
	*/
	public onWebDevBtnClick(event: any): void {
		// サムネイル上のWebDevボタンが押された場合
		// 選択状態は、そのファイルのみ選択とする
		this.select([event.obj], true);
	}

	/**
	 * サムネイル上のプロパティボタンが押された時の処理.
	 * @param event イベント
	*/
	public onPropertyBtnClick(event: any): void {
		// サムネイル上のプロパティボタンが押された場合
		// 選択状態は、そのファイルのみ選択とする
		this.select([event.obj], true);
	}

	/**
	 * サムネイル上のダウンロードメニューボタンが押された時の処理.
	 * @param event イベント
	*/
	public onDownloadMenuBtnClick(event: any): void {
		// サムネイル上のコンテキストメニューボタンが押された場合
		// 選択状態は、そのファイルのみ選択とする
		this.select([event.obj], true);
		this.thumbnailDownloadButtonClick.emit();
	}

	/**
	 * サムネイル上のコンテキストメニューボタンが押された時の処理.
	 * @param event イベント
	*/
	public onThumbnailContextmenuBtnClick(event: any): void {
		// サムネイル上のコンテキストメニューボタンが押された場合
		// 選択状態は、そのファイルのみ選択とする
		this.select([event.obj], true);
		this.showContextMenu(event.originalEvent);
	}

	/**
	 * サムネイル上で右クリックしてコンテキストメニューを表示する時の処理.
	 * @param event イベント
	*/
	public onThumbnailContextmenu(event: any): void {
		// サムネイル上で右クリックしてコンテキストメニューを表示する場合
		// 選択状態は、
		// ・対象ファイルが選択状態の場合：選択状態はそのまま維持したままコンテキストメニューを表示
		// ・対象ファイルが非選択状態の場合：他の選択ファイルは非選択状態にし、そのファイルのみ選択状態とする

		event.originalEvent.preventDefault();
		event.originalEvent.stopPropagation();

		if (event.ctrlKey) {
			// Ctrl押下時はメニュー非表示とする
			window.setTimeout(() => {
				this.contextMenu.hide();
			});
			return;
		}
		
		if(!this.selectedList.some((item) => this.equals(item, event.obj))){
			this.select([event.obj], true);
		}
		this.showContextMenu(event.originalEvent);
	}

	/**
	 * コンテキストメニューの表示.
	 * @param event マウスイベント
	*/
	public showContextMenu(event){
		this.contextmenu.emit();
		this.contextMenu.show(event);
	}

	/**
	 * ページング変更.
	 * @param event ページング変更イベント
	*/
	public onPageChange(event){
		this.first = event.first;
		this.rows = event.rows;
		this.pageChange();
	}

	/**
	 * 表示ページの変更.
	*/
	private pageChange(){
		this.displayThumbnailList = this.thumbnailList.slice(this.first, (this.first + this.rows));
	}
}