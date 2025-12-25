import { Component, effect, inject, signal } from '@angular/core';
import { DataService } from '../service/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Article } from '../model/auth.model';

@Component({
  selector: 'app-edit-article',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-article.html',
  styleUrl: './edit-article.css',
})
export class EditArticle {
dataService = inject(DataService);
route = inject(ActivatedRoute);
id = this.route.snapshot.paramMap.get('id');
fg = inject(FormBuilder);
article = toSignal<Article | undefined>(this.dataService.getArticle(Number(this.id)));
categories = signal<any[]>([]);
tags = signal<any[]>([]);
router = inject(Router);

form:FormGroup = this.fg.group({
  title: ['',Validators.required],
  content: ['',Validators.required],
  is_published: [false],
  category_id: [''],
  tag_ids: [[]],
});

constructor() {
this.dataService?.getcategories().subscribe(categories => {
    this.categories.set(categories);
  });
  this.dataService?.getTags().subscribe(tags => {
    this.tags.set(tags);
  });
  effect(() => {
    const art = this.article();
    if(art) {
      this.form.patchValue({
        title: art.title,
        content: art.content,
        is_published: art.is_published,
        category_id: art.category
      });
    }
});
}
onSubmit() {
  console.log(this.form.value);
  this.dataService.updateArticle(Number(this.id),this.form.value).subscribe({
    next: (updatedArticle) => {
      this.router.navigate(['/article', this.id]);
      console.log('Article updated successfully:', updatedArticle);
    },
    error: (error) => {
      console.error('Error updating article:', error);
    }
  });
}
}