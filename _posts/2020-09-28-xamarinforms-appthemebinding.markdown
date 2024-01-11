---
layout: post
title: "Xamarin.Forms AppThemeBinding markup extension"
date: 2020-09-28 00:00:00 +0000
comments: true
categories: Xamarin
tags: Xamarin
author: Alwyn Lombaard
published: false
---
I really like the new `AppThemeBinding` markup extension in Xamarin.Forms to easily handle Dark and Light modes on the mobile device. It can be used in combination with the `StaticResource` markup extension.

Below is an example:

{% highlight xml%}
BackgroundColor="{AppThemeBinding
        Light={StaticResource LightBackgroundColor},
        Dark={StaticResource DarkBackgroundColor}}"
{% endhighlight%}

{% highlight xml%}
<ContentPage.Resources>
    <Color x:Key="LightBackgroundColor">WhiteSmoke</Color>
    <Color x:Key="DarkBackgroundColor">Black</Color>
</ContentPage.Resources>
{% endhighlight%}

>screen recording on iPhone Simulator
<video width="300" controls>
   <source src="/video/appthemebinding.mov" type="video/mp4">
</video> 