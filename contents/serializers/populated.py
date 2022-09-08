from .common import ContentSerializer
from comments.serializers.common import CommentSerializer


class PopulatedContentSerializer(ContentSerializer):
    comments = CommentSerializer(many=True)

