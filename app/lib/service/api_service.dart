import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:app/config/app_config.dart';

class ApiService {
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    final uri = Uri.parse('${AppConfig.baseUrl}/auth/login');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final body = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode == 200 || response.statusCode == 201) {
      return body;
    }

    throw Exception(
        body['message'] is List ? body['message'].join(', ') : body['message'] ?? 'Login failed');
  }

  static Future<Map<String, dynamic>> getProfile(String token) async {
    final uri = Uri.parse('${AppConfig.baseUrl}/auth/profile');
    final response = await http.get(
      uri,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }
    throw Exception('Session expired. Please login again.');
  }
}