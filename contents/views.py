from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

from .models import Content
from .serializers.common import ContentSerializer
from .serializers.populated import PopulatedContentSerializer, PopulatedContentWithCategoriesSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
# Create your views here.
class ContentListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, ) 

    def get(self, _request):
        contents = Content.objects.all()
        # print("contents__>", contents)
        serialized_contents = PopulatedContentWithCategoriesSerializer(contents, many=True)
        # print("serialize__>", serialized_contents.data)
        return Response(serialized_contents.data)

    def post(self, request):
        content_to_add = ContentSerializer(data=request.data)
        try:
            content_to_add.is_valid(True)
            print(content_to_add.validated_data)
            content_to_add.save()
            return Response(content_to_add.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print('ERROR')
            return Response(e.__dict__ if e.__dict__ else str(e), status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class ContentDetailView(APIView):

    def get_content(self, pk):
        try:
            return Content.objects.get(pk=pk)
        except Content.DoesNotExist:
            raise NotFound(detail="Content not found!")

    def get(self, _request, pk):
        content = self.get_content(pk=pk)
        serialized_content = PopulatedContentSerializer(content)
        return Response(serialized_content.data)

    def delete(self, _request, pk):
        content_to_delete = self.get_content(pk=pk)
        content_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        content_to_update = self.get_content(pk=pk)
        updated_content = ContentSerializer(content_to_update, data=request.data)
        try:
            updated_content.is_valid(True)
            updated_content.save()
            return Response(updated_content.data,status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class ContentLatestView(APIView):

    def get_content(self):
        try:
            return Content.objects.all().order_by('-created_at')
        except Content.DoesNotExist:
            raise NotFound(detail="Content not found!")

    def get(self, _request):
        contents = self.get_content()
        latest_content = contents[0]
        serialized_contents = PopulatedContentSerializer(latest_content)
        return Response(serialized_contents.data)
        