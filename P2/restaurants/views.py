from tracemalloc import get_object_traceback

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from django.shortcuts import render
from rest_framework.generics import get_object_or_404, ListAPIView, CreateAPIView, UpdateAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from restaurants.permissions import IsOwner
from rest_framework.response import Response
from rest_framework import status


from restaurants.serializers import FoodItemSerializer, PostSerializer, RestaurantSerializer, MenuSerializer
from restaurants.models import Menu, Post, FoodItem
from accounts.models import UserProfile

# Create your views here.
class CreateFoodAPIView(CreateAPIView, ListAPIView):
    serializer_class = FoodItemSerializer
    queryset = FoodItem.objects.all() 

class DeleteMenuAPIView(DestroyAPIView):
    serializer_class = MenuSerializer 
    permission_classes = (IsAuthenticated, IsOwner,)
    queryset = Menu.objects.all()

    def get_object(self):
        obj = get_object_or_404(self.queryset, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def destroy(self, *args, **kwargs):
        
        super().destroy(*args, **kwargs)
        return Response({'message':'Menu deleted successfully'}, status=status.HTTP_200_OK)
    

class RetrieveMenuAPIView(RetrieveAPIView):
    serializer_class = MenuSerializer
    queryset = Menu.objects.all()

class CreateMenuAPIView(CreateAPIView, ListAPIView):
    serializer_class = MenuSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)
        return super().perform_create(serializer)

class PostsAPIView(ListAPIView):
    """ Return a list of all blog posts made by a restaurant owner."""
    serializer_class = PostSerializer
    model = Post
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        owner = get_object_or_404(UserProfile, id=self.kwargs['owner_id'] )
        return Post.objects.filter(owner=self.kwargs['owner_id'])

class CreatePostView(CreateAPIView):
    """Create a blog post."""
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwner,)
    
    def perform_create(self, serializer):
        self.check_object_permissions(self.request, Post)
        serializer.save(owner=self.request.user)

class DeletePostView(DestroyAPIView):
    """Delete a blog post by specifying its post ID. 
    A user can only delete their own blog post. """
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwner,)
    queryset = Post.objects.all()

    def destroy(self, *args, **kwargs):
        
        super().destroy(*args, **kwargs)
        return Response({'message':'Post deleted successfully'}, status=status.HTTP_200_OK)

class ViewRestaurant(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.restaurant

    def retrieve(self, request, *args, **kwargs):
        try:
            self.get_object()
        except ObjectDoesNotExist:
            raise Http404
        return super().retrieve(request, *args, **kwargs)


class CreateRestaurant(CreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if hasattr(request.user, 'restaurant'):
            # user can only have at most 1 restaurant; return 403
            return Response({'error': 'User already has a restaurant'}, status=403)
        return super().create(request, *args, **kwargs)


class UpdateRestaurant(RetrieveAPIView, UpdateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.restaurant

    def retrieve(self, request, *args, **kwargs):
        try:
            self.get_object()
        except ObjectDoesNotExist:
            raise Http404
        return super().retrieve(request, *args, **kwargs)


