---
layout: post
title: "Handling push notifications in Flutter with Firebase"
date: 2021-12-08 00:00:00 +0000
comments: true
categories: Flutter
tags: Flutter
author: Alwyn Lombaard
published: false
excerpt_separator: <!--more-->
---


Handling push notifications is not a straightforward task, unfortunately. So if you want to handle push notifications in iOS and Android there are a few factors to consider in `Flutter`, namely:

- Is the app in the foreground or background?
- If in the background, is the app in a running or terminated state?

These scenarios require specific handling in Flutter depending on the platform. 

<!--more-->

## Background ##

You can find a guide to set up push notifications in the Flutter documentation:

Overview:

[Installation and Initialization or FlutterFire](https://firebase.flutter.dev/docs/overview)

[How to use Cloud Messaging in Flutter](https://firebase.flutter.dev/docs/messaging/usage)


## My solution to setting up push notification handling ##

Below is a `Dart` code extract that sums up how I approached the setting up and handling of push notifications in `Flutter` for both iOS and Android appications in the following states:

- Foreground
- Background (app still running)
- Terminated (app not running)

The requirement is that in all of these states a push notification message should be handled in the same way.

```dart
Future<void> setupPushNotifications() async {
    await FirebaseMessaging.instance.subscribeToTopic('general');

    //handle background messages while app is running
    FirebaseMessaging.onMessageOpenedApp.listen(_handlePushNotificationMessage);

    //handle messages that caused the app to launch
    RemoteMessage? initialMessage =
        await FirebaseMessaging.instance.getInitialMessage();

    if (initialMessage != null) {
      _handlePushNotificationMessage(initialMessage,
          isFromTerminatedState: true);
    }

    //foreground messages ios
    await FirebaseMessaging.instance
        .setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );

    //foreground messages android
    if (Platform.isAndroid) {
      const AndroidNotificationChannel channel = AndroidNotificationChannel(
          'myapp_channel', 'myapp_ Notifications',
          description: 'This channel is used for MyApp notifications.',
          importance: Importance.max);

      final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
          FlutterLocalNotificationsPlugin();

      await flutterLocalNotificationsPlugin
          .resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>()
          ?.createNotificationChannel(channel);

      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        RemoteNotification? notification = message.notification;
        AndroidNotification? android = message.notification?.android;

        if (notification != null && android != null) {
          flutterLocalNotificationsPlugin.show(
              notification.hashCode,
              notification.title,
              notification.body,
              NotificationDetails(
                android: AndroidNotificationDetails(
                  channel.id,
                  channel.name,
                  channelDescription: channel.description,
                  icon: 'ic_notification',
                ),
              ));
        }
      });
    }
  }

```

```dart
void _handlePushNotificationMessage(RemoteMessage message,
      {isFromTerminatedState = false}) async {
    log('FCM message handled');
  }
```

## Packages required ##

```shell
flutter pub add firebase_core

flutter pub add firebase_messaging

flutter pub add flutter_local_notifications

```


```dart
import 'package:firebase_core/firebase_core.dart';

import 'package:firebase_messaging/firebase_messaging.dart';

import 'package:flutter_local_notifications/flutter_local_notifications.dart';
```

## Firebase Initialization ##
I opted to use a `FutureBuilder` for Firebase initialization. This allows to handle error cases and also to display an activity indicator to the user while initialization is taking place.

```dart
@override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _initializeFirebase,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          log('Could not initialise firebase');
          return _buildScaffold();
        }
        if (snapshot.connectionState == ConnectionState.done) {
          setupPushNotifications();
          return _buildScaffold();
        }
        return const Center(
            child: SizedBox(
                height: 60, width: 60, child: CircularProgressIndicator()));
      },
    );
  }
```

```dart
final Future<void> _initializeFirebase = Firebase.initializeApp();
```

```dart
Scaffold _buildScaffold() {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const <Widget>[
            Text(
              'My App',
            ),
          ],
        ),
      ),
    );
  }
```

## Ensure Widgets are initialized  ##

```dart
void main() {
  WidgetsFlutterBinding.ensureInitialized;
  runApp(const MyApp());
}

```


```dart
class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  _MyAppState createState() => _MyAppState();
}
```

## Request permisson ##
Request permission from the user to send push notifications. Ask for this at the appropriate time. It could be at app start, but in some cases only after successful user login.

```dart
Future<void> requestPushNotificationPermission() async {
    FirebaseMessaging messaging = FirebaseMessaging.instance;

    NotificationSettings settings = await messaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );
    log('User granted permission: ${settings.authorizationStatus}');

    var token = await messaging.getToken();
    log('FCM Device Token: $token');
  }

```

## Obtaining the device token ##

In order to trigger push notifications to individual user devices, you need to obtain and store the device token for the user in your back end data store. Here is how to obtain the token.

```dart
Future<bool> saveDeviceTokenForUser(String userId) async {
    var token = await FirebaseMessaging.instance.getToken();

    if (token == null) return false;

    //save token
    ...
  }
```



