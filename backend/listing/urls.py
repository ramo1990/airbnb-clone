from django.urls import path
from .views import ListingCreateView, ListingListView, FavoriteToggleView, ListingDetailView, FavoriteListView


urlpatterns = [
    path("listing/", ListingListView.as_view(), name="listing-list"),
    path("listing/create/", ListingCreateView.as_view(), name="listing-create"),
    path("favorites/<uuid:listing_id>/", FavoriteToggleView.as_view(), name="favorites-toggle"),
    path("listing/<uuid:listing_id>/", ListingDetailView.as_view(), name="listing-detail"),
    path("favorites/", FavoriteListView.as_view(), name="favorite-list"),
]
