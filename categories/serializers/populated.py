from .common import CategorySerializer
from contents.serializers.common import ContentSerializer

class PopulatedCategorySerializer(CategorySerializer):
    contents = ContentSerializer(many=True)
    