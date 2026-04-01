from django.urls import path
from . import views

urlpatterns = [
    path("submit/", views.submit_score, name="submit-score"),
    path("leaderboard/", views.leaderboard, name="leaderboard"),
]
