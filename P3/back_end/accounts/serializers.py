from rest_framework import serializers

from accounts.models import UserProfile, Notification


class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'phone_number', 'profile_picture', 'following']


class NotificationSerializer(serializers.ModelSerializer):
    from_user = serializers.CharField(source='from_user.username', read_only=True)
    post = serializers.CharField(source='post.title', read_only=True)
    restaurant = serializers.CharField(source='restaurant.name', read_only=True)

    class Meta:
        model = Notification
        fields = ['type', 'from_user', 'post', 'restaurant', 'date']


class EditProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    profile_picture = serializers.ImageField(required=False)
    phone_number = serializers.CharField(required=False)

    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'email', 'profile_picture', 'phone_number']

    def validate_email(self, value):
        if value and '@' not in value:
            raise serializers.ValidationError({"email": "Invalid Email ID"})
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user

        if user.pk != instance.pk:
            raise serializers.ValidationError({"authorize": "Unauthorized user"})

        instance.first_name = self.validated_data.get('first_name', '')
        instance.last_name = self.validated_data.get('last_name', '')
        instance.email = self.validated_data.get('email', '')
        instance.profile_picture = self.validated_data.get('profile_picture', '')
        instance.phone_number = self.validated_data.get('phone_number', '')

        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        if '@' not in attrs['email']:
            raise serializers.ValidationError({"email": "Invalid Email ID"})
        if len(attrs['password']) < 8:
            raise serializers.ValidationError({"password": "Password is too short"})
        if UserProfile.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "account with this username already exists"})
        if UserProfile.objects.filter(username=attrs['email']).exists():
            raise serializers.ValidationError({"email": "account with this email already exists"})
        return attrs

    def create(self, validated_data):
        user = UserProfile.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

