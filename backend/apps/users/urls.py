from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.wechat_login, name="wechat-login"),
    path("me/", views.get_profile, name="profile"),
]
