from tracemalloc import get_object_traceback
from django.shortcuts import render
from rest_framework.generics import get_object_or_404, ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from restaurants.serializers import PostSerializer
from restaurants.models import Post
from django.contrib.auth.models import User

# Create your views here.
class PostsAPIView(ListAPIView):
    serializer_class = PostSerializer
    model = Post
    def get_queryset(self):
        owner = get_object_or_404(User, id=self.kwargs['owner_id'] )
        return Post.objects.filter(owner=self.kwargs['owner_id'])

class CreatePostView(CreateAPIView):
    serializer_class = PostSerializer
    model = Post
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)