import 'request_model.dart';
import 'private_chat.dart';
import 'group_chat.dart';

class User{
  final String username;
  final String fullname;
  final String email;
  final bool isVerified;
  final String password;
  List<Request> sentRequest;
  List<Request> receivedRequest;
  List<User> friendsList;
  List<PrivateChat> privateChats;
  List<GroupChat> groupChats;

  User({
    this.username,
    this.fullname,
    this.email,
    this.isVerified,
    this.password
  });

  factory User.fromJSON(dynamic json){
    return User(json['username'] as String, json['Fullname'] as String, json['email'] as String, json['isVerified'] as bool, json['password'] as String);
  }
}