from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from .serializers import CurrentUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        data = request.data.copy()
        if 'name' in data and "username" not in data:
            data["username"] = data["name"]

        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "utilisateur Créé avec succès"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)
    
class GoogleAuthView(APIView):
    def post(self, request):
        email = request.data.get("email")
        name = request.data.get("name")
        image = request.data.get("image")

        if not email:
            return Response({"error": "Email est requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "name": name or "",
                "image": image
            }
        )
        if not created and image:
            user.image = image
            user.save()

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response({
            "access": str(access),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "image": user.image
            }
        }, status=status.HTTP_200_OK)