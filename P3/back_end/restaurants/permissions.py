from rest_framework import permissions
from restaurants.models import Restaurant, Post, Menu, Comment


class IsOwner(permissions.BasePermission):
    message = "You are not this restaurant's owner"

    def has_permission(self, request, view):
        # a generic permission to check if user is a restaurant owner  

        if request.method == 'POST' or request.method == 'DELETE':
            if not hasattr(request.user, 'restaurant'):
                self.message = "You do not own a restaurant"
                return False
        return True

    def has_object_permission(self, request, view, obj):
        # a more specific permission to check if user is the owner of an object  

        if isinstance(obj, Post):
            return request.user == obj.owner
        if isinstance(obj, Menu):
            return request.user.restaurant == obj.restaurant
        if isinstance(obj, Comment):
            return request.user == obj.author
        return True


class IsAuthor(permissions.BasePermission):
    message = "You did not write this comment"

    def has_permission(self, request, view):
        if request.method == 'POST' or request.method == 'DELETE':
            if not Comment.objects.filter(author=request.user).exists:
                self.message = "You have not written any comments"
                return False
        return True

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Comment):
            return request.user == obj.author
