from django.db import models
from cloudinary.models import CloudinaryField


# Create your models here.
class Content(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    full_name = models.CharField(max_length=50, default=None)
    location = models.CharField(max_length=50, default=None)
    description = models.TextField(max_length=300, default=None)
    image = CloudinaryField('image')
    categories = models.ManyToManyField(
        "categories.Category",
        related_name = "contents",
        blank=True
    )


    def __str__(self):
        return f"{self.created_at} - {self.location} - {self.description} - {self.full_name}"
