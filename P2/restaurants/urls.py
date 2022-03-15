from restaurants.views import PostsAPIView, CreateRestaurant, UpdateRestaurant, ViewMyRestaurant, FollowRestaurant, \
    CreatePostView, DeletePostView, UnfollowRestaurant, ViewRestaurant, LikePost, UnlikePost, CreateMenuAPIView, \
    RetrieveMenuAPIView, DeleteMenuAPIView, CreateFoodAPIView, AddImage, LikeRestaurant, UnlikeRestaurant
from django.urls import path

app_name = "restaurants"

urlpatterns = [
    path('<int:owner_id>/posts/', PostsAPIView.as_view(), name='posts'),
    path('create-blog-post/', CreatePostView.as_view(), name='create-post'),
    path('<int:pk>/delete-post/', DeletePostView.as_view(), name="delete-post"),

    path('create/', CreateRestaurant.as_view(), name='create_restaurant'),
    path('my-restaurant/edit/', UpdateRestaurant.as_view(), name='edit_restaurant'),
    path('my-restaurant/', ViewMyRestaurant.as_view(), name='my_restaurant'),
    path('<int:rid>/view/', ViewRestaurant.as_view(), name='view_restaurant'),
    path('my-restaurant/add-image/', AddImage.as_view(), name='add_image'),

    path('<int:rid>/follow/', FollowRestaurant.as_view(), name='follow_restaurant'),
    path('<int:rid>/unfollow/', UnfollowRestaurant.as_view(), name='unfollow_restaurant'),
    path('post/<int:pid>/like/', LikePost.as_view(), name='like_post'),
    path('post/<int:pid>/unlike/', UnlikePost.as_view(), name='unlike_post'),
    path('<int:rid>/like/', LikeRestaurant.as_view(), name='like_restaurant'),
    path('<int:rid>/unlike/', UnlikeRestaurant.as_view(), name='unlike_restaurant'),

    path('create-menu/', CreateMenuAPIView.as_view(), name='create_menu'),
    path('view-menu/<int:pk>', RetrieveMenuAPIView.as_view(), name='view_menu'),
    path('delete-menu/<int:pk>', DeleteMenuAPIView.as_view(), name='delete-menu'),
    path('food/', CreateFoodAPIView.as_view(), name="food"),

]
