from .common import ContentSerializer
from comments.serializers.common import CommentSerializer
from categories.serializers.common import CategorySerializer
from fundings.serializers.common import FundingSerializer


class PopulatedContentSerializer(ContentSerializer):
    comments = CommentSerializer(many=True)
    categories = CategorySerializer(many=True)
    fundings = FundingSerializer(many=True)

class PopulatedContentWithCategoriesSerializer(ContentSerializer):
    categories = CategorySerializer(many=True)

