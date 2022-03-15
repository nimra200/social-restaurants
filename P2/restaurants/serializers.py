from accounts.serializers import ProfileSerializer
from restaurants.models import Post, Restaurant, FoodItem, Menu, Comment
from rest_framework import serializers


class FoodItemSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'description', 'price']


class MenuSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    restaurant = serializers.CharField(source='restaurant.name', read_only=True)
    food = serializers.SlugRelatedField(many=True, slug_field='name', queryset=FoodItem.objects.all())

    class Meta:
        model = Menu
        fields = ['id', 'menu_name', 'restaurant', 'food']


class PostSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    id = serializers.ReadOnlyField()
    num_likes = serializers.IntegerField(source='liked_by.count', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'picture', 'topic', 'description', 'created', 'owner_name', 'num_likes']


class RestaurantSerializer(serializers.ModelSerializer):
    owner_id = serializers.ReadOnlyField()

    class Meta:
        model = Restaurant
        fields = ['owner_id', 'name', 'phone_number', 'address', 'postal_code', 'email', 'logo']

    def create(self, validated_data):
        return super().create(validated_data | {'owner': self.context['request'].user})


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ['title', 'text', 'restaurant', 'rating']
