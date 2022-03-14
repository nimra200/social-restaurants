from django.contrib import admin

# Register your models here.
from accounts.models import UserProfile, Notification

admin.site.register(UserProfile)
admin.site.register(Notification)
