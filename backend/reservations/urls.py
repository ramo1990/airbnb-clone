from django.urls import path
from .views import CreateReservationView, ReservationByListingView, UserReservationsView, CancelReservationView, HostReservationsView


urlpatterns = [
    path("reservations/", CreateReservationView.as_view(), name="reservation-create"),
    path("reservations/listing/<uuid:listing_id>/", ReservationByListingView.as_view(), name="listing-reservations"),
    path("reservations/me/", UserReservationsView.as_view(), name="user-reservations"),
    path("reservations/<uuid:pk>/", CancelReservationView.as_view(), name="cancel-reservations"),
    path("reservations/host/", HostReservationsView.as_view(), name="host-reservations"),
]
