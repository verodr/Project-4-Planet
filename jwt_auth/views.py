from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from django.contrib.auth import get_user_model
User = get_user_model()
import jwt
from datetime import datetime, timedelta 
from django.conf import settings 
from .serializers.common import UserSerializer

# Create your views here.
class RegisterView(APIView):
    
    def post(self, request):
        user_to_create = UserSerializer(data=request.data)
        try:
            user_to_create.is_valid(True) 
            user_to_create.save() 
            return Response(user_to_create.data, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            print(e)
            return Response(e.__dict__ if e.__dict__ else str(e), status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class LoginView(APIView):

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Look for user with email provided
        try:
            user_to_login = User.objects.get(email=email)
        except User.DoesNotExist:
            print("FAILED AT EMAIL STAGE")
            raise PermissionDenied("Invalid credentials")

        # check passwords match
        if not user_to_login.check_password(password):
            print("FAILED AT PASSWORD STAGE")
            raise PermissionDenied("Invalid credentials")

        # If the request reaches this point, the user is validated, and we need to send a token
        dt = datetime.now() + timedelta(days=7) # dt will be a timestamp 7 days from now

        token = jwt.encode(
            {
                "sub": user_to_login.id,
                "exp": int(dt.strftime('%s'))
            },
            settings.SECRET_KEY,
            "HS256"
        )
        print("TOKEN ->", token)

        # send the token back to the user to save to local storage and apply to secure requests in the Authorization header
        return Response({ "token": token, "message": f"Welcome back {user_to_login.username}" })
