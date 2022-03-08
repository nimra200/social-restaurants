from restaurants.models import Post, Restaurant
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    id = serializers.ReadOnlyField()
    class Meta:
        model = Post
        fields = ['id', 'title','picture', 'topic', 'description', 'created', 'owner_name']


class RestaurantSerializer(serializers.ModelSerializer):
    owner_id = serializers.ReadOnlyField()

    class Meta:
        model = Restaurant
        fields = ['owner_id', 'name', 'phone_number', 'address', 'postal_code', 'email', 'logo']

    def create(self, validated_data):
        return super().create(validated_data | {'owner': self.context['request'].user})


