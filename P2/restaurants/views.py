from tracemalloc import get_object_traceback

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from django.shortcuts import render
from rest_framework.generics import get_object_or_404, ListAPIView, CreateAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from restaurants.serializers import PostSerializer, RestaurantSerializer
from restaurants.models import Post
from django.contrib.auth.models import User

# Create your views here.


class PostsAPIView(ListAPIView):
    serializer_class = PostSerializer
    model = Post

    def get_queryset(self):
        owner = get_object_or_404(User, id=self.kwargs['owner_id'] )
        return Post.objects.filter(owner=self.kwargs['owner_id'])


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


