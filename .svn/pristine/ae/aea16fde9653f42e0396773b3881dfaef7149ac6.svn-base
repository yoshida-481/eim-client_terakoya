import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output, Renderer2, DoCheck, ElementRef, AfterViewInit } from '@angular/core';
import { EIMComponent, EIMListComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMThumbnailService } from 'app/documents/shared/services/apis/document-thumbnail.service';
import { EIMDocumentMainComponentService } from '../document-main/document-main.component.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { EIMWebDAVService } from 'app/shared/services/webdav.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMMenuChangeDetectionService, EIMMenuChangeDetectionServiceInfo } from 'app/shared/services/menu-change-detection.service';
import { EIMThumbnailCreatorService } from './thumbnail-creator.component.service';


/**
 * サムネイル作成コンポーネント
 * @example
 *
 *      <eim-thumbnail-creator
 *          [objectId]="objectId">
 *      </eim-thumbnail-creator>
 */
@Component({
    selector: 'eim-thumbnail-creator',
    templateUrl: './thumbnail-creator.component.html',
    styleUrls: ['./thumbnail-creator.component.css'],
    providers: [
        EIMDocumentMainComponentService,
        EIMDocumentsConstantService,
        { provide: EIMComponent, useExisting: forwardRef(() => EIMThumbnailCreatorComponent) }
    ],
    standalone: false
})
export class EIMThumbnailCreatorComponent implements OnInit, OnChanges, DoCheck, AfterViewInit {
	private readonly FLAG_TRUE = 'true';

	/** 属性ツリーコンポーネント */
	@ViewChild('downloadButtonMenu')
	private downloadMenu: ContextMenu;

	/** 属性ツリーコンポーネント */
	@ViewChild('myElement')
	private myElement!: ElementRef;
	
	/** 対象のオブジェクト */
	@Input() data: any;
	/** ダウンロードのコンテキストメニューアイテム */
	@Input() downloadButtonMenuItems: MenuItem[] = [];
	/** サムネイル上のボタンアイテム */
	@Input() directMenuButtonItems: MenuItem[] = [];
	/** 選択状態 */
	@Input() selected = false;
	/** オブジェクト名のクリックイベントエミッタ */
	@Input() size = "sm";
	/** 初期化イベントエミッタ */
	@Output() initializeThumbnail: EventEmitter<any> = new EventEmitter<any>();
	/** オブジェクト名のクリックイベントエミッタ */
	@Output() objNameClickEvent: EventEmitter<number> = new EventEmitter<number>();
	/** publishボタンのクリックイベントエミッタ */
	@Output() publishBtnClick: EventEmitter<any> = new EventEmitter<any>();
	/** webdavボタンのクリックイベントエミッタ */
	@Output() webdavBtnClick: EventEmitter<any> = new EventEmitter<any>();
	/** プロパティボタンのクリックイベントエミッタ */
	@Output() propertyBtnClick: EventEmitter<any> = new EventEmitter<any>();
	/** ダウンロードボタンのクリックイベントエミッタ */
	@Output() downloadMenuBtnClick: EventEmitter<any> = new EventEmitter<any>();
	/** コンテキストメニューボタンのクリックイベントエミッタ */
	@Output() contextmenuBtnClick: EventEmitter<any> = new EventEmitter<any>();
	/** オブジェクトの選択イベントエミッタ */
	@Output() selectedEvent: EventEmitter<any> = new EventEmitter<any>();
	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	public dataUrl;
	public isWait = true;
	public isGotImage = false;
	public isFolder = false;
	public isShowWebDev = false;
	public isShowProperty = false;
	public canUseWebDev = false;
	public isShowDownload = false;
	public publishIcon = '';
	public showLink = true;
	public expiration = false;
	public dateLabel = '';
	public statusLabel = '';
	public statusIcon = '';

	public publishToolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02220');
	public isOldRevLink: boolean;

	/** コンテキストメニュー要素のDiffer情報 */
	private menuInfo: EIMMenuChangeDetectionServiceInfo;

	/** サムネイル上の要素のDiffer情報 */
	private directMenueButtonInfo: EIMMenuChangeDetectionServiceInfo;

