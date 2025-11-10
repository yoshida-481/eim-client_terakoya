import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class EIMThumbnailCreatorService {
	private cache = new Map<string, string>();

	/** キャッシュから画像を取得 */
	getImage(objId: string): string | undefined {
		return this.cache.get(objId);
	}

	/** キャッシュに画像を保存 */
	setImage(objId: string, dataUrl: string): void {
		this.cache.set(objId, dataUrl);
	}

	/** キャッシュをクリア */
	clearCache(): void {
		this.cache.clear();
	}
}
