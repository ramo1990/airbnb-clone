from rest_framework import serializers
from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ("id", "name", "email", "password")
        extra_kwargs = {
            "email": {"required": True}
        }

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email déjà utilisé")
        return value
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data.get("name", "")
        )
        return user
    
class CurrentUserSerializer(serializers.ModelSerializer):
    favoriteIds = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ("id", "email", "name", "image", "favoriteIds")

    def get_favoriteIds(self, obj):
        return [str(listing.id) for listing in obj.favorites.all()]

