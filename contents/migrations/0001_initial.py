# Generated by Django 4.1.1 on 2022-09-08 10:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Content',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True)),
                ('full_name', models.CharField(default=None, max_length=50)),
                ('location', models.CharField(default=None, max_length=50)),
                ('description', models.TextField(default=None, max_length=300)),
            ],
        ),
    ]
