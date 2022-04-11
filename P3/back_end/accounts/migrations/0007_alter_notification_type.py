# Generated by Django 4.0.1 on 2022-03-15 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_notification_restaurant_alter_notification_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='type',
            field=models.CharField(choices=[('Like', 'Like'), ('Comment', 'Comment'), ('Follow', 'Follow'), ('Post', 'Post'), ('Update', 'Update')], max_length=200),
        ),
    ]
