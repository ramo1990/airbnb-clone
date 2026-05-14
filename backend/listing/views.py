from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from uuid import UUID
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime

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

        # Récupération des filtres
        location = request.query_params.get("locationValue")
        guest_count = request.query_params.get("guestCount")
        room_count = request.query_params.get("roomCount")
        bathroom_count = request.query_params.get("bathroomCount")
        start_date = request.query_params.get("startDate")
        end_date = request.query_params.get("endDate")

        if location:
            listings = listings.filter(country_code=location)

        if guest_count:
            try:
                guest_count = int(guest_count)
                if guest_count < 1:
                    return Response({"error": "Le nombre de voyageurs doit être au moins égale à 1"}, status=status.HTTP_400_BAD_REQUEST)
                listings = listings.filter(guest_count__gte=guest_count)
            except ValueError:
                return Response({"error": "Nombre de voyageur invalide"}, status=status.HTTP_400_BAD_REQUEST)
            
        if room_count:
            try:
                room_count = int(room_count)
                if room_count < 1:
                    return Response({"error": "Le nombre de chamlbre doit être au moins égale à 1"}, status=status.HTTP_400_BAD_REQUEST)
                listings = listings.filter(room_count__gte=room_count)
            except ValueError:
                return Response({"error": "Nombre de chambre invalide"}, status=status.HTTP_400_BAD_REQUEST)
            
        if bathroom_count:
            try:
                bathroom_count = int(bathroom_count)
                if bathroom_count < 1:
                    return Response({"error": "Le nombre de salle de bains doit être au moins égale à 1"}, status=status.HTTP_400_BAD_REQUEST)
                listings = listings.filter(bathroom_count__gte=bathroom_count)
            except ValueError:
                return Response({"error": "Nombre de salle de bains invalide"}, status=status.HTTP_400_BAD_REQUEST)

        if start_date and end_date:
            start = parse_datetime(start_date)
            end = parse_datetime(end_date)

            if not start and not end:
                return Response({"error": "Format de date invalide"}, status=status.HTTP_400_BAD_REQUEST)
            
            if start >= end:
                return Response({"error": "La date de début doit être avant la date de fin"}, status=status.HTTP_400_BAD_REQUEST)
            
            listings = listings.exclude(reservations__start_date__lt=end, reservations__end_date__gt=start)
            
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