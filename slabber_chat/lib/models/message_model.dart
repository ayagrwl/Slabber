import 'user_model.dart';

class Message {
  final User sender;
  final String message;
  final DateTime createdAt;
  bool isLiked = false;
  
  Message({
    this.sender,
    this.message,
    this.createdAt,
  });

  factory Message.fromJSON(dynamic json){
    return Message(User.fromJSON(json['sender']), json['message'] as String, json['createdAt'] as DateTime, false);
  }
}