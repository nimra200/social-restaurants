from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import ViewProfile

app_name = 'accounts'

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('view/', ViewProfile.as_view(), name='view_profile'),
]
