"""p2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
<<<<<<< HEAD
    path('restaurants/', include('restaurants.urls', namespace='restaurants') ),
    path('accounts/', include('accounts.urls', namespace='accounts'))
=======
    path('restaurants/', include('restaurants.urls', namespace='restaurants')),
    path('accounts/', include('accounts.urls', namespace='accounts')),

>>>>>>> bd001e6d5f5773f4e325b6579f2fe64cc9c246fa
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
