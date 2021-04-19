import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { PostModel } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  isFetching=false
  errorData=null
  errorOnPosting=null
  constructor(private http: HttpClient,
    private postService:PostsService) {}

  ngOnInit() {
    this.postService.error.subscribe((error)=>{
      this.errorOnPosting=error
    })
    this.isFetching=true
    this.postService.fetchPosts().subscribe(post=>{
      this.loadedPosts=post;
      this.isFetching=false
    },
    error=>{
      this.errorData=error.message;
      console.log(error)
    })

  }
  

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postService.createPosts(postData.title,postData.content)
  }

  onFetchPosts() {
    this.isFetching=true
    this.postService.fetchPosts().subscribe(post=>{
      this.loadedPosts=post;
      this.isFetching=false
    },
    error=>{
      this.isFetching=false
      this.errorData=error.message
      console.log(error)
    })

  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(event=>{

      this.loadedPosts=[];
    }
    );
  }

  onHandlingError(){
    this.errorData=null;
    this.isFetching=false
  }

 
}
