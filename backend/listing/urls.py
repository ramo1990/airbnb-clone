from django.urls import path
from .views import ListingCreateView, ListingListView


urlpatterns = [
    path("listing/", ListingListView.as_view(), name="listing-list"),
    path("listing/create/", ListingCreateView.as_view(), name="listing-create"),
]
