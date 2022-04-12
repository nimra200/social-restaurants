# Generated by Django 4.0.1 on 2022-03-07 04:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0003_remove_restaurant_followers'),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='following',
            field=models.ManyToManyField(related_name='followers', to='restaurants.Restaurant'),
        ),
    ]