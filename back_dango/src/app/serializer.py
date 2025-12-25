from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework.fields import ReadOnlyField
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Article, Author, Category, Tag, Comment


class AuthorSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'
        read_only_fields = ['user']
        

class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['slug']

class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        read_only_fields = ['slug']

class ArticleSerializer(ModelSerializer):
    author_name = serializers.CharField(source='author.user.username', read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True
    )
    can_delete = serializers.SerializerMethodField()

    def create(self, validated_data):
        category = validated_data.pop('category_id')
        tags = validated_data.pop('tag_ids')
        article = Article.objects.create(**validated_data, category=category)
        article.tags.set(tags)
        return article
    
    def update(self, instance, validated_data):
        category = validated_data.pop('category_id', None)
        tags = validated_data.pop('tag_ids', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if category is not None:
            instance.category = category
        if tags is not None:
            instance.tags.set(tags)

        instance.save()
        return instance

    def get_comments(self, obj):
            comments_qs = obj.comments.order_by('created_at')
            return CommentSerializer(comments_qs, many=True, context=self.context).data
    def get_can_delete(self, obj):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user') or request.user is None:
            return False

        if request.user.groups.filter(name='fuitureAdmin').exists():
            return True 
        return request.user==obj.author.user
    
    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ['author','slug']

class CommentSerializer(ModelSerializer):
    can_delete = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = '__all__'
    def get_can_delete(self, obj):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user') or request.user is None:
            return False

        if request.user.groups.filter(name='fuitureAdmin').exists():
            return True 
        return request.user==obj.article.author.user

class UserSerializer(ModelSerializer):
    permissions = serializers.SerializerMethodField()
    groupes = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'permissions', 'groupes']

    def get_permissions(self, obj):
        return list(obj.get_all_permissions())
    def get_groupes(self, obj):
        return list(obj.groups.values_list('name', flat=True))