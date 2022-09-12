from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied

# Create your views here.
from .serializers.common import CommentSerializer
from .models import Comment
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers.populated import PopulatedCommentSerializer

class CommentListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    def get(self, _request):
        comments = Comment.objects.all()
        serialized_comments = PopulatedCommentSerializer(comments, many=True)
        return Response(serialized_comments.data)

    def post(self, request):
        comment_to_create = CommentSerializer(data = request.data)
        try:
            comment_to_create.is_valid(True)
            comment_to_create.save()
            return Response(comment_to_create.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response(e.__dict__ if e.__dict__ else str(e), status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class CommentDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_comment(self, pk):
        try:
            return Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            raise NotFound("Comment not found!")

    def delete(self, request, pk):
        comment_to_delete = self.get_comment(pk)
        print("Comment OWNER ID ->", comment_to_delete.owner )
        print("REQUEST.USER.ID ->", request.user)

        if comment_to_delete.owner != request.user:
            raise PermissionDenied("Unauthorised")
        comment_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)