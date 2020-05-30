import 'user_model.dart';
import 'message_model.dart';

class GroupChat {
  final String groupName;
  final User admin;
  List<User> members;
  List<Message> messages;

  GroupChat({
    this.groupName,
    this.admin,
  });
}