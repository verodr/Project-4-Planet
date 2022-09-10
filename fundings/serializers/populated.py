from .common import FundingSerializer
from jwt_auth.serializers.common import UserSerializer

class PopulatedFundingSerializer(FundingSerializer):
    owner = UserSerializer()