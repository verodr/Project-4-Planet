from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
User = get_user_model()
from rest_framework.exceptions import ValidationError # sends canned response to user for validation error
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    # first thing we want to do is make sure that when we serialize data (queryset -> python data) we don't want to include the password or passwordConfirmation
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    # validate method is executed when is_valid is executed on the serializer
    # this validate method will contain custom validation and can contain whatever validation you feel is necessary
    # 1. Check password matches password_confirmation
    # 2. We want to check the password meets the minimum standard / strong password
    # 3. hash the password to be stored in the database
    def validate(self, data):

        # remove password and password confirmation from the data object, and store them in variables
        # later we'll add password back to the data object, but hashed, leaving password_confirmation off because we don't want to save this to the database
        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        # do password and password_confirmation match?
        # ValidationError will send a canned response just like NotFound does. We will provide detail about the error that occurred
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
        fields = ('id', 'email', 'username', 'profile_image', 'password', 'password_confirmation')