import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EIMPdfViewerComponent } from './shared/components/renderer/pdf-viewer.component';
import { EIMDocumentFormService } from './shared/services/apis/document-form.service';
import { EIMContentsDomain } from './shared/domains/contents.domain';
import { EIMDocumentsUserService } from './shared/services/apis/documents-user.service';
import { EIMDocumentsModule } from './documents.module';
import { FormsModule } from '@angular/forms';

/**
 * ドキュメントコンポーネント
 * @example
 *
 *      <eim-documents>
 *      </eim-documents>
 */
@Component({
    selector: 'eim-documents-pdf-viewer',
    templateUrl: './documents-pdf-viewer.component.html',
    styleUrls: ['./documents-pdf-viewer.component.css'],
	imports:[EIMDocumentsModule, FormsModule],
    providers: [ToastModule, ConfirmationService],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
    standalone: true
})
export class EIMDocumentsPdfViewerComponent implements OnInit {
	@ViewChild('pdfViewer', {static:true}) pdfViewer: ElementRef<EIMPdfViewerComponent>;
	/** URLジャンプ対象オブジェクトID */
	public jumpTargetId: number;
	public mode: string;

	public zoomOutDisabled:Boolean = false;
	public zoomInDisabled:Boolean = false;
	public prevPageDisabled:Boolean = false;
	public nextPageDisabled:Boolean = false;
	public downloadDisabled:Boolean = false;

	public pdf: Blob;
	public scale: number = 1.0;
	public currentPageNo: number = 0;
	public currentPageNoString: string = "";
	public pageCount: number = 0;
	public fileName: string = "";

	private wheelSubscription: Subscription;

	/**
     * コンストラクタ.
     */
	constructor(
		protected activatedRoute: ActivatedRoute,
		protected fileService: EIMFileService,
		protected documentFormService: EIMDocumentFormService,
		protected userService: EIMDocumentsUserService,
		private router: Router,
		protected title: Title,
	) {
	}
	/**
     * 初期化.
	 */
	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe( (params: any) => {
			this.jumpTargetId = params.objId;
			this.mode = params.mode;

				// セッション確認
				this.userService.getSessionUser(true, false).subscribe( (userInfo: any) => {
					this.documentFormService.getDocumentById(this.jumpTargetId).subscribe(
						(form: EIMContentsDomain) => {
							this.fileName = form.name;
						},
						(err: any) => {
							console.log(err);
						}
					);
		
					if(this.mode === 'public'){
						this.fileService.getPublicDocument(this.jumpTargetId).subscribe(async (response: Blob) =>{
							this.pdf = response;
						});
					}else if(this.mode === 'preview'){
						this.fileService.getPreviewPdfDocument(this.jumpTargetId).subscribe(async (response: Blob) =>{
							this.pdf = response;
						});
					}
				}, () => {
					// セッション無しなら、ログインを行う
					const minerPrams = Object.assign({}, params);
					minerPrams.isPdfViewer = true;
					this.router.navigate(["/login"], {queryParams: minerPrams});
				});
		});
		
		this.title.setTitle(EIMDocumentsConstantService.WINDOW_TITLE);

		const observer = new Observable<WheelEvent>((subscriber) => {
			window.addEventListener('wheel', function(event){
				if(event.ctrlKey){
					event.preventDefault();
					subscriber.next(event);
				}
			}, {passive: false});
		});
		this.wheelSubscription = observer.pipe(
		 	debounceTime(100),
		 	switchMap(event => this.onWheelEventPromise(event))
		 ).subscribe();


		document.addEventListener('keydown', function(event){
			if(event.ctrlKey && (event.key === 'p' || event.key === 's')){
				event.preventDefault();
				console.log('ショートカット禁止');
			}
		});
		document.addEventListener('contextmenu', function(event){
				event.preventDefault();
				console.log('コンテキストメニュー禁止');
		});
	}

	/**
     * 終了処理.
     */
	ngOnDestroy(){
		if(this.wheelSubscription != null){
			this.wheelSubscription.unsubscribe();
		}
	}

	/**
     * ホイール処理.
     */
	onWheelEventPromise(event: WheelEvent): Promise<void>{
		return new Promise((resolve) =>{
			this.onWheelEvent(event);
		});
	}
	
    /**
     * マウスホイール処理による拡縮処理.
     */
	onWheelEvent(event: WheelEvent){
		if(event.ctrlKey){
			if(event.deltaY < 0){
				this.zoomIn();
			}else{
				this.zoomOut();
			}
		}
	}

    /**
     * 左矢印キーの処理.
     */
	@HostListener('document:keydown.arrowLeft', ['$event'])
    handleArrowLeft(event:KeyboardEvent){
        this.prevPage();
    }

    /**
     * 右矢印キーの処理.
     */
    @HostListener('document:keydown.arrowRight', ['$event'])
    handleArrowRight(event:KeyboardEvent){
        this.nextPage();
    }

	/**
     * 縮小処理.
     */
	public zoomOut(): void {
		this.scale -= 0.1;
		if(this.scale < 0.1 ){
			this.scale = 0.1;
		}
		this.zoomInDisabled = (2.0 <= this.scale);
		this.zoomOutDisabled = (this.scale <= 0.1 );
	}
	
	/**
     * 拡大処理.
     */
	public zoomIn(): void {
		this.scale += 0.1;

		if(2.0 < this.scale ){
			this.scale = 2.0;
		}
		this.zoomInDisabled = (2.0 <= this.scale);
		this.zoomOutDisabled = (this.scale <= 0.1 );

	}

    /**
     * 前のページ表示処理.
     */
	public prevPage(): void {
		if(1 < this.currentPageNo ){
			this.currentPageNo -= 1;
			this.currentPageNoString = this.currentPageNo.toString();
		}
		this.prevPageDisabled = (this.currentPageNo <= 1 );
		this.nextPageDisabled = (this.pageCount <= this.currentPageNo);
		
	}
	
    /**
     * 後ろのページ表示処理.
     */
	public nextPage(): void {
		if(this.currentPageNo < this.pageCount ){
			this.currentPageNo += 1;
			this.currentPageNoString = this.currentPageNo.toString();
		}
		this.prevPageDisabled = (this.currentPageNo <= 1 );
		this.nextPageDisabled = (this.pageCount <= this.currentPageNo);
	}
	
    /**
     * ダウンロード処理.
     */
	public downloadFile(): void {
		if(this.mode === 'public'){
			this.fileService.downloadPublicDocument(this.jumpTargetId);
		}else if(this.mode === 'preview'){
			this.fileService.downloadPrivateDocument(this.jumpTargetId);
		}
	}

	/**
     * 最大ページ数処理.
     */
	handlePageCount(count:number){
		this.pageCount = count;
		if(this.pageCount > 0){
			this.currentPageNo = 1;
			this.currentPageNoString = this.currentPageNo.toString();
		}
		this.prevPageDisabled = (this.currentPageNo <= 1 );
		this.nextPageDisabled = (this.pageCount <= this.currentPageNo);
	}
	
    /**
     * 表示ページの有効入力チェック処理.
     */
    validateCurrentPageNo() {
        let currentPageNo = -1;
        const integerPattern = /^\d+$/; // 整数
        let valid = integerPattern.test(this.currentPageNoString);
        if (valid) {
            currentPageNo = Number.parseInt(this.currentPageNoString);
            valid = (1 <= currentPageNo && currentPageNo <= this.pageCount);
        }

        if (valid) {
            this.currentPageNo = currentPageNo;
        } else {
            this.currentPageNoString = this.currentPageNo.toString();
        }
    }
}
