from django.db import models

# Create your models here.
class Content(models.Model):
    created_at = models.DateField(auto_now_add=True)
    full_name = models.CharField(max_length=50, default=None)
    location = models.CharField(max_length=50, default=None)
    description = models.TextField(max_length=300, default=None)
    photo = models.ImageField(null=True, blank=True)
    categories = models.ManyToManyField(
        "categories.Category",
        related_name = "contents"
    )

    def __str__(self):
        return f"{self.created_at} - {self.location} - {self.description} - {self.full_name}"