	/**
	 * コンストラクタです.
	 */
	constructor(
		private translateService: TranslateService,
		private thumbnailService: EIMThumbnailService,
		private webDAVService: EIMWebDAVService,
		private fileService: EIMFileService,
		private userService: EIMDocumentsUserService,
		private serverConfigService: EIMServerConfigService,
		private dialogManagerComponentService: EIMDialogManagerComponentService,
		private publicFileRendererComponentService: EIMPublicFileRendererComponentService,
		public documentMainComponentService: EIMDocumentMainComponentService,
		public documentsConstantService: EIMDocumentsConstantService,
		protected domainService: EIMDomainService,
		protected messageService: EIMMessageService,
		protected dateService: EIMDateService,
		protected renderer:Renderer2,
		protected menuChangeDetectionService: EIMMenuChangeDetectionService,
		private thumbnailCreatorService: EIMThumbnailCreatorService,
	) {
	};

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.isWait = true;

		// 初期化通知
		this.initializeThumbnail.emit({ data: this.data, menuItems: this.directMenuButtonItems });

		// WebDev制御
		this.isShowWebDev = this.editable(this.data);

		// 名前アイコンの指定
        if (this.domainService.isFalse(this.data, 'isDocument')) {
			this.isWait = false;
		} else {
			// 公開制御
			this.initPublishToolTipString();

			// ダウンロード
			this.isShowDownload = true;
		}

		this.isShowProperty = this.isEnableMenu(this.translateService.instant('EIM_DOCUMENTS.LABEL_03007'));

		if (this.domainService.isTrue(this.data, 'isNoLink')) {
			this.showLink = false;
		}

		if (this.domainService.isTrue(this.data, 'readOnly')) {
			this.showLink = false;
		}

		if (this.domainService.isTrue(this.data, 'expiration')) {
			this.expiration = true;
		}

		// ステータス
		if (this.data.lockUserName && this.data.lockUserName != '') {
			this.statusIcon = 'eim-icon-lock eim-icon-lock-color';
		} else {

			this.statusIcon = '';
		}

		this.statusLabel = this.getStatusLabel(this.data);
		this.dateLabel = this.getDateLabel(this.data.modifyDateTime);

