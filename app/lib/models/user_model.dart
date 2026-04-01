class UserModel {
  final int id;
  final String email;
  final String name;
  final String role;
  final List<String> permissions;

  const UserModel({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    required this.permissions,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as int,
      email: json['email'] as String,
      name: json['name'] as String,
      role: json['role'] as String,
      permissions: List<String>.from(json['permissions'] as List),
    );
  }

  bool hasPermission(String permission) => permissions.contains(permission);

  String get roleLabel => role[0].toUpperCase() + role.substring(1);
  String get initials => name.isNotEmpty ? name[0].toUpperCase() : '?';
}
