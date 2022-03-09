from rest_framework import permissions
from restaurants.models import Restaurant

class IsOwner(permissions.BasePermission):
    message = "You are not this restaurant's owner"
    def has_permission(self, request, view):
        if request.method == 'POST':
            try:
                request.user.restaurant
            except Restaurant.DoesNotExist:
                self.message = "You do not own a restaurant"
                return False
        return True
        
    def check_object_permissions(self, request, view, obj):
        return request.user == obj.owner


    