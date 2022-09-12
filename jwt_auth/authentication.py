from rest_framework.authentication import BasicAuthentication # this is the class we'll extend and create an authenticate method for our own custom authentication
from rest_framework.exceptions import PermissionDenied # canned response
from django.contrib.auth import get_user_model
from django.conf import settings # for our SECRET_KEY
import jwt

User = get_user_model()

# custom auth class
class JWTAuthentication(BasicAuthentication):

    # when the request hits this point, when a view has authentication enabled, it's looking for an authenticate method
    def authenticate(self, request):
        # 1. We need to check that the Authorization header exists
        print("HITS AUTHENTICATE MIDDLEWARE")
        header = request.headers.get('Authorization')
        print('<> Header ', header)
        if not header:
            return None

        # 2. We need to check that the header is valid (Is a bearer token)
        if not header.startswith('Bearer'):
            print("FAILED AT TOKEN SYNTAX")
            raise PermissionDenied("Invalid Token")

        # 3. remove the Bearer from the beginning, and save just the token to a variable
        token = header.replace('Bearer ', '')

        try:
            # 4. Attempt to decode the token
            # - first argument is the token
            # - second argument is the secret
            # - third argument is the algorithm used to decode
            # this will return a payload - e.g: { 'sub': 1 }
            payload = jwt.decode(token, settings.SECRET_KEY, ["HS256"])

            # 5. If decoded, we should have a sub - that sub is the user id and we'll use this to look for a user matching that id in the database
            user = User.objects.get(pk=payload.get('sub'))
        
        # The below exception will be thrown if the token fails to be decoded
        except jwt.exceptions.InvalidTokenError:
            print("FAILED AT TOKEN DECODE")
            raise PermissionDenied("Invalid Token")

        # The below will be thrown if the User is not found
        except User.DoesNotExist:
            print("FAILED AT USER LOOKUP")
            raise PermissionDenied("User not found")

        # 6. If the user is verified, authenticate method requires us to return a tuple (user, token)
        return (user, token)