from django.shortcuts import render

# Create your views here.
from rest_framework import permissions
from rest_framework.generics import RetrieveAPIView, ListAPIView, UpdateAPIView, CreateAPIView, get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import Notification, UserProfile
from accounts.serializers import ProfileSerializer, NotificationSerializer, EditProfileSerializer, RegisterSerializer
from restaurants.models import Post
from restaurants.serializers import PostSerializer


class ViewProfile(RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class GetProfile(RetrieveAPIView):
    """Get profile by id"""
    serializer_class = ProfileSerializer

    def get_object(self):
        return get_object_or_404(UserProfile, id=self.kwargs['uid'])


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


class RegisterView(CreateAPIView):
    """Registers and creates user to the website database after sign up is completed,
    validation of registration data is done in the serializer"""
    serializer_class = RegisterSerializer
    queryset = UserProfile.objects.all()
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        if (self.request.POST['email'] and UserProfile.objects.filter(email=self.request.POST['email']).exists()) or \
                UserProfile.objects.filter(username=self.request.POST['username']).exists():
            return Response({'error': 'User with email or username already exists'}, status=403)
        return super().create(request, *args, **kwargs)


class EditProfileView(RetrieveAPIView, UpdateAPIView):
    serializer_class = EditProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        phone_number = request.data['phone_number']
        if len(phone_number) != 10:
            return Response({'error': 'Invalid phone number'}, status=400)

        return super().put(request, *args, **kwargs)

