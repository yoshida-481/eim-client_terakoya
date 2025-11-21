import {Injectable} from '@angular/core'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

@Injectable({
	providedIn: 'root'
})
export class PdfViewerService {
	constructor(){
		GlobalWorkerOptions.workerSrc = new URL('src/assets/pdfjs/pdf.worker.min.mjs', import.meta.url).toString();
	}

	async getDocumentFrom(blob:Blob){
		const arrayBuffer = await blob.arrayBuffer();
		return await getDocument({data:arrayBuffer}).promise;
	}
}