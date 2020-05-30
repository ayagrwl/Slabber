import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/signup.dart';
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
        theme: ThemeData(
          primaryColor: Colors.lightBlue,
          accentColor: Color(0xFFFEF9EB),
        ),
        home: HomeScreen(),
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