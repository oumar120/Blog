from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAuthorOrAdminOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.groups.filter(name='fuitureAdmin').exists():
            return True
        return obj.author.user == request.user
    
class isAdmin(BasePermission):

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.groups.filter(name='fuitureAdmin').exists()