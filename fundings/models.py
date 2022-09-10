from django.db import models

# Create your models here.
class Funding(models.Model):
    text = models.TextField(max_length=300)
    current_amount = models.PositiveBigIntegerField(default=0)
    target_amount = models.PositiveBigIntegerField(default=None)
    content = models.ForeignKey(
        "contents.Content",
        related_name="fundings",
        on_delete = models.CASCADE 
    )
    owner = models.ForeignKey(
        'jwt_auth.User',
        related_name="fundings",
        on_delete = models.CASCADE
    )