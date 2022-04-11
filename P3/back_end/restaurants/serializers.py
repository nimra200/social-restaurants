from accounts.serializers import ProfileSerializer
from restaurants.models import Post, Restaurant, FoodItem, Menu, RestaurantImage, Comment
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


class ImageSerializer(serializers.ModelSerializer):
    restaurant = serializers.ReadOnlyField(source='restaurant.id')
    id = serializers.ReadOnlyField()

    class Meta:
        model = RestaurantImage
        fields = ['id', 'img', 'restaurant']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['title', 'text', 'restaurant', 'rating']


class RestaurantSerializer(serializers.ModelSerializer):
    owner_id = serializers.ReadOnlyField()
    id = serializers.ReadOnlyField()
    num_likes = serializers.IntegerField(source='liked_by.count', read_only=True)
    num_followers = serializers.IntegerField(source='followers.count', read_only=True)
    images = ImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'owner_id', 'name', 'phone_number', 'address', 'postal_code', 'email', 'logo', 'num_likes',
                  'num_followers', 'images', 'comments']

    def create(self, validated_data):
        return super().create(validated_data | {'owner': self.context['request'].user})



