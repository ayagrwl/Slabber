import 'user_model.dart';

class Request {
  final User sender;
  final User receiver;
  final DateTime now;

  Request({
    this.sender,
    this.receiver,
    this.now,
  });
}