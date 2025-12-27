import { NgIf, NgFor, DatePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../header/header';
import { DataService } from '../service/data.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-detail',
  imports: [Header,NgIf,NgFor,DatePipe,UpperCasePipe,FormsModule,RouterLink],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css',
})
export class ArticleDetail implements OnInit {
  dataService = inject(DataService);
  article = signal<any>(null);
  route = inject(ActivatedRoute);
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.dataService.getArticle(id).subscribe(article => {
      this.article.set(article);
      console.log(this.article())
    });
  }

onSubmitComment(form: any, articleId: number): void {
  const commentData = {
    article: articleId,
    name: form.value.name,
    content: form.value.content,
    email: form.value.email
  };
  this.dataService.addComment(commentData).subscribe(() => {
    this.dataService.getArticle(articleId).subscribe(article => {
      this.article.set(article);
    });
    form.resetForm();
  });
}
}
