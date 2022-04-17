from tracemalloc import get_object_traceback

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count
from django.http import HttpResponse, Http404
from django.shortcuts import render
from rest_framework import status, permissions, filters
from rest_framework.generics import get_object_or_404, ListAPIView, CreateAPIView, UpdateAPIView, RetrieveAPIView, \
    DestroyAPIView, ListCreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import Notification, UserProfile
from accounts.serializers import ProfileSerializer
from restaurants.permissions import IsOwner, IsAuthor
from restaurants.serializers import PostSerializer, RestaurantSerializer, FoodItemSerializer, MenuSerializer, \
    ImageSerializer, CommentSerializer
from restaurants.models import Post, Restaurant, FoodItem, Menu, Comment


# Create your views here.

class DeleteMenuAPIView(DestroyAPIView):
    serializer_class = MenuSerializer
    permission_classes = (IsAuthenticated, IsOwner,)
    queryset = Menu.objects.all()

    def get_object(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs["pk"])
        obj = get_object_or_404(self.queryset, restaurant=restaurant)
        self.check_object_permissions(self.request, obj)
        return obj

    def destroy(self, *args, **kwargs):
        super().destroy(*args, **kwargs)
        return Response({'message': 'Menu deleted successfully'}, status=status.HTTP_200_OK)


class RetrieveMenuAPIView(RetrieveAPIView):
    serializer_class = MenuSerializer
    
    def get_object(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['pk'])
        return get_object_or_404(Menu, restaurant=restaurant)


class CreateMenuAPIView(CreateAPIView):
    serializer_class = MenuSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)
        for user in self.request.user.restaurant.followers.all():
            # alert following users that menu has changed
            new_notification = Notification()
            new_notification.type = 'Update'
            new_notification.restaurant = self.request.user.restaurant
            new_notification.to_user = user
            new_notification.from_user = self.request.user
            new_notification.save()

        return super().perform_create(serializer)


class ViewPost(RetrieveAPIView):
    """ Returns a specific post given the post id """
    serializer_class = PostSerializer

    def get_object(self):
        return get_object_or_404(Post, id=self.kwargs['pid'])


class PostsAPIView(ListAPIView):
    """ Return a list of all blog posts made by a restaurant owner."""
    serializer_class = PostSerializer
    model = Post
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        owner = get_object_or_404(UserProfile, id=self.kwargs['owner_id'])
        return Post.objects.filter(owner=self.kwargs['owner_id'])


class CreatePostView(CreateAPIView):
    """Create a blog post."""
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def perform_create(self, serializer):
        self.check_object_permissions(self.request, Post)
        new_post = serializer.save(owner=self.request.user)

        for user in self.request.user.restaurant.followers.all():
            # send notification to user
            new_notification = Notification()
            new_notification.type = 'Post'
            new_notification.from_user = self.request.user
            new_notification.restaurant = self.request.user.restaurant
            new_notification.to_user = user
            new_notification.post = new_post
            new_notification.save()


class DeletePostView(DestroyAPIView):
    """Delete a blog post by specifying its post ID.
    A user can only delete their own blog post. """
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwner,)
    queryset = Post.objects.all()

    def destroy(self, *args, **kwargs):
        super().destroy(*args, **kwargs)
        return Response({'message': 'Post deleted successfully'}, status=status.HTTP_200_OK)


class ViewRestaurant(RetrieveAPIView):
    serializer_class = RestaurantSerializer

    def get_object(self):
        return get_object_or_404(Restaurant, id=self.kwargs['rid'])


class ViewMyRestaurant(RetrieveAPIView):
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


class FollowRestaurant(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Restaurant, id=self.kwargs['rid'])

    def retrieve(self, request, *args, **kwargs):
        restaurant = get_object_or_404(Restaurant, id=kwargs['rid'])
        if restaurant in request.user.following.all():
            return super().retrieve(request, *args, **kwargs)

        request.user.following.add(restaurant)  # add restaurant to following list

        # Send notification to owner
        new_notification = Notification()
        new_notification.type = 'Follow'
        new_notification.to_user = restaurant.owner
        new_notification.from_user = request.user
        new_notification.restaurant = restaurant
        new_notification.save()

        return super().retrieve(request, *args, **kwargs)


