import { Component, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../service/data.service';
import { Category, Tag } from '../model/auth.model';
import { FormArray, FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth';

@Component({
  selector: 'app-add-article',
  imports: [ReactiveFormsModule],
  templateUrl: './add-article.html',
  styleUrl: './add-article.css',
})
export class AddArticle implements OnInit {
dataService = inject(DataService);
authService = inject(AuthService)
category= signal<Category[]>([]);
tag = signal<Tag[]>([]);
fg = inject(FormBuilder);
selectedFile: File | null = null;
ngOnInit(): void {
  this.dataService.getcategories().subscribe(categories => {
    this.category.set(categories);
  });

  this.dataService.getTags().subscribe(tags => {
    this.tag.set(tags);
  });
}
form:FormGroup = this.fg.group({
  title:['',Validators.required],
  content:['',Validators.required],
  isPublished:[false],
  category:['',Validators.required],
  tags: [[], Validators.required]
})
get tagsArray(){
  return this.form.get('tags') as FormArray;
}
onFileSelected(event:any){
  this.selectedFile = event.target.files[0];
}
onSubmit(){
  const formData = new FormData();
  formData.append('title', this.form.get('title')?.value);
  formData.append('content', this.form.get('content')?.value);
  formData.append('isPublished', this.form.get('isPublished')?.value);
  formData.append('category_id', this.form.get('category')?.value);
  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  };
  this.form.get('tags')?.value.forEach((tagId:string) => {
    formData.append('tag_ids', tagId);
  });
  this.dataService.addArticle(formData).subscribe({
    next: article => {
      console.log('Article added successfully', article);
      this.form.reset();
    },
    error: err => {
      console.error('Error adding article', err);
    }
  });
}
}