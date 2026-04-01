import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from apps.users.models import UserProfile


class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != "Bearer":
            raise AuthenticationFailed("Invalid auth header")

        try:
            payload = jwt.decode(parts[1], settings.JWT_SECRET, algorithms=["HS256"])
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        try:
            user = UserProfile.objects.get(id=payload["user_id"])
        except UserProfile.DoesNotExist:
            raise AuthenticationFailed("User not found")

        return (user, None)
