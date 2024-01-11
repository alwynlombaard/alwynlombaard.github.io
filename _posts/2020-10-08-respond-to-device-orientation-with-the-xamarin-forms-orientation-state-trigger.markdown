---
layout: post
title: "Respond to device orientation with the Xamarin.Forms Orientation State Trigger"
date: 2020-10-08 00:00:00 +0000
comments: true
categories: Xamarin
tags: Xamarin
author: Alwyn Lombaard
published: false
---

<span>
<a href="/images/notefinder_portrait.png" target="_blank"><img src="/images/notefinder_portrait.png" alt="Step 1" width="160"/></a><a href="/images/notefinder_landscape.png" target="_blank"><img style="margin:20px" src="/images/notefinder_landscape.png" alt="Step 1" height="160" /></a>
</span>

>screenshots on iPhone 6s device



 `OrientationStateTrigger` is a State Trigger in Xamarin.Forms to easily respond to device orientation changes. 

Below is an example of using it to set a `StackLayout` orientation based on the orientation of the device:

{% highlight xml%}
<StackLayout x:Name="mainStack">
    <VisualStateManager.VisualStateGroups>
    <VisualStateGroup Name="OrientationStates">
            <VisualState Name="Portrait">
                <VisualState.StateTriggers>
                <OrientationStateTrigger Orientation="Portrait"/>
                </VisualState.StateTriggers>
                <VisualState.Setters>
                <Setter Property="Orientation" Value="Vertical" />
                </VisualState.Setters>
            </VisualState>
            <VisualState Name="Landscape">
                <VisualState.StateTriggers>
                <OrientationStateTrigger Orientation="Landscape"/>
                </VisualState.StateTriggers>
                <VisualState.Setters>
                <Setter Property="Orientation" Value="Horizontal" />
                </VisualState.Setters>
            </VisualState>
    </VisualStateGroup>
    </VisualStateManager.VisualStateGroups>
    ...
</StackLayout>
{% endhighlight%}
 

