from django.contrib import admin
from restaurants.models import Post, Restaurant, FoodItem, Menu, RestaurantImage, Comment

# Register your models here.

admin.site.register(Post)
admin.site.register(Restaurant)
admin.site.register(FoodItem)
admin.site.register(Menu)
admin.site.register(RestaurantImage)
admin.site.register(Comment)


