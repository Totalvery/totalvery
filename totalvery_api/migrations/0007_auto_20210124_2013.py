# Generated by Django 3.1.5 on 2021-01-24 20:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('totalvery_api', '0006_auto_20210112_0052'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='lat',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='customer',
            name='lon',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='customer',
            name='location',
            field=models.CharField(default=' ', max_length=100),
        ),
    ]
