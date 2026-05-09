from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from uuid import UUID
from django.shortcuts import get_object_or_404

from .serializers import CreateListingSerializer, ListingSerializer
from .models import Listing
from accounts.serializers import CurrentUserSerializer


class ListingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateListingSerializer(data = request.data, context={"request": request})
        if serializer.is_valid():
            try:
                listing = serializer.save()
                return Response(ListingSerializer(listing).data, status=status.HTTP_201_CREATED)
            except (KeyError, ValueError, TypeError) as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": "Une erreur est survenue lors de la creation de votre annonce"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ListingListView(APIView):
    permission_classes = []

    def get(self, request):
        listings = Listing.objects.all().order_by("-created_at")
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)
    

class ListingDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id)
        serializer = ListingSerializer(listing)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, listing_id):
        listings = get_object_or_404(Listing, id=listing_id)
        if listings.owner != request.user:
            return Response({
                "error": "Vous n'êtes pas autorisé à supprimer cette annonce"
            }, status=status.HTTP_403_FORBIDDEN)
        listings.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class FavoriteToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, listing_id):
        user = request.user
        listing = get_object_or_404(Listing, id=listing_id)
        user.favorites.add(listing)

        return Response(
            CurrentUserSerializer(user).data,
            status=status.HTTP_200_OK
        )
    
    def delete(self, request, listing_id):
        user = request.user
        listing = get_object_or_404(Listing, id=listing_id)
        user.favorites.remove(listing)

        return Response(
            CurrentUserSerializer(user).data,
            status=status.HTTP_200_OK
        )
    
class FavoriteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        favorites = user.favorites.all()
        serializer = ListingSerializer(favorites, many= True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserListingsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        listings = Listing.objects.filter(owner=request.user).order_by("-created_at")
        serializer = ListingSerializer(listings, many= True)
        return Response(serializer.data, status=status.HTTP_200_OK)