from restaurants.views import PostsAPIView
from django.urls import path

app_name = "restaurants"
urlpatterns = [
    path('<int:owner_id>/posts', PostsAPIView.as_view(), name='posts')
]