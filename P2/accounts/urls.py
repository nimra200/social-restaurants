from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import ViewProfile, GetNotifications, GetFeed

app_name = 'accounts'

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/view/', ViewProfile.as_view(), name='view_profile'),
    path('profile/notifications/', GetNotifications.as_view(), name='notifications'),
    path('profile/my-feed/', GetFeed.as_view(), name='feed'),
]
