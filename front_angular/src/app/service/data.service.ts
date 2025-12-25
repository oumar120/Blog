import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Article } from "../model/auth.model";
import { Category, Tag } from "../model/auth.model";


@Injectable({
  providedIn: 'root',
})

export class DataService {
    constructor(private httpClient:HttpClient){}
getArticles():Observable<Article[]>{
    return this.httpClient.get<Article[]>(`${environment.apiUrl}/articles/`);
}
getArticle(id:number):Observable<Article>{
    return this.httpClient.get<Article>(`${environment.apiUrl}/articles/${id}`);
}
addArticle(article:any):Observable<Article>{
    return this.httpClient.post<Article>(`${environment.apiUrl}/articles/`, article);
}
updateArticle(id:number, article:any):Observable<Article>{
    return this.httpClient.put<Article>(`${environment.apiUrl}/articles/${id}/`, article);
}
deleteArticle(id:number):Observable<Article>{
    return this.httpClient.delete<Article>(`${environment.apiUrl}/articles/${id}`);
}
getcategories():Observable<Category[]>{
    return this.httpClient.get<Category[]>(`${environment.apiUrl}/categories/`);
}
getTags():Observable<Tag[]>{
    return this.httpClient.get<Tag[]>(`${environment.apiUrl}/tags/`);
}
addComment(comment:any):Observable<any>{
    return this.httpClient.post<any>(`${environment.apiUrl}/comments/`, comment);
}

}