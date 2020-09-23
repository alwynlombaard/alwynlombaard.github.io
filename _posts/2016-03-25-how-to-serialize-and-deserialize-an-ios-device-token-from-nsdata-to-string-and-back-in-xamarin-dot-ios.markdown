---
layout: post
title: "How to serialize and deserialize an iOS device token from NSData to String and back in Xamarin.iOS"
date: 2016-03-25 18:28:08 +0000
comments: true
categories: Xamarin
tags: Xamarin iOS programming C#
author: Alwyn Lombaard
---

Obtain the device token as usual when the user opts in to receive remote push notifications. Then convert it to a base64 string that can be stored and used later.

Here's how to do it. In your app delegate:


	public override void RegisteredForRemoteNotifications(UIApplication application, NSData deviceToken)
	{
		var tokenStringBase64 = deviceToken.GetBase64EncodedString(NSDataBase64EncodingOptions.None);
		//now you can store it for later use in local storage
	}
	
To convert it back into an NSData object that you can send to third parties (like MixPanel and ExactTarget) that require  the token as NSData:
	
	var deviceToken = new NSData(tokenStringBase64, NSDataBase64DecodingOptions.None);
	
	Mixpanel.SharedInstance.People.AddPushDeviceToken(deviceToken);
	
	ETPush.PushManager.RegisterDeviceToken(deviceToken);
	
	
	




