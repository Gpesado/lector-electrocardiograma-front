import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataResponse } from '../component/main/main.component';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  httpOptions = {
    headers: new HttpHeaders({
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  uploadImage(image: string, graduacionNegro: number, graduacionRojo: number, horizontalMovementFix: number, numberOfVias: number, dissplacementVias: number): Observable<DataResponse[][]> {
    let url = `https://electro-card-app.herokuapp.com/process`;
    //let url = `http://127.0.0.1:5000/process`;

    let objeto = {
      'blackGraduation': graduacionNegro,
      'redGraduation': graduacionRojo,
      'horizontalMovementFix': horizontalMovementFix,
      'numberOfVias': numberOfVias,
      'dissplacementVias': dissplacementVias,
      'image': image,
    }

    return this.http.post<DataResponse[][]>(url, objeto, this.httpOptions);;
  }
}
