from django.shortcuts import render

# Create your views here.
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from accounts.models import Notification
from accounts.serializers import ProfileSerializer, NotificationSerializer
from restaurants.models import Post
from restaurants.serializers import PostSerializer


class ViewProfile(RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class GetNotifications(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    pagination_class.page_size = 5

    def get_queryset(self):
        return Notification.objects.filter(to_user_id=self.request.user.id)


class GetFeed(ListAPIView):
    """ Returns the users feed consisting of a list of posts from restaurants
    that the user follows. """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    pagination_class.page_size = 5

    def get_queryset(self):
        user = self.request.user
        acc = Post.objects.none()
        for rest in user.following.all():
            acc |= rest.owner.posts.all()
        return acc





