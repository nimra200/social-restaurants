from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import ViewProfile, GetNotifications, GetFeed, RegisterView, EditProfileView, GetProfile

app_name = 'accounts'

urlpatterns = [
    path('profile/view/', ViewProfile.as_view(), name='view_profile'),
    path('profile/notifications/', GetNotifications.as_view(), name='notifications'),
    path('profile/my-feed/', GetFeed.as_view(), name='feed'),
    path('get-profile/<int:uid>/', GetProfile.as_view(), name="get_profile"),

    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('profile/edit/', EditProfileView.as_view(), name='edit_profile')
]
