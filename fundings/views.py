from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied

# Create your views here.
from .serializers.common import FundingSerializer
from .models import Funding
from rest_framework.permissions import IsAuthenticatedOrReadOnly

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
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_funding(self, pk):
        try:
            return Funding.objects.get(pk=pk)
        except Funding.DoesNotExist:
            raise NotFound("Funding not found!")

    def updateAmount(self, current, amount):
        return current + amount

    def put(self, request, pk):
        funding_to_update = self.get_funding(pk=pk)
        print('first from FUNDING -> ', request.data)
        print('second from FUNDING -> ', funding_to_update.current_amount)
        request.data['current_amount'] = self.updateAmount(funding_to_update.current_amount, request.data['current_amount'])
        updated_funding = FundingSerializer(funding_to_update, data=request.data)
        try:
            updated_funding.is_valid(True)
            updated_funding.save()
            return Response(updated_funding.data,status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    def delete(self, request, pk):
        funding_to_delete = self.get_funding(pk)
        if funding_to_delete.owner != request.user:
            raise PermissionDenied("Unauthorised")
        funding_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)