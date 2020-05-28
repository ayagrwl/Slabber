import 'package:flutter/material.dart';
//import 'package:real_chat_flutter/ChatPage.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(MyMaterial());

class MyMaterial extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var _controller = new TextEditingController();


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login Page'),
      ),
      body: ListView(
        children: <Widget>[
          new ListTile(
            title: new TextField(
              controller: _controller,  
            ),
          ),
          new ListTile(
            title: RaisedButton(
              child: new Text('Enter'),
              onPressed: () {},
            ),
          ),
        ],
      ),
    );
  }
}

Future<bool> savedNamePreference(String name) async{
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString("name", name);

  return prefs.commit();
}

Future