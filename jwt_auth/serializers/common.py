from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
User = get_user_model()
from rest_framework.exceptions import ValidationError # sends canned response to user for validation error
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    # first thing we want to do is make sure that when we serialize data (queryset -> python data) we don't want to include the password or passwordConfirmation
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):

        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        if password != password_confirmation:
            raise ValidationError({
                "password_confirmation": "Does not match password"
            })
        
        # Implementing strong passwords
        password_validation.validate_password(password) #  this line is where the password will validated against any configured validators

        # Hash the password
        data['password'] = make_password(password)

        # Final thing we need to do, is to return the new version of the data object
        return data


    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'password_confirmation')