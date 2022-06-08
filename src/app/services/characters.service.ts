import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../models/futurama.interface';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  constructor(private http: HttpClient) { }



  getAllCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>('https://api.sampleapis.com/futurama/characters');
  }

 getCharacterById(id: string): Observable<Character> {
    return this.http.get<Character>('https://api.sampleapis.com/futurama/characters/' + id );
  }





}
