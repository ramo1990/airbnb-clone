from django.urls import path
from .views import RegisterView, MeView, GoogleAuthView
from .tokens import EmailTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", EmailTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("auth/google/", GoogleAuthView.as_view(), name="auth-google"),
]