class UnfollowRestaurant(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Restaurant, id=self.kwargs['rid'])

    def retrieve(self, request, *args, **kwargs):
        restaurant = get_object_or_404(Restaurant, id=kwargs['rid'])
        request.user.following.remove(restaurant)   # remove restaurant from following list

        return super().retrieve(request, *args, **kwargs)


class LikePost(RetrieveAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Post, id=self.kwargs['pid'])

    def retrieve(self, request, *args, **kwargs):
        post = get_object_or_404(Post, id=kwargs['pid'])
        if request.user in post.liked_by.all():
            # already liked
            return super().retrieve(request, *args, **kwargs)

        post.liked_by.add(request.user)

        # Send notification to owner
        new_notification = Notification()
        new_notification.type = "Like"
        new_notification.to_user = post.owner
        new_notification.from_user = request.user
        new_notification.post = post
        new_notification.save()

        return super().retrieve(request, *args, **kwargs)


class UnlikePost(RetrieveAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Post, id=self.kwargs['pid'])

    def retrieve(self, request, *args, **kwargs):
        post = get_object_or_404(Post, id=kwargs['pid'])
        post.liked_by.remove(request.user)
        return super().retrieve(request, *args, **kwargs)


class AddImage(CreateAPIView):
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)
        return super().perform_create(serializer)


class LikeRestaurant(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Restaurant, id=self.kwargs['rid'])

    def retrieve(self, request, *args, **kwargs):
        restaurant = get_object_or_404(Restaurant, id=kwargs['rid'])
        if request.user in restaurant.liked_by.all():
            # already liked
            return super().retrieve(request, *args, **kwargs)

        restaurant.liked_by.add(request.user)

        # Send notification to owner
        new_notification = Notification()
        new_notification.from_user = request.user
        new_notification.to_user = restaurant.owner
        new_notification.type = 'Like'
        new_notification.restaurant = restaurant
        new_notification.save()

        return super().retrieve(request, *args, **kwargs)


class UnlikeRestaurant(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Restaurant, id=self.kwargs['rid'])

    def retrieve(self, request, *args, **kwargs):
        restaurant = get_object_or_404(Restaurant, id=kwargs['rid'])
        restaurant.liked_by.remove(request.user)
        return super().retrieve(request, *args, **kwargs)


class SearchView(ListCreateAPIView):
    """Retrieves search results data based on the input entered into
    search bar, searches mainly look for a restaurant in the website"""
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = PageNumberPagination
    pagination_class.page_size = 5
    model = Restaurant
    search_fields = ['name', 'address', 'restaurant_food__name']
    filter_backends = (filters.SearchFilter,)
    queryset = Restaurant.objects.all().annotate(num_followers=Count('followers')).order_by('-num_followers')


class AddCommentView(CreateAPIView):
    """"Add a comment to a restaurant, author refers to the user profile
    that adds the comment."""
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        comment = serializer.save(author=self.request.user)

        # send notification to owner
        new_notification = Notification()
        new_notification.type = 'Comment'
        new_notification.from_user = self.request.user
        new_notification.to_user = comment.restaurant.owner
        new_notification.restaurant = comment.restaurant
        new_notification.save()


class DeleteCommentView(DestroyAPIView):
    """Delete a comment made on a restaurant.
    User needs to be authenticated in to delete their comment. """
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated, IsAuthor,)
    queryset = Comment.objects.all()

    def get_object(self):
        obj = get_object_or_404(self.queryset, title=self.kwargs['title'])
        self.check_object_permissions(self.request, obj)
        return obj

    def delete(self, request, *args, **kwargs):
        super().delete(request, *args, **kwargs)
        return Response({'message': 'Comment deleted'}, status=200)


class EditCommentView(RetrieveAPIView, UpdateAPIView):
    """Edits/updates a comment made on a restaurant by user who must be the
    author"""
    model = Comment
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated, IsAuthor,)

    def get_object(self):
        obj = get_object_or_404(Comment, title=self.kwargs['title'])
        self.check_object_permissions(self.request, obj)
        return obj

    def retrieve(self, request, *args, **kwargs):
        try:
            self.get_object()
        except ObjectDoesNotExist:
            raise Http404
        return super().retrieve(request, *args, **kwargs)

