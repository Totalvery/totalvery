# Generated by Django 3.1.5 on 2021-01-29 04:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('totalvery_api', '0006_auto_20210112_0052'),
    ]

    operations = [
        migrations.AddField(
            model_name='storedetail',
            name='location',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
