import 'user_model.dart';
import 'message_model.dart';

class PrivateChat{
  final User person1;
  final User person2;
  List<Message> messages;

  PrivateChat({
    this.person1,
    this.person2,
    this.messages,
  });
}