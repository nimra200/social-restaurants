from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class UserProfile(AbstractUser):
    phone_number = models.CharField(max_length=10)
    profile_picture = models.ImageField(upload_to='profile_pictures/')
    following = models.ManyToManyField('restaurants.Restaurant', related_name='followers')   # many users follow many restaurants


class Notification(models.Model):
    TYPE = (
        ('Like', 'Like'),
        ('Comment', 'Comment'),
        ('Follow', 'Follow'),
        ('Post', 'Post')
    )
    type = models.CharField(max_length=200, choices=TYPE)
    date = models.DateTimeField(auto_now_add=True)
    to_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='notifications')  # many-to-one
    from_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    post = models.ForeignKey('restaurants.Post', on_delete=models.CASCADE, null=True, blank=True)
    restaurant = models.ForeignKey('restaurants.Restaurant', on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ['-date']    # newest notifications first


