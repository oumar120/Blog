from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ArticleViewSet,
    CategoryViewSet,
    CommentViewSet,
    TagViewSet,
    AuthorViewSet,
    UserViewSet,
)

router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'author', AuthorViewSet, basename='author')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
	path('user/', UserViewSet.as_view(), name='user'),
]

urlpatterns += router.urls