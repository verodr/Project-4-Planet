from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

# Create your views here.
from .serializers.common import FundingSerializer
from .models import Funding


# Create your views here.
class FundingListView(APIView):

    def post(self, request):
        funding_to_create = FundingSerializer(data=request.data)
        try:
            funding_to_create.is_valid(True)
            funding_to_create.save()
            return Response(funding_to_create.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response(e.__dict__ if e.__dict__ else str(e), status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class FundingDetailView(APIView):

    def get_funding(self, pk):
        try:
            return Funding.objects.get(pk=pk)
        except Funding.DoesNotExist:
            raise NotFound("Funding not found!")

    def delete(self, _request, pk):
        funding_to_delete = self.get_funding(pk)
        funding_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)