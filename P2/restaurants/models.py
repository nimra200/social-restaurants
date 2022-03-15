from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import User 
# Create your models here.
from accounts.models import UserProfile


class Post(models.Model):
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="posts") # one-to-many relationship: a post has one author but an author has many posts
    picture = models.ImageField(upload_to='blog_pictures/', null=True, blank=True)
    topic = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    liked_by = models.ManyToManyField(UserProfile, related_name='likes', blank=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.title


class Restaurant(models.Model):
    owner = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name="restaurant")  # a user can have at most one restaurant
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=10)
    address = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=6)
    email = models.EmailField()
    logo = models.ImageField(upload_to='restaurant_pictures/')

    def __str__(self):
        return self.name


class RestaurantImage(models.Model):
    img = models.ImageField()
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='images')


class FoodItem(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    price = models.FloatField()

    def __str__(self):
        return self.name


class Menu(models.Model):
    menu_name = models.CharField(max_length=100, unique=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    food = models.ManyToManyField(FoodItem, related_name='food')

    def __str__(self):
        return self.menu_name

class Comment(models.Model):
    title = models.CharField(max_length=100, primary_key=True)
    text = models.TextField()
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="comment")
    rating = models.IntegerField(validators=[MaxValueValidator(5), MinValueValidator(1)])
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="comment")

    def __str__(self):
        return self.text

