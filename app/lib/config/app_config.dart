import 'package:flutter/foundation.dart';

class AppConfig {
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000';
    }
    // Android emulator routes to host machine via 10.0.2.2
    return 'http://10.0.2.2:3000';
  }
}
