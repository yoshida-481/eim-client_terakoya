import {Injectable} from '@angular/core'
import * as pdfjsLib from 'pdfjs-dist'
import { environment } from '../../../../environments/environment';
@Injectable({
	providedIn: 'root'
})
export class PdfViewerService {
	constructor(){
        pdfjsLib.GlobalWorkerOptions.workerSrc = environment.baseURL + 'src/assets/pdfjs/pdf.worker.js'
	}

	async getDocumentFrom(blob:Blob){
		const arrayBuffer = await blob.arrayBuffer();
		return await pdfjsLib.getDocument({data:arrayBuffer}).promise;
	}
}