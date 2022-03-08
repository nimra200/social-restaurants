from restaurants.models import Post
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    id = serializers.ReadOnlyField()
    class Meta:
        model = Post
        fields = ['id', 'title','picture', 'topic', 'description', 'created', 'owner_name']
