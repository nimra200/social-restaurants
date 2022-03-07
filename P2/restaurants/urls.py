from restaurants.views import PostsAPIView, CreateRestaurant, UpdateRestaurant, ViewRestaurant
from django.urls import path

app_name = "restaurants"

urlpatterns = [
    path('<int:owner_id>/posts', PostsAPIView.as_view(), name='posts'),
    path('create/', CreateRestaurant.as_view(), name='create_restaurant'),
    path('edit/', UpdateRestaurant.as_view(), name='edit_restaurant'),
    path('view/', ViewRestaurant.as_view(), name='view_restaurant'),
]
