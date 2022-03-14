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

