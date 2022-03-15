from rest_framework import serializers

from accounts.models import UserProfile, Notification


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'username', 'email', 'phone_number', 'profile_picture', 'following']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['type', 'from_user', 'post', 'date']

class EditProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
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
        return attrs

    def create(self, validated_data):
        user = UserProfile.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
