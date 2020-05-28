import 'package:flutter/material.dart';
import 'ChatPage.dart';
import 'signup.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(MyMaterial());

class MyMaterial extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    bool usedhai = false;
    checkLogin().then((results) {
      usedhai = results;
    });
    if (usedhai) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        home: ChatPage(),
      );
    } else
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        home: SignupPage(),
      );
  }
}

Future<bool> checkLogin() async {
  final prefs = await SharedPreferences.getInstance();
  final isLogged = prefs.getBool('isLogged');
  if (isLogged == null) {
    return false;
  } else
    return true;
}
