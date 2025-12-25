import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { AddArticle } from './add-article/add-article';
import { ArticleComponent } from './article/article';
import { ArticleDetail } from './article-detail/article-detail';
import { EditArticle } from './edit-article/edit-article';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'add-article',
        component: AddArticle
    },
    {
        path: 'articles',
        component: ArticleComponent
    },
    {
        path: 'article/:id',
        component: ArticleDetail
    },
    {
        path: 'article/edit/:id',
        component: EditArticle
    },
    {
        path: '',
        redirectTo: 'articles',
        pathMatch: 'full'
    }
];
