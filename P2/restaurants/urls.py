from restaurants.views import PostsAPIView, CreatePostView
from django.urls import path

app_name = "restaurants"
urlpatterns = [
    path('<int:owner_id>/posts', PostsAPIView.as_view(), name='posts'),
    path('create-blog-post', CreatePostView.as_view(), name='create-post')
]