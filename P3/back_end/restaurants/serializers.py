from accounts.serializers import ProfileSerializer
from restaurants.models import Post, Restaurant, FoodItem, Menu, RestaurantImage, Comment
from rest_framework import serializers


class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['name', 'description', 'price']


class MenuSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    restaurant = serializers.CharField(source='restaurant.name', read_only=True)
    foods = FoodItemSerializer(many=True)

    class Meta:
        model = Menu
        fields = ['id', 'menu_name', 'restaurant', 'foods']

    def create(self, validated_data):
        foods_data = validated_data.pop('foods')
        menu = Menu.objects.create(**validated_data)
        restaurant = menu.restaurant
        for food_data in foods_data:
            FoodItem.objects.create(menu=menu, restaurant=restaurant, **food_data)
        return menu

    def update(self, instance, validated_data):
        foods_data = validated_data.pop('foods') # new information
        foods = (instance.foods).all() 
        foods = list(foods) # the old foods list
        instance.menu_name = validated_data.get('menu_name', instance.menu_name)
        
        for food_data in foods_data:
            food = foods.pop(0)
            food.name = food_data.get('name', food.name)
            food.description = food_data.get('description', food.description)
            food.price = food_data.get('price', food.price)
            food.save()
        instance.save()
        return instance


class PostSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    id = serializers.ReadOnlyField()
    num_likes = serializers.IntegerField(source='liked_by.count', read_only=True)
    userLiked = serializers.SerializerMethodField()
    owner_id = serializers.CharField(read_only=True)
    restaurant_id = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'picture', 'topic', 'description', 'created', 'owner_name', 'num_likes', 'userLiked',
                  'owner_id', 'restaurant_id']

    def get_userLiked(self, obj):
        if hasattr(self.context['request'], 'user'):
            return self.context['request'].user in obj.liked_by.all()
        return False

    def get_restaurant_id(self, obj):
        return obj.owner.restaurant.id


class ImageSerializer(serializers.ModelSerializer):
    restaurant = serializers.ReadOnlyField(source='restaurant.id')
    id = serializers.ReadOnlyField()

    class Meta:
        model = RestaurantImage
        fields = ['id', 'img', 'restaurant']


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.get_full_name')

    class Meta:
        model = Comment
        fields = ['title', 'text', 'restaurant', 'rating', 'author']


class RestaurantSerializer(serializers.ModelSerializer):
    owner_id = serializers.ReadOnlyField()
    id = serializers.ReadOnlyField()
    num_likes = serializers.IntegerField(source='liked_by.count', read_only=True)
    num_followers = serializers.IntegerField(source='followers.count', read_only=True)
    images = ImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    userLiked = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = ['id', 'owner_id', 'name', 'phone_number', 'address', 'postal_code', 'email', 'logo', 'num_likes',
                  'num_followers', 'userLiked', 'images', 'comments']

    def get_userLiked(self, obj):
        if hasattr(self.context['request'], 'user'):
            return self.context['request'].user in obj.liked_by.all()
        return False

    def create(self, validated_data):
        return super().create(validated_data | {'owner': self.context['request'].user})


