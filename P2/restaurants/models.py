from django.db import models
from django.contrib.auth.models import User 
# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post") # one-to-many relationship: a post has one author but an author has many posts
    picture = models.ImageField(upload_to='blog_pictures/', null=True, blank=True)
    topic = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created']
    
    def __str__(self):
        return self.title
