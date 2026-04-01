import datetime
import jwt
import requests
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import UserProfile
from .serializers import UserProfileSerializer


WECHAT_CODE2SESSION_URL = "https://api.weixin.qq.com/sns/jscode2session"


def encode_jwt(user_id, openid):
    payload = {
        "user_id": user_id,
        "openid": openid,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def decode_jwt(token):
    return jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])


@api_view(["POST"])
def wechat_login(request):
    code = request.data.get("code")
    if not code:
        return Response(
            {"error": "code is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    resp = requests.get(
        WECHAT_CODE2SESSION_URL,
        params={
            "appid": settings.WECHAT_APPID,
            "secret": settings.WECHAT_SECRET,
            "js_code": code,
            "grant_type": "authorization_code",
        },
    )
    data = resp.json()
    if "openid" not in data:
        return Response(
            {"error": "WeChat login failed", "detail": data},
            status=status.HTTP_400_BAD_REQUEST,
        )

    openid = data["openid"]
    session_key = data.get("session_key", "")
    user, created = UserProfile.objects.update_or_create(
        openid=openid,
        defaults={"session_key": session_key},
    )

    token = encode_jwt(user.id, user.openid)
    return Response(
        {
            "token": token,
            "user": UserProfileSerializer(user).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    return Response(UserProfileSerializer(request.user).data)
