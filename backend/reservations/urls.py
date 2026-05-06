from django.urls import path
from .views import CreateReservationView, ReservationByListingView, UserReservationsView


urlpatterns = [
    path("reservations/", CreateReservationView.as_view(), name="reservation-create"),
    path("reservations/listing/<uuid:listing_id>/", ReservationByListingView.as_view(), name="listing-reservations"),
    path("reservations/me/", UserReservationsView.as_view(), name="user-reservations"),
]
