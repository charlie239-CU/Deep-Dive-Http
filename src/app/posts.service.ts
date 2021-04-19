import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { pipe, Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { PostModel } from "./post.model";

@Injectable({providedIn:'root'})
export class PostsService{
    error=new Subject<string>()
    constructor(private http:HttpClient)
    {

    }

    createPosts(title:string,content:string)
    {
        const postData:PostModel={title,content};
        this.http
        .post<{name:string}>(
        'https://ng-http-38f86-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
            observe:'body'
        }
        )
         .subscribe(responseData => {
         console.log(responseData);
         },
         error=>{
             this.error.next(error.message)
         });
    }

    fetchPosts()
    {
             let searchParams=new HttpParams();
             searchParams=searchParams.append('print','pretty')
             searchParams=searchParams.append('custom','abcd')
             
             return this.http.get<{[id:string]:PostModel}>
             ('https://ng-http-38f86-default-rtdb.firebaseio.com/posts.json',{
                 headers:new HttpHeaders({'custom-Header':'yes'}),
                 params:searchParams,
                 responseType:'json'
             }).
             pipe(tap(event=>{
                 console.log(event)
             }),
            map(responseData=>{
                const postArray=[];
                for(const key in responseData){
                if(responseData.hasOwnProperty(key))
                {
            postArray.push({...responseData[key],id:key})
                }
                }
                return postArray
            }),
            catchError(errorRes=>{
                return throwError(errorRes)
            })
            );
            
    }
    
    deletePosts(){
        return this.http.delete('https://ng-http-38f86-default-rtdb.firebaseio.com/posts.json',{
            observe:'events'
        }).
        pipe(
            tap(event=>{
                if(event.type===HttpEventType.Response)
                console.log(event)
            })
        );
        
        
    }
}