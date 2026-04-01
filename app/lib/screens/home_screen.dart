import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class _Perm {
  final String key;
  final String label;
  final IconData icon;
  final Color color;
  const _Perm(this.key, this.label, this.icon, this.color);
}

const _permissions = [
  _Perm('view_dashboard', 'View Dashboard', Icons.dashboard_rounded,
      Color(0xFF6C63FF)),
  _Perm('manage_users', 'Manage Users', Icons.group_rounded, Color(0xFFE57373)),
  _Perm('view_reports', 'View Reports', Icons.bar_chart_rounded,
      Color(0xFF4FC3F7)),
  _Perm('edit_content', 'Edit Content', Icons.edit_rounded, Color(0xFFFFB74D)),
  _Perm('delete_content', 'Delete Content', Icons.delete_outline_rounded,
      Color(0xFFEF9A9A)),
  _Perm('view_analytics', 'View Analytics', Icons.analytics_rounded,
      Color(0xFF80CBC4)),
];

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user!;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F0F1A),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(user.name,
                style:
                    const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            Text(user.role,
                style: TextStyle(fontSize: 11, color: Colors.grey[500])),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, size: 20),
            onPressed: auth.logout,
            tooltip: 'Logout',
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.count(
          crossAxisCount: 2,
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 2.4,
          children: _permissions.map((p) {
            final granted = auth.hasPermission(p.key);
            debugPrint('Permission ${p.key}: $granted for user ${user.email}');
            return _PermChip(perm: p, granted: granted);
          }).toList(),
        ),
      ),
    );
  }
}

class _PermChip extends StatelessWidget {
  final _Perm perm;
  final bool granted;

  const _PermChip({required this.perm, required this.granted});

  @override
  Widget build(BuildContext context) {
    final color = granted ? perm.color : Colors.grey[800]!;

    return AnimatedOpacity(
      duration: const Duration(milliseconds: 250),
      opacity: granted ? 1.0 : 0.45,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: granted
              ? perm.color.withValues(alpha: 0.08)
              : const Color(0xFF141420),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: granted
                ? perm.color.withValues(alpha: 0.35)
                : const Color(0xFF252535),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(perm.icon, size: 20, color: color),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                perm.label,
                style: TextStyle(
                  fontSize: 14,
                  color: granted ? Colors.white : Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Container(
              width: 7,
              height: 7,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: granted ? perm.color : Colors.grey[800],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
