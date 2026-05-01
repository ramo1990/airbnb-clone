from django.urls import path
from .views import ListingCreateView, ListingListView, FavoriteToggleView


urlpatterns = [
    path("listing/", ListingListView.as_view(), name="listing-list"),
    path("listing/create/", ListingCreateView.as_view(), name="listing-create"),
    path("favorites/<uuid:listing_id>/", FavoriteToggleView.as_view(), name="favorites-toggle"),
]
