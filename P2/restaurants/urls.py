from restaurants.views import DeleteMenuAPIView, RetrieveMenuAPIView, CreateFoodAPIView,CreateMenuAPIView, PostsAPIView, CreateRestaurant, UpdateRestaurant, ViewRestaurant, DeletePostView, CreatePostView
from django.urls import path

app_name = "restaurants"

urlpatterns = [
    path('<int:owner_id>/posts', PostsAPIView.as_view(), name='posts'),
    path('create-blog-post', CreatePostView.as_view(), name='create-post'),
    path('<int:pk>/delete-post', DeletePostView.as_view(), name="delete-post"),

    path('create/', CreateRestaurant.as_view(), name='create_restaurant'),
    path('edit/', UpdateRestaurant.as_view(), name='edit_restaurant'),
    path('view/', ViewRestaurant.as_view(), name='view_restaurant'),

    path('create-menu/', CreateMenuAPIView.as_view(), name='create_menu'),
    path('view-menu/<int:pk>', RetrieveMenuAPIView.as_view(), name='view_menu'),
    path('delete-menu/<int:pk>', DeleteMenuAPIView.as_view(), name='delete-menu'),
    path('food/', CreateFoodAPIView.as_view(), name="food")
]
