import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {


  constructor(private http:HttpClient) { }

  url='https://connector.lab.bravishma.com/copilot-token';


  getToken(): Observable<any> {
    return this.http.get(this.url);
  }
}