		this.renderer.listen('document', 'mousedown', (event:MouseEvent) =>{
			if(this.downloadMenu && this.downloadMenu.visible() && this.downloadMenu.isOutsideClicked(event)){
				this.downloadMenu.hide();
			}
		});

	}

	/**
	 * ビューの初期化後に実行するイベントハンドラです.
	 */
	ngAfterViewInit(): void {
		if(this.serverConfigService.checkThumbnailFileExt(this.data.objName)){
			const callback = function(entries, observer){
				entries.forEach(entry => {
					if(!this.isGotImage && entry.isIntersecting){
						this.getImage();
						return;
					}
				});
			}.bind(this);
			const io = new IntersectionObserver(callback);
			io.observe(this.myElement.nativeElement);
		}else{
			// 初期化時のバインディング値の変更はエラーになるため、遅延させる
			setTimeout(()=>{
				this.isGotImage = false;
				this.isWait = false;
			},0)
		}
	}
	
    /**
     * イメージの設定.
     * @param changes SimpleChanges
     */
    getImage(){
        const cachedImage = this.thumbnailCreatorService.getImage(this.data.objId);
        if (cachedImage) {
            // キャッシュがある場合
            this.dataUrl = cachedImage;
            this.isGotImage = true;
            this.isWait = false;
        } else {
            // サムネイル取得
            this.thumbnailService.getImage(this.data.objId)
            .subscribe((result: any) => {
                if (result.value) {
                    const base64String = result.value;
                    this.dataUrl = "data:image/jpeg;base64," + base64String;
                    this.isGotImage = true;
                    // キャッシュに保存
                    this.thumbnailCreatorService.setImage(this.data.objId, this.dataUrl);
                }
                this.isWait = false;
            });
        }
    }

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (this.downloadButtonMenuItems) {
			this.menuInfo = this.menuChangeDetectionService.createDifferInfo(this.downloadButtonMenuItems);
		}
		if (this.directMenuButtonItems) {
			this.directMenueButtonInfo = this.menuChangeDetectionService.createDifferInfo(this.directMenuButtonItems);
			this.isShowProperty = this.isEnableMenu(this.translateService.instant('EIM_DOCUMENTS.LABEL_03007'));
		}
	}

	/**
	 * 変更検知後イベントハンドラ.
	 */
	ngDoCheck(): void {
		if (this.menuInfo) {
			// メニューの変更アリなら再描画
			if (this.menuChangeDetectionService.isChanged(this.menuInfo, this.downloadButtonMenuItems)) {
				this.downloadButtonMenuItems = this.downloadButtonMenuItems.filter(item => item);
			}
		}
		if (this.directMenueButtonInfo) {
			// メニューの変更アリならonMenuItemsを更新
			if (this.menuChangeDetectionService.isChanged(this.directMenueButtonInfo, this.directMenuButtonItems)) {
				this.directMenuButtonItems = this.directMenuButtonItems.filter(item => item);
			}
		}
	}

	onClickWebDAV(event) {
		event.preventDefault();
		event.stopPropagation();

		this.webdavBtnClick.emit({ originalEvent: event, obj: this.data });

		if (!this.disabled(this.data)) {
			this.webDAVService.checkStatus(this.data.objId).subscribe(
				(editable: boolean) => {
					this.webDAVService.edit(this.data.objId, this.data.objName);
				});
		}
	}

	/**
	 * 別ウィンドウでプレビューを表示します.
	 * @param event イベントデータ
	 */
	onThumbnailImageClick(event){
			event.preventDefault();
			event.stopPropagation();
	
			// メインの一覧のデータが文字のため
			let isDocument: boolean = this.data.isDocument;
			if (this.data.isDocument === 'true') {
				isDocument = true;
			} else if (this.data.isDocument === 'false') {
				isDocument = false;
			}
			if (isDocument) {
				if (this.serverConfigService.checkPreviewFileExt(this.data.objName)) {
					this.openPreviewWindowByThumbnailImage(this.data);
				} else {
					this.fileService.downloadPublicDocument(this.data.objId);
				}
				this.userService.sendReplyMail(this.data.objId);
			} else {
				//
				let nodeData: any = {};
				nodeData.objId = this.data.objId;
				if (this.data.isWorkflowFolder === 'true' || this.data.isWorkflowFolder === true) {
					nodeData.objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
				} else {
					nodeData.objTypeName = this.data.objTypeName;
				}
	
				if (this.data.hasOwnProperty('attrTreeId')) {
					nodeData.attrTreeId = this.data.attrTreeId
					nodeData.attrTreeValues = this.data.attrTreeValues
					nodeData.value = this.data.value
				}
				this.objNameClickEvent.emit(nodeData);
			}
		}
	
	/**
	 * 別ウィンドウでプレビューを表示します.
	 * @param event イベントデータ
	 */
	onPublishClick(event){
		event.preventDefault();
		event.stopPropagation();

		this.publishBtnClick.emit({ originalEvent: event, obj: this.data });

		// メインの一覧のデータが文字のため
		let isDocument: boolean = this.data.isDocument;
		if (this.data.isDocument === 'true') {
			isDocument = true;
		} else if (this.data.isDocument === 'false') {
			isDocument = false;
		}
		if (isDocument) {
			this.doPreviewOrDownload();
		} else {
			//
			let nodeData: any = {};
			nodeData.objId = this.data.objId;
			if (this.data.isWorkflowFolder === 'true' || this.data.isWorkflowFolder === true) {
				nodeData.objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
			} else {
				nodeData.objTypeName = this.data.objTypeName;
			}

			if (this.data.hasOwnProperty('attrTreeId')) {
				nodeData.attrTreeId = this.data.attrTreeId
				nodeData.attrTreeValues = this.data.attrTreeValues
				nodeData.value = this.data.value
			}
			this.objNameClickEvent.emit(nodeData);
		}
	}

	/**
	 * 公開済みかどうかを返却します.
	 * @param data 該当行データ
	 * @return 公開済みかどうか
	 */
	private isPublic(data): boolean {

		if (this.domainService.isTrue(data, 'isDspPdfIcon')) {
			return true;
		}

		if (this.domainService.isTrue(data, 'isDspPubIconForNoWF')) {
			return true;
		}

		if (this.domainService.isTrue(data, 'isPublished')) {
			return true;
		}

		/* メイン画面と検索画面で戻ってくる値が異なるので判定には利用できない
		if (data.hasOwnProperty('isNoWFPublic') && data.isNoWFPublic == 'true') {
			return true;
		}
		*/

		if (data.hasOwnProperty('statusTypeKind')) {
			if (data.statusTypeKind === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
				return true;
			}
		}

		return false;
	}
	/**
	 * プロパティダイアログを表示します.
	 * @param event イベントデータ
	 */
	onPropertyClick(event): void {
		event.preventDefault();
		event.stopPropagation();

		this.downloadMenuBtnClick.emit({ originalEvent: event, obj: this.data });
		this.excuteMenu(this.translateService.instant('EIM_DOCUMENTS.LABEL_03007'));
	}
	
	onThumbnailClick(event): void {
		event.preventDefault();

		this.selectedEvent.emit({obj:this.data, select:!this.selected});
	}

	/**
	 * プロパティダイアログを表示します.
	 * @param event イベントデータ
	 */
	onDownloadClick(event): void {
		event.preventDefault();
		event.stopPropagation();

		this.downloadMenuBtnClick.emit({originalEvent:event,obj:this.data});
		this.downloadMenu.show(event);
	}

	/**
	 * コンテキストメニューボタンが押下された時の処理.
	 * @param event イベントデータ
	 */
	onContextMenuBtnClick(event: MouseEvent): void {
		event.preventDefault();
		event.stopPropagation();

		this.contextmenuBtnClick.emit({originalEvent:event,obj:this.data});
	}

	/**
	 * 選択状態チェックボックスが変更された時の処理.
	 */
	onChangeSelected(event): void {
		event.originalEvent.preventDefault();
		event.originalEvent.stopPropagation();
		
		this.selectedEvent.emit({obj:this.data, select:this.selected});
	}

	getColor(): string {
		let color = '';
		if (!this.disabled(this.data)) {
			color = '#007700';
		}
		return color;
	}

	/**
	 * サムネイルの背景色を取得する.
	 */
	getThumbailColor() {
		return this.selected ? {'background':'#c4eefc'} : {};
	}

	/**
	 * 別ウィンドウでプレビューを表示します.
	 * @param data 該当行データ
	 */
	public openPreviewWindowByThumbnailImage(data: any){

		let mode = '';

		if (this.domainService.isTrue(this.data, 'readOnly') ){// 公開読取
			if (this.domainService.isTrue(this.data, 'isDspPdfIcon') ){ // 公開後（PDF変換あり）
				mode = 'public';
			} else if(this.isPublic(this.data)){
				mode = 'preview';
			}
		}else{
			mode = 'preview';
		}

		if(mode !== ''){
			this.thumbnailService.checkExistsPdf(this.data.objId)
				.subscribe((result: any) => {
					if (result) {
						const url = window.location.origin + window.location.pathname + '#/documents/pdfViewer?objId=' + this.data.objId + '&mode=' + mode;
						window.open(url, '_blank');
					} else {
						this.fileService.downloadPublicDocument(this.data.objId);
					}
				});
		}
	}

	/**
	 * メニューの活性非活性状態を取得
	 * @param menuLable メニューラベル名
	 */
	private isEnableMenu(menuLable: string) {
		const menuItem = this.getMenuItem(menuLable);
		if (menuItem) {
			return !menuItem.disabled;
		}
		return false;
	}

	/**
	 * メニューの活性非活性状態を取得
	 * @param menuLable メニューラベル名
	 */
	private excuteMenu(menuLable: string) {
		const menuItem = this.getMenuItem(menuLable);
		if (menuItem) {
			menuItem.command({});
		}
	}

	private getMenuItem(menuLable: string) {
		if (this.directMenuButtonItems) {
			const propertyMenu = this.directMenuButtonItems.filter(item => item.label === menuLable);
			if (propertyMenu != null && propertyMenu.length == 1) {
				return propertyMenu[0];
			}
		}
		return false;
	}

	//#region "EIMObjectNameRendererComponentからコピー"

	/**
	 * 名前をクリックした時の処理.
	 * EIMPublicFileRendererComponentのagInit()の処理
	 * @param event イベントデータ
	 */
	objNameClick(event): void {
		event.preventDefault();
		event.stopPropagation();

		// メインの一覧のデータが文字のため
		let isDocument: boolean = this.data.isDocument;
		if (this.data.isDocument === 'true') {
			isDocument = true;
		} else if (this.data.isDocument === 'false') {
			isDocument = false;
		}
		if (isDocument) {
			if(this.serverConfigService.checkPreviewFileExt(this.data.objName)){
				this.openPreviewWindowByFileName(this.data);
			}else{
				this.fileService.downloadPrivateDocument(this.data.objId);
			}
			this.userService.sendReplyMail(this.data.objId);
		} else {
			//
			let nodeData: any = {};
			nodeData.objId = this.data.objId;
			if (this.data.isWorkflowFolder === 'true' || this.data.isWorkflowFolder === true) {
				nodeData.objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
			} else {
				nodeData.objTypeName = this.data.objTypeName;
			}

			if (this.data.hasOwnProperty('attrTreeId')) {
				nodeData.attrTreeId = this.data.attrTreeId
				nodeData.attrTreeValues = this.data.attrTreeValues
				nodeData.value = this.data.value
			}
			this.objNameClickEvent.emit(nodeData);
		}
	}
	//#endregion "EIMObjectNameRendererComponent"

	//#region "EIMObjectNameRendererComponentServiceからコピー"
	/**
	 * アイコンを取得する.
	 * @param node オブジェクト名称
	 * @param isOldRevLink リンク表示するかどうか
	 * @return アイコンクラス
	 */
	public getIcon(node, isVisibleLink = true, isOldRevLink?: boolean): string {

		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE) {
			return 'eim-doc-icon-workspace eim-doc-icon-workspace-color';
		}
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			return 'eim-icon-tag eim-icon-tag-color';
		}
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
			if (node.isWorkflowFolder === 'true' || node.isWorkflowFolder === true || node.isWFFolder === 'true' || node.isWFFolder === true) {
				return 'eim-icon-wf-folder eim-icon-wf-folder-color';
			} else {
				return 'eim-icon-folder eim-icon-folder-color';
			}
		}
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE) {
			return 'fa fa-cubes eim-icon-workspace-color';
		}
		// 以降ドキュメントアイコン
		if (isVisibleLink && (node.isDocumentLink === 'true' || node.isDocumentLink === true)) {
			// ドキュメントリンク
			if (Number(node.documentLinkUpdateTiming) === 0) {
				return 'eim-icon-link-manual';
			} else {
				return 'eim-icon-link-auto';
			}
		}
		let fileName: string = node.objName;
		let expiration = node.expiration;
		let ext: string = fileName.substring(fileName.lastIndexOf('.'));
		if (this.serverConfigService.isExcelExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-excel';
			} else {
				return 'eim-icon-excel';
			}
		}
		if (this.serverConfigService.isWordExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-word';
			} else {
				return 'eim-icon-word';
			}
		}
		if (this.serverConfigService.isPowerPointExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-powerpoint';
			} else {
				return 'eim-icon-powerpoint';
			}
		}
		if (this.serverConfigService.isPDFExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-pdf';
			} else {
				return 'eim-icon-pdf';
			}
		}
		if (this.serverConfigService.isCSVExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-csv';
			} else {
				return 'eim-icon-csv';
			}
		}
		if (this.serverConfigService.isTIFFExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-tiff';
			} else {
				return 'eim-icon-tiff';
			}
		}
		if (this.serverConfigService.isCadDxfExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-cad-dxf';
			} else {
				return 'eim-icon-cad-dxf';
			}
		}
		if (this.serverConfigService.isCadDwgExt(ext)) {
			if (isOldRevLink === true) {
				return 'eim-icon-old-cad-dwg';
			} else {
				return 'eim-icon-cad-dwg';
			}
		}
		if (isOldRevLink === true) {
			return 'eim-icon-old-file eim-icon-file-color';
		} else {
			return 'eim-icon-file eim-icon-file-color';
		}

	}
	//#endregion "EIMObjectNameRendererComponentService"

	//#region "EIMPublicFileRendererComponentからコピー"
	/**
	 * 公開アイコンを設定する.
	 * EIMPublicFileRendererComponentのagInit()の処理
	 */
	private initPublishToolTipString() {
		this.isOldRevLink = false;
		if (this.domainService.isTrue(this.data, 'isDocumentLink') && this.domainService.isTrue(this.data, 'isDspLatestLink')) {
			this.isOldRevLink = true;
			this.publishToolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02188');
		}
		if (this.domainService.isTrue(this.data, 'isOldVer')) {
			this.isOldRevLink = true;
			this.publishToolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02188');
		}

		// 事前登録された公開ファイルかどうか
		if (!this.isOldRevLink
			&& (this.data.isPdfPreRegistered === true || this.data.isPdfPreRegistered === 'true')) {
			this.publishToolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02222');
		}

		// PDF変換完了(原本更新有)かどうか判定
		if (this.data.hasOwnProperty('pdfConversionStatus')) {
			if (Number(this.data.pdfConversionStatus) === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL) {
				this.isOldRevLink = true;
				if (this.data.isPdfPreRegistered === true || this.data.isPdfPreRegistered === 'true') {
					this.publishToolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02221');
				} else {
					this.publishToolTipString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02209');
				}
			}
		}

		this.publishIcon = this.publicFileRendererComponentService.getIcon(this.data, this.isOldRevLink);
	}

	/**
	 * 設定にあわせてプレビューまたはダウンロードをする
	 * EIMPublicFileRendererComponentのonClick()の処理
	 */
	private doPreviewOrDownload() {
		if (this.serverConfigService.checkPreviewFileExt(this.data.objName)) {
			this.openPreviewWindowByPublicIcon(this.data);
		} else {
			this.fileService.downloadPublicDocument(this.data.objId);
		}
		this.userService.sendReplyMail(this.data.objId);
	}
	//#endregion "EIMPublicFileRendererComponent"

	//#region "EIMDirectEditingRendererComponentからコピー"
	disabled(obj: any): boolean {
		if (obj.hasOwnProperty('readOnly') && (obj.readOnly == 'true' || obj.readOnly == true)) {
			return true;
		}

		if (this.isLocked(obj)) {
			return true;
		}

		// 承認中チェックイン可能オプションが設定されていない場合
		if (!this.serverConfigService.enableApproverCheckinFlg) {
			// WFあり、かつ、ステータスが編集中以外の場合非活性
			if (obj.statusTypeKind && obj.statusTypeName !== '-' &&
				Number(obj.statusTypeKind) !== (EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING)) {
				return true;
			}
		}

		if (!obj.statusTypeKind && obj.statusTypeName == '-') {
			return false;
		} else if (obj.statusTypeKind && (Number(obj.statusTypeKind) != EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING &&
			Number(obj.statusTypeKind) != EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_APPROVAL_REQUEST)) {
			return true;
		}

		return false;
	}

	/**
	 * WebDAVロック状態を判定します.
	 *
	 * @param obj オブジェクト
	 * @return WebDAVロック状態
	 */
	private isLocked(obj: any): boolean {
		// 引数チェック
		if (!obj) {
			// ロック状態とみなす
			return true;
		}

		if (obj.lockDate && (obj.isWebDAVLock == 'false' || obj.isWebDAVLock == false)) {
			return true;
		}

		if ((obj.isWebDAVLock == 'true' || obj.isWebDAVLock == true) && (obj.isLockedMyself == 'false' || obj.isLockedMyself == false)) {
			return true;
		}

		return false;
	}
	

	/**
	 * 別ウィンドウでプレビューを表示します.
	 * @param data 該当行データ
	 */
	public openPreviewWindowByPublicIcon(data: any) {

		let mode = '';
		if (this.domainService.isTrue(this.data, 'isDspPdfIcon') ||  // 公開後（PDF変換あり）
			this.domainService.isTrue(this.data, 'isPdfPreRegistered') // 公開前（PDF事前変換・設定 あり）
		) {
			const url = window.location.origin + window.location.pathname + '#/documents/pdfViewer?objId=' + this.data.objId + '&mode=public';
			window.open(url, '_blank');
		} else if (this.isPublic(this.data)) {
			///公開済（PDF変換なし）or WFなし
			this.thumbnailService.checkExistsPdf(this.data.objId)
				.subscribe((result: any) => {
					if (result) {
						const url = window.location.origin + window.location.pathname + '#/documents/pdfViewer?objId=' + this.data.objId + '&mode=preview';
						window.open(url, '_blank');
					} else {
						this.fileService.downloadPublicDocument(this.data.objId);
					}
				});

		}
	}

	/**
	 * 別ウィンドウでプレビューを表示します.
	 * @param data 該当行データ
	 */
	private openPreviewWindowByFileName(data: any) {
		this.thumbnailService.checkExistsPdf(this.data.objId)
			.subscribe((result: any) => {
				if (result) {
					const url = window.location.origin + window.location.pathname + '#/documents/pdfViewer?objId=' + data.objId + '&mode=preview';
					window.open(url, '_blank');
				} else {
					this.fileService.downloadPrivateDocument(this.data.objId);
				}
			});
	}
	//#endregion "EIMDirectEditingRendererComponent"

	//#region "EIMStatusRendererComponentServiceからコピー"
	public getStatusLabel(data): string {
		let label = '';

		// 表示文言決定
		if (data.expiration === true || data.expiration === 'true') {
			label = this.translateService.instant('EIM_DOCUMENTS.LABEL_02043');
		} else if (data.lockUserName && data.lockUserName != '') {
			// 改訂中
			label = this.translateService.instant('EIM_DOCUMENTS.LABEL_02035') + '(' + data.lockUserName + ')';
		} else if (data.statusTypeName == '-') {
			let ocrString = '';
			if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESS_WAIT) {
				// OCR処理待
				ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02131');
			} else if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESSING) {
				// OCR処理中
				ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02132');
			} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_FAILURE) {
				// OCR処理失敗
				ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02133');
			} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_SUCCESS) {
				// OCR処理成功
				ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02140');
			}
			label = '-' + ocrString;
		} else {
			let ocrString = '';
			if (data.statusTypeKind !== '') {
				if (data.statusTypeKind == EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
					if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESS_WAIT) {
						// OCR処理待
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02131');
					} else if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESSING) {
						// OCR処理中
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02132');
					} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_FAILURE) {
						// OCR処理失敗
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02133');
					} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_SUCCESS) {
						// OCR処理成功
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02140');
					}
				}
			} else {
				if (data.isNoWFPublic === 'true') {
					if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESS_WAIT) {
						// OCR処理待
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02131');
					} else if (data.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESSING) {
						// OCR処理中
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02132');
					} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_FAILURE) {
						// OCR処理失敗
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02133');
					} else if (data.ocrResultStatus === EIMDocumentsConstantService.OCR_RESULT_STATUS_SUCCESS) {
						// OCR処理成功
						ocrString = this.translateService.instant('EIM_DOCUMENTS.LABEL_02140');
					}
				}
			}
			if (data.statusTypeName) {
				label = data.statusTypeName + ocrString;
			}
		}

		return label;
	}
	//#endregion "EIMStatusRendererComponentService"

	//#region "EIMDateRendererComponentServiceからコピー"
	private getDateLabel(data): string {
		let date: any;
		if (data) {
			if (String(data).length == 10) {
				if(data.match(/^\d{4}\-\d{1,2}\-\d{1,2}$/) || data.match(/^\d{1,2}\-\d{1,2}\-\d{4}$/)){
					return data;
				} 

				// 10桁の場合は13桁にする(主に文書管理の場合)
				date = data * 1000;
			} else {
				// 帳票管理の場合
				date = data;
			}
		}

		return this.dateService.getDateString(new Date(date));
	}
	//#endregion "EIMDateRendererComponentService"

	//#region "EIMDirectEditingRendererComponentからコピー"
	private editable(obj: any): boolean {
		if (obj.isDocument === 'false' || obj.isDocument === false) {
			return false;
		}
		if (!this.webDAVService.editable(obj.objName)) {
			return false;
		}
		return true;
	}
	//#endregion "EIMDirectEditingRendererComponent"
}

