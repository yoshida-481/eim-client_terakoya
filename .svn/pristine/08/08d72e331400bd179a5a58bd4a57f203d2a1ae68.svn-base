import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { map } from "rxjs/operators";

@Injectable()
export class EIMConfigService {
    config: any;
    constructor(private http: HttpClient) { }

    public get(key: any) {
        if (!Array.isArray(key)) {
            return this.config[key];
        }
        let res: any = this.config;
        key.forEach(k => res = res[k]);
        return res;
    }

    load() {
			return new Promise<void>((resolve) => {
				const now = new Date();
				this.http.get(environment.baseURL + 'src/assets/config.json?time=' + now.getTime())
					.pipe(map((res: any) => {
						return res;
					}))
				.subscribe(json => {
          this.config = json;
          resolve();
        });
			})
		}
}