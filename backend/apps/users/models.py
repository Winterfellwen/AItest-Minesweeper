from django.db import models


class UserProfile(models.Model):
    openid = models.CharField(max_length=128, unique=True, db_index=True)
    session_key = models.CharField(max_length=255, blank=True)
    nickname = models.CharField(max_length=100, default="Anonymous")
    avatar_url = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nickname} ({self.openid})"
