import { Category } from './../model/auth.model';
import { DatePipe, NgIf, SlicePipe, NgFor, NgStyle, NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../service/data.service';
import { Header } from "../header/header";
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-article',
  imports: [SlicePipe, DatePipe, NgFor, Header, RouterLink, NgIf, FormsModule, NgStyle, NgClass],
  templateUrl: './article.html',
  styleUrl: './article.css',
})
export class ArticleComponent implements OnInit {
articles = signal<any[]>([]);
categories = signal<any[]>([]);
tags = signal<any[]>([]);
dataService = inject(DataService);
authService = inject(AuthService);
router = inject(Router);
searchTerm = signal<string>('');
searchCatTag = signal<string[]>([]);
filteredArticles = computed(() => {
  const term = this.searchTerm().toLowerCase();
  const catTag = this.searchCatTag()
  console.log('Filtering articles with term:', term, 'and catTag:', catTag);
  return this.articles().filter(article =>
  {
    const matchesTerms = term? article.title.toLowerCase().includes(term):true;
    const matchesCatTag = catTag.length>0? catTag.some(cat => article.category.name.toLowerCase().includes(cat.toLowerCase())) ||
    catTag.some(cat => article.tags.some((tag: any) => tag.name.toLowerCase().includes(cat.toLowerCase()))):true;
    return matchesTerms && matchesCatTag;
  }
  );
});
ngOnInit(): void {
  this.dataService.getArticles().subscribe(articles => {
    this.articles.set(articles);
  });
  this.dataService?.getcategories().subscribe(categories => {
    this.categories.set(categories);
  });
  this.dataService.getTags().subscribe(tags => {
    this.tags.set(tags);
  });
}
deleteArticle(id: number) {
  this.dataService.deleteArticle(id).subscribe({
    next: () => {
      console.log(`Article with id ${id} deleted successfully.`);
      this.articles.set(this.articles().filter(article => article.id !== id));
    },
    error: err => {
      console.error('Error deleting article', err);
    }
  });
}
onSearch(term: string) {
  if (this.searchCatTag().includes(term)) {
    this.searchCatTag.set(this.searchCatTag().filter(t => t !== term));
  } else {
    this.searchCatTag.set([...this.searchCatTag(), term]);
}
}
}