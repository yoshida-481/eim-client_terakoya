import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PdfViewerService } from '../../services/pdf-viewer.service';

/**
 * PDF描画Viewerコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMObjectNameRendererComponent
 *
 */
@Component({
    selector: 'eim-pdf-viewer',
    template: `
		<div class="scrollable">
			<div #pdfContainer class="pdf-container"></div>
		</div>
	`,
    styles: [`
		#pdf-canvas {
			display: block;
			margin: 20px auto;
		}
		.pdf-container {
			display: flex;
			flex-direction:column;
			align-items:center;
			overflow-y:auto;
		}
		.scrollable{
			width:100%;
			height: 100%;
			overflow: auto;
			margin: 0 auto;
			border:1px solid black;
		}
	`],
    standalone: false
})
export class EIMPdfViewerComponent {
	@ViewChild('pdfContainer', {static:true}) pdfContainer: ElementRef<HTMLDivElement>;
	@Input() pdf: Blob;
	@Input() scale = 1.0;
	@Input() currentPageNo = 1;
	@Output() pageCount = new EventEmitter<number>();


	public canPrevPage:Boolean = false;
	public canNextPage:Boolean = false;

	private pdfRow : any;
	public curentPageNo : number;

	/**
	 * コンストラクタです.
	 */
	constructor( private pdfViewerService: PdfViewerService
	) {
	}

	async ngOnChanges(changes: SimpleChanges): Promise<void> {
		if(changes.pdf && changes.pdf.currentValue){
			if(changes.pdf.currentValue){
				this.pdfRow = await this.pdfViewerService.getDocumentFrom(changes.pdf.currentValue);
				this.updatePageCount(this.pdfRow.numPages);
			}
			await this.previewPDF(this.currentPageNo,this.scale);
		}
		if(changes.scale && changes.scale.currentValue){
			await this.previewPDF(this.currentPageNo, changes.scale.currentValue);
		}
		if(changes.currentPageNo && changes.currentPageNo.currentValue){
			await this.previewPDF(changes.currentPageNo.currentValue, this.scale);
		}
	}

	public async previewPDF(pageNo:number, scale: number){
		if(!this.pdfRow){
			return;
		}

		this.removeAll();
		const page = await this.pdfRow.getPage(pageNo);
		const viewport = page.getViewport({scale});

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.height = viewport.height;
		canvas.width = viewport.width;
		canvas.style.marginBottom = "10px";
		canvas.style.marginTop = "10px";

		const renderContext = {
			canvasContext: context,
			viewport: viewport
		};

		await page.render(renderContext).promise;
		this.pdfContainer.nativeElement.appendChild(canvas);
	}

	private removeAll(){
		while(this.pdfContainer.nativeElement.firstChild){
			this.pdfContainer.nativeElement.removeChild(this.pdfContainer.nativeElement.firstChild);
		}
	}

	private updatePageCount(count:number){
		this.pageCount.emit(count);
	}
}
