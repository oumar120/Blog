from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.serializers import Serializer
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response

from app.permissions import IsAuthorOrAdminOrReadOnly, isAdmin

from .models import Article
from .serializer import ArticleSerializer, AuthorSerializer, CategorySerializer, CommentSerializer, TagSerializer
from .models import Category, Tag, Author, Comment
from app.serializer import UserSerializer


# Create your views here.
class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrAdminOrReadOnly]

    def perform_create(self, Serializer):
        Serializer.save(author=self.request.user.author)
class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [isAdmin]
class TagViewSet(ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [isAdmin]

class AuthorViewSet(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [isAdmin]
    def perform_create(self, Serializer):
        Serializer.save(user=self.request.user)
class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrAdminOrReadOnly]


class UserViewSet(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # On passe explicitement le request dans le contexte du serializer
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)