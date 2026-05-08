from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from decimal import Decimal, InvalidOperation
from django.core.exceptions import ValidationError
from django.utils import timezone


from .models import Reservation
from listing.models import Listing
from .serializers import ReservationSerializer, PublicReservationSerializer

class CreateReservationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        listing_id = request.data.get("listingId")
        raw_start = request.data.get("startDate")
        raw_end = request.data.get("endDate")
        total = request.data.get("totalPrice")

        if not listing_id:
            return Response({"error": "listingId est requis"}, status=400)
        
        if not raw_start or not raw_end:
            return Response({"error": "La date de début et la date de fin sont requises"}, status=400)
        
        if not total:
            return Response({"error": "Le prix total est requis"}, status=400)
        
        try:
            listing = Listing.objects.get(id= listing_id)
        except Listing.DoesNotExist:
            return Response({"error": "Annonce introuvable"}, status=400)
        
        try:
            start = datetime.strptime(raw_start, "%Y-%m-%d").date()
            end = datetime.strptime(raw_end, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            return Response({"error": "Le format de la date est invalide"}, status=400)
        
        if start >= end:
            return Response({"error": "La date de fin doit être après la date de début"}, status=400)
        
        if start < datetime.now().date():
            return Response({"error": "La date de début ne peut pas être dans le passé"}, status=400)
        
        try:
            total_price = Decimal(str(total))
            if total_price <= 0:
                return Response({"error": "Le prix total doit être positif"}, status=400)
        except (ValueError, TypeError, InvalidOperation):
            return Response({"error": "Le prix total est invalide"}, status=400)
        

        overlapping = Reservation.objects.filter(
            listing = listing,
            start_date__lt = end,
            end_date__gt = start 
        ).exists()

        if overlapping:
            return Response({"error": "Ces dates sont déjà réservées"}, status=400)
        
        try:
            reservation = Reservation.objects.create(
                user = request.user,
                listing = listing,
                start_date = start,
                end_date = end,
                total_price = total_price
            )
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)
        
        return Response(ReservationSerializer(reservation).data, status=201)
    
class ReservationByListingView(APIView):
    def get(self, request, listing_id):
        try:
            Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response({"error": "Annonce introuvable"}, status=status.HTTP_404_NOT_FOUND)
        
        reservations = Reservation.objects.filter(listing_id = listing_id)
        serializer = PublicReservationSerializer(reservations, many=True)
        return Response(serializer.data)
    

class UserReservationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reservations = Reservation.objects.filter(user = request.user).select_related("listing")
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


class CancelReservationView(APIView):
    permission_classes = [IsAuthenticated]


    def delete(self, request, pk):
        try:
            reservation = Reservation.objects.select_related('listing').get(pk=pk)
        except Reservation.DoesNotExist:
            return Response({"error": "Réservation introuvable"}, status=status.HTTP_404_NOT_FOUND)
        
        if reservation.user != request.user and reservation.listing.owner != request.user:
            return Response({
                "error": "Vous n'êtes pas autorisé à annuler cette réservation"
            }, status=status.HTTP_403_FORBIDDEN)
        
        today = timezone.now().date()
        if reservation.start_date <= today:
            return Response({
                "error": "Impossible d'annuler une reservation qui a déjà commencé ou qui est déjà passée"
            }, status=status.HTTP_400_BAD_REQUEST)
        reservation.delete()

        return Response({"message": "Réservation annulée avec succès"}, status=status.HTTP_200_OK)
