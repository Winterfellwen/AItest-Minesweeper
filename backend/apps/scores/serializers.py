from rest_framework import serializers
from .models import ScoreEntry


class ScoreSubmitSerializer(serializers.Serializer):
    difficulty = serializers.ChoiceField(choices=["easy", "medium", "hard"])
    time_seconds = serializers.FloatField(min_value=0)


class ScoreEntrySerializer(serializers.ModelSerializer):
    rank = serializers.SerializerMethodField()
    user_nickname = serializers.CharField(source="user.nickname")
    user_avatar = serializers.CharField(source="user.avatar_url")

    class Meta:
        model = ScoreEntry
        fields = ["rank", "user_nickname", "user_avatar", "score", "time_seconds", "created_at"]

    def get_rank(self, obj):
        return self.context.get("rank")
