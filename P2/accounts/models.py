from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class UserProfile(AbstractUser):
    phone_number = models.CharField(max_length=10)
    profile_picture = models.ImageField(upload_to='profile_pictures/')

